// src/app/store/point-of-sales/index.ts
import { POSSettingState } from "./setting";
import { POSTransactionState } from "./transaction";
import { POSShiftState } from "./shift";

export const POS_APP_STATE = [
    POSSettingState,
    POSTransactionState,
    POSShiftState
];

// Export all actions & states
export * from './setting';
export * from './transaction';
export * from './shift';
