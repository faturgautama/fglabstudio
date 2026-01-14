import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPurchaseDialog } from './new-purchase-dialog';

describe('NewPurchaseDialog', () => {
  let component: NewPurchaseDialog;
  let fixture: ComponentFixture<NewPurchaseDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPurchaseDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPurchaseDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
