import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { DatabaseService } from '../../../../../app.database';
import { LeaveReportRow } from '../../../../../model/pages/application/human-resource/report.model';
import { IReportDataProvider, ReportFilter, ReportRow, ReportSummary, ValidationResult, PeriodType, FilterType, FilterOption } from '../../../../../model/shared/report.model';

@Injectable()
export class LeaveDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchLeaveData(filters));
    }

    private async fetchLeaveData(filters: ReportFilter): Promise<LeaveReportRow[]> {
        await this.dbService.ensureReady();

        const { startDate, endDate } = this.getDateRange(filters);

        // Fetch leave records
        const leaveRecords = await this.dbService.db.leave
            .filter(l => {
                const leaveStart = new Date(l.start_date);
                const leaveEnd = new Date(l.end_date);
                return (leaveStart >= startDate && leaveStart <= endDate) ||
                    (leaveEnd >= startDate && leaveEnd <= endDate);
            })
            .toArray();

        // Fetch employees
        const employeeIds = [...new Set(leaveRecords.map(l => l.employee_id))];
        const employees = await this.dbService.db.employees
            .where('id').anyOf(employeeIds)
            .toArray();
        const empMap = new Map(employees.map(e => [e.id, e]));

        // Fetch departments
        const departments = await this.dbService.db.department.toArray();
        const deptMap = new Map(departments.map(d => [d.id, d.title]));

        // Apply filters
        let filteredLeave = leaveRecords;

        if (filters.filters?.has('department')) {
            const deptId = filters.filters.get('department');
            filteredLeave = filteredLeave.filter(l => {
                const emp = empMap.get(l.employee_id);
                return emp?.department_id === deptId;
            });
        }

        if (filters.filters?.has('employee')) {
            const empId = filters.filters.get('employee');
            filteredLeave = filteredLeave.filter(l => l.employee_id === empId);
        }

        // Aggregate leave by employee and type
        const employeeLeaveMap = new Map<string, LeaveReportRow>();

        filteredLeave.forEach(leave => {
            const employee = empMap.get(leave.employee_id);
            if (!employee || leave.status !== 'approved') return;

            const key = `${leave.employee_id}_${leave.leave_policy_id}`;

            if (!employeeLeaveMap.has(key)) {
                employeeLeaveMap.set(key, {
                    employeeId: employee.id?.toString() || '',
                    employeeName: employee.full_name,
                    department: deptMap.get(employee.department_id) || 'N/A',
                    leaveType: 'Annual', // Would need to fetch from leave policy
                    daysTaken: 0,
                    daysRemaining: 12, // Default annual leave quota
                    totalQuota: 12,
                    utilizationRate: 0
                });
            }

            const row = employeeLeaveMap.get(key)!;
            row.daysTaken += leave.total_days;
            row.daysRemaining = row.totalQuota - row.daysTaken;
            row.utilizationRate = (row.daysTaken / row.totalQuota) * 100;
        });

        return Array.from(employeeLeaveMap.values());
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const leaveRows = rows as LeaveReportRow[];

        const totalEmployees = leaveRows.length;
        const totalDaysTaken = leaveRows.reduce((sum, row) => sum + row.daysTaken, 0);
        const totalDaysRemaining = leaveRows.reduce((sum, row) => sum + row.daysRemaining, 0);
        const avgUtilization = totalEmployees > 0
            ? leaveRows.reduce((sum, row) => sum + row.utilizationRate, 0) / totalEmployees
            : 0;

        return {
            'Total Employees': totalEmployees,
            'Total Days Taken': totalDaysTaken,
            'Total Days Remaining': totalDaysRemaining,
            'Average Utilization': `${avgUtilization.toFixed(2)}%`
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
}
