// src/app/services/pages/application/inventory/batch-allocation.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';

export interface BatchAllocation {
    batch_id: number;
    batch_number: string;
    qty_allocated: number;
    expiry_date?: Date;
}

@Injectable({ providedIn: 'root' })
export class BatchAllocationService {
    private databaseService = inject(DatabaseService);

    /**
     * Allocate stock dari batch menggunakan FIFO atau FEFO
     * @param product_id - ID produk
     * @param qty_needed - Jumlah yang dibutuhkan
     * @param method - FIFO (First In First Out) atau FEFO (First Expired First Out)
     * @returns Array of batch allocations
     */
    async allocateBatch(
        product_id: number,
        qty_needed: number,
        method: 'FIFO' | 'FEFO' = 'FIFO'
    ): Promise<BatchAllocation[]> {

        // Get all active batches with stock
        const batches = await this.databaseService.db.product_batches
            .where('product_id')
            .equals(product_id.toString())
            .and(b => b.is_active && b.quantity > 0)
            .toArray();

        if (batches.length === 0) {
            throw new Error('No active batches available for this product');
        }

        // Sort batches based on method
        if (method === 'FIFO') {
            // Sort by created_at (oldest first)
            batches.sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return dateA - dateB;
            });
        } else {
            // FEFO: Sort by expiry_date (earliest expiry first)
            batches.sort((a, b) => {
                if (!a.expiry_date) return 1;
                if (!b.expiry_date) return -1;
                const dateA = new Date(a.expiry_date).getTime();
                const dateB = new Date(b.expiry_date).getTime();
                return dateA - dateB;
            });
        }

        const allocations: BatchAllocation[] = [];
        let remaining = qty_needed;

        // Allocate from batches
        for (const batch of batches) {
            if (remaining <= 0) break;

            const allocated = Math.min(batch.quantity, remaining);

            allocations.push({
                batch_id: batch.id!,
                batch_number: batch.batch_number,
                qty_allocated: allocated,
                expiry_date: batch.expiry_date
            });

            // Update batch quantity
            await this.databaseService.db.product_batches.update(batch.id!, {
                quantity: batch.quantity - allocated
            });

            remaining -= allocated;
        }

        // Check if we have enough stock
        if (remaining > 0) {
            throw new Error(`Insufficient stock in batches. Need ${qty_needed}, available ${qty_needed - remaining}`);
        }

        return allocations;
    }

    /**
     * Get available batches for a product
     */
    async getAvailableBatches(product_id: number): Promise<InventoryModel.ProductBatch[]> {
        return await this.databaseService.db.product_batches
            .where('product_id')
            .equals(product_id.toString())
            .and(b => b.is_active && b.quantity > 0)
            .toArray();
    }

    /**
     * Get expiring batches within specified days
     */
    async getExpiringBatches(days = 30): Promise<InventoryModel.ProductBatch[]> {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        const allBatches = await this.databaseService.db.product_batches
            .where('is_active')
            .equals(1)
            .and(b => b.quantity > 0)
            .toArray();

        return allBatches.filter(batch => {
            if (!batch.expiry_date) return false;
            const expiryDate = new Date(batch.expiry_date);
            return expiryDate <= futureDate && expiryDate >= new Date();
        });
    }

    /**
     * Get batch details with product info
     */
    async getBatchWithProduct(batch_id: number): Promise<any> {
        const batch = await this.databaseService.db.product_batches.get(batch_id);
        if (!batch) return null;

        const product = await this.databaseService.db.products.get(Number(batch.product_id));

        return {
            ...batch,
            product
        };
    }
}
