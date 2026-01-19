import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { ReportContainerComponent } from '../../../../components/report/report-container/report-container';
import { ReportConfigRegistryService } from '../../../../services/shared/report-config-registry.service';
import { POSReportService } from '../../../../services/pages/application/point-of-sales/report.service';
import {
    DAILY_SALES_REPORT_CONFIG,
    TRANSACTION_REPORT_CONFIG,
    PRODUCT_SALES_REPORT_CONFIG,
    CASHIER_PERFORMANCE_REPORT_CONFIG,
    PAYMENT_METHOD_REPORT_CONFIG
} from '../../../../services/pages/application/point-of-sales/configs';
import { ReportConfig } from '../../../../model/shared/report.model';
import { DailySalesDataProvider } from '../../../../services/pages/application/point-of-sales/data-providers/daily-sales-data.provider';
import { TransactionDataProvider } from '../../../../services/pages/application/point-of-sales/data-providers/transaction-data.provider';
import { ProductSalesDataProvider } from '../../../../services/pages/application/point-of-sales/data-providers/product-sales-data.provider';
import { CashierPerformanceDataProvider } from '../../../../services/pages/application/point-of-sales/data-providers/cashier-performance-data.provider';
import { PaymentMethodDataProvider } from '../../../../services/pages/application/point-of-sales/data-providers/payment-method-data.provider';

@Component({
    selector: 'app-pos-reports',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DshBaseLayout,
        ReportContainerComponent
    ],
    providers: [
        DailySalesDataProvider,
        TransactionDataProvider,
        ProductSalesDataProvider,
        CashierPerformanceDataProvider,
        PaymentMethodDataProvider
    ],
    templateUrl: './reports.html',
    styleUrls: ['./reports.scss']
})
export class POSReports implements OnInit {
    private configRegistry = inject(ReportConfigRegistryService);
    reportService = inject(POSReportService);

    posReportConfigs: ReportConfig[] = [];

    ngOnInit(): void {
        // Register all POS report configurations
        const configs = [
            DAILY_SALES_REPORT_CONFIG,
            TRANSACTION_REPORT_CONFIG,
            PRODUCT_SALES_REPORT_CONFIG,
            CASHIER_PERFORMANCE_REPORT_CONFIG,
            PAYMENT_METHOD_REPORT_CONFIG
        ];

        this.configRegistry.registerConfigs(configs);
        this.posReportConfigs = configs;
    }
}
