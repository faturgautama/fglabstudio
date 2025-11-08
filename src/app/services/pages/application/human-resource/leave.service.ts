import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { BaseActionService } from '../../../shared/base-action';

@Injectable({ providedIn: 'root' })
export class LeaveService extends BaseActionService<EmployeeModel.ILeave> {
    private databaseService = inject(DatabaseService);
    protected override table = this.databaseService.db.leave;

    /**
     * Query sisa cuti/approved leaves by employee ID
     * Filter: status = 'approved' dan is_delete = false
     * 
     * @param employeeId - Employee ID untuk di-query
     * @returns Observable dengan total approved days dan list approved leaves
     */
    getApprovedLeavesByEmployeeId(employeeId: string) {
        return this.withLoading(async () => {
            const records = await (this.table as any)
                .where('employee_id')
                .equals(employeeId)
                .toArray();

            // Filter: status 'approved' dan is_delete false
            const approvedLeaves = records.filter((leave: EmployeeModel.ILeave) =>
                leave.status === 'approved' && leave.is_delete === false
            );

            // Hitung total hari cuti yang sudah disetujui
            const totalApprovedDays = approvedLeaves.reduce((sum: number, leave: EmployeeModel.ILeave) =>
                sum + leave.total_days, 0
            );

            return {
                totalApprovedDays,
                leaveCount: approvedLeaves.length,
                approvedLeaves // Return list approved leaves jika perlu detail
            };
        });
    }

    /**
     * Query all leaves by employee ID (tanpa filter status)
     * @param employeeId - Employee ID untuk di-query
     */
    getLeavesByEmployeeId(employeeId: string) {
        return this.getAllByColumn('employee_id' as keyof EmployeeModel.ILeave, employeeId);
    }

    /**
     * Get remaining leave days by employee ID for each leave policy
     * Calculates: total_days dari leave_policy - sum(approved leaves untuk policy tersebut)
     * Filter berdasarkan gender_restriction karyawan
     * 
     * @param employeeId - Employee ID
     * @param employee - Employee data (untuk cek gender)
     * @param leavePolicies - Array of leave policies
     * @returns Observable dengan array policies + remaining days info (filtered by gender)
     */
    getRemainingLeavesByEmployeeAndPolicy(
        employeeId: string,
        employee: EmployeeModel.IEmployee | null,
        leavePolicies: EmployeeModel.ILeavePolicy[]
    ) {
        return this.withLoading(async () => {
            const approvedLeaves = await (this.table as any)
                .where('employee_id')
                .equals(employeeId)
                .toArray()
                .then((records: EmployeeModel.ILeave[]) =>
                    records.filter(leave => leave.status === 'approved' && leave.is_delete === false)
                );

            // Filter dan map leave policies berdasarkan gender_restriction
            return leavePolicies
                .filter((policy: EmployeeModel.ILeavePolicy) => {
                    // Jika policy tidak punya gender restriction, tampilkan untuk semua
                    if (!policy.gender_restriction || policy.gender_restriction === 'all') {
                        return true;
                    }
                    // Jika policy punya gender restriction, cek apakah sesuai dengan gender employee
                    return employee && employee.gender === policy.gender_restriction;
                })
                .map((policy: EmployeeModel.ILeavePolicy, index: number) => {
                    // Check bagaimana leave_policy_id di-store di approved leaves
                    const usedDays = approvedLeaves
                        .filter((leave: EmployeeModel.ILeave) => {
                            // Try match by id, code, or title
                            const policyId = policy.id || policy.code || policy.title;
                            return leave.leave_policy_id === policyId ||
                                leave.leave_policy_id === policy.code ||
                                leave.leave_policy_id === policy.title;
                        })
                        .reduce((sum: number, leave: EmployeeModel.ILeave) => sum + leave.total_days, 0);

                    const remainingDays = policy.total_days - usedDays;

                    // Generate unique ID: prioritize id > code > title
                    const uniqueId = policy.id ? String(policy.id) : (policy.code || policy.title || `policy_${index}`);

                    // Debug: log untuk melihat structure policy
                    console.log(`Policy ${index}:`, {
                        policy_id: policy.id,
                        policy_code: policy.code,
                        policy_title: policy.title,
                        uniqueId: uniqueId,
                        usedDays: usedDays
                    });

                    return {
                        ...policy,
                        id: uniqueId, // Ensure unique, non-empty ID
                        used_days: usedDays,
                        remaining_days: Math.max(0, remainingDays)
                    };
                });
        });
    }
}