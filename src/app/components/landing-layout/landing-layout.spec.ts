import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingLayout } from './landing-layout';
import { commonTestProviders, commonTestImports } from '../../../test-helpers';

describe('LandingLayout', () => {
  let component: LandingLayout;
  let fixture: ComponentFixture<LandingLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingLayout, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
