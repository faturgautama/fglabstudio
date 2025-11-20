// src/app/store/inventory/purchase-order/purchase-order.state.ts
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { PurchaseOrderAction } from "./purchase-order.action";
import { switchMap, tap } from "rxjs";
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";
import { PurchaseOrderService } from "../../../services/pages/application/inventory/purchase-order.service";
import { ProductAction } from "../product/product.action";
import { StockCardAction } from "../stock-card/stock-card.action";

export interface PurchaseOrderStateModel {
    data: InventoryModel.PurchaseOrder[];
    single: any | null; // PO with items
    generatedPONumber: string | null;
    loading: boolean;
}

@State<PurchaseOrderStateModel>({
    name: 'inventoryPurchaseOrder',
    defaults: {
        data: [],
        single: null,
        generatedPONumber: null,
        loading: false
    },
})
@Injectable()
export class PurchaseOrderState implements NgxsOnInit {

    constructor(
        private _purchaseOrderService: PurchaseOrderService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new PurchaseOrderAction.GetPurchaseOrder());
    }

    @Selector()
    static getAll(state: PurchaseOrderStateModel) {
        return state.data;
    }

    @Selector()
    static getSingle(state: PurchaseOrderStateModel) {
        return state.single;
    }

    @Selector()
    static getGeneratedPONumber(state: PurchaseOrderStateModel) {
        return state.generatedPONumber;
    }

    @Selector()
    static isLoading(state: PurchaseOrderStateModel) {
        return state.loading;
    }

    @Action(PurchaseOrderAction.GetPurchaseOrder)
    getPurchaseOrder(ctx: StateContext<PurchaseOrderStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._purchaseOrderService
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

    @Action(PurchaseOrderAction.GetByIdPurchaseOrder)
    getById(ctx: StateContext<PurchaseOrderStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._purchaseOrderService
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

    @Action(PurchaseOrderAction.GetPurchaseOrderWithItems)
    getWithItems(ctx: StateContext<PurchaseOrderStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._purchaseOrderService
            .getPurchaseOrderWithItems(payload.id)
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

    @Action(PurchaseOrderAction.AddPurchaseOrder)
    add(ctx: StateContext<PurchaseOrderStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._purchaseOrderService
            .createPurchaseOrder(payload.po, payload.items)
            .pipe(
                switchMap(() => ctx.dispatch(new PurchaseOrderAction.GetPurchaseOrder()))
            );
    }

    @Action(PurchaseOrderAction.UpdatePurchaseOrder)
    update(ctx: StateContext<PurchaseOrderStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._purchaseOrderService
            .update(payload.payload.id, payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new PurchaseOrderAction.GetPurchaseOrder()))
            );
    }

    @Action(PurchaseOrderAction.DeletePurchaseOrder)
    delete(ctx: StateContext<PurchaseOrderStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._purchaseOrderService
            .delete(payload.id)
            .pipe(
                switchMap(() => ctx.dispatch(new PurchaseOrderAction.GetPurchaseOrder()))
            );
    }

    @Action(PurchaseOrderAction.ReceivePurchaseOrder)
    receive(ctx: StateContext<PurchaseOrderStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this._purchaseOrderService
            .receivePurchaseOrder(payload.po_id, payload.items)
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new PurchaseOrderAction.GetPurchaseOrder(),
                        new ProductAction.GetProduct(),
                        new ProductAction.GetLowStockProducts(),
                        new StockCardAction.GetStockCard()
                    ]);
                })
            );
    }

    @Action(PurchaseOrderAction.GeneratePONumber)
    generatePONumber(ctx: StateContext<PurchaseOrderStateModel>) {
        return this._purchaseOrderService
            .generatePONumber()
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        generatedPONumber: result
                    });
                })
            );
    }
}