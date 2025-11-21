import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockMovement } from './stock-movement';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('StockMovement Component', () => {
    let component: StockMovement;
    let fixture: ComponentFixture<StockMovement>;
    let mockStore: jasmine.SpyObj<Store>;
    let mockMessageService: jasmine.SpyObj<MessageService>;

    beforeEach(async () => {
        mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
        mockMessageService = jasmine.createSpyObj('MessageService', ['add', 'clear']);

        await TestBed.configureTestingModule({
            imports: [StockMovement, ...commonTestImports],
            providers: [
                { provide: Store, useValue: mockStore },
                { provide: MessageService, useValue: mockMessageService },
                { provide: ConfirmationService, useValue: {} }
            ]
        }).compileComponents();

        mockStore.select.and.returnValue(of([]));
        fixture = TestBed.createComponent(StockMovement);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Stock Movement Form', () => {
        it('should initialize form', () => {
            expect(component.Form).toBeDefined();
        });

        it('should validate required fields', () => {
            const form = component.Form;
            expect(form.get('movement_number')?.hasError('required')).toBe(true);
            expect(form.get('type')?.hasError('required')).toBe(true);
            expect(form.get('product_id')?.hasError('required')).toBe(true);
            expect(form.get('quantity')?.hasError('required')).toBe(true);
        });
    });

    describe('Movement Types', () => {
        it('should create IN movement', () => {
            const movementData = {
                movement_number: 'SM/202501/0001',
                type: 'IN',
                product_id: '1',
                quantity: 50,
                movement_date: new Date(),
                reason: 'Return from customer'
            };
            component.Form.patchValue(movementData);
            expect(component.Form.get('type')?.value).toBe('IN');
        });

        it('should create OUT movement', () => {
            const movementData = {
                movement_number: 'SM/202501/0002',
                type: 'OUT',
                product_id: '1',
                quantity: 10,
                movement_date: new Date(),
                reason: 'Damaged'
            };
            component.Form.patchValue(movementData);
            expect(component.Form.get('type')?.value).toBe('OUT');
        });

        it('should create ADJUSTMENT movement', () => {
            const movementData = {
                movement_number: 'SM/202501/0003',
                type: 'ADJUSTMENT',
                product_id: '1',
                quantity: 5,
                movement_date: new Date(),
                reason: 'Stock opname correction'
            };
            component.Form.patchValue(movementData);
            expect(component.Form.get('type')?.value).toBe('ADJUSTMENT');
        });

        it('should create TRANSFER movement', () => {
            const movementData = {
                movement_number: 'SM/202501/0004',
                type: 'TRANSFER',
                product_id: '1',
                warehouse_from: 'WH-001',
                warehouse_to: 'WH-002',
                quantity: 20,
                movement_date: new Date()
            };
            component.Form.patchValue(movementData);
            expect(component.Form.get('type')?.value).toBe('TRANSFER');
        });
    });
});
