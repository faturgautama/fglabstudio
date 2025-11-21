import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshLoading } from './dsh-loading';
import { commonTestProviders, commonTestImports } from '../../../../test-helpers';

describe('DshLoading', () => {
  let component: DshLoading;
  let fixture: ComponentFixture<DshLoading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DshLoading, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DshLoading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
