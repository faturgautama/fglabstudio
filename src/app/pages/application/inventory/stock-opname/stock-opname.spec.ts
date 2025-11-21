import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockOpname } from './stock-opname';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('StockOpname', () => {
    let component: StockOpname;
    let fixture: ComponentFixture<StockOpname>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StockOpname, ...commonTestImports]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StockOpname);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
