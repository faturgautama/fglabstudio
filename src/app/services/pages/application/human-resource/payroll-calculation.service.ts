import { inject, Injectable } from '@angular/core';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { DatabaseService } from '../../../../app.database';
import { from, switchMap, map } from 'rxjs';

export interface PayrollBreakdown {
    baseSalary: number;
    overtimePay: number;
    bpjsKesehatanDeduction: number;      // BPJS Kesehatan
    bpjsKetenagakerjaanDeduction: number; // BPJS Ketenagakerjaan
    bpjsPensiunDeduction: number;         // BPJS Pensiun
    unpaidLeaveDeduction: number;
    taxDeduction: number;
    manualAllowances: number;
    manualDeductions: number;
    totalDeduction: number;
    netSalary: number;
}

@Injectable({ providedIn: 'root' })
export class PayrollCalculationService {

    private databaseService = inject(DatabaseService);

    /**
     * Hitung payroll untuk satu karyawan di bulan tertentu
     */
    async calculatePayrollForEmployee(
        employeeId: string | number,
        month: string // format: YYYY-MM
    ): Promise<{ breakdown: PayrollBreakdown; payroll: EmployeeModel.IPayroll }> {

        await this.databaseService.ensureReady();

        // Convert employeeId to number for Dexie compatibility
        const empId = typeof employeeId === 'string' ? Number(employeeId) : employeeId;

        // 1. Ambil data yang diperlukan
        const employee = await (this.databaseService.db.employees as any)
            .get(empId);

        const hrSettings = await (this.databaseService.db.hr_setting as any).toArray();
        const hrSetting = hrSettings.find((setting: any) => setting.is_active === true);

        const overtimes = await (this.databaseService.db.overtime as any)
            .where('employee_id').equals(empId).toArray();

        const leaves = await (this.databaseService.db.leave as any)
            .where('employee_id').equals(empId).toArray();

        if (!employee) {
            throw new Error('Employee tidak ditemukan');
        }

        if (!hrSetting) {
            throw new Error('HR Setting tidak ditemukan');
        }

        // 2. Hitung Base Salary
        const baseSalary = employee.salary || 0;

        // 3. Hitung Overtime Pay
        const approvedOvertimes = overtimes.filter(
            (ot: any) => ot.status === 'approved' && ot.is_delete === false
        );

        const overtimeHours = approvedOvertimes.reduce((sum: number, ot: any) => {
            return sum + (ot.total_hours || 0);
        }, 0);

        const overtimePay = overtimeHours * (hrSetting.overtime_rate_per_hour || 0);

        // 4. Hitung BPJS Terpisah
        let bpjsKesehatanDeduction = 0;
        let bpjsKetenagakerjaanDeduction = 0;
        let bpjsPensiunDeduction = 0;

        if (hrSetting.has_bpjs_kesehatan) {
            const percentage = hrSetting.bpjs_kesehatan_employee || 0;
            bpjsKesehatanDeduction = (baseSalary * percentage) / 100;
        }

        if (hrSetting.has_bpjs_ketenagakerjaan) {
            const percentage = hrSetting.bpjs_ketenagakerjaan_employee || 0;
            bpjsKetenagakerjaanDeduction = (baseSalary * percentage) / 100;
        }

        if (hrSetting.has_bpjs_pensiun) {
            const percentage = hrSetting.bpjs_pensiun_employee || 0;
            bpjsPensiunDeduction = (baseSalary * percentage) / 100;
        }

        const totalBpjsDeduction = bpjsKesehatanDeduction + bpjsKetenagakerjaanDeduction + bpjsPensiunDeduction;

        // 5. Hitung Unpaid Leave Deduction
        const approvedLeaves = leaves.filter(
            (leave: any) => leave.status === 'approved' && leave.is_delete === false
        );

        const unpaidLeaveDays = approvedLeaves
            .filter((leave: any) => {
                // Cek apakah leave termasuk bulan yg dihitung
                const leaveStartMonth = leave.start_date.toString().substring(0, 7);
                const leaveEndMonth = leave.end_date.toString().substring(0, 7);
                return leaveStartMonth === month || leaveEndMonth === month;
            })
            .reduce((sum: number, leave: any) => {
                // Hitung hari yg jatuh di bulan tersebut
                const leaveStartDate = new Date(leave.start_date);
                const leaveEndDate = new Date(leave.end_date);
                const monthStart = new Date(`${month}-01`);
                const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);

                const effectiveStart = leaveStartDate > monthStart ? leaveStartDate : monthStart;
                const effectiveEnd = leaveEndDate < monthEnd ? leaveEndDate : monthEnd;

                const daysInRange = Math.ceil(
                    (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)
                ) + 1;

                return sum + daysInRange;
            }, 0);

        const daysInMonth = new Date(
            parseInt(month.split('-')[0]),
            parseInt(month.split('-')[1]),
            0
        ).getDate();

        const unpaidLeaveDeduction = (unpaidLeaveDays / daysInMonth) * baseSalary;

        // 6. Hitung Tax (optional)
        let taxDeduction = 0;

        if (hrSetting.has_tax) {
            const taxableAmount = baseSalary + overtimePay;
            taxDeduction = (taxableAmount * 5) / 100; // 5% flat tax
        }

        // Breakdown berdasarkan additional allowances dan deductions
        const manualAllowances = 0; // Akan ditambah dari form
        const manualDeductions = 0; // Akan ditambah dari form

        // 7. Hitung Total Deduction & Net Salary
        const totalDeduction = totalBpjsDeduction + unpaidLeaveDeduction + taxDeduction + manualDeductions;
        const netSalary = baseSalary + overtimePay + manualAllowances - totalDeduction;

        const breakdown: PayrollBreakdown = {
            baseSalary,
            overtimePay,
            bpjsKesehatanDeduction,
            bpjsKetenagakerjaanDeduction,
            bpjsPensiunDeduction,
            unpaidLeaveDeduction,
            taxDeduction,
            manualAllowances,
            manualDeductions,
            totalDeduction,
            netSalary: Math.max(0, netSalary)
        };

        const payroll: EmployeeModel.IPayroll = {
            employee_id: employeeId.toString(),
            month,
            base_salary: baseSalary,
            overtime_pay: overtimePay,
            bonus: 0,
            deduction: totalDeduction,
            net_salary: Math.max(0, netSalary),
            payment_status: 'pending',
            additional_allowances: [],
            additional_deductions: [],
            is_delete: false,
            created_at: new Date()
        };

        return { breakdown, payroll };
    }

    /**
     * Hitung payroll untuk semua karyawan di bulan tertentu
     */
    generatePayrollForAllEmployees$(month: string) {
        return from((async () => {
            await this.databaseService.ensureReady();

            const employees = await (this.databaseService.db.employees as any)
                .toArray();

            const filteredEmployees = employees.filter((employee: any) => employee.is_active === true);

            const payrolls: EmployeeModel.IPayroll[] = [];

            for (const employee of filteredEmployees) {
                try {
                    const { payroll } = await this.calculatePayrollForEmployee(employee.id, month);
                    payrolls.push(payroll);
                } catch (err) {
                    console.error(`Error calculating payroll for employee ${employee.id}:`, err);
                }
            }

            return payrolls;
        })());
    }
}
