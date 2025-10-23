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
    DynamicTableFilter
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

  @Output('onFilter') onFilter = new EventEmitter<DynamicTableModel.IFilter[]>();

  @Output('onSort') onSort = new EventEmitter<DynamicTableModel.ISort[]>();

  @Output('onCustomButtonClicked') onCustomButtonClicked = new EventEmitter<DynamicTableModel.ICustomButton>();

  @Output('onToolbarClicked') onToolbarClicked = new EventEmitter<any>();

  columType = DynamicTableModel.IColumnType;

  selectedRow: any;

  KeywordSearch = "";

  _keywordSearch$ = new BehaviorSubject<string>('');

  @ViewChild('FilterComps') FilterComps!: DynamicTableFilter;
  FilterCount: any;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute
  ) {
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

  ngOnInit(): void {
    this._originalDatasource = JSON.parse(JSON.stringify(this.props.datasource));
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

  handleKeydownSearch(args: any) {
    this._keywordSearch$.next(args);
  }

  handleCellClicked(args: any, columns: any) {
    console.log("args =>", args);
    console.log("columns =>", columns);
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
  }

  handleFilter(args: DynamicTableModel.IFilter[]) {
    this.FilterCount = args.length;
    this.onFilter.emit(args);
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
