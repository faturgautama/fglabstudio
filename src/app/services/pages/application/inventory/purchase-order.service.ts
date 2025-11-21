// src/app/services/pages/application/inventory/purchase-order.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { BaseActionService } from '../../../shared/base-action';
import { StockCardService } from './stock-card.service';
import { ProductBatchService } from './product-batch.service';
import { ProductSerialService } from './product-serial.service';

@Injectable({ providedIn: 'root' })
export class PurchaseOrderService extends BaseActionService<InventoryModel.PurchaseOrder> {
    private databaseService = inject(DatabaseService);
    private stockCardService = inject(StockCardService);
    private productBatchService = inject(ProductBatchService);
    private productSerialService = inject(ProductSerialService);

    protected override table = this.databaseService.db.purchase_orders;

    /**
     * Generate PO Number
     */
    generatePONumber() {
        return this.withLoading(async () => {
            const year = new Date().getFullYear();
            const month = String(new Date().getMonth() + 1).padStart(2, '0');
            const count = await this.databaseService.db.purchase_orders.count();

            return `PO/${year}${month}/${String(count + 1).padStart(4, '0')}`;
        });
    }

    /**
     * Create PO with items
     */
    createPurchaseOrder(
        po: Omit<InventoryModel.PurchaseOrder, 'id' | 'created_at' | 'updated_at'>,
        items: Omit<InventoryModel.PurchaseOrderItem, 'id' | 'purchase_order_id'>[]
    ) {
        return this.withLoading(async () => {
            // Add PO
            const po_data: any = {
                ...po,
                created_at: new Date(),
                updated_at: new Date(),
                is_active: true
            };

            const po_id = await this.databaseService.db.purchase_orders.add(po_data);

            // Add PO Items
            const po_items = items.map(item => ({
                ...item,
                purchase_order_id: po_id.toString(),
                subtotal: item.qty_ordered * item.unit_price
            }));

            await this.databaseService.db.purchase_order_items.bulkAdd(po_items as any);

            return po_id;
        });
    }

    /**
     * Receive PO (full or partial) with dynamic batch/serial tracking
     */
    receivePurchaseOrder(
        po_id: number,
        items: {
            id: number;
            qty_received: number;
            batch_number?: string;
            expiry_date?: Date;
            serial_numbers?: string[];
        }[]
    ) {
        return this.withLoading(async () => {
            const po = await this.databaseService.db.purchase_orders.get(Number(po_id));
            if (!po) throw new Error('Purchase Order not found');

            // Process each item
            for (const item of items) {
                const po_item = await this.databaseService.db.purchase_order_items.get(Number(item.id));
                if (!po_item) continue;

                // Get product to check tracking settings
                const product = await this.databaseService.db.products.get(Number(po_item.product_id));
                if (!product) throw new Error(`Product not found for item ${item.id}`);

                // ✅ VALIDATION: Batch Tracking
                if (product.is_batch_tracked) {
                    if (!item.batch_number) {
                        throw new Error(`Product "${product.name}" requires batch number`);
                    }
                    // Optional: validate expiry date for perishable items
                    if (product.is_perishable && !item.expiry_date) {
                        throw new Error(`Product "${product.name}" requires expiry date`);
                    }
                }

                // ✅ VALIDATION: Serial Tracking
                if (product.is_serial_tracked) {
                    if (!item.serial_numbers || item.serial_numbers.length === 0) {
                        throw new Error(`Product "${product.name}" requires serial numbers`);
                    }
                    if (item.serial_numbers.length !== item.qty_received) {
                        throw new Error(`Product "${product.name}" requires ${item.qty_received} serial numbers, but ${item.serial_numbers.length} provided`);
                    }

                    // Validate serial uniqueness
                    const validation = await this.productSerialService.validateSerialNumbers(item.serial_numbers);
                    if (!validation.valid) {
                        throw new Error(`Serial validation failed: ${validation.errors.join(', ')}`);
                    }
                }

                // Update PO item qty_received
                const new_qty_received = po_item.qty_received + item.qty_received;
                await this.databaseService.db.purchase_order_items.update(Number(item.id), {
                    qty_received: new_qty_received,
                    batch_number: item.batch_number,
                    expiry_date: item.expiry_date,
                    serial_numbers: item.serial_numbers
                });

                // ✅ SAVE BATCH if batch tracked
                if (product.is_batch_tracked && item.batch_number) {
                    const batchData: any = {
                        product_id: po_item.product_id!.toString(),
                        batch_number: item.batch_number,
                        expiry_date: item.expiry_date,
                        quantity: item.qty_received,
                        purchase_order_id: po_id.toString(),
                        cost_per_unit: po_item.unit_price,
                        is_active: true,
                        created_at: new Date()
                    };

                    await this.databaseService.db.product_batches.add(batchData);
                }

                // ✅ SAVE SERIALS if serial tracked
                if (product.is_serial_tracked && item.serial_numbers) {
                    const serials = item.serial_numbers.map((sn: string) => ({
                        product_id: po_item.product_id,
                        serial_number: sn,
                        batch_number: item.batch_number,
                        status: 'IN_STOCK' as const,
                        purchase_order_id: po_id.toString(),
                        created_at: new Date()
                    }));

                    await this.databaseService.db.product_serials.bulkAdd(serials as any);
                }

                // ✅ ADD TO STOCK CARD
                const notes = [];
                if (item.batch_number) notes.push(`Batch: ${item.batch_number}`);
                if (item.serial_numbers) notes.push(`Serials: ${item.serial_numbers.length} units`);

                await this.stockCardService.addStockCard(
                    po_item.product_id!,
                    'IN',
                    item.qty_received,
                    'PURCHASE_ORDER',
                    po_id,
                    `Receive PO ${po.po_number}${notes.length > 0 ? ' - ' + notes.join(', ') : ''}`,
                    po_item.unit_price
                );
            }

            // Check if all items fully received
            const all_items = await this.databaseService.db.purchase_order_items
                .where('purchase_order_id')
                .equals(po_id.toString())
                .toArray();

            const all_received = all_items.every(item => item.qty_received >= item.qty_ordered);
            const partial_received = all_items.some(item => item.qty_received > 0);

            const new_status = all_received ? 'RECEIVED' : (partial_received ? 'PARTIAL' : 'SUBMITTED');

            // Update PO status
            await this.databaseService.db.purchase_orders.update(Number(po_id), {
                status: new_status,
                received_date: all_received ? new Date() : undefined,
                updated_at: new Date()
            });

            return new_status;
        });
    }

    /**
     * Get PO with items
     */
    getPurchaseOrderWithItems(po_id: string) {
        return this.withLoading(async () => {
            const po = await this.databaseService.db.purchase_orders.get(Number(po_id));
            if (!po) return null;

            const items = await this.databaseService.db.purchase_order_items
                .where('purchase_order_id')
                .equals(po_id)
                .toArray();

            // Resolve product info
            const items_with_product = await Promise.all(
                items.map(async (item) => {
                    const product = await this.databaseService.db.products.get(Number(item.product_id));
                    return { ...item, product };
                })
            );

            return { ...po, items: items_with_product };
        });
    }
}