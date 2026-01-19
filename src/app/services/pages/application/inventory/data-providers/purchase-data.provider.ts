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
import { PurchaseOrderReportRow } from '../../../../../model/pages/application/inventory/report.model';
import { DatabaseService } from '../../../../../app.database';

@Injectable()
export class PurchaseDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchPurchaseData(filters));
    }

    private async fetchPurchaseData(filters: ReportFilter): Promise<PurchaseOrderReportRow[]> {
        await this.dbService.ensureReady();

        // Fetch all purchase orders
        let purchaseOrders = await this.dbService.db.purchase_orders
            .where('is_active').equals(1)
            .toArray();

        // Apply date range filter
        if (filters.startDate && filters.endDate) {
            const start = new Date(filters.startDate);
            const end = new Date(filters.endDate);
            purchaseOrders = purchaseOrders.filter(po => {
                const orderDate = new Date(po.order_date);
                return orderDate >= start && orderDate <= end;
            });
        }

        // Apply supplier filter
        if (filters.filters?.has('supplier')) {
            const supplierId = filters.filters.get('supplier');
            purchaseOrders = purchaseOrders.filter(po => po.supplier_id === supplierId);
        }

        // Apply status filter
        if (filters.filters?.has('status')) {
            const status = filters.filters.get('status');
            purchaseOrders = purchaseOrders.filter(po => po.status === status);
        }

        // Fetch suppliers for lookup
        const suppliers = await this.dbService.db.suppliers.toArray();
        const supplierMap = new Map(suppliers.map(s => [s.id?.toString() || '', s.name]));

        // Map to report rows
        const reportRows: PurchaseOrderReportRow[] = purchaseOrders.map(po => {
            return {
                poNumber: po.po_number,
                orderDate: po.order_date,
                supplierName: supplierMap.get(po.supplier_id) || 'N/A',
                status: po.status,
                subtotal: po.subtotal,
                taxAmount: po.tax_amount || 0,
                totalAmount: po.total_amount
            };
        });

        // Sort by date descending
        reportRows.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

        return reportRows;
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const purchaseRows = rows as PurchaseOrderReportRow[];

        const totalPurchases = purchaseRows.length;
        const totalAmount = purchaseRows.reduce((sum, r) => sum + r.totalAmount, 0);
        const avgOrderValue = totalPurchases > 0 ? totalAmount / totalPurchases : 0;

        // Calculate top suppliers
        const supplierTotals = new Map<string, number>();
        purchaseRows.forEach(row => {
            const current = supplierTotals.get(row.supplierName) || 0;
            supplierTotals.set(row.supplierName, current + row.totalAmount);
        });

        const topSupplier = Array.from(supplierTotals.entries())
            .sort((a, b) => b[1] - a[1])[0];

        return {
            'Total Purchase Orders': totalPurchases,
            'Total Amount': this.formatCurrency(totalAmount),
            'Average Order Value': this.formatCurrency(avgOrderValue),
            'Top Supplier': topSupplier ? `${topSupplier[0]} (${this.formatCurrency(topSupplier[1])})` : 'N/A'
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
                const suppliers = await this.dbService.db.suppliers
                    .where('is_active').equals(1)
                    .toArray();
                return suppliers.map(s => ({
                    label: s.name,
                    value: s.id
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
