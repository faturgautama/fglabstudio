import Dexie, { Table } from 'dexie';
import { EmployeeModel } from './model/pages/application/human-resource/employee.model';
import { Injectable } from '@angular/core';

export class AppDatabase extends Dexie {
    hr_setting!: Table<EmployeeModel.IHumanResourceSetting, number>;
    department!: Table<EmployeeModel.IDepartment, number>;
    position!: Table<EmployeeModel.IPosition, number>;
    shift!: Table<EmployeeModel.IShift, number>;
    attendance!: Table<EmployeeModel.IAttendance, number>;
    leave!: Table<EmployeeModel.ILeave, number>;
    payroll!: Table<EmployeeModel.IPayroll, number>;
    employees!: Table<EmployeeModel.IEmployee, number>;

    constructor(dbName: string) {
        super(dbName);

        this.version(2).stores({
            hr_setting: '++id, company_name, effective_date, is_active',
            department: '++id, code, title, is_active',
            position: '++id, code, title, is_active',
            shift: '++id, code, title, is_active',
            attendance: '++id, employee_id, shift_id, date',
            leave: '++id, employee_id, leave_policy_id, start_date, end_date, status',
            overtime: '++id, employee_id, date, start_date, end_date, overtime_type, status',
            payroll: '++id, employee_id, month, base_salary, payment_status',
            employees: '++id, employee_code, full_name, department_id, position_id, employment_status, work_status, is_active'
        });
    }
}

@Injectable({ providedIn: 'root' })
export class DatabaseService {
    db!: AppDatabase;
    private currentDbName = 'CodeByXerenityDatabase';
    private switchPromise: Promise<void> | null = null; // ✅ Track switching state

    constructor() {
        this.db = new AppDatabase(this.currentDbName);
    }

    /**
     * ✅ Pastikan DB ready sebelum operasi
     */
    async ensureReady(): Promise<void> {
        if (this.switchPromise) {
            await this.switchPromise; // Tunggu switching selesai
        }

        if (!this.db.isOpen()) {
            await this.db.open();
        }
    }

    /**
     * Ganti database aktif sesuai user login
     */
    async switchToUserDatabase(userId: string): Promise<void> {
        const newDbName = `CodeByXerenityDatabase_${userId}`;

        if (this.currentDbName === newDbName) return;

        // ✅ Tandai sedang proses switching
        this.switchPromise = (async () => {
            console.log(`🔄 Switching IndexedDB: ${this.currentDbName} → ${newDbName}`);

            try {
                if (this.db?.isOpen()) {
                    await this.db.close();
                }

                this.db = new AppDatabase(newDbName);
                await this.db.open();
                this.currentDbName = newDbName;

                console.log(`✅ Database aktif: ${newDbName}`);
            } catch (err) {
                console.error('❌ Gagal switch database:', err);
                this.db = new AppDatabase('CodeByXerenityDatabase');
                this.currentDbName = 'CodeByXerenityDatabase';
                await this.db.open();
            } finally {
                this.switchPromise = null; // ✅ Selesai switching
            }
        })();

        await this.switchPromise;
    }

    /**
     * Reset ke DB default
     */
    async resetToDefaultDatabase(): Promise<void> {
        await this.ensureReady(); // Pastikan tidak ada operasi pending

        if (this.db?.isOpen()) await this.db.close();

        this.currentDbName = 'CodeByXerenityDatabase';
        this.db = new AppDatabase(this.currentDbName);
        await this.db.open();

        console.log('🔁 Reset ke DB default kosong.');
    }
}