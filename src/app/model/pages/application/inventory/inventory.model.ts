export namespace InventoryModel {
    export interface Company {
        id?: number;
        name: string;
        logo?: string;
        address?: string;
        phone?: string;
        email?: string;
        currency: string;
        sku_prefix: string;
        created_at?: Date;
        updated_at?: Date;
    }

    export interface Category {
        id?: number;
        name: string;
        description?: string;
        color?: string;
        created_at?: Date;
        is_active?: boolean;
    }

    export interface Product {
        id?: number;
        sku: string;
        barcode?: string;
        name: string;
        description?: string;
        category_id?: string;
        unit: string;
        unit_weight?: number;
        unit_volume?: number;
        current_stock: number;
        min_stock: number;
        max_stock?: number;
        reorder_point?: number;
        purchase_price: number;
        selling_price: number;
        wholesale_price?: number;
        margin_percentage?: number;
        brand?: string;
        manufacturer?: string;
        model_number?: string;
        warehouse_location?: string;
        is_batch_tracked: boolean;
        is_serial_tracked: boolean;
        expiry_date?: Date;
        manufacturing_date?: Date;
        image_url?: string;
        additional_images?: string[];
        default_supplier_id?: string;
        supplier_sku?: string;
        lead_time_days?: number;
        tax_rate?: number;
        cogs?: number;
        is_active: boolean;
        is_sellable: boolean;
        is_purchasable: boolean;
        is_perishable: boolean;
        is_serialized: boolean;
        total_sold?: number;
        total_purchased?: number;
        last_sold_at?: Date;
        last_purchased_at?: Date;
        slug?: string;
        meta_description?: string;
        tags?: string[];
        length_cm?: number;
        width_cm?: number;
        height_cm?: number;
        weight_kg?: number;
        notes?: string;
        handling_notes?: string;
        storage_requirements?: string;
        created_at?: Date;
        updated_at?: Date;
        created_by?: string;
        updated_by?: string;
    }

    export interface StockCard {
        id?: number;
        product_id: number;
        warehouse_id: number;
        transaction_date: Date;
        type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
        reference_type?: string;
        reference_id?: number;
        qty_in: number;
        qty_out: number;
        balance: number;
        unit_cost?: number;
        total_value?: number;
        batch_number?: string;
        serial_number?: string;
        expiry_date?: Date;
        notes?: string;
        created_at?: Date;
        created_by?: string;
    }

    export interface Supplier {
        id?: number;
        name: string;
        code?: string;
        contact_person?: string;
        phone?: string;
        mobile?: string;
        email?: string;
        website?: string;
        address?: string;
        city?: string;
        postal_code?: string;
        country?: string;
        payment_terms?: string;
        payment_method?: string;
        bank_name?: string;
        bank_account?: string;
        tax_id?: string;
        is_pkp: boolean;
        rating?: number;
        total_orders?: number;
        total_amount?: number;
        average_lead_time?: number;
        is_active: boolean;
        notes?: string;
        created_at?: Date;
        updated_at?: Date;
    }

    export interface PurchaseOrder {
        id?: number;
        po_number: string;
        supplier_id: string;
        warehouse_id: number;
        order_date: Date;
        expected_date?: Date;
        received_date?: Date;
        status: 'DRAFT' | 'SUBMITTED' | 'PARTIAL' | 'RECEIVED' | 'CANCELLED';
        subtotal: number;
        discount_amount?: number;
        discount_percentage?: number;
        tax_amount?: number;
        shipping_cost?: number;
        other_costs?: number;
        total_amount: number;
        payment_status?: 'UNPAID' | 'PARTIAL' | 'PAID';
        payment_method?: string;
        payment_date?: Date;
        delivery_address?: string;
        tracking_number?: string;
        invoice_number?: string;
        invoice_date?: Date;
        attachment_urls?: string[];
        notes?: string;
        internal_notes?: string;
        created_at?: Date;
        updated_at?: Date;
        created_by?: string;
        approved_by?: string;
        approved_at?: Date;
        is_active?: boolean;
    }

    export interface PurchaseOrderItem {
        id?: number;
        purchase_order_id: string;
        product_id: number;
        qty_ordered: number;
        qty_received: number;
        unit_price: number;
        discount_percentage?: number;
        discount_amount?: number;
        tax_percentage?: number;
        tax_amount?: number;
        subtotal: number;
        notes?: string;
        batch_number?: string;
        expiry_date?: Date;
        serial_numbers?: string[];
    }

    export interface StockMovement {
        id?: number;
        movement_number: string;
        type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
        product_id: number;
        warehouse_id: number;
        warehouse_from?: number;
        warehouse_to?: number;
        quantity: number;
        unit_cost?: number;
        total_value?: number;
        reason?: string;
        reason_detail?: string;
        reference_type?: string;
        reference_id?: string;
        batch_number?: string;
        batch_id?: number;
        expiry_date?: Date;
        serial_numbers?: string[];
        serial_ids?: number[];
        approved_by?: string;
        approved_at?: Date;
        notes?: string;
        movement_date: Date;
        created_at?: Date;
        created_by?: string;
        is_active?: boolean;
    }

    export interface Warehouse {
        id?: number;
        code: string;
        name: string;
        address?: string;
        city?: string;
        manager_name?: string;
        phone?: string;
        is_default: boolean;
        is_active: boolean;
        created_at?: Date;
    }

    export interface Notification {
        id?: number;
        type: 'LOW_STOCK' | 'STOCK_OUT' | 'EXPIRY_WARNING' | 'REORDER_POINT' | 'INFO';
        priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
        title: string;
        message: string;
        is_read: boolean;
        product_id?: string;
        reference_type?: string;
        reference_id?: string;
        link?: string;
        action_label?: string;
        action_url?: string;
        created_at?: Date;
        read_at?: Date;
        expires_at?: Date;
    }

    export interface AppSettings {
        id?: number
        key: string;
        value: string;
        data_type?: 'string' | 'number' | 'boolean' | 'json';
        description?: string;
        updated_at?: Date;
    }

    // Additional Tables for Enhanced Features

    export interface ProductBatch {
        id?: number;
        product_id: string;
        warehouse_id: number;
        batch_number: string;
        manufacturing_date?: Date;
        expiry_date?: Date;
        quantity: number;
        purchase_order_id?: string;
        stock_movement_id?: number;
        cost_per_unit?: number;
        is_active: boolean;
        created_at?: Date;
        updated_at?: Date;
    }

    export interface ProductSerial {
        id?: number
        product_id?: number
        warehouse_id: number;
        serial_number: string;
        batch_number?: string;
        status: 'IN_STOCK' | 'SOLD' | 'DAMAGED' | 'RETURNED' | 'LOST';
        purchase_order_id?: string;
        stock_movement_id?: number;
        sold_date?: Date;
        warranty_until?: Date;
        notes?: string;
        created_at: Date;
        updated_at?: Date;
    }

    export interface StockOpname {
        id?: number
        opname_number: string;
        opname_date: Date;
        warehouse_id?: number;
        status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED';
        total_products: number;
        total_discrepancy: number;
        notes?: string;
        created_at: Date;
        created_by?: string;
        approved_by?: string;
        approved_at?: Date;
        is_active?: boolean;
    }

    export interface StockOpnameItem {
        id?: number
        stock_opname_id?: number
        product_id?: number
        system_stock: number;
        physical_stock: number;
        difference: number;
        notes?: string;
        verified_by?: string;
        is_active?: boolean;
    }

    export interface ProductWarehouseStock {
        id?: number;
        product_id: number | string;
        warehouse_id: number | string;
        total_stock: number;           // Sum dari semua tipe tracking
        batch_quantity: number;        // Qty dari batch tracking
        serial_quantity: number;       // Qty dari serial tracking
        general_quantity: number;      // Qty dari general (non-batch, non-serial)
        updated_at: Date;
        last_updated_by?: string;
    }
}