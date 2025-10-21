import Dexie, { Table } from 'dexie';
import { EmployeeModel } from './model/pages/application/human-resource/employee.model';

export class AppDatabase extends Dexie {
    department!: Table<EmployeeModel.IDepartment, number>;
    position!: Table<EmployeeModel.IPosition, number>;
    shift!: Table<EmployeeModel.IShift, number>;
    attendance!: Table<EmployeeModel.IAttendance, number>;
    payroll!: Table<EmployeeModel.IPayroll, number>;
    employees!: Table<EmployeeModel.IEmployee, number>;

    constructor() {
        super('CodeByXerenityDatabase');

        this.version(2).stores({
            department: '++id, code, title, is_active',
            position: '++id, code, title, is_active',
            shift: '++id, code, title, is_active',
            attendance: '++id, employee_id, shift_id, date',
            payroll: '++id, employee_id, month, base_salary, payment_status',
            employees: '++id, employee_code, full_name, department_id, position_id, employment_status, work_status, is_active'
        });

        this.on('populate', () => this.populate());
    }

    async populate() {
        console.log(db.employees.toArray());
    }
}

export const db = new AppDatabase();
