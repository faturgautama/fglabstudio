import { AttendanceState } from "./attendance";
import { DepartementState } from "./departement";
import { EmployeeState } from "./employee";
import { PositionState } from "./position";
import { ShiftState } from "./shift";
import { CompanySettingState } from "./company-setting";

export const HR_APP_STATE = [
    DepartementState,
    PositionState,
    EmployeeState,
    ShiftState,
    AttendanceState,
    CompanySettingState
]