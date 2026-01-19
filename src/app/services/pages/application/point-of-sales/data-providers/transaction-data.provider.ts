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
import { TransactionReportRow } from '../../../../../model/pages/application/point-of-sales/report.model';
import { DatabaseService } from '../../../../../app.database';

@Injectable()
export class TransactionDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchTransactionData(filters));
    }

    private async fetchTransactionData(filters: ReportFilter): Promise<TransactionReportRow[]> {
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

        // Apply status filter
        if (filters.filters?.has('status')) {
            const status = filters.filters.get('status');
            transactions = transactions.filter(t => t.status === status);
        }

        // Fetch employees for cashier names
        const employees = await this.dbService.db.employees.toArray();
        const employeeMap = new Map(employees.map(e => [e.id, e.full_name]));

        // Map to report rows
        const reportRows: TransactionReportRow[] = transactions.map(transaction => {
            return {
                transactionNumber: transaction.transaction_number,
                transactionDate: transaction.transaction_date,
                cashierName: employeeMap.get(transaction.cashier_id) || 'N/A',
                subtotal: transaction.subtotal,
                discountAmount: transaction.discount_amount,
                total: transaction.total,
                paymentMethod: transaction.payment_method,
                amountPaid: transaction.amount_paid,
                changeAmount: transaction.change_amount,
                status: transaction.status
            };
        });

        // Sort by date descending
        reportRows.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

        return reportRows;
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const transactionRows = rows as TransactionReportRow[];

        const totalTransactions = transactionRows.length;
        const totalRevenue = transactionRows.reduce((sum, r) => sum + r.total, 0);
        const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
        const completedCount = transactionRows.filter(r => r.status === 'COMPLETED').length;
        const voidedCount = transactionRows.filter(r => r.status === 'VOIDED').length;

        return {
            'Total Transactions': totalTransactions,
            'Total Revenue': this.formatCurrency(totalRevenue),
            'Average Transaction Value': this.formatCurrency(avgTransactionValue),
            'Completed': completedCount,
            'Voided': voidedCount
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
