export namespace InventoryModel {
    // ============================================
    // ENUMS
    // ============================================

    export enum ProductCategory {
        FOOD = 'FOOD',
        BEVERAGE = 'BEVERAGE',
        ELECTRONICS = 'ELECTRONICS',
        CLOTHING = 'CLOTHING',
        HOUSEHOLD = 'HOUSEHOLD',
        STATIONERY = 'STATIONERY',
        AUTOMOTIVE = 'AUTOMOTIVE',
        HEALTH_BEAUTY = 'HEALTH_BEAUTY',
        TOYS = 'TOYS',
        FURNITURE = 'FURNITURE',
        OTHER = 'OTHER'
    }

    export enum ProductStatus {
        ACTIVE = 'ACTIVE',
        INACTIVE = 'INACTIVE',
        DISCONTINUED = 'DISCONTINUED'
    }

    export enum UnitOfMeasure {
        PCS = 'PCS',        // Pieces
        BOX = 'BOX',        // Box
        PACK = 'PACK',      // Pack
        KG = 'KG',          // Kilogram
        GRAM = 'GRAM',      // Gram
        LITER = 'LITER',    // Liter
        ML = 'ML',          // Mililiter
        METER = 'METER',    // Meter
        CM = 'CM',          // Centimeter
        DOZEN = 'DOZEN',    // Lusin
        SET = 'SET',        // Set
        UNIT = 'UNIT'       // Unit
    }

    export enum PaymentTerm {
        COD = 'COD',
        DAYS_7 = 'DAYS_7',
        DAYS_14 = 'DAYS_14',
        DAYS_30 = 'DAYS_30',
        DAYS_60 = 'DAYS_60'
    }

    export enum LocationStatus {
        ACTIVE = 'ACTIVE',
        INACTIVE = 'INACTIVE'
    }

    export enum PurchaseOrderStatus {
        DRAFT = 'DRAFT',
        SENT = 'SENT',
        PARTIAL = 'PARTIAL',    // Sebagian sudah diterima
        RECEIVED = 'RECEIVED',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED'
    }

    export enum StockMovementType {
        TRANSFER = 'TRANSFER',
        ADJUSTMENT = 'ADJUSTMENT',
        RETURN = 'RETURN'
    }

    export enum StockMovementStatus {
        DRAFT = 'DRAFT',
        IN_TRANSIT = 'IN_TRANSIT',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED'
    }

    export enum StockLogType {
        PURCHASE = 'PURCHASE',
        SALES = 'SALES',
        TRANSFER_OUT = 'TRANSFER_OUT',
        TRANSFER_IN = 'TRANSFER_IN',
        ADJUSTMENT = 'ADJUSTMENT',
        RETURN = 'RETURN'
    }

    // ============================================
    // MASTER DATA INTERFACES
    // ============================================

    export interface Product {
        id?: number;

        // Basic Information
        code: string;                     // SKU/Product Code (unique)
        barcode?: string;                 // Barcode/EAN/UPC
        name: string;                     // Nama Produk
        description?: string;             // Deskripsi Produk
        category: ProductCategory;        // Kategori
        status: ProductStatus;            // Status Produk

        // Pricing Information
        buy_price: number;                // Harga Beli (HPP)
        sell_price: number;               // Harga Jual
        wholesale_price?: number;         // Harga Grosir (optional)
        margin_percentage?: number;       // Margin % (auto calculate)

        // Stock Information
        unit_of_measure: UnitOfMeasure;   // Satuan (PCS, BOX, KG, dll)
        min_stock: number;                // Stock Minimal (untuk alert)
        max_stock?: number;               // Stock Maksimal (optional)
        reorder_point?: number;           // Titik Reorder (optional)

        // Physical Information
        weight?: number;                  // Berat (dalam gram)
        length?: number;                  // Panjang (dalam cm)
        width?: number;                   // Lebar (dalam cm)
        height?: number;                  // Tinggi (dalam cm)

