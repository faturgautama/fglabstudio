import { ReportConfig, FilterType } from '../../../../../model/shared/report.model';
import { PaymentMethodDataProvider } from '../data-providers/payment-method-data.provider';

export const PAYMENT_METHOD_REPORT_CONFIG: ReportConfig = {
    type: 'payment-method',
    title: 'Laporan Metode Pembayaran',
    description: 'Laporan breakdown metode pembayaran',
    dataProvider: PaymentMethodDataProvider,
    availableFilters: [FilterType.PERIOD, FilterType.CUSTOM],
    columns: [
        { field: 'paymentMethod', header: 'Metode Pembayaran', sortable: true, type: 'text' },
        { field: 'transactionCount', header: 'Jumlah Transaksi', sortable: true, type: 'number' },
        { field: 'totalAmount', header: 'Total Amount', sortable: true, type: 'currency' },
        { field: 'percentage', header: 'Persentase (%)', sortable: true, type: 'percentage' },
        { field: 'avgTransactionValue', header: 'Rata-rata Nilai', sortable: true, type: 'currency' }
    ],
    customFilters: [
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
