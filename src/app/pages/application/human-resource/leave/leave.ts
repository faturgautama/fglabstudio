import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { LeaveAction, LeaveState } from '../../../../store/human-resource/leave';
import { EmployeeState } from '../../../../store/human-resource/employee';
import { LeaveService } from '../../../../services/pages/application/human-resource/leave.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { CompanySettingState } from '../../../../store/human-resource/company-setting';

@Component({
    selector: 'app-leave',
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
    templateUrl: './leave.html',
    styleUrl: './leave.scss'
})
export class Leave implements OnInit, OnDestroy {

    _store = inject(Store);
    _formBuilder = inject(FormBuilder);
    _messageService = inject(MessageService);
    _confirmationService = inject(ConfirmationService);
    _leaveService = inject(LeaveService);

    Destroy$ = new Subject();

    // Page State
    _pageState = signal<'list' | 'create' | 'edit'>('list');
    _selectedItem = signal<EmployeeModel.ILeave | null>(null);

    // Data
    _employeeDatasource: EmployeeModel.IEmployee[] = [];

    _leavePolicyDatasource: any[] = []; // Extended with remaining_days info
    _originalLeavePolicies: EmployeeModel.ILeavePolicy[] = []; // Backup original policies
    _selectedEmployee: EmployeeModel.IEmployee | null = null; // Store selected employee

    // Form
    LeaveForm = this._formBuilder.group({
        employee_id: ['', [Validators.required]],
        leave_policy_id: ['', [Validators.required]],
        start_date: ['', [Validators.required]],
        end_date: ['', [Validators.required]],
        total_days: ['', [Validators.required]],
        reason: ['', []],
        status: ['pending', []],
        remarks: ['', []],
    });

