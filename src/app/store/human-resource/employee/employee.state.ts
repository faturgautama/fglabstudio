import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { EmployeeAction } from "./employee.action";
import { tap } from "rxjs";
import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";
import { EmployeeService } from "../../../services/pages/application/human-resource/employee.service";

export interface EmployeeStateModel {
    data: EmployeeModel.IDepartment[];
    single: EmployeeModel.IDepartment | null | undefined;
}

@State<EmployeeStateModel>({
    name: 'employee',
    defaults: {
        data: [],
        single: null
    },
})
@Injectable()
export class EmployeeState implements NgxsOnInit {

    constructor(
        private _employeeService: EmployeeService
    ) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new EmployeeAction.GetEmployee());
    }

    @Selector()
    static getAll(state: EmployeeStateModel) {
        return state.data;
    }

    @Action(EmployeeAction.GetEmployee)
    getEmployee(ctx: StateContext<EmployeeStateModel>) {
        return this._employeeService
            .getAll()
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        data: result
                    })
                })
            )
    }

    @Action(EmployeeAction.GetByIdEmployee)
    getById(ctx: StateContext<EmployeeStateModel>, payload: any) {
        return this._employeeService
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

    @Action(EmployeeAction.AddEmployee)
    add(ctx: StateContext<EmployeeStateModel>, payload: any) {
        return this._employeeService
            .add(payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();

                    ctx.dispatch(new EmployeeAction.GetEmployee());
                })
            )
    }

    @Action(EmployeeAction.UpdateEmployee)
    update(ctx: StateContext<EmployeeStateModel>, payload: any) {
        return this._employeeService
            .update(payload.id, payload)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new EmployeeAction.GetEmployee());
                })
            )
    }

    @Action(EmployeeAction.DeleteEmployee)
    delete(ctx: StateContext<EmployeeStateModel>, payload: any) {
        return this._employeeService
            .delete(payload.id)
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.dispatch(new EmployeeAction.GetEmployee());
                })
            )
    }
}