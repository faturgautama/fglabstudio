import { ReportConfig, FilterType, ReportType } from '../../../../../model/shared/report.model';
import { LeaveDataProvider } from '../data-providers/leave-data.provider';

export const LEAVE_REPORT_CONFIG: ReportConfig = {
    type: ReportType.LEAVE,
    title: 'Leave Report',
    description: 'Employee leave summary including days taken and remaining balance',
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
            field: 'leaveType',
            header: 'Leave Type',
            type: 'text',
            sortable: true,
            width: '120px'
        },
        {
            field: 'daysTaken',
            header: 'Days Taken',
            type: 'number',
            sortable: true,
            width: '100px'
        },
        {
            field: 'daysRemaining',
            header: 'Days Remaining',
            type: 'number',
            sortable: true,
            width: '120px'
        },
        {
            field: 'totalQuota',
            header: 'Total Quota',
            type: 'number',
            sortable: true,
            width: '100px'
        },
        {
            field: 'utilizationRate',
            header: 'Utilization Rate',
            type: 'percentage',
            sortable: true,
            width: '120px'
        }
    ],
    dataProvider: LeaveDataProvider
};