        // Supplier Information
        main_supplier_id?: number;        // Supplier Utama
        alternative_supplier_id?: number; // Supplier Alternatif

        // Additional Information
        brand?: string;                   // Merk/Brand
        model?: string;                   // Model
        color?: string;                   // Warna
        size?: string;                    // Ukuran

        // Expiry & Batch Tracking
        has_expiry_date: boolean;         // Apakah ada tanggal kadaluarsa
        has_batch_number: boolean;        // Apakah pakai nomor batch
        shelf_life_days?: number;         // Masa simpan (hari)

        // Tax & Commission
        is_taxable: boolean;              // Kena pajak atau tidak
        tax_percentage?: number;          // Persentase pajak
        commission_percentage?: number;   // Komisi sales (optional)

        // Media
        image_url?: string;               // URL Gambar Produk
        images?: string[];                // Multiple images (JSON array)

        // Location Default
        default_location_id?: number;     // Lokasi penyimpanan default
        rack_number?: string;             // Nomor Rak
        bin_location?: string;            // Lokasi Bin

        // Metadata
        is_active: boolean;               // Aktif atau tidak
        is_featured: boolean;             // Produk unggulan
        notes?: string;                   // Catatan tambahan

        // Audit Trail
        created_by?: string;
        created_at: Date;
        updated_by?: string;
        updated_at: Date;
    }

    export interface Supplier {
        id?: number;

        // Basic Information
        code: string;
        name: string;
        company_name?: string;            // Nama Perusahaan

        // Contact Information
        contact_person?: string;          // Nama Contact Person
        phone: string;
        mobile?: string;                  // HP
        email?: string;
        website?: string;

        // Address Information
        address: string;
        city?: string;
        province?: string;
        postal_code?: string;
        country?: string;

        // Business Information
        tax_id?: string;                  // NPWP
        payment_term: PaymentTerm;
        credit_limit?: number;            // Limit Kredit
        discount_percentage?: number;     // Diskon yang diberikan

        // Banking Information
        bank_name?: string;
        bank_account_number?: string;
        bank_account_name?: string;

        // Status & Rating
        is_active: boolean;
        rating?: number;                  // Rating supplier (1-5)

        // Statistics (calculated)
        total_purchases?: number;         // Total pembelian
        last_purchase_date?: Date;        // Tanggal pembelian terakhir

        notes?: string;

        // Audit Trail
        created_by?: string;
        created_at: Date;
        updated_by?: string;
        updated_at: Date;
    }

    export interface Location {
        id?: number;

        // Basic Information
        code: string;
        name: string;
        type?: string;                    // Gudang, Toko, Cabang, dll

        // Address Information
        address: string;
        city?: string;
        province?: string;
        postal_code?: string;

        // Contact Information
        phone?: string;
        email?: string;
        manager_name?: string;            // Nama Penanggung Jawab

        // Status
        status: LocationStatus;
        is_primary: boolean;              // Gudang utama atau bukan
        is_sellable: boolean;             // Bisa jual atau tidak (toko vs gudang)

        // Capacity
        capacity?: number;                // Kapasitas (m² atau m³)

        notes?: string;

        // Audit Trail
        created_by?: string;
        created_at: Date;
        updated_by?: string;
        updated_at: Date;
    }

    // ============================================
    // STOCK INTERFACE
    // ============================================

    export interface Stock {
        id?: number;
        product_id: number;
        location_id: number;
        quantity: number;
        reserved_quantity?: number;       // Stock yang sudah di-reserve untuk order
        available_quantity?: number;      // quantity - reserved_quantity
        last_updated: Date;
    }

    // View model untuk display
    export interface StockView extends Stock {
        product_code: string;
        product_name: string;
        product_category: string;
        unit_of_measure: string;
        location_code: string;
        location_name: string;
        min_stock: number;
        max_stock?: number;
        is_low_stock: boolean;            // quantity < min_stock
        buy_price: number;
        sell_price: number;
        stock_value: number;              // quantity * buy_price
    }

