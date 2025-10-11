import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshBaseLayout } from './dsh-base-layout';

describe('DshBaseLayout', () => {
  let component: DshBaseLayout;
  let fixture: ComponentFixture<DshBaseLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DshBaseLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DshBaseLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
