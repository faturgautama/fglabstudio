import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ReportData, ReportColumn } from '../../../model/shared/report.model';
import { ViewportService } from '../../../services/shared/viewport.service';

@Component({
    selector: 'app-report-preview',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule],
    templateUrl: './report-preview.html',
    styleUrls: ['./report-preview.scss']
})
export class ReportPreviewComponent implements OnInit {
    @Input() reportData?: ReportData;
    @Input() columns: ReportColumn[] = [];
    @Input() loading: boolean = false;

    private viewportService = inject(ViewportService);
    isMobile: boolean = false;
    visibleColumns: ReportColumn[] = [];

    ngOnInit(): void {
        this.isMobile = this.viewportService.isMobile();
        this.updateVisibleColumns();
    }

    updateVisibleColumns(): void {
        if (this.isMobile) {
            this.visibleColumns = this.columns.slice(0, 3);
        } else {
            this.visibleColumns = this.columns;
        }
    }

    formatCellValue(value: any, column: ReportColumn): string {
        if (value === null || value === undefined) {
            return '-';
        }

        if (column.formatter) {
            return column.formatter(value);
        }

        switch (column.type) {
            case 'currency':
                return this.formatCurrency(value);
            case 'percentage':
                return this.formatPercentage(value);
            case 'date':
                return this.formatDate(value);
            case 'number':
                return this.formatNumber(value);
            case 'boolean':
                return value ? 'Yes' : 'No';
            default:
                return String(value);
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

    private formatPercentage(value: number): string {
        return `${value.toFixed(2)}%`;
    }

    private formatDate(value: Date | string): string {
        const date = value instanceof Date ? value : new Date(value);
        return date.toLocaleDateString('id-ID');
    }

    private formatNumber(value: number): string {
        return value.toLocaleString('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    exportToCsv(): void {
        if (!this.reportData) return;

        const headers = this.columns.map(col => col.header).join(',');
        const rows = this.reportData.rows.map(row => {
            return this.columns.map(col => {
                const value = row[col.field];
                return `"${this.formatCellValue(value, col)}"`;
            }).join(',');
        });

        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${this.reportData.metadata.reportType}_report.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
