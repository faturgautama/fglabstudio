import { ProductState } from './product';
import { SolutionState } from './solution';
import { HR_APP_STATE } from './human-resource';

export const STATE = [
    ProductState,
    SolutionState,
    ...HR_APP_STATE
]