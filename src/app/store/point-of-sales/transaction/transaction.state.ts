import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { POSTransactionAction } from './transaction.action';
import { tap, catchError, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { POSModel } from '../../../model/pages/application/point-of-sales/pos.model';
import { POSTransactionService } from '../../../services/pages/application/point-of-sales/pos-transaction.service';

export interface TodaySummary {
    total_sales: number;
    total_transactions: number;
    cash_sales: number;
    non_cash_sales: number;
}

export interface TopProduct {
    product_id: number;
    product_name: string;
    total_qty: number;
    total_sales: number;
}

export interface POSTransactionStateModel {
    data: POSModel.Transaction[];
    single: any | null;
    todaySummary: TodaySummary | null;
    topProducts: TopProduct[];
    loading: boolean;
    error: string | null;
}

@State<POSTransactionStateModel>({
    name: 'posTransaction',
    defaults: {
        data: [],
        single: null,
        todaySummary: null,
        topProducts: [],
        loading: false,
        error: null
    }
})
@Injectable()
export class POSTransactionState implements NgxsOnInit {

    constructor(private _transactionService: POSTransactionService) { }

    ngxsOnInit(ctx: StateContext<POSTransactionStateModel>): void {
        ctx.dispatch(new POSTransactionAction.GetTodaySummary());
        ctx.dispatch(new POSTransactionAction.GetTopProducts());
    }

    @Selector()
    static getAll(state: POSTransactionStateModel) {
        return state.data;
    }

    @Selector()
    static getSingle(state: POSTransactionStateModel) {
        return state.single;
    }

    @Selector()
    static getTodaySummary(state: POSTransactionStateModel) {
        return state.todaySummary;
    }

    @Selector()
    static getTopProducts(state: POSTransactionStateModel) {
        return state.topProducts;
    }

    @Selector()
    static isLoading(state: POSTransactionStateModel) {
        return state.loading;
    }

    @Selector()
    static getError(state: POSTransactionStateModel) {
        return state.error;
    }

    @Action(POSTransactionAction.GetTransaction)
    getTransaction(ctx: StateContext<POSTransactionStateModel>, action: POSTransactionAction.GetTransaction) {
        const state = ctx.getState();
        ctx.setState({ ...state, loading: true, error: null });

        return this._transactionService.getAll(action.filter, action.sort).pipe(
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
                    error: err?.message || 'Gagal memuat data transaksi'
                });
                return of(null);
            })
        );
    }

    @Action(POSTransactionAction.GetByIdTransaction)
    getById(ctx: StateContext<POSTransactionStateModel>, action: POSTransactionAction.GetByIdTransaction) {
        const state = ctx.getState();
        ctx.setState({ ...state, loading: true, error: null });

        return this._transactionService.getTransactionWithItems(action.id).pipe(
            tap((result) => {
                ctx.setState({
                    ...ctx.getState(),
                    single: result,
                    loading: false,
                    error: null
                });
            }),
            catchError((err: any) => {
                ctx.setState({
                    ...ctx.getState(),
                    loading: false,
                    error: err?.message || 'Gagal memuat detail transaksi'
                });
                return of(null);
            })
        );
    }

    @Action(POSTransactionAction.AddTransaction)
    addTransaction(ctx: StateContext<POSTransactionStateModel>, action: POSTransactionAction.AddTransaction) {
        const state = ctx.getState();
        ctx.setState({ ...state, loading: true, error: null });

        return this._transactionService.createTransaction(action.transaction, action.items).pipe(
            switchMap(() => {
                return ctx.dispatch([
                    new POSTransactionAction.GetTransaction(),
                    new POSTransactionAction.GetTodaySummary(),
                    new POSTransactionAction.GetTopProducts()
                ]);
            }),
            catchError((err: any) => {
                ctx.setState({
                    ...ctx.getState(),
                    loading: false,
                    error: err?.message || 'Gagal menyimpan transaksi'
                });
                return of(null);
            })
        );
    }

    @Action(POSTransactionAction.GetTodaySummary)
    getTodaySummary(ctx: StateContext<POSTransactionStateModel>) {
        return this._transactionService.getTodaySummary().pipe(
            tap((result) => {
                ctx.setState({
                    ...ctx.getState(),
                    todaySummary: result
                });
            }),
            catchError(() => of(null))
        );
    }

    @Action(POSTransactionAction.GetTopProducts)
    getTopProducts(ctx: StateContext<POSTransactionStateModel>, action: POSTransactionAction.GetTopProducts) {
        return this._transactionService.getTopProducts(action.limit).pipe(
            tap((result) => {
                ctx.setState({
                    ...ctx.getState(),
                    topProducts: result
                });
            }),
            catchError(() => of(null))
        );
    }

    @Action(POSTransactionAction.GetByDateRange)
    getByDateRange(ctx: StateContext<POSTransactionStateModel>, action: POSTransactionAction.GetByDateRange) {
        const state = ctx.getState();
        ctx.setState({ ...state, loading: true, error: null });

        return this._transactionService.getByDateRange(action.startDate, action.endDate).pipe(
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
                    error: err?.message || 'Gagal memuat data transaksi'
                });
                return of(null);
            })
        );
    }

    @Action(POSTransactionAction.GetByCashier)
    getByCashier(ctx: StateContext<POSTransactionStateModel>, action: POSTransactionAction.GetByCashier) {
        const state = ctx.getState();
        ctx.setState({ ...state, loading: true, error: null });

        return this._transactionService.getByCashier(action.cashierId).pipe(
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
                    error: err?.message || 'Gagal memuat data transaksi'
                });
                return of(null);
            })
        );
    }
}
