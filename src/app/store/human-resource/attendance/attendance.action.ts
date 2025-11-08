import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";

export namespace AttendanceAction {
    export class AddAttendance {
        static readonly type = '[Attendance] Add';
        constructor(public payload: EmployeeModel.IAttendance) { }
    }

    export class BulkAddAttendance {
        static readonly type = '[Attendance] Bulk Add';
        constructor(public payload: EmployeeModel.IAttendance[]) { }
    }

    export class GetAttendance {
        static readonly type = '[Attendance] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetByIdAttendance {
        static readonly type = '[Attendance] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdateAttendance {
        static readonly type = '[Attendance] Update';
        constructor(public payload: EmployeeModel.IAttendance) { }
    }

    export class DeleteAttendance {
        static readonly type = '[Attendance] Delete';
        constructor(public id: string) { }
    }
}

