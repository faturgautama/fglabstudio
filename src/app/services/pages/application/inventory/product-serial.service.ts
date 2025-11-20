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

    addMultiple(serials: InventoryModel.ProductSerial[]) {
        const serialsWithDate = serials.map(s => ({
            ...s,
            created_at: new Date()
        }));
        return from(this.databaseService.db.product_serials.bulkAdd(serialsWithDate as any));
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
