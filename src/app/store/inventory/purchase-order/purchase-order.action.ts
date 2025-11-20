// src/app/store/inventory/purchase-order/purchase-order.action.ts
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";

export namespace PurchaseOrderAction {
    export class AddPurchaseOrder {
        static readonly type = '[Inventory PO] Add';
        constructor(
            public po: Omit<InventoryModel.PurchaseOrder, 'id' | 'created_at' | 'updated_at'>,
            public items: Omit<InventoryModel.PurchaseOrder, 'id' | 'purchase_order_id'>[]
        ) { }
    }

    export class GetPurchaseOrder {
        static readonly type = '[Inventory PO] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetByIdPurchaseOrder {
        static readonly type = '[Inventory PO] Get By Id';
        constructor(public id: string) { }
    }

    export class GetPurchaseOrderWithItems {
        static readonly type = '[Inventory PO] Get With Items';
        constructor(public id: string) { }
    }

    export class UpdatePurchaseOrder {
        static readonly type = '[Inventory PO] Update';
        constructor(public payload: InventoryModel.PurchaseOrder) { }
    }

    export class DeletePurchaseOrder {
        static readonly type = '[Inventory PO] Delete';
        constructor(public id: string) { }
    }

    export class ReceivePurchaseOrder {
        static readonly type = '[Inventory PO] Receive';
        constructor(
            public po_id: string,
            public items: Array<{ id: string; qty_received: number; batch_number?: string; expiry_date?: Date }>
        ) { }
    }

    export class GeneratePONumber {
        static readonly type = '[Inventory PO] Generate PO Number';
    }
}