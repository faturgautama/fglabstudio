import { ReportConfig, FilterType } from '../../../../../model/shared/report.model';
import { DailySalesDataProvider } from '../data-providers/daily-sales-data.provider';

export const DAILY_SALES_REPORT_CONFIG: ReportConfig = {
    type: 'daily-sales',
    title: 'Laporan Penjualan Harian',
    description: 'Laporan ringkasan penjualan per hari',
    dataProvider: DailySalesDataProvider,
    availableFilters: [FilterType.PERIOD, FilterType.CUSTOM],
    columns: [
        { field: 'date', header: 'Tanggal', sortable: true, type: 'date' },
        { field: 'totalTransactions', header: 'Total Transaksi', sortable: true, type: 'number' },
        { field: 'totalItems', header: 'Total Item', sortable: true, type: 'number' },
        { field: 'grossSales', header: 'Penjualan Kotor', sortable: true, type: 'currency' },
        { field: 'discounts', header: 'Diskon', sortable: true, type: 'currency' },
        { field: 'netSales', header: 'Penjualan Bersih', sortable: true, type: 'currency' },
        { field: 'cashPayments', header: 'Pembayaran Cash', sortable: true, type: 'currency' },
        { field: 'qrisPayments', header: 'Pembayaran QRIS', sortable: true, type: 'currency' },
        { field: 'transferPayments', header: 'Pembayaran Transfer', sortable: true, type: 'currency' }
    ],
    customFilters: [
        {
            key: 'cashier',
            label: 'Kasir',
            type: 'select',
            options: []
        },
        {
            key: 'paymentMethod',
            label: 'Metode Pembayaran',
            type: 'select',
            options: [
                { label: 'Semua', value: null },
                { label: 'Cash', value: 'CASH' },
                { label: 'QRIS', value: 'QRIS' },
                { label: 'Transfer', value: 'TRANSFER' }
            ]
        }
    ]
};
