import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { AttendanceAction, AttendanceState } from '../../../../store/human-resource/attendance';
import { EmployeeState } from '../../../../store/human-resource/employee';
import { ShiftState } from '../../../../store/human-resource/shift';
import { AttendanceService } from '../../../../services/pages/application/human-resource/attendance.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { autoDetectColumnMapping, parseFingerprintRow, validateAttendanceData } from '../../../../services/shared/fingerprint-mapper';
import Papa from 'papaparse';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DynamicTable,
    InputTextModule,
    DatePipe,
    TextareaModule,
    InputNumberModule,
    DatePickerModule,
    SelectModule,
    CheckboxModule,
    FileUploadModule,
    TabsModule,
    CardModule,
    DshBaseLayout
  ],
  templateUrl: './attendance.html',
  styleUrl: './attendance.scss'
})
export class Attendance implements OnInit, OnDestroy {

  _store = inject(Store);
  _formBuilder = inject(FormBuilder);
  _messageService = inject(MessageService);
  _confirmationService = inject(ConfirmationService);
  _attendanceService = inject(AttendanceService);

  Destroy$ = new Subject();

  // Page State
  _pageState = signal<'list' | 'self-checkin' | 'manual' | 'import'>('list');

  // Data
  _employeeDatasource: EmployeeModel.IEmployee[] = [];
  _shiftDatasource: EmployeeModel.IShift[] = [];

  // Self Check-in Form
  SelfCheckInForm = this._formBuilder.group({
    employee_code: ['', [Validators.required]],
    shift_id: ['', [Validators.required]],
  });

  // Manual Check-in Form
  ManualCheckInForm = this._formBuilder.group({
    employee_id: ['', [Validators.required]],
    date: [new Date().toISOString().split('T')[0], [Validators.required]],
    check_in: ['', [Validators.required]],
    check_out: ['', []],
    shift_id: ['', []],
    is_present: [true, []],
  });

  // Import State
  _importPreview: any[] = [];
  _importErrors: { row: any; error: string }[] = [];
  _fingerprintDateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' = 'DD/MM/YYYY';
  _uploading = false;

  // Table Props
  TableProps: DynamicTableModel.ITable = {
    id: 'attendance',
    title: 'Daftar Absensi',
    description: 'Data absensi lengkap karyawan',
    column: [
      {
        id: 'employees.employee_code',
        title: 'Kode Karyawan',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '150px'
      },
      {
        id: 'employees.full_name',
        title: 'Nama Karyawan',
        type: DynamicTableModel.IColumnType.TEXTWITHDESCRIPTION,
        width: '300px',
        description: 'employees.email'
      },
      {
        id: 'shift.title',
        title: 'Shift',
        type: DynamicTableModel.IColumnType.TEXTWITHDESCRIPTION,
        width: '200px',
        description: 'shift.time'
      },
      {
        id: 'date',
        title: 'Tanggal',
        type: DynamicTableModel.IColumnType.DATE,
        width: '150px'
      },
      {
        id: 'check_in',
        title: 'Jam Masuk',
        type: DynamicTableModel.IColumnType.TIME,
        width: '150px'
      },
      {
        id: 'check_out',
        title: 'Jam Keluar',
        type: DynamicTableModel.IColumnType.TIME,
        width: '150px'
      },
      {
        id: 'description',
        title: 'Terlambat',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '200px'
      },
    ],
    datasource: [],
    filter: [
      {
        id: 'employee.employee_code',
        title: 'Kode Karyawan',
        type: DynamicTableModel.IColumnType.TEXT,
        value: ''
      },
      {
        id: 'date',
        title: 'Tanggal',
        type: DynamicTableModel.IColumnType.DATE,
        value: ''
      },
    ],
    sort: [
      {
        id: 'date',
        title: 'Tanggal',
        value: ''
      },
    ],
    toolbar: [
      { id: 'detail', icon: 'pi pi-info', title: 'Detail' },
      { id: 'delete', icon: 'pi pi-trash', title: 'Hapus' },
    ],
    paging: true,
    custom_button: [
      { id: 'refresh', title: 'Refresh', icon: 'pi pi-refresh' }
    ]
  };

