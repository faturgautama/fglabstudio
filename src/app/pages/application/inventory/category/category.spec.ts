import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Category } from './category';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('Category Component', () => {
    let component: Category;
    let fixture: ComponentFixture<Category>;
    let mockStore: jasmine.SpyObj<Store>;
    let mockMessageService: jasmine.SpyObj<MessageService>;

    beforeEach(async () => {
        mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
        mockMessageService = jasmine.createSpyObj('MessageService', ['add', 'clear']);

        await TestBed.configureTestingModule({
            imports: [Category, ...commonTestImports],
            providers: [
                { provide: Store, useValue: mockStore },
                { provide: MessageService, useValue: mockMessageService },
                { provide: ConfirmationService, useValue: {} }
            ]
        }).compileComponents();

        mockStore.select.and.returnValue(of([]));
        fixture = TestBed.createComponent(Category);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Category Form', () => {
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

    describe('Category Scenarios', () => {
        it('should create Elektronik category', () => {
            const categoryData = {
                name: 'Elektronik',
                description: 'Produk elektronik dan gadget',
                is_active: true
            };
            component.Form.patchValue(categoryData);
            expect(component.Form.valid).toBe(true);
        });

        it('should create Makanan category', () => {
            const categoryData = {
                name: 'Makanan',
                description: 'Makanan & Minuman',
                is_active: true
            };
            component.Form.patchValue(categoryData);
            expect(component.Form.valid).toBe(true);
        });

        it('should create Obat-obatan category', () => {
            const categoryData = {
                name: 'Obat-obatan',
                description: 'Obat dan suplemen kesehatan',
                is_active: true
            };
            component.Form.patchValue(categoryData);
            expect(component.Form.valid).toBe(true);
        });
    });
});
