import { Injectable } from '@angular/core';
import { db } from '../../../../app.database';
import { from, map, switchMap } from 'rxjs';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    add(employee: EmployeeModel.IEmployee) {
        employee.created_at = new Date();
        employee.is_active = true;
        return from(db.employees.add(employee));
    }

    bulkAdd(employees: EmployeeModel.IEmployee[]) {
        const now = new Date();
        employees.forEach(e => e.created_at = now);
        return from(db.employees.bulkAdd(employees));
    }

    getAll() {
        return from(db.employees.where('is_active').equals(1).toArray()).pipe(
            switchMap(async (employees) => {
                const departments = await db.department.toArray();
                const positions = await db.position.toArray();
                return employees.map(e => ({
                    ...e,
                    department: departments.find(d => d.id === e.department_id) || null,
                    position: positions.find(p => p.id === e.position_id) || null,
                }));
            }),
            from
        );
    }

    getById(id: string | number) {
        return from(db.employees.get(id as any)).pipe(
            switchMap(async (e) => {
                if (!e) return null;
                const [department, position] = await Promise.all([
                    db.department.get(e.department_id as any),
                    db.position.get(e.position_id as any)
                ]);
                return { ...e, department, position };
            }),
            from
        );
    }

    update(id: string | number, changes: Partial<EmployeeModel.IEmployee>) {
        changes.updated_at = new Date();
        return from(db.employees.update(id as any, changes));
    }

    delete(id: string | number) {
        return from(db.employees.update(id as any, { is_active: false }));
    }
}
