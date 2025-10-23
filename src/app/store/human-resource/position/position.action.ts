import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";

export namespace PositionAction {
    export class AddPosition {
        static readonly type = '[Position] Add';
        constructor(public payload: EmployeeModel.IPosition) { }
    }

    export class GetPosition {
        static readonly type = '[Position] Get All';
    }

    export class GetByIdPosition {
        static readonly type = '[Position] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdatePosition {
        static readonly type = '[Position] Update';
        constructor(public payload: EmployeeModel.IPosition) { }
    }

    export class DeletePosition {
        static readonly type = '[Position] Delete';
        constructor(public id: string) { }
    }
}

