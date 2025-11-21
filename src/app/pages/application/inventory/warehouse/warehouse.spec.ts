import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Warehouse } from './warehouse';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('Warehouse Component', () => {
    let component: Warehouse;
    let fixture: ComponentFixture<Warehouse>;
    let mockStore: jasmine.SpyObj<Store>;
    let mockMessageService: jasmine.SpyObj<MessageService>;

    beforeEach(async () => {
        mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
        mockMessageService = jasmine.createSpyObj('MessageService', ['add', 'clear']);

        await TestBed.configureTestingModule({
            imports: [Warehouse, ...commonTestImports],
            providers: [
                { provide: Store, useValue: mockStore },
                { provide: MessageService, useValue: mockMessageService },
                { provide: ConfirmationService, useValue: {} }
            ]
        }).compileComponents();

        mockStore.select.and.returnValue(of([]));
        fixture = TestBed.createComponent(Warehouse);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Warehouse Form', () => {
        it('should initialize form', () => {
            expect(component.Form).toBeDefined();
        });

        it('should validate required fields', () => {
            const form = component.Form;
            expect(form.get('code')?.hasError('required')).toBe(true);
            expect(form.get('name')?.hasError('required')).toBe(true);
        });

        it('should set default values', () => {
            expect(component.Form.get('is_active')?.value).toBe(true);
            expect(component.Form.get('is_default')?.value).toBe(false);
        });
    });

    describe('Warehouse Scenarios', () => {
        it('should create main warehouse', () => {
            const warehouseData = {
                code: 'WH-001',
                name: 'Gudang Pusat',
                address: 'Jl. Gudang No. 1',
                city: 'Jakarta',
                manager_name: 'John Doe',
                phone: '021-11111111',
                is_default: true,
                is_active: true
            };
            component.Form.patchValue(warehouseData);
            expect(component.Form.valid).toBe(true);
            expect(component.Form.get('is_default')?.value).toBe(true);
        });

        it('should create branch warehouse', () => {
            const warehouseData = {
                code: 'WH-002',
                name: 'Gudang Cabang A',
                city: 'Surabaya',
                is_default: false,
                is_active: true
            };
            component.Form.patchValue(warehouseData);
            expect(component.Form.valid).toBe(true);
        });
    });
});
