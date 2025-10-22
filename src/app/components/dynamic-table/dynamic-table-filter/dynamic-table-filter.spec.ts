import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableFilter } from './dynamic-table-filter';

describe('DynamicTableFilter', () => {
  let component: DynamicTableFilter;
  let fixture: ComponentFixture<DynamicTableFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTableFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTableFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
