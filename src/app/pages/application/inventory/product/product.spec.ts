import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from './product';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductService } from '../../../../services/pages/application/inventory/product.service';
import { of } from 'rxjs';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('Product Component', () => {
    let component: Product;
    let fixture: ComponentFixture<Product>;
    let mockStore: jasmine.SpyObj<Store>;
    let mockProductService: jasmine.SpyObj<ProductService>;
    let mockMessageService: jasmine.SpyObj<MessageService>;

    beforeEach(async () => {
        mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
        mockProductService = jasmine.createSpyObj('ProductService', ['generateSKU']);
        mockMessageService = jasmine.createSpyObj('MessageService', ['add', 'clear']);

        await TestBed.configureTestingModule({
            imports: [Product, ...commonTestImports],
            providers: [
                { provide: Store, useValue: mockStore },
                { provide: ProductService, useValue: mockProductService },
                { provide: MessageService, useValue: mockMessageService },
                { provide: ConfirmationService, useValue: {} }
            ]
        }).compileComponents();

        mockStore.select.and.returnValue(of([]));
        fixture = TestBed.createComponent(Product);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Product Form', () => {
        it('should initialize form with default values', () => {
            expect(component.Form).toBeDefined();
            expect(component.Form.get('is_batch_tracked')?.value).toBe(false);
            expect(component.Form.get('is_serial_tracked')?.value).toBe(false);
            expect(component.Form.get('is_active')?.value).toBe(true);
        });

        it('should validate required fields', () => {
            const form = component.Form;
            expect(form.get('sku')?.hasError('required')).toBe(true);
            expect(form.get('name')?.hasError('required')).toBe(true);
            expect(form.get('unit')?.hasError('required')).toBe(true);
        });
    });

    describe('Tracking Method Selection', () => {
        it('should allow standard tracking (no batch/serial)', () => {
            component.Form.patchValue({
                is_batch_tracked: false,
                is_serial_tracked: false
            });
            expect(component.Form.get('is_batch_tracked')?.value).toBe(false);
            expect(component.Form.get('is_serial_tracked')?.value).toBe(false);
        });

        it('should allow batch tracking only', () => {
            component.Form.patchValue({
                is_batch_tracked: true,
                is_serial_tracked: false,
                is_perishable: true
            });
            expect(component.Form.get('is_batch_tracked')?.value).toBe(true);
            expect(component.Form.get('is_serial_tracked')?.value).toBe(false);
        });

        it('should allow serial tracking only', () => {
            component.Form.patchValue({
                is_batch_tracked: false,
                is_serial_tracked: true
            });
            expect(component.Form.get('is_batch_tracked')?.value).toBe(false);
            expect(component.Form.get('is_serial_tracked')?.value).toBe(true);
        });

        it('should allow both batch and serial tracking', () => {
            component.Form.patchValue({
                is_batch_tracked: true,
                is_serial_tracked: true
            });
            expect(component.Form.get('is_batch_tracked')?.value).toBe(true);
            expect(component.Form.get('is_serial_tracked')?.value).toBe(true);
        });
    });

    describe('SKU Generation', () => {
        it('should generate SKU for new product', () => {
            mockProductService.generateSKU.and.returnValue(of('PRD-001'));
            component._formState = 'insert';
            component.generateSKU();
            expect(mockProductService.generateSKU).toHaveBeenCalled();
        });

        it('should not generate SKU for existing product', () => {
            component._formState = 'update';
            component.generateSKU();
            expect(mockProductService.generateSKU).not.toHaveBeenCalled();
        });
    });

    describe('Product Scenarios', () => {
        it('should create standard product (Alat Tulis)', () => {
            const productData = {
                sku: 'PRD-001',
                name: 'Pulpen Pilot',
                unit: 'PCS',
                current_stock: 0,
                min_stock: 10,
                purchase_price: 5000,
                selling_price: 7000,
                is_batch_tracked: false,
                is_serial_tracked: false,
                is_active: true
            };
            component.Form.patchValue(productData);
            expect(component.Form.valid).toBe(true);
        });

        it('should create batch tracked product (Obat-obatan)', () => {
            const productData = {
                sku: 'PRD-002',
                name: 'Paracetamol 500mg',
                unit: 'PCS',
                current_stock: 0,
                min_stock: 100,
                purchase_price: 500,
                selling_price: 1000,
                is_batch_tracked: true,
                is_serial_tracked: false,
                is_perishable: true,
                is_active: true
            };
            component.Form.patchValue(productData);
            expect(component.Form.valid).toBe(true);
            expect(component.Form.get('is_batch_tracked')?.value).toBe(true);
        });

        it('should create serial tracked product (Elektronik)', () => {
            const productData = {
                sku: 'PRD-003',
                name: 'Laptop Dell XPS 15',
                unit: 'PCS',
                current_stock: 0,
                min_stock: 5,
                purchase_price: 15000000,
                selling_price: 18000000,
                is_batch_tracked: false,
                is_serial_tracked: true,
                is_active: true
            };
            component.Form.patchValue(productData);
            expect(component.Form.valid).toBe(true);
            expect(component.Form.get('is_serial_tracked')?.value).toBe(true);
        });

        it('should create product with both tracking (Handphone)', () => {
            const productData = {
                sku: 'PRD-004',
                name: 'iPhone 15 Pro',
                unit: 'PCS',
                current_stock: 0,
                min_stock: 3,
                purchase_price: 18000000,
                selling_price: 22000000,
                is_batch_tracked: true,
                is_serial_tracked: true,
                is_active: true
            };
            component.Form.patchValue(productData);
            expect(component.Form.valid).toBe(true);
            expect(component.Form.get('is_batch_tracked')?.value).toBe(true);
            expect(component.Form.get('is_serial_tracked')?.value).toBe(true);
        });
    });
});
