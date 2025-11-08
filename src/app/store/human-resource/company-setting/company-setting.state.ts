import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { CompanySettingAction } from "./company-setting.action";
import { tap } from "rxjs";
import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";
import { CompanySettingService } from "../../../services/pages/application/human-resource/company-setting.service";

export interface CompanySettingStateModel {
    data: EmployeeModel.IHumanResourceSetting[];
    single: EmployeeModel.IHumanResourceSetting | null | undefined;
}

@State<CompanySettingStateModel>({
    name: 'companySetting',
    defaults: {
        data: [],
        single: null
    },
})
@Injectable()
export class CompanySettingState implements NgxsOnInit {

    constructor(
        private _companySettingService: CompanySettingService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new CompanySettingAction.GetCompanySetting());
    }

    @Selector()
    static getAll(state: CompanySettingStateModel) {
        return state.data;
    }

    @Selector()
    static getSingle(state: CompanySettingStateModel) {
        return state.single;
    }

    @Action(CompanySettingAction.GetCompanySetting)
    getCompanySetting(ctx: StateContext<CompanySettingStateModel>) {
        return this._companySettingService
            .getAll()
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

    @Action(CompanySettingAction.GetByIdCompanySetting)
    getById(ctx: StateContext<CompanySettingStateModel>, payload: any) {
        return this._companySettingService
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

    @Action(CompanySettingAction.AddCompanySetting)
    add(ctx: StateContext<CompanySettingStateModel>, payload: any) {
        return this._companySettingService
            .add(payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new CompanySettingAction.GetCompanySetting());
                })
            )
    }

    @Action(CompanySettingAction.UpdateCompanySetting)
    update(ctx: StateContext<CompanySettingStateModel>, payload: any) {
        return this._companySettingService
            .update(payload.payload.id, payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new CompanySettingAction.GetCompanySetting());
                })
            )
    }

    @Action(CompanySettingAction.DeleteCompanySetting)
    delete(ctx: StateContext<CompanySettingStateModel>, payload: any) {
        return this._companySettingService
            .delete(payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new CompanySettingAction.GetCompanySetting());
                })
            )
    }
}

