import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { LeaveAction } from "./leave.action";
import { tap } from "rxjs";
import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";
import { LeaveService } from "../../../services/pages/application/human-resource/leave.service";

export interface LeaveStateModel {
    data: EmployeeModel.ILeave[];
    single: EmployeeModel.ILeave | null | undefined;
}

@State<LeaveStateModel>({
    name: 'leave',
    defaults: {
        data: [],
        single: null
    },
})
@Injectable()
export class LeaveState implements NgxsOnInit {

    constructor(
        private _leaveService: LeaveService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new LeaveAction.GetLeave());
    }

    @Selector()
    static getAll(state: LeaveStateModel) {
        return state.data;
    }

    @Selector()
    static getSingle(state: LeaveStateModel) {
        return state.single;
    }

    @Action(LeaveAction.GetLeave)
    getLeave(ctx: StateContext<LeaveStateModel>) {
        return this._leaveService.getAll().pipe(
            tap((result) => {
                const state = ctx.getState();
                ctx.setState({
                    ...state,
                    data: result
                });
            })
        );
    }

    @Action(LeaveAction.GetByIdLeave)
    getById(ctx: StateContext<LeaveStateModel>, payload: any) {
        return this._leaveService
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

    @Action(LeaveAction.AddLeave)
    add(ctx: StateContext<LeaveStateModel>, payload: any) {
        return this._leaveService
            .add(payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new LeaveAction.GetLeave());
                })
            )
    }

    @Action(LeaveAction.UpdateLeave)
    update(ctx: StateContext<LeaveStateModel>, payload: any) {
        return this._leaveService
            .update(payload.payload.id, payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new LeaveAction.GetLeave());
                })
            )
    }

    @Action(LeaveAction.UpdateLeaveStatus)
    updateStatus(ctx: StateContext<LeaveStateModel>, payload: any) {
        return this._leaveService
            .update(payload.id, { status: payload.status })
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new LeaveAction.GetLeave());
                })
            )
    }

    @Action(LeaveAction.DeleteLeave)
    delete(ctx: StateContext<LeaveStateModel>, payload: any) {
        return this._leaveService
            .delete(payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new LeaveAction.GetLeave());
                })
            )
    }
}

