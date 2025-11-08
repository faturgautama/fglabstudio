import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";

export namespace DepartementAction {
    export class AddDepartement {
        static readonly type = '[Departement] Add';
        constructor(public payload: EmployeeModel.IDepartment) { }
    }

    export class GetDepartement {
        static readonly type = '[Departement] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetByIdDepartement {
        static readonly type = '[Departement] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdateDepartement {
        static readonly type = '[Departement] Update';
        constructor(public payload: EmployeeModel.IDepartment) { }
    }

    export class DeleteDepartement {
        static readonly type = '[Departement] Delete';
        constructor(public id: string) { }
    }
}

