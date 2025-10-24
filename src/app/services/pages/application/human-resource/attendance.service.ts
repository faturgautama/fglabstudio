import { Injectable } from '@angular/core';
import { db } from '../../../../app.database';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { BaseActionService } from '../../../shared/base-action';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AttendanceService extends BaseActionService<EmployeeModel.IAttendance> {
    protected override table = db.attendance;

    checkIn(employeeId: string | number, shiftId: string | number, date: string, checkInTime: string) {
        const attendance: EmployeeModel.IAttendance = {
            employee_id: employeeId as any,
            shift_id: shiftId as any,
            date,
            check_in: checkInTime,
            is_present: true,
            is_delete: false,
            created_at: new Date(),
        };
        return from(db.attendance.add(attendance));
    }

    checkOut(attendanceId: string | number, checkOutTime: string) {
        return from(db.attendance.update(attendanceId as any, { check_out: checkOutTime }));
    }

    findTodayAttendance(employeeId: string | number, date: string) {
        const today = date || new Date().toISOString().split('T')[0];
        return from(
            db.attendance
                .where('employee_id')
                .equals(employeeId as any)
                .filter(record => record.date === today && !record.is_delete)
                .first()
        );
    }
}