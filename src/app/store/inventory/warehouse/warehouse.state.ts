// src/app/store/inventory/warehouse/warehouse.state.ts
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { WarehouseAction } from "./warehouse.action";
import { switchMap, tap } from "rxjs";
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";
import { WarehouseService } from "../../../services/pages/application/inventory/warehouse.service";

export interface WarehouseStateModel {
    data: InventoryModel.Warehouse[];
    single: InventoryModel.Warehouse | null | undefined;
    defaultWarehouse: InventoryModel.Warehouse | null | undefined;
}

@State<WarehouseStateModel>({
    name: 'inventoryWarehouse',
    defaults: {
        data: [],
        single: null,
        defaultWarehouse: null
    },
})
@Injectable()
export class WarehouseState implements NgxsOnInit {

    constructor(
        private _warehouseService: WarehouseService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new WarehouseAction.GetWarehouse());
        ctx.dispatch(new WarehouseAction.GetDefaultWarehouse());
    }

    @Selector()
    static getAll(state: WarehouseStateModel) {
        return state.data;
    }

    @Selector()
    static getSingle(state: WarehouseStateModel) {
        return state.single;
    }

    @Selector()
    static getDefaultWarehouse(state: WarehouseStateModel) {
        return state.defaultWarehouse;
    }

    @Action(WarehouseAction.GetWarehouse)
    getWarehouse(ctx: StateContext<WarehouseStateModel>, payload: any) {
        return this._warehouseService
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

    @Action(WarehouseAction.GetByIdWarehouse)
    getById(ctx: StateContext<WarehouseStateModel>, payload: any) {
        return this._warehouseService
            .getById(payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        single: result
                    });
                })
            );
    }

    @Action(WarehouseAction.AddWarehouse)
    add(ctx: StateContext<WarehouseStateModel>, payload: any) {
        return this._warehouseService
            .add(payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new WarehouseAction.GetWarehouse()))
            );
    }

    @Action(WarehouseAction.UpdateWarehouse)
    update(ctx: StateContext<WarehouseStateModel>, payload: any) {
        return this._warehouseService
            .update(payload.payload.id, payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new WarehouseAction.GetWarehouse()))
            );
    }

    @Action(WarehouseAction.DeleteWarehouse)
    delete(ctx: StateContext<WarehouseStateModel>, payload: any) {
        return this._warehouseService
            .delete(payload.id)
            .pipe(
                switchMap(() => ctx.dispatch(new WarehouseAction.GetWarehouse()))
            );
    }

    @Action(WarehouseAction.GetDefaultWarehouse)
    getDefaultWarehouse(ctx: StateContext<WarehouseStateModel>) {
        return this._warehouseService
            .getDefaultWarehouse()
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        defaultWarehouse: result
                    });
                })
            );
    }

    @Action(WarehouseAction.SetAsDefault)
    setAsDefault(ctx: StateContext<WarehouseStateModel>, payload: any) {
        return this._warehouseService
            .setAsDefault(Number(payload.id))
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new WarehouseAction.GetWarehouse(),
                        new WarehouseAction.GetDefaultWarehouse()
                    ]);
                })
            );
    }
}