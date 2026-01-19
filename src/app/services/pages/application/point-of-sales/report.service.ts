import { Injectable, inject, Injector } from '@angular/core';
import { ReportEngineService } from '../../../shared/report-engine.service';
import { IReportDataProvider } from '../../../../model/shared/report.model';
import { ReportConfigRegistryService } from '../../../shared/report-config-registry.service';
import { ExportService } from '../../../shared/export.service';

@Injectable({
    providedIn: 'root'
})
export class POSReportService extends ReportEngineService {
    private injector = inject(Injector);

    constructor(exportService: ExportService, configRegistry: ReportConfigRegistryService) {
        super(exportService, configRegistry);
    }

    protected override getDataProvider(providerType: any): IReportDataProvider {
        return this.injector.get(providerType);
    }
}
