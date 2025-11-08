import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";

export namespace OvertimeAction {
    export class AddOvertime {
        static readonly type = '[Overtime] Add';
        constructor(public payload: EmployeeModel.IOvertime) { }
    }

    export class GetOvertime {
        static readonly type = '[Overtime] Get All';
    }

    export class GetByIdOvertime {
        static readonly type = '[Overtime] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdateOvertime {
        static readonly type = '[Overtime] Update';
        constructor(public payload: EmployeeModel.IOvertime) { }
    }

    export class DeleteOvertime {
        static readonly type = '[Overtime] Delete';
        constructor(public id: string) { }
    }

    export class UpdateOvertimeStatus {
        static readonly type = '[Overtime] Update Status';
        constructor(public id: string, public status: 'pending' | 'approved' | 'rejected') { }
    }
}

