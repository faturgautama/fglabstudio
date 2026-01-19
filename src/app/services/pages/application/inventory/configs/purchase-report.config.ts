import { ReportConfig, FilterType } from '../../../../../model/shared/report.model';
import { PurchaseDataProvider } from '../data-providers/purchase-data.provider';

export const PURCHASE_REPORT_CONFIG: ReportConfig = {
    type: 'purchase',
    title: 'Laporan Purchase Order',
    description: 'Laporan detail purchase order dan pembelian',
    dataProvider: PurchaseDataProvider,
    availableFilters: [FilterType.PERIOD, FilterType.CUSTOM],
    columns: [
        { field: 'poNumber', header: 'No. PO', sortable: true, type: 'text' },
        { field: 'orderDate', header: 'Tanggal Order', sortable: true, type: 'date' },
        { field: 'supplierName', header: 'Supplier', sortable: true, type: 'text' },
        { field: 'status', header: 'Status', sortable: true, type: 'text' },
        { field: 'subtotal', header: 'Subtotal', sortable: true, type: 'currency' },
        { field: 'taxAmount', header: 'Pajak', sortable: true, type: 'currency' },
        { field: 'totalAmount', header: 'Total', sortable: true, type: 'currency' }
    ],
    customFilters: [
        {
            key: 'supplier',
            label: 'Supplier',
            type: 'select',
            options: []
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { label: 'Semua', value: null },
                { label: 'Draft', value: 'DRAFT' },
                { label: 'Submitted', value: 'SUBMITTED' },
                { label: 'Partial', value: 'PARTIAL' },
                { label: 'Received', value: 'RECEIVED' },
                { label: 'Cancelled', value: 'CANCELLED' }
            ]
        }
    ]
};
