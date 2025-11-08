import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";

export namespace CompanySettingAction {
    export class AddCompanySetting {
        static readonly type = '[CompanySetting] Add';
        constructor(public payload: EmployeeModel.IHumanResourceSetting) { }
    }

    export class GetCompanySetting {
        static readonly type = '[CompanySetting] Get All';
    }

    export class GetByIdCompanySetting {
        static readonly type = '[CompanySetting] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdateCompanySetting {
        static readonly type = '[CompanySetting] Update';
        constructor(public payload: EmployeeModel.IHumanResourceSetting) { }
    }

    export class DeleteCompanySetting {
        static readonly type = '[CompanySetting] Delete';
        constructor(public id: string) { }
    }
}

