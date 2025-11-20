// src/app/store/inventory/company-setting/company-setting.action.ts
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";

export namespace CompanySettingAction {
    export class AddCompanySetting {
        static readonly type = '[Inventory CompanySetting] Add';
        constructor(public payload: InventoryModel.Company) { }
    }

    export class GetCompanySetting {
        static readonly type = '[Inventory CompanySetting] Get';
    }

    export class UpdateCompanySetting {
        static readonly type = '[Inventory CompanySetting] Update';
        constructor(public payload: InventoryModel.Company) { }
    }
}
