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
import { CashierPerformanceReportRow } from '../../../../../model/pages/application/point-of-sales/report.model';
import { DatabaseService } from '../../../../../app.database';

@Injectable()
export class CashierPerformanceDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchCashierPerformanceData(filters));
    }

    private async fetchCashierPerformanceData(filters: ReportFilter): Promise<CashierPerformanceReportRow[]> {
        await this.dbService.ensureReady();

        if (!filters.startDate || !filters.endDate) {
            return [];
        }

        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);

        // Fetch all completed transactions in date range
        let transactions = await this.dbService.db.pos_transactions
            .where('transaction_date')
            .between(start, end, true, true)
            .toArray();

        transactions = transactions.filter(t => t.status === 'COMPLETED');

        // Apply cashier filter
        if (filters.filters?.has('cashier')) {
            const cashierId = filters.filters.get('cashier');
            transactions = transactions.filter(t => t.cashier_id === cashierId);
        }

        // Fetch employees
        const employees = await this.dbService.db.employees.toArray();
        const employeeMap = new Map(employees.map(e => [e.id, e.full_name]));

        // Group by cashier
        const cashierMap = new Map<number, CashierPerformanceReportRow>();

        for (const transaction of transactions) {
            if (!cashierMap.has(transaction.cashier_id)) {
                cashierMap.set(transaction.cashier_id, {
                    cashierName: employeeMap.get(transaction.cashier_id) || 'N/A',
                    totalTransactions: 0,
                    totalItems: 0,
                    totalRevenue: 0,
                    avgTransactionValue: 0,
                    avgTransactionTime: 0,
                    transactionsPerHour: 0
                });
            }

            const row = cashierMap.get(transaction.cashier_id)!;
            row.totalTransactions++;
            row.totalRevenue += transaction.total;

            // Count items
            if (transaction.items) {
                row.totalItems += transaction.items.reduce((sum, item) => sum + item.quantity, 0);
            }
        }

        // Calculate averages
        const reportRows = Array.from(cashierMap.values());
        const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        reportRows.forEach(row => {
            row.avgTransactionValue = row.totalTransactions > 0 ? row.totalRevenue / row.totalTransactions : 0;
            row.transactionsPerHour = totalHours > 0 ? row.totalTransactions / totalHours : 0;
        });

        // Sort by revenue descending
        reportRows.sort((a, b) => b.totalRevenue - a.totalRevenue);

        return reportRows;
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const cashierRows = rows as CashierPerformanceReportRow[];

        const totalCashiers = cashierRows.length;
        const totalTransactions = cashierRows.reduce((sum, r) => sum + r.totalTransactions, 0);
        const totalRevenue = cashierRows.reduce((sum, r) => sum + r.totalRevenue, 0);
        const avgRevenuePerCashier = totalCashiers > 0 ? totalRevenue / totalCashiers : 0;

        const topCashier = cashierRows.length > 0 ? cashierRows[0] : null;

        return {
            'Total Cashiers': totalCashiers,
            'Total Transactions': totalTransactions,
            'Total Revenue': this.formatCurrency(totalRevenue),
            'Average Revenue per Cashier': this.formatCurrency(avgRevenuePerCashier),
            'Top Performer': topCashier ? `${topCashier.cashierName} (${this.formatCurrency(topCashier.totalRevenue)})` : 'N/A'
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
