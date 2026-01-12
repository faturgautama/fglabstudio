export namespace POSShiftAction {
    export class GetShift {
        static readonly type = '[POS Shift] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class OpenShift {
        static readonly type = '[POS Shift] Open';
        constructor(public cashierId: number, public initialCash: number) { }
    }

    export class CloseShift {
        static readonly type = '[POS Shift] Close';
        constructor(public shiftId: number, public actualCash: number) { }
    }

    export class GetActiveShift {
        static readonly type = '[POS Shift] Get Active';
        constructor(public cashierId: number) { }
    }

    export class GetShiftSummary {
        static readonly type = '[POS Shift] Get Summary';
        constructor(public shiftId: number) { }
    }

    export class ClearActiveShift {
        static readonly type = '[POS Shift] Clear Active';
    }
}

export class LoadActiveShifts {
    static readonly type = '[POS Shift] Load Active Shifts';
}
