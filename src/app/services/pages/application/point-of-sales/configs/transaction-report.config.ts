import { ReportConfig, FilterType } from '../../../../../model/shared/report.model';
import { TransactionDataProvider } from '../data-providers/transaction-data.provider';

export const TRANSACTION_REPORT_CONFIG: ReportConfig = {
    type: 'transaction',
    title: 'Laporan Transaksi',
    description: 'Laporan detail semua transaksi',
    dataProvider: TransactionDataProvider,
    availableFilters: [FilterType.PERIOD, FilterType.CUSTOM],
    columns: [
        { field: 'transactionNumber', header: 'No. Transaksi', sortable: true, type: 'text' },
        { field: 'transactionDate', header: 'Tanggal', sortable: true, type: 'date' },
        { field: 'cashierName', header: 'Kasir', sortable: true, type: 'text' },
        { field: 'subtotal', header: 'Subtotal', sortable: true, type: 'currency' },
        { field: 'discountAmount', header: 'Diskon', sortable: true, type: 'currency' },
        { field: 'total', header: 'Total', sortable: true, type: 'currency' },
        { field: 'paymentMethod', header: 'Metode Bayar', sortable: true, type: 'text' },
        { field: 'amountPaid', header: 'Dibayar', sortable: true, type: 'currency' },
        { field: 'changeAmount', header: 'Kembalian', sortable: true, type: 'currency' },
        { field: 'status', header: 'Status', sortable: true, type: 'text' }
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
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { label: 'Semua', value: null },
                { label: 'Completed', value: 'COMPLETED' },
                { label: 'Voided', value: 'VOIDED' }
            ]
        }
    ]
};
