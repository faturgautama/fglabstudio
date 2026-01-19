import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ReportFiltersComponent } from '../report-filters/report-filters';
import { ReportPreviewComponent } from '../report-preview/report-preview';
import { ReportSummaryComponent } from '../report-summary/report-summary';
import {
    ReportConfig,
    ReportFilter,
    ReportData,
    ExportFormat
} from '../../../model/shared/report.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-report-container',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SelectModule,
        ButtonModule,
        CardModule,
        MessageModule,
        ReportFiltersComponent,
        ReportPreviewComponent,
        ReportSummaryComponent
    ],
    templateUrl: './report-container.html',
    styleUrls: ['./report-container.scss']
})
export class ReportContainerComponent implements OnInit {
    @Input() reportConfigs: ReportConfig[] = [];
    @Input() defaultReportType?: string;
    @Input() reportService: any;

    selectedReportType?: string;
    selectedConfig?: ReportConfig;
    currentReportData?: ReportData;
    loading: boolean = false;
    error?: string;

    reportTypeOptions: { label: string; value: string }[] = [];
    ExportFormat = ExportFormat;

    ngOnInit(): void {
        this.reportTypeOptions = this.reportConfigs.map(config => ({
            label: config.title,
            value: config.type
        }));

        if (this.defaultReportType) {
            this.selectReportType(this.defaultReportType);
        } else if (this.reportConfigs.length > 0) {
            this.selectReportType(this.reportConfigs[0].type);
        }
    }

    selectReportType(type: string): void {
        this.selectedReportType = type;
        this.selectedConfig = this.reportConfigs.find(c => c.type === type);
        this.currentReportData = undefined;
        this.error = undefined;
    }

    generateReport(filters: ReportFilter): void {
        if (!this.reportService) {
            this.error = 'Report service not available';
            return;
        }

        this.loading = true;
        this.error = undefined;

        this.reportService.generateReport(filters).subscribe({
            next: (data: ReportData) => {
                this.currentReportData = data;
                this.loading = false;
            },
            error: (err: any) => {
                this.error = err.message || 'Failed to generate report';
                this.loading = false;
                console.error('Report generation error:', err);
            }
        });
    }

    exportReport(format: ExportFormat): void {
        if (!this.currentReportData || !this.selectedConfig || !this.reportService) {
            return;
        }

        this.loading = true;
        this.reportService.exportReport(this.currentReportData, this.selectedConfig, format).subscribe({
            next: () => {
                this.loading = false;
            },
            error: (err: any) => {
                this.error = `Failed to export report: ${err.message}`;
                this.loading = false;
                console.error('Export error:', err);
            }
        });
    }

    printReport(): void {
        window.print();
    }

    clearReport(): void {
        this.currentReportData = undefined;
        this.error = undefined;
    }

    getDataProvider(): any {
        if (!this.selectedConfig) return undefined;
        return this.reportService?.getDataProvider?.(this.selectedConfig);
    }
}
