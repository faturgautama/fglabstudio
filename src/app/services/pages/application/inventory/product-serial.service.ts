// src/app/services/pages/application/inventory/product-serial.service.ts
import { inject, Injectable } from '@angular/core';
import { DatabaseService } from '../../../../app.database';
import { InventoryModel } from '../../../../model/pages/application/inventory/inventory.model';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductSerialService {
    private databaseService = inject(DatabaseService);

    add(serial: InventoryModel.ProductSerial) {
        serial.created_at = new Date();
        return from(this.databaseService.db.product_serials.add(serial as any));
    }

    async addMultiple(serials: InventoryModel.ProductSerial[]) {
        const serialsWithDate = serials.map(s => ({
            ...s,
            created_at: new Date()
        }));
        return await this.databaseService.db.product_serials.bulkAdd(serialsWithDate as any);
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

    getAll() {
        return from(this.databaseService.db.product_serials.toArray());
    }

    getById(id: number | string) {
        return from(this.databaseService.db.product_serials.get(id as any));
    }

    getBySerialNumber(serial_number: string) {
        return from(
            this.databaseService.db.product_serials
                .where('serial_number')
                .equals(serial_number)
                .first()
        );
    }

    getByProduct(product_id: number) {
        return from(
            this.databaseService.db.product_serials
                .where('product_id')
                .equals(product_id)
                .toArray()
        );
    }

    getByStatus(status: InventoryModel.ProductSerial['status']) {
        return from(
            this.databaseService.db.product_serials
                .where('status')
                .equals(status)
                .toArray()
        );
    }

    update(id: number | string, changes: Partial<InventoryModel.ProductSerial>) {
        return from(this.databaseService.db.product_serials.update(id as any, changes as any));
    }

    updateStatus(serial_number: string, status: InventoryModel.ProductSerial['status']) {
        return from(
            this.databaseService.db.product_serials
                .where('serial_number')
                .equals(serial_number)
                .modify({ status })
        );
    }

    delete(id: number | string) {
        return from(this.databaseService.db.product_serials.delete(id as any));
    }
}
