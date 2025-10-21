import { Injectable } from '@angular/core';
import { db } from '../../../../app.database';
import { from, map, switchMap } from 'rxjs';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';

@Injectable({ providedIn: 'root' })
export class PositionService {
    add(position: EmployeeModel.IPosition) {
        position.created_at = new Date();
        position.is_active = true;
        return from(db.position.add(position));
    }

    bulkAdd(positions: EmployeeModel.IPosition[]) {
        const now = new Date();
        positions.forEach(p => p.created_at = now);
        return from(db.position.bulkAdd(positions));
    }

    getAll() {
        return from(db.position.where('is_active').equals(1).toArray()).pipe(
            switchMap(async (positions) => {
                const departments = await db.department.toArray();
                return positions.map(p => ({
                    ...p,
                    department: departments.find(d => d.id === p.department_id) || null
                }));
            }),
            from
        );
    }

    getById(id: any) {
        return from(db.position.get(id)).pipe(
            switchMap(async (p) => {
                if (!p) return null;
                const department = await db.department.get(p.department_id as any);
                return { ...p, department };
            }),
            from
        );
    }

    update(id: any, changes: Partial<EmployeeModel.IPosition>) {
        changes.updated_at = new Date();
        return from(db.position.update(id, changes));
    }

    delete(id: any) {
        return from(db.position.update(id, { is_active: false }));
    }
}
