// Property-based tests for StockCardService
import * as fc from 'fast-check';
import { TestBed } from '@angular/core/testing';
import { StockCardService } from './stock-card.service';
import { DatabaseService } from '../../../../app.database';
import {
    setupTestEnvironment,
    teardownTestEnvironment,
    seedProducts,
    seedWarehouses,
    getStockCardCount,
    verifyStockCardExists,
    getLatestStockBalance,
    calculateTotalIn,
    calculateTotalOut
} from '../../../../test-helpers/db-utils';
import {
    productArbitrary,
    warehouseArbitrary,
    stockCardArbitrary
} from '../../../../test-helpers/generators';
import { firstValueFrom } from 'rxjs';

describe('StockCardService - Property Tests', () => {
    let service: StockCardService;
    let databaseService: DatabaseService;
    let testDb: any;

    beforeEach(async () => {
        testDb = await setupTestEnvironment();

        TestBed.configureTestingModule({
            providers: [
                StockCardService,
                { provide: DatabaseService, useValue: { db: testDb } }
            ]
        });

        service = TestBed.inject(StockCardService);
        databaseService = TestBed.inject(DatabaseService);
    });

    afterEach(async () => {
        await teardownTestEnvironment(testDb);
    });

    /**
     * Feature: inventory-stock-management, Property 1: Receive creates stock card entries
     * Validates: Requirements 1.1
     */
    describe('Property 1: Receive creates stock card entries', () => {
        it('should create stock card with type=IN for any product and warehouse', async () => {
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
                        await firstValueFrom(
                            service.addStockCard(
                                productId,
                                warehouseId,
                                'IN',
                                qty,
                                'TEST',
                                1,
                                'Test stock card'
                            )
                        );

                        // Verify
                        const exists = await verifyStockCardExists(testDb, productId, warehouseId, 'IN', 1);
                        expect(exists).toBe(true);

                        const count = await getStockCardCount(testDb, productId, warehouseId);
                        expect(count).toBeGreaterThan(0);
                    }
                ),
                { numRuns: 10 } // Reduced for faster execution
            );
        });
    });

    /**
     * Feature: inventory-stock-management, Property 32: Running balance calculation
     * Validates: Requirements 5.4
     */
    describe('Property 32: Running balance calculation', () => {
        it('should calculate running balance as sum(IN) - sum(OUT) for any sequence of transactions', async () => {
            await fc.assert(
                fc.asyncProperty(
                    productArbitrary('GENERAL'),
                    warehouseArbitrary(),
                    fc.array(
                        fc.record({
                            type: fc.oneof(fc.constant('IN' as const), fc.constant('OUT' as const)),
                            qty: fc.integer({ min: 1, max: 50 })
                        }),
                        { minLength: 2, maxLength: 10 }
                    ),
                    async (product, warehouse, transactions) => {
                        // Setup
                        const [productId] = await seedProducts(testDb, [product]);
                        const [warehouseId] = await seedWarehouses(testDb, [warehouse]);

                        // Start with initial stock
                        await firstValueFrom(
                            service.addStockCard(productId, warehouseId, 'IN', 100, 'INITIAL', 0, 'Initial stock')
                        );

                        let expectedBalance = 100;

                        // Execute transactions
                        for (const tx of transactions) {
                            if (tx.type === 'OUT' && expectedBalance < tx.qty) {
                                // Skip if insufficient stock
                                continue;
                            }

                            await firstValueFrom(
                                service.addStockCard(
                                    productId,
                                    warehouseId,
                                    tx.type,
                                    tx.qty,
                                    'TEST',
                                    1,
                                    `Test ${tx.type}`
                                )
                            );

                            expectedBalance += tx.type === 'IN' ? tx.qty : -tx.qty;
                        }

                        // Verify
                        const actualBalance = await getLatestStockBalance(testDb, productId, warehouseId);
                        expect(actualBalance).toBe(expectedBalance);

                        // Also verify using IN/OUT calculation
                        const totalIn = await calculateTotalIn(testDb, productId, warehouseId);
                        const totalOut = await calculateTotalOut(testDb, productId, warehouseId);
                        expect(actualBalance).toBe(totalIn - totalOut);
                    }
                ),
                { numRuns: 10 }
            );
        });
    });

    /**
     * Feature: inventory-stock-management, Property 34: Stock card required fields
     * Validates: Requirements 6.1
     */
    describe('Property 34: Stock card required fields', () => {
        it('should include all required fields for any stock card created', async () => {
            await fc.assert(
                fc.asyncProperty(
                    productArbitrary('GENERAL'),
                    warehouseArbitrary(),
                    fc.oneof(fc.constant('IN' as const), fc.constant('OUT' as const)),
                    fc.integer({ min: 1, max: 100 }),
                    async (product, warehouse, type, qty) => {
                        // Setup
                        const [productId] = await seedProducts(testDb, [product]);
                        const [warehouseId] = await seedWarehouses(testDb, [warehouse]);

                        // For OUT, need initial stock
                        if (type === 'OUT') {
                            await firstValueFrom(
                                service.addStockCard(productId, warehouseId, 'IN', qty + 10, 'INITIAL', 0)
                            );
                        }

                        // Execute
                        await firstValueFrom(
                            service.addStockCard(
                                productId,
                                warehouseId,
                                type,
                                qty,
                                'TEST',
                                1,
                                'Test notes'
                            )
                        );

                        // Verify - get the stock card
                        const cards = await testDb.stock_cards
                            .where('[product_id+warehouse_id]')
                            .equals([productId, warehouseId])
                            .toArray();

                        const lastCard = cards[cards.length - 1];

                        // Check required fields
                        expect(lastCard.product_id).toBe(productId);
                        expect(lastCard.warehouse_id).toBe(warehouseId);
                        expect(lastCard.transaction_date).toBeDefined();
                        expect(lastCard.type).toBe(type);
                        expect(type === 'IN' ? lastCard.qty_in : lastCard.qty_out).toBe(qty);
                        expect(lastCard.balance).toBeGreaterThanOrEqual(0);
                    }
                ),
                { numRuns: 10 }
            );
        });
    });
});
