// Property-based tests for ProductWarehouseStockService
import * as fc from 'fast-check';
import { TestBed } from '@angular/core/testing';
import { ProductWarehouseStockService } from './product-warehouse-stock.service';
import { DatabaseService } from '../../../../app.database';
import {
    setupTestEnvironment,
    teardownTestEnvironment,
    seedProducts,
    seedWarehouses,
    getProductWarehouseStock
} from '../../../../test-helpers/db-utils';
import {
    productArbitrary,
    warehouseArbitrary
} from '../../../../test-helpers/generators';

describe('ProductWarehouseStockService - Property Tests', () => {
    let service: ProductWarehouseStockService;
    let databaseService: DatabaseService;
    let testDb: any;

    beforeEach(async () => {
        testDb = await setupTestEnvironment();

        TestBed.configureTestingModule({
            providers: [
                ProductWarehouseStockService,
                { provide: DatabaseService, useValue: { db: testDb } }
            ]
        });

        service = TestBed.inject(ProductWarehouseStockService);
        databaseService = TestBed.inject(DatabaseService);
    });

    afterEach(async () => {
        await teardownTestEnvironment(testDb);
    });

    /**
     * Feature: inventory-stock-management, Property 2: Receive increments warehouse stock
     * Validates: Requirements 1.2
     */
    describe('Property 2: Receive increments warehouse stock', () => {
        it('should increment stock for any product and warehouse based on tracking type', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.oneof(
                        fc.constant('BATCH' as const),
                        fc.constant('SERIAL' as const),
                        fc.constant('GENERAL' as const)
                    ),
                    warehouseArbitrary(),
                    fc.integer({ min: 1, max: 100 }),
                    async (trackingType, warehouse, qty) => {
                        // Setup
                        const product = await fc.sample(productArbitrary(trackingType), 1)[0];
                        const [productId] = await seedProducts(testDb, [product]);
                        const [warehouseId] = await seedWarehouses(testDb, [warehouse]);

                        // Get initial stock (should be 0)
                        const initialStock = await getProductWarehouseStock(testDb, productId, warehouseId);
                        const initialQty = initialStock?.total_stock || 0;

                        // Execute
                        await service.updateStockOnReceive(productId, warehouseId, qty, trackingType);

                        // Verify
                        const finalStock = await getProductWarehouseStock(testDb, productId, warehouseId);
                        expect(finalStock).toBeDefined();
                        expect(finalStock!.total_stock).toBe(initialQty + qty);

                        // Verify correct field was incremented
                        if (trackingType === 'BATCH') {
                            expect(finalStock!.batch_quantity).toBeGreaterThan(0);
                        } else if (trackingType === 'SERIAL') {
                            expect(finalStock!.serial_quantity).toBeGreaterThan(0);
                        } else {
                            expect(finalStock!.general_quantity).toBeGreaterThan(0);
                        }
                    }
                ),
                { numRuns: 10 }
            );
        });
    });

    /**
     * Feature: inventory-stock-management, Property 38: Tracking type counters
     * Validates: Requirements 6.6
     */
    describe('Property 38: Tracking type counters', () => {
        it('should maintain separate non-negative counters for batch, serial, and general quantities', async () => {
            await fc.assert(
                fc.asyncProperty(
                    productArbitrary('GENERAL'),
                    warehouseArbitrary(),
                    fc.integer({ min: 1, max: 100 }),
                    fc.integer({ min: 1, max: 100 }),
                    fc.integer({ min: 1, max: 100 }),
                    async (product, warehouse, batchQty, serialQty, generalQty) => {
                        // Setup
                        const [productId] = await seedProducts(testDb, [product]);
                        const [warehouseId] = await seedWarehouses(testDb, [warehouse]);

                        // Execute - add different tracking types
                        await service.updateStockOnReceive(productId, warehouseId, batchQty, 'BATCH');
                        await service.updateStockOnReceive(productId, warehouseId, serialQty, 'SERIAL');
                        await service.updateStockOnReceive(productId, warehouseId, generalQty, 'GENERAL');

                        // Verify
                        const stock = await getProductWarehouseStock(testDb, productId, warehouseId);
                        expect(stock).toBeDefined();
                        expect(stock!.batch_quantity).toBeGreaterThanOrEqual(0);
                        expect(stock!.serial_quantity).toBeGreaterThanOrEqual(0);
                        expect(stock!.general_quantity).toBeGreaterThanOrEqual(0);
                    }
                ),
                { numRuns: 10 }
            );
        });
    });

    /**
     * Feature: inventory-stock-management, Property 39: Total stock calculation
     * Validates: Requirements 6.7
     */
    describe('Property 39: Total stock calculation', () => {
        it('should calculate total_stock as sum of batch + serial + general for any quantities', async () => {
            await fc.assert(
                fc.asyncProperty(
                    productArbitrary('GENERAL'),
                    warehouseArbitrary(),
                    fc.integer({ min: 0, max: 100 }),
                    fc.integer({ min: 0, max: 100 }),
                    fc.integer({ min: 0, max: 100 }),
                    async (product, warehouse, batchQty, serialQty, generalQty) => {
                        // Setup
                        const [productId] = await seedProducts(testDb, [product]);
                        const [warehouseId] = await seedWarehouses(testDb, [warehouse]);

                        // Execute
                        if (batchQty > 0) {
                            await service.updateStockOnReceive(productId, warehouseId, batchQty, 'BATCH');
                        }
                        if (serialQty > 0) {
                            await service.updateStockOnReceive(productId, warehouseId, serialQty, 'SERIAL');
                        }
                        if (generalQty > 0) {
                            await service.updateStockOnReceive(productId, warehouseId, generalQty, 'GENERAL');
                        }

                        // Verify
                        const stock = await getProductWarehouseStock(testDb, productId, warehouseId);

                        if (batchQty + serialQty + generalQty > 0) {
                            expect(stock).toBeDefined();
                            const expectedTotal = stock!.batch_quantity + stock!.serial_quantity + stock!.general_quantity;
                            expect(stock!.total_stock).toBe(expectedTotal);
                        }
                    }
                ),
                { numRuns: 10 }
            );
        });
    });

    /**
     * Feature: inventory-stock-management, Property 45: Batch quantity increment
     * Validates: Requirements 7.6
     */
    describe('Property 45: Batch quantity increment', () => {
        it('should increment batch_quantity field for batch-tracked products', async () => {
            await fc.assert(
                fc.asyncProperty(
                    productArbitrary('BATCH'),
                    warehouseArbitrary(),
                    fc.integer({ min: 1, max: 100 }),
                    async (product, warehouse, qty) => {
                        // Setup
                        const [productId] = await seedProducts(testDb, [product]);
                        const [warehouseId] = await seedWarehouses(testDb, [warehouse]);

                        // Execute
                        await service.updateStockOnReceive(productId, warehouseId, qty, 'BATCH');

                        // Verify
                        const stock = await getProductWarehouseStock(testDb, productId, warehouseId);
                        expect(stock).toBeDefined();
                        expect(stock!.batch_quantity).toBe(qty);
                        expect(stock!.serial_quantity).toBe(0);
                        expect(stock!.general_quantity).toBe(0);
                    }
                ),
                { numRuns: 10 }
            );
        });
    });

    /**
     * Feature: inventory-stock-management, Property 46: Serial quantity increment
     * Validates: Requirements 7.7
     */
    describe('Property 46: Serial quantity increment', () => {
        it('should increment serial_quantity field for serial-tracked products', async () => {
            await fc.assert(
                fc.asyncProperty(
                    productArbitrary('SERIAL'),
                    warehouseArbitrary(),
                    fc.integer({ min: 1, max: 100 }),
                    async (product, warehouse, qty) => {
                        // Setup
                        const [productId] = await seedProducts(testDb, [product]);
                        const [warehouseId] = await seedWarehouses(testDb, [warehouse]);

                        // Execute
                        await service.updateStockOnReceive(productId, warehouseId, qty, 'SERIAL');

                        // Verify
                        const stock = await getProductWarehouseStock(testDb, productId, warehouseId);
                        expect(stock).toBeDefined();
                        expect(stock!.batch_quantity).toBe(0);
                        expect(stock!.serial_quantity).toBe(qty);
                        expect(stock!.general_quantity).toBe(0);
                    }
                ),
                { numRuns: 10 }
            );
        });
    });

    /**
     * Feature: inventory-stock-management, Property 47: General quantity increment
     * Validates: Requirements 7.8
     */
    describe('Property 47: General quantity increment', () => {
        it('should increment general_quantity field for general-tracked products', async () => {
            await fc.assert(
                fc.asyncProperty(
                    productArbitrary('GENERAL'),
                    warehouseArbitrary(),
                    fc.integer({ min: 1, max: 100 }),
                    async (product, warehouse, qty) => {
                        // Setup
                        const [productId] = await seedProducts(testDb, [product]);
                        const [warehouseId] = await seedWarehouses(testDb, [warehouse]);

                        // Execute
                        await service.updateStockOnReceive(productId, warehouseId, qty, 'GENERAL');

                        // Verify
                        const stock = await getProductWarehouseStock(testDb, productId, warehouseId);
                        expect(stock).toBeDefined();
                        expect(stock!.batch_quantity).toBe(0);
                        expect(stock!.serial_quantity).toBe(0);
                        expect(stock!.general_quantity).toBe(qty);
                    }
                ),
                { numRuns: 10 }
            );
        });
    });
});
