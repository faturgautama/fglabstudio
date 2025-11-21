import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableSort } from './dynamic-table-sort';
import { commonTestProviders, commonTestImports } from '../../../../test-helpers';

describe('DynamicTableSort', () => {
  let component: DynamicTableSort;
  let fixture: ComponentFixture<DynamicTableSort>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTableSort, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTableSort);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
