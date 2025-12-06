// src/app/services/pages/application/inventory/stock-card.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { BaseActionService } from '../../../shared/base-action';
import { NotificationService } from './notification.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StockCardService extends BaseActionService<InventoryModel.StockCard> {
    private databaseService = inject(DatabaseService);
    private notificationService = inject(NotificationService);

    protected override table = this.databaseService.db.stock_cards;

    /**
     * Add stock card dan update product stock per warehouse
     */
    addStockCard(
        product_id: number,
        warehouse_id: number,
        type: InventoryModel.StockCard['type'],
        qty: number,
        reference_type?: string,
        reference_id?: number,
        notes?: string,
        unit_cost?: number,
        batch_number?: string,
        serial_number?: string
    ) {
        return this.withLoading(async () => {
            const product = await this.databaseService.db.products.get(Number(product_id));
            if (!product) throw new Error('Product not found');

            const warehouse = await this.databaseService.db.warehouses.get(Number(warehouse_id));
            if (!warehouse) throw new Error('Warehouse not found');

            // Calculate new balance per warehouse
            const lastCard = await this.databaseService.db.stock_cards
                .where('[product_id+warehouse_id]')
                .equals([product_id, warehouse_id])
                .reverse()
                .first();

            const current_balance = lastCard?.balance || 0;
            const qty_in = type === 'IN' ? qty : 0;
            const qty_out = type === 'OUT' || type === 'ADJUSTMENT' ? qty : 0;
            const new_balance = current_balance + qty_in - qty_out;

            if (new_balance < 0) {
                throw new Error(`Insufficient stock in warehouse ${warehouse.name}. Available: ${current_balance}`);
            }

            // Create stock card
            const stock_card: InventoryModel.StockCard = {
                product_id,
                warehouse_id,
                transaction_date: new Date(),
                type,
                reference_type,
                reference_id,
                qty_in,
                qty_out,
                balance: new_balance,
                unit_cost,
                total_value: unit_cost ? qty * unit_cost : undefined,
                batch_number,
                serial_number,
                notes,
                created_at: new Date()
            };

            const id = await this.databaseService.db.stock_cards.add(stock_card as any);

            // Update product warehouse stock
            await this.updateProductWarehouseStock(product_id, warehouse_id, new_balance);

            // Update total product stock (sum all warehouses)
            await this.updateTotalProductStock(product_id);

            // Check low stock notification
            await this.checkLowStockNotification(product_id, warehouse_id);

            return id;
        });
    }

    /**
     * Update product warehouse stock
     */
    private async updateProductWarehouseStock(product_id: number, warehouse_id: number, quantity: number) {
        const product = await this.databaseService.db.products.get(Number(product_id));
        if (!product) throw new Error('Product not found');

        let tracking_type: 'BATCH' | 'SERIAL' | 'GENERAL' = 'GENERAL';
        if (product.is_batch_tracked) {
            tracking_type = 'BATCH';
        } else if (product.is_serial_tracked) {
            tracking_type = 'SERIAL';
        }

        const existing = await this.databaseService.db.product_warehouse_stock
            .where('[product_id+warehouse_id]')
            .equals([product_id, warehouse_id])
            .first();

        if (existing) {
            let updateData: any = {
                updated_at: new Date()
            };

            // Update based on tracking type
            if (tracking_type === 'BATCH') {
                updateData.batch_quantity = quantity;
            } else if (tracking_type === 'SERIAL') {
                updateData.serial_quantity = quantity;
            } else {
                updateData.general_quantity = quantity;
            }

            // Recalculate total
            updateData.total_stock = (existing.batch_quantity || 0) +
                (existing.serial_quantity || 0) +
                (existing.general_quantity || 0);

            await this.databaseService.db.product_warehouse_stock.update(existing.id!, updateData);
        } else {
            const newStock: InventoryModel.ProductWarehouseStock = {
                product_id,
                warehouse_id,
                total_stock: quantity,
                batch_quantity: tracking_type === 'BATCH' ? quantity : 0,
                serial_quantity: tracking_type === 'SERIAL' ? quantity : 0,
                general_quantity: tracking_type === 'GENERAL' ? quantity : 0,
                updated_at: new Date()
            };

            await this.databaseService.db.product_warehouse_stock.add(newStock as any);
        }
    }

    /**
     * Update total product stock (sum all warehouses)
     */
    private async updateTotalProductStock(product_id: number) {
        const warehouseStocks = await this.databaseService.db.product_warehouse_stock
            .where('product_id')
            .equals(product_id)
            .toArray();

        const total_stock = warehouseStocks.reduce((sum, ws) => sum + (ws.total_stock || 0), 0);

        await this.databaseService.db.products.update(Number(product_id), {
            current_stock: total_stock,
            updated_at: new Date()
        });
    }

    /**
     * Get stock cards by product (all warehouses)
     */
    getStockCardsByProduct(product_id: string, limit?: number) {
        return this.withLoading(async () => {
            const query = this.databaseService.db.stock_cards
                .where('product_id')
                .equals(product_id);

            const cards = limit
                ? await query.reverse().limit(limit).toArray()
                : await query.reverse().toArray();

            return cards;
        });
    }

    /**
     * Get stock cards by product and warehouse
     */
    getStockCardsByProductAndWarehouse(product_id: number, warehouse_id: number) {
        return this.withLoading(async () => {
            const data = await this.databaseService.db.stock_cards
                .where('product_id')
                .equals(product_id)
                // .filter(item => item.warehouse_id == warehouse_id)
                .toArray();

            return data;
        });
    }

    /**
     * Get current stock by warehouse
     */
    getStockByWarehouse(product_id: number, warehouse_id: number) {
        return this.withLoading(async () => {
            const warehouseStock = await this.databaseService.db.product_warehouse_stock
                .where('[product_id+warehouse_id]')
                .equals([product_id, warehouse_id])
                .first();

            return warehouseStock?.total_stock || 0;
        });
    }

    /**
     * Get stock movements by date range
     */
    getStockMovementsByDateRange(start_date: Date, end_date: Date) {
        return this.withLoading(async () => {
            const cards = await this.databaseService.db.stock_cards
                .where('transaction_date')
                .between(start_date, end_date, true, true)
                .toArray();

            return cards;
        });
    }

    private async checkLowStockNotification(product_id: number, warehouse_id: number) {
        const product = await this.databaseService.db.products.get(Number(product_id));
        if (!product) return;

        const warehouse = await this.databaseService.db.warehouses.get(Number(warehouse_id));
        if (!warehouse) return;

        const warehouseStock = await this.databaseService.db.product_warehouse_stock
            .where('[product_id+warehouse_id]')
            .equals([product_id, warehouse_id])
            .first();

        const currentStock = warehouseStock?.total_stock || 0;
        const minStock = product.min_stock;
        const reorderPoint = product.reorder_point;

        if (currentStock <= minStock) {
            await firstValueFrom(this.notificationService.add({
                type: 'LOW_STOCK',
                priority: 'HIGH',
                title: 'Stok Menipis',
                message: `${product.name} di ${warehouse.name} tersisa ${currentStock} ${product.unit}`,
                product_id: product.id!.toString(),
                link: `/inventory/products/${product.id}`
            } as any))
        }

        // Check reorder point
        if (reorderPoint && currentStock <= reorderPoint) {
            await firstValueFrom(this.notificationService.add({
                type: 'REORDER_POINT',
                priority: 'URGENT',
                title: 'Reorder Point Tercapai',
                message: `${product.name} di ${warehouse.name} sudah mencapai reorder point. Segera lakukan pengadaan.`,
                product_id: product.id!.toString(),
                link: `/inventory/procurement/create?product_id=${product.id}`
            } as any));
        }
    }


}