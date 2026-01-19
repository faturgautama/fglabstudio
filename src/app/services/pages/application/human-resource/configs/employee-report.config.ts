import { ReportConfig, FilterType, ReportType } from '../../../../../model/shared/report.model';
import { EmployeeDataProvider } from '../data-providers/employee-data.provider';

export const EMPLOYEE_REPORT_CONFIG: ReportConfig = {
    type: ReportType.EMPLOYEE,
    title: 'Employee Report',
    description: 'Employee demographic and status information',
    availableFilters: [
        FilterType.DEPARTMENT,
        FilterType.POSITION,
        FilterType.STATUS
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
            field: 'position',
            header: 'Position',
            type: 'text',
            sortable: true,
            width: '150px'
        },
        {
            field: 'gender',
            header: 'Gender',
            type: 'text',
            sortable: true,
            width: '100px'
        },
        {
            field: 'age',
            header: 'Age',
            type: 'number',
            sortable: true,
            width: '80px'
        },
        {
            field: 'hireDate',
            header: 'Hire Date',
            type: 'date',
            sortable: true,
            width: '120px'
        },
        {
            field: 'status',
            header: 'Status',
            type: 'text',
            sortable: true,
            width: '120px'
        }
    ],
    dataProvider: EmployeeDataProvider
};
