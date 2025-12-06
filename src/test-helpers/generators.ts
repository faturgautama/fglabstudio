// Test generators for property-based testing with fast-check
import * as fc from 'fast-check';

/**
 * Generate random warehouse
 */
export const warehouseArbitrary = () =>
    fc.record({
        id: fc.integer({ min: 1, max: 1000 }),
        code: fc.stringMatching(/^WH-[0-9]{3}$/),
        name: fc.oneof(
            fc.constant('Warehouse A'),
            fc.constant('Warehouse B'),
            fc.constant('Warehouse C'),
            fc.constant('Main Warehouse'),
            fc.constant('Secondary Warehouse')
        ),
        address: fc.lorem({ maxCount: 1 }),
        is_default: fc.boolean(),
        is_active: fc.constant(true),
        created_at: fc.date(),
    });

/**
 * Generate random product with tracking type
 */
export const productArbitrary = (trackingType?: 'BATCH' | 'SERIAL' | 'GENERAL') =>
    fc.record({
        id: fc.integer({ min: 1, max: 10000 }),
        sku: fc.stringMatching(/^PRD-[0-9]{4}$/),
        name: fc.oneof(
            fc.constant('Product A'),
            fc.constant('Product B'),
            fc.constant('Product C'),
            fc.constant('Medicine X'),
            fc.constant('Electronics Y')
        ),
        category_id: fc.integer({ min: 1, max: 100 }),
        unit: fc.oneof(fc.constant('pcs'), fc.constant('box'), fc.constant('kg')),
        current_stock: fc.integer({ min: 0, max: 1000 }),
        min_stock: fc.integer({ min: 0, max: 50 }),
        reorder_point: fc.integer({ min: 10, max: 100 }),
        purchase_price: fc.integer({ min: 1000, max: 1000000 }),
        selling_price: fc.integer({ min: 1500, max: 1500000 }),
        is_batch_tracked: trackingType ? fc.constant(trackingType === 'BATCH') : fc.boolean(),
        is_serial_tracked: trackingType ? fc.constant(trackingType === 'SERIAL') : fc.boolean(),
        is_perishable: fc.boolean(),
        is_active: fc.constant(true),
        is_purchasable: fc.constant(true),
        created_at: fc.date(),
    });

/**
 * Generate random supplier
 */
export const supplierArbitrary = () =>
    fc.record({
        id: fc.integer({ min: 1, max: 1000 }),
        code: fc.stringMatching(/^SUP-[0-9]{3}$/),
        name: fc.oneof(
            fc.constant('Supplier A'),
            fc.constant('Supplier B'),
            fc.constant('PT Supplier Indonesia'),
            fc.constant('CV Supplier Jaya')
        ),
        contact_person: fc.oneof(
            fc.constant('John Doe'),
            fc.constant('Jane Smith'),
            fc.constant('Ahmad Yani'),
            fc.constant('Siti Nurhaliza')
        ),
        phone: fc.stringMatching(/^08[0-9]{9,11}$/),
        email: fc.webUrl({ validSchemes: ['mailto'] }).map(url => url.replace('mailto://', '') + '@example.com'),
        is_active: fc.constant(true),
        created_at: fc.date(),
    });

/**
 * Generate random purchase order item
 */
export const purchaseOrderItemArbitrary = () =>
    fc.record({
        id: fc.integer({ min: 1, max: 10000 }),
        product_id: fc.integer({ min: 1, max: 10000 }),
        qty_ordered: fc.integer({ min: 1, max: 100 }),
        qty_received: fc.integer({ min: 0, max: 100 }),
        unit_price: fc.integer({ min: 1000, max: 1000000 }),
        discount_percentage: fc.integer({ min: 0, max: 20 }),
        discount_amount: fc.integer({ min: 0, max: 100000 }),
        tax_percentage: fc.integer({ min: 0, max: 11 }),
        tax_amount: fc.integer({ min: 0, max: 50000 }),
        subtotal: fc.integer({ min: 1000, max: 10000000 }),
    });

/**
 * Generate random purchase order
 */
