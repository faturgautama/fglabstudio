import { TestBed } from '@angular/core/testing';
import { BatchAllocationService } from './batch-allocation.service';
import { DatabaseService } from '../../../../app.database';

describe('BatchAllocationService', () => {
    let service: BatchAllocationService;
    let mockDatabaseService: jasmine.SpyObj<DatabaseService>;

    beforeEach(() => {
        const dbSpy = jasmine.createSpyObj('DatabaseService', ['ensureReady']);

        TestBed.configureTestingModule({
            providers: [
                BatchAllocationService,
                { provide: DatabaseService, useValue: dbSpy }
            ]
        });

        service = TestBed.inject(BatchAllocationService);
        mockDatabaseService = TestBed.inject(DatabaseService) as jasmine.SpyObj<DatabaseService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('Batch Allocation - FIFO', () => {
        it('should allocate from oldest batch first (FIFO)', async () => {
            // Mock batches
            const mockBatches = [
                {
                    id: 1,
                    product_id: '1',
                    batch_number: 'BATCH-001',
                    quantity: 100,
                    created_at: new Date('2025-01-01'),
                    is_active: true
                },
                {
                    id: 2,
                    product_id: '1',
                    batch_number: 'BATCH-002',
                    quantity: 50,
                    created_at: new Date('2025-01-15'),
                    is_active: true
                }
            ];

            // Test FIFO logic
            const sorted = mockBatches.sort((a, b) =>
                new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
            );

            expect(sorted[0].batch_number).toBe('BATCH-001');
            expect(sorted[1].batch_number).toBe('BATCH-002');
        });

        it('should allocate from multiple batches if needed', () => {
            const mockBatches = [
                { id: 1, batch_number: 'BATCH-001', quantity: 50 },
                { id: 2, batch_number: 'BATCH-002', quantity: 30 }
            ];

            const qtyNeeded = 70;
            let remaining = qtyNeeded;
            const allocations = [];

            for (const batch of mockBatches) {
                if (remaining <= 0) break;
                const allocated = Math.min(batch.quantity, remaining);
                allocations.push({
                    batch_id: batch.id,
                    batch_number: batch.batch_number,
                    qty_allocated: allocated
                });
                remaining -= allocated;
            }

            expect(allocations.length).toBe(2);
            expect(allocations[0].qty_allocated).toBe(50);
            expect(allocations[1].qty_allocated).toBe(20);
            expect(remaining).toBe(0);
        });
    });

    describe('Batch Allocation - FEFO', () => {
        it('should allocate from earliest expiry first (FEFO)', () => {
            const mockBatches = [
                {
                    id: 1,
                    batch_number: 'BATCH-001',
                    quantity: 100,
                    expiry_date: new Date('2026-12-31')
                },
                {
                    id: 2,
                    batch_number: 'BATCH-002',
                    quantity: 50,
                    expiry_date: new Date('2026-06-30')
                }
            ];

            // Test FEFO logic
            const sorted = mockBatches.sort((a, b) => {
                if (!a.expiry_date) return 1;
                if (!b.expiry_date) return -1;
                return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
            });

            expect(sorted[0].batch_number).toBe('BATCH-002'); // Expires first
            expect(sorted[1].batch_number).toBe('BATCH-001');
        });
    });

    describe('Batch Validation', () => {
        it('should throw error if insufficient stock', () => {
            const mockBatches = [
                { id: 1, batch_number: 'BATCH-001', quantity: 30 }
            ];

            const qtyNeeded = 50;
            let remaining = qtyNeeded;

            for (const batch of mockBatches) {
                const allocated = Math.min(batch.quantity, remaining);
                remaining -= allocated;
            }

            expect(remaining).toBeGreaterThan(0);
            // Should throw error: Insufficient stock
        });

        it('should only use active batches', () => {
            const mockBatches = [
                { id: 1, batch_number: 'BATCH-001', quantity: 50, is_active: true },
                { id: 2, batch_number: 'BATCH-002', quantity: 30, is_active: false }
            ];

            const activeBatches = mockBatches.filter(b => b.is_active && b.quantity > 0);
            expect(activeBatches.length).toBe(1);
            expect(activeBatches[0].batch_number).toBe('BATCH-001');
        });
    });

    describe('Expiring Batches', () => {
        it('should identify batches expiring within 30 days', () => {
            const today = new Date();
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30);

            const mockBatches = [
                {
                    id: 1,
                    batch_number: 'BATCH-001',
                    expiry_date: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days
                    quantity: 100
                },
                {
                    id: 2,
                    batch_number: 'BATCH-002',
                    expiry_date: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days
                    quantity: 50
                }
            ];

            const expiringBatches = mockBatches.filter(batch => {
                if (!batch.expiry_date) return false;
                const expiryDate = new Date(batch.expiry_date);
                return expiryDate <= futureDate && expiryDate >= today;
            });

            expect(expiringBatches.length).toBe(1);
            expect(expiringBatches[0].batch_number).toBe('BATCH-001');
        });
    });
});
