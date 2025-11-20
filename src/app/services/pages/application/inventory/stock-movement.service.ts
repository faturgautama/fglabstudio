// src/app/services/pages/application/inventory/stock-movement.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { BaseActionService } from '../../../shared/base-action';
import { StockCardService } from './stock-card.service';

@Injectable({ providedIn: 'root' })
export class StockMovementService extends BaseActionService<InventoryModel.StockMovement> {
    private databaseService = inject(DatabaseService);
    private stockCardService = inject(StockCardService);

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
            // Add movement
            const movement_data: any = {
                ...movement,
                created_at: new Date(),
                is_active: true
            };

            const movement_id = await this.databaseService.db.stock_movements.add(movement_data);

            // Add to stock card
            const qty = movement.type === 'OUT' ? -movement.quantity : movement.quantity;

            await this.stockCardService.addStockCard(
                movement.product_id!,
                movement.type,
                Math.abs(qty),
                'STOCK_MOVEMENT',
                movement_id,
                movement.notes,
                movement.unit_cost
            );

            return movement_id;
        });
    }

    /**
     * Stock adjustment
     */
    adjustStock(product_id: number, new_quantity: number, reason: string, notes?: string) {
        return this.withLoading(async () => {
            const product = await this.databaseService.db.products.get(Number(product_id));
            if (!product) throw new Error('Product not found');

            const difference = new_quantity - product.current_stock;

            // ✅ Generate movement number directly
            const movement_number = await this.generateMovementNumberSync('ADJUSTMENT');

            return await this.createStockMovement({
                movement_number,
                type: 'ADJUSTMENT',
                product_id,
                quantity: Math.abs(difference),
                reason,
                notes: `${notes || ''} (System: ${product.current_stock} → ${new_quantity})`,
                movement_date: new Date()
            });
        });
    }
}