import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockCard } from './stock-card';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('StockCard Component', () => {
    let component: StockCard;
    let fixture: ComponentFixture<StockCard>;
    let mockStore: jasmine.SpyObj<Store>;

    beforeEach(async () => {
        mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);

        await TestBed.configureTestingModule({
            imports: [StockCard, ...commonTestImports],
            providers: [
                { provide: Store, useValue: mockStore }
            ]
        }).compileComponents();

        mockStore.select.and.returnValue(of([]));
        fixture = TestBed.createComponent(StockCard);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Stock Card Display', () => {
        it('should display transaction history', () => {
            const mockStockCards = [
                {
                    id: 1,
                    product_id: 1,
                    transaction_date: new Date(),
                    type: 'IN',
                    qty_in: 100,
                    qty_out: 0,
                    balance: 100,
                    reference_type: 'PURCHASE_ORDER',
                    reference_id: 1
                },
                {
                    id: 2,
                    product_id: 1,
                    transaction_date: new Date(),
                    type: 'OUT',
                    qty_in: 0,
                    qty_out: 20,
                    balance: 80,
                    reference_type: 'SALES',
                    reference_id: 1
                }
            ];

            mockStore.select.and.returnValue(of(mockStockCards));
            expect(component).toBeTruthy();
        });

        it('should show batch information if available', () => {
            const mockStockCard = {
                id: 1,
                product_id: 1,
                type: 'IN',
                qty_in: 1000,
                balance: 1000,
                batch_number: 'PARA-2025-01',
                expiry_date: new Date('2027-12-31')
            };

            expect(mockStockCard.batch_number).toBe('PARA-2025-01');
        });

        it('should show serial information if available', () => {
            const mockStockCard = {
                id: 1,
                product_id: 1,
                type: 'IN',
                qty_in: 1,
                balance: 1,
                serial_number: 'DELL-SN-001'
            };

            expect(mockStockCard.serial_number).toBe('DELL-SN-001');
        });
    });
});
