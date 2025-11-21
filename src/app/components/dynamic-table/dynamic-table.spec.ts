import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTable } from './dynamic-table';
import { commonTestProviders, commonTestImports } from '../../../test-helpers';

describe('DynamicTable', () => {
  let component: DynamicTable;
  let fixture: ComponentFixture<DynamicTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTable, ...commonTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
