// src/app/services/pages/application/inventory/serial-allocation.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';

@Injectable({ providedIn: 'root' })
export class SerialAllocationService {
    private databaseService = inject(DatabaseService);

    /**
     * Allocate serial numbers for stock out
     * @param product_id - ID produk
     * @param qty_needed - Jumlah yang dibutuhkan
     * @param specific_serials - Optional: specific serial numbers to allocate
     * @returns Array of allocated serial numbers
     */
    async allocateSerials(
        product_id: number,
        qty_needed: number,
        specific_serials?: string[]
    ): Promise<string[]> {

        if (specific_serials && specific_serials.length > 0) {
            // Validate specific serials
            if (specific_serials.length !== qty_needed) {
                throw new Error(`Must provide exactly ${qty_needed} serial numbers`);
            }

            // Check if all serials exist and are IN_STOCK
            for (const sn of specific_serials) {
                const serial = await this.databaseService.db.product_serials
                    .where('serial_number')
                    .equals(sn)
                    .first();

                if (!serial) {
                    throw new Error(`Serial number ${sn} not found`);
                }

                if (serial.product_id !== product_id) {
                    throw new Error(`Serial number ${sn} belongs to different product`);
                }

                if (serial.status !== 'IN_STOCK') {
                    throw new Error(`Serial number ${sn} is not available (status: ${serial.status})`);
                }
            }

            // Update status to SOLD
            for (const sn of specific_serials) {
                await this.databaseService.db.product_serials
                    .where('serial_number')
                    .equals(sn)
                    .modify({
                        status: 'SOLD',
                        sold_date: new Date()
                    });
            }

            return specific_serials;
        } else {
            // Auto allocate (FIFO - oldest first)
            const serials = await this.databaseService.db.product_serials
                .where('product_id')
                .equals(product_id)
                .and(s => s.status === 'IN_STOCK')
                .limit(qty_needed)
                .toArray();

            if (serials.length < qty_needed) {
                throw new Error(`Insufficient serial numbers. Need ${qty_needed}, available ${serials.length}`);
            }

            // Update status to SOLD
            const serial_numbers: string[] = [];
            for (const serial of serials) {
                await this.databaseService.db.product_serials.update(serial.id!, {
                    status: 'SOLD',
                    sold_date: new Date()
                });
                serial_numbers.push(serial.serial_number);
            }

            return serial_numbers;
        }
    }

    /**
     * Validate serial numbers uniqueness
     */
    async validateSerialNumbers(serial_numbers: string[]): Promise<{ valid: boolean; errors: string[] }> {
        const errors: string[] = [];

        // Check for duplicates in input
        const duplicates = serial_numbers.filter((item, index) => serial_numbers.indexOf(item) !== index);
        if (duplicates.length > 0) {
            errors.push(`Duplicate serial numbers found: ${duplicates.join(', ')}`);
        }

        // Check if serial already exists in database
        for (const sn of serial_numbers) {
            const existing = await this.databaseService.db.product_serials
                .where('serial_number')
                .equals(sn)
                .first();

            if (existing) {
                errors.push(`Serial number ${sn} already exists in system`);
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Get available serial numbers for a product
     */
    async getAvailableSerials(product_id: number): Promise<InventoryModel.ProductSerial[]> {
        return await this.databaseService.db.product_serials
            .where('product_id')
            .equals(product_id)
            .and(s => s.status === 'IN_STOCK')
            .toArray();
    }

    /**
     * Get serial number history
     */
    async getSerialHistory(serial_number: string): Promise<any> {
        const serial = await this.databaseService.db.product_serials
            .where('serial_number')
            .equals(serial_number)
            .first();

        if (!serial) return null;

        const product = await this.databaseService.db.products.get(serial.product_id!);

        // Get stock card movements related to this serial
        const movements = await this.databaseService.db.stock_cards
            .where('serial_number')
            .equals(serial_number)
            .toArray();

        return {
            serial,
            product,
            movements
        };
    }

    /**
     * Return serial number (change status back to IN_STOCK)
     */
    async returnSerial(serial_number: string, reason?: string): Promise<void> {
        const serial = await this.databaseService.db.product_serials
            .where('serial_number')
            .equals(serial_number)
            .first();

        if (!serial) {
            throw new Error(`Serial number ${serial_number} not found`);
        }

        await this.databaseService.db.product_serials.update(serial.id!, {
            status: 'RETURNED',
            notes: reason || serial.notes
        });
    }

    /**
     * Mark serial as damaged
     */
    async markAsDamaged(serial_number: string, reason?: string): Promise<void> {
        const serial = await this.databaseService.db.product_serials
            .where('serial_number')
            .equals(serial_number)
            .first();

        if (!serial) {
            throw new Error(`Serial number ${serial_number} not found`);
        }

        await this.databaseService.db.product_serials.update(serial.id!, {
            status: 'DAMAGED',
            notes: reason || serial.notes
        });
    }

    /**
     * Get count of serials by status
     */
    async getSerialCountByStatus(product_id: number): Promise<Record<string, number>> {
        const serials = await this.databaseService.db.product_serials
            .where('product_id')
            .equals(product_id)
            .toArray();

        const counts: Record<string, number> = {
            IN_STOCK: 0,
            SOLD: 0,
            DAMAGED: 0,
            RETURNED: 0
        };

        serials.forEach(serial => {
            counts[serial.status] = (counts[serial.status] || 0) + 1;
        });

        return counts;
    }
}
