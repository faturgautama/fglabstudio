import { inject } from '@angular/core';
import { from } from 'rxjs';
import { UtilityService } from './utility';
import Dexie from 'dexie';

export abstract class BaseActionService<T extends { id?: number; is_active?: boolean }> {
    protected _utilityService = inject(UtilityService);
    protected abstract table: Dexie.Table<T, number>;
    private readonly DEFAULT_DELAY = 2500;

    protected withLoading<R>(operation: () => Promise<R>, delayMs = this.DEFAULT_DELAY) {
        return from(operation()).pipe(this._utilityService.withLoading(delayMs));
    }

    getAll() {
        return this.withLoading(() =>
            this.table.toArray().then(result => result.filter(item => item.is_active !== false))
        );
    }

    getById(id: number) {
        return this.withLoading(() => this.table.get(id));
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
        return this.withLoading(() => this.table.update(id, { is_active: false } as any));
    }

    bulkAdd(entities: T[]) {
        const payload = entities.map(e => ({ ...e, created_at: new Date() }));
        return from(this.table.bulkAdd(payload));
    }
}
