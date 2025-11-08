import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { OvertimeAction, OvertimeState } from '../../../../store/human-resource/overtime';
import { EmployeeState } from '../../../../store/human-resource/employee';
import { OvertimeService } from '../../../../services/pages/application/human-resource/overtime.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-overtime',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        DynamicTable,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        DatePickerModule,
        SelectModule,
        CheckboxModule,
        CardModule,
        DshBaseLayout
    ],
    templateUrl: './overtime.html',
    styleUrl: './overtime.scss'
})
export class Overtime implements OnInit, OnDestroy {

    _store = inject(Store);
    _formBuilder = inject(FormBuilder);
    _messageService = inject(MessageService);
    _confirmationService = inject(ConfirmationService);
    _overtimeService = inject(OvertimeService);

    Destroy$ = new Subject();

    // Page State
    _pageState = signal<'list' | 'create' | 'edit'>('list');
    _selectedItem = signal<EmployeeModel.IOvertime | null>(null);

    // Data
    _employeeDatasource: EmployeeModel.IEmployee[] = [];

    // Form
    OvertimeForm = this._formBuilder.group({
        employee_id: ['', [Validators.required]],
        date: ['', [Validators.required]],
        start_time: ['', [Validators.required]],
        end_time: ['', [Validators.required]],
        total_hours: ['', [Validators.required]],
        overtime_type: ['weekday', [Validators.required]],
        status: ['pending', []],
        reason: ['', []],
    });

