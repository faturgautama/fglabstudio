import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { POSModel } from '../../../../model/pages/application/point-of-sales/pos.model';
import { BaseActionService } from '../../../shared/base-action';

@Injectable({ providedIn: 'root' })
export class POSShiftService extends BaseActionService<POSModel.Shift> {
    private databaseService = inject(DatabaseService);
    protected override table = this.databaseService.db.pos_shifts;

    /**
     * Open a new shift
     */
    openShift(cashierId: number, initialCash: number) {
        return this.withLoading(async () => {
            // Check if there's already an open shift for this cashier
            const existingShift = await this.databaseService.db.pos_shifts
                .filter(s => s.cashier_id === cashierId && s.status === 'OPEN' && s.is_active !== false)
                .first();

            if (existingShift) {
                throw new Error('Kasir sudah memiliki shift yang aktif');
            }

            // Generate shift number
            const shiftNumber = await this.generateShiftNumber();

            const newShift: POSModel.Shift = {
                shift_number: shiftNumber,
                cashier_id: cashierId,
                start_time: new Date(),
                initial_cash: initialCash,
                total_sales: 0,
                total_transactions: 0,
                status: 'OPEN',
                is_active: true,
                created_at: new Date()
            };

            const shiftId = await this.databaseService.db.pos_shifts.add(newShift);
            return { ...newShift, id: shiftId };
        });
    }

    /**
     * Close a shift
     */
    closeShift(shiftId: number, actualCash: number) {
        return this.withLoading(async () => {
            const shift = await this.databaseService.db.pos_shifts.get(shiftId);
            if (!shift) {
                throw new Error('Shift tidak ditemukan');
            }

            if (shift.status === 'CLOSED') {
                throw new Error('Shift sudah ditutup');
            }

            // Calculate expected cash and discrepancy
            const summary = await this.calculateShiftSummary(shiftId);
            const expectedCash = shift.initial_cash + summary.cash_sales;
            const discrepancy = actualCash - expectedCash;

            await this.databaseService.db.pos_shifts.update(shiftId, {
                end_time: new Date(),
                expected_cash: expectedCash,
                actual_cash: actualCash,
                discrepancy: discrepancy,
                total_sales: summary.total_sales,
                total_transactions: summary.total_transactions,
                status: 'CLOSED',
                updated_at: new Date()
            });

            return {
                ...shift,
                end_time: new Date(),
                expected_cash: expectedCash,
                actual_cash: actualCash,
                discrepancy: discrepancy,
                total_sales: summary.total_sales,
                total_transactions: summary.total_transactions,
                status: 'CLOSED' as const
            };
        });
    }

    /**
     * Get active shift for a cashier
     */
    getActiveShift(cashierId: number) {
        return this.withLoading(async () => {
            const shift = await this.databaseService.db.pos_shifts
                .filter(s => s.cashier_id === cashierId && s.status === 'OPEN' && s.is_active !== false)
                .first();

            if (!shift) return null;
            return this.resolveRelations(shift);
        });
    }

    /**
     * Get all active shifts (for persistence on reload)
     */
    getAllActiveShifts() {
        return this.withLoading(async () => {
            const shifts = await this.databaseService.db.pos_shifts
                .filter(s => s.status === 'OPEN' && s.is_active !== false)
                .toArray();

            return Promise.all(shifts.map(s => this.resolveRelations(s)));
        });
    }

    /**
     * Get shift summary
     */
    getShiftSummary(shiftId: number) {
        return this.withLoading(async () => {
            return this.calculateShiftSummary(shiftId);
        });
    }

    /**
     * Calculate shift summary from transactions
     */
    private async calculateShiftSummary(shiftId: number) {
        const transactions = await this.databaseService.db.pos_transactions
            .filter(t => t.shift_id === shiftId && t.status === 'COMPLETED' && t.is_active !== false)
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
    }

    /**
     * Generate shift number
     */
    private async generateShiftNumber() {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const count = await this.databaseService.db.pos_shifts
            .filter(s => {
                const shiftDate = new Date(s.start_time);
                return shiftDate >= today && shiftDate < tomorrow;
            })
            .count();

        return `SFT-${dateStr}-${String(count + 1).padStart(3, '0')}`;
    }

    override async resolveRelations(record: POSModel.Shift): Promise<any> {
        const enriched: any = { ...record };

        // Resolve cashier
        if (record.cashier_id) {
            const cashier = await this.databaseService.db.employees.get(record.cashier_id);
            if (cashier) enriched.cashier = cashier;
        }

        return enriched;
    }
}
