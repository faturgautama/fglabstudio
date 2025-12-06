// src/app/services/pages/application/inventory/product-warehouse-stock.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';

@Injectable({ providedIn: 'root' })
export class ProductWarehouseStockService {
    private databaseService = inject(DatabaseService);

    /**
     * Update stock saat receive (increment)
     */
    async updateStockOnReceive(
        product_id: number | string,
        warehouse_id: number | string,
        quantity: number,
        tracking_type: 'BATCH' | 'SERIAL' | 'GENERAL'
    ): Promise<void> {
        const existing = await this.databaseService.db.product_warehouse_stock
            .where('[product_id+warehouse_id]')
            .equals([Number(product_id), Number(warehouse_id)])
            .first();

        let stock: InventoryModel.ProductWarehouseStock;

        if (existing) {
            // Update existing
            stock = { ...existing };
        } else {
            // Create new
            stock = {
                product_id: Number(product_id),
                warehouse_id: Number(warehouse_id),
                total_stock: 0,
                batch_quantity: 0,
                serial_quantity: 0,
                general_quantity: 0,
                updated_at: new Date()
            };
        }

        // Increment sesuai tracking type
        if (tracking_type === 'BATCH') {
            stock.batch_quantity += quantity;
        } else if (tracking_type === 'SERIAL') {
            stock.serial_quantity += quantity;
        } else {
            stock.general_quantity += quantity;
        }

        // Recalculate total
        stock.total_stock = stock.batch_quantity + stock.serial_quantity + stock.general_quantity;
        stock.updated_at = new Date();

        // Upsert
        if (existing) {
            await this.databaseService.db.product_warehouse_stock.update(Number(existing.id), stock);
        } else {
            await this.databaseService.db.product_warehouse_stock.add(stock as any);
        }
    }

    /**
     * Decrement stock saat stock out
     */
    async decrementStockOnIssue(
        product_id: number | string,
        warehouse_id: number | string,
        quantity: number,
        tracking_type: 'BATCH' | 'SERIAL' | 'GENERAL'
    ): Promise<void> {
        const existing = await this.databaseService.db.product_warehouse_stock
            .where('[product_id+warehouse_id]')
            .equals([Number(product_id), Number(warehouse_id)])
            .first();

        if (!existing) {
            throw new Error(`Stock not found for product ${product_id} in warehouse ${warehouse_id}`);
        }

        let stock = { ...existing };

        // Decrement sesuai tracking type
        if (tracking_type === 'BATCH') {
            if (stock.batch_quantity < quantity) {
                throw new Error(`Insufficient batch quantity. Available: ${stock.batch_quantity}, Required: ${quantity}`);
            }
            stock.batch_quantity -= quantity;
        } else if (tracking_type === 'SERIAL') {
            if (stock.serial_quantity < quantity) {
                throw new Error(`Insufficient serial quantity. Available: ${stock.serial_quantity}, Required: ${quantity}`);
            }
            stock.serial_quantity -= quantity;
        } else {
            if (stock.general_quantity < quantity) {
                throw new Error(`Insufficient general quantity. Available: ${stock.general_quantity}, Required: ${quantity}`);
            }
            stock.general_quantity -= quantity;
        }

        // Recalculate total
        stock.total_stock = stock.batch_quantity + stock.serial_quantity + stock.general_quantity;
        stock.updated_at = new Date();

        await this.databaseService.db.product_warehouse_stock.update(Number(existing.id), stock);
    }

    /**
     * Get stock by warehouse (dengan product details)
     */
    async getStockByWarehouse(warehouse_id: number | string): Promise<any[]> {
        const stocks = await this.databaseService.db.product_warehouse_stock
            .where('warehouse_id')
            .equals(Number(warehouse_id))
            .toArray();

        // Resolve product details
        return Promise.all(
            stocks.map(async (stock) => {
                const product = await this.databaseService.db.products.get(Number(stock.product_id));
                return {
                    ...stock,
                    product_name: product?.name,
                    product_sku: product?.sku,
                    is_batch_tracked: product?.is_batch_tracked,
                    is_serial_tracked: product?.is_serial_tracked
                };
            })
        );
    }

    /**
     * Get product stock in all warehouses
     */
    async getProductStockInAllWarehouses(product_id: number | string): Promise<any[]> {
        const stocks = await this.databaseService.db.product_warehouse_stock
            .where('product_id')
            .equals(Number(product_id))
            .toArray();

        // Resolve warehouse details
        return Promise.all(
            stocks.map(async (stock) => {
                const warehouse = await this.databaseService.db.warehouses.get(Number(stock.warehouse_id));
                return {
                    ...stock,
                    warehouse_name: warehouse?.name,
                    warehouse_code: warehouse?.code
                };
            })
        );
    }

