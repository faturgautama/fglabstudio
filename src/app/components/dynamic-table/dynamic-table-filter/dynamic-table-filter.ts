import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { DynamicTableModel } from '../../../model/components/dynamic-table.model';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-dynamic-table-filter',
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
  templateUrl: './dynamic-table-filter.html',
  styleUrl: './dynamic-table-filter.scss'
})
export class DynamicTableFilter implements OnInit {

  @Input('props') props!: DynamicTableModel.IFilter[];

  @Output('onFilter') onFilter = new EventEmitter<any>();

  type = DynamicTableModel.IColumnType;

  _formFilter: FormGroup;

  constructor(
    private _formBuilder: FormBuilder
  ) {
    this._formFilter = this._formBuilder.group({});
  }

  ngOnInit(): void {
    if (this.props.length) {
      this.props.forEach((item) => {
        this._formFilter.addControl(item.id, new FormControl(null));
      });
    }
  }

  handleApplyFilter() {
    const formValue = this._formFilter.value;
    const filtered = Object.fromEntries(Object.entries(formValue).filter(([key, value]) => value !== null && value !== ''));
    this.onFilter.emit(filtered);
  }

  handleClearFilter() {
    if (this.props.length) {
      this._formFilter.reset();

      this.props.forEach((item) => {
        this._formFilter.addControl(item.id, new FormControl(null));
      });
    }
  }
}
