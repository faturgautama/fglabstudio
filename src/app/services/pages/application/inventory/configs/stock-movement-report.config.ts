import { ReportConfig, FilterType } from '../../../../../model/shared/report.model';
import { StockMovementDataProvider } from '../data-providers/stock-movement-data.provider';

export const STOCK_MOVEMENT_REPORT_CONFIG: ReportConfig = {
    type: 'stock-movement',
    title: 'Laporan Pergerakan Stok',
    description: 'Laporan detail pergerakan stok masuk dan keluar',
    dataProvider: StockMovementDataProvider,
    availableFilters: [FilterType.PERIOD, FilterType.CUSTOM],
    columns: [
        { field: 'movementNumber', header: 'No. Movement', sortable: true, type: 'text' },
        { field: 'movementDate', header: 'Tanggal', sortable: true, type: 'date' },
        { field: 'type', header: 'Tipe', sortable: true, type: 'text' },
        { field: 'productName', header: 'Produk', sortable: true, type: 'text' },
        { field: 'warehouse', header: 'Gudang', sortable: true, type: 'text' },
        { field: 'quantity', header: 'Qty', sortable: true, type: 'number' },
        { field: 'unitCost', header: 'Harga Satuan', sortable: true, type: 'currency' },
        { field: 'totalValue', header: 'Total Nilai', sortable: true, type: 'currency' },
        { field: 'reason', header: 'Alasan', sortable: false, type: 'text' }
    ],
    customFilters: [
        {
            key: 'movementType',
            label: 'Tipe Movement',
            type: 'select',
            options: [
                { label: 'Semua', value: null },
                { label: 'Masuk', value: 'IN' },
                { label: 'Keluar', value: 'OUT' },
                { label: 'Adjustment', value: 'ADJUSTMENT' },
                { label: 'Transfer', value: 'TRANSFER' }
            ]
        },
        {
            key: 'product',
            label: 'Produk',
            type: 'select',
            options: []
        },
        {
            key: 'warehouse',
            label: 'Gudang',
            type: 'select',
            options: []
        }
    ]
};
