import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { EmployeeAction, EmployeeState } from '../../../../store/human-resource/employee';
import { DepartementState } from '../../../../store/human-resource/departement';
import { PositionState } from '../../../../store/human-resource/position';
import { ShiftService } from '../../../../services/pages/application/human-resource/shift.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DynamicTable,
    DialogModule,
    SelectModule,
    DshBaseLayout,
    TextareaModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    CheckboxModule,
  ],
  templateUrl: './employee.html',
  styleUrl: './employee.scss'
})
export class Employee implements OnInit, OnDestroy {

  _store = inject(Store);
  _formBuilder = inject(FormBuilder);
  _messageService = inject(MessageService);
  _confirmationService = inject(ConfirmationService);
  _shiftService = inject(ShiftService);

  Destroy$ = new Subject();

  // Page State
  _pageState = signal<'list' | 'form'>('list');
  _formState: 'insert' | 'update' = 'insert';

  // Dropdowns
  _departmentDatasource: EmployeeModel.IDepartment[] = [];
  _positionDatasource: EmployeeModel.IPosition[] = [];
  _shiftDatasource: EmployeeModel.IShift[] = [];

  // Form
  Form = this._formBuilder.group({
    id: ['', []],
    employee_code: ['', [Validators.required]],
    full_name: ['', [Validators.required]],
    nickname: ['', []],
    gender: ['', [Validators.required]],
    email: ['', [Validators.email]],
    phone_number: ['', []],
    address: ['', []],
    city: ['', []],
    province: ['', []],
    postal_code: ['', []],
    birth_date: ['', []],
    blood_type: ['', []],
    marital_status: ['', []],
    number_of_dependents: ['', []],
    id_card_number: ['', []],
    id_card_expiry: ['', []],
    passport_number: ['', []],
    passport_expiry: ['', []],
    department_id: ['', []],
    position_id: ['', []],
    shift_id: ['', []],
    employee_type: ['', []],
    employment_status: ['', []],
    work_status: ['', []],
    join_date: ['', []],
    resign_date: ['', []],
    probation_end_date: ['', []],
    salary: ['', []],
    salary_currency: ['IDR', []],
    bank_account_number: ['', []],
    bank_account_name: ['', []],
    bank_name: ['', []],
    tax_id: ['', []],
    is_remote: [false, []],
    office_location: ['', []],
    workstation_number: ['', []],
    skills: ['', []],
    notes: ['', []],
    is_active: [true, []],
  });

  // Table Props
  TableProps: DynamicTableModel.ITable = {
    id: 'employee',
    title: 'Daftar Karyawan',
    description: 'Daftar lengkap seluruh karyawan perusahaan',
    column: [
      {
        id: 'employee_code',
        title: 'Kode Karyawan',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '200px'
      },
      {
        id: 'full_name',
        title: 'Nama Lengkap',
        type: DynamicTableModel.IColumnType.TEXTWITHDESCRIPTION,
        description: 'email'
      },
      {
        id: 'phone_number',
        title: 'Nomor Telepon',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '180px'
      },
      {
        id: 'position.title',
        title: 'Posisi',
        type: DynamicTableModel.IColumnType.TEXT,
      },
      {
        id: 'department.title',
        title: 'Departemen',
        type: DynamicTableModel.IColumnType.BUTTON_ICON,
        button_icon: {
          title: 'department.title',
          icon_class: 'pi pi-circle-fill',
          icon_color: 'department.color',
          use_parsing_func: false,
        },
        width: '180px'
      },
      {
        id: 'employment_status',
        title: 'Status Kepegawaian',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '250px'
      },
      {
        id: 'created_at',
        title: 'Waktu Entry',
        type: DynamicTableModel.IColumnType.DATETIME,
        width: '200px'
      },
    ],
    datasource: [],
    filter: [
      {
        id: 'full_name',
        title: 'Nama Lengkap',
        type: DynamicTableModel.IColumnType.TEXT,
        value: ''
      },
      {
        id: 'employee_code',
        title: 'Kode Karyawan',
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
      {
        id: 'work_status',
        title: 'Status Kerja',
        type: DynamicTableModel.IColumnType.DROPDOWN,
        value: '',
        select_props: {
          datasource: [
            { id: 'active', title: 'Active' },
            { id: 'resigned', title: 'Resigned' },
            { id: 'suspended', title: 'Suspended' },
            { id: 'on-leave', title: 'On Leave' }
          ],
          name: 'title',
          value: 'id'
        }
      },
    ],
    sort: [
      {
        id: 'full_name',
        title: 'Nama Lengkap',
        value: ''
      },
      {
        id: 'employee_code',
        title: 'Kode Karyawan',
        value: ''
      },
    ],
    toolbar: [
      { id: 'detail', icon: 'pi pi-info', title: 'Detail' },
      { id: 'delete', icon: 'pi pi-trash', title: 'Hapus' },
    ],
    paging: true,
    custom_button: [
      { id: 'add', title: 'Tambah', icon: 'pi pi-plus' }
    ]
  };

  ngOnInit(): void {
    this._store
      .select(DepartementState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => {
        this._departmentDatasource = result;
        if (this.TableProps.filter) {
          this.TableProps.filter[2].select_props!.datasource = result;
        }
      });

    this._store
      .select(PositionState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => {
        this._positionDatasource = result;
      });

    this._shiftService.getAll()
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => {
        this._shiftDatasource = result;
      });

    this._store
      .select(EmployeeState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => this.TableProps.datasource = result.map((item: any) => { return { ...item, employment_status: (<String>item.employment_status).toUpperCase() } }));
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

  handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
    if (args.id == 'add') {
      this._formState = 'insert';
      this.Form.reset({ salary_currency: 'IDR', is_active: true });
      this._pageState.set('form');
    }
  }

