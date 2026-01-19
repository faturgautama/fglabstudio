import { ReportConfig, FilterType } from '../../../../../model/shared/report.model';
import { StockDataProvider } from '../data-providers/stock-data.provider';

export const STOCK_REPORT_CONFIG: ReportConfig = {
    type: 'stock',
    title: 'Stock Report',
    description: 'Current stock levels and values for all products',
    availableFilters: [
        FilterType.CUSTOM
    ],
    columns: [
        {
            field: 'sku',
            header: 'SKU',
            type: 'text',
            sortable: true,
            width: '120px'
        },
        {
            field: 'productName',
            header: 'Product Name',
            type: 'text',
            sortable: true,
            width: '250px'
        },
        {
            field: 'category',
            header: 'Category',
            type: 'text',
            sortable: true,
            width: '150px'
        },
        {
            field: 'currentStock',
            header: 'Current Stock',
            type: 'number',
            sortable: true,
            width: '120px'
        },
        {
            field: 'minStock',
            header: 'Min Stock',
            type: 'number',
            sortable: true,
            width: '100px'
        },
        {
            field: 'stockValue',
            header: 'Stock Value',
            type: 'currency',
            sortable: true,
            width: '150px'
        },
        {
            field: 'status',
            header: 'Status',
            type: 'text',
            sortable: true,
            width: '120px'
        }
    ],
    dataProvider: StockDataProvider,
    customFilters: [
        {
            key: 'category',
            label: 'Category',
            type: 'select',
            required: false
        }
    ]
};
