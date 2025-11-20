// src/app/store/inventory/stock-movement/stock-movement.action.ts
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";

export namespace StockMovementAction {
    export class AddStockMovement {
        static readonly type = '[Inventory Movement] Add';
        constructor(public payload: Omit<InventoryModel.StockMovement, 'id' | 'created_at'>) { }
    }

    export class GetStockMovement {
        static readonly type = '[Inventory Movement] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetByIdStockMovement {
        static readonly type = '[Inventory Movement] Get By Id';
        constructor(public id: string) { }
    }

    export class UpdateStockMovement {
        static readonly type = '[Inventory Movement] Update';
        constructor(public payload: InventoryModel.StockMovement) { }
    }

    export class DeleteStockMovement {
        static readonly type = '[Inventory Movement] Delete';
        constructor(public id: string) { }
    }

    export class AdjustStock {
        static readonly type = '[Inventory Movement] Adjust Stock';
        constructor(
            public product_id: string,
            public new_quantity: number,
            public reason: string,
            public notes?: string
        ) { }
    }

    export class GenerateMovementNumber {
        static readonly type = '[Inventory Movement] Generate Number';
        constructor(public type: string) { }
    }
}