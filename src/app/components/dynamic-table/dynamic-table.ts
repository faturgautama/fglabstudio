import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { TableModule } from 'primeng/table';
import { DynamicTableModel } from '../../model/components/dynamic-table.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { DynamicTableFilter } from "./dynamic-table-filter/dynamic-table-filter";
import { DynamicTableSort } from './dynamic-table-sort/dynamic-table-sort';

@Component({
  selector: 'app-dynamic-table',
  imports: [
    FormsModule,
    TableModule,
    CommonModule,
    ButtonModule,
    PopoverModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    PopoverModule,
    DynamicTableFilter,
    DynamicTableSort
  ],
  standalone: true,
  templateUrl: './dynamic-table.html',
  styleUrl: './dynamic-table.scss'
})
export class DynamicTable implements OnInit, OnDestroy {

  Destroy$ = new Subject();

  _originalDatasource: any[] = [];

  @Input('props') props!: DynamicTableModel.ITable;

  @Output('onCellClicked') onCellClicked = new EventEmitter<any>();

  @Output('onRowDoubleClicked') onRowDoubleClicked = new EventEmitter<any>();

  @Output('onFilter') onFilter = new EventEmitter<any>();

  @Output('onSort') onSort = new EventEmitter<DynamicTableModel.ISort[]>();

  @Output('onCustomButtonClicked') onCustomButtonClicked = new EventEmitter<DynamicTableModel.ICustomButton>();

  @Output('onToolbarClicked') onToolbarClicked = new EventEmitter<any>();

  columType = DynamicTableModel.IColumnType;

  selectedRow: any;

  KeywordSearch = "";

  _keywordSearch$ = new BehaviorSubject<string>('');

  @ViewChild('FilterComps') FilterComps!: DynamicTableFilter;
  FilterCount: any;
  SortCount: any;

  @ViewChild('SortComps') SortComps!: DynamicTableSort;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this._originalDatasource = JSON.parse(JSON.stringify(this.props.datasource));

    this._keywordSearch$
      .pipe(
        takeUntil(this.Destroy$),
        debounceTime(750),
        distinctUntilChanged()
      ).subscribe((result) => {
        if (!result.length) {
          this.props.datasource = this._originalDatasource;
          this._cdr.detectChanges();
          return;
        }

        if (result.length) {
          this.props.datasource = this._originalDatasource.filter((item) => {
            const stringified = JSON.stringify(item);
            if (stringified.toLowerCase().includes(result.toLowerCase())) {
              return item;
            }
          });

          this._cdr.detectChanges();
        };
      });
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

  handleKeydownSearch(args: any) {
    console.log(args);
    this._keywordSearch$.next(args);
  }

  handleCellClicked(args: any, columns: any) {
    this.onCellClicked.emit(args);
  }

  handleRowDoubbleClicked(args: any) {
    this.onRowDoubleClicked.emit(args);
  }

  handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
    this.onCustomButtonClicked.emit(args);
  }

  handleToolbarClicked(args: DynamicTableModel.IToolbar, data: any) {
    this.onToolbarClicked.emit({ toolbar: args, data: data });
  }

  handleClearFilter() {
    this.FilterCount = null;
    this.FilterComps.handleClearFilter();
    this.onFilter.emit({});
  }

  handleFilter(args: any) {
    this.FilterCount = Object.keys(args).length;
    this.onFilter.emit(args);
  }

  handleSort(args: any) {
    this.onSort.emit(args);
  }

  handleFormatBadgeClass(value: string) {
    let class_name = 'bg-red-200 text-red-800';

    if (value === 'approved' || value.toLowerCase() === 'paid') {
      class_name = 'bg-green-200 text-green-800';
    } else if (value === 'rejected' || value === 'cancelled') {
      class_name = 'bg-red-200 text-red-800';
    } else if (value === 'pending') {
      class_name = 'bg-yellow-200 text-yellow-800';
    };

    return class_name;
  }

  handleFormatStringToNumber(data: string): number {
    return parseFloat(data);
  }

  handleFormatColor(color: string) {
    return color.split("-")[1];
  }

  handleGetNestedValue(obj: any, path: string): any {
    if (!obj || !path) return null;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
}
