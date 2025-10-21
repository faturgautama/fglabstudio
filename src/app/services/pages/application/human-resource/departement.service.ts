import { inject, Injectable } from '@angular/core';
import { db } from '../../../../app.database';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { from, map } from 'rxjs';
import { UtilityService } from '../../../shared/utility';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
    _utilityService = inject(UtilityService);

    add(department: EmployeeModel.IDepartment) {
        this._utilityService._showDashboardLoading.next(true);

        department.created_at = new Date();
        department.is_active = true;
        const { id, ...payload } = department;

        return from(db.department.add(payload));
    }

    bulkAdd(department: EmployeeModel.IDepartment[]) {
        department.forEach(e => {
            e.created_at = new Date();
        });
        return from(db.department.bulkAdd(department));
    }

    getAll() {
        return from(db.department.toArray())
            .pipe(
                map((result) => result.filter(item => item.is_active === true))
            );
    }

    getById(id: number) {
        return from(db.department.get(id));
    }

    update(id: number, changes: Partial<EmployeeModel.IDepartment>) {
        changes.updated_at = new Date();
        return from(db.department.update(id, changes));
    }

    delete(id: number) {
        return from(db.department.update(id, { is_active: false }));
    }
}
