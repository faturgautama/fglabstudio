import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { AttendanceAction } from "./attendance.action";
import { tap } from "rxjs";
import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";
import { AttendanceService } from "../../../services/pages/application/human-resource/attendance.service";

export interface AttendanceStateModel {
    data: EmployeeModel.IAttendance[];
    single: EmployeeModel.IAttendance | null | undefined;
}

@State<AttendanceStateModel>({
    name: 'attendance',
    defaults: {
        data: [],
        single: null
    },
})
@Injectable()
export class AttendanceState implements NgxsOnInit {

    constructor(
        private _attendanceService: AttendanceService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new AttendanceAction.GetAttendance());
    }

    @Selector()
    static getAll(state: AttendanceStateModel) {
        return state.data;
    }

    @Action(AttendanceAction.GetAttendance)
    getAttendance(ctx: StateContext<AttendanceStateModel>) {
        return this._attendanceService
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

    @Action(AttendanceAction.GetByIdAttendance)
    getById(ctx: StateContext<AttendanceStateModel>, payload: any) {
        return this._attendanceService
            .getById(payload.payload.id)
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

    @Action(AttendanceAction.AddAttendance)
    add(ctx: StateContext<AttendanceStateModel>, payload: any) {
        return this._attendanceService
            .add(payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new AttendanceAction.GetAttendance());
                })
            )
    }

    @Action(AttendanceAction.BulkAddAttendance)
    bulkAdd(ctx: StateContext<AttendanceStateModel>, payload: any) {
        return this._attendanceService
            .bulkAdd(payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new AttendanceAction.GetAttendance());
                })
            )
    }

    @Action(AttendanceAction.UpdateAttendance)
    update(ctx: StateContext<AttendanceStateModel>, payload: any) {
        return this._attendanceService
            .update(payload.payload.id, payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new AttendanceAction.GetAttendance());
                })
            )
    }

    @Action(AttendanceAction.DeleteAttendance)
    delete(ctx: StateContext<AttendanceStateModel>, payload: any) {
        return this._attendanceService
            .delete(payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new AttendanceAction.GetAttendance());
                })
            )
    }
}