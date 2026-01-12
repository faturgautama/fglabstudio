import { ProductState } from './product';
import { SolutionState } from './solution';
import { HR_APP_STATE } from './human-resource';
import { INVENTORY_APP_STATE } from './inventory';
import { POS_APP_STATE } from './point-of-sales';

export const STATE = [
    ProductState,
    SolutionState,
    ...HR_APP_STATE,
    ...INVENTORY_APP_STATE,
    ...POS_APP_STATE
]