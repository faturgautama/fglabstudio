import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { ReportContainerComponent } from '../../../../components/report/report-container/report-container';
import { ReportConfigRegistryService } from '../../../../services/shared/report-config-registry.service';
import { HRReportService } from '../../../../services/pages/application/human-resource/report.service';
import {
    ATTENDANCE_REPORT_CONFIG,
    PAYROLL_REPORT_CONFIG,
    LEAVE_REPORT_CONFIG,
    OVERTIME_REPORT_CONFIG,
    EMPLOYEE_REPORT_CONFIG
} from '../../../../services/pages/application/human-resource/configs';
import { ReportConfig } from '../../../../model/shared/report.model';
import { AttendanceDataProvider } from '../../../../services/pages/application/human-resource/data-providers/attendance-data.provider';
import { PayrollDataProvider } from '../../../../services/pages/application/human-resource/data-providers/payroll-data.provider';
import { LeaveDataProvider } from '../../../../services/pages/application/human-resource/data-providers/leave-data.provider';
import { OvertimeDataProvider } from '../../../../services/pages/application/human-resource/data-providers/overtime-data.provider';
import { EmployeeDataProvider } from '../../../../services/pages/application/human-resource/data-providers/employee-data.provider';

@Component({
    selector: 'app-hr-reports',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DshBaseLayout,
        ReportContainerComponent
    ],
    providers: [
        AttendanceDataProvider,
        PayrollDataProvider,
        LeaveDataProvider,
        OvertimeDataProvider,
        EmployeeDataProvider
    ],
    templateUrl: './reports.html',
    styleUrls: ['./reports.scss']
})
export class HRReportsComponent implements OnInit {
    private configRegistry = inject(ReportConfigRegistryService);
    reportService = inject(HRReportService);

    hrReportConfigs: ReportConfig[] = [];

    ngOnInit(): void {
        // Register all HR report configurations
        const configs = [
            ATTENDANCE_REPORT_CONFIG,
            PAYROLL_REPORT_CONFIG,
            LEAVE_REPORT_CONFIG,
            OVERTIME_REPORT_CONFIG,
            EMPLOYEE_REPORT_CONFIG
        ];

        this.configRegistry.registerConfigs(configs);
        this.hrReportConfigs = configs;
    }
}
