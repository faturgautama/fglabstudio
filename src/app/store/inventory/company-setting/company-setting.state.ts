// src/app/store/inventory/company-setting/company-setting.state.ts
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { CompanySettingAction } from "./company-setting.action";
import { switchMap, tap } from "rxjs";
import { InventoryModel } from "../../../model/pages/application/inventory/inventory.model";
import { CompanySettingInventoryService } from "../../../services/pages/application/inventory/company-setting.service";

export interface CompanySettingStateModel {
    single: InventoryModel.Company | null | undefined;
}

@State<CompanySettingStateModel>({
    name: 'inventoryCompanySetting',
    defaults: {
        single: null
    },
})
@Injectable()
export class CompanySettingState implements NgxsOnInit {

    constructor(
        private _companySettingService: CompanySettingInventoryService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new CompanySettingAction.GetCompanySetting());
    }

    @Selector()
    static getSingle(state: CompanySettingStateModel) {
        return state.single;
    }

    @Action(CompanySettingAction.GetCompanySetting)
    get(ctx: StateContext<CompanySettingStateModel>) {
        return this._companySettingService
            .getAll()
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        single: result && result.length > 0 ? result[0] : null
                    });
                }),
            )
    }

    @Action(CompanySettingAction.AddCompanySetting)
    add(ctx: StateContext<CompanySettingStateModel>, payload: any) {
        return this._companySettingService
            .add(payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new CompanySettingAction.GetCompanySetting()))
            )
    }

    @Action(CompanySettingAction.UpdateCompanySetting)
    update(ctx: StateContext<CompanySettingStateModel>, payload: any) {
        return this._companySettingService
            .update(payload.payload.id, payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new CompanySettingAction.GetCompanySetting()))
            )
    }
}