  handleFilter(args: any) {
    const filter = args || {};
    this._store.dispatch(new EmployeeAction.GetEmployee(filter, {}));
  }

  handleSort(args: any) {
    const sort = args || {};
    this._store.dispatch(new EmployeeAction.GetEmployee({}, sort));
  }

  handleToolbarClicked(args: any) {
    if (args.toolbar.id == 'detail') {
      this._formState = 'update';
      this._pageState.set('form');

      setTimeout(() => {
        const dept = this._departmentDatasource.find(d => d.id === args.data.department_id);
        const pos = this._positionDatasource.find(p => p.id === args.data.position_id);
        const shift = this._shiftDatasource.find(s => s.id === args.data.shift_id);

        this.Form.patchValue({
          ...args.data,
          department_id: dept || args.data.department_id,
          position_id: pos || args.data.position_id,
          shift_id: shift || args.data.shift_id,
        });
      }, 0);
    }

    if (args.toolbar.id == 'delete') {
      this._confirmationService.confirm({
        message: 'Apakah anda yakin menghapus data karyawan ini?',
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
            .dispatch(new EmployeeAction.DeleteEmployee(args.data.id))
            .subscribe(() => {
              setTimeout(() => {
                this._messageService.clear();
                this._messageService.add({
                  severity: 'success',
                  summary: 'Berhasil!',
                  detail: 'Data Karyawan Berhasil Dihapus'
                });
              }, 3100);
            });
        },
      });
    }
  }

  handleSave(formValue: any) {
    if (this.Form.valid) {
      const payload = {
        ...formValue,
        department_id: formValue.department_id?.id || formValue.department_id,
        position_id: formValue.position_id?.id || formValue.position_id,
        shift_id: formValue.shift_id?.id || formValue.shift_id,
      };

      this._store
        .dispatch(new EmployeeAction.AddEmployee(payload))
        .subscribe(() => {
          setTimeout(() => {
            this._messageService.clear();
            this._messageService.add({
              severity: 'success',
              summary: 'Berhasil!',
              detail: 'Data Karyawan Berhasil Disimpan'
            });
            this.handleBackToList();
          }, 3100);
        });
    }
  }

  handleUpdate(formValue: any) {
    if (this.Form.valid) {
      const payload = {
        ...formValue,
        department_id: formValue.department_id?.id || formValue.department_id,
        position_id: formValue.position_id?.id || formValue.position_id,
        shift_id: formValue.shift_id?.id || formValue.shift_id,
      };

      this._store
        .dispatch(new EmployeeAction.UpdateEmployee(payload))
        .subscribe(() => {
          setTimeout(() => {
            this._messageService.clear();
            this._messageService.add({
              severity: 'success',
              summary: 'Berhasil!',
              detail: 'Data Karyawan Berhasil Diubah'
            });
            this.handleBackToList();
          }, 3100);
        });
    }
  }

  handleBackToList() {
    this.Form.reset({ salary_currency: 'IDR', is_active: true });
    this._pageState.set('list');
  }
}