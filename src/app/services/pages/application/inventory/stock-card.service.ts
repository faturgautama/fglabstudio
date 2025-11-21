// src/app/services/pages/application/inventory/stock-card.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { BaseActionService } from '../../../shared/base-action';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class StockCardService extends BaseActionService<InventoryModel.StockCard> {
    private databaseService = inject(DatabaseService);
    private notificationService = inject(NotificationService);

    protected override table = this.databaseService.db.stock_cards;

    /**
     * Add stock card dan update product stock
     */
    addStockCard(
        product_id: number,
        type: InventoryModel.StockCard['type'],
        qty: number,
        reference_type?: string,
        reference_id?: number,
        notes?: string,
        unit_cost?: number
    ) {
        return this.withLoading(async () => {
            const product = await this.databaseService.db.products.get(Number(product_id));
            if (!product) throw new Error('Product not found');

            // Calculate new balance
            const lastCard = await this.databaseService.db.stock_cards
                .where('product_id')
                .equals(product_id)
                .reverse()
                .first();

            const current_balance = lastCard?.balance || product.current_stock;
            const qty_in = type === 'IN' ? qty : 0;
            const qty_out = type === 'OUT' || type === 'ADJUSTMENT' ? qty : 0;
            const new_balance = current_balance + qty_in - qty_out;

            // Create stock card
            const stock_card: InventoryModel.StockCard = {
                product_id,
                transaction_date: new Date(),
                type,
                reference_type,
                reference_id,
                qty_in,
                qty_out,
                balance: new_balance,
                unit_cost,
                total_value: unit_cost ? qty * unit_cost : undefined,
                notes,
                created_at: new Date()
            };

            const id = await this.databaseService.db.stock_cards.add(stock_card as any);

            // Update product stock
            await this.databaseService.db.products.update(Number(product_id), {
                current_stock: new_balance,
                updated_at: new Date()
            });

            // Check low stock notification
            await this.checkLowStockNotification(product_id);

            return id;
        });
    }

    /**
     * Get stock cards by product
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

    private async checkLowStockNotification(product_id: number) {
        const product = await this.databaseService.db.products.get(Number(product_id));
        if (!product) return;

        if (product.current_stock <= product.min_stock) {
            await this.notificationService.add({
                type: 'LOW_STOCK',
                priority: 'HIGH',
                title: 'Stok Menipis',
                message: `${product.name} tersisa ${product.current_stock} ${product.unit}`,
                product_id: product.id!.toString(),
                link: `/inventory/products/${product.id}`
            } as any);
        }

        // Check reorder point
        if (product.reorder_point && product.current_stock <= product.reorder_point) {
            await this.notificationService.add({
                type: 'REORDER_POINT',
                priority: 'URGENT',
                title: 'Reorder Point Tercapai',
                message: `${product.name} sudah mencapai reorder point. Segera lakukan pengadaan.`,
                product_id: product.id!.toString(),
                link: `/inventory/procurement/create?product_id=${product.id}`
            } as any);
        }
    }
}