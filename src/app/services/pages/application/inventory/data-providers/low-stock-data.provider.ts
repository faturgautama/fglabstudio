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
import { LowStockReportRow } from '../../../../../model/pages/application/inventory/report.model';
import { DatabaseService } from '../../../../../app.database';

@Injectable()
export class LowStockDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchLowStockData(filters));
    }

    private async fetchLowStockData(filters: ReportFilter): Promise<LowStockReportRow[]> {
        await this.dbService.ensureReady();

        // Fetch products with low stock or out of stock
        let products = await this.dbService.db.products
            .where('is_active').equals(1)
            .toArray();

        // Filter only low stock products
        products = products.filter(p =>
            p.current_stock <= p.min_stock || p.current_stock === 0
        );

        // Apply category filter
        if (filters.filters?.has('category')) {
            const categoryId = filters.filters.get('category');
            products = products.filter(p => p.category_id === categoryId);
        }

        // Fetch categories for lookup
        const categories = await this.dbService.db.categories.toArray();
        const catMap = new Map(categories.map(c => [c.id?.toString() || '', c.name]));

        // Map to report rows
        const reportRows: LowStockReportRow[] = products.map(product => {
            let status = 'Low Stock';
            if (product.current_stock === 0) {
                status = 'Out of Stock';
            } else if (product.reorder_point && product.current_stock <= product.reorder_point) {
                status = 'Critical';
            }

            return {
                productName: product.name,
                sku: product.sku,
                category: catMap.get(product.category_id || '') || 'N/A',
                currentStock: product.current_stock,
                minStock: product.min_stock,
                reorderPoint: product.reorder_point || product.min_stock,
                status: status
            };
        });

        // Sort by status priority (Out of Stock > Critical > Low Stock)
        reportRows.sort((a, b) => {
            const statusPriority: any = { 'Out of Stock': 0, 'Critical': 1, 'Low Stock': 2 };
            return statusPriority[a.status] - statusPriority[b.status];
        });

        return reportRows;
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const lowStockRows = rows as LowStockReportRow[];

        const totalProducts = lowStockRows.length;
        const outOfStock = lowStockRows.filter(r => r.status === 'Out of Stock').length;
        const critical = lowStockRows.filter(r => r.status === 'Critical').length;
        const lowStock = lowStockRows.filter(r => r.status === 'Low Stock').length;

        return {
            'Total Low Stock Products': totalProducts,
            'Out of Stock': outOfStock,
            'Critical': critical,
            'Low Stock': lowStock
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
}
