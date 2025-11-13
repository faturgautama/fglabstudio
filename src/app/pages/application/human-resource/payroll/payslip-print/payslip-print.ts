import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { EmployeeModel } from '../../../../../model/pages/application/human-resource/employee.model';
import { PayrollState } from '../../../../../store/human-resource/payroll';
import { PositionState } from '../../../../../store/human-resource/position';
import { PayrollCalculationService, PayrollBreakdown } from '../../../../../services/pages/application/human-resource/payroll-calculation.service';
import { CompanySettingState } from '../../../../../store/human-resource/company-setting';
import { DepartementState } from '../../../../../store/human-resource/departement';

@Component({
  selector: 'app-payslip-print',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './payslip-print.html',
  styleUrl: './payslip-print.scss'
})
export class PayslipPrint implements OnInit, OnDestroy {

  private _store = inject(Store);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _calculationService = inject(PayrollCalculationService);

  private Destroy$ = new Subject();

  // Signals for reactive data
  _payrollData = signal<EmployeeModel.IPayroll | null>(null);
  _hrSetting = signal<EmployeeModel.IHumanResourceSetting | null>(null);
  _breakdown = signal<PayrollBreakdown | null>(null);
  _departmentName = signal<string>('');
  _positionName = signal<string>('');
  _printDate = signal<Date>(new Date());

  ngOnInit(): void {
    // Get payroll ID from route params
    const payrollId = this._route.snapshot.paramMap.get('id');

    if (!payrollId) {
      console.error('Payroll ID not found in route');
      this._router.navigate(['/application/human-resource/payroll']);
      return;
    }

    // Load payroll data
    this._loadPayrollData(payrollId);

    // Load HR Settings
    this._store
      .select(CompanySettingState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(settings => {
        const activeSetting = settings.find(s => s.is_active);
        this._hrSetting.set(activeSetting || null);
      });
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

  /**
   * Load payroll data by ID from store
   */
  private async _loadPayrollData(payrollId: string) {
    this._store
      .select(PayrollState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(async (payrolls) => {
        const payroll = payrolls.find(p => p.id?.toString() === payrollId);

        if (payroll) {
          this._payrollData.set(payroll);

          // Load breakdown data (including separated BPJS)
          if (payroll.employee_id && payroll.month) {
            try {
              const { breakdown } = await this._calculationService.calculatePayrollForEmployee(
                payroll.employee_id,
                payroll.month
              );
              this._breakdown.set(breakdown);
            } catch (error) {
              console.error('Error loading breakdown:', error);
            }
          };

          // Load department and position names
          if (payroll.employees?.department_id) {
            this._loadDepartmentName(payroll.employees.department_id);
          }

          if (payroll.employees?.position_id) {
            this._loadPositionName(payroll.employees.position_id);
          }
        } else {
          console.error('Payroll not found with ID:', payrollId);
          this._router.navigate(['/application/human-resource/payroll']);
        }
      });
  }

  /**
   * Load department name by ID
   */
  private _loadDepartmentName(departmentId: string) {
    this._store
      .select(DepartementState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(departments => {
        const department = departments.find(d => d.id === departmentId);
        this._departmentName.set(department?.title || '-');
      });
  }

  /**
   * Load position name by ID
   */
  private _loadPositionName(positionId: string) {
    this._store
      .select(PositionState.getAll)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(positions => {
        const position = positions.find(p => p.id === positionId);
        this._positionName.set(position?.title || '-');
      });
  }

  /**
   * Calculate total income (base salary + overtime + allowances)
   */
  _totalIncome(): number {
    const payroll = this._payrollData();
    if (!payroll) return 0;

    let total = (payroll.base_salary || 0) + (payroll.overtime_pay || 0);

    if (payroll.additional_allowances) {
      total += payroll.additional_allowances.reduce((sum, a) => sum + (a.amount || 0), 0);
    }

    return total;
  }

  /**
   * Trigger browser print dialog
   */
  handlePrint() {
    window.print();
  }

  /**
   * Navigate back to payroll list
   */
  handleBack() {
    this._router.navigate(['/people/payroll']);
  }
}