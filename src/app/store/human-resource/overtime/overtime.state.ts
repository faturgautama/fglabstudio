import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { OvertimeAction } from "./overtime.action";
import { tap } from "rxjs";
import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";
import { OvertimeService } from "../../../services/pages/application/human-resource/overtime.service";

export interface OvertimeStateModel {
    data: EmployeeModel.IOvertime[];
    single: EmployeeModel.IOvertime | null | undefined;
}

@State<OvertimeStateModel>({
    name: 'overtime',
    defaults: {
        data: [],
        single: null
    },
})
@Injectable()
export class OvertimeState implements NgxsOnInit {

    constructor(
        private _overtimeService: OvertimeService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new OvertimeAction.GetOvertime());
    }

    @Selector()
    static getAll(state: OvertimeStateModel) {
        return state.data;
    }

    @Selector()
    static getSingle(state: OvertimeStateModel) {
        return state.single;
    }

    @Action(OvertimeAction.GetOvertime)
    getOvertime(ctx: StateContext<OvertimeStateModel>, payload: any) {
        return this._overtimeService.getAll(payload.filter, payload.sort).pipe(
            tap((result) => {
                const state = ctx.getState();
                ctx.setState({
                    ...state,
                    data: result
                });
            })
        );
    }

    @Action(OvertimeAction.GetByIdOvertime)
    getById(ctx: StateContext<OvertimeStateModel>, payload: any) {
        return this._overtimeService
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

    @Action(OvertimeAction.AddOvertime)
    add(ctx: StateContext<OvertimeStateModel>, payload: any) {
        return this._overtimeService
            .add(payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new OvertimeAction.GetOvertime());
                })
            )
    }

    @Action(OvertimeAction.UpdateOvertime)
    update(ctx: StateContext<OvertimeStateModel>, payload: any) {
        return this._overtimeService
            .update(payload.payload.id, payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new OvertimeAction.GetOvertime());
                })
            )
    }

    @Action(OvertimeAction.UpdateOvertimeStatus)
    updateStatus(ctx: StateContext<OvertimeStateModel>, payload: any) {
        return this._overtimeService
            .update(payload.id, { status: payload.status })
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new OvertimeAction.GetOvertime());
                })
            )
    }

    @Action(OvertimeAction.DeleteOvertime)
    delete(ctx: StateContext<OvertimeStateModel>, payload: any) {
        return this._overtimeService
            .delete(payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new OvertimeAction.GetOvertime());
                })
            )
    }
}

