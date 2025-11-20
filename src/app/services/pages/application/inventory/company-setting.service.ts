// src/app/services/pages/application/inventory/company-setting.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanySettingInventoryService {
    private databaseService = inject(DatabaseService);

    add(setting: InventoryModel.Company) {
        setting.created_at = new Date();
        setting.updated_at = new Date();
        return from(this.databaseService.db.inventory_setting.add(setting as any));
    }

    getAll() {
        return from(this.databaseService.db.inventory_setting.toArray());
    }

    getById(id: number | string) {
        return from(this.databaseService.db.inventory_setting.get(id as any));
    }

    update(id: number | string, changes: Partial<InventoryModel.Company>) {
        changes.updated_at = new Date();
        return from(this.databaseService.db.inventory_setting.update(id as any, changes as any));
    }

    delete(id: number | string) {
        return from(this.databaseService.db.inventory_setting.delete(id as any));
    }

    clear() {
        return from(this.databaseService.db.inventory_setting.clear());
    }
}