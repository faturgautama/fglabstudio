import Dexie, { Table } from 'dexie';
import { EmployeeModel } from './model/pages/application/human-resource/employee.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InventoryModel } from './model/pages/application/inventory/inventory.model';

export class AppDatabase extends Dexie {
    // HR
    hr_setting!: Table<EmployeeModel.IHumanResourceSetting, number>;
    department!: Table<EmployeeModel.IDepartment, number>;
    position!: Table<EmployeeModel.IPosition, number>;
    shift!: Table<EmployeeModel.IShift, number>;
    attendance!: Table<EmployeeModel.IAttendance, number>;
    leave!: Table<EmployeeModel.ILeave, number>;
    overtime!: Table<EmployeeModel.IOvertime, number>;
    payroll!: Table<EmployeeModel.IPayroll, number>;
    employees!: Table<EmployeeModel.IEmployee, number>;

    // Inventory
    inventory_setting!: Table<InventoryModel.Company, number>;
    categories!: Table<InventoryModel.Category, number>;
    products!: Table<InventoryModel.Product, number>;
    stock_cards!: Table<InventoryModel.StockCard, number>;
    suppliers!: Table<InventoryModel.Supplier, number>;
    purchase_orders!: Table<InventoryModel.PurchaseOrder, number>;
    purchase_order_items!: Table<InventoryModel.PurchaseOrderItem, number>;
    stock_movements!: Table<InventoryModel.StockMovement, number>;
    warehouses!: Table<InventoryModel.Warehouse, number>;
    notifications!: Table<InventoryModel.Notification, number>;
    settings!: Table<InventoryModel.AppSettings, number>;
    product_batches!: Table<InventoryModel.ProductBatch, number>;
    product_serials!: Table<InventoryModel.ProductSerial, number>;
    stock_opnames!: Table<InventoryModel.StockOpname, number>;
    stock_opname_items!: Table<InventoryModel.StockOpnameItem, number>;

    constructor(dbName: string) {
        super(dbName);

        this.version(2).stores({
            // ** HR Tables **
            hr_setting: '++id, company_name, effective_date, is_active',
            department: '++id, code, title, is_active',
            position: '++id, code, title, is_active',
            shift: '++id, code, title, is_active',
            attendance: '++id, employee_id, shift_id, date',
            leave: '++id, employee_id, leave_policy_id, start_date, end_date, status',
            overtime: '++id, employee_id, date, start_date, end_date, overtime_type, status',
            payroll: '++id, employee_id, month, base_salary, payment_status',
            employees: '++id, employee_code, full_name, department_id, position_id, employment_status, work_status, is_active',

            // ** Inventory Tables **
            company: 'id',
            categories: 'id, name',
            products: 'id, sku, name, category_id, current_stock, min_stock, barcode, brand, is_active',
            stock_cards: 'id, product_id, transaction_date, type, reference_id',
            suppliers: 'id, name, code, is_active',
            purchase_orders: 'id, po_number, supplier_id, status, order_date',
            purchase_order_items: 'id, purchase_order_id, product_id',
            stock_movements: 'id, movement_number, product_id, type, movement_date',
            warehouses: 'id, code, name, is_default, is_active',
            notifications: 'id, type, priority, is_read, created_at, product_id',
            settings: 'id, key',
            product_batches: 'id, product_id, batch_number, expiry_date, is_active',
            product_serials: 'id, product_id, serial_number, status',
            stock_opnames: 'id, opname_number, status, opname_date',
            stock_opname_items: 'id, stock_opname_id, product_id'
        });
    }
}

@Injectable({ providedIn: 'root' })
export class DatabaseService {
    db!: AppDatabase;
    private currentDbName = 'CodeByXerenityDatabase';
    private switchPromise: Promise<void> | null = null;
    private dbReadySubject = new BehaviorSubject<boolean>(false);
    public dbReady$ = this.dbReadySubject.asObservable();

    constructor() {
        this.db = new AppDatabase(this.currentDbName);
        this.initializeDb();
    }

    private async initializeDb(): Promise<void> {
        try {
            await this.db.open();
            this.dbReadySubject.next(true);
        } catch (err) {
            console.error('❌ Gagal inisialisasi database:', err);
            this.dbReadySubject.next(false);
        }
    }

    /**
     * ✅ Pastikan DB ready sebelum operasi dengan error handling
     */
    async ensureReady(): Promise<void> {
        // Tunggu switching selesai jika sedang berlangsung
        if (this.switchPromise) {
            await this.switchPromise;
        }

        // Jika DB belum open, coba buka
        if (!this.db.isOpen()) {
            try {
                await this.db.open();
                this.dbReadySubject.next(true);
            } catch (err) {
                console.error('❌ Gagal membuka database:', err);
                this.dbReadySubject.next(false);
                throw new Error('Database tidak siap');
            }
        }
    }

    /**
     * ✅ Ganti database aktif sesuai user login dengan proper locking
     */
    async switchToUserDatabase(userId: string): Promise<void> {
        const newDbName = `CodeByXerenityDatabase`;

        if (this.currentDbName === newDbName) return;

        // ✅ Jika sudah ada switching, tunggu dulu
        if (this.switchPromise) {
            await this.switchPromise;
        }

        // ✅ Tandai sedang proses switching
        this.dbReadySubject.next(false);

        this.switchPromise = (async () => {
            console.log(`🔄 Switching IndexedDB: ${this.currentDbName} → ${newDbName}`);

            try {
                // Close DB lama
                if (this.db?.isOpen()) {
                    await this.db.close();
                }

                // Buat instance DB baru
                this.db = new AppDatabase(newDbName);
                await this.db.open();
                this.currentDbName = newDbName;

                console.log(`✅ Database aktif: ${newDbName}`);
                this.dbReadySubject.next(true);
            } catch (err) {
                console.error('❌ Gagal switch database:', err);
                // Fallback ke DB default
                this.db = new AppDatabase('CodeByXerenityDatabase');
                this.currentDbName = 'CodeByXerenityDatabase';
                try {
                    await this.db.open();
                    this.dbReadySubject.next(true);
                } catch (fallbackErr) {
                    console.error('❌ Gagal fallback ke DB default:', fallbackErr);
                    this.dbReadySubject.next(false);
                }
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