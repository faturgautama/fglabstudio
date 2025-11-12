import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipPrint } from './payslip-print';

describe('PayslipPrint', () => {
  let component: PayslipPrint;
  let fixture: ComponentFixture<PayslipPrint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayslipPrint]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayslipPrint);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
