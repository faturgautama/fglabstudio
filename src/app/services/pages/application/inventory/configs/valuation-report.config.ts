import { ReportConfig, FilterType } from '../../../../../model/shared/report.model';
import { ValuationDataProvider } from '../data-providers/valuation-data.provider';

export const VALUATION_REPORT_CONFIG: ReportConfig = {
    type: 'valuation',
    title: 'Laporan Valuasi Inventory',
    description: 'Laporan nilai inventory berdasarkan harga beli',
    dataProvider: ValuationDataProvider,
    availableFilters: [FilterType.CUSTOM],
    columns: [
        { field: 'productName', header: 'Nama Produk', sortable: true, type: 'text' },
        { field: 'sku', header: 'SKU', sortable: true, type: 'text' },
        { field: 'category', header: 'Kategori', sortable: true, type: 'text' },
        { field: 'quantity', header: 'Qty', sortable: true, type: 'number' },
        { field: 'unitCost', header: 'Harga Satuan', sortable: true, type: 'currency' },
        { field: 'totalValue', header: 'Total Nilai', sortable: true, type: 'currency' },
        { field: 'lastUpdated', header: 'Terakhir Update', sortable: true, type: 'date' }
    ],
    customFilters: [
        {
            key: 'category',
            label: 'Kategori',
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
