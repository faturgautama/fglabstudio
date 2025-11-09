import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { PayrollAction, PayrollState } from '../../../../store/human-resource/payroll';
import { EmployeeState } from '../../../../store/human-resource/employee';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PayrollCalculationService, PayrollBreakdown } from '../../../../services/pages/application/human-resource/payroll-calculation.service';

@Component({
    selector: 'app-payroll',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        DynamicTable,
        DialogModule,
        SelectModule,
        InputTextModule,
        DatePickerModule,
        InputNumberModule,
        TabsModule,
        CardModule,
        DividerModule,
        DshBaseLayout,
        DatePipe
    ],
    templateUrl: './payroll.html',
    styleUrl: './payroll.scss'
})
export class Payroll implements OnInit, OnDestroy {

    _store = inject(Store);
    _formBuilder = inject(FormBuilder);
    _messageService = inject(MessageService);
    _confirmationService = inject(ConfirmationService);
    _calculationService = inject(PayrollCalculationService);

    Destroy$ = new Subject();

    _pageState = signal<'list' | 'detail' | 'generate'>('list');
    _selectedPayroll = signal<EmployeeModel.IPayroll | null>(null);
    _payrollBreakdown = signal<PayrollBreakdown | null>(null);
    _isGenerating = signal(false);
    _currentMonth = signal(this.getCurrentMonth());
    _employeeDatasource: EmployeeModel.IEmployee[] = [];

