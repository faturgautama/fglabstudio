import { ReportConfig, FilterType } from '../../../../../model/shared/report.model';
import { CashierPerformanceDataProvider } from '../data-providers/cashier-performance-data.provider';

export const CASHIER_PERFORMANCE_REPORT_CONFIG: ReportConfig = {
    type: 'cashier-performance',
    title: 'Laporan Performa Kasir',
    description: 'Laporan performa dan produktivitas kasir',
    dataProvider: CashierPerformanceDataProvider,
    availableFilters: [FilterType.PERIOD, FilterType.CUSTOM],
    columns: [
        { field: 'cashierName', header: 'Nama Kasir', sortable: true, type: 'text' },
        { field: 'totalTransactions', header: 'Total Transaksi', sortable: true, type: 'number' },
        { field: 'totalItems', header: 'Total Item', sortable: true, type: 'number' },
        { field: 'totalRevenue', header: 'Total Revenue', sortable: true, type: 'currency' },
        { field: 'avgTransactionValue', header: 'Rata-rata Nilai Transaksi', sortable: true, type: 'currency' },
        { field: 'transactionsPerHour', header: 'Transaksi/Jam', sortable: true, type: 'number' }
    ],
    customFilters: [
        {
            key: 'cashier',
            label: 'Kasir',
            type: 'select',
            options: []
        }
    ]
};
