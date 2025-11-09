import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, NgxsOnInit } from "@ngxs/store";
import { PayrollAction } from "./payroll.action";
import { tap } from "rxjs";
import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";
import { PayrollService } from "../../../services/pages/application/human-resource/payroll.service";

export interface PayrollStateModel {
    data: EmployeeModel.IPayroll[];
    detail: EmployeeModel.IPayroll | null;
    loading: boolean;
    error: string | null;
}

@State<PayrollStateModel>({
    name: 'payroll',
    defaults: {
        data: [],
        detail: null,
        loading: false,
        error: null
    },
})
@Injectable()
export class PayrollState implements NgxsOnInit {

    constructor(private _payrollService: PayrollService) { }

    ngxsOnInit(ctx: StateContext<any>): void {
        ctx.dispatch(new PayrollAction.GetPayroll());
    }

    @Selector()
    static getAll(state: PayrollStateModel) {
        return state.data;
    }

    @Selector()
    static getDetail(state: PayrollStateModel) {
        return state.detail;
    }

    @Selector()
    static isLoading(state: PayrollStateModel) {
        return state.loading;
    }

    @Action(PayrollAction.GetPayroll)
    getPayroll(ctx: StateContext<PayrollStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });
        return this._payrollService.getAll(payload.filter, payload.sort).pipe(
            tap((result) => {
                ctx.setState({ ...ctx.getState(), data: result, loading: false });
            })
        );
    }

    @Action(PayrollAction.GetPayrollDetail)
    getDetail(ctx: StateContext<PayrollStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });
        return this._payrollService.getById(payload.id).pipe(
            tap((result) => {
                ctx.setState({ ...ctx.getState(), detail: result, loading: false });
            })
        );
    }

    @Action(PayrollAction.AddPayroll)
    add(ctx: StateContext<PayrollStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });
        return this._payrollService.add(payload.payload).pipe(
            tap(() => {
                ctx.dispatch(new PayrollAction.GetPayroll());
            })
        );
    }

    @Action(PayrollAction.UpdatePayroll)
    update(ctx: StateContext<PayrollStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });
        return this._payrollService.update(payload.payload.id, payload.payload).pipe(
            tap(() => {
                ctx.dispatch(new PayrollAction.GetPayroll());
            })
        );
    }

    @Action(PayrollAction.DeletePayroll)
    delete(ctx: StateContext<PayrollStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });
        return this._payrollService.delete(payload.id).pipe(
            tap(() => {
                ctx.dispatch(new PayrollAction.GetPayroll());
            })
        );
    }

    @Action(PayrollAction.GeneratePayroll)
    generate(ctx: StateContext<PayrollStateModel>, payload: any) {
        ctx.setState({ ...ctx.getState(), loading: true });
        return this._payrollService.generatePayrollForAllEmployees(payload.month).pipe(
            tap(() => {
                ctx.dispatch(new PayrollAction.GetPayroll());
            })
        );
    }

}

