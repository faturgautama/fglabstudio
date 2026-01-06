// src/app/services/pages/application/inventory/migration.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';

@Injectable({ providedIn: 'root' })
export class InventoryMigrationService {
    private databaseService = inject(DatabaseService);

    /**
     * Migrate existing data to warehouse-based tracking
     * Run this once after updating to version 3
     */
    async migrateToWarehouseTracking(): Promise<{
        success: boolean;
        message: string;
        details: any;
    }> {
        try {
            // 1. Get or create default warehouse
            let defaultWarehouse = await this.databaseService.db.warehouses
                .where('is_default')
                .equals(1)
                .first();

            if (!defaultWarehouse) {
                const warehouseId = await this.databaseService.db.warehouses.add({
                    code: 'WH-DEFAULT',
                    name: 'Default Warehouse',
                    address: 'Main Location',
                    is_default: true,
                    is_active: true,
                    created_at: new Date()
                } as any);

                defaultWarehouse = await this.databaseService.db.warehouses.get(warehouseId);
            }

            if (!defaultWarehouse) {
                throw new Error('Failed to create default warehouse');
            }

            const stats = {
                stockCards: 0,
                purchaseOrders: 0,
                stockMovements: 0,
                productBatches: 0,
                productSerials: 0,
                stockOpnames: 0,
                productWarehouseStocks: 0
            };

            // 2. Migrate stock_cards
            const stockCards = await this.databaseService.db.stock_cards.toArray();
            for (const card of stockCards) {
                if (!card.warehouse_id) {
                    await this.databaseService.db.stock_cards.update(card.id!, {
                        warehouse_id: defaultWarehouse.id!
                    });
                    stats.stockCards++;
                }
            }

            // 3. Migrate purchase_orders
            const pos = await this.databaseService.db.purchase_orders.toArray();
            for (const po of pos) {
                if (!po.warehouse_id) {
                    await this.databaseService.db.purchase_orders.update(po.id!, {
                        warehouse_id: defaultWarehouse.id!
                    });
                    stats.purchaseOrders++;
                }
            }

            // 4. Migrate stock_movements
            const movements = await this.databaseService.db.stock_movements.toArray();
            for (const movement of movements) {
                if (!movement.warehouse_id) {
                    await this.databaseService.db.stock_movements.update(movement.id!, {
                        warehouse_id: defaultWarehouse.id!
                    });
                    stats.stockMovements++;
                }
            }

            // 5. Migrate product_batches
            const batches = await this.databaseService.db.product_batches.toArray();
            for (const batch of batches) {
                if (!batch.warehouse_id) {
                    await this.databaseService.db.product_batches.update(batch.id!, {
                        warehouse_id: defaultWarehouse.id!
                    });
                    stats.productBatches++;
                }
            }

            // 6. Migrate product_serials
            const serials = await this.databaseService.db.product_serials.toArray();
            for (const serial of serials) {
                if (!serial.warehouse_id) {
                    await this.databaseService.db.product_serials.update(serial.id!, {
                        warehouse_id: defaultWarehouse.id!
                    });
                    stats.productSerials++;
                }
            }

            // 7. Migrate stock_opnames
            const opnames = await this.databaseService.db.stock_opnames.toArray();
            for (const opname of opnames) {
                if (!opname.warehouse_id) {
                    await this.databaseService.db.stock_opnames.update(opname.id!, {
                        warehouse_id: defaultWarehouse.id!
                    });
                    stats.stockOpnames++;
                }
            }

            // 8. Initialize product_warehouse_stock
            const products = await this.databaseService.db.products.toArray();

            for (const product of products) {
                // Check if already exists
                const existing = await this.databaseService.db.product_warehouse_stock
                    .where('[product_id+warehouse_id]')
                    .equals([product.id!, defaultWarehouse.id!])
                    .first();

                if (!existing) {
                    await this.databaseService.db.product_warehouse_stock.add({
                        product_id: product.id!,
                        warehouse_id: defaultWarehouse.id!,
                        quantity: product.current_stock || 0,
                        available_quantity: product.current_stock || 0,
                        min_stock: product.min_stock,
                        max_stock: product.max_stock,
                        reorder_point: product.reorder_point,
                        last_stock_date: new Date(),
                        updated_at: new Date()
                    } as any);
                    stats.productWarehouseStocks++;
                }
            }

            return {
                success: true,
                message: 'Migration completed successfully',
                details: {
                    defaultWarehouse: {
                        id: defaultWarehouse.id,
                        code: defaultWarehouse.code,
                        name: defaultWarehouse.name
                    },
                    stats
                }
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Migration failed: ${error.message}`,
                details: { error: error.message }
            };
        }
    }

    /**
     * Check if migration is needed
     */
    async checkMigrationStatus(): Promise<{
        needsMigration: boolean;
        details: any;
    }> {
        try {
            // Check if there are records without warehouse_id
            const stockCardsWithoutWarehouse = await this.databaseService.db.stock_cards
                .filter(card => !card.warehouse_id)
                .count();

            const posWithoutWarehouse = await this.databaseService.db.purchase_orders
                .filter(po => !po.warehouse_id)
                .count();

            const movementsWithoutWarehouse = await this.databaseService.db.stock_movements
                .filter(m => !m.warehouse_id)
                .count();

            const needsMigration =
                stockCardsWithoutWarehouse > 0 ||
                posWithoutWarehouse > 0 ||
                movementsWithoutWarehouse > 0;

            return {
                needsMigration,
                details: {
                    stockCardsWithoutWarehouse,
                    posWithoutWarehouse,
                    movementsWithoutWarehouse
                }
            };

        } catch (error: any) {
            return {
                needsMigration: false,
                details: { error: error.message }
            };
        }
    }

    /**
     * Rollback migration (for testing purposes)
     */
    async rollbackMigration(): Promise<void> {
        console.warn('⚠️ Rolling back migration...');

        // This is destructive - use with caution
        // Remove warehouse_id from all records

        const stockCards = await this.databaseService.db.stock_cards.toArray();
        for (const card of stockCards) {
            await this.databaseService.db.stock_cards.update(card.id!, {
                warehouse_id: undefined as any
            });
        }

        // Clear product_warehouse_stock
        await this.databaseService.db.product_warehouse_stock.clear();
    }
}
