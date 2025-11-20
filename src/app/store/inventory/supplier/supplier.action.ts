// src/app/store/inventory/supplier/supplier.action.ts
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";

export namespace SupplierAction {
    export class AddSupplier {
        static readonly type = '[Inventory Supplier] Add';
        constructor(public payload: InventoryModel.Supplier) { }
    }

    export class GetSupplier {
        static readonly type = '[Inventory Supplier] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetByIdSupplier {
        static readonly type = '[Inventory Supplier] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdateSupplier {
        static readonly type = '[Inventory Supplier] Update';
        constructor(public payload: InventoryModel.Supplier) { }
    }

    export class DeleteSupplier {
        static readonly type = '[Inventory Supplier] Delete';
        constructor(public id: string) { }
    }

    export class GetActiveSuppliers {
        static readonly type = '[Inventory Supplier] Get Active';
    }

    export class GetSupplierPerformance {
        static readonly type = '[Inventory Supplier] Get Performance';
        constructor(public supplier_id: string) { }
    }

    export class GenerateSupplierCode {
        static readonly type = '[Inventory Supplier] Generate Code';
    }
}