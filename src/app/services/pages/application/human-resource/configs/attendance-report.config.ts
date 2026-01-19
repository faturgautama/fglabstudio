import { ReportConfig, FilterType, ReportType } from '../../../../../model/shared/report.model';
import { AttendanceDataProvider } from '../data-providers/attendance-data.provider';

export const ATTENDANCE_REPORT_CONFIG: ReportConfig = {
    type: ReportType.ATTENDANCE,
    title: 'Attendance Report',
    description: 'Employee attendance summary including present, late, and absent records',
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
            field: 'totalPresent',
            header: 'Present',
            type: 'number',
            sortable: true,
            width: '100px'
        },
        {
            field: 'totalLate',
            header: 'Late',
            type: 'number',
            sortable: true,
            width: '100px'
        },
        {
            field: 'totalAbsent',
            header: 'Absent',
            type: 'number',
            sortable: true,
            width: '100px'
        },
        {
            field: 'attendanceRate',
            header: 'Attendance Rate',
            type: 'percentage',
            sortable: true,
            width: '120px'
        }
    ],
    dataProvider: AttendanceDataProvider
};
