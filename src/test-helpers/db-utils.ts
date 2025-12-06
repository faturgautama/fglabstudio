// Database utilities for testing
import { AppDatabase } from '../app/app.database';
import { InventoryModel } from '../app/model/pages/application/inventory/inventory.model';

/**
 * Create a test database instance
 */
export async function createTestDatabase(dbName: string = 'TestDatabase'): Promise<AppDatabase> {
    const db = new AppDatabase(dbName);
    await db.open();
    return db;
}

/**
 * Clear all data from test database
 */
export async function clearTestDatabase(db: AppDatabase): Promise<void> {
    await Promise.all([
        db.stock_cards.clear(),
        db.product_warehouse_stock.clear(),
        db.product_batches.clear(),
        db.product_serials.clear(),
        db.purchase_orders.clear(),
        db.purchase_order_items.clear(),
        db.stock_movements.clear(),
        db.stock_opnames.clear(),
        db.stock_opname_items.clear(),
        db.products.clear(),
        db.warehouses.clear(),
        db.suppliers.clear(),
    ]);
}

/**
 * Delete test database
 */
export async function deleteTestDatabase(db: AppDatabase): Promise<void> {
    const dbName = db.name;
    await db.close();
    await db.delete();
    console.log(`Test database ${dbName} deleted`);
}

/**
 * Seed test data - products
 */
export async function seedProducts(db: AppDatabase, products: Partial<InventoryModel.Product>[]): Promise<number[]> {
    const ids: number[] = [];
    for (const product of products) {
        const id = await db.products.add(product as any);
        ids.push(Number(id));
    }
    return ids;
}

/**
 * Seed test data - warehouses
 */
export async function seedWarehouses(db: AppDatabase, warehouses: Partial<InventoryModel.Warehouse>[]): Promise<number[]> {
    const ids: number[] = [];
    for (const warehouse of warehouses) {
        const id = await db.warehouses.add(warehouse as any);
        ids.push(Number(id));
    }
    return ids;
}

/**
 * Seed test data - suppliers
 */
export async function seedSuppliers(db: AppDatabase, suppliers: Partial<InventoryModel.Supplier>[]): Promise<number[]> {
    const ids: number[] = [];
    for (const supplier of suppliers) {
        const id = await db.suppliers.add(supplier as any);
        ids.push(Number(id));
    }
    return ids;
}

/**
 * Seed test data - purchase orders
 */
export async function seedPurchaseOrders(
    db: AppDatabase,
    pos: Partial<InventoryModel.PurchaseOrder>[]
): Promise<number[]> {
    const ids: number[] = [];
    for (const po of pos) {
        const id = await db.purchase_orders.add(po as any);
        ids.push(Number(id));
    }
    return ids;
}

/**
 * Seed test data - purchase order items
 */
export async function seedPurchaseOrderItems(
    db: AppDatabase,
    items: Partial<InventoryModel.PurchaseOrderItem>[]
): Promise<number[]> {
    const ids: number[] = [];
    for (const item of items) {
        const id = await db.purchase_order_items.add(item as any);
        ids.push(Number(id));
    }
    return ids;
}

/**
 * Seed test data - stock cards
 */
export async function seedStockCards(
    db: AppDatabase,
    stockCards: Partial<InventoryModel.StockCard>[]
): Promise<number[]> {
    const ids: number[] = [];
    for (const card of stockCards) {
        const id = await db.stock_cards.add(card as any);
        ids.push(Number(id));
    }
    return ids;
}

/**
 * Seed test data - product warehouse stock
 */
export async function seedProductWarehouseStock(
    db: AppDatabase,
    stocks: Partial<InventoryModel.ProductWarehouseStock>[]
): Promise<number[]> {
    const ids: number[] = [];
    for (const stock of stocks) {
        const id = await db.product_warehouse_stock.add(stock as any);
        ids.push(Number(id));
    }
    return ids;
}

/**
 * Get stock card count for a product and warehouse
 */
export async function getStockCardCount(
    db: AppDatabase,
    product_id: number,
    warehouse_id: number
): Promise<number> {
    return await db.stock_cards
        .where('[product_id+warehouse_id]')
        .equals([product_id, warehouse_id])
        .count();
}

/**
 * Get product warehouse stock
 */
export async function getProductWarehouseStock(
    db: AppDatabase,
    product_id: number,
    warehouse_id: number
): Promise<InventoryModel.ProductWarehouseStock | undefined> {
    return await db.product_warehouse_stock
        .where('[product_id+warehouse_id]')
        .equals([product_id, warehouse_id])
        .first();
}

/**
 * Get latest stock card balance
 */
export async function getLatestStockBalance(
    db: AppDatabase,
    product_id: number,
    warehouse_id: number
): Promise<number> {
    const latestCard = await db.stock_cards
        .where('[product_id+warehouse_id]')
        .equals([product_id, warehouse_id])
        .reverse()
        .first();

    return latestCard?.balance || 0;
}

/**
 * Verify stock card entry exists
 */
export async function verifyStockCardExists(
    db: AppDatabase,
    product_id: number,
    warehouse_id: number,
    type: 'IN' | 'OUT' | 'ADJUSTMENT',
    reference_id?: number
): Promise<boolean> {
    const query = db.stock_cards
        .where('[product_id+warehouse_id]')
        .equals([product_id, warehouse_id]);

    const cards = await query.toArray();

    return cards.some(card =>
        card.type === type &&
        (!reference_id || card.reference_id === reference_id)
    );
}

/**
 * Calculate total IN quantity from stock cards
 */
export async function calculateTotalIn(
    db: AppDatabase,
    product_id: number,
    warehouse_id: number
): Promise<number> {
    const cards = await db.stock_cards
        .where('[product_id+warehouse_id]')
        .equals([product_id, warehouse_id])
        .toArray();

    return cards
        .filter(card => card.type === 'IN')
        .reduce((sum, card) => sum + (card.qty_in || 0), 0);
}

/**
 * Calculate total OUT quantity from stock cards
 */
export async function calculateTotalOut(
    db: AppDatabase,
    product_id: number,
    warehouse_id: number
): Promise<number> {
    const cards = await db.stock_cards
        .where('[product_id+warehouse_id]')
        .equals([product_id, warehouse_id])
        .toArray();

    return cards
        .filter(card => card.type === 'OUT')
        .reduce((sum, card) => sum + (card.qty_out || 0), 0);
}

/**
 * Setup test environment
 */
export async function setupTestEnvironment(): Promise<AppDatabase> {
    const db = await createTestDatabase(`TestDB_${Date.now()}`);
    await clearTestDatabase(db);
    return db;
}

/**
 * Teardown test environment
 */
export async function teardownTestEnvironment(db: AppDatabase): Promise<void> {
    await clearTestDatabase(db);
    await deleteTestDatabase(db);
}
