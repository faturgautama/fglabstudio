import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Supplier } from './supplier';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('Supplier Component', () => {
    let component: Supplier;
    let fixture: ComponentFixture<Supplier>;
    let mockStore: jasmine.SpyObj<Store>;
    let mockMessageService: jasmine.SpyObj<MessageService>;

    beforeEach(async () => {
        mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
        mockMessageService = jasmine.createSpyObj('MessageService', ['add', 'clear']);

        await TestBed.configureTestingModule({
            imports: [Supplier, ...commonTestImports],
            providers: [
                { provide: Store, useValue: mockStore },
                { provide: MessageService, useValue: mockMessageService },
                { provide: ConfirmationService, useValue: {} }
            ]
        }).compileComponents();

        mockStore.select.and.returnValue(of([]));
        fixture = TestBed.createComponent(Supplier);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Supplier Form', () => {
        it('should initialize form', () => {
            expect(component.Form).toBeDefined();
        });

        it('should validate required fields', () => {
            const form = component.Form;
            expect(form.get('name')?.hasError('required')).toBe(true);
        });

        it('should set default active status', () => {
            expect(component.Form.get('is_active')?.value).toBe(true);
        });
    });

    describe('Supplier Scenarios', () => {
        it('should create supplier with complete data', () => {
            const supplierData = {
                name: 'PT Supplier Elektronik',
                code: 'SUP-001',
                contact_person: 'Budi Santoso',
                phone: '021-12345678',
                mobile: '0812-3456-7890',
                email: 'supplier@test.com',
                address: 'Jl. Industri No. 45',
                city: 'Jakarta',
                postal_code: '12345',
                country: 'Indonesia',
                payment_terms: 'Net 30',
                payment_method: 'Transfer Bank',
                bank_name: 'BCA',
                bank_account: '1234567890',
                tax_id: '01.234.567.8-901.000',
                is_pkp: true,
                is_active: true
            };
            component.Form.patchValue(supplierData);
            expect(component.Form.valid).toBe(true);
        });

        it('should create supplier with minimal data', () => {
            const supplierData = {
                name: 'PT Supplier Makanan',
                code: 'SUP-002',
                phone: '021-11111111',
                is_active: true
            };
            component.Form.patchValue(supplierData);
            expect(component.Form.valid).toBe(true);
        });
    });
});
