import { ReportRow } from '../../../shared/report.model';

// Daily Sales Report Row
export interface DailySalesReportRow extends ReportRow {
    date: Date;
    totalTransactions: number;
    totalItems: number;
    grossSales: number;
    discounts: number;
    netSales: number;
    cashPayments: number;
    qrisPayments: number;
    transferPayments: number;
}

// Transaction Report Row
export interface TransactionReportRow extends ReportRow {
    transactionNumber: string;
    transactionDate: Date;
    cashierName: string;
    subtotal: number;
    discountAmount: number;
    total: number;
    paymentMethod: string;
    amountPaid: number;
    changeAmount: number;
    status: string;
}

// Product Sales Report Row
export interface ProductSalesReportRow extends ReportRow {
    productName: string;
    sku: string;
    category: string;
    quantitySold: number;
    revenue: number;
    costPrice: number;
    profit: number;
    profitMargin: number;
}

// Cashier Performance Report Row
export interface CashierPerformanceReportRow extends ReportRow {
    cashierName: string;
    totalTransactions: number;
    totalItems: number;
    totalRevenue: number;
    avgTransactionValue: number;
    avgTransactionTime: number;
    transactionsPerHour: number;
}

// Payment Method Report Row
export interface PaymentMethodReportRow extends ReportRow {
    paymentMethod: string;
    transactionCount: number;
    totalAmount: number;
    percentage: number;
    avgTransactionValue: number;
}

// Discount Report Row
export interface DiscountReportRow extends ReportRow {
    discountCode: string;
    usageCount: number;
    totalDiscountAmount: number;
    affectedRevenue: number;
    effectiveness: number;
    avgDiscountPerTransaction: number;
}
