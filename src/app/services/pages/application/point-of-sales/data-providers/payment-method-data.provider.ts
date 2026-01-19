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
import { PaymentMethodReportRow } from '../../../../../model/pages/application/point-of-sales/report.model';
import { DatabaseService } from '../../../../../app.database';

@Injectable()
export class PaymentMethodDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchPaymentMethodData(filters));
    }

    private async fetchPaymentMethodData(filters: ReportFilter): Promise<PaymentMethodReportRow[]> {
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

        // Apply payment method filter
        if (filters.filters?.has('paymentMethod')) {
            const paymentMethod = filters.filters.get('paymentMethod');
            transactions = transactions.filter(t => t.payment_method === paymentMethod);
        }

        // Group by payment method
        const paymentMethodMap = new Map<string, PaymentMethodReportRow>();

        for (const transaction of transactions) {
            const method = transaction.payment_method;

            if (!paymentMethodMap.has(method)) {
                paymentMethodMap.set(method, {
                    paymentMethod: method,
                    transactionCount: 0,
                    totalAmount: 0,
                    percentage: 0,
                    avgTransactionValue: 0
                });
            }

            const row = paymentMethodMap.get(method)!;
            row.transactionCount++;
            row.totalAmount += transaction.total;
        }

        // Calculate percentages and averages
        const totalAmount = Array.from(paymentMethodMap.values()).reduce((sum, r) => sum + r.totalAmount, 0);
        const reportRows = Array.from(paymentMethodMap.values());

        reportRows.forEach(row => {
            row.percentage = totalAmount > 0 ? (row.totalAmount / totalAmount) * 100 : 0;
            row.avgTransactionValue = row.transactionCount > 0 ? row.totalAmount / row.transactionCount : 0;
        });

        // Sort by total amount descending
        reportRows.sort((a, b) => b.totalAmount - a.totalAmount);

        return reportRows;
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const paymentRows = rows as PaymentMethodReportRow[];

        const totalTransactions = paymentRows.reduce((sum, r) => sum + r.transactionCount, 0);
        const totalAmount = paymentRows.reduce((sum, r) => sum + r.totalAmount, 0);

        const cashRow = paymentRows.find(r => r.paymentMethod === 'CASH');
        const digitalAmount = paymentRows
            .filter(r => r.paymentMethod !== 'CASH')
            .reduce((sum, r) => sum + r.totalAmount, 0);

        const cashPercentage = cashRow ? cashRow.percentage : 0;
        const digitalPercentage = 100 - cashPercentage;

        return {
            'Total Transactions': totalTransactions,
            'Total Amount': this.formatCurrency(totalAmount),
            'Cash Payments': this.formatCurrency(cashRow?.totalAmount || 0),
            'Digital Payments': this.formatCurrency(digitalAmount),
            'Cash Ratio': `${cashPercentage.toFixed(2)}%`,
            'Digital Ratio': `${digitalPercentage.toFixed(2)}%`
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
        return from(Promise.resolve([]));
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
