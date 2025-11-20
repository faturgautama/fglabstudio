// src/app/store/inventory/product/product.action.ts
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";

export namespace ProductAction {
    export class AddProduct {
        static readonly type = '[Inventory Product] Add';
        constructor(public payload: InventoryModel.Product) { }
    }

    export class GetProduct {
        static readonly type = '[Inventory Product] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetByIdProduct {
        static readonly type = '[Inventory Product] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdateProduct {
        static readonly type = '[Inventory Product] Update';
        constructor(public payload: InventoryModel.Product) { }
    }

    export class DeleteProduct {
        static readonly type = '[Inventory Product] Delete';
        constructor(public id: string) { }
    }

    export class GetLowStockProducts {
        static readonly type = '[Inventory Product] Get Low Stock';
    }

    export class SearchProducts {
        static readonly type = '[Inventory Product] Search';
        constructor(public keyword: string) { }
    }

    export class GenerateSKU {
        static readonly type = '[Inventory Product] Generate SKU';
        constructor(public categoryCode?: string) { }
    }

    export class UpdateStock {
        static readonly type = '[Inventory Product] Update Stock';
        constructor(public id: string, public quantity: number) { }
    }
}