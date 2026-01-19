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
import { ProductSalesReportRow } from '../../../../../model/pages/application/point-of-sales/report.model';
import { DatabaseService } from '../../../../../app.database';

@Injectable()
export class ProductSalesDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchProductSalesData(filters));
    }

    private async fetchProductSalesData(filters: ReportFilter): Promise<ProductSalesReportRow[]> {
        await this.dbService.ensureReady();

        if (!filters.startDate || !filters.endDate) {
            return [];
        }

        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);

        // Fetch all completed transactions in date range
        const transactions = await this.dbService.db.pos_transactions
            .where('transaction_date')
            .between(start, end, true, true)
            .toArray();

        const completedTransactions = transactions.filter(t => t.status === 'COMPLETED');

        // Fetch all transaction items
        const transactionIds = completedTransactions.map(t => t.id!);
        const allItems = await this.dbService.db.pos_transaction_items.toArray();
        const items = allItems.filter(item => transactionIds.includes(item.transaction_id));

        // Fetch products for cost price
        const products = await this.dbService.db.products.toArray();
        const productMap = new Map(products.map(p => [p.id, p]));

        // Fetch categories
        const categories = await this.dbService.db.categories.toArray();
        const categoryMap = new Map(categories.map(c => [c.id?.toString() || '', c.name]));

        // Group by product
        const productSalesMap = new Map<number, ProductSalesReportRow>();

        for (const item of items) {
            if (!productSalesMap.has(item.product_id)) {
                const product = productMap.get(item.product_id);
                const costPrice = product?.purchase_price || 0;
                const revenue = item.subtotal;
                const profit = revenue - (costPrice * item.quantity);
                const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

                productSalesMap.set(item.product_id, {
                    productName: item.product_name,
                    sku: item.product_sku,
                    category: categoryMap.get(product?.category_id || '') || 'N/A',
                    quantitySold: item.quantity,
                    revenue: revenue,
                    costPrice: costPrice,
                    profit: profit,
                    profitMargin: profitMargin
                });
            } else {
                const row = productSalesMap.get(item.product_id)!;
                row.quantitySold += item.quantity;
                row.revenue += item.subtotal;
                const product = productMap.get(item.product_id);
                const costPrice = product?.purchase_price || 0;
                row.profit = row.revenue - (costPrice * row.quantitySold);
                row.profitMargin = row.revenue > 0 ? (row.profit / row.revenue) * 100 : 0;
            }
        }

        // Apply category filter
        let reportRows = Array.from(productSalesMap.values());
        if (filters.filters?.has('category')) {
            const categoryName = filters.filters.get('category');
            reportRows = reportRows.filter(r => r.category === categoryName);
        }

        // Sort by revenue descending
        reportRows.sort((a, b) => b.revenue - a.revenue);

        return reportRows;
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const productRows = rows as ProductSalesReportRow[];

        const totalProducts = productRows.length;
        const totalQuantitySold = productRows.reduce((sum, r) => sum + r.quantitySold, 0);
        const totalRevenue = productRows.reduce((sum, r) => sum + r.revenue, 0);
        const totalProfit = productRows.reduce((sum, r) => sum + r.profit, 0);
        const avgProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        const topProduct = productRows.length > 0 ? productRows[0] : null;

        return {
            'Total Products': totalProducts,
            'Total Quantity Sold': totalQuantitySold,
            'Total Revenue': this.formatCurrency(totalRevenue),
            'Total Profit': this.formatCurrency(totalProfit),
            'Average Profit Margin': `${avgProfitMargin.toFixed(2)}%`,
            'Top Selling Product': topProduct ? `${topProduct.productName} (${topProduct.quantitySold} units)` : 'N/A'
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
                const categories = await this.dbService.db.categories
                    .where('is_active').equals(1)
                    .toArray();
                return categories.map(c => ({
                    label: c.name,
                    value: c.id
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
