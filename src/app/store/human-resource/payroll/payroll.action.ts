import { EmployeeModel } from "../../../model/pages/application/human-resource/employee.model";

export namespace PayrollAction {

    export class GetPayroll {
        static readonly type = '[Payroll] Get All';
        constructor(public filter?: any, public sort?: any) { }
    }

    export class GetPayrollDetail {
        static readonly type = '[Payroll] Get Detail';
        constructor(public id: string) { }
    }

    export class AddPayroll {
        static readonly type = '[Payroll] Add';
        constructor(public payload: EmployeeModel.IPayroll) { }
    }

    export class UpdatePayroll {
        static readonly type = '[Payroll] Update';
        constructor(public payload: EmployeeModel.IPayroll) { }
    }

    export class DeletePayroll {
        static readonly type = '[Payroll] Delete';
        constructor(public id: string) { }
    }

    export class GeneratePayroll {
        static readonly type = '[Payroll] Generate';
        constructor(public month: string) { }
    }

    export class CalculatePayrollForEmployee {
        static readonly type = '[Payroll] Calculate For Employee';
        constructor(public employeeId: string, public month: string) { }
    }

}

