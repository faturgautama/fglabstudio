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
import { StockReportRow } from '../../../../../model/pages/application/inventory/report.model';
import { DatabaseService } from '../../../../../app.database';

@Injectable()
export class StockDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchStockData(filters));
    }

    private async fetchStockData(filters: ReportFilter): Promise<StockReportRow[]> {
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
            // Filter by warehouse stock
            const warehouseStocks = await this.dbService.db.product_warehouse_stock
                .where('warehouse_id').equals(warehouseId)
                .toArray();
            const productIds = warehouseStocks.map(ws => ws.product_id);
            products = products.filter(p => p.id !== undefined && productIds.includes(p.id));
        }

        // Fetch categories and warehouses for lookup
        const categories = await this.dbService.db.categories.toArray();
        const catMap = new Map(categories.map(c => [c.id?.toString() || '', c.name]));

        const warehouses = await this.dbService.db.warehouses.toArray();
        const warehouseMap = new Map(warehouses.map(w => [w.id, w.name]));

        // Map to report rows
        const reportRows: StockReportRow[] = products.map(product => {
            const stockValue = product.current_stock * product.purchase_price;
            let status = 'Normal';

            if (product.current_stock === 0) {
                status = 'Out of Stock';
            } else if (product.current_stock <= product.min_stock) {
                status = 'Low Stock';
            } else if (product.reorder_point && product.current_stock <= product.reorder_point) {
                status = 'Reorder';
            }

            return {
                productId: product.id?.toString() || '',
                sku: product.sku,
                productName: product.name,
                category: catMap.get(product.category_id || '') || 'N/A',
                warehouse: 'All Warehouses', // Default
                currentStock: product.current_stock,
                minStock: product.min_stock,
                stockValue: stockValue,
                status: status
            };
        });

        return reportRows;
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const stockRows = rows as StockReportRow[];

        const totalProducts = stockRows.length;
        const totalStockValue = stockRows.reduce((sum, row) => sum + row.stockValue, 0);
        const outOfStock = stockRows.filter(r => r.status === 'Out of Stock').length;
        const lowStock = stockRows.filter(r => r.status === 'Low Stock').length;
        const avgStockValue = totalProducts > 0 ? totalStockValue / totalProducts : 0;

        return {
            'Total Products': totalProducts,
            'Total Stock Value': this.formatCurrency(totalStockValue),
            'Out of Stock': outOfStock,
            'Low Stock': lowStock,
            'Average Stock Value': this.formatCurrency(avgStockValue)
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
                // For category filter
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
