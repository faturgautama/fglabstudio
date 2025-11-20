// src/app/store/inventory/index.ts
import { CategoryState } from "./category";
import { ProductState } from "./product";
import { StockCardState } from "./stock-card";
import { SupplierState } from "./supplier";
import { PurchaseOrderState } from "./purchase-order";
import { StockMovementState } from "./stock-movement";
import { NotificationState } from "./notification";
import { WarehouseState } from "./warehouse";
import { StockOpnameState } from "./stock-opname";

export const INVENTORY_APP_STATE = [
    CategoryState,
    ProductState,
    StockCardState,
    SupplierState,
    PurchaseOrderState,
    StockMovementState,
    NotificationState,
    WarehouseState,
    StockOpnameState
];

// Export all actions & states
export * from './category';
export * from './product';
export * from './stock-card';
export * from './supplier';
export * from './purchase-order';
export * from './stock-movement';
export * from './notification';
export * from './warehouse';
export * from './stock-opname';