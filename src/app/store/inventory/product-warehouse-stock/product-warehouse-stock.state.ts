// src/app/store/inventory/product-warehouse-stock/product-warehouse-stock.state.ts
import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { ProductWarehouseStockAction } from './product-warehouse-stock.action';
import { tap } from 'rxjs';
import { InventoryModel } from '../../../model/pages/application/inventory/inventory.model';
import { ProductWarehouseStockService } from '../../../services/pages/application/inventory/product-warehouse-stock.service';

export interface ProductWarehouseStockStateModel {
    allStocks: any[];
    stockByWarehouse: any[];
    productStocks: any[];
    loading: boolean;
}

@State<ProductWarehouseStockStateModel>({
    name: 'inventoryProductWarehouseStock',
    defaults: {
        allStocks: [],
        stockByWarehouse: [],
        productStocks: [],
        loading: false
    }
})
@Injectable()
export class ProductWarehouseStockState implements NgxsOnInit {
    constructor(private productWarehouseStockService: ProductWarehouseStockService) { }

    ngxsOnInit(ctx: StateContext<ProductWarehouseStockStateModel>): void {
        ctx.dispatch(new ProductWarehouseStockAction.GetAllStocks());
    }

    @Selector()
    static getAllStocks(state: ProductWarehouseStockStateModel) {
        return state.allStocks;
    }

    @Selector()
    static getStockByWarehouse(state: ProductWarehouseStockStateModel) {
        return state.stockByWarehouse;
    }

    @Selector()
    static getProductStocks(state: ProductWarehouseStockStateModel) {
        return state.productStocks;
    }

    @Selector()
    static isLoading(state: ProductWarehouseStockStateModel) {
        return state.loading;
    }

    @Action(ProductWarehouseStockAction.GetAllStocks)
    getAllStocks(ctx: StateContext<ProductWarehouseStockStateModel>) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this.productWarehouseStockService.getAllStocks().then((result) => {
            const state = ctx.getState();
            ctx.setState({
                ...state,
                allStocks: result,
                loading: false
            });
            return result;
        });
    }

    @Action(ProductWarehouseStockAction.GetStockByWarehouse)
    getStockByWarehouse(ctx: StateContext<ProductWarehouseStockStateModel>, payload: ProductWarehouseStockAction.GetStockByWarehouse) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this.productWarehouseStockService.getStockByWarehouse(payload.warehouse_id).then((result) => {
            const state = ctx.getState();
            ctx.setState({
                ...state,
                stockByWarehouse: result,
                loading: false
            });
            return result;
        });
    }

    @Action(ProductWarehouseStockAction.GetProductStockInAllWarehouses)
    getProductStocksInAllWarehouses(ctx: StateContext<ProductWarehouseStockStateModel>, payload: ProductWarehouseStockAction.GetProductStockInAllWarehouses) {
        ctx.setState({ ...ctx.getState(), loading: true });

        return this.productWarehouseStockService.getProductStockInAllWarehouses(payload.product_id).then((result) => {
            const state = ctx.getState();
            ctx.setState({
                ...state,
                productStocks: result,
                loading: false
            });
            return result;
        });
    }

    @Action(ProductWarehouseStockAction.RecalculateStock)
    recalculateStock(ctx: StateContext<ProductWarehouseStockStateModel>, payload: ProductWarehouseStockAction.RecalculateStock) {
        return this.productWarehouseStockService.recalculateStock(payload.product_id, payload.warehouse_id);
    }

    @Action(ProductWarehouseStockAction.UpdateStockOnReceive)
    updateStockOnReceive(ctx: StateContext<ProductWarehouseStockStateModel>, payload: ProductWarehouseStockAction.UpdateStockOnReceive) {
        return this.productWarehouseStockService.updateStockOnReceive(
            payload.product_id,
            payload.warehouse_id,
            payload.quantity,
            payload.tracking_type
        );
    }

    @Action(ProductWarehouseStockAction.DecrementStockOnIssue)
    decrementStockOnIssue(ctx: StateContext<ProductWarehouseStockStateModel>, payload: ProductWarehouseStockAction.DecrementStockOnIssue) {
        return this.productWarehouseStockService.decrementStockOnIssue(
            payload.product_id,
            payload.warehouse_id,
            payload.quantity,
            payload.tracking_type
        );
    }
}