    // Table Props
    TableProps: DynamicTableModel.ITable = {
        id: 'overtime',
        title: 'Daftar Lembur',
        description: 'Data pengajuan lembur karyawan',
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
                id: 'date',
                title: 'Tanggal',
                type: DynamicTableModel.IColumnType.DATE,
                width: '150px'
            },
            {
                id: 'start_time',
                title: 'Jam Mulai',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '120px'
            },
            {
                id: 'end_time',
                title: 'Jam Akhir',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '120px'
            },
            {
                id: 'total_hours',
                title: 'Total Jam',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '100px'
            },
            {
                id: 'overtime_type',
                title: 'Tipe Lembur',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '150px'
            },
            {
                id: 'status',
                title: 'Status',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '150px'
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
                id: 'status',
                title: 'Status',
                type: DynamicTableModel.IColumnType.TEXT,
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
            { id: 'edit', icon: 'pi pi-pencil', title: 'Edit' },
            { id: 'approve', icon: 'pi pi-check', title: 'Approve' },
            { id: 'reject', icon: 'pi pi-times', title: 'Reject' },
            { id: 'delete', icon: 'pi pi-trash', title: 'Hapus' },
        ],
        paging: true,
        custom_button: [
            { id: 'add', title: 'Tambah', icon: 'pi pi-plus' },
            { id: 'refresh', title: 'Refresh', icon: 'pi pi-refresh' }
        ]
    };

    ngOnInit(): void {
        this._store
            .select(EmployeeState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this._employeeDatasource = result);

        this._store
            .select(OvertimeState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.TableProps.datasource = result;
            });

        // Setup auto-calculate total_hours
        combineLatest([
            this.OvertimeForm.get('start_time')!.valueChanges,
            this.OvertimeForm.get('end_time')!.valueChanges
        ])
            .pipe(takeUntil(this.Destroy$))
            .subscribe(([startTime, endTime]) => {
                if (startTime && endTime) {
                    const totalHours = this.calculateTotalHours(startTime, endTime);
                    this.OvertimeForm.get('total_hours')?.setValue(totalHours.toString(), { emitEvent: false });
                }
            });
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleAddOvertime(formValue: any) {
        if (this.OvertimeForm.valid) {
            const totalHours = this.calculateTotalHours(formValue.start_time, formValue.end_time);
            const date = typeof formValue.date === 'string' ? formValue.date : new Date(formValue.date).toISOString().split('T')[0];

            const overtime: EmployeeModel.IOvertime = {
                employee_id: formValue.employee_id,
                date: date,
                start_time: formValue.start_time,
                end_time: formValue.end_time,
                total_hours: totalHours,
                overtime_type: formValue.overtime_type,
                status: 'pending',
                reason: formValue.reason,
                is_delete: false,
                created_at: new Date(),
            };

            this._store
                .dispatch(new OvertimeAction.AddOvertime(overtime))
                .subscribe(() => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Berhasil!',
                        detail: 'Data lembur berhasil ditambahkan'
                    });
                    this.OvertimeForm.reset({ status: 'pending', overtime_type: 'weekday' });
                    this._pageState.set('list');
                });
        }
    }

    handleEditOvertime(formValue: any) {
        if (this.OvertimeForm.valid && this._selectedItem()) {
            const totalHours = this.calculateTotalHours(formValue.start_time, formValue.end_time);
            const date = typeof formValue.date === 'string' ? formValue.date : new Date(formValue.date).toISOString().split('T')[0];

            const overtime: EmployeeModel.IOvertime = {
                ...this._selectedItem()!,
                employee_id: formValue.employee_id,
                date: date,
                start_time: formValue.start_time,
                end_time: formValue.end_time,
                total_hours: totalHours,
                overtime_type: formValue.overtime_type,
                reason: formValue.reason,
            };

            this._store
                .dispatch(new OvertimeAction.UpdateOvertime(overtime))
                .subscribe(() => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Berhasil!',
                        detail: 'Data lembur berhasil diperbarui'
                    });
                    this.OvertimeForm.reset({ status: 'pending', overtime_type: 'weekday' });
                    this._pageState.set('list');
                    this._selectedItem.set(null);
                });
        }
    }

    handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
        if (args.id === 'add') {
            this._pageState.set('create');
            this.OvertimeForm.reset({ status: 'pending', overtime_type: 'weekday' });
        } else if (args.id === 'refresh') {
            this._store.dispatch(new OvertimeAction.GetOvertime());
        }
    }

    handleToolbarClicked(args: any) {
        const data = args.data as EmployeeModel.IOvertime;

        if (args.toolbar.id === 'edit') {
            this._pageState.set('edit');
            this._selectedItem.set(data);
            this.OvertimeForm.patchValue({
                employee_id: data.employee_id,
                date: data.date,
                start_time: data.start_time,
                end_time: data.end_time,
                total_hours: data.total_hours?.toString() || '',
                overtime_type: data.overtime_type,
                status: data.status,
                reason: data.reason,
            });
        } else if (args.toolbar.id === 'approve') {
            this._confirmationService.confirm({
                message: 'Apakah anda yakin menyetujui pengajuan lembur ini?',
                header: 'Konfirmasi',
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancel',
                rejectButtonProps: {
                    label: 'Cancel',
                    severity: 'secondary',
                    outlined: true,
                },
                acceptButtonProps: {
                    label: 'Setujui',
                    severity: 'success',
                },
                accept: () => {
                    this._store
                        .dispatch(new OvertimeAction.UpdateOvertimeStatus(data.id, 'approved'))
                        .subscribe(() => {
                            setTimeout(() => {
                                this._messageService.clear();
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Berhasil!',
                                    detail: 'Pengajuan lembur berhasil disetujui'
                                });
                            }, 3100);
                        });
                },
            });
        } else if (args.toolbar.id === 'reject') {
            this._confirmationService.confirm({
                message: 'Apakah anda yakin menolak pengajuan lembur ini?',
                header: 'Konfirmasi',
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancel',
                rejectButtonProps: {
                    label: 'Cancel',
                    severity: 'secondary',
                    outlined: true,
                },
                acceptButtonProps: {
                    label: 'Tolak',
                    severity: 'danger',
                },
                accept: () => {
                    this._store
                        .dispatch(new OvertimeAction.UpdateOvertimeStatus(data.id, 'rejected'))
                        .subscribe(() => {
                            setTimeout(() => {
                                this._messageService.clear();
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Berhasil!',
                                    detail: 'Pengajuan lembur berhasil ditolak'
                                });
                            }, 3100);
                        });
                },
            });
        } else if (args.toolbar.id === 'delete') {
            this._confirmationService.confirm({
                message: 'Apakah anda yakin menghapus data lembur ini?',
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
                        .dispatch(new OvertimeAction.DeleteOvertime(data.id))
                        .subscribe(() => {
                            setTimeout(() => {
                                this._messageService.clear();
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Berhasil!',
                                    detail: 'Data Lembur Berhasil Dihapus'
                                });
                            }, 3100);
                        });
                },
            });
        }
    }

    private calculateTotalHours(startTime: string, endTime: string): number {
        const start = new Date(`2000-01-01 ${startTime}`);
        const end = new Date(`2000-01-01 ${endTime}`);
        const diffMs = end.getTime() - start.getTime();
        return Math.round(diffMs / (1000 * 60 * 60) * 100) / 100;
    }

    handleBackToList() {
        this._pageState.set('list');
        this.OvertimeForm.reset({ status: 'pending', overtime_type: 'weekday' });
        this._selectedItem.set(null);
    }
}

