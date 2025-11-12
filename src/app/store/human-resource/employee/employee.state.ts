import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { EmployeeAction } from "./employee.action";
import { tap, catchError, switchMap } from "rxjs";
import { of } from "rxjs";
import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";
import { EmployeeService } from "../../../services/pages/application/human-resource/employee.service";

export interface EmployeeStateModel {
    data: EmployeeModel.IEmployee[];
    single: EmployeeModel.IEmployee | null | undefined;
    error: string | null;
    loading: boolean;
}

@State<EmployeeStateModel>({
    name: 'employee',
    defaults: {
        data: [],
        single: null,
        error: null,
        loading: false
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

    @Selector()
    static getSingle(state: EmployeeStateModel) {
        return state.single;
    }

    @Selector()
    static getError(state: EmployeeStateModel) {
        return state.error;
    }

    @Selector()
    static isLoading(state: EmployeeStateModel) {
        return state.loading;
    }

    @Action(EmployeeAction.GetEmployee)
    getEmployee(ctx: StateContext<EmployeeStateModel>, payload: any) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: true,
            error: null
        });

        return this._employeeService
            .getAll(payload.filter, payload.sort)
            .pipe(
                tap((result) => {
                    ctx.setState({
                        ...state,
                        data: result,
                        loading: false,
                        error: null
                    })
                }),
                catchError((err: any) => {
                    console.error('❌ Error fetching employees:', err);
                    ctx.setState({
                        ...state,
                        loading: false,
                        error: err?.message || 'Gagal memuat data karyawan'
                    });
                    return of(null);
                })
            )
    }

    @Action(EmployeeAction.GetByIdEmployee)
    getById(ctx: StateContext<EmployeeStateModel>, payload: any) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: true,
            error: null
        });

        return this._employeeService
            .getById(payload.id)
            .pipe(
                tap((result) => {
                    ctx.setState({
                        ...state,
                        single: result,
                        loading: false,
                        error: null
                    })
                }),
                catchError((err: any) => {
                    console.error('❌ Error fetching employee:', err);
                    ctx.setState({
                        ...state,
                        loading: false,
                        error: err?.message || 'Gagal memuat data karyawan'
                    });
                    return of(null);
                })
            )
    }

    @Action(EmployeeAction.AddEmployee)
    add(ctx: StateContext<EmployeeStateModel>, payload: any) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: true,
            error: null
        });

        return this._employeeService
            .add(payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new EmployeeAction.GetEmployee()))
            )
    }

    @Action(EmployeeAction.UpdateEmployee)
    update(ctx: StateContext<EmployeeStateModel>, payload: any) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: true,
            error: null
        });

        return this._employeeService
            .update(payload.payload.id, payload.payload)
            .pipe(
                switchMap(() => ctx.dispatch(new EmployeeAction.GetEmployee()))
            )
    }

    @Action(EmployeeAction.DeleteEmployee)
    delete(ctx: StateContext<EmployeeStateModel>, payload: any) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            loading: true,
            error: null
        });

        return this._employeeService
            .delete(payload.id)
            .pipe(
                switchMap(() => ctx.dispatch(new EmployeeAction.GetEmployee()))
            )
    }
}