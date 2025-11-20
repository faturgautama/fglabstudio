// src/app/store/inventory/warehouse/warehouse.action.ts
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";

export namespace WarehouseAction {
    export class AddWarehouse {
        static readonly type = '[Inventory Warehouse] Add';
        constructor(public payload: InventoryModel.Warehouse) { }
    }

    export class GetWarehouse {
        static readonly type = '[Inventory Warehouse] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetByIdWarehouse {
        static readonly type = '[Inventory Warehouse] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdateWarehouse {
        static readonly type = '[Inventory Warehouse] Update';
        constructor(public payload: InventoryModel.Warehouse) { }
    }

    export class DeleteWarehouse {
        static readonly type = '[Inventory Warehouse] Delete';
        constructor(public id: string) { }
    }

    export class GetDefaultWarehouse {
        static readonly type = '[Inventory Warehouse] Get Default';
    }

    export class SetAsDefault {
        static readonly type = '[Inventory Warehouse] Set As Default';
        constructor(public id: string) { }
    }
}