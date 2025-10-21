import { Injectable } from '@angular/core';
import { db } from '../../../../app.database';
import { from, switchMap } from 'rxjs';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';

@Injectable({ providedIn: 'root' })
export class AttendanceService {

    add(attendance: EmployeeModel.IAttendance) {
        attendance.created_at = new Date();
        return from(db.attendance.add(attendance));
    }

    bulkAdd(attendances: EmployeeModel.IAttendance[]) {
        const now = new Date();
        attendances.forEach(a => a.created_at = now);
        return from(db.attendance.bulkAdd(attendances));
    }

    getAll() {
        return from(db.attendance.where('is_delete').equals(0).toArray()).pipe(
            switchMap(async (records) => {
                const [employees, shifts] = await Promise.all([
                    db.employees.toArray(),
                    db.shift.toArray()
                ]);
                return records.map(a => ({
                    ...a,
                    employee: employees.find(e => e.id === a.employee_id) || null,
                    shift: shifts.find(s => s.id === a.shift_id) || null
                }));
            }),
            from
        );
    }

    getById(id: string | number) {
        return from(db.attendance.get(id as any)).pipe(
            switchMap(async (a) => {
                if (!a) return null;
                const [employee, shift] = await Promise.all([
                    db.employees.get(a.employee_id as any),
                    db.shift.get(a.shift_id as any)
                ]);
                return { ...a, employee, shift };
            }),
            from
        );
    }

    update(id: string | number, changes: Partial<EmployeeModel.IAttendance>) {
        changes.updated_at = new Date();
        return from(db.attendance.update(id as any, changes));
    }

    delete(id: string | number) {
        return from(db.attendance.update(id as any, { is_delete: true }));
    }

    clear() {
        return from(db.attendance.clear());
    }
}
