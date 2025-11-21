import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Employee } from './employee';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('Employee', () => {
  let component: Employee;
  let fixture: ComponentFixture<Employee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Employee, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Employee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
