import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
    ReportFilter,
    ReportData,
    ReportConfig,
    ReportMetadata,
    ExportFormat,
    ValidationResult,
    IReportDataProvider
} from '../../model/shared/report.model';
import { ExportService } from './export.service';
import { ReportConfigRegistryService } from './report-config-registry.service';

@Injectable()
export abstract class ReportEngineService {
    constructor(
        protected exportService: ExportService,
        protected configRegistry: ReportConfigRegistryService
    ) { }

    generateReport(filters: ReportFilter): Observable<ReportData> {
        const config = this.configRegistry.getConfig(filters.reportType);
        const provider = this.getDataProvider(config);

        return provider.fetchData(filters).pipe(
            map(rows => ({
                metadata: this.createMetadata(filters, rows.length),
                summary: provider.calculateSummary(rows),
                rows: rows
            })),
            catchError(error => this.handleError(error))
        );
    }

    getReportConfig(type: string): ReportConfig {
        return this.configRegistry.getConfig(type);
    }

    getAvailableReportTypes(): string[] {
        return this.configRegistry.getAllTypes();
    }

    validateFilters(filters: ReportFilter): Observable<ValidationResult> {
        const config = this.configRegistry.getConfig(filters.reportType);
        const provider = this.getDataProvider(config);
        return of(provider.validateFilters(filters));
    }

    exportReport(data: ReportData, config: ReportConfig, format: ExportFormat): Observable<void> {
        return this.exportService.exportReport(data, config, format);
    }

    protected abstract getDataProvider(config: ReportConfig): IReportDataProvider;

    protected handleError(error: any): Observable<never> {
        console.error('Report generation error:', error);
        return throwError(() => new Error('Failed to generate report'));
    }

    private createMetadata(filters: ReportFilter, totalRows: number): ReportMetadata {
        const config = this.configRegistry.getConfig(filters.reportType);
        return {
            reportType: filters.reportType,
            title: config.title,
            generatedAt: new Date(),
            filters: filters,
            totalRows: totalRows
        };
    }
}
