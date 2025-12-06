// src/app/store/inventory/stock-card/stock-card.action.ts
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";

export namespace StockCardAction {
    export class AddStockCard {
        static readonly type = '[Inventory StockCard] Add';
        constructor(
            public product_id: string,
            public type: InventoryModel.StockCard['type'],
            public qty: number,
            public reference_type?: string,
            public reference_id?: string,
            public notes?: string,
            public unit_cost?: number
        ) { }
    }

    export class GetStockCard {
        static readonly type = '[Inventory StockCard] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetStockCardsByProduct {
        static readonly type = '[Inventory StockCard] Get By Product';
        constructor(public product_id: string, public limit?: number) { }
    }

    export class GetStockMovementsByDateRange {
        static readonly type = '[Inventory StockCard] Get By Date Range';
        constructor(public start_date: Date, public end_date: Date) { }
    }

    export class GetStockCardsByProductAndWarehouse {
        static readonly type = '[Inventory StockCard] Get By Product And Warehouse';
        constructor(public product_id: number, public warehouse_id: number) { }
    }

}