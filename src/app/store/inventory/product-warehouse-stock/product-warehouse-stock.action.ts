// src/app/store/inventory/product-warehouse-stock/product-warehouse-stock.action.ts
import { InventoryModel } from '../../../model/pages/application/inventory/inventory.model';

export namespace ProductWarehouseStockAction {
    export class GetAllStocks {
        static readonly type = '[Inventory ProductWarehouseStock] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetStockByWarehouse {
        static readonly type = '[Inventory ProductWarehouseStock] Get By Warehouse';
        constructor(public warehouse_id: number | string) { }
    }

    export class GetProductStockInAllWarehouses {
        static readonly type = '[Inventory ProductWarehouseStock] Get By Product';
        constructor(public product_id: number | string) { }
    }

    export class RecalculateStock {
        static readonly type = '[Inventory ProductWarehouseStock] Recalculate';
        constructor(public product_id: number | string, public warehouse_id: number | string) { }
    }

    export class UpdateStockOnReceive {
        static readonly type = '[Inventory ProductWarehouseStock] Update On Receive';
        constructor(
            public product_id: number | string,
            public warehouse_id: number | string,
            public quantity: number,
            public tracking_type: 'BATCH' | 'SERIAL' | 'GENERAL'
        ) { }
    }

    export class DecrementStockOnIssue {
        static readonly type = '[Inventory ProductWarehouseStock] Decrement On Issue';
        constructor(
            public product_id: number | string,
            public warehouse_id: number | string,
            public quantity: number,
            public tracking_type: 'BATCH' | 'SERIAL' | 'GENERAL'
        ) { }
    }
}
