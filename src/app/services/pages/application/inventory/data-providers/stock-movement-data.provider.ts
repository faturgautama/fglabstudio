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
import { StockMovementReportRow } from '../../../../../model/pages/application/inventory/report.model';
import { DatabaseService } from '../../../../../app.database';

@Injectable()
export class StockMovementDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchStockMovementData(filters));
    }

    private async fetchStockMovementData(filters: ReportFilter): Promise<StockMovementReportRow[]> {
        await this.dbService.ensureReady();

        // Fetch all stock movements
        let movements = await this.dbService.db.stock_movements
            .where('is_active').equals(1)
            .toArray();

        // Apply date range filter
        if (filters.startDate && filters.endDate) {
            const start = new Date(filters.startDate);
            const end = new Date(filters.endDate);
            movements = movements.filter(m => {
                const movementDate = new Date(m.movement_date);
                return movementDate >= start && movementDate <= end;
            });
        }

        // Apply movement type filter
        if (filters.filters?.has('movementType')) {
            const movementType = filters.filters.get('movementType');
            movements = movements.filter(m => m.type === movementType);
        }

        // Apply product filter
        if (filters.filters?.has('product')) {
            const productId = filters.filters.get('product');
            movements = movements.filter(m => m.product_id === productId);
        }

        // Apply warehouse filter
        if (filters.filters?.has('warehouse')) {
            const warehouseId = filters.filters.get('warehouse');
            movements = movements.filter(m => m.warehouse_id === warehouseId);
        }

        // Fetch products and warehouses for lookup
        const products = await this.dbService.db.products.toArray();
        const productMap = new Map(products.map(p => [p.id, p.name]));

        const warehouses = await this.dbService.db.warehouses.toArray();
        const warehouseMap = new Map(warehouses.map(w => [w.id, w.name]));

        // Map to report rows
        const reportRows: StockMovementReportRow[] = movements.map(movement => {
            return {
                movementNumber: movement.movement_number,
                movementDate: movement.movement_date,
                type: movement.type,
                productName: productMap.get(movement.product_id) || 'N/A',
                warehouse: warehouseMap.get(movement.warehouse_id) || 'N/A',
                quantity: movement.quantity,
                unitCost: movement.unit_cost || 0,
                totalValue: movement.total_value || 0,
                reason: movement.reason || ''
            };
        });

        // Sort by date descending
        reportRows.sort((a, b) => new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime());

        return reportRows;
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const movementRows = rows as StockMovementReportRow[];

        const totalMovements = movementRows.length;
        const quantityIn = movementRows.filter(r => r.type === 'IN').reduce((sum, r) => sum + r.quantity, 0);
        const quantityOut = movementRows.filter(r => r.type === 'OUT').reduce((sum, r) => sum + r.quantity, 0);
        const netChange = quantityIn - quantityOut;
        const totalValue = movementRows.reduce((sum, r) => sum + r.totalValue, 0);

        return {
            'Total Movements': totalMovements,
            'Quantity In': quantityIn,
            'Quantity Out': quantityOut,
            'Net Change': netChange,
            'Total Value': this.formatCurrency(totalValue)
        };
    }

    validateFilters(filters: ReportFilter): ValidationResult {
        const errors: { field: string; message: string }[] = [];

        if (filters.startDate && filters.endDate) {
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
                const products = await this.dbService.db.products
                    .where('is_active').equals(1)
                    .toArray();
                return products.map(p => ({
                    label: p.name,
                    value: p.id
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
