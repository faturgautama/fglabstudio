import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shift } from './shift';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('Shift', () => {
  let component: Shift;
  let fixture: ComponentFixture<Shift>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shift, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shift);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