    // ============================================
    // PURCHASE ORDER INTERFACES
    // ============================================

    export interface PurchaseOrder {
        id?: number;
        po_number: string;
        supplier_id: number;
        date: Date;
        expected_date: Date;
        status: PurchaseOrderStatus;

        // Financial
        subtotal: number;
        discount_percentage?: number;
        discount_amount?: number;
        tax_percentage?: number;
        tax_amount?: number;
        shipping_cost?: number;
        other_cost?: number;
        total_amount: number;

        // Payment
        payment_term: PaymentTerm;
        down_payment?: number;            // Uang Muka

        // Delivery
        delivery_address?: string;
        delivery_location_id?: number;    // Kirim ke lokasi mana

        notes?: string;

        // Approval
        created_by?: string;
        approved_by?: string;
        approved_at?: Date;

        // Audit Trail
        created_at: Date;
        updated_at: Date;
    }

    export interface PurchaseOrderItem {
        id?: number;
        po_id: number;
        product_id: number;
        qty_ordered: number;
        price: number;
        discount_percentage?: number;
        discount_amount?: number;
        subtotal: number;
        tax_amount?: number;
        total: number;
        notes?: string;
    }

    // View model untuk display PO dengan detail
    export interface PurchaseOrderView extends PurchaseOrder {
        supplier_name: string;
        supplier_code: string;
        supplier_phone: string;
        location_name?: string;
        items: PurchaseOrderItemView[];
        total_items: number;
        qty_ordered_total: number;
        qty_received_total: number;
        qty_remaining_total: number;
    }

    export interface PurchaseOrderItemView extends PurchaseOrderItem {
        product_code: string;
        product_name: string;
        unit_of_measure: string;
        qty_received: number;             // sudah diterima berapa
        qty_remaining: number;            // sisa yang belum diterima
    }

    // ============================================
    // PURCHASE RECEIPT INTERFACES
    // ============================================

    export interface PurchaseReceipt {
        id?: number;
        receipt_number: string;
        po_id: number;
        receive_date: Date;
        location_id: number;              // Terima di lokasi mana

        // Invoice dari supplier
        supplier_invoice_number?: string;
        supplier_invoice_date?: Date;

        notes?: string;
        received_by?: string;

        created_at: Date;
        updated_at: Date;
    }

    export interface PurchaseReceiptItem {
        id?: number;
        receipt_id: number;
        product_id: number;
        qty_ordered: number;
        qty_received: number;
        qty_rejected?: number;            // Barang rusak/ditolak
        batch_number?: string;            // Nomor Batch
        expiry_date?: Date;               // Tanggal Kadaluarsa
        location_id: number;
        notes?: string;
    }

    // View model
    export interface PurchaseReceiptView extends PurchaseReceipt {
        po_number: string;
        supplier_name: string;
        location_name: string;
        items: PurchaseReceiptItemView[];
        total_items: number;
    }

    export interface PurchaseReceiptItemView extends PurchaseReceiptItem {
        product_code: string;
        product_name: string;
        unit_of_measure: string;
    }

    // ============================================
    // STOCK MOVEMENT INTERFACES
    // ============================================

    export interface StockMovement {
        id?: number;
        movement_number: string;
        date: Date;
        type: StockMovementType;
        from_location_id?: number;        // null jika type = ADJUSTMENT
        to_location_id?: number;          // null jika type = ADJUSTMENT
        status: StockMovementStatus;

        reason?: string;                  // Alasan movement/adjustment
        reference_number?: string;        // Nomor referensi (misal: nomor DO)

        notes?: string;

        // Approval
        created_by?: string;
        approved_by?: string;
        approved_at?: Date;
        received_by?: string;             // Yang terima di lokasi tujuan
        received_at?: Date;

        created_at: Date;
        updated_at: Date;
    }

    export interface StockMovementItem {
        id?: number;
        movement_id: number;
        product_id: number;
        quantity: number;

