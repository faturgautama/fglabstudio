import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { PositionState, PositionAction } from '../../../../store/human-resource/position';
import { PositionService } from '../../../../services/pages/application/human-resource/position.service';
import { DepartementState } from '../../../../store/human-resource/departement';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';

@Component({
  selector: 'app-position',
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
  templateUrl: './position.html',
  styleUrl: './position.scss'
})
export class Position implements OnInit, OnDestroy {

  _store = inject(Store);
  _posisiService = inject(PositionService);
  _messageService = inject(MessageService);
  _confirmationService = inject(ConfirmationService);

  Destroy$ = new Subject();

  TableProps: DynamicTableModel.ITable = {
    id: 'posisit',
    title: 'Daftar Posisi Jabatan',
    description: 'Daftar posisi jabatan aktif perusahaan',
    column: [
      {
        id: 'code',
        title: 'Kode Posisi',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '250px'
      },
      {
        id: 'title',
        title: 'Nama Posisi',
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
        id: 'department.color',
        title: 'Departemen',
        type: DynamicTableModel.IColumnType.BUTTON_ICON,
        button_icon: {
          title: 'department.title',
          icon_class: 'pi pi-circle-fill',
          icon_color: 'department.color',
          use_parsing_func: false,
        }
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
        title: 'Kode Posisi',
        type: DynamicTableModel.IColumnType.TEXT,
        value: ''
      },
      {
        id: 'title',
        title: 'Nama Posisi',
        type: DynamicTableModel.IColumnType.TEXT,
        value: ''
      },
      {
        id: 'department_id',
        title: 'Departemen',
        type: DynamicTableModel.IColumnType.DROPDOWN,
        value: '',
        select_props: {
          datasource: [],
          name: 'title',
          value: 'id'
        }
      },
    ],
    sort: [
      {
        id: 'code',
        title: 'Kode Posisi',
        value: ''
      },
      {
        id: 'title',
        title: 'Nama Posisi',
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
    department_id: ['', [Validators.required]],
  });

  _departemenDatasource: EmployeeModel.IDepartment[] = [];

  ngOnInit(): void {
    this._store
      .select(DepartementState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => this._departemenDatasource = result);

    this._store
      .select(PositionState.getAll)
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

  handleFilter(args: any) {
    const filter = args || {};
    this._store.dispatch(new PositionAction.GetPosition(filter, {}));
  }

  handleSort(args: any) {
    const sort = args || {};
    this._store.dispatch(new PositionAction.GetPosition({}, sort));
  }

  handleToolbarClicked(args: any) {
    if (args.toolbar.id == 'detail') {
      this._formState = 'update';
      this._modalToggler = true;
      // Wait a tick for the select to render its options
      setTimeout(() => {
        const selectedDept = this._departemenDatasource.find(
          d => d.id === args.data.department?.id
        );

        this.Form.patchValue({
          ...args.data,
          department_id: selectedDept ?? args.data.department
        });
      }, 0);
    };

    if (args.toolbar.id == 'delete') {
      this._confirmationService.confirm({
        message: 'Apakah anda yakin menghapus data ini?',
        header: 'Danger Zone',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Hapus',
          severity: 'danger',
        },
        accept: () => {
          this._store
            .dispatch(new PositionAction.DeletePosition(args.data.id))
            .subscribe((result) => {
              setTimeout(() => {
                this._messageService.clear();
                this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Posisi Berhasil Dihapus' });
              }, 3100);
            })
        },
      });
    };
  }

  handleSave(args: any) {
    if (this.Form.valid) {
      let { department_id, ...payload } = args;
      this._store
        .dispatch(new PositionAction.AddPosition({ ...payload, department_id: department_id.id }))
        .subscribe((result) => {
          setTimeout(() => {
            this._messageService.clear();
            this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Posisi Berhasil Disimpan' });
            this.resetForm(true);
          }, 3100);
        })
    }
  }

  handleUpdate(args: any) {
    if (this.Form.valid) {
      let { department_id, ...payload } = args;
      this._store
        .dispatch(new PositionAction.UpdatePosition({ ...payload, department_id: department_id.id }))
        .subscribe((result) => {
          setTimeout(() => {
            this._messageService.clear();
            this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Posisi Berhasil Diubah' });
            this.resetForm(true);
          }, 3100);
        })
    }
  }

  private resetForm(closeModal?: boolean) {
    this.Form.reset();
    this._formBuilder.group({
      id: ['', []],
      code: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', []],
      department_id: ['', [Validators.required]]
    });
    this._formState = 'insert';
    if (closeModal) {
      this._modalToggler = false;
    }
  }
}
