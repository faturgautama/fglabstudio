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

    /**
     * Generate payroll untuk semua karyawan
     * - Jika record sudah ada (employee_id + month), maka UPDATE
     * - Jika belum ada, maka ADD
     */
    generatePayrollForAllEmployees(month: string) {
        return this.calculationService.generatePayrollForAllEmployees$(month).pipe(
            switchMap(async (payrolls) => {
                const results = [];

                for (const payroll of payrolls) {
                    try {
                        // ✅ Cek apakah payroll untuk employee_id + month sudah ada
                        const existing = await this.databaseService.db.payroll
                            .where('employee_id')
                            .equals(payroll.employee_id)
                            .and((record: any) => record.month === month)
                            .first();

                        if (existing) {
                            // ✅ Update existing record
                            const updated = {
                                ...existing,
                                ...payroll,
                                id: existing.id, // Keep original ID
                                created_at: existing.created_at, // Keep original created_at
                                updated_at: new Date() // Add updated_at timestamp
                            };

                            await this.databaseService.db.payroll.update(existing.id, updated);
                            results.push({ action: 'updated', record: updated });
                        } else {
                            // ✅ Add new record
                            const id = await this.databaseService.db.payroll.add(payroll);
                            results.push({ action: 'added', record: { ...payroll, id } });
                        }
                    } catch (error) {
                        console.error(`Error processing payroll for employee ${payroll.employee_id}:`, error);
                        results.push({ action: 'error', employee_id: payroll.employee_id, error });
                    }
                }
                return results;
            })
        );
    }

    /**
     * Calculate payroll untuk satu karyawan
     */
    calculateForEmployee$(employeeId: string, month: string) {
        return from(
            this.calculationService.calculatePayrollForEmployee(employeeId, month)
        );
    }

    /**
     * Check if payroll exists for employee in specific month
     */
    async checkExistingPayroll(employeeId: string, month: string): Promise<EmployeeModel.IPayroll | undefined> {
        return await this.databaseService.db.payroll
            .where('employee_id')
            .equals(employeeId)
            .and((record: any) => record.month === month)
            .first();
    }

    /**
     * Add or update payroll for single employee
     */
    async addOrUpdatePayroll(payroll: EmployeeModel.IPayroll): Promise<{ action: 'added' | 'updated'; id: any }> {
        const existing = await this.checkExistingPayroll(payroll.employee_id, payroll.month);

        if (existing) {
            // Update
            const updated = {
                ...existing,
                ...payroll,
                id: existing.id,
                created_at: existing.created_at,
                updated_at: new Date()
            };

            await this.databaseService.db.payroll.update(existing.id, updated);
            return { action: 'updated', id: existing.id };
        } else {
            // Add
            const id = await this.databaseService.db.payroll.add(payroll);
            return { action: 'added', id };
        }
    }
}