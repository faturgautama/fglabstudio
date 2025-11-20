// src/app/store/inventory/supplier/supplier.state.ts
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { SupplierAction } from "./supplier.action";
import { switchMap, tap } from "rxjs";
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";
import { SupplierService } from "../../../services/pages/application/inventory/supplier.service";

export interface SupplierStateModel {
    data: InventoryModel.Supplier[];
    single: InventoryModel.Supplier | null | undefined;
    activeSuppliers: InventoryModel.Supplier[];
    supplierPerformance: any | null;
    generatedCode: string | null;
}

@State<SupplierStateModel>({
    name: 'inventorySupplier',
    defaults: {
        data: [],
        single: null,
        activeSuppliers: [],
        supplierPerformance: null,
        generatedCode: null
    },
})
@Injectable()
export class SupplierState implements NgxsOnInit {

    constructor(
        private _supplierService: SupplierService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new SupplierAction.GetSupplier());
        ctx.dispatch(new SupplierAction.GetActiveSuppliers());
    }

    @Selector()
    static getAll(state: SupplierStateModel) {
        return state.data;
    }

    @Selector()
    static getSingle(state: SupplierStateModel) {
        return state.single;
    }

    @Selector()
    static getActiveSuppliers(state: SupplierStateModel) {
        return state.activeSuppliers;
    }

    @Selector()
    static getSupplierPerformance(state: SupplierStateModel) {
        return state.supplierPerformance;
    }

    @Selector()
    static getGeneratedCode(state: SupplierStateModel) {
        return state.generatedCode;
    }

    @Action(SupplierAction.GetSupplier)
    getSupplier(ctx: StateContext<SupplierStateModel>, payload: any) {
        return this._supplierService
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

    @Action(SupplierAction.GetByIdSupplier)
    getById(ctx: StateContext<SupplierStateModel>, payload: any) {
        return this._supplierService
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

    @Action(SupplierAction.AddSupplier)
    add(ctx: StateContext<SupplierStateModel>, payload: any) {
        return this._supplierService
            .add(payload.payload)
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new SupplierAction.GetSupplier(),
                        new SupplierAction.GetActiveSuppliers()
                    ]);
                })
            );
    }

    @Action(SupplierAction.UpdateSupplier)
    update(ctx: StateContext<SupplierStateModel>, payload: any) {
        return this._supplierService
            .update(payload.payload.id, payload.payload)
            .pipe(
                switchMap(() => {
                    return ctx.dispatch([
                        new SupplierAction.GetSupplier(),
                        new SupplierAction.GetActiveSuppliers()
                    ]);
                })
            );
    }

    @Action(SupplierAction.DeleteSupplier)
    delete(ctx: StateContext<SupplierStateModel>, payload: any) {
        return this._supplierService
            .delete(payload.id)
            .pipe(
                switchMap(() => ctx.dispatch(new SupplierAction.GetSupplier()))
            );
    }

    @Action(SupplierAction.GetActiveSuppliers)
    getActiveSuppliers(ctx: StateContext<SupplierStateModel>) {
        return this._supplierService
            .getActiveSuppliers()
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        activeSuppliers: result
                    });
                })
            );
    }

    @Action(SupplierAction.GetSupplierPerformance)
    getPerformance(ctx: StateContext<SupplierStateModel>, payload: any) {
        return this._supplierService
            .getSupplierPerformance(payload.supplier_id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        supplierPerformance: result
                    });
                })
            );
    }

    @Action(SupplierAction.GenerateSupplierCode)
    generateCode(ctx: StateContext<SupplierStateModel>) {
        return this._supplierService
            .generateSupplierCode()
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        generatedCode: result
                    });
                })
            );
    }
}