// src/app/services/pages/application/inventory/warehouse.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { BaseActionService } from '../../../shared/base-action';

@Injectable({ providedIn: 'root' })
export class WarehouseService extends BaseActionService<InventoryModel.Warehouse> {
    private databaseService = inject(DatabaseService);
    protected override table = this.databaseService.db.warehouses;

    /**
     * Get default warehouse
     */
    getDefaultWarehouse() {
        return this.withLoading(async () => {
            return await this.databaseService.db.warehouses
                .filter(w => w.is_default && w.is_active)
                .first();
        });
    }

    /**
     * Set as default warehouse
     */
    setAsDefault(id: number) {
        return this.withLoading(async () => {
            // Unset all other defaults
            const all_warehouses = await this.databaseService.db.warehouses.toArray();
            for (const warehouse of all_warehouses) {
                if (warehouse.id && warehouse.id !== id) {
                    await this.databaseService.db.warehouses.update(warehouse.id, {
                        is_default: false
                    });
                }
            }

            // Set this as default
            return await this.databaseService.db.warehouses.update(id, {
                is_default: true
            });
        });
    }
}