  ngOnInit(): void {
    this._store
      .select(EmployeeState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => this._employeeDatasource = result);

    this._store
      .select(ShiftState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => this._shiftDatasource = result);

    this._store
      .select(AttendanceState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe((result) => {
        this.TableProps.datasource = result.map((item: any) => {
          item.shift = {
            ...item.shift,
            time: `${formatDate(item.shift.start_time, 'HH:mm', 'EN')} s.d ${formatDate(item.shift.end_time, 'HH:mm', 'EN')}`
          };

          return item;
        });
      });
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

  // ===== SELF CHECK-IN =====
  handleSelfCheckIn(formValue: any) {
    if (this.SelfCheckInForm.valid) {
      const employee = this._employeeDatasource.find(
        e => e.employee_code?.toUpperCase() === formValue.employee_code.toUpperCase()
      );

      if (!employee) {
        this._messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Kode karyawan tidak ditemukan'
        });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });

      // Check if already checked in today
      this._attendanceService
        .findTodayAttendance(employee.id, today)
        .pipe(takeUntil(this.Destroy$))
        .subscribe({
          next: (existing: any) => {
            if (existing && !existing.check_out) {
              // Check out
              this._store
                .dispatch(new AttendanceAction.UpdateAttendance({
                  ...existing,
                  check_out: new Date().toISOString()
                }))
                .subscribe(() => {
                  this._messageService.add({
                    severity: 'success',
                    summary: 'Berhasil!',
                    detail: `${employee.full_name} Check Out pada ${currentTime}`
                  });
                  this.SelfCheckInForm.reset();
                });
            } else {
              // Check in
              const payload = {
                employee_id: employee.id,
                shift_id: formValue.shift_id ?? '',
                date: today,
                check_in: new Date().toISOString(),
                check_out: null as any,
                is_present: true,
                is_delete: false,
                created_at: new Date(),
                description: 'SELF'
              };

              this._store
                .dispatch(new AttendanceAction.AddAttendance(payload))
                .subscribe(() => {
                  this._messageService.add({
                    severity: 'success',
                    summary: 'Berhasil!',
                    detail: `${employee.full_name} Check In pada ${currentTime}`
                  });
                  this.SelfCheckInForm.reset();
                });
            }
          },
          error: () => {
            // First check in
            this._store
              .dispatch(new AttendanceAction.AddAttendance({
                employee_id: employee.id,
                shift_id: formValue.shift_id ? formValue.shift_id : '',
                date: today,
                check_in: new Date().toISOString(),
                check_out: null as any,
                is_present: true,
                is_delete: false,
                created_at: new Date(),
                description: 'SELF'
              }))
              .subscribe(() => {
                this._messageService.add({
                  severity: 'success',
                  summary: 'Berhasil!',
                  detail: `${employee.full_name} Check In pada ${currentTime}`
                });
                this.SelfCheckInForm.reset();
              });
          }
        });
    }
  }

  // ===== MANUAL CHECK-IN =====
  handleManualCheckIn(formValue: any) {
    if (this.ManualCheckInForm.valid) {
      const attendance: EmployeeModel.IAttendance = {
        employee_id: formValue.employee_id,
        shift_id: formValue.shift_id,
        date: formValue.date,
        check_in: formValue.check_in,
        check_out: formValue.check_out,
        is_present: formValue.is_present,
        is_delete: false,
        created_at: new Date(),
        description: 'MANUAL'
      };

      this._store
        .dispatch(new AttendanceAction.AddAttendance(attendance))
        .subscribe(() => {
          this._messageService.add({
            severity: 'success',
            summary: 'Berhasil!',
            detail: 'Data absensi berhasil ditambahkan'
          });
          this.ManualCheckInForm.reset();
          this._pageState.set('list');
        });
    }
  }

  // ===== FINGERPRINT IMPORT =====
  handleFingerprintFileSelect(event: any) {
    const file = event.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results: any) => {
        if (results.data.length === 0) {
          this._messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'File kosong atau format tidak valid'
          });
          return;
        }

        const headers = results.data[0] as string[];
        const dataRows = results.data.slice(1);

        // Auto-detect column mapping
        const mapping = autoDetectColumnMapping(headers);

        if (!mapping.employee_code && !mapping.employee_id) {
          this._messageService.add({
            severity: 'warn',
            summary: 'Perhatian!',
            detail: 'Tidak dapat mendeteksi kolom karyawan. Silakan mapping manual.'
          });
        }

        // Parse rows
        this._importPreview = dataRows
          .map((row: string[], index: number) => {
            try {
              return {
                rowIndex: index + 2, // +1 for header, +1 for 1-based
                ...parseFingerprintRow(row, mapping, headers, this._fingerprintDateFormat)
              };
            } catch (e) {
              return null;
            }
          })
          .filter((r: any) => r !== null);

        // Validate
        const { valid, invalid } = validateAttendanceData(this._importPreview);
        this._importErrors = invalid;
        this._importPreview = valid;

        if (this._importErrors.length > 0) {
          this._messageService.add({
            severity: 'warn',
            summary: `${this._importErrors.length} baris error`,
            detail: 'Silakan periksa data yang bermasalah'
          });
        }
      },
      error: () => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Gagal membaca file CSV'
        });
      }
    });
  }

  handleConfirmImport() {
    if (this._importPreview.length === 0) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Perhatian!',
        detail: 'Tidak ada data valid untuk diimport'
      });
      return;
    }

    this._uploading = true;
    const attendances: any[] = this._importPreview.map(item => ({
      ...item,
      is_delete: false,
      created_at: new Date(),
    }));

    this._store
      .dispatch(new AttendanceAction.BulkAddAttendance(attendances))
      .subscribe({
        next: () => {
          this._uploading = false;
          this._messageService.add({
            severity: 'success',
            summary: 'Berhasil!',
            detail: `${attendances.length} data absensi berhasil diimport`
          });
          this._importPreview = [];
          this._importErrors = [];
          this._pageState.set('list');
        },
        error: () => {
          this._uploading = false;
          this._messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'Gagal mengimport data'
          });
        }
      });
  }

  handleBackToList() {
    this._pageState.set('list');
    this._importPreview = [];
    this._importErrors = [];
  }

  handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
    if (args.id === 'refresh') {
      this._store.dispatch(new AttendanceAction.GetAttendance());
    }
  }

  handleFilter(args: any) {
    const filter = args || {};
    this._store.dispatch(new AttendanceAction.GetAttendance(filter, {}));
  }

  handleSort(args: any) {
    const sort = args || {};
    this._store.dispatch(new AttendanceAction.GetAttendance({}, sort));
  }

  handleToolbarClicked(args: any) {
    if (args.toolbar.id === 'delete') {
      this._confirmationService.confirm({
        message: 'Apakah anda yakin menghapus data absensi ini?',
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
            .dispatch(new AttendanceAction.DeleteAttendance(args.data.id))
            .subscribe(() => {
              setTimeout(() => {
                this._messageService.clear();
                this._messageService.add({
                  severity: 'success',
                  summary: 'Berhasil!',
                  detail: 'Data Absensi Berhasil Dihapus'
                });
              }, 3100);
            });
        },
      });
    }
  }
}