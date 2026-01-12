import { POSModel } from '../../../model/pages/application/point-of-sales/pos.model';

export namespace POSSettingAction {
    export class GetSetting {
        static readonly type = '[POS Setting] Get';
    }

    export class AddSetting {
        static readonly type = '[POS Setting] Add';
        constructor(public payload: POSModel.Setting) { }
    }

    export class UpdateSetting {
        static readonly type = '[POS Setting] Update';
        constructor(public payload: POSModel.Setting) { }
    }

    export class InitializeSetting {
        static readonly type = '[POS Setting] Initialize';
    }
}