export const purchaseOrderArbitrary = () =>
    fc.record({
        id: fc.integer({ min: 1, max: 10000 }),
        po_number: fc.stringMatching(/^PO\/[0-9]{6}\/[0-9]{4}$/),
        supplier_id: fc.integer({ min: 1, max: 1000 }),
        warehouse_id: fc.integer({ min: 1, max: 1000 }),
        order_date: fc.date(),
        expected_date: fc.date(),
        status: fc.oneof(
            fc.constant('DRAFT' as const),
            fc.constant('SUBMITTED' as const),
            fc.constant('PARTIAL' as const),
            fc.constant('RECEIVED' as const)
        ),
        subtotal: fc.integer({ min: 10000, max: 100000000 }),
        total_amount: fc.integer({ min: 10000, max: 100000000 }),
        payment_status: fc.oneof(
            fc.constant('UNPAID' as const),
            fc.constant('PARTIAL' as const),
            fc.constant('PAID' as const)
        ),
        is_active: fc.constant(true),
        created_at: fc.date(),
    });

/**
 * Generate receive item data
 */
export const receiveItemArbitrary = () =>
    fc.record({
        id: fc.integer({ min: 1, max: 10000 }),
        qty_received: fc.integer({ min: 1, max: 100 }),
        batch_number: fc.option(fc.stringMatching(/^BATCH-[0-9]{6}$/), { nil: undefined }),
        expiry_date: fc.option(fc.date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }), { nil: undefined }),
        serial_numbers: fc.option(fc.array(fc.stringMatching(/^SN-[0-9]{8}$/), { minLength: 1, maxLength: 10 }), { nil: undefined }),
    });

/**
 * Generate stock movement
 */
export const stockMovementArbitrary = () =>
    fc.record({
        id: fc.integer({ min: 1, max: 10000 }),
        movement_number: fc.stringMatching(/^S[IO]\/[0-9]{6}\/[0-9]{4}$/),
        type: fc.oneof(
            fc.constant('IN' as const),
            fc.constant('OUT' as const),
            fc.constant('TRANSFER' as const),
            fc.constant('ADJUSTMENT' as const)
        ),
        product_id: fc.integer({ min: 1, max: 10000 }),
        warehouse_id: fc.integer({ min: 1, max: 1000 }),
        warehouse_from: fc.option(fc.integer({ min: 1, max: 1000 }), { nil: undefined }),
        warehouse_to: fc.option(fc.integer({ min: 1, max: 1000 }), { nil: undefined }),
        quantity: fc.integer({ min: 1, max: 100 }),
        unit_cost: fc.integer({ min: 1000, max: 1000000 }),
        reason: fc.lorem({ maxCount: 1 }),
        notes: fc.option(fc.lorem({ maxCount: 1 }), { nil: undefined }),
        movement_date: fc.date(),
        is_active: fc.constant(true),
        created_at: fc.date(),
    });

/**
 * Generate stock opname
 */
export const stockOpnameArbitrary = () =>
    fc.record({
        id: fc.integer({ min: 1, max: 10000 }),
        opname_number: fc.stringMatching(/^SO\/[0-9]{6}\/[0-9]{4}$/),
        warehouse_id: fc.integer({ min: 1, max: 1000 }),
        opname_date: fc.date(),
        status: fc.oneof(
            fc.constant('DRAFT' as const),
            fc.constant('IN_PROGRESS' as const),
            fc.constant('COMPLETED' as const),
            fc.constant('APPROVED' as const)
        ),
        total_products: fc.integer({ min: 1, max: 100 }),
        total_discrepancy: fc.integer({ min: 0, max: 1000 }),
        notes: fc.option(fc.lorem({ maxCount: 1 }), { nil: undefined }),
        is_active: fc.constant(true),
        created_at: fc.date(),
    });

/**
 * Generate stock opname item
 */
export const stockOpnameItemArbitrary = () =>
    fc.record({
        id: fc.integer({ min: 1, max: 10000 }),
        stock_opname_id: fc.integer({ min: 1, max: 10000 }),
        product_id: fc.integer({ min: 1, max: 10000 }),
        system_stock: fc.integer({ min: 0, max: 1000 }),
        physical_stock: fc.integer({ min: 0, max: 1000 }),
        difference: fc.integer({ min: -500, max: 500 }),
        notes: fc.option(fc.lorem({ maxCount: 1 }), { nil: undefined }),
    });

