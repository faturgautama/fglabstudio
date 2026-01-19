import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
    IReportDataProvider,
    ReportFilter,
    ReportRow,
    ReportSummary,
    ValidationResult,
    FilterType,
    FilterOption
} from '../../../../../model/shared/report.model';
import { DailySalesReportRow } from '../../../../../model/pages/application/point-of-sales/report.model';
import { DatabaseService } from '../../../../../app.database';

@Injectable()
export class DailySalesDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchDailySalesData(filters));
    }

    private async fetchDailySalesData(filters: ReportFilter): Promise<DailySalesReportRow[]> {
        await this.dbService.ensureReady();

        if (!filters.startDate || !filters.endDate) {
            return [];
        }

        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);

        // Fetch all transactions in date range
        let transactions = await this.dbService.db.pos_transactions
            .where('transaction_date')
            .between(start, end, true, true)
            .toArray();

        // Apply cashier filter
        if (filters.filters?.has('cashier')) {
            const cashierId = filters.filters.get('cashier');
            transactions = transactions.filter(t => t.cashier_id === cashierId);
        }

        // Apply payment method filter
        if (filters.filters?.has('paymentMethod')) {
            const paymentMethod = filters.filters.get('paymentMethod');
            transactions = transactions.filter(t => t.payment_method === paymentMethod);
        }

        // Filter only completed transactions
        transactions = transactions.filter(t => t.status === 'COMPLETED');

        // Group by date
        const dailyMap = new Map<string, DailySalesReportRow>();

        for (const transaction of transactions) {
            const dateKey = new Date(transaction.transaction_date).toISOString().split('T')[0];

            if (!dailyMap.has(dateKey)) {
                dailyMap.set(dateKey, {
                    date: new Date(dateKey),
                    totalTransactions: 0,
                    totalItems: 0,
                    grossSales: 0,
                    discounts: 0,
                    netSales: 0,
                    cashPayments: 0,
                    qrisPayments: 0,
                    transferPayments: 0
                });
            }

            const dailyRow = dailyMap.get(dateKey)!;
            dailyRow.totalTransactions++;
            dailyRow.grossSales += transaction.subtotal;
            dailyRow.discounts += transaction.discount_amount;
            dailyRow.netSales += transaction.total;

            // Count items
            if (transaction.items) {
                dailyRow.totalItems += transaction.items.reduce((sum, item) => sum + item.quantity, 0);
            }

            // Payment method breakdown
            if (transaction.payment_method === 'CASH') {
                dailyRow.cashPayments += transaction.total;
            } else if (transaction.payment_method === 'QRIS') {
                dailyRow.qrisPayments += transaction.total;
            } else if (transaction.payment_method === 'TRANSFER') {
                dailyRow.transferPayments += transaction.total;
            }
        }

        const reportRows = Array.from(dailyMap.values());
        reportRows.sort((a, b) => a.date.getTime() - b.date.getTime());

        return reportRows;
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const dailyRows = rows as DailySalesReportRow[];

        const totalDays = dailyRows.length;
        const totalTransactions = dailyRows.reduce((sum, r) => sum + r.totalTransactions, 0);
        const totalItems = dailyRows.reduce((sum, r) => sum + r.totalItems, 0);
        const totalGrossSales = dailyRows.reduce((sum, r) => sum + r.grossSales, 0);
        const totalDiscounts = dailyRows.reduce((sum, r) => sum + r.discounts, 0);
        const totalNetSales = dailyRows.reduce((sum, r) => sum + r.netSales, 0);
        const avgDailySales = totalDays > 0 ? totalNetSales / totalDays : 0;

        return {
            'Total Days': totalDays,
            'Total Transactions': totalTransactions,
            'Total Items Sold': totalItems,
            'Gross Sales': this.formatCurrency(totalGrossSales),
            'Total Discounts': this.formatCurrency(totalDiscounts),
            'Net Sales': this.formatCurrency(totalNetSales),
            'Average Daily Sales': this.formatCurrency(avgDailySales)
        };
    }

    validateFilters(filters: ReportFilter): ValidationResult {
        const errors: { field: string; message: string }[] = [];

        if (!filters.startDate || !filters.endDate) {
            errors.push({ field: 'dateRange', message: 'Start date and end date are required' });
        } else {
            const start = new Date(filters.startDate);
            const end = new Date(filters.endDate);
            if (start > end) {
                errors.push({ field: 'dateRange', message: 'Start date must be before end date' });
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    getFilterOptions(filterType: FilterType): Observable<FilterOption[]> {
        return from(this.loadFilterOptions(filterType));
    }

    private async loadFilterOptions(filterType: FilterType): Promise<FilterOption[]> {
        await this.dbService.ensureReady();

        switch (filterType) {
            case FilterType.CUSTOM:
                const employees = await this.dbService.db.employees
                    .where('is_active').equals(1)
                    .toArray();
                return employees.map(e => ({
                    label: e.full_name,
                    value: e.id
                }));

            default:
                return [];
        }
    }

    private formatCurrency(value: number): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }
}
