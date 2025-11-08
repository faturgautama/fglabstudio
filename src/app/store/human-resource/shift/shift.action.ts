import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";

export namespace ShiftAction {
    export class AddShift {
        static readonly type = '[Shift] Add';
        constructor(public payload: EmployeeModel.IShift) { }
    }

    export class GetShift {
        static readonly type = '[Shift] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetByIdShift {
        static readonly type = '[Shift] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdateShift {
        static readonly type = '[Shift] Update';
        constructor(public payload: EmployeeModel.IShift) { }
    }

    export class DeleteShift {
        static readonly type = '[Shift] Delete';
        constructor(public id: string) { }
    }
}

