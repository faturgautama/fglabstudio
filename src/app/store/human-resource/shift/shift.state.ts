import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { ShiftAction } from "./shift.action";
import { tap } from "rxjs";
import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";
import { ShiftService } from "../../../services/pages/application/human-resource/shift.service";

export interface ShiftStateModel {
    data: EmployeeModel.IShift[];
    single: EmployeeModel.IShift | null | undefined;
}

@State<ShiftStateModel>({
    name: 'shift',
    defaults: {
        data: [],
        single: null
    },
})
@Injectable()
export class ShiftState implements NgxsOnInit {

    constructor(
        private _shiftService: ShiftService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new ShiftAction.GetShift());
    }

    @Selector()
    static getAll(state: ShiftStateModel) {
        return state.data;
    }

    @Action(ShiftAction.GetShift)
    getShift(ctx: StateContext<ShiftStateModel>) {
        return this._shiftService
            .getAll()
            .pipe(
                tap((result) => {
                    console.log("shift =>", result);

                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        data: result
                    });
                }),
            )
    }

    @Action(ShiftAction.GetByIdShift)
    getById(ctx: StateContext<ShiftStateModel>, payload: any) {
        return this._shiftService
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

    @Action(ShiftAction.AddShift)
    add(ctx: StateContext<ShiftStateModel>, payload: any) {
        return this._shiftService
            .add(payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new ShiftAction.GetShift());
                })
            )
    }

    @Action(ShiftAction.UpdateShift)
    update(ctx: StateContext<ShiftStateModel>, payload: any) {
        return this._shiftService
            .update(payload.payload.id, payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new ShiftAction.GetShift());
                })
            )
    }

    @Action(ShiftAction.DeleteShift)
    delete(ctx: StateContext<ShiftStateModel>, payload: any) {
        return this._shiftService
            .delete(payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new ShiftAction.GetShift());
                })
            )
    }
}