    // Table Props
    TableProps: DynamicTableModel.ITable = {
        id: 'payroll',
        title: 'Daftar Payroll',
        description: 'Data payroll karyawan',
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
                id: 'month',
                title: 'Bulan',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '120px'
            },
            {
                id: 'base_salary',
                title: 'Gaji Pokok',
                type: DynamicTableModel.IColumnType.CURRENCY,
                width: '150px'
            },
            {
                id: 'overtime_pay',
                title: 'Lembur',
                type: DynamicTableModel.IColumnType.CURRENCY,
                width: '150px'
            },
            {
                id: 'deduction',
                title: 'Potongan',
                type: DynamicTableModel.IColumnType.CURRENCY,
                width: '150px'
            },
            {
                id: 'net_salary',
                title: 'Gaji Bersih',
                type: DynamicTableModel.IColumnType.CURRENCY,
                width: '150px'
            },
            {
                id: 'payment_status',
                title: 'Status',
                type: DynamicTableModel.IColumnType.BADGE,
                width: '120px'
            }
        ],
        datasource: [],
        filter: [
            {
                id: 'employees.employee_code',
                title: 'Kode Karyawan',
                type: DynamicTableModel.IColumnType.TEXT
            },
            {
                id: 'month',
                title: 'Bulan',
                type: DynamicTableModel.IColumnType.TEXT
            },
            {
                id: 'payment_status',
                title: 'Status Pembayaran',
                type: DynamicTableModel.IColumnType.DROPDOWN,
                select_props: {
                    datasource: [
                        { id: 'pending', title: 'Pending' },
                        { id: 'paid', title: 'Paid' }
                    ],
                    name: 'title',
                    value: 'id'
                }
            }
        ],
        sort: [
            { id: 'month', title: 'Bulan' },
            { id: 'net_salary', title: 'Gaji Bersih' }
        ],
        toolbar: [
            { id: 'detail', icon: 'pi pi-info', title: 'Detail' },
            { id: 'paid', icon: 'pi pi-check', title: 'Tandai Dibayar' },
            { id: 'delete', icon: 'pi pi-trash', title: 'Hapus' }
        ],
        paging: true,
        custom_button: [
            { id: 'generate', title: 'Generate Payroll', icon: 'pi pi-plus' },
            { id: 'refresh', title: 'Refresh', icon: 'pi pi-refresh' }
        ]
    };

    GenerateForm = this._formBuilder.group({
        month: [this.getCurrentMonth(), [Validators.required]]
    });

    PayrollDetailForm = this._formBuilder.group({
        base_salary: [{ value: 0, disabled: true }],
        overtime_pay: [{ value: 0, disabled: true }],
        bpjs_kesehatan_deduction: [{ value: 0, disabled: true }],
        bpjs_ketenagakerjaan_deduction: [{ value: 0, disabled: true }],
        bpjs_pensiun_deduction: [{ value: 0, disabled: true }],
        unpaid_leave_deduction: [{ value: 0, disabled: true }],
        tax_deduction: [{ value: 0, disabled: true }],
        additional_allowances: this._formBuilder.array([]),
        additional_deductions: this._formBuilder.array([]),
        total_allowances: [{ value: 0, disabled: true }],
        total_deduction: [{ value: 0, disabled: true }],
        net_salary: [{ value: 0, disabled: true }]
    });

    ngOnInit(): void {
        this._store
            .select(EmployeeState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this._employeeDatasource = result);

        this._store
            .select(PayrollState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => {
                this.TableProps.datasource = result.map((item: any) => ({
                    ...item,
                    payment_status: item.payment_status?.toUpperCase() || 'PENDING'
                }));
            });
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getCurrentMonth(): string {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
        if (args.id === 'generate') {
            this._pageState.set('generate');
        } else if (args.id === 'refresh') {
            this._store.dispatch(new PayrollAction.GetPayroll());
        }
    }

    handleFilter(args: any) {
        const filter = args || {};
        this._store.dispatch(new PayrollAction.GetPayroll(filter, {}));
    }

    handleSort(args: any) {
        const sort = args || {};
        this._store.dispatch(new PayrollAction.GetPayroll({}, sort));
    }

    handleToolbarClicked(args: any) {
        const data = args.data as EmployeeModel.IPayroll;

        if (args.toolbar.id === 'detail') {
            this._selectedPayroll.set(data);
            this._pageState.set('detail');
            this._loadPayrollDetail(data);
        } else if (args.toolbar.id === 'paid') {
            this._confirmationService.confirm({
                message: 'Tandai payroll ini sebagai sudah dibayar?',
                header: 'Konfirmasi',
                icon: 'pi pi-info-circle',
                accept: () => {
                    this._store.dispatch(new PayrollAction.UpdatePayroll({
                        ...data,
                        payment_status: 'paid'
                    })).subscribe(() => {
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Berhasil!',
                            detail: 'Status payroll berhasil diubah'
                        });
                    });
                }
            });
        } else if (args.toolbar.id === 'delete') {
            this._confirmationService.confirm({
                message: 'Apakah anda yakin menghapus payroll ini?',
                header: 'Danger Zone',
                icon: 'pi pi-info-circle',
                rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
                acceptButtonProps: { label: 'Hapus', severity: 'danger' },
                accept: () => {
                    this._store.dispatch(new PayrollAction.DeletePayroll(data.id)).subscribe(() => {
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Berhasil!',
                            detail: 'Payroll berhasil dihapus'
                        });
                    });
                }
            });
        }
    }

    private async _loadPayrollDetail(payroll: EmployeeModel.IPayroll) {
        // Get breakdown data dari calculation service
        try {
            const { breakdown } = await this._calculationService.calculatePayrollForEmployee(
                payroll.employee_id,
                payroll.month
            );

            // Load breakdown data termasuk BPJS terpisah
            this.PayrollDetailForm.patchValue({
                base_salary: payroll.base_salary,
                overtime_pay: payroll.overtime_pay,
                bpjs_kesehatan_deduction: breakdown.bpjsKesehatanDeduction,
                bpjs_ketenagakerjaan_deduction: breakdown.bpjsKetenagakerjaanDeduction,
                bpjs_pensiun_deduction: breakdown.bpjsPensiunDeduction,
                unpaid_leave_deduction: breakdown.unpaidLeaveDeduction,
                tax_deduction: breakdown.taxDeduction,
                net_salary: payroll.net_salary
            });
        } catch (error) {
            console.error('Error loading payroll breakdown:', error);
            // Fallback ke nilai dari payroll jika ada error
            this.PayrollDetailForm.patchValue({
                base_salary: payroll.base_salary,
                overtime_pay: payroll.overtime_pay,
                net_salary: payroll.net_salary
            });
        }

        // Load additional allowances
        const allowancesArray = this.PayrollDetailForm.get('additional_allowances') as FormArray;
        allowancesArray.clear();

        if (payroll.additional_allowances && payroll.additional_allowances.length > 0) {
            payroll.additional_allowances.forEach((allowance) => {
                allowancesArray.push(this._formBuilder.group({
                    name: [allowance.name || '', Validators.required],
                    amount: [allowance.amount || 0, [Validators.required, Validators.min(0)]]
                }));
            });
        }

        // Load additional deductions
        const deductionsArray = this.PayrollDetailForm.get('additional_deductions') as FormArray;
        deductionsArray.clear();

        if (payroll.additional_deductions && payroll.additional_deductions.length > 0) {
            payroll.additional_deductions.forEach((deduction) => {
                deductionsArray.push(this._formBuilder.group({
                    name: [deduction.name || '', Validators.required],
                    amount: [deduction.amount || 0, [Validators.required, Validators.min(0)]]
                }));
            });
        }

        // Trigger calculation
        this._calculateNetSalary();

        // Subscribe to changes
        allowancesArray.valueChanges.pipe(takeUntil(this.Destroy$)).subscribe(() => this._calculateNetSalary());
        deductionsArray.valueChanges.pipe(takeUntil(this.Destroy$)).subscribe(() => this._calculateNetSalary());
    }

    handleGeneratePayroll() {
        if (this.GenerateForm.valid) {
            this._isGenerating.set(true);
            const month = this.GenerateForm.get('month')?.value || '';

            this._store.dispatch(new PayrollAction.GeneratePayroll(month)).subscribe({
                next: () => {
                    this._isGenerating.set(false);
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Berhasil!',
                        detail: 'Payroll berhasil di-generate'
                    });
                    this._pageState.set('list');
                    this.GenerateForm.reset({ month: this.getCurrentMonth() });
                },
                error: (err) => {
                    this._isGenerating.set(false);
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error!',
                        detail: err.message || 'Gagal generate payroll'
                    });
                }
            });
        }
    }

    handleBackToList() {
        this._pageState.set('list');
        this._selectedPayroll.set(null);
        this._payrollBreakdown.set(null);
    }

    private _calculateNetSalary() {
        const baseSalary = this.PayrollDetailForm.get('base_salary')?.value || 0;
        const overtimePay = this.PayrollDetailForm.get('overtime_pay')?.value || 0;
        const bpjsKesehatanDeduction = this.PayrollDetailForm.get('bpjs_kesehatan_deduction')?.value || 0;
        const bpjsKetenagakerjaanDeduction = this.PayrollDetailForm.get('bpjs_ketenagakerjaan_deduction')?.value || 0;
        const bpjsPensiunDeduction = this.PayrollDetailForm.get('bpjs_pensiun_deduction')?.value || 0;
        const unpaidLeaveDeduction = this.PayrollDetailForm.get('unpaid_leave_deduction')?.value || 0;
        const taxDeduction = this.PayrollDetailForm.get('tax_deduction')?.value || 0;

        // Hitung total allowances
        const allowancesArray = this.PayrollDetailForm.get('additional_allowances') as FormArray;
        const totalAllowances = allowancesArray.controls.reduce((sum, control) => {
            return sum + (control.get('amount')?.value || 0);
        }, 0);

        // Hitung total deductions
        const deductionsArray = this.PayrollDetailForm.get('additional_deductions') as FormArray;
        const totalAdditionalDeductions = deductionsArray.controls.reduce((sum, control) => {
            return sum + (control.get('amount')?.value || 0);
        }, 0);

        // Hitung total BPJS
        const totalBpjs = bpjsKesehatanDeduction + bpjsKetenagakerjaanDeduction + bpjsPensiunDeduction;

        // Hitung total deduction
        const totalDeduction = totalBpjs + unpaidLeaveDeduction + taxDeduction + totalAdditionalDeductions;

        // Hitung net salary
        const netSalary = baseSalary + overtimePay + totalAllowances - totalDeduction;

        // Update form values
        this.PayrollDetailForm.patchValue({
            total_allowances: totalAllowances,
            total_deduction: totalDeduction,
            net_salary: Math.max(0, netSalary)
        }, { emitEvent: false });
    }

    get additionalAllowancesArray(): FormArray {
        return this.PayrollDetailForm.get('additional_allowances') as FormArray;
    }

    get additionalDeductionsArray(): FormArray {
        return this.PayrollDetailForm.get('additional_deductions') as FormArray;
    }

    addAllowance() {
        this.additionalAllowancesArray.push(this._formBuilder.group({
            name: ['', Validators.required],
            amount: [0, [Validators.required, Validators.min(0)]]
        }));
    }

    removeAllowance(index: number) {
        this.additionalAllowancesArray.removeAt(index);
    }

    addDeduction() {
        this.additionalDeductionsArray.push(this._formBuilder.group({
            name: ['', Validators.required],
            amount: [0, [Validators.required, Validators.min(0)]]
        }));
    }

    removeDeduction(index: number) {
        this.additionalDeductionsArray.removeAt(index);
    }

    handleSavePayrollDetail() {
        const selected = this._selectedPayroll();
        if (selected && this.PayrollDetailForm.valid) {
            const formValue = this.PayrollDetailForm.value;

            const updated: EmployeeModel.IPayroll = {
                ...selected,
                additional_allowances: (formValue.additional_allowances || []) as { name: string; amount: number }[],
                additional_deductions: (formValue.additional_deductions || []) as { name: string; amount: number }[],
                deduction: formValue.total_deduction || 0,
                net_salary: formValue.net_salary || 0
            };

            // Store BPJS breakdown sebagai metadata (jika diperlukan untuk audit trail)
            (updated as any).bpjs_breakdown = {
                bpjs_kesehatan: formValue.bpjs_kesehatan_deduction || 0,
                bpjs_ketenagakerjaan: formValue.bpjs_ketenagakerjaan_deduction || 0,
                bpjs_pensiun: formValue.bpjs_pensiun_deduction || 0
            };

            this._store.dispatch(new PayrollAction.UpdatePayroll(updated)).subscribe(() => {
                this._messageService.add({
                    severity: 'success',
                    summary: 'Berhasil!',
                    detail: 'Payroll detail berhasil disimpan'
                });
                this.handleBackToList();
            });
        }
    }

}

