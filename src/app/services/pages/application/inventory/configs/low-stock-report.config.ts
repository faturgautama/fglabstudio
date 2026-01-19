import { ReportConfig, FilterType } from '../../../../../model/shared/report.model';
import { LowStockDataProvider } from '../data-providers/low-stock-data.provider';

export const LOW_STOCK_REPORT_CONFIG: ReportConfig = {
    type: 'low-stock',
    title: 'Low Stock Report',
    description: 'Products with low stock levels that need reordering',
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
            field: 'reorderPoint',
            header: 'Reorder Point',
            type: 'number',
            sortable: true,
            width: '120px'
        },
        {
            field: 'status',
            header: 'Status',
            type: 'text',
            sortable: true,
            width: '120px'
        }
    ],
    dataProvider: LowStockDataProvider,
    customFilters: [
        {
            key: 'category',
            label: 'Category',
            type: 'select',
            required: false
        }
    ]
};
