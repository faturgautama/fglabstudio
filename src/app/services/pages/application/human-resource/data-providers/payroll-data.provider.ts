import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { DatabaseService } from '../../../../../app.database';
import { PayrollReportRow } from '../../../../../model/pages/application/human-resource/report.model';
import { IReportDataProvider, ReportFilter, ReportRow, ReportSummary, ValidationResult, PeriodType, FilterType, FilterOption } from '../../../../../model/shared/report.model';

@Injectable()
export class PayrollDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchPayrollData(filters));
    }

    private async fetchPayrollData(filters: ReportFilter): Promise<PayrollReportRow[]> {
        await this.dbService.ensureReady();

        const { startDate, endDate } = this.getDateRange(filters);

        // Fetch payroll records within date range
        const payrollRecords = await this.dbService.db.payroll
            .filter(p => {
                const payrollDate = new Date(p.month);
                return payrollDate >= startDate && payrollDate <= endDate;
            })
            .toArray();

        // Fetch employees
        const employeeIds = [...new Set(payrollRecords.map(p => p.employee_id))];
        const employees = await this.dbService.db.employees
            .where('id').anyOf(employeeIds)
            .toArray();
        const empMap = new Map(employees.map(e => [e.id, e]));

        // Fetch departments
        const departments = await this.dbService.db.department.toArray();
        const deptMap = new Map(departments.map(d => [d.id, d.title]));

        // Apply filters
        let filteredPayroll = payrollRecords;

        if (filters.filters?.has('department')) {
            const deptId = filters.filters.get('department');
            filteredPayroll = filteredPayroll.filter(p => {
                const emp = empMap.get(p.employee_id);
                return emp?.department_id === deptId;
            });
        }

        if (filters.filters?.has('employee')) {
            const empId = filters.filters.get('employee');
            filteredPayroll = filteredPayroll.filter(p => p.employee_id === empId);
        }

        // Aggregate payroll by employee
        const employeePayrollMap = new Map<string, PayrollReportRow>();

        filteredPayroll.forEach(payroll => {
            const employee = empMap.get(payroll.employee_id);
            if (!employee) return;

            const key = payroll.employee_id;

            if (!employeePayrollMap.has(key)) {
                employeePayrollMap.set(key, {
                    employeeId: employee.id?.toString() || '',
                    employeeName: employee.full_name,
                    department: deptMap.get(employee.department_id) || 'N/A',
                    baseSalary: 0,
                    allowances: 0,
                    deductions: 0,
                    netSalary: 0
                });
            }

            const row = employeePayrollMap.get(key)!;
            row.baseSalary += payroll.base_salary || 0;

            // Calculate allowances
            const allowances = (payroll.overtime_pay || 0) + (payroll.bonus || 0);
            if (payroll.additional_allowances) {
                payroll.additional_allowances.forEach(a => {
                    row.allowances += a.amount;
                });
            }
            row.allowances += allowances;

            // Calculate deductions
            row.deductions += payroll.deduction || 0;
            if (payroll.additional_deductions) {
                payroll.additional_deductions.forEach(d => {
                    row.deductions += d.amount;
                });
            }

            row.netSalary += payroll.net_salary || 0;
        });

        return Array.from(employeePayrollMap.values());
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const payrollRows = rows as PayrollReportRow[];

        const totalEmployees = payrollRows.length;
        const totalBaseSalary = payrollRows.reduce((sum, row) => sum + row.baseSalary, 0);
        const totalAllowances = payrollRows.reduce((sum, row) => sum + row.allowances, 0);
        const totalDeductions = payrollRows.reduce((sum, row) => sum + row.deductions, 0);
        const totalNetSalary = payrollRows.reduce((sum, row) => sum + row.netSalary, 0);

        return {
            'Total Employees': totalEmployees,
            'Total Base Salary': this.formatCurrency(totalBaseSalary),
            'Total Allowances': this.formatCurrency(totalAllowances),
            'Total Deductions': this.formatCurrency(totalDeductions),
            'Total Net Salary': this.formatCurrency(totalNetSalary)
        };
    }

    validateFilters(filters: ReportFilter): ValidationResult {
        const errors: any[] = [];

        if (filters.periodType === PeriodType.DATE_RANGE) {
            if (!filters.startDate) {
                errors.push({ field: 'startDate', message: 'Start date is required' });
            }
            if (!filters.endDate) {
                errors.push({ field: 'endDate', message: 'End date is required' });
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    getFilterOptions(filterType: FilterType): Observable<FilterOption[]> {
        return from(this.loadFilterOptions(filterType));
    }

    private async loadFilterOptions(filterType: FilterType): Promise<FilterOption[]> {
        await this.dbService.ensureReady();

        switch (filterType) {
            case FilterType.DEPARTMENT:
                const allDepartments = await this.dbService.db.department.toArray();
                const departments = allDepartments.filter(item => item.is_active);

                return departments.map(d => ({
                    label: d.title,
                    value: d.id
                }));

            case FilterType.EMPLOYEE:
                const allEmployees = await this.dbService.db.employees.toArray();
                const employees = allEmployees.filter(item => item.is_active);

                return employees.map(e => ({
                    label: e.full_name,
                    value: e.id
                }));

            default:
                return [];
        }
    }

    private getDateRange(filters: ReportFilter): { startDate: Date; endDate: Date } {
        if (filters.periodType === PeriodType.DATE_RANGE) {
            return {
                startDate: filters.startDate!,
                endDate: filters.endDate!
            };
        } else if (filters.periodType === PeriodType.MONTH) {
            const year = filters.year!;
            const month = filters.month! - 1;
            return {
                startDate: new Date(year, month, 1),
                endDate: new Date(year, month + 1, 0)
            };
        } else {
            const year = filters.year!;
            return {
                startDate: new Date(year, 0, 1),
                endDate: new Date(year, 11, 31)
            };
        }
    }

    private formatCurrency(value: number): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }
}
