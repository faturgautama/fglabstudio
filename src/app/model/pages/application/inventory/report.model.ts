import { ReportRow } from '../../../shared/report.model';

// Stock Report Row
export interface StockReportRow extends ReportRow {
    productId: string;
    sku: string;
    productName: string;
    category: string;
    warehouse: string;
    currentStock: number;
    minStock: number;
    stockValue: number;
    status: string;
}

// Stock Movement Report Row
export interface StockMovementReportRow extends ReportRow {
    movementNumber: string;
    movementDate: Date;
    type: string;
    productName: string;
    warehouse: string;
    quantity: number;
    unitCost: number;
    totalValue: number;
    reason: string;
}

// Purchase Order Report Row
export interface PurchaseOrderReportRow extends ReportRow {
    poNumber: string;
    orderDate: Date;
    supplierName: string;
    status: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
}

// Product Sales Report Row
export interface ProductSalesReportRow extends ReportRow {
    productName: string;
    category: string;
    totalSold: number;
    revenue: number;
    profit: number;
    profitMargin: number;
}

// Low Stock Report Row
export interface LowStockReportRow extends ReportRow {
    productName: string;
    sku: string;
    category: string;
    currentStock: number;
    minStock: number;
    reorderPoint: number;
    status: string;
}

// Valuation Report Row
export interface ValuationReportRow extends ReportRow {
    productName: string;
    sku: string;
    category: string;
    quantity: number;
    unitCost: number;
    totalValue: number;
    lastUpdated: Date;
}
