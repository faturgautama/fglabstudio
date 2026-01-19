import { ReportRow } from '../../../shared/report.model';

// Attendance Report Row
export interface AttendanceReportRow extends ReportRow {
    employeeId: string;
    employeeName: string;
    department: string;
    totalPresent: number;
    totalLate: number;
    totalAbsent: number;
    totalSick: number;
    totalPermitted: number;
    attendanceRate: number;
}

// Payroll Report Row
export interface PayrollReportRow extends ReportRow {
    employeeId: string;
    employeeName: string;
    department: string;
    baseSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
}

// Leave Report Row
export interface LeaveReportRow extends ReportRow {
    employeeId: string;
    employeeName: string;
    department: string;
    leaveType: string;
    daysTaken: number;
    daysRemaining: number;
    totalQuota: number;
    utilizationRate: number;
}

// Overtime Report Row
export interface OvertimeReportRow extends ReportRow {
    employeeId: string;
    employeeName: string;
    department: string;
    totalHours: number;
    overtimeRate: number;
    totalCost: number;
}

// Employee Report Row
export interface EmployeeReportRow extends ReportRow {
    employeeId: string;
    employeeName: string;
    department: string;
    position: string;
    gender: string;
    age: number;
    hireDate: Date;
    status: string;
}
