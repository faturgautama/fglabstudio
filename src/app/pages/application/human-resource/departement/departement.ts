import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { Subject, takeUntil, tap } from 'rxjs';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { Store } from '@ngxs/store';
import { DepartementAction, DepartementState } from '../../../../store/human-resource/departement';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";
import { DialogModule } from "primeng/dialog";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TitleCasePipe } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { DepartmentService } from '../../../../services/pages/application/human-resource/departement.service';

@Component({
  selector: 'app-departement',
  imports: [
    FormsModule,
    ButtonModule,
    DynamicTable,
    DialogModule,
    SelectModule,
    DshBaseLayout,
    TitleCasePipe,
    TextareaModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './departement.html',
  styleUrl: './departement.scss'
})
export class Departement implements OnInit, OnDestroy {

  _store = inject(Store);
  _departemenService = inject(DepartmentService);

  Destroy$ = new Subject();

  TableProps: DynamicTableModel.ITable = {
    id: 'departement',
    title: 'Daftar Departemen',
    description: 'Daftar departemen aktif perusahaan',
    column: [
      {
        id: 'code',
        title: 'Kode Departemen',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '250px'
      },
      {
        id: 'title',
        title: 'Nama Departemen',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '400px'
      },
      {
        id: 'description',
        title: 'Keterangan',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '250px'
      },
      {
        id: 'color',
        title: 'Warna',
        type: DynamicTableModel.IColumnType.BUTTON_ICON,
        button_icon_description: 'title',
      },
      {
        id: 'created_at',
        title: 'Waktu Entry',
        type: DynamicTableModel.IColumnType.DATETIME,
        width: '300px'
      },
    ],
    datasource: [],
    filter: [
      {
        id: 'code',
        title: 'Kode Departemen',
        type: DynamicTableModel.IColumnType.TEXT,
        value: ''
      },
      {
        id: 'title',
        title: 'Nama Departemen',
        type: DynamicTableModel.IColumnType.TEXT,
        value: ''
      },
      {
        id: 'description',
        title: 'Keterangan',
        type: DynamicTableModel.IColumnType.TEXT,
        value: ''
      },
    ],
    sort: [
      {
        id: 'code',
        title: 'Kode Departemen',
        value: ''
      },
      {
        id: 'title',
        title: 'Nama Departemen',
        value: ''
      },
    ],
    toolbar: [
      { id: 'detail', icon: 'pi pi-info', title: 'Detail' },
      { id: 'delete', icon: 'pi pi-trash', title: 'Hapus' },
    ],
    paging: true,
    custom_button: [
      { id: 'add', title: 'Add', icon: 'pi pi-plus' }
    ]
  };

  _modalToggler = false;

  _formBuilder = inject(FormBuilder);
  _formState: 'insert' | 'update' = 'insert';
  Form = this._formBuilder.group({
    id: ['', []],
    code: ['', [Validators.required]],
    title: ['', [Validators.required]],
    description: ['', []],
    color: ['', [Validators.required]]
  });

  _colorDatasource = [
    { id: 'red', value: 'text-red-600' },
    { id: 'orange', value: 'text-orange-600' },
    { id: 'amber', value: 'text-amber-600' },
    { id: 'yellow', value: 'text-yellow-600' },
    { id: 'lime', value: 'text-lime-600' },
    { id: 'green', value: 'text-green-600' },
    { id: 'emerald', value: 'text-emerald-600' },
    { id: 'teal', value: 'text-teal-600' },
    { id: 'cyan', value: 'text-cyan-600' },
    { id: 'sky', value: 'text-sky-600' },
    { id: 'blue', value: 'text-blue-600' },
    { id: 'indigo', value: 'text-indigo-600' },
    { id: 'violet', value: 'text-violet-600' },
    { id: 'purple', value: 'text-purple-600' },
    { id: 'fuchsia', value: 'text-fuchsia-600' },
    { id: 'pink', value: 'text-pink-600' },
    { id: 'rose', value: 'text-rose-600' },
    { id: 'slate', value: 'text-slate-600' },
    { id: 'gray', value: 'text-gray-600' },
    { id: 'zinc', value: 'text-zinc-600' },
    { id: 'neutral', value: 'text-neutral-600' },
    { id: 'stone', value: 'text-stone-600' },
  ];

  ngOnInit(): void {
    this._store
      .select(DepartementState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => this.TableProps.datasource = result);
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

  handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
    if (args.id == 'add') {
      this._formState = 'insert';
      this.Form.reset();
      this._modalToggler = true;
    }
  }

  handleToolbarClicked(args: DynamicTableModel.IToolbar) {
    console.log(args);
  }

  handleSave(args: any) {
    if (this.Form.valid) {
      this._store
        .dispatch(new DepartementAction.AddDepartement(args))
        .subscribe((result) => {
          console.log(result);
        })
    }
  }
}
