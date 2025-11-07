import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { from, switchMap } from 'rxjs';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';

@Injectable({ providedIn: 'root' })
export class PayrollService {

    private databaseService = inject(DatabaseService);

    add(payroll: EmployeeModel.IPayroll) {
        payroll.created_at = new Date();
        payroll.is_delete = false;
        return from(this.databaseService.db.payroll.add(payroll));
    }

    bulkAdd(payrolls: EmployeeModel.IPayroll[]) {
        const now = new Date();
        payrolls.forEach(p => {
            p.created_at = now;
            p.is_delete = false;
        });
        return from(this.databaseService.db.payroll.bulkAdd(payrolls));
    }

    getAll() {
        return from(this.databaseService.db.payroll.where('is_delete').equals(0).toArray()).pipe(
            switchMap(async (records) => {
                const employees = await this.databaseService.db.employees.toArray();
                return records.map(p => ({
                    ...p,
                    employee: employees.find(e => e.id === p.employee_id) || null,
                }));
            }),
            from
        );
    }

    getById(id: string | number) {
        return from(this.databaseService.db.payroll.get(id as any)).pipe(
            switchMap(async (p) => {
                if (!p) return null;
                const employee = await this.databaseService.db.employees.get(p.employee_id as any);
                return { ...p, employee };
            }),
            from
        );
    }

    update(id: string | number, changes: Partial<EmployeeModel.IPayroll>) {
        changes.updated_at = new Date();
        return from(this.databaseService.db.payroll.update(id as any, changes));
    }

    delete(id: string | number) {
        return from(this.databaseService.db.payroll.update(id as any, { is_delete: true }));
    }

    clear() {
        return from(this.databaseService.db.payroll.clear());
    }
}
