import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { DatabaseService } from '../../../../../app.database';
import { OvertimeReportRow } from '../../../../../model/pages/application/human-resource/report.model';
import { IReportDataProvider, ReportFilter, ReportRow, ReportSummary, ValidationResult, PeriodType, FilterType, FilterOption } from '../../../../../model/shared/report.model';

@Injectable()
export class OvertimeDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchOvertimeData(filters));
    }

    private async fetchOvertimeData(filters: ReportFilter): Promise<OvertimeReportRow[]> {
        await this.dbService.ensureReady();

        const { startDate, endDate } = this.getDateRange(filters);

        // Fetch overtime records
        const overtimeRecords = await this.dbService.db.overtime
            .filter(o => {
                const overtimeDate = new Date(o.date);
                return overtimeDate >= startDate && overtimeDate <= endDate && o.status === 'approved';
            })
            .toArray();

        // Fetch employees
        const employeeIds = [...new Set(overtimeRecords.map(o => o.employee_id))];
        const employees = await this.dbService.db.employees
            .where('id').anyOf(employeeIds)
            .toArray();
        const empMap = new Map(employees.map(e => [e.id, e]));

        // Fetch departments
        const departments = await this.dbService.db.department.toArray();
        const deptMap = new Map(departments.map(d => [d.id, d.title]));

        // Fetch HR settings for overtime rate
        const allHrSettings = await this.dbService.db.hr_setting.toArray();
        const hrSettings = allHrSettings.filter(item => item.is_active);

        const activeHrSettings = hrSettings.length ? hrSettings[0] : null;

        const overtimeRate = activeHrSettings?.overtime_rate_per_hour || 25000;

        // Apply filters
        let filteredOvertime = overtimeRecords;

        if (filters.filters?.has('department')) {
            const deptId = filters.filters.get('department');
            filteredOvertime = filteredOvertime.filter(o => {
                const emp = empMap.get(o.employee_id);
                return emp?.department_id === deptId;
            });
        }

        if (filters.filters?.has('employee')) {
            const empId = filters.filters.get('employee');
            filteredOvertime = filteredOvertime.filter(o => o.employee_id === empId);
        }

        // Aggregate overtime by employee
        const employeeOvertimeMap = new Map<string, OvertimeReportRow>();

        filteredOvertime.forEach(overtime => {
            const employee = empMap.get(overtime.employee_id);
            if (!employee) return;

            const key = overtime.employee_id;

            if (!employeeOvertimeMap.has(key)) {
                employeeOvertimeMap.set(key, {
                    employeeId: employee.id?.toString() || '',
                    employeeName: employee.full_name,
                    department: deptMap.get(employee.department_id) || 'N/A',
                    totalHours: 0,
                    overtimeRate: overtimeRate,
                    totalCost: 0
                });
            }

            const row = employeeOvertimeMap.get(key)!;
            row.totalHours += overtime.total_hours;
            row.totalCost = row.totalHours * overtimeRate;
        });

        return Array.from(employeeOvertimeMap.values());
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const overtimeRows = rows as OvertimeReportRow[];

        const totalEmployees = overtimeRows.length;
        const totalHours = overtimeRows.reduce((sum, row) => sum + row.totalHours, 0);
        const totalCost = overtimeRows.reduce((sum, row) => sum + row.totalCost, 0);
        const avgHoursPerEmployee = totalEmployees > 0 ? totalHours / totalEmployees : 0;

        return {
            'Total Employees': totalEmployees,
            'Total Hours': totalHours.toFixed(2),
            'Total Cost': this.formatCurrency(totalCost),
            'Average Hours per Employee': avgHoursPerEmployee.toFixed(2)
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
