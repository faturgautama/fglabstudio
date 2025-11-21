import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicTableModel } from '../../../model/components/dynamic-table.model';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-dynamic-table-sort',
  imports: [
    FormsModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    InputNumberModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './dynamic-table-sort.html',
  styleUrl: './dynamic-table-sort.scss'
})
export class DynamicTableSort implements OnInit {

  @Input() props!: DynamicTableModel.ISort[];

  @Output() onSort = new EventEmitter<any>();

  type = DynamicTableModel.IColumnType;

  _formSort: FormGroup;

  constructor(
    private _formBuilder: FormBuilder
  ) {
    this._formSort = this._formBuilder.group({});
  }

  ngOnInit(): void {
    if (this.props.length) {
      this.props.forEach((item) => {
        this._formSort.addControl(item.id, new FormControl(null));
      });
    }
  }

  handleApplySort(sortBy: string, sortType: string) {
    this.onSort.emit({ sort_by: sortBy, sort_type: sortType });
  }
}
