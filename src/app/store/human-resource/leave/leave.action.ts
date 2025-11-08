import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";

export namespace LeaveAction {
    export class AddLeave {
        static readonly type = '[Leave] Add';
        constructor(public payload: EmployeeModel.ILeave) { }
    }

    export class GetLeave {
        static readonly type = '[Leave] Get All';
    }

    export class GetByIdLeave {
        static readonly type = '[Leave] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdateLeave {
        static readonly type = '[Leave] Update';
        constructor(public payload: EmployeeModel.ILeave) { }
    }

    export class DeleteLeave {
        static readonly type = '[Leave] Delete';
        constructor(public id: string) { }
    }

    export class UpdateLeaveStatus {
        static readonly type = '[Leave] Update Status';
        constructor(public id: string, public status: 'pending' | 'approved' | 'rejected' | 'cancelled') { }
    }
}

