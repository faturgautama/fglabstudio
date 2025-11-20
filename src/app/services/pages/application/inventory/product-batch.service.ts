// src/app/services/pages/application/inventory/product-batch.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductBatchService {
    private databaseService = inject(DatabaseService);

    add(batch: InventoryModel.ProductBatch) {
        batch.created_at = new Date();
        return from(this.databaseService.db.product_batches.add(batch as any));
    }

    getAll() {
        return from(this.databaseService.db.product_batches.toArray());
    }

    getById(id: number | string) {
        return from(this.databaseService.db.product_batches.get(id as any));
    }

    getByProduct(product_id: string) {
        return from(
            this.databaseService.db.product_batches
                .where('product_id')
                .equals(product_id)
                .and(batch => batch.is_active)
                .toArray()
        );
    }

    getActiveBatches(product_id: string) {
        return from(
            this.databaseService.db.product_batches
                .where('product_id')
                .equals(product_id)
                .and(batch => batch.is_active && batch.quantity > 0)
                .toArray()
        );
    }

    update(id: number | string, changes: Partial<InventoryModel.ProductBatch>) {
        return from(this.databaseService.db.product_batches.update(id as any, changes as any));
    }

    delete(id: number | string) {
        return from(this.databaseService.db.product_batches.delete(id as any));
    }

    updateQuantity(id: number, quantity: number) {
        return from(this.databaseService.db.product_batches.update(id, { quantity }));
    }
}
