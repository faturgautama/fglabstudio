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
     */
    createStockMovement(movement: Omit<InventoryModel.StockMovement, 'id' | 'created_at'>) {
        return this.withLoading(async () => {
            // Validate warehouse
            if (!movement.warehouse_id) {
                throw new Error('Warehouse is required for stock movement');
            }

            const warehouse = await this.databaseService.db.warehouses.get(Number(movement.warehouse_id));
            if (!warehouse) throw new Error('Warehouse not found');

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

            // Add movement
            const movement_data: any = {
                ...movement,
                created_at: new Date(),
                is_active: true
            };

            const movement_id = await this.databaseService.db.stock_movements.add(movement_data);

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
                    movement.unit_cost
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
                    movement.unit_cost
                ));
            } else {
                // Regular IN/OUT/ADJUSTMENT
                await firstValueFrom(this.stockCardService.addStockCard(
                    movement.product_id,
                    movement.warehouse_id,
                    movement.type,
                    movement.quantity,
                    'STOCK_MOVEMENT',
                    movement_id,
                    movement.notes,
                    movement.unit_cost
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
}