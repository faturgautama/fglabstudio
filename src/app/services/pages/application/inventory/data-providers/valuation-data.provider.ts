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
import { ValuationReportRow } from '../../../../../model/pages/application/inventory/report.model';
import { DatabaseService } from '../../../../../app.database';

@Injectable()
export class ValuationDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchValuationData(filters));
    }

    private async fetchValuationData(filters: ReportFilter): Promise<ValuationReportRow[]> {
        await this.dbService.ensureReady();

        // Fetch all products
        let products = await this.dbService.db.products
            .where('is_active').equals(1)
            .toArray();

        // Apply category filter
        if (filters.filters?.has('category')) {
            const categoryId = filters.filters.get('category');
            products = products.filter(p => p.category_id === categoryId);
        }

        // Apply warehouse filter
        if (filters.filters?.has('warehouse')) {
            const warehouseId = filters.filters.get('warehouse');
            const warehouseStocks = await this.dbService.db.product_warehouse_stock
                .where('warehouse_id').equals(warehouseId)
                .toArray();
            const productIds = warehouseStocks.map(ws => ws.product_id);
            products = products.filter(p => p.id !== undefined && productIds.includes(p.id));
        }

        // Fetch categories for lookup
        const categories = await this.dbService.db.categories.toArray();
        const catMap = new Map(categories.map(c => [c.id?.toString() || '', c.name]));

        // Map to report rows
        const reportRows: ValuationReportRow[] = products.map(product => {
            const quantity = product.current_stock;
            const unitCost = product.purchase_price;
            const totalValue = quantity * unitCost;

            return {
                productName: product.name,
                sku: product.sku,
                category: catMap.get(product.category_id || '') || 'N/A',
                quantity: quantity,
                unitCost: unitCost,
                totalValue: totalValue,
                lastUpdated: product.updated_at || new Date()
            };
        });

        // Sort by total value descending
        reportRows.sort((a, b) => b.totalValue - a.totalValue);

        return reportRows;
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const valuationRows = rows as ValuationReportRow[];

        const totalProducts = valuationRows.length;
        const totalValue = valuationRows.reduce((sum, r) => sum + r.totalValue, 0);

        // Calculate value by category
        const categoryValues = new Map<string, number>();
        valuationRows.forEach(row => {
            const current = categoryValues.get(row.category) || 0;
            categoryValues.set(row.category, current + row.totalValue);
        });

        const topCategory = Array.from(categoryValues.entries())
            .sort((a, b) => b[1] - a[1])[0];

        return {
            'Total Products': totalProducts,
            'Total Inventory Value': this.formatCurrency(totalValue),
            'Average Value per Product': this.formatCurrency(totalProducts > 0 ? totalValue / totalProducts : 0),
            'Top Category': topCategory ? `${topCategory[0]} (${this.formatCurrency(topCategory[1])})` : 'N/A'
        };
    }

    validateFilters(filters: ReportFilter): ValidationResult {
        return {
            valid: true,
            errors: []
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
