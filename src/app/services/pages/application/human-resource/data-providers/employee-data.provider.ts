import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { DatabaseService } from '../../../../../app.database';
import { EmployeeReportRow } from '../../../../../model/pages/application/human-resource/report.model';
import { IReportDataProvider, ReportFilter, ReportRow, ReportSummary, ValidationResult, FilterType, FilterOption } from '../../../../../model/shared/report.model';

@Injectable()
export class EmployeeDataProvider implements IReportDataProvider {
    private dbService = inject(DatabaseService);

    fetchData(filters: ReportFilter): Observable<ReportRow[]> {
        return from(this.fetchEmployeeData(filters));
    }

    private async fetchEmployeeData(filters: ReportFilter): Promise<EmployeeReportRow[]> {
        await this.dbService.ensureReady();

        // Fetch all employees
        let allEmployees = await this.dbService.db.employees.toArray();
        let employees = allEmployees.filter(item => item.is_active);

        // Apply department filter
        if (filters.filters?.has('department')) {
            const deptId = filters.filters.get('department');
            employees = employees.filter(e => e.department_id === deptId);
        }

        // Apply position filter
        if (filters.filters?.has('position')) {
            const posId = filters.filters.get('position');
            employees = employees.filter(e => e.position_id === posId);
        }

        // Apply status filter
        if (filters.filters?.has('status')) {
            const status = filters.filters.get('status');
            employees = employees.filter(e => e.work_status === status);
        }

        // Fetch departments and positions for lookup
        const departments = await this.dbService.db.department.toArray();
        const deptMap = new Map(departments.map(d => [d.id, d.title]));

        const positions = await this.dbService.db.position.toArray();
        const posMap = new Map(positions.map(p => [p.id, p.title]));

        // Map to report rows
        const reportRows: EmployeeReportRow[] = employees.map(employee => {
            const age = employee.birth_date
                ? this.calculateAge(new Date(employee.birth_date))
                : 0;

            return {
                employeeId: employee.id?.toString() || '',
                employeeName: employee.full_name,
                department: deptMap.get(employee.department_id) || 'N/A',
                position: posMap.get(employee.position_id) || 'N/A',
                gender: employee.gender,
                age: age,
                hireDate: employee.join_date ? new Date(employee.join_date) : new Date(),
                status: employee.work_status || 'active'
            };
        });

        return reportRows;
    }

    calculateSummary(rows: ReportRow[]): ReportSummary {
        const employeeRows = rows as EmployeeReportRow[];

        const totalEmployees = employeeRows.length;
        const maleCount = employeeRows.filter(r => r.gender === 'male').length;
        const femaleCount = employeeRows.filter(r => r.gender === 'female').length;
        const avgAge = totalEmployees > 0
            ? employeeRows.reduce((sum, row) => sum + row.age, 0) / totalEmployees
            : 0;

        // Count by status
        const activeCount = employeeRows.filter(r => r.status === 'active').length;
        const onLeaveCount = employeeRows.filter(r => r.status === 'on-leave').length;

        return {
            'Total Employees': totalEmployees,
            'Male': maleCount,
            'Female': femaleCount,
            'Average Age': avgAge.toFixed(1),
            'Active': activeCount,
            'On Leave': onLeaveCount
        };
    }

    validateFilters(filters: ReportFilter): ValidationResult {
        return {
            valid: true,
            errors: []
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

            case FilterType.POSITION:
                const allPositions = await this.dbService.db.position.toArray();
                const positions = allPositions.filter(item => item.is_active);

                return positions.map(p => ({
                    label: p.title,
                    value: p.id
                }));

            case FilterType.STATUS:
                return [
                    { label: 'Active', value: 'active' },
                    { label: 'On Leave', value: 'on-leave' },
                    { label: 'Resigned', value: 'resigned' },
                    { label: 'Suspended', value: 'suspended' }
                ];

            default:
                return [];
        }
    }

    private calculateAge(birthDate: Date): number {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }
}
