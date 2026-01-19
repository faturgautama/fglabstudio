import { Injectable, Injector } from '@angular/core';
import { ReportEngineService } from '../../../shared/report-engine.service';
import { ExportService } from '../../../shared/export.service';
import { ReportConfigRegistryService } from '../../../shared/report-config-registry.service';
import { ReportConfig, IReportDataProvider } from '../../../../model/shared/report.model';
import { AttendanceDataProvider } from './data-providers/attendance-data.provider';
import { PayrollDataProvider } from './data-providers/payroll-data.provider';
import { LeaveDataProvider } from './data-providers/leave-data.provider';
import { OvertimeDataProvider } from './data-providers/overtime-data.provider';
import { EmployeeDataProvider } from './data-providers/employee-data.provider';

@Injectable({ providedIn: 'root' })
export class HRReportService extends ReportEngineService {
    private dataProviders = new Map<any, IReportDataProvider>();

    constructor(
        exportService: ExportService,
        configRegistry: ReportConfigRegistryService,
        private injector: Injector
    ) {
        super(exportService, configRegistry);
    }

    protected getDataProvider(config: ReportConfig): IReportDataProvider {
        const providerType = config.dataProvider;

        if (!this.dataProviders.has(providerType)) {
            const provider = this.injector.get(providerType);
            this.dataProviders.set(providerType, provider);
        }

        return this.dataProviders.get(providerType)!;
    }
}
