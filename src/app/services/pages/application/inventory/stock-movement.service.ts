// src/app/services/pages/application/inventory/stock-movement.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { BaseActionService } from '../../../shared/base-action';
import { StockCardService } from './stock-card.service';
import { ProductWarehouseStockService } from './product-warehouse-stock.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StockMovementService extends BaseActionService<InventoryModel.StockMovement> {
    private databaseService = inject(DatabaseService);
    private stockCardService = inject(StockCardService);
    private productWarehouseStockService = inject(ProductWarehouseStockService);

    protected override table = this.databaseService.db.stock_movements;

    /**
    * Generate movement number (for use in Store/Component - returns Observable)
    */
    generateMovementNumber(type: string) {
        return this.withLoading(async () => {
            return await this.generateMovementNumberSync(type);
        });
    }

    /**
     * Generate movement number synchronously (for internal use)
     */
    private async generateMovementNumberSync(type: string): Promise<string> {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const count = await this.databaseService.db.stock_movements.count();

        const prefix = type === 'IN' ? 'SI' : type === 'OUT' ? 'SO' : 'SA';
        return `${prefix}/${year}${month}/${String(count + 1).padStart(4, '0')}`;
    }

    /**
     * Create stock movement dan update stock card
     * Enhanced with batch and serial tracking support
     */
    createStockMovement(movement: Omit<InventoryModel.StockMovement, 'id' | 'created_at'>) {
        return this.withLoading(async () => {
            // Validate warehouse
            if (!movement.warehouse_id) {
                throw new Error('Warehouse is required for stock movement');
            }

            const warehouse = await this.databaseService.db.warehouses.get(Number(movement.warehouse_id));
            if (!warehouse) throw new Error('Warehouse not found');

            // Get product to check tracking type
            const product = await this.databaseService.db.products.get(Number(movement.product_id));
            if (!product) throw new Error('Product not found');

            // For TRANSFER, validate both warehouses
            if (movement.type === 'TRANSFER') {
                if (!movement.warehouse_from || !movement.warehouse_to) {
                    throw new Error('Transfer requires both source and destination warehouse');
                }
                if (movement.warehouse_from === movement.warehouse_to) {
                    throw new Error('Source and destination warehouse must be different');
                }

                const warehouseFrom = await this.databaseService.db.warehouses.get(Number(movement.warehouse_from));
                const warehouseTo = await this.databaseService.db.warehouses.get(Number(movement.warehouse_to));

                if (!warehouseFrom || !warehouseTo) {
                    throw new Error('Invalid warehouse for transfer');
                }

                // Check stock availability in source warehouse
                const sourceStock = await firstValueFrom(
                    this.stockCardService.getStockByWarehouse(
                        movement.product_id,
                        movement.warehouse_from
                    )
                );

                if (sourceStock < movement.quantity) {
                    throw new Error(`Insufficient stock in ${warehouseFrom.name}. Available: ${sourceStock}`);
                }
            }

            // Handle batch tracking for IN movements
            let batch_id: number | undefined;
            if (movement.type === 'IN' && product.is_batch_tracked && movement.batch_number) {
                // Create or update batch record
                batch_id = await this.createBatchRecord(
                    movement.product_id,
                    movement.warehouse_id,
                    movement.batch_number,
                    movement.quantity,
                    movement.expiry_date,
                    movement.reference_id ? Number(movement.reference_id) : undefined
                );

                // Update batch_quantity in product_warehouse_stock
                await this.productWarehouseStockService.updateBatchQuantity(
                    movement.product_id,
                    movement.warehouse_id,
                    movement.quantity,
                    'ADD'
                );
            }

            // Handle serial tracking for IN movements
            let serial_ids: number[] | undefined;
            if (movement.type === 'IN' && product.is_serial_tracked && movement.serial_numbers) {
                // Validate quantity matches serial count
                if (movement.quantity !== movement.serial_numbers.length) {
                    throw new Error(`Quantity (${movement.quantity}) must match serial count (${movement.serial_numbers.length})`);
                }

                // Create serial records
                serial_ids = await this.createSerialRecords(
                    movement.product_id,
                    movement.warehouse_id,
                    movement.serial_numbers,
                    movement.batch_number,
                    movement.reference_id ? Number(movement.reference_id) : undefined
                );

                // Update serial_quantity in product_warehouse_stock
                await this.productWarehouseStockService.updateSerialQuantity(
                    movement.product_id,
                    movement.warehouse_id,
                    movement.serial_numbers.length,
                    'ADD'
                );
            }

            // Handle batch tracking for OUT movements
            if (movement.type === 'OUT' && product.is_batch_tracked && movement.batch_number) {
                // Validate batch availability
                await this.validateBatchAvailability(
                    movement.product_id,
                    movement.warehouse_id,
                    movement.batch_number,
                    movement.quantity
                );

                // Get batch to update
                const batch = await this.databaseService.db.product_batches
                    .where('[product_id+warehouse_id]')
                    .equals([Number(movement.product_id), Number(movement.warehouse_id)])
                    .and(b => b.batch_number === movement.batch_number && b.is_active)
                    .first();

                if (batch) {
                    batch_id = batch.id;
                    // Decrement batch quantity
                    await this.updateBatchQuantity(batch.id!, movement.quantity, 'SUBTRACT');

                    // Update batch_quantity in product_warehouse_stock
                    await this.productWarehouseStockService.updateBatchQuantity(
                        movement.product_id,
                        movement.warehouse_id,
                        movement.quantity,
                        'SUBTRACT'
                    );
                }
            }

            // Handle serial tracking for OUT movements
            if (movement.type === 'OUT' && product.is_serial_tracked && movement.serial_numbers) {
                // Validate quantity matches serial count
                if (movement.quantity !== movement.serial_numbers.length) {
                    throw new Error(`Quantity (${movement.quantity}) must match serial count (${movement.serial_numbers.length})`);
                }

                // Validate serial availability and status
                await this.validateSerialAvailability(
                    movement.product_id,
                    movement.warehouse_id,
                    movement.serial_numbers
                );

                // Get serial IDs
                const serials = await this.databaseService.db.product_serials
                    .where('[product_id+warehouse_id]')
                    .equals([Number(movement.product_id), Number(movement.warehouse_id)])
                    .and(s => movement.serial_numbers!.includes(s.serial_number) && s.status === 'IN_STOCK')
                    .toArray();

                serial_ids = serials.map(s => s.id!);

                // Update serial status to SOLD
                await this.updateSerialStatus(serial_ids, 'SOLD');

                // Update serial_quantity in product_warehouse_stock
                await this.productWarehouseStockService.updateSerialQuantity(
                    movement.product_id,
                    movement.warehouse_id,
                    movement.serial_numbers.length,
                    'SUBTRACT'
                );
            }

            // Handle batch tracking for TRANSFER movements
            if (movement.type === 'TRANSFER' && product.is_batch_tracked && movement.batch_number) {
                // Validate batch availability in source
                await this.validateBatchAvailability(
                    movement.product_id,
                    movement.warehouse_from!,
                    movement.batch_number,
                    movement.quantity
                );

                // Get source batch
                const sourceBatch = await this.databaseService.db.product_batches
                    .where('[product_id+warehouse_id]')
                    .equals([Number(movement.product_id), Number(movement.warehouse_from)])
                    .and(b => b.batch_number === movement.batch_number && b.is_active)
                    .first();

                if (sourceBatch) {
                    // Transfer batch
                    await this.transferBatch(
                        sourceBatch.id!,
                        movement.warehouse_from!,
                        movement.warehouse_to!,
                        movement.quantity
                    );

                    // Update batch_quantity in both warehouses
                    await this.productWarehouseStockService.updateBatchQuantity(
                        movement.product_id,
                        movement.warehouse_from!,
                        movement.quantity,
                        'SUBTRACT'
                    );

                    await this.productWarehouseStockService.updateBatchQuantity(
                        movement.product_id,
                        movement.warehouse_to!,
                        movement.quantity,
                        'ADD'
                    );
                }
            }

            // Handle serial tracking for TRANSFER movements
            if (movement.type === 'TRANSFER' && product.is_serial_tracked && movement.serial_numbers) {
                // Validate quantity matches serial count
                if (movement.quantity !== movement.serial_numbers.length) {
                    throw new Error(`Quantity (${movement.quantity}) must match serial count (${movement.serial_numbers.length})`);
                }

                // Validate serial availability in source
                await this.validateSerialAvailability(
                    movement.product_id,
                    movement.warehouse_from!,
                    movement.serial_numbers
                );

                // Get serial IDs from source warehouse
                const serials = await this.databaseService.db.product_serials
                    .where('[product_id+warehouse_id]')
                    .equals([Number(movement.product_id), Number(movement.warehouse_from)])
                    .and(s => movement.serial_numbers!.includes(s.serial_number) && s.status === 'IN_STOCK')
                    .toArray();

                serial_ids = serials.map(s => s.id!);

                // Transfer serials to destination warehouse
                await this.transferSerials(
                    serial_ids,
                    movement.warehouse_from!,
                    movement.warehouse_to!
                );

                // Update serial_quantity in both warehouses
                await this.productWarehouseStockService.updateSerialQuantity(
                    movement.product_id,
                    movement.warehouse_from!,
                    movement.serial_numbers.length,
                    'SUBTRACT'
                );

                await this.productWarehouseStockService.updateSerialQuantity(
                    movement.product_id,
                    movement.warehouse_to!,
                    movement.serial_numbers.length,
                    'ADD'
                );
            }

            // Handle batch tracking for ADJUSTMENT movements
            if (movement.type === 'ADJUSTMENT' && product.is_batch_tracked && movement.batch_number) {
                // Get batch
                const batch = await this.databaseService.db.product_batches
                    .where('[product_id+warehouse_id]')
                    .equals([Number(movement.product_id), Number(movement.warehouse_id)])
                    .and(b => b.batch_number === movement.batch_number)
                    .first();

                if (batch) {
                    batch_id = batch.id;
                    // Determine if positive or negative adjustment based on reason or notes
                    const isPositive = movement.reason === 'CORRECTION' || movement.notes?.includes('→') &&
                        parseInt(movement.notes.split('→')[1]) > parseInt(movement.notes.split('→')[0]);

                    if (isPositive) {
                        // Positive adjustment - increment
                        await this.updateBatchQuantity(batch.id!, movement.quantity, 'ADD');
                        await this.productWarehouseStockService.updateBatchQuantity(
                            movement.product_id,
                            movement.warehouse_id,
                            movement.quantity,
                            'ADD'
                        );
                    } else {
                        // Negative adjustment - decrement
                        if (batch.quantity < movement.quantity) {
                            throw new Error(`Insufficient batch quantity for adjustment. Available: ${batch.quantity}, Required: ${movement.quantity}`);
                        }
                        await this.updateBatchQuantity(batch.id!, movement.quantity, 'SUBTRACT');
                        await this.productWarehouseStockService.updateBatchQuantity(
                            movement.product_id,
                            movement.warehouse_id,
                            movement.quantity,
                            'SUBTRACT'
                        );
                    }
                }
            }

            // Handle serial tracking for ADJUSTMENT movements
            if (movement.type === 'ADJUSTMENT' && product.is_serial_tracked && movement.serial_numbers) {
                // Determine if positive or negative adjustment
                const isPositive = movement.reason === 'CORRECTION' || movement.notes?.includes('→') &&
                    parseInt(movement.notes.split('→')[1]) > parseInt(movement.notes.split('→')[0]);

                if (isPositive) {
                    // Positive adjustment - create new serial records
                    serial_ids = await this.createSerialRecords(
                        movement.product_id,
                        movement.warehouse_id,
                        movement.serial_numbers,
                        movement.batch_number
                    );

                    await this.productWarehouseStockService.updateSerialQuantity(
                        movement.product_id,
                        movement.warehouse_id,
                        movement.serial_numbers.length,
                        'ADD'
                    );
                } else {
                    // Negative adjustment - update serial status to DAMAGED or LOST
                    await this.validateSerialAvailability(
                        movement.product_id,
                        movement.warehouse_id,
                        movement.serial_numbers
                    );

                    const serials = await this.databaseService.db.product_serials
                        .where('[product_id+warehouse_id]')
                        .equals([Number(movement.product_id), Number(movement.warehouse_id)])
                        .and(s => movement.serial_numbers!.includes(s.serial_number) && s.status === 'IN_STOCK')
                        .toArray();

                    serial_ids = serials.map(s => s.id!);

                    // Update status based on reason
                    const newStatus = movement.reason === 'DAMAGED' ? 'DAMAGED' : 'LOST';
                    await this.updateSerialStatus(serial_ids, newStatus);

                    await this.productWarehouseStockService.updateSerialQuantity(
                        movement.product_id,
                        movement.warehouse_id,
                        movement.serial_numbers.length,
                        'SUBTRACT'
                    );
                }
            }

            // Add movement
            const movement_data: any = {
                ...movement,
                batch_id,
                serial_ids,
                created_at: new Date(),
                is_active: true
            };

            const movement_id = await this.databaseService.db.stock_movements.add(movement_data);

            // Prepare serial numbers string for stock card
            const serial_numbers_str = movement.serial_numbers ? movement.serial_numbers.join(', ') : undefined;

            // Add to stock card based on type
            if (movement.type === 'TRANSFER') {
                // OUT from source warehouse
                await firstValueFrom(this.stockCardService.addStockCard(
                    movement.product_id,
                    movement.warehouse_from!,
                    'OUT',
                    movement.quantity,
                    'STOCK_MOVEMENT',
                    movement_id,
                    `Transfer to warehouse ${movement.warehouse_to}`,
                    movement.unit_cost,
                    movement.batch_number,
                    serial_numbers_str
                ));

                // IN to destination warehouse
                await firstValueFrom(this.stockCardService.addStockCard(
                    movement.product_id,
                    movement.warehouse_to!,
                    'IN',
                    movement.quantity,
                    'STOCK_MOVEMENT',
                    movement_id,
                    `Transfer from warehouse ${movement.warehouse_from}`,
                    movement.unit_cost,
                    movement.batch_number,
                    serial_numbers_str
                ));
            } else {
                // Regular IN/OUT/ADJUSTMENT with batch/serial reference
                await firstValueFrom(this.stockCardService.addStockCard(
                    movement.product_id,
                    movement.warehouse_id,
                    movement.type,
                    movement.quantity,
                    'STOCK_MOVEMENT',
                    movement_id,
                    movement.notes,
                    movement.unit_cost,
                    movement.batch_number,
                    serial_numbers_str
                ));
            }

            return movement_id;
        });
    }

    /**
     * Stock adjustment per warehouse
     */
    adjustStock(product_id: number, warehouse_id: number, new_quantity: number, reason: string, notes?: string) {
        return this.withLoading(async () => {
            const product = await this.databaseService.db.products.get(Number(product_id));
            if (!product) throw new Error('Product not found');

            const warehouse = await this.databaseService.db.warehouses.get(Number(warehouse_id));
            if (!warehouse) throw new Error('Warehouse not found');

            // Get current stock in warehouse
            const currentStock = await firstValueFrom(
                this.stockCardService.getStockByWarehouse(product_id, warehouse_id)
            );
            const difference = new_quantity - currentStock;

            // ✅ Generate movement number directly
            const movement_number = await this.generateMovementNumberSync('ADJUSTMENT');

            return await firstValueFrom(this.createStockMovement({
                movement_number,
                type: 'ADJUSTMENT',
                product_id,
                warehouse_id,
                quantity: Math.abs(difference),
                reason,
                notes: `${notes || ''} (${warehouse.name}: ${currentStock} → ${new_quantity})`,
                movement_date: new Date()
            }));
        });
    }

    /**
     * Create or update batch record for IN movements
     * Requirements: 1.2, 1.5, 1.6, 1.7
     */
    async createBatchRecord(
        product_id: number,
        warehouse_id: number,
        batch_number: string,
        quantity: number,
        expiry_date?: Date,
        po_id?: number
    ): Promise<number> {
        // Validate batch number format (alphanumeric + hyphens only)
        const batchPattern = /^[a-zA-Z0-9-]+$/;
        if (!batch_number || !batchPattern.test(batch_number)) {
            throw new Error('Invalid batch number format. Use alphanumeric characters and hyphens only.');
        }

        if (batch_number.length > 50) {
            throw new Error('Batch number must not exceed 50 characters.');
        }

        // Get product to check if perishable
        const product = await this.databaseService.db.products.get(Number(product_id));
        if (!product) {
            throw new Error('Product not found');
        }

        // Validate expiry date for perishable products
        if (product.is_perishable && !expiry_date) {
            throw new Error('Expiry date is required for perishable products.');
        }

        // Validate expiry date is in the future
        if (expiry_date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expiryCheck = new Date(expiry_date);
            expiryCheck.setHours(0, 0, 0, 0);

            if (expiryCheck < today) {
                throw new Error('Expiry date must be in the future.');
            }
        }

        // Check if batch already exists in the same warehouse
        const existingBatch = await this.databaseService.db.product_batches
            .where('[product_id+warehouse_id]')
            .equals([Number(product_id), Number(warehouse_id)])
            .and(batch => batch.batch_number === batch_number && batch.is_active)
            .first();

        if (existingBatch) {
            // Update existing batch quantity
            const newQuantity = existingBatch.quantity + quantity;
            await this.databaseService.db.product_batches
                .where('id')
                .equals(existingBatch.id!)
                .modify((batch: any) => {
                    batch.quantity = newQuantity;
                    batch.updated_at = new Date();
                });
            return existingBatch.id!;
        } else {
            // Create new batch record
            const batchData: any = {
                product_id: String(product_id),
                warehouse_id: Number(warehouse_id),
                batch_number,
                quantity,
                expiry_date: expiry_date || undefined,
                purchase_order_id: po_id ? String(po_id) : undefined,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            };

            const batch_id = await this.databaseService.db.product_batches.add(batchData);
            return batch_id;
        }
    }

    /**
     * Create serial records for IN movements
     * Requirements: 2.2, 2.5, 2.7
     */
    async createSerialRecords(
        product_id: number,
        warehouse_id: number,
        serial_numbers: string[],
        batch_number?: string,
        po_id?: number
    ): Promise<number[]> {
        if (!serial_numbers || serial_numbers.length === 0) {
            throw new Error('Serial numbers are required for serial-tracked products.');
        }

        // Validate serial format (alphanumeric + hyphens only)
        const serialPattern = /^[a-zA-Z0-9-]+$/;
        const serial_ids: number[] = [];

        for (const serial_number of serial_numbers) {
            // Validate format
            if (!serial_number || !serialPattern.test(serial_number)) {
                throw new Error(`Invalid serial number format: ${serial_number}. Use alphanumeric characters and hyphens only.`);
            }

            if (serial_number.length > 50) {
                throw new Error(`Serial number must not exceed 50 characters: ${serial_number}`);
            }

            // Check uniqueness
            const existingSerial = await this.databaseService.db.product_serials
                .where('serial_number')
                .equals(serial_number)
                .first();

            if (existingSerial) {
                throw new Error(`Serial number already exists: ${serial_number}`);
            }

            // Create serial record
            const serialData: any = {
                product_id: Number(product_id),
                warehouse_id: Number(warehouse_id),
                serial_number,
                batch_number: batch_number || undefined,
                status: 'IN_STOCK',
                purchase_order_id: po_id ? String(po_id) : undefined,
                created_at: new Date(),
                updated_at: new Date()
            };

            const serial_id = await this.databaseService.db.product_serials.add(serialData);
            serial_ids.push(serial_id);
        }

        return serial_ids;
    }

    /**
     * Validate batch availability for OUT/TRANSFER/ADJUSTMENT
     * Requirements: 3.2, 3.7
     */
    async validateBatchAvailability(
        product_id: number,
        warehouse_id: number,
        batch_number: string,
        required_qty: number
    ): Promise<boolean> {
        const batch = await this.databaseService.db.product_batches
            .where('[product_id+warehouse_id]')
            .equals([Number(product_id), Number(warehouse_id)])
            .and(b => b.batch_number === batch_number && b.is_active)
            .first();

        if (!batch) {
            throw new Error(`Batch ${batch_number} not found or inactive in this warehouse`);
        }

        if (batch.quantity < required_qty) {
            throw new Error(`Insufficient batch quantity. Available: ${batch.quantity}, Required: ${required_qty}`);
        }

        return true;
    }

    /**
     * Update batch quantity for OUT/ADJUSTMENT
     * Requirements: 3.3, 3.6
     */
    async updateBatchQuantity(
        batch_id: number,
        quantity_change: number,
        operation: 'ADD' | 'SUBTRACT'
    ): Promise<void> {
        const batch = await this.databaseService.db.product_batches.get(batch_id);
        if (!batch) {
            throw new Error('Batch not found');
        }

        let newQuantity = batch.quantity;
        if (operation === 'SUBTRACT') {
            newQuantity -= quantity_change;
        } else {
            newQuantity += quantity_change;
        }

        // Set is_active = false when quantity reaches 0
        const is_active = newQuantity > 0;

        await this.databaseService.db.product_batches
            .where('id')
            .equals(batch_id)
            .modify((b: any) => {
                b.quantity = newQuantity;
                b.is_active = is_active;
                b.updated_at = new Date();
            });
    }

    /**
     * Validate serial availability for OUT/TRANSFER
     * Requirements: 4.2, 4.7
     */
    async validateSerialAvailability(
        product_id: number,
        warehouse_id: number,
        serial_numbers: string[]
    ): Promise<boolean> {
        for (const serial_number of serial_numbers) {
            const serial = await this.databaseService.db.product_serials
                .where('[product_id+warehouse_id]')
                .equals([Number(product_id), Number(warehouse_id)])
                .and(s => s.serial_number === serial_number)
                .first();

            if (!serial) {
                throw new Error(`Serial ${serial_number} not found in this warehouse`);
            }

            if (serial.status !== 'IN_STOCK') {
                throw new Error(`Serial ${serial_number} is not available (status: ${serial.status})`);
            }
        }

        return true;
    }

    /**
     * Update serial status for OUT
     * Requirements: 4.3
     */
    async updateSerialStatus(
        serial_ids: number[],
        new_status: 'IN_STOCK' | 'SOLD' | 'DAMAGED' | 'RETURNED' | 'LOST'
    ): Promise<void> {
        for (const serial_id of serial_ids) {
            await this.databaseService.db.product_serials
                .where('id')
                .equals(serial_id)
                .modify((s: any) => {
                    s.status = new_status;
                    s.updated_at = new Date();
                    if (new_status === 'SOLD') {
                        s.sold_date = new Date();
                    }
                });
        }
    }

    /**
     * Transfer batch between warehouses
     * Requirements: 5.2, 5.3, 5.7
     */
    async transferBatch(
        batch_id: number,
        from_warehouse: number,
        to_warehouse: number,
        quantity: number
    ): Promise<number> {
        const sourceBatch = await this.databaseService.db.product_batches.get(batch_id);
        if (!sourceBatch) {
            throw new Error('Source batch not found');
        }

        if (sourceBatch.quantity < quantity) {
            throw new Error(`Insufficient batch quantity. Available: ${sourceBatch.quantity}, Required: ${quantity}`);
        }

        // Decrement source batch
        const newSourceQty = sourceBatch.quantity - quantity;
        await this.databaseService.db.product_batches
            .where('id')
            .equals(batch_id)
            .modify((b: any) => {
                b.quantity = newSourceQty;
                b.is_active = newSourceQty > 0;
                b.updated_at = new Date();
            });

        // Check if batch exists in destination warehouse
        const destBatch = await this.databaseService.db.product_batches
            .where('[product_id+warehouse_id]')
            .equals([Number(sourceBatch.product_id), Number(to_warehouse)])
            .and(b => b.batch_number === sourceBatch.batch_number && b.is_active)
            .first();

        let dest_batch_id: number;
        if (destBatch) {
            // Increment existing batch in destination
            const newDestQty = destBatch.quantity + quantity;
            await this.databaseService.db.product_batches
                .where('id')
                .equals(destBatch.id!)
                .modify((b: any) => {
                    b.quantity = newDestQty;
                    b.updated_at = new Date();
                });
            dest_batch_id = destBatch.id!;
        } else {
            // Create new batch in destination
            const newBatchData: any = {
                product_id: sourceBatch.product_id,
                warehouse_id: to_warehouse,
                batch_number: sourceBatch.batch_number,
                expiry_date: sourceBatch.expiry_date,
                quantity: quantity,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            };
            dest_batch_id = await this.databaseService.db.product_batches.add(newBatchData);
        }

        return dest_batch_id;
    }

    /**
     * Transfer serials between warehouses
     * Requirements: 6.2, 6.5
     */
    async transferSerials(
        serial_ids: number[],
        from_warehouse: number,
        to_warehouse: number
    ): Promise<void> {
        for (const serial_id of serial_ids) {
            await this.databaseService.db.product_serials
                .where('id')
                .equals(serial_id)
                .modify((s: any) => {
                    s.warehouse_id = to_warehouse;
                    s.updated_at = new Date();
                    // Maintain IN_STOCK status
                });
        }
    }
}