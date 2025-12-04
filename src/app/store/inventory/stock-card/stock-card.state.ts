// src/app/store/inventory/stock-card/stock-card.state.ts
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { StockCardAction } from "./stock-card.action";
import { switchMap, tap } from "rxjs";
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";
import { StockCardService } from "../../../services/pages/application/inventory/stock-card.service";
import { ProductAction } from "../product/product.action";

export interface StockCardStateModel {
    data: InventoryModel.StockCard[];
    productStockCards: InventoryModel.StockCard[];
    dateRangeMovements: InventoryModel.StockCard[];
}

@State<StockCardStateModel>({
    name: 'inventoryStockCard',
    defaults: {
        data: [],
        productStockCards: [],
        dateRangeMovements: []
    },
})
@Injectable()
export class StockCardState implements NgxsOnInit {

    constructor(
        private _stockCardService: StockCardService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new StockCardAction.GetStockCard());
    }

    @Selector()
    static getAll(state: StockCardStateModel) {
        return state.data;
    }

    @Selector()
    static getProductStockCards(state: StockCardStateModel) {
        return state.productStockCards;
    }

    @Selector()
    static getDateRangeMovements(state: StockCardStateModel) {
        return state.dateRangeMovements;
    }

    @Action(StockCardAction.GetStockCard)
    getStockCard(ctx: StateContext<StockCardStateModel>, payload: any) {
        return this._stockCardService
            .getAll(payload?.filter, payload?.sort)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        data: result
                    });
                }),
            );
    }

    @Action(StockCardAction.AddStockCard)
    add(ctx: StateContext<StockCardStateModel>, payload: any) {
        return this._stockCardService
            .addStockCard(
                payload.product_id,
                payload.warehouse_id,
                payload.type,
                payload.qty,
                payload.reference_type,
                payload.reference_id,
                payload.notes,
                payload.unit_cost
            )
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new StockCardAction.GetStockCard(),
                        new ProductAction.GetProduct(),
                        new ProductAction.GetLowStockProducts()
                    ]);
                })
            );
    }

    @Action(StockCardAction.GetStockCardsByProduct)
    getByProduct(ctx: StateContext<StockCardStateModel>, payload: any) {
        return this._stockCardService
            .getStockCardsByProduct(payload.product_id, payload.limit)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        productStockCards: result
                    });
                })
            );
    }

    @Action(StockCardAction.GetStockMovementsByDateRange)
    getByDateRange(ctx: StateContext<StockCardStateModel>, payload: any) {
        return this._stockCardService
            .getStockMovementsByDateRange(payload.start_date, payload.end_date)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        dateRangeMovements: result
                    });
                })
            );
    }
}