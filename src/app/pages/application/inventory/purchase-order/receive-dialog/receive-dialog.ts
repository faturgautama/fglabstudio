import { Component, EventEmitter, inject, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';

interface ReceiveItem {
    id: number;
    product_id: number;
    product?: any;
    qty_ordered: number;
    qty_received: number;
    qty_to_receive: number;
    batch_number?: string;
    expiry_date?: Date;
    serial_input?: string;
    serial_numbers?: string[];
}

@Component({
    selector: 'app-receive-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        InputNumberModule,
        InputTextModule,
        TextareaModule,
        DatePickerModule
    ],
    templateUrl: './receive-dialog.html'
})
export class ReceiveDialog implements OnChanges {
    @Input() visible = false;
    @Input() poData: any = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onReceiveComplete = new EventEmitter<any>();

    receiveItems: ReceiveItem[] = [];
    validationErrors: string[] = [];

    ngOnChanges() {
        if (this.visible && this.poData) {
            this.initializeItems();
        }
    }

    initializeItems() {
        this.receiveItems = (this.poData.items || []).map((item: any) => ({
            id: item.id,
            product_id: item.product_id,
            product: item.product,
            qty_ordered: item.qty_ordered,
            qty_received: item.qty_received,
            qty_to_receive: Math.max(0, item.qty_ordered - item.qty_received),
            batch_number: '',
            expiry_date: undefined,
            serial_input: '',
            serial_numbers: []
        }));
    }

    onQtyChange(item: ReceiveItem) {
        // Reset batch/serial if qty becomes 0
        if (item.qty_to_receive === 0) {
            item.batch_number = '';
            item.expiry_date = undefined;
            item.serial_input = '';
            item.serial_numbers = [];
        }
        this.validateItems();
    }

    parseSerials(item: ReceiveItem) {
        if (!item.serial_input) {
            item.serial_numbers = [];
            return;
        }

        // Split by newline and filter empty
        item.serial_numbers = item.serial_input
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        this.validateItems();
    }

    validateItems(): boolean {
        this.validationErrors = [];

        for (const item of this.receiveItems) {
            if (item.qty_to_receive === 0) continue;

            const productName = item.product?.name || 'Unknown Product';

            // Validate batch tracking
            if (item.product?.is_batch_tracked) {
                if (!item.batch_number) {
                    this.validationErrors.push(`${productName}: Batch number is required`);
                }
                if (item.product?.is_perishable && !item.expiry_date) {
                    this.validationErrors.push(`${productName}: Expiry date is required`);
                }
            }

            // Validate serial tracking
            if (item.product?.is_serial_tracked) {
                if (!item.serial_numbers || item.serial_numbers.length === 0) {
                    this.validationErrors.push(`${productName}: Serial numbers are required`);
                } else if (item.serial_numbers.length !== item.qty_to_receive) {
                    this.validationErrors.push(
                        `${productName}: Expected ${item.qty_to_receive} serial numbers, got ${item.serial_numbers.length}`
                    );
                }

                // Check for duplicates
                if (item.serial_numbers && item.serial_numbers.length > 0) {
                    const duplicates = item.serial_numbers.filter(
                        (sn, index) => item.serial_numbers!.indexOf(sn) !== index
                    );
                    if (duplicates.length > 0) {
                        this.validationErrors.push(
                            `${productName}: Duplicate serial numbers found: ${duplicates.join(', ')}`
                        );
                    }
                }
            }
        }

        return this.validationErrors.length === 0;
    }

    canReceive(): boolean {
        // Check if any item has qty to receive
        const hasQty = this.receiveItems.some(item => item.qty_to_receive > 0);
        if (!hasQty) return false;

        // Validate all items
        return this.validateItems();
    }

    onReceive() {
        if (!this.canReceive()) return;

        // Prepare data for receive
        const itemsToReceive = this.receiveItems
            .filter(item => item.qty_to_receive > 0)
            .map(item => ({
                id: item.id,
                qty_received: item.qty_to_receive,
                batch_number: item.batch_number,
                expiry_date: item.expiry_date,
                serial_numbers: item.serial_numbers
            }));

        this.onReceiveComplete.emit({
            po_id: this.poData.id,
            items: itemsToReceive
        });

        this.onClose();
    }

    onClose() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.receiveItems = [];
        this.validationErrors = [];
    }
}
