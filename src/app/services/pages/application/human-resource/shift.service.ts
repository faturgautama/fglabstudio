import { Injectable } from '@angular/core';
import { db } from '../../../../app.database';
import { from } from 'rxjs';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';

@Injectable({ providedIn: 'root' })
export class ShiftService {
    add(shift: EmployeeModel.IShift) {
        shift.created_at = new Date();
        shift.is_active = true;
        return from(db.shift.add(shift));
    }

    getAll() {
        return from(db.shift.where('is_active').equals(1).toArray());
    }

    getById(id: string | number) {
        return from(db.shift.get(id as any));
    }

    update(id: string | number, changes: Partial<EmployeeModel.IShift>) {
        changes.updated_at = new Date();
        return from(db.shift.update(id as any, changes));
    }

    delete(id: string | number) {
        return from(db.shift.update(id as any, { is_active: false }));
    }
}
