import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { DepartementAction } from "./departement.action";
import { switchMap, tap } from "rxjs";
import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";
import { DepartmentService } from "../../../services/pages/application/human-resource/departement.service";

export interface DepartementStateModel {
    data: EmployeeModel.IDepartment[];
    single: EmployeeModel.IDepartment | null | undefined;
}

@State<DepartementStateModel>({
    name: 'departement',
    defaults: {
        data: [],
        single: null
    },
})
@Injectable()
export class DepartementState implements NgxsOnInit {

    constructor(
        private _departementService: DepartmentService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new DepartementAction.GetDepartement({}));
    }

    @Selector()
    static getAll(state: DepartementStateModel) {
        return state.data;
    }

    @Action(DepartementAction.GetDepartement)
    getDepartement(ctx: StateContext<DepartementStateModel>, payload: any) {
        return this._departementService
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

    @Action(DepartementAction.GetByIdDepartement)
    getById(ctx: StateContext<DepartementStateModel>, payload: any) {
        return this._departementService
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

    @Action(DepartementAction.AddDepartement)
    add(ctx: StateContext<DepartementStateModel>, payload: any) {
        return this._departementService
            .add(payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new DepartementAction.GetDepartement()))
            )
    }

    @Action(DepartementAction.UpdateDepartement)
    update(ctx: StateContext<DepartementStateModel>, payload: any) {
        return this._departementService
            .update(payload.payload.id, payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new DepartementAction.GetDepartement()))
            )
    }

    @Action(DepartementAction.DeleteDepartement)
    delete(ctx: StateContext<DepartementStateModel>, payload: any) {
        return this._departementService
            .delete(payload.id)
            .pipe(
                switchMap(() => ctx.dispatch(new DepartementAction.GetDepartement()))
            )
    }
}