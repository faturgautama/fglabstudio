import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Authentication } from './authentication';
import { commonTestProviders, commonTestImports } from '../../../../test-helpers';

describe('Authentication', () => {
  let component: Authentication;
  let fixture: ComponentFixture<Authentication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Authentication, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Authentication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
