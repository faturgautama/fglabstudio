import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { PositionAction } from "./position.action";
import { tap } from "rxjs";
import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";
import { PositionService } from "../../../services/pages/application/human-resource/position.service";

export interface PositionStateModel {
    data: EmployeeModel.IPosition[];
    single: EmployeeModel.IPosition | null | undefined;
}

@State<PositionStateModel>({
    name: 'position',
    defaults: {
        data: [],
        single: null
    },
})
@Injectable()
export class PositionState implements NgxsOnInit {

    constructor(
        private _positionService: PositionService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new PositionAction.GetPosition());
    }

    @Selector()
    static getAll(state: PositionStateModel) {
        return state.data;
    }

    @Action(PositionAction.GetPosition)
    getPosition(ctx: StateContext<PositionStateModel>, payload: any) {
        return this._positionService
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

    @Action(PositionAction.GetByIdPosition)
    getById(ctx: StateContext<PositionStateModel>, payload: any) {
        return this._positionService
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

    @Action(PositionAction.AddPosition)
    add(ctx: StateContext<PositionStateModel>, payload: any) {
        return this._positionService
            .add(payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new PositionAction.GetPosition());
                })
            )
    }

    @Action(PositionAction.UpdatePosition)
    update(ctx: StateContext<PositionStateModel>, payload: any) {
        return this._positionService
            .update(payload.payload.id, payload.payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new PositionAction.GetPosition());
                })
            )
    }

    @Action(PositionAction.DeletePosition)
    delete(ctx: StateContext<PositionStateModel>, payload: any) {
        return this._positionService
            .delete(payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new PositionAction.GetPosition());
                })
            )
    }
}