        // Untuk adjustment
        qty_before?: number;              // Stock sebelum adjustment
        qty_after?: number;               // Stock setelah adjustment

        batch_number?: string;
        expiry_date?: Date;

        notes?: string;
    }

    // View model
    export interface StockMovementView extends StockMovement {
        from_location_name?: string;
        to_location_name?: string;
        items: StockMovementItemView[];
        total_items: number;
        total_quantity: number;
    }

    export interface StockMovementItemView extends StockMovementItem {
        product_code: string;
        product_name: string;
        unit_of_measure: string;
        current_stock_from?: number;      // Stock saat ini di from_location
        current_stock_to?: number;        // Stock saat ini di to_location
    }

    // ============================================
    // SALES ORDER INTERFACES
    // ============================================

    export interface SalesOrder {
        id?: number;
        so_number: string;
        date: Date;
        customer_name?: string;
        customer_phone?: string;
        location_id: number;              // Jual dari lokasi mana

        // Financial
        subtotal: number;
        discount_percentage?: number;
        discount_amount?: number;
        tax_percentage?: number;
        tax_amount?: number;
        shipping_cost?: number;
        total_amount: number;

        // Payment
        payment_method?: string;          // Cash, Transfer, Credit Card
        payment_status?: string;          // Paid, Unpaid, Partial
        paid_amount?: number;

        notes?: string;

        sales_person?: string;
        created_by?: string;

        created_at: Date;
        updated_at: Date;
    }

    export interface SalesOrderItem {
        id?: number;
        so_id: number;
        product_id: number;
        quantity: number;
        price: number;                    // Harga jual per unit
        discount_percentage?: number;
        discount_amount?: number;
        subtotal: number;

        // Profit calculation
        buy_price?: number;               // HPP saat transaksi
        profit?: number;                  // (price - buy_price) * quantity

        notes?: string;
    }

    // View model
    export interface SalesOrderView extends SalesOrder {
        location_name: string;
        items: SalesOrderItemView[];
        total_items: number;
        total_profit: number;
    }

    export interface SalesOrderItemView extends SalesOrderItem {
        product_code: string;
        product_name: string;
        unit_of_measure: string;
        available_stock: number;          // Stock tersedia di lokasi
    }

    // ============================================
    // STOCK LOG INTERFACE (Audit Trail)
    // ============================================

    export interface StockLog {
        id?: number;
        date: Date;
        product_id: number;
        location_id: number;
        type: StockLogType;
        qty_before: number;
        qty_change: number;               // + untuk masuk, - untuk keluar
        qty_after: number;
        reference_type: string;           // PO, SO, Movement, dll
        reference_id: number;             // ID dari transaksi
        reference_number: string;         // Nomor dokumen
        notes?: string;
        created_by?: string;
        created_at: Date;
    }

    // View model
    export interface StockLogView extends StockLog {
        product_code: string;
        product_name: string;
        location_name: string;
    }

    // ============================================
    // DASHBOARD & REPORT INTERFACES
    // ============================================

    export interface DashboardStats {
        total_products: number;
        total_locations: number;
        total_stock_value: number;
        low_stock_count: number;
        pending_po_count: number;
        today_sales: number;
        today_profit: number;
        month_sales: number;
        month_profit: number;
    }

    export interface StockByLocation {
        location_id: number;
        location_name: string;
        total_products: number;
        total_quantity: number;
        total_value: number;
        low_stock_items: number;
    }

    export interface TopSellingProduct {
        product_id: number;
        product_code: string;
        product_name: string;
        total_quantity: number;
        total_sales: number;
        total_profit: number;
    }

    export interface LowStockAlert {
        product_id: number;
        product_code: string;
        product_name: string;
        location_id: number;
        location_name: string;
        current_stock: number;
        min_stock: number;
        reorder_point: number;
        shortage: number;                 // min_stock - current_stock
        suggested_order_qty: number;
        main_supplier_name?: string;
    }
}