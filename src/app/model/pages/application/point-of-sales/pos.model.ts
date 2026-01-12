export namespace POSModel {
    export interface Transaction {
        id?: number;
        transaction_number: string;
        transaction_date: Date;
        cashier_id: number;
        shift_id?: number;
        subtotal: number;
        discount_amount: number;
        discount_percentage: number;
        total: number;
        payment_method: 'CASH' | 'TRANSFER' | 'QRIS';
        amount_paid: number;
        change_amount: number;
        status: 'COMPLETED' | 'VOIDED';
        notes?: string;
        is_active?: boolean;
        created_at?: Date;
        updated_at?: Date;
        // Relations (populated by service)
        items?: TransactionItem[];
        cashier?: { full_name: string };
    }

    export interface TransactionItem {
        id?: number;
        transaction_id: number;
        product_id: number;
        product_name: string;
        product_sku: string;
        quantity: number;
        unit_price: number;
        discount_amount: number;
        discount_percentage: number;
        subtotal: number;
        is_active?: boolean;
        created_at?: Date;
    }

    export interface Shift {
        id?: number;
        shift_number: string;
        cashier_id: number;
        start_time: Date;
        end_time?: Date;
        initial_cash: number;
        expected_cash?: number;
        actual_cash?: number;
        discrepancy?: number;
        total_sales: number;
        total_transactions: number;
        status: 'OPEN' | 'CLOSED';
        notes?: string;
        is_active?: boolean;
        created_at?: Date;
        updated_at?: Date;
    }

    export interface Setting {
        id?: number;
        store_name: string;
        store_address?: string;
        store_phone?: string;
        store_logo?: string;
        transaction_prefix: string;
        enable_shift: boolean;
        bank_name?: string;
        bank_account?: string;
        bank_holder?: string;
        qris_image?: string;
        receipt_footer?: string;
        is_active?: boolean;
        created_at?: Date;
        updated_at?: Date;
    }

    export interface CartItem {
        product_id: number;
        product_name: string;
        product_sku: string;
        quantity: number;
        unit_price: number;
        discount_amount: number;
        discount_percentage: number;
        subtotal: number;
        current_stock: number;
    }

    export interface Cart {
        items: CartItem[];
        subtotal: number;
        discount_amount: number;
        discount_percentage: number;
        total: number;
    }
}
