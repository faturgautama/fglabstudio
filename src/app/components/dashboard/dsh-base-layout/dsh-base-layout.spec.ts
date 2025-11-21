import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshBaseLayout } from './dsh-base-layout';
import { commonTestProviders, commonTestImports } from '../../../../test-helpers';

describe('DshBaseLayout', () => {
  let component: DshBaseLayout;
  let fixture: ComponentFixture<DshBaseLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DshBaseLayout, ...commonTestImports]
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
