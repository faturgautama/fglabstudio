// src/app/store/inventory/stock-movement/stock-movement.state.ts
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { StockMovementAction } from "./stock-movement.action";
import { switchMap, tap } from "rxjs";
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";
import { StockMovementService } from "../../../services/pages/application/inventory/stock-movement.service";
import { ProductAction } from "../product/product.action";
import { StockCardAction } from "../stock-card/stock-card.action";

export interface StockMovementStateModel {
    data: InventoryModel.StockMovement[];
    single: InventoryModel.StockMovement | null | undefined;
    generatedMovementNumber: string | null;
    loading: boolean;
}

@State<StockMovementStateModel>({
    name: 'inventoryStockMovement',
    defaults: {
        data: [],
        single: null,
        generatedMovementNumber: null,
        loading: false
    },
})
@Injectable()
export class StockMovementState implements NgxsOnInit {

    constructor(
        private _stockMovementService: StockMovementService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new StockMovementAction.GetStockMovement());
    }

    @Selector()
    static getAll(state: StockMovementStateModel) {
        return state.data;
    }

    @Selector()
    static getSingle(state: StockMovementStateModel) {
        return state.single;
    }

    @Selector()
    static getGeneratedMovementNumber(state: StockMovementStateModel) {
        return state.generatedMovementNumber;
    }

    @Selector()
    static isLoading(state: StockMovementStateModel) {
        return state.loading;
    }

    @Action(StockMovementAction.GetStockMovement)
    getStockMovement(ctx: StateContext<StockMovementStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockMovementService
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

    @Action(StockMovementAction.GetByIdStockMovement)
    getById(ctx: StateContext<StockMovementStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockMovementService
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

    @Action(StockMovementAction.AddStockMovement)
    add(ctx: StateContext<StockMovementStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockMovementService
            .createStockMovement(payload.payload)
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new StockMovementAction.GetStockMovement(),
                        new ProductAction.GetProduct(),
                        new ProductAction.GetLowStockProducts(),
                        new StockCardAction.GetStockCard()
                    ]);
                })
            );
    }

    @Action(StockMovementAction.UpdateStockMovement)
    update(ctx: StateContext<StockMovementStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockMovementService
            .update(payload.payload.id, payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new StockMovementAction.GetStockMovement()))
            );
    }

    @Action(StockMovementAction.DeleteStockMovement)
    delete(ctx: StateContext<StockMovementStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockMovementService
            .delete(payload.id)
            .pipe(
                switchMap(() => ctx.dispatch(new StockMovementAction.GetStockMovement()))
            );
    }

    @Action(StockMovementAction.AdjustStock)
    adjustStock(ctx: StateContext<StockMovementStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._stockMovementService
            .adjustStock(
                payload.product_id,
                payload.warehouse_id,
                payload.new_quantity,
                payload.reason,
                payload.notes
            )
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new StockMovementAction.GetStockMovement(),
                        new ProductAction.GetProduct(),
                        new ProductAction.GetLowStockProducts(),
                        new StockCardAction.GetStockCard()
                    ]);
                })
            );
    }

    @Action(StockMovementAction.GenerateMovementNumber)
    generateMovementNumber(ctx: StateContext<StockMovementStateModel>, payload: any) {
        return this._stockMovementService
            .generateMovementNumber(payload.type)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        generatedMovementNumber: result
                    });
                })
            );
    }
}