import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchaseOrder } from './purchase-order';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PurchaseOrderService } from '../../../../services/pages/application/inventory/purchase-order.service';
import { of } from 'rxjs';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('PurchaseOrder Component', () => {
    let component: PurchaseOrder;
    let fixture: ComponentFixture<PurchaseOrder>;
    let mockStore: jasmine.SpyObj<Store>;
    let mockPOService: jasmine.SpyObj<PurchaseOrderService>;
    let mockMessageService: jasmine.SpyObj<MessageService>;

    beforeEach(async () => {
        mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
        mockPOService = jasmine.createSpyObj('PurchaseOrderService', ['generatePONumber']);
        mockMessageService = jasmine.createSpyObj('MessageService', ['add', 'clear']);

        await TestBed.configureTestingModule({
            imports: [PurchaseOrder, ...commonTestImports],
            providers: [
                { provide: Store, useValue: mockStore },
                { provide: PurchaseOrderService, useValue: mockPOService },
                { provide: MessageService, useValue: mockMessageService },
                { provide: ConfirmationService, useValue: {} }
            ]
        }).compileComponents();

        mockStore.select.and.returnValue(of([]));
        fixture = TestBed.createComponent(PurchaseOrder);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('PO Form', () => {
        it('should initialize form with default values', () => {
            expect(component.Form).toBeDefined();
            expect(component.Form.get('status')?.value).toBe('DRAFT');
            expect(component.Form.get('payment_status')?.value).toBe('UNPAID');
        });

        it('should validate required fields', () => {
            const form = component.Form;
            expect(form.get('po_number')?.hasError('required')).toBe(true);
            expect(form.get('supplier_id')?.hasError('required')).toBe(true);
            expect(form.get('order_date')?.hasError('required')).toBe(true);
        });

        it('should have items FormArray', () => {
            expect(component.items).toBeDefined();
            expect(component.items.length).toBe(0);
        });
    });

    describe('PO Items Management', () => {
        it('should add item to FormArray', () => {
            const initialLength = component.items.length;
            component.addItem();
            expect(component.items.length).toBe(initialLength + 1);
        });

        it('should remove item from FormArray', () => {
            component.addItem();
            component.addItem();
            const lengthBefore = component.items.length;
            component.removeItem(0);
            expect(component.items.length).toBe(lengthBefore - 1);
        });

        it('should calculate item subtotal', () => {
            component.addItem();
            const item = component.items.at(0);
            item.patchValue({
                qty_ordered: 10,
                unit_price: 5000,
                discount_percentage: 10,
                tax_percentage: 11
            });
            component.calculateItemSubtotal(0);

            // (10 * 5000) - 10% = 45000
            // 45000 + 11% = 49950
            expect(item.get('subtotal')?.value).toBe(49950);
        });
    });

    describe('PO Totals Calculation', () => {
        it('should calculate total correctly', () => {
            component.addItem();
            component.items.at(0).patchValue({
                qty_ordered: 10,
                unit_price: 5000,
                subtotal: 50000
            });

            component.Form.patchValue({
                discount_percentage: 5,
                tax_amount: 5000,
                shipping_cost: 10000,
                other_costs: 5000
            });

            component.calculateTotals();

            // 50000 - 5% = 47500
            // 47500 + 5000 + 10000 + 5000 = 67500
            expect(component.Form.get('total_amount')?.value).toBe(67500);
        });
    });

    describe('PO Number Generation', () => {
        it('should generate PO number for new PO', () => {
            mockPOService.generatePONumber.and.returnValue(of('PO/202501/0001'));
            component._formState = 'insert';
            component.generatePONumber();
            expect(mockPOService.generatePONumber).toHaveBeenCalled();
        });
    });

    describe('Receive Dialog', () => {
        it('should initialize receive dialog properties', () => {
            expect(component._receiveDialogVisible).toBe(false);
            expect(component._selectedPOForReceive).toBeNull();
        });

        it('should open receive dialog when toolbar clicked', () => {
            const mockPO = {
                id: 1,
                po_number: 'PO/202501/0001',
                items: []
            };

            mockStore.select.and.returnValue(of(mockPO));
            mockStore.dispatch.and.returnValue(of(undefined));

            component.handleToolbarClicked({
                toolbar: { id: 'receive' },
                data: mockPO
            });

            expect(mockStore.dispatch).toHaveBeenCalled();
        });
    });

    describe('PO Scenarios', () => {
        it('should create PO for standard product', () => {
            const poData = {
                po_number: 'PO/202501/0001',
                supplier_id: '1',
                order_date: new Date(),
                status: 'DRAFT'
            };
            component.Form.patchValue(poData);

            component.addItem();
            component.items.at(0).patchValue({
                product_id: '1',
                qty_ordered: 100,
                unit_price: 5000
            });

            expect(component.Form.valid).toBe(true);
            expect(component.items.length).toBe(1);
        });

        it('should create PO for batch tracked product', () => {
            component.addItem();
            component.items.at(0).patchValue({
                product_id: '2', // Paracetamol
                qty_ordered: 1000,
                unit_price: 500,
                batch_number: '', // Will be filled on receive
                expiry_date: null
            });

            expect(component.items.at(0).get('product_id')?.value).toBe('2');
        });

        it('should create PO for serial tracked product', () => {
            component.addItem();
            component.items.at(0).patchValue({
                product_id: '3', // Laptop
                qty_ordered: 3,
                unit_price: 15000000,
                serial_numbers: [] // Will be filled on receive
            });

            expect(component.items.at(0).get('product_id')?.value).toBe('3');
        });
    });

    describe('Receive Complete Handler', () => {
        it('should handle receive complete successfully', () => {
            mockStore.dispatch.and.returnValue(of(undefined));

            const receiveData = {
                po_id: 1,
                items: [
                    {
                        id: 1,
                        qty_received: 100
                    }
                ]
            };

            component.handleReceiveComplete(receiveData);
            expect(mockStore.dispatch).toHaveBeenCalled();
        });
    });
});
