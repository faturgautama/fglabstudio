// src/app/store/inventory/category/category.action.ts
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";

export namespace CategoryAction {
    export class AddCategory {
        static readonly type = '[Inventory Category] Add';
        constructor(public payload: InventoryModel.Category) { }
    }

    export class GetCategory {
        static readonly type = '[Inventory Category] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetByIdCategory {
        static readonly type = '[Inventory Category] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdateCategory {
        static readonly type = '[Inventory Category] Update';
        constructor(public payload: InventoryModel.Category) { }
    }

    export class DeleteCategory {
        static readonly type = '[Inventory Category] Delete';
        constructor(public id: string) { }
    }
}