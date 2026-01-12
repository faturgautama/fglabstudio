import { POSModel } from '../../../model/pages/application/point-of-sales/pos.model';

export namespace POSTransactionAction {
    export class GetTransaction {
        static readonly type = '[POS Transaction] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetByIdTransaction {
        static readonly type = '[POS Transaction] Get By Id';
        constructor(public id: number) { }
    }

    export class AddTransaction {
        static readonly type = '[POS Transaction] Add';
        constructor(public transaction: POSModel.Transaction, public items: POSModel.TransactionItem[]) { }
    }

    export class GetTodaySummary {
        static readonly type = '[POS Transaction] Get Today Summary';
    }

    export class GetTopProducts {
        static readonly type = '[POS Transaction] Get Top Products';
        constructor(public limit: number = 5) { }
    }

    export class GetByDateRange {
        static readonly type = '[POS Transaction] Get By Date Range';
        constructor(public startDate: Date, public endDate: Date) { }
    }

    export class GetByCashier {
        static readonly type = '[POS Transaction] Get By Cashier';
        constructor(public cashierId: number) { }
    }
}
