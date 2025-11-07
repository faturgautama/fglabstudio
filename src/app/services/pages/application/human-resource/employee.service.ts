import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { BaseActionService } from '../../../shared/base-action';

@Injectable({ providedIn: 'root' })
export class EmployeeService extends BaseActionService<EmployeeModel.IEmployee> {
    private databaseService = inject(DatabaseService);

    protected override table = this.databaseService.db.employees;

    calculateAge(birthDate: Date): number {
        if (!birthDate) return 0;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    formatEmployeeData(employee: any): EmployeeModel.IEmployee {
        return {
            ...employee,
            age: employee.birth_date ? this.calculateAge(new Date(employee.birth_date)) : undefined
        };
    }
}
