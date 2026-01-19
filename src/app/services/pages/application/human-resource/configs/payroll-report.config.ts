import { ReportConfig, FilterType, ReportType } from '../../../../../model/shared/report.model';
import { PayrollDataProvider } from '../data-providers/payroll-data.provider';

export const PAYROLL_REPORT_CONFIG: ReportConfig = {
    type: ReportType.PAYROLL,
    title: 'Payroll Report',
    description: 'Employee payroll summary including salary, allowances, and deductions',
    availableFilters: [
        FilterType.PERIOD,
        FilterType.DEPARTMENT,
        FilterType.EMPLOYEE
    ],
    columns: [
        {
            field: 'employeeId',
            header: 'Employee ID',
            type: 'text',
            sortable: true,
            width: '120px'
        },
        {
            field: 'employeeName',
            header: 'Employee Name',
            type: 'text',
            sortable: true,
            width: '200px'
        },
        {
            field: 'department',
            header: 'Department',
            type: 'text',
            sortable: true,
            width: '150px'
        },
        {
            field: 'baseSalary',
            header: 'Base Salary',
            type: 'currency',
            sortable: true,
            width: '150px'
        },
        {
            field: 'allowances',
            header: 'Allowances',
            type: 'currency',
            sortable: true,
            width: '150px'
        },
        {
            field: 'deductions',
            header: 'Deductions',
            type: 'currency',
            sortable: true,
            width: '150px'
        },
        {
            field: 'netSalary',
            header: 'Net Salary',
            type: 'currency',
            sortable: true,
            width: '150px'
        }
    ],
    dataProvider: PayrollDataProvider
};
