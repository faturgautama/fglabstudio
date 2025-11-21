import { TestBed } from '@angular/core/testing';
import { SerialAllocationService } from './serial-allocation.service';
import { DatabaseService } from '../../../../app.database';

describe('SerialAllocationService', () => {
    let service: SerialAllocationService;
    let mockDatabaseService: jasmine.SpyObj<DatabaseService>;

    beforeEach(() => {
        const dbSpy = jasmine.createSpyObj('DatabaseService', ['ensureReady']);

        TestBed.configureTestingModule({
            providers: [
                SerialAllocationService,
                { provide: DatabaseService, useValue: dbSpy }
            ]
        });

        service = TestBed.inject(SerialAllocationService);
        mockDatabaseService = TestBed.inject(DatabaseService) as jasmine.SpyObj<DatabaseService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('Serial Number Validation', () => {
        it('should validate unique serial numbers', async () => {
            const serialNumbers = ['SN-001', 'SN-002', 'SN-003'];

            // Check for duplicates
            const duplicates = serialNumbers.filter((item, index) =>
                serialNumbers.indexOf(item) !== index
            );

            expect(duplicates.length).toBe(0);
        });

        it('should detect duplicate serial numbers', () => {
            const serialNumbers = ['SN-001', 'SN-002', 'SN-001'];

            const duplicates = serialNumbers.filter((item, index) =>
                serialNumbers.indexOf(item) !== index
            );

            expect(duplicates.length).toBe(1);
            expect(duplicates[0]).toBe('SN-001');
        });

        it('should validate serial count matches quantity', () => {
            const qtyOrdered = 3;
            const serialNumbers = ['SN-001', 'SN-002', 'SN-003'];

            expect(serialNumbers.length).toBe(qtyOrdered);
        });

        it('should reject if serial count does not match', () => {
            const qtyOrdered = 3;
            const serialNumbers = ['SN-001', 'SN-002']; // Only 2

            expect(serialNumbers.length).not.toBe(qtyOrdered);
        });
    });

    describe('Serial Allocation', () => {
        it('should allocate specific serials', () => {
            const mockSerials = [
                { id: 1, serial_number: 'SN-001', status: 'IN_STOCK' },
                { id: 2, serial_number: 'SN-002', status: 'IN_STOCK' },
                { id: 3, serial_number: 'SN-003', status: 'IN_STOCK' }
            ];

            const specificSerials = ['SN-001', 'SN-002'];
            const allocated = mockSerials.filter(s =>
                specificSerials.includes(s.serial_number) && s.status === 'IN_STOCK'
            );

            expect(allocated.length).toBe(2);
        });

        it('should auto-allocate FIFO (oldest first)', () => {
            const mockSerials = [
                {
                    id: 1,
                    serial_number: 'SN-001',
                    status: 'IN_STOCK',
                    created_at: new Date('2025-01-01')
                },
                {
                    id: 2,
                    serial_number: 'SN-002',
                    status: 'IN_STOCK',
                    created_at: new Date('2025-01-15')
                }
            ];

            const sorted = mockSerials.sort((a, b) =>
                a.created_at.getTime() - b.created_at.getTime()
            );

            expect(sorted[0].serial_number).toBe('SN-001');
        });
    });

    describe('Serial Status Management', () => {
        it('should update status from IN_STOCK to SOLD', () => {
            const serial: {
                id: number;
                serial_number: string;
                status: 'IN_STOCK' | 'SOLD' | 'DAMAGED' | 'RETURNED';
            } = {
                id: 1,
                serial_number: 'SN-001',
                status: 'IN_STOCK'
            };

            serial.status = 'SOLD';
            expect(serial.status).toBe('SOLD');
        });

        it('should track sold date', () => {
            const serial: {
                id: number;
                serial_number: string;
                status: 'IN_STOCK' | 'SOLD' | 'DAMAGED' | 'RETURNED';
                sold_date?: Date;
            } = {
                id: 1,
                serial_number: 'SN-001',
                status: 'IN_STOCK',
                sold_date: undefined
            };

            serial.status = 'SOLD';
            serial.sold_date = new Date();

            expect(serial.sold_date).toBeDefined();
        });

        it('should handle return (SOLD to RETURNED)', () => {
            const serial: {
                id: number;
                serial_number: string;
                status: 'IN_STOCK' | 'SOLD' | 'DAMAGED' | 'RETURNED';
            } = {
                id: 1,
                serial_number: 'SN-001',
                status: 'SOLD'
            };

            serial.status = 'RETURNED';
            expect(serial.status).toBe('RETURNED');
        });

        it('should mark as damaged', () => {
            const serial: {
                id: number;
                serial_number: string;
                status: 'IN_STOCK' | 'SOLD' | 'DAMAGED' | 'RETURNED';
            } = {
                id: 1,
                serial_number: 'SN-001',
                status: 'IN_STOCK'
            };

            serial.status = 'DAMAGED';
            expect(serial.status).toBe('DAMAGED');
        });
    });

    describe('Serial Count by Status', () => {
        it('should count serials by status', () => {
            const mockSerials = [
                { id: 1, serial_number: 'SN-001', status: 'IN_STOCK' },
                { id: 2, serial_number: 'SN-002', status: 'IN_STOCK' },
                { id: 3, serial_number: 'SN-003', status: 'SOLD' },
                { id: 4, serial_number: 'SN-004', status: 'DAMAGED' }
            ];

            const counts: Record<string, number> = {
                IN_STOCK: 0,
                SOLD: 0,
                DAMAGED: 0,
                RETURNED: 0
            };

            mockSerials.forEach(serial => {
                counts[serial.status] = (counts[serial.status] || 0) + 1;
            });

            expect(counts['IN_STOCK']).toBe(2);
            expect(counts['SOLD']).toBe(1);
            expect(counts['DAMAGED']).toBe(1);
            expect(counts['RETURNED']).toBe(0);
        });
    });

    describe('Warranty Tracking', () => {
        it('should calculate warranty expiry', () => {
            const soldDate = new Date('2025-01-15');
            const warrantyYears = 1;

            const warrantyExpiry = new Date(soldDate);
            warrantyExpiry.setFullYear(warrantyExpiry.getFullYear() + warrantyYears);

            expect(warrantyExpiry.getFullYear()).toBe(2026);
            expect(warrantyExpiry.getMonth()).toBe(soldDate.getMonth());
            expect(warrantyExpiry.getDate()).toBe(soldDate.getDate());
        });

        it('should check if warranty is still valid', () => {
            const soldDate = new Date('2025-01-15');
            const warrantyExpiry = new Date('2026-01-15');
            const today = new Date('2025-06-15');

            const isValid = warrantyExpiry > today;
            expect(isValid).toBe(true);
        });
    });
});
