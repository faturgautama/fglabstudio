import { ReportConfig, FilterType, ReportType } from '../../../../../model/shared/report.model';
import { OvertimeDataProvider } from '../data-providers/overtime-data.provider';

export const OVERTIME_REPORT_CONFIG: ReportConfig = {
    type: ReportType.OVERTIME,
    title: 'Overtime Report',
    description: 'Employee overtime summary including hours worked and costs',
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
            field: 'totalHours',
            header: 'Total Hours',
            type: 'number',
            sortable: true,
            width: '120px'
        },
        {
            field: 'overtimeRate',
            header: 'Rate per Hour',
            type: 'currency',
            sortable: true,
            width: '150px'
        },
        {
            field: 'totalCost',
            header: 'Total Cost',
            type: 'currency',
            sortable: true,
            width: '150px'
        }
    ],
    dataProvider: OvertimeDataProvider
};