    // Table Props
    TableProps: DynamicTableModel.ITable = {
        id: 'leave',
        title: 'Daftar Cuti',
        description: 'Data pengajuan cuti karyawan',
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
                id: 'start_date',
                title: 'Tanggal Mulai',
                type: DynamicTableModel.IColumnType.DATE,
                width: '200px'
            },
            {
                id: 'end_date',
                title: 'Tanggal Akhir',
                type: DynamicTableModel.IColumnType.DATE,
                width: '200px'
            },
            {
                id: 'total_days',
                title: 'Total Hari',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '120px'
            },
            {
                id: 'status',
                title: 'Status',
                type: DynamicTableModel.IColumnType.BADGE,
                width: '150px'
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
                id: 'start_date',
                title: 'Tanggal Mulai',
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
            .select(CompanySettingState.getLeavePolicies)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result: any) => {
                this._originalLeavePolicies = result;
                this._leavePolicyDatasource = result;
            });

        this._store
            .select(LeaveState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.TableProps.datasource = result;
            });

        // Listen to employee_id changes to update leave policy datasource with remaining days
        this.LeaveForm.get('employee_id')?.valueChanges
            .pipe(takeUntil(this.Destroy$))
            .subscribe((employeeId) => {
                // Reset leave policy selection when employee changes
                this.LeaveForm.patchValue({ leave_policy_id: '' }, { emitEvent: false });

                if (employeeId) {
                    // Find selected employee
                    this._selectedEmployee = this._employeeDatasource.find(e => e.id === employeeId) || null;
                    this.updateLeavePoliciesWithRemainingDays(employeeId);
                } else {
                    // Reset to original policies if no employee selected
                    this._leavePolicyDatasource = this._originalLeavePolicies;
                    this._selectedEmployee = null;
                }
            });

        // Listen to leave_policy_id changes to auto-fill status based on requires_approval
        this.LeaveForm.get('leave_policy_id')?.valueChanges
            .pipe(takeUntil(this.Destroy$))
            .subscribe((policyId) => {
                if (policyId) {
                    const selectedPolicy = this._leavePolicyDatasource.find((p: any) => p.id === policyId);
                    if (selectedPolicy) {
                        // Jika requires_approval false, auto-set status ke 'approved'
                        const newStatus = selectedPolicy.requires_approval === false ? 'approved' : 'pending';
                        this.LeaveForm.patchValue({ status: newStatus }, { emitEvent: false });
                    }
                }
            });

        // Listen to start_date or end_date changes to auto-calculate total_days
        const startDateControl = this.LeaveForm.get('start_date');
        const endDateControl = this.LeaveForm.get('end_date');

        startDateControl?.valueChanges
            .pipe(takeUntil(this.Destroy$))
            .subscribe(() => this.updateTotalDays());

        endDateControl?.valueChanges
            .pipe(takeUntil(this.Destroy$))
            .subscribe(() => this.updateTotalDays());
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleAddLeave(formValue: any) {
        if (this.LeaveForm.valid) {
            const startDate = new Date(formValue.start_date);
            const endDate = new Date(formValue.end_date);
            const totalDays = this.calculateTotalDays(startDate, endDate);

            const leave: EmployeeModel.ILeave = {
                employee_id: formValue.employee_id,
                leave_policy_id: formValue.leave_policy_id,
                start_date: startDate,
                end_date: endDate,
                total_days: totalDays,
                reason: formValue.reason,
                status: 'pending',
                remarks: formValue.remarks,
                is_delete: false,
                created_at: new Date(),
            };

            this._store
                .dispatch(new LeaveAction.AddLeave(leave))
                .subscribe(() => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Berhasil!',
                        detail: 'Data cuti berhasil ditambahkan'
                    });
                    this.LeaveForm.reset({ status: 'pending' });
                    this._pageState.set('list');
                });
        }
    }

    handleEditLeave(formValue: any) {
        if (this.LeaveForm.valid && this._selectedItem()) {
            const startDate = new Date(formValue.start_date);
            const endDate = new Date(formValue.end_date);
            const totalDays = this.calculateTotalDays(startDate, endDate);

            const leave: EmployeeModel.ILeave = {
                ...this._selectedItem()!,
                employee_id: formValue.employee_id,
                leave_policy_id: formValue.leave_policy_id,
                start_date: startDate,
                end_date: endDate,
                total_days: totalDays,
                reason: formValue.reason,
                remarks: formValue.remarks,
            };

            this._store
                .dispatch(new LeaveAction.UpdateLeave(leave))
                .subscribe(() => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Berhasil!',
                        detail: 'Data cuti berhasil diperbarui'
                    });
                    this.LeaveForm.reset({ status: 'pending' });
                    this._pageState.set('list');
                    this._selectedItem.set(null);
                });
        }
    }

    handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
        if (args.id === 'add') {
            this._pageState.set('create');
            this.LeaveForm.reset({ status: 'pending' });
        } else if (args.id === 'refresh') {
            this._store.dispatch(new LeaveAction.GetLeave());
        }
    }

    handleFilter(args: any) {
        const filter = args || {};
        this._store.dispatch(new LeaveAction.GetLeave(filter, {}));
    }

    handleSort(args: any) {
        const sort = args || {};
        this._store.dispatch(new LeaveAction.GetLeave({}, sort));
    }

    handleToolbarClicked(args: any) {
        const data = args.data as EmployeeModel.ILeave;

        if (args.toolbar.id === 'edit') {
            this._pageState.set('edit');
            this._selectedItem.set(data);
            this.LeaveForm.patchValue({
                employee_id: data.employee_id,
                leave_policy_id: data.leave_policy_id,
                start_date: data.start_date instanceof Date ? data.start_date : new Date(data.start_date as any) as any,
                end_date: data.end_date instanceof Date ? data.end_date : new Date(data.end_date as any) as any,
                total_days: data.total_days?.toString() || '',
                reason: data.reason,
                status: data.status,
                remarks: data.remarks,
            });
        } else if (args.toolbar.id === 'approve') {
            this._confirmationService.confirm({
                message: 'Apakah anda yakin menyetujui pengajuan cuti ini?',
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
                        .dispatch(new LeaveAction.UpdateLeaveStatus(data.id, 'approved'))
                        .subscribe(() => {
                            setTimeout(() => {
                                this._messageService.clear();
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Berhasil!',
                                    detail: 'Pengajuan cuti berhasil disetujui'
                                });
                            }, 3100);
                        });
                },
            });
        } else if (args.toolbar.id === 'reject') {
            this._confirmationService.confirm({
                message: 'Apakah anda yakin menolak pengajuan cuti ini?',
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
                        .dispatch(new LeaveAction.UpdateLeaveStatus(data.id, 'rejected'))
                        .subscribe(() => {
                            setTimeout(() => {
                                this._messageService.clear();
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Berhasil!',
                                    detail: 'Pengajuan cuti berhasil ditolak'
                                });
                            }, 3100);
                        });
                },
            });
        } else if (args.toolbar.id === 'delete') {
            this._confirmationService.confirm({
                message: 'Apakah anda yakin menghapus data cuti ini?',
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
                        .dispatch(new LeaveAction.DeleteLeave(data.id))
                        .subscribe(() => {
                            setTimeout(() => {
                                this._messageService.clear();
                                this._messageService.add({
                                    severity: 'success',
                                    summary: 'Berhasil!',
                                    detail: 'Data Cuti Berhasil Dihapus'
                                });
                            }, 3100);
                        });
                },
            });
        }
    }

    private calculateTotalDays(startDate: Date, endDate: Date): number {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    /**
     * Update total_days automatically ketika start_date atau end_date berubah
     */
    private updateTotalDays(): void {
        const startDate = this.LeaveForm.get('start_date')?.value;
        const endDate = this.LeaveForm.get('end_date')?.value;

        // Jika kedua tanggal sudah diisi, hitung total hari
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const totalDays = this.calculateTotalDays(start, end);
            this.LeaveForm.patchValue({ total_days: totalDays.toString() }, { emitEvent: false });
        }
    }

    /**
     * Check if status field should be disabled
     * Status di-disable jika selected leave policy requires_approval adalah false
     */
    isStatusDisabled(): boolean {
        const policyId = this.LeaveForm.get('leave_policy_id')?.value;
        if (!policyId) return false;

        const selectedPolicy = this._leavePolicyDatasource.find((p: any) => p.id === policyId);
        return selectedPolicy && selectedPolicy.requires_approval === false;
    }

    /**
     * Update leave policy datasource dengan info sisa cuti untuk employee yg dipilih
     * Filter berdasarkan gender_restriction employee
     * Trigger saat employee_id berubah
     */
    private updateLeavePoliciesWithRemainingDays(employeeId: string): void {
        this._leaveService.getRemainingLeavesByEmployeeAndPolicy(
            employeeId,
            this._selectedEmployee,
            this._originalLeavePolicies
        ).subscribe({
            next: (policiesWithRemaining: any[]) => {
                this._leavePolicyDatasource = policiesWithRemaining;

                // Reset leave_policy_id jika current value tidak ada di new datasource
                const currentPolicyId = this.LeaveForm.get('leave_policy_id')?.value;
                const isValidPolicy = policiesWithRemaining.some((p: any) => p.id === currentPolicyId);
                if (currentPolicyId && !isValidPolicy) {
                    this.LeaveForm.patchValue({ leave_policy_id: '' }, { emitEvent: false });
                }
            },
            error: (err) => {
                // Fallback to original policies
                this._leavePolicyDatasource = this._originalLeavePolicies;
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Gagal mengambil data sisa cuti'
                });
            }
        });
    }

    handleBackToList() {
        this._pageState.set('list');
        this.LeaveForm.reset({ status: 'pending' });
        this._selectedItem.set(null);
    }
}

