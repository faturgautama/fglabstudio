import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { ReportContainerComponent } from '../../../../components/report/report-container/report-container';
import { ReportConfigRegistryService } from '../../../../services/shared/report-config-registry.service';
import { InventoryReportService } from '../../../../services/pages/application/inventory/report.service';
import {
    STOCK_REPORT_CONFIG,
    LOW_STOCK_REPORT_CONFIG,
    STOCK_MOVEMENT_REPORT_CONFIG,
    PURCHASE_REPORT_CONFIG,
    VALUATION_REPORT_CONFIG
} from '../../../../services/pages/application/inventory/configs';
import { ReportConfig } from '../../../../model/shared/report.model';
import { StockDataProvider } from '../../../../services/pages/application/inventory/data-providers/stock-data.provider';
import { LowStockDataProvider } from '../../../../services/pages/application/inventory/data-providers/low-stock-data.provider';
import { StockMovementDataProvider } from '../../../../services/pages/application/inventory/data-providers/stock-movement-data.provider';
import { PurchaseDataProvider } from '../../../../services/pages/application/inventory/data-providers/purchase-data.provider';
import { ValuationDataProvider } from '../../../../services/pages/application/inventory/data-providers/valuation-data.provider';

@Component({
    selector: 'app-inventory-reports',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DshBaseLayout,
        ReportContainerComponent
    ],
    providers: [
        StockDataProvider,
        LowStockDataProvider,
        StockMovementDataProvider,
        PurchaseDataProvider,
        ValuationDataProvider
    ],
    templateUrl: './reports.html',
    styleUrls: ['./reports.scss']
})
export class InventoryReports implements OnInit {
    private configRegistry = inject(ReportConfigRegistryService);
    reportService = inject(InventoryReportService);

    inventoryReportConfigs: ReportConfig[] = [];

    ngOnInit(): void {
        // Register all Inventory report configurations
        const configs = [
            STOCK_REPORT_CONFIG,
            LOW_STOCK_REPORT_CONFIG,
            STOCK_MOVEMENT_REPORT_CONFIG,
            PURCHASE_REPORT_CONFIG,
            VALUATION_REPORT_CONFIG
        ];

        this.configRegistry.registerConfigs(configs);
        this.inventoryReportConfigs = configs;
    }
}
