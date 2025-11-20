// src/app/store/inventory/category/category.state.ts
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { CategoryAction } from "./category.action";
import { switchMap, tap } from "rxjs";
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";
import { CategoryService } from "../../../services/pages/application/inventory/category.service";

export interface CategoryStateModel {
    data: InventoryModel.Category[];
    single: InventoryModel.Category | null | undefined;
}

@State<CategoryStateModel>({
    name: 'inventoryCategory',
    defaults: {
        data: [],
        single: null
    },
})
@Injectable()
export class CategoryState implements NgxsOnInit {

    constructor(
        private _categoryService: CategoryService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new CategoryAction.GetCategory());
    }

    @Selector()
    static getAll(state: CategoryStateModel) {
        return state.data;
    }

    @Selector()
    static getSingle(state: CategoryStateModel) {
        return state.single;
    }

    @Action(CategoryAction.GetCategory)
    getCategory(ctx: StateContext<CategoryStateModel>, payload: any) {
        return this._categoryService
            .getAll(payload.filter, payload.sort)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        data: result
                    });
                }),
            )
    }

    @Action(CategoryAction.GetByIdCategory)
    getById(ctx: StateContext<CategoryStateModel>, payload: any) {
        return this._categoryService
            .getById(payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        single: result
                    })
                })
            )
    }

    @Action(CategoryAction.AddCategory)
    add(ctx: StateContext<CategoryStateModel>, payload: any) {
        return this._categoryService
            .add(payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new CategoryAction.GetCategory()))
            )
    }

    @Action(CategoryAction.UpdateCategory)
    update(ctx: StateContext<CategoryStateModel>, payload: any) {
        return this._categoryService
            .update(payload.payload.id, payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new CategoryAction.GetCategory()))
            )
    }

    @Action(CategoryAction.DeleteCategory)
    delete(ctx: StateContext<CategoryStateModel>, payload: any) {
        return this._categoryService
            .delete(payload.id)
            .pipe(
                switchMap(() => ctx.dispatch(new CategoryAction.GetCategory()))
            )
    }
}