    /**
     * Recalculate stock dari product_batches, product_serials, dan stock_cards
     */
    async recalculateStock(product_id: number | string, warehouse_id: number | string): Promise<void> {
        let batch_quantity = 0;
        let serial_quantity = 0;
        let general_quantity = 0;

        // Dapatkan product untuk cek tracking type
        const product = await this.databaseService.db.products.get(Number(product_id));
        if (!product) throw new Error(`Product ${product_id} not found`);

        // Count batch quantity
        if (product.is_batch_tracked) {
            const batches = await this.databaseService.db.product_batches
                .where('[product_id+warehouse_id]')
                .equals([Number(product_id), Number(warehouse_id)])
                .toArray();
            batch_quantity = batches.reduce((sum, b) => sum + (b.quantity || 0), 0);
        }

        // Count serial quantity
        if (product.is_serial_tracked) {
            const serials = await this.databaseService.db.product_serials
                .where('[product_id+warehouse_id]')
                .equals([Number(product_id), Number(warehouse_id)])
                .toArray();
            serial_quantity = serials.filter(s => s.status === 'IN_STOCK').length;
        }

        // Count general quantity (dari stock_cards jika tidak batch & tidak serial)
        if (!product.is_batch_tracked && !product.is_serial_tracked) {
            const stockCards = await this.databaseService.db.stock_cards
                .where('[product_id+warehouse_id]')
                .equals([Number(product_id), Number(warehouse_id)])
                .toArray();

            const inQty = stockCards
                .filter(sc => sc.type === 'IN')
                .reduce((sum, sc) => sum + (sc.qty_in || 0), 0);

            const outQty = stockCards
                .filter(sc => sc.type === 'OUT')
                .reduce((sum, sc) => sum + (sc.qty_out || 0), 0);

            general_quantity = inQty - outQty;
        }

        const total_stock = batch_quantity + serial_quantity + general_quantity;

        // Get existing atau create new
        const existing = await this.databaseService.db.product_warehouse_stock
            .where('[product_id+warehouse_id]')
            .equals([Number(product_id), Number(warehouse_id)])
            .first();

        const stock: InventoryModel.ProductWarehouseStock = {
            product_id: Number(product_id),
            warehouse_id: Number(warehouse_id),
            total_stock,
            batch_quantity,
            serial_quantity,
            general_quantity,
            updated_at: new Date()
        };

        if (existing) {
            await this.databaseService.db.product_warehouse_stock.update(Number(existing.id), stock);
        } else {
            await this.databaseService.db.product_warehouse_stock.add(stock as any);
        }
    }

    /**
     * Get all stocks (useful untuk dashboard)
     */
    async getAllStocks(): Promise<any[]> {
        const stocks = await this.databaseService.db.product_warehouse_stock.toArray();

        return Promise.all(
            stocks.map(async (stock) => {
                const product = await this.databaseService.db.products.get(Number(stock.product_id));
                const warehouse = await this.databaseService.db.warehouses.get(Number(stock.warehouse_id));

                return {
                    ...stock,
                    product_name: product?.name,
                    product_sku: product?.sku,
                    is_batch_tracked: product?.is_batch_tracked,
                    is_serial_tracked: product?.is_serial_tracked,
                    warehouse_name: warehouse?.name,
                    warehouse_code: warehouse?.code
                };
            })
        );
    }

    /**
     * Update batch quantity in product_warehouse_stock
     * Requirements: 1.3
     */
    async updateBatchQuantity(
        product_id: number,
        warehouse_id: number,
        quantity: number,
        operation: 'ADD' | 'SUBTRACT'
    ): Promise<void> {
        const existing = await this.databaseService.db.product_warehouse_stock
            .where('[product_id+warehouse_id]')
            .equals([Number(product_id), Number(warehouse_id)])
            .first();

        let stock: InventoryModel.ProductWarehouseStock;

        if (existing) {
            stock = { ...existing };
        } else {
            // Create new if not exists
            stock = {
                product_id: Number(product_id),
                warehouse_id: Number(warehouse_id),
                total_stock: 0,
                batch_quantity: 0,
                serial_quantity: 0,
                general_quantity: 0,
                updated_at: new Date()
            };
        }

        // Update batch quantity
        if (operation === 'ADD') {
            stock.batch_quantity += quantity;
        } else {
            if (stock.batch_quantity < quantity) {
                throw new Error(`Insufficient batch quantity. Available: ${stock.batch_quantity}, Required: ${quantity}`);
            }
            stock.batch_quantity -= quantity;
        }

        // Recalculate total
        stock.total_stock = stock.batch_quantity + stock.serial_quantity + stock.general_quantity;
        stock.updated_at = new Date();

        // Upsert
        if (existing) {
            await this.databaseService.db.product_warehouse_stock.update(Number(existing.id), stock);
        } else {
            await this.databaseService.db.product_warehouse_stock.add(stock as any);
        }
    }

    /**
     * Update serial quantity in product_warehouse_stock
     * Requirements: 2.3
     */
    async updateSerialQuantity(
        product_id: number,
        warehouse_id: number,
        quantity: number,
        operation: 'ADD' | 'SUBTRACT'
    ): Promise<void> {
        const existing = await this.databaseService.db.product_warehouse_stock
            .where('[product_id+warehouse_id]')
            .equals([Number(product_id), Number(warehouse_id)])
            .first();

        let stock: InventoryModel.ProductWarehouseStock;

        if (existing) {
            stock = { ...existing };
        } else {
            // Create new if not exists
            stock = {
                product_id: Number(product_id),
                warehouse_id: Number(warehouse_id),
                total_stock: 0,
                batch_quantity: 0,
                serial_quantity: 0,
                general_quantity: 0,
                updated_at: new Date()
            };
        }

        // Update serial quantity
        if (operation === 'ADD') {
            stock.serial_quantity += quantity;
        } else {
            if (stock.serial_quantity < quantity) {
                throw new Error(`Insufficient serial quantity. Available: ${stock.serial_quantity}, Required: ${quantity}`);
            }
            stock.serial_quantity -= quantity;
        }

        // Recalculate total
        stock.total_stock = stock.batch_quantity + stock.serial_quantity + stock.general_quantity;
        stock.updated_at = new Date();

        // Upsert
        if (existing) {
            await this.databaseService.db.product_warehouse_stock.update(Number(existing.id), stock);
        } else {
            await this.databaseService.db.product_warehouse_stock.add(stock as any);
        }
    }
}
