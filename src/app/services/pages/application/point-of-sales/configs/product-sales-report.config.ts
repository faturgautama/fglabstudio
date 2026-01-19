import { ReportConfig, FilterType } from '../../../../../model/shared/report.model';
import { ProductSalesDataProvider } from '../data-providers/product-sales-data.provider';

export const PRODUCT_SALES_REPORT_CONFIG: ReportConfig = {
    type: 'product-sales',
    title: 'Laporan Penjualan Produk',
    description: 'Laporan penjualan per produk',
    dataProvider: ProductSalesDataProvider,
    availableFilters: [FilterType.PERIOD, FilterType.CUSTOM],
    columns: [
        { field: 'productName', header: 'Nama Produk', sortable: true, type: 'text' },
        { field: 'sku', header: 'SKU', sortable: true, type: 'text' },
        { field: 'category', header: 'Kategori', sortable: true, type: 'text' },
        { field: 'quantitySold', header: 'Qty Terjual', sortable: true, type: 'number' },
        { field: 'revenue', header: 'Revenue', sortable: true, type: 'currency' },
        { field: 'costPrice', header: 'Harga Pokok', sortable: true, type: 'currency' },
        { field: 'profit', header: 'Profit', sortable: true, type: 'currency' },
        { field: 'profitMargin', header: 'Margin (%)', sortable: true, type: 'percentage' }
    ],
    customFilters: [
        {
            key: 'category',
            label: 'Kategori',
            type: 'select',
            options: []
        }
    ]
};
