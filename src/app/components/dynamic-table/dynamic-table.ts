import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TableModule } from 'primeng/table';
import { DynamicTableModel } from '../../model/components/dynamic-table.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-dynamic-table',
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    PopoverModule
  ],
  standalone: true,
  templateUrl: './dynamic-table.html',
  styleUrl: './dynamic-table.scss'
})
export class DynamicTable implements OnInit, OnDestroy {

  Destroy$ = new Subject();

  @Input('props') props!: DynamicTableModel.ITable;

  @Output('onCellClicked') onCellClicked = new EventEmitter<any>();

  @Output('onRowDoubleClicked') onRowDoubleClicked = new EventEmitter<any>();

  @Output('onFilter') onFilter = new EventEmitter<DynamicTableModel.IFilter[]>();

  @Output('onSort') onSort = new EventEmitter<DynamicTableModel.ISort[]>();

  @Output('onCustomButtonClicked') onCustomButtonClicked = new EventEmitter<DynamicTableModel.ICustomButton>();

  @Output('onToolbarClicked') onToolbarClicked = new EventEmitter<DynamicTableModel.IToolbar>();

  columType = DynamicTableModel.IColumnType;

  selectedRow: any;

  constructor(
    private _activatedRoute: ActivatedRoute
  ) {
    this._activatedRoute
      .data
      .pipe(takeUntil(this.Destroy$))
      .subscribe((result) => {
        console.log(result);
      })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

  handleCellClicked(args: any) {
    console.log(args);
    this.onCellClicked.emit(args);
  }

  handleRowDoubbleClicked(args: any) {
    this.onRowDoubleClicked.emit(args);
  }

  handleFormatStringToNumber(data: string): number {
    return parseFloat(data);
  }

  handleFormatColor(color: string) {
    return color.split("-")[1];
  }

  handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
    this.onCustomButtonClicked.emit(args);
  }

  handleToolbarClicked(args: any) {
    this.onToolbarClicked.emit(args);
  }
}
