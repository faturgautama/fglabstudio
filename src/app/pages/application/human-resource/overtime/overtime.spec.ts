import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Overtime } from './overtime';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('Overtime', () => {
    let component: Overtime;
    let fixture: ComponentFixture<Overtime>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Overtime, ...commonTestImports]
        })
            .compileComponents();

        fixture = TestBed.createComponent(Overtime);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

