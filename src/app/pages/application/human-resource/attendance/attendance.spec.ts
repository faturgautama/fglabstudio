import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Attendance } from './attendance';
import { commonTestProviders, commonTestImports } from '../../../../../test-helpers';

describe('Attendance', () => {
  let component: Attendance;
  let fixture: ComponentFixture<Attendance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Attendance, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Attendance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
