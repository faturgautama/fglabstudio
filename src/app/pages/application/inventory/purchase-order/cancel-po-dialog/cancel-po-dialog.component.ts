import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-cancel-po-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        TextareaModule
    ],
    templateUrl: './cancel-po-dialog.component.html',
    styleUrls: ['./cancel-po-dialog.component.scss']
})
export class CancelPoDialogComponent implements OnChanges {
    @Input() visible = false;
    @Input() poData: any = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onCancelComplete = new EventEmitter<any>();

    cancelReason = "";
    validationError = "";

    ngOnChanges() {
        if (this.visible && this.poData) {
            this.cancelReason = '';
            this.validationError = '';
        }
    }

    validateForm(): boolean {
        this.validationError = '';

        if (!this.cancelReason || this.cancelReason.trim().length === 0) {
            this.validationError = 'Alasan pembatalan harus diisi';
            return false;
        }

        if (this.cancelReason.trim().length < 10) {
            this.validationError = 'Alasan pembatalan minimal 10 karakter';
            return false;
        }

        return true;
    }

    canCancel(): boolean {
        // Check validation without modifying state
        if (!this.cancelReason || this.cancelReason.trim().length === 0) {
            return false;
        }

        if (this.cancelReason.trim().length < 10) {
            return false;
        }

        return true;
    }

    onCancel() {
        // Validate and set error message only when user clicks
        if (!this.validateForm()) return;

        this.onCancelComplete.emit({
            po_id: this.poData.id,
            cancel_reason: this.cancelReason.trim()
        });

        this.onClose();
    }

    onClose() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.cancelReason = '';
        this.validationError = '';
    }

    getTotalItems(): number {
        return this.poData?.items?.length || 0;
    }

    getTotalQtyOrdered(): number {
        return this.poData?.items?.reduce((sum: number, item: any) => sum + item.qty_ordered, 0) || 0;
    }

    getTotalQtyReceived(): number {
        return this.poData?.items?.reduce((sum: number, item: any) => sum + item.qty_received, 0) || 0;
    }

    hasReceivedItems(): boolean {
        return this.getTotalQtyReceived() > 0;
    }
}
