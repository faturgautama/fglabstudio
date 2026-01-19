import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseService } from '../../../../../app.database';
import { AttendanceReportRow } from '../../../../../model/pages/application/human-resource/report.model';
import { IReportDataProvider, ReportFilter, ReportRow, ReportSummary, ValidationResult, PeriodType, FilterType, FilterOption } from '../../../../../model/shared/report.model';


@Injectable()
export class AttendanceDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchAttendanceData(filters));
    }

    private async fetchAttendanceData(filters: ReportFilter): Promise<AttendanceReportRow[]> {
        await this.dbService.ensureReady();

        const { startDate, endDate } = this.getDateRange(filters);

        // Fetch all employees
        let allEmployees = await this.dbService.db.employees.toArray();
        let employees = allEmployees.filter(item => item.is_active);

        // Apply department filter
        if (filters.filters?.has('department')) {
            const deptId = filters.filters.get('department');
            employees = employees.filter(e => e.department_id === deptId);
        }

        // Apply employee filter
        if (filters.filters?.has('employee')) {
            const empId = filters.filters.get('employee');
            employees = employees.filter(e => e.id === empId);
        }

        // Fetch departments for lookup
        const departments = await this.dbService.db.department.toArray();
        const deptMap = new Map(departments.map(d => [d.id, d.title]));

        // Fetch attendance records
        const attendanceRecords = await this.dbService.db.attendance
            .where('date').between(
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0],
                true,
                true
            )
            .toArray();

        // Aggregate attendance by employee
        const reportRows: AttendanceReportRow[] = employees.map(employee => {
            const empAttendance = attendanceRecords.filter(a => a.employee_id === employee.id);

            const totalPresent = empAttendance.filter(a => a.is_present && !a.is_late).length;
            const totalLate = empAttendance.filter(a => a.is_late).length;
            const totalAbsent = empAttendance.filter(a => !a.is_present).length;

            // For sick and permitted, we'd need to check leave records
            // For now, we'll set them to 0 or calculate from leave data if needed
            const totalSick = 0;
            const totalPermitted = 0;

            const totalDays = empAttendance.length;
            const attendanceRate = totalDays > 0 ? (totalPresent / totalDays) * 100 : 0;

            return {
                employeeId: employee.id?.toString() || '',
                employeeName: employee.full_name,
                department: deptMap.get(employee.department_id) || 'N/A',
                totalPresent,
                totalLate,
                totalAbsent,
                totalSick,
                totalPermitted,
                attendanceRate: parseFloat(attendanceRate.toFixed(2))
            };
        });

        return reportRows;
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const attendanceRows = rows as AttendanceReportRow[];

        const totalEmployees = attendanceRows.length;
        const totalPresent = attendanceRows.reduce((sum, row) => sum + row.totalPresent, 0);
        const totalLate = attendanceRows.reduce((sum, row) => sum + row.totalLate, 0);
        const totalAbsent = attendanceRows.reduce((sum, row) => sum + row.totalAbsent, 0);
        const avgAttendanceRate = totalEmployees > 0
            ? attendanceRows.reduce((sum, row) => sum + row.attendanceRate, 0) / totalEmployees
            : 0;

        return {
            'Total Employees': totalEmployees,
            'Total Present': totalPresent,
            'Total Late': totalLate,
            'Total Absent': totalAbsent,
            'Average Attendance Rate': `${avgAttendanceRate.toFixed(2)}%`
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
            if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
                errors.push({ field: 'dateRange', message: 'Start date must be before end date' });
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
