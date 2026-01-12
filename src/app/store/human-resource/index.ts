import { AttendanceState } from "./attendance";
import { DepartementState } from "./departement";
import { EmployeeState } from "./employee";
import { PositionState } from "./position";
import { ShiftState } from "./shift";
import { CompanySettingState } from "./company-setting";
import { LeaveState } from "./leave";
import { OvertimeState } from "./overtime";
import { PayrollState } from "./payroll";

export const HR_APP_STATE = [
    DepartementState,
    PositionState,
    EmployeeState,
    ShiftState,
    AttendanceState,
    CompanySettingState,
    LeaveState,
    OvertimeState,
    PayrollState
]

// Export all actions & states
export * from './attendance';
export * from './departement';
export * from './employee';
export * from './position';
export * from './shift';
export * from './company-setting';
export * from './leave';
export * from './overtime';
export * from './payroll';