import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ReportSummary } from '../../../model/shared/report.model';

@Component({
    selector: 'app-report-summary',
    standalone: true,
    imports: [CommonModule, CardModule],
    templateUrl: './report-summary.html',
    styleUrls: ['./report-summary.scss']
})
export class ReportSummaryComponent {
    @Input() summary?: ReportSummary;

    getSummaryEntries(): [string, number | string][] {
        if (!this.summary) {
            return [];
        }
        return Object.entries(this.summary);
    }

    formatKey(key: string): string {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }
}