/**
 * Generate stock card
 */
export const stockCardArbitrary = () =>
    fc.record({
        id: fc.integer({ min: 1, max: 100000 }),
        product_id: fc.integer({ min: 1, max: 10000 }),
        warehouse_id: fc.integer({ min: 1, max: 1000 }),
        transaction_date: fc.date(),
        type: fc.oneof(
            fc.constant('IN' as const),
            fc.constant('OUT' as const),
            fc.constant('ADJUSTMENT' as const)
        ),
        reference_type: fc.option(
            fc.oneof(
                fc.constant('PURCHASE_ORDER'),
                fc.constant('STOCK_MOVEMENT'),
                fc.constant('STOCK_OPNAME'),
                fc.constant('PURCHASE_ORDER_CANCEL')
            ),
            { nil: undefined }
        ),
        reference_id: fc.option(fc.integer({ min: 1, max: 10000 }), { nil: undefined }),
        qty_in: fc.integer({ min: 0, max: 100 }),
        qty_out: fc.integer({ min: 0, max: 100 }),
        balance: fc.integer({ min: 0, max: 10000 }),
        unit_cost: fc.option(fc.integer({ min: 1000, max: 1000000 }), { nil: undefined }),
        total_value: fc.option(fc.integer({ min: 1000, max: 100000000 }), { nil: undefined }),
        notes: fc.option(fc.lorem({ maxCount: 1 }), { nil: undefined }),
        created_at: fc.date(),
    });

/**
 * Generate product warehouse stock
 */
export const productWarehouseStockArbitrary = () =>
    fc.record({
        id: fc.integer({ min: 1, max: 100000 }),
        product_id: fc.integer({ min: 1, max: 10000 }),
        warehouse_id: fc.integer({ min: 1, max: 1000 }),
        total_stock: fc.integer({ min: 0, max: 10000 }),
        batch_quantity: fc.integer({ min: 0, max: 5000 }),
        serial_quantity: fc.integer({ min: 0, max: 5000 }),
        general_quantity: fc.integer({ min: 0, max: 5000 }),
        updated_at: fc.date(),
    });

/**
 * Generate product batch
 */
export const productBatchArbitrary = () =>
    fc.record({
        id: fc.integer({ min: 1, max: 100000 }),
        product_id: fc.integer({ min: 1, max: 10000 }).map(String),
        warehouse_id: fc.integer({ min: 1, max: 1000 }),
        batch_number: fc.stringMatching(/^BATCH-[0-9]{6}$/),
        expiry_date: fc.option(fc.date({ min: new Date(), max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }), { nil: undefined }),
        quantity: fc.integer({ min: 1, max: 1000 }),
        purchase_order_id: fc.option(fc.integer({ min: 1, max: 10000 }).map(String), { nil: undefined }),
        cost_per_unit: fc.option(fc.integer({ min: 1000, max: 1000000 }), { nil: undefined }),
        is_active: fc.boolean(),
        created_at: fc.date(),
    });

/**
 * Generate product serial
 */
export const productSerialArbitrary = () =>
    fc.record({
        id: fc.integer({ min: 1, max: 100000 }),
        product_id: fc.integer({ min: 1, max: 10000 }),
        warehouse_id: fc.integer({ min: 1, max: 1000 }),
        serial_number: fc.stringMatching(/^SN-[0-9]{8}$/),
        batch_number: fc.option(fc.stringMatching(/^BATCH-[0-9]{6}$/), { nil: undefined }),
        status: fc.oneof(
            fc.constant('IN_STOCK' as const),
            fc.constant('SOLD' as const),
            fc.constant('RETURNED' as const),
            fc.constant('DAMAGED' as const)
        ),
        purchase_order_id: fc.option(fc.integer({ min: 1, max: 10000 }).map(String), { nil: undefined }),
        notes: fc.option(fc.lorem({ maxCount: 1 }), { nil: undefined }),
        created_at: fc.date(),
    });
