// src/app/services/pages/application/inventory/supplier.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { BaseActionService } from '../../../shared/base-action';

@Injectable({ providedIn: 'root' })
export class SupplierService extends BaseActionService<InventoryModel.Supplier> {
    private databaseService = inject(DatabaseService);
    protected override table = this.databaseService.db.suppliers;

    /**
     * Generate supplier code
     */
    generateSupplierCode() {
        return this.withLoading(async () => {
            const count = await this.databaseService.db.suppliers.count();
            return `SUP${String(count + 1).padStart(4, '0')}`;
        });
    }

    /**
     * Get active suppliers
     */
    getActiveSuppliers() {
        return this.withLoading(async () => {
            return await this.databaseService.db.suppliers
                .filter(s => s.is_active)
                .toArray();
        });
    }

    /**
     * Get supplier performance (total orders & amount)
     */
    getSupplierPerformance(supplier_id: string) {
        return this.withLoading(async () => {
            const orders = await this.databaseService.db.purchase_orders
                .where('supplier_id')
                .equals(supplier_id)
                .toArray();

            const total_orders = orders.length;
            const total_amount = orders.reduce((sum, o) => sum + o.total_amount, 0);

            const completed_orders = orders.filter(o => o.status === 'RECEIVED');
            const avg_lead_time = completed_orders.length > 0
                ? completed_orders.reduce((sum, o) => {
                    if (o.received_date && o.order_date) {
                        const diff = new Date(o.received_date).getTime() - new Date(o.order_date).getTime();
                        return sum + (diff / (1000 * 60 * 60 * 24)); // days
                    }
                    return sum;
                }, 0) / completed_orders.length
                : 0;

            return {
                total_orders,
                total_amount,
                average_lead_time: Math.round(avg_lead_time)
            };
        });
    }
}