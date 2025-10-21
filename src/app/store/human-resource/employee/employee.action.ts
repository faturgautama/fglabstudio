import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";

export namespace EmployeeAction {
    export class AddEmployee {
        static readonly type = '[Employee] Add';
        constructor(public payload: EmployeeModel.IEmployee) { }
    }

    export class GetEmployee {
        static readonly type = '[Employee] Get All';
    }

    export class GetByIdEmployee {
        static readonly type = '[Employee] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdateEmployee {
        static readonly type = '[Employee] Update';
        constructor(public payload: EmployeeModel.IEmployee) { }
    }

    export class DeleteEmployee {
        static readonly type = '[Employee] Delete';
        constructor(public id: string) { }
    }
}