// src/app/store/inventory/stock-opname/stock-opname.action.ts
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";

export namespace StockOpnameAction {
    export class AddStockOpname {
        static readonly type = '[Inventory StockOpname] Add';
        constructor(
            public opname: Omit<InventoryModel.StockOpname, 'id' | 'created_at'>,
            public items: Omit<InventoryModel.StockOpnameItem, 'id' | 'stock_opname_id'>[]
        ) { }
    }

    export class GetStockOpname {
        static readonly type = '[Inventory StockOpname] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetByIdStockOpname {
        static readonly type = '[Inventory StockOpname] Get By Id';
        constructor(public id: string) { }
    }

    export class GetStockOpnameWithItems {
        static readonly type = '[Inventory StockOpname] Get With Items';
        constructor(public id: string) { }
    }

    export class UpdateStockOpname {
        static readonly type = '[Inventory StockOpname] Update';
        constructor(public payload: InventoryModel.StockOpname) { }
    }

    export class DeleteStockOpname {
        static readonly type = '[Inventory StockOpname] Delete';
        constructor(public id: string) { }
    }

    export class UpdateOpnameItem {
        static readonly type = '[Inventory StockOpname] Update Item';
        constructor(
            public item_id: string,
            public physical_stock: number,
            public notes?: string
        ) { }
    }

    export class ApproveStockOpname {
        static readonly type = '[Inventory StockOpname] Approve';
        constructor(public opname_id: string, public approved_by: string) { }
    }

    export class CompleteStockOpname {
        static readonly type = '[Inventory StockOpname] Complete';
        constructor(public opname_id: string) { }
    }

    export class GenerateOpnameNumber {
        static readonly type = '[Inventory StockOpname] Generate Number';
    }

    export class GetProductsForOpname {
        static readonly type = '[Inventory StockOpname] Get Products For Opname';
        constructor(public warehouse_id?: string) { }
    }

    export class GetOpnameSummary {
        static readonly type = '[Inventory StockOpname] Get Summary';
    }
}