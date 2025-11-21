import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanySetting } from './company-setting';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('CompanySetting', () => {
    let component: CompanySetting;
    let fixture: ComponentFixture<CompanySetting>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompanySetting, ...commonTestImports]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CompanySetting);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
