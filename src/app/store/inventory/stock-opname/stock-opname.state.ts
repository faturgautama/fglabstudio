// src/app/store/inventory/stock-opname/stock-opname.state.ts
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { StockOpnameAction } from "./stock-opname.action";
import { switchMap, tap } from "rxjs";
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";
import { StockOpnameService } from "../../../services/pages/application/inventory/stock-opname.service";
import { ProductAction } from "../product/product.action";
import { StockCardAction } from "../stock-card/stock-card.action";

export interface StockOpnameStateModel {
    data: InventoryModel.StockOpname[];
    single: any | null; // Opname with items
    productsForOpname: any[];
    summary: any | null;
    generatedOpnameNumber: string | null;
    loading: boolean;
}

@State<StockOpnameStateModel>({
    name: 'inventoryStockOpname',
    defaults: {
        data: [],
        single: null,
        productsForOpname: [],
        summary: null,
        generatedOpnameNumber: null,
        loading: false
    },
})
@Injectable()
export class StockOpnameState implements NgxsOnInit {

    constructor(
        private _stockOpnameService: StockOpnameService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new StockOpnameAction.GetStockOpname());
        ctx.dispatch(new StockOpnameAction.GetOpnameSummary());
    }

    @Selector()
    static getAll(state: StockOpnameStateModel) {
        return state.data;
    }

    @Selector()
    static getSingle(state: StockOpnameStateModel) {
        return state.single;
    }

    @Selector()
    static getProductsForOpname(state: StockOpnameStateModel) {
        return state.productsForOpname;
    }

    @Selector()
    static getSummary(state: StockOpnameStateModel) {
        return state.summary;
    }

    @Selector()
    static getGeneratedOpnameNumber(state: StockOpnameStateModel) {
        return state.generatedOpnameNumber;
    }

    @Selector()
    static isLoading(state: StockOpnameStateModel) {
        return state.loading;
    }

    @Action(StockOpnameAction.GetStockOpname)
    getStockOpname(ctx: StateContext<StockOpnameStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockOpnameService
            .getAll(payload?.filter, payload?.sort)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        data: result,
                        loading: false
                    });
                }),
            );
    }

    @Action(StockOpnameAction.GetByIdStockOpname)
    getById(ctx: StateContext<StockOpnameStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockOpnameService
            .getById(payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        single: result,
                        loading: false
                    });
                })
            );
    }

    @Action(StockOpnameAction.GetStockOpnameWithItems)
    getWithItems(ctx: StateContext<StockOpnameStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockOpnameService
            .getStockOpnameWithItems(payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        single: result,
                        loading: false
                    });
                })
            );
    }

    @Action(StockOpnameAction.AddStockOpname)
    add(ctx: StateContext<StockOpnameStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockOpnameService
            .createStockOpname(payload.opname, payload.items)
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new StockOpnameAction.GetStockOpname(),
                        new StockOpnameAction.GetOpnameSummary()
                    ]);
                })
            );
    }

    @Action(StockOpnameAction.UpdateStockOpname)
    update(ctx: StateContext<StockOpnameStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockOpnameService
            .update(payload.payload.id, payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new StockOpnameAction.GetStockOpname()))
            );
    }

    @Action(StockOpnameAction.DeleteStockOpname)
    delete(ctx: StateContext<StockOpnameStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockOpnameService
            .delete(payload.id)
            .pipe(
                switchMap(() => ctx.dispatch(new StockOpnameAction.GetStockOpname()))
            );
    }

    @Action(StockOpnameAction.UpdateOpnameItem)
    updateItem(ctx: StateContext<StockOpnameStateModel>, payload: any) {
        return this._stockOpnameService
            .updateOpnameItem(payload.item_id, payload.physical_stock, payload.notes)
            .pipe(
                switchMap(() => {
                    // Reload current opname with items
                    const currentOpname = ctx.getState().single;
                    if (currentOpname?.id) {
                        return ctx.dispatch(new StockOpnameAction.GetStockOpnameWithItems(currentOpname.id.toString()));
                    }
                    return ctx.dispatch(new StockOpnameAction.GetStockOpname());
                })
            );
    }

    @Action(StockOpnameAction.ApproveStockOpname)
    approve(ctx: StateContext<StockOpnameStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockOpnameService
            .approveStockOpname(payload.opname_id, payload.approved_by)
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new StockOpnameAction.GetStockOpname(),
                        new StockOpnameAction.GetOpnameSummary(),
                        new ProductAction.GetProduct(),
                        new ProductAction.GetLowStockProducts(),
                        new StockCardAction.GetStockCard()
                    ]);
                })
            );
    }

    @Action(StockOpnameAction.CompleteStockOpname)
    complete(ctx: StateContext<StockOpnameStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockOpnameService
            .completeStockOpname(payload.opname_id)
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new StockOpnameAction.GetStockOpname(),
                        new StockOpnameAction.GetOpnameSummary()
                    ]);
                })
            );
    }

    @Action(StockOpnameAction.GenerateOpnameNumber)
    generateOpnameNumber(ctx: StateContext<StockOpnameStateModel>) {
        return this._stockOpnameService
            .generateOpnameNumber()
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        generatedOpnameNumber: result
                    });
                })
            );
    }

    @Action(StockOpnameAction.GetProductsForOpname)
    getProductsForOpname(ctx: StateContext<StockOpnameStateModel>, payload: any) {
        return this._stockOpnameService
            .getProductsForOpname(payload.warehouse_id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        productsForOpname: result
                    });
                })
            );
    }

    @Action(StockOpnameAction.GetOpnameSummary)
    getSummary(ctx: StateContext<StockOpnameStateModel>) {
        return this._stockOpnameService
            .getOpnameSummary()
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        summary: result
                    });
                })
            );
    }
}