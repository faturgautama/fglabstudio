import { inject } from '@angular/core';
import { from } from 'rxjs';
import { UtilityService } from './utility';
import Dexie from 'dexie';
import { DatabaseService } from '../../app.database';

export abstract class BaseActionService<T extends { id?: number; is_active?: boolean }> {
    protected _utilityService = inject(UtilityService);
    private dbService = inject(DatabaseService);
    protected abstract table: Dexie.Table<T, number>;
    private readonly DEFAULT_DELAY = 2500;

    /** Lazy getter — ambil db hanya ketika dipanggil */
    protected get db() {
        if (!this.dbService.db) {
            throw new Error('Database belum diinisialisasi. Pastikan DatabaseService.init() sudah dipanggil.');
        }
        return this.dbService.db;
    }

    protected withLoading<R>(operation: () => Promise<R>, delayMs = this.DEFAULT_DELAY) {
        return from(operation()).pipe(this._utilityService.withLoading(delayMs));
    }

    /**
     * Resolves foreign key references by finding related tables
     * Looks for properties ending with '_id' and fetches the related record
    */
    private async resolveRelations(record: T): Promise<any> {
        const enriched: any = { ...record };
        const keys = Object.keys(record) as (keyof T)[];

        for (const key of keys) {
            const keyStr = String(key);
            // Check if property ends with '_id' (e.g., department_id, position_id, shift_id)
            if (keyStr.endsWith('_id')) {
                const tableName = keyStr.replace('_id', '') == 'employee' ? 'employees' : keyStr.replace('_id', ''); // Remove '_id' suffix
                const foreignKeyValue = record[key];

                // Get the related table dynamically
                const relatedTable: any = (this.db as any)[tableName];

                if (relatedTable && foreignKeyValue) {
                    try {
                        const relatedRecord = await relatedTable.get(Number(foreignKeyValue));

                        if (relatedRecord) {
                            // Add the full related object with a key without '_id'
                            enriched[tableName] = relatedRecord;
                        }
                    } catch (error) {
                        console.error(`Error fetching related ${tableName}:`, error);
                    }
                }
            }
        }

        return enriched;
    }

    /**
     * Resolves relations for multiple records
     */
    private async resolveMultipleRelations(records: T[]): Promise<any[]> {
        return Promise.all(records.map(record => this.resolveRelations(record)));
    }

    getAll() {
        return this.withLoading(async () => {
            const result = await this.table.toArray();
            const filtered = result.filter(item => item.is_active !== false);
            return this.resolveMultipleRelations(filtered);
        });
    }

    getById(id: number) {
        return this.withLoading(async () => {
            const record = await this.table.get(id);
            if (!record) return null;
            return this.resolveRelations(record);
        });
    }

    add(entity: T) {
        const { id, ...payload } = {
            ...entity,
            created_at: new Date(),
            is_active: true,
        };

        return this.withLoading(() => this.table.add(payload as T));
    }

    update(id: number, changes: Partial<T>) {
        return this.withLoading(() => this.table.update(id, { ...changes, updated_at: new Date() } as any));
    }

    delete(id: number) {
        return this.withLoading(() => this.table.update(id, { is_active: false, is_delete: true } as any));
    }

    bulkAdd(entities: T[]) {
        const payload = entities.map(e => ({ ...e, created_at: new Date() }));
        return from(this.table.bulkAdd(payload));
    }

    /**
   * Fetch by specific column with relations resolved
   * Example: getByColumn('email', 'user@example.com')
   */
    getByColumn(column: keyof T, value: any) {
        return this.withLoading(async () => {
            const records = await (this.table as any).where(column).equals(value).toArray();
            if (records.length === 0) return null;
            return this.resolveRelations(records[0]);
        });
    }

    /**
     * Get all filtered by column with relations resolved
     */
    getAllByColumn(column: keyof T, value: any) {
        return this.withLoading(async () => {
            const records = await (this.table as any).where(column).equals(value).toArray();
            const filtered = records.filter((item: any) => item.is_active !== false);
            return this.resolveMultipleRelations(filtered);
        });
    }
}
