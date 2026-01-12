import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { POSShiftAction } from './shift.action';
import { tap, catchError, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { POSModel } from '../../../model/pages/application/point-of-sales/pos.model';
import { POSShiftService } from '../../../services/pages/application/point-of-sales/pos-shift.service';

export interface ShiftSummary {
    total_sales: number;
    total_transactions: number;
    cash_sales: number;
    non_cash_sales: number;
}

export interface POSShiftStateModel {
    data: POSModel.Shift[];
    activeShift: POSModel.Shift | null;
    shiftSummary: ShiftSummary | null;
    loading: boolean;
    error: string | null;
}

@State<POSShiftStateModel>({
    name: 'posShift',
    defaults: {
        data: [],
        activeShift: null,
        shiftSummary: null,
        loading: false,
        error: null
    }
})
@Injectable()
export class POSShiftState implements NgxsOnInit {

    constructor(private _shiftService: POSShiftService) { }

    ngxsOnInit(ctx: StateContext<POSShiftStateModel>): void {
        // Load all shifts on init to check for active shifts
        ctx.dispatch(new POSShiftAction.LoadActiveShifts());
    }

    @Selector()
    static getAll(state: POSShiftStateModel) {
        return state.data;
    }

    @Selector()
    static getActiveShift(state: POSShiftStateModel) {
        return state.activeShift;
    }

    @Selector()
    static getShiftSummary(state: POSShiftStateModel) {
        return state.shiftSummary;
    }

    @Selector()
    static isLoading(state: POSShiftStateModel) {
        return state.loading;
    }

    @Selector()
    static getError(state: POSShiftStateModel) {
        return state.error;
    }

    @Action(POSShiftAction.GetShift)
    getShift(ctx: StateContext<POSShiftStateModel>, action: POSShiftAction.GetShift) {
        const state = ctx.getState();
        ctx.setState({ ...state, loading: true, error: null });

        return this._shiftService.getAll(action.filter, action.sort).pipe(
            tap((result) => {
                ctx.setState({
                    ...ctx.getState(),
                    data: result,
                    loading: false,
                    error: null
                });
            }),
            catchError((err: any) => {
                ctx.setState({
                    ...ctx.getState(),
                    loading: false,
                    error: err?.message || 'Gagal memuat data shift'
                });
                return of(null);
            })
        );
    }

    @Action(POSShiftAction.OpenShift)
    openShift(ctx: StateContext<POSShiftStateModel>, action: POSShiftAction.OpenShift) {
        const state = ctx.getState();
        ctx.setState({ ...state, loading: true, error: null });

        return this._shiftService.openShift(action.cashierId, action.initialCash).pipe(
            tap((result) => {
                ctx.setState({
                    ...ctx.getState(),
                    activeShift: result,
                    loading: false,
                    error: null
                });
            }),
            catchError((err: any) => {
                ctx.setState({
                    ...ctx.getState(),
                    loading: false,
                    error: err?.message || 'Gagal membuka shift'
                });
                return of(null);
            })
        );
    }

    @Action(POSShiftAction.CloseShift)
    closeShift(ctx: StateContext<POSShiftStateModel>, action: POSShiftAction.CloseShift) {
        const state = ctx.getState();
        ctx.setState({ ...state, loading: true, error: null });

        return this._shiftService.closeShift(action.shiftId, action.actualCash).pipe(
            tap(() => {
                ctx.setState({
                    ...ctx.getState(),
                    activeShift: null,
                    shiftSummary: null,
                    loading: false,
                    error: null
                });
            }),
            switchMap(() => ctx.dispatch(new POSShiftAction.GetShift())),
            catchError((err: any) => {
                ctx.setState({
                    ...ctx.getState(),
                    loading: false,
                    error: err?.message || 'Gagal menutup shift'
                });
                return of(null);
            })
        );
    }

    @Action(POSShiftAction.GetActiveShift)
    getActiveShift(ctx: StateContext<POSShiftStateModel>, action: POSShiftAction.GetActiveShift) {
        const state = ctx.getState();
        ctx.setState({ ...state, loading: true, error: null });

        return this._shiftService.getActiveShift(action.cashierId).pipe(
            tap((result) => {
                ctx.setState({
                    ...ctx.getState(),
                    activeShift: result,
                    loading: false,
                    error: null
                });
            }),
            catchError((err: any) => {
                ctx.setState({
                    ...ctx.getState(),
                    loading: false,
                    error: err?.message || 'Gagal memuat shift aktif'
                });
                return of(null);
            })
        );
    }

    @Action(POSShiftAction.GetShiftSummary)
    getShiftSummary(ctx: StateContext<POSShiftStateModel>, action: POSShiftAction.GetShiftSummary) {
        return this._shiftService.getShiftSummary(action.shiftId).pipe(
            tap((result) => {
                ctx.setState({
                    ...ctx.getState(),
                    shiftSummary: result
                });
            }),
            catchError(() => of(null))
        );
    }

    @Action(POSShiftAction.ClearActiveShift)
    clearActiveShift(ctx: StateContext<POSShiftStateModel>) {
        ctx.setState({
            ...ctx.getState(),
            activeShift: null,
            shiftSummary: null
        });
    }

    @Action(POSShiftAction.LoadActiveShifts)
    loadActiveShifts(ctx: StateContext<POSShiftStateModel>) {
        return this._shiftService.getAllActiveShifts().pipe(
            tap((shifts) => {
                // If there are active shifts, set the first one as active
                // (In a real scenario, you might want to match by cashier or show a selection dialog)
                if (shifts && shifts.length > 0) {
                    ctx.setState({
                        ...ctx.getState(),
                        data: shifts,
                        activeShift: shifts[0] // Set first active shift
                    });
                }
            }),
            catchError(() => of(null))
        );
    }
}
