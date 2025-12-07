import { AppDatabase } from './app.database';
import { InventoryModel } from './model/pages/application/inventory/inventory.model';

describe('AppDatabase - Version 5 Migration', () => {
    let db: AppDatabase;

    beforeEach(async () => {
        // Create test database
        db = new AppDatabase('TestDatabase_' + Date.now());
        await db.open();
    });

    afterEach(async () => {
        // Clean up
        if (db.isOpen()) {
            await db.close();
        }
        await db.delete();
    });

    it('should create database with version 5', async () => {
        expect(db.verno).toBe(5);
    });

    it('should have stock_opname_batch_items table', () => {
        expect(db.stock_opname_batch_items).toBeDefined();
    });

    it('should have stock_opname_serial_items table', () => {
        expect(db.stock_opname_serial_items).toBeDefined();
    });

    it('should allow inserting OpnameBatchItem', async () => {
        const batchItem: InventoryModel.OpnameBatchItem = {
            opname_item_id: 1,
            batch_id: 1,
            batch_number: 'BATCH-001',
            expiry_date: new Date('2025-12-31'),
            system_quantity: 100,
            physical_quantity: 95,
            difference: -5,
            is_expired: false,
            days_to_expiry: 365,
            created_at: new Date()
        };

        const id = await db.stock_opname_batch_items.add(batchItem);
        expect(id).toBeGreaterThan(0);

        const retrieved = await db.stock_opname_batch_items.get(id);
        expect(retrieved).toBeDefined();
        expect(retrieved?.batch_number).toBe('BATCH-001');
        expect(retrieved?.difference).toBe(-5);
    });

    it('should allow inserting OpnameSerialItem', async () => {
        const serialItem: InventoryModel.OpnameSerialItem = {
            opname_item_id: 1,
            serial_id: 1,
            serial_number: 'SN-12345',
            expected_status: 'IN_STOCK',
            found: true,
            created_at: new Date()
        };

        const id = await db.stock_opname_serial_items.add(serialItem);
        expect(id).toBeGreaterThan(0);

        const retrieved = await db.stock_opname_serial_items.get(id);
        expect(retrieved).toBeDefined();
        expect(retrieved?.serial_number).toBe('SN-12345');
        expect(retrieved?.found).toBe(true);
    });

    it('should allow inserting StockOpname with new fields', async () => {
        const opname: InventoryModel.StockOpname = {
            opname_number: 'OPN-001',
            opname_date: new Date(),
            warehouse_id: 1,
            status: 'DRAFT',
            total_products: 5,
            total_discrepancy: -10,
            batch_discrepancy: -5,
            serial_discrepancy: -3,
            general_discrepancy: -2,
            created_at: new Date(),
            is_active: true
        };

        const id = await db.stock_opnames.add(opname);
        expect(id).toBeGreaterThan(0);

        const retrieved = await db.stock_opnames.get(id);
        expect(retrieved).toBeDefined();
        expect(retrieved?.batch_discrepancy).toBe(-5);
        expect(retrieved?.serial_discrepancy).toBe(-3);
        expect(retrieved?.general_discrepancy).toBe(-2);
    });

    it('should allow inserting StockOpnameItem with tracking_type', async () => {
        const opnameItem: InventoryModel.StockOpnameItem = {
            stock_opname_id: 1,
            product_id: 1,
            system_stock: 100,
            physical_stock: 95,
            difference: -5,
            tracking_type: 'BATCH',
            is_active: true
        };

        const id = await db.stock_opname_items.add(opnameItem);
        expect(id).toBeGreaterThan(0);

        const retrieved = await db.stock_opname_items.get(id);
        expect(retrieved).toBeDefined();
        expect(retrieved?.tracking_type).toBe('BATCH');
    });

    it('should query batch items by opname_item_id', async () => {
        // Insert multiple batch items
        await db.stock_opname_batch_items.bulkAdd([
            {
                opname_item_id: 1,
                batch_id: 1,
                batch_number: 'BATCH-001',
                system_quantity: 100,
                physical_quantity: 95,
                difference: -5
            },
            {
                opname_item_id: 1,
                batch_id: 2,
                batch_number: 'BATCH-002',
                system_quantity: 50,
                physical_quantity: 50,
                difference: 0
            },
            {
                opname_item_id: 2,
                batch_id: 3,
                batch_number: 'BATCH-003',
                system_quantity: 75,
                physical_quantity: 70,
                difference: -5
            }
        ]);

        const items = await db.stock_opname_batch_items
            .where('opname_item_id')
            .equals(1)
            .toArray();

        expect(items.length).toBe(2);
        expect(items[0].batch_number).toBe('BATCH-001');
        expect(items[1].batch_number).toBe('BATCH-002');
    });

    it('should query serial items by found status', async () => {
        // Insert multiple serial items
        await db.stock_opname_serial_items.bulkAdd([
            {
                opname_item_id: 1,
                serial_id: 1,
                serial_number: 'SN-001',
                found: true
            },
            {
                opname_item_id: 1,
                serial_id: 2,
                serial_number: 'SN-002',
                found: false
            },
            {
                opname_item_id: 1,
                serial_id: 3,
                serial_number: 'SN-003',
                found: true
            }
        ]);

        const foundItems = await db.stock_opname_serial_items
            .where('found')
            .equals(1)
            .toArray();

        const missingItems = await db.stock_opname_serial_items
            .where('found')
            .equals(0)
            .toArray();

        expect(foundItems.length).toBe(2);
        expect(missingItems.length).toBe(1);
        expect(missingItems[0].serial_number).toBe('SN-002');
    });
});
