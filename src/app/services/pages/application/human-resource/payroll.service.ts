import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { BaseActionService } from '../../../shared/base-action';
import { from, switchMap } from 'rxjs';
import { PayrollCalculationService } from './payroll-calculation.service';

@Injectable({ providedIn: 'root' })
export class PayrollService extends BaseActionService<EmployeeModel.IPayroll> {

    private databaseService = inject(DatabaseService);
    private calculationService = inject(PayrollCalculationService);

    protected override table = this.databaseService.db.payroll;

    generatePayrollForAllEmployees(month: string) {
        return this.calculationService.generatePayrollForAllEmployees$(month).pipe(
            switchMap(payrolls => {
                console.log("payrolls =>", payrolls);

                return from(
                    Promise.all(
                        payrolls.map(p =>
                            from(this.databaseService.db.payroll.add(p))
                        )
                    )
                );
            })
        );
    }

    calculateForEmployee$(employeeId: string, month: string) {
        return from(
            this.calculationService.calculatePayrollForEmployee(employeeId, month)
        );
    }
}
