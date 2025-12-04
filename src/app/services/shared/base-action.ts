import { inject } from '@angular/core';
import { from, catchError, throwError } from 'rxjs';
import { UtilityService } from './utility';
import Dexie from 'dexie';
import { DatabaseService } from '../../app.database';
import { formatDate } from '@angular/common';

export abstract class BaseActionService<T extends { id?: number; is_active?: boolean }> {
    protected _utilityService = inject(UtilityService);
    private dbService = inject(DatabaseService);
    protected abstract table: Dexie.Table<T, number>;
    private readonly DEFAULT_DELAY = 2500;
    private readonly MAX_RETRIES = 3;
    private readonly RETRY_DELAY = 1000; // ms

    protected get db() {
        if (!this.dbService.db) {
            throw new Error('Database belum diinisialisasi.');
        }
        return this.dbService.db;
    }

    /**
     * ✅ Retry logic untuk mengatasi race condition
     * Coba operasi berkali-kali jika terjadi error akibat database switching
     */
    private async retryOperation<R>(
        operation: () => Promise<R>,
        retries = this.MAX_RETRIES
    ): Promise<R> {
        for (let i = 0; i < retries; i++) {
            try {
                return await operation();
            } catch (err: any) {
                const isLastAttempt = i === retries - 1;
                const isDatabaseError = err?.message?.includes('Database') ||
                    err?.message?.includes('database') ||
                    err?.name === 'VersionChangeError';

                if (isDatabaseError && !isLastAttempt) {
                    console.warn(`⚠️ Database error (retry ${i + 1}/${retries}):`, err.message);
                    await this.delay(this.RETRY_DELAY);
                    await this.dbService.ensureReady();
                    continue;
                }

                throw err;
            }
        }
        throw new Error('Operation failed after max retries');
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ✅ Semua operasi harus call ensureReady() dulu dengan retry logic
    protected withLoading<R>(operation: () => Promise<R>, delayMs = this.DEFAULT_DELAY) {
        return from((async () => {
            await this.dbService.ensureReady(); // ✅ Pastikan DB ready
            return await this.retryOperation(operation);
        })()).pipe(
            this._utilityService.withLoading(delayMs),
            catchError((err: any) => {
                console.error('❌ Operation failed:', err);
                return throwError(() => new Error(`Database operation failed: ${err.message}`));
            })
        );
    }

    /**
     * Resolves foreign key references by finding related tables
     * Looks for properties ending with '_id' and fetches the related record
    */
    async resolveRelations(record: T): Promise<any> {
        const enriched: any = { ...record };
        const keys = Object.keys(record) as (keyof T)[];

        for (const key of keys) {
            const keyStr = String(key);
            // Check if property ends with '_id' (e.g., department_id, position_id, shift_id)
            if (keyStr.endsWith('_id')) {
                let tableName = "";

                // keyStr.replace('_id', '') == 'employee' ? 'employees' : keyStr.replace('_id', ''); // Remove '_id' suffix

                if (keyStr.replace('_id', '') === 'employee') {
                    tableName = 'employees';
                } else if (keyStr.replace('_id', '') === 'category') {
                    tableName = 'categories';
                } else if (keyStr.replace('_id', '') === 'supplier') {
                    tableName = 'suppliers';
                } else if (keyStr.replace('_id', '') === 'warehouse') {
                    tableName = 'warehouses';
                }

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
    async resolveMultipleRelations(records: T[]): Promise<any[]> {
        return Promise.all(records.map(record => this.resolveRelations(record)));
    }

    getAll(filter?: any, sort?: any) {
        return this.withLoading(async () => {
            const result = await this.table.toArray();
            let filtered = result.filter(item => item.is_active !== false);

            if (filter) {
                for (const key in filter) {
                    if (filter[key]) {
                        filtered = filtered.filter((item: T) => {
                            const value = item[key as keyof T];

                            if (filter[key] instanceof Date) {
                                const filterValue = formatDate(filter[key], 'yyyy-MM-dd', 'EN');
                                const values = formatDate(new Date(value as any), 'yyyy-MM-dd', 'EN');
                                return new Date(values as any).getTime() == new Date(filterValue)?.getTime();
                            };

                            if (typeof value === 'string' && typeof filter[key] === 'string') {
                                return value.toLowerCase().includes(filter[key]?.toLowerCase() || '');
                            };

                            return value == filter[key];
                        });
                    }
                }
            }

            if (sort) {
                filtered = filtered.sort((a: T, b: T) => {
                    const valueA = a[sort.sort_by as keyof T];
                    const valueB = b[sort.sort_by as keyof T];

                    let comparison = 0;

                    if (typeof valueA === 'number' && typeof valueB === 'number') {
                        comparison = valueA - valueB;
                    } else if (valueA instanceof Date && valueB instanceof Date) {
                        comparison = valueA.getTime() - valueB.getTime();
                    } else if (typeof valueA === 'string' && typeof valueB === 'string') {
                        comparison = valueA.localeCompare(valueB);
                    } else {
                        comparison = String(valueA).localeCompare(String(valueB));
                    }

                    // Support both 'asc'/'desc' and 'Ascending'/'Descending' formats
                    const sortType = sort.sort_type?.toLowerCase() || 'asc';
                    return sortType === 'asc' || sortType === 'ascending' ? comparison : -comparison;
                });
            }

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

        console.log("payload =>", payload);

        return this.withLoading(async () => await this.table.add(payload as T));
    }

    update(id: number, changes: Partial<T>) {
        return this.withLoading(async () => await this.table.update(id, { ...changes, updated_at: new Date() } as any));
    }

    delete(id: number) {
        return this.withLoading(async () => await this.table.update(id, { is_active: false, is_delete: true } as any));
    }

    bulkAdd(entities: T[]) {
        const payload = entities.map(e => ({ ...e, created_at: new Date() }));
        return this.withLoading(async () => await this.table.bulkAdd(payload));
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
