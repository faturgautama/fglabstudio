import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { POSModel } from '../../../../model/pages/application/point-of-sales/pos.model';
import { BaseActionService } from '../../../shared/base-action';

@Injectable({ providedIn: 'root' })
export class POSTransactionService extends BaseActionService<POSModel.Transaction> {
    private databaseService = inject(DatabaseService);
    protected override table = this.databaseService.db.pos_transactions;

    /**
     * Get transactions by date range
     */
    getByDateRange(startDate: Date, endDate: Date) {
        return this.withLoading(async () => {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            const transactions = await this.databaseService.db.pos_transactions
                .filter(t => {
                    const txDate = new Date(t.transaction_date);
                    return t.is_active !== false &&
                        txDate >= start &&
                        txDate <= end;
                })
                .toArray();

            return this.resolveMultipleRelations(transactions);
        });
    }

    /**
     * Get transactions by cashier
     */
    getByCashier(cashierId: number) {
        return this.withLoading(async () => {
            const transactions = await this.databaseService.db.pos_transactions
                .filter(t => t.cashier_id === cashierId && t.is_active !== false)
                .toArray();

            return this.resolveMultipleRelations(transactions);
        });
    }

    /**
     * Get transactions by shift
     */
    getByShift(shiftId: number) {
        return this.withLoading(async () => {
            const transactions = await this.databaseService.db.pos_transactions
                .filter(t => t.shift_id === shiftId && t.is_active !== false)
                .toArray();

            return this.resolveMultipleRelations(transactions);
        });
    }

    /**
     * Get today's sales summary
     */
    getTodaySummary() {
        return this.withLoading(async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const transactions = await this.databaseService.db.pos_transactions
                .filter(t => {
                    const txDate = new Date(t.transaction_date);
                    return t.is_active !== false &&
                        t.status === 'COMPLETED' &&
                        txDate >= today &&
                        txDate < tomorrow;
                })
                .toArray();

            const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
            const totalTransactions = transactions.length;
            const cashSales = transactions
                .filter(t => t.payment_method === 'CASH')
                .reduce((sum, t) => sum + t.total, 0);

            return {
                total_sales: totalSales,
                total_transactions: totalTransactions,
                cash_sales: cashSales,
                non_cash_sales: totalSales - cashSales
            };
        });
    }

    /**
     * Get top selling products
     */
    getTopProducts(limit: number = 5) {
        return this.withLoading(async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            // Get today's transactions
            const transactions = await this.databaseService.db.pos_transactions
                .filter(t => {
                    const txDate = new Date(t.transaction_date);
                    return t.is_active !== false &&
                        t.status === 'COMPLETED' &&
                        txDate >= today &&
                        txDate < tomorrow;
                })
                .toArray();

            const transactionIds = transactions.map(t => t.id!);

            // Get transaction items
            const items = await this.databaseService.db.pos_transaction_items
                .filter(item => transactionIds.includes(item.transaction_id))
                .toArray();

            // Aggregate by product
            const productMap = new Map<number, { product_id: number; product_name: string; total_qty: number; total_sales: number }>();

            for (const item of items) {
                const existing = productMap.get(item.product_id);
                if (existing) {
                    existing.total_qty += item.quantity;
                    existing.total_sales += item.subtotal;
                } else {
                    productMap.set(item.product_id, {
                        product_id: item.product_id,
                        product_name: item.product_name,
                        total_qty: item.quantity,
                        total_sales: item.subtotal
                    });
                }
            }

            // Sort by total_qty and take top N
            return Array.from(productMap.values())
                .sort((a, b) => b.total_qty - a.total_qty)
                .slice(0, limit);
        });
    }

    /**
     * Generate transaction number
     */
    generateTransactionNumber(prefix: string = 'TRX') {
        return this.withLoading(async () => {
            const today = new Date();
            const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

            // Count today's transactions
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const count = await this.databaseService.db.pos_transactions
                .filter(t => {
                    const txDate = new Date(t.transaction_date);
                    return txDate >= today && txDate < tomorrow;
                })
                .count();

            return `${prefix}-${dateStr}-${String(count + 1).padStart(4, '0')}`;
        });
    }

    /**
     * Create transaction with items
     */
    createTransaction(transaction: POSModel.Transaction, items: POSModel.TransactionItem[]) {
        return this.withLoading(async () => {
            // Add transaction
            const transactionId = await this.databaseService.db.pos_transactions.add({
                ...transaction,
                is_active: true,
                created_at: new Date()
            });

            // Add transaction items
            const itemsWithTransactionId = items.map(item => ({
                ...item,
                transaction_id: transactionId as number,
                is_active: true,
                created_at: new Date()
            }));

            await this.databaseService.db.pos_transaction_items.bulkAdd(itemsWithTransactionId);

            return transactionId;
        });
    }

    /**
     * Get transaction with items
     */
    getTransactionWithItems(transactionId: number) {
        return this.withLoading(async () => {
            const transaction = await this.databaseService.db.pos_transactions.get(transactionId);
            if (!transaction) return null;

            const items = await this.databaseService.db.pos_transaction_items
                .filter(item => item.transaction_id === transactionId && item.is_active !== false)
                .toArray();

            const enriched = await this.resolveRelations(transaction);
            return { ...enriched, items };
        });
    }

    override async resolveRelations(record: POSModel.Transaction): Promise<any> {
        const enriched: any = { ...record };

        // Resolve cashier
        if (record.cashier_id) {
            const cashier = await this.databaseService.db.employees.get(record.cashier_id);
            if (cashier) enriched.cashier = cashier;
        }

        // Resolve shift
        if (record.shift_id) {
            const shift = await this.databaseService.db.pos_shifts.get(record.shift_id);
            if (shift) enriched.shift = shift;
        }

        return enriched;
    }
}
