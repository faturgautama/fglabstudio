import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { StockCardAction, StockCardState } from '../../../../../store/inventory';

@Component({
    selector: 'app-stock-detail-modal',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        TableModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        SkeletonModule
    ],
    template: `
        <p-dialog
            [(visible)]="visible"
            [header]="modalTitle"
            [modal]="true"
            [style]="{ width: '90vw' }"
            [maximizable]="true"
            (onHide)="onClose()"
        >
            <!-- Header Info -->
            <div class="modal-header-info" *ngIf="selectedStock">
                <div class="info-row">
                    <div class="info-item">
                        <label>SKU</label>
                        <p class="value">{{ selectedStock.product_sku }}</p>
                    </div>
                    <div class="info-item">
                        <label>Produk</label>
                        <p class="value">{{ selectedStock.product_name }}</p>
                    </div>
                    <div class="info-item">
                        <label>Warehouse</label>
                        <p class="value">{{ selectedStock.warehouse_name }}</p>
                    </div>
                </div>

                <div class="stock-summary">
                    <div class="summary-item">
                        <span class="label">Total Stock</span>
                        <span class="value total">{{ selectedStock.total_stock }}</span>
                    </div>
                    <div class="summary-item" *ngIf="selectedStock.is_batch_tracked">
                        <span class="label">Batch</span>
                        <span class="value batch">{{ selectedStock.batch_quantity }}</span>
                    </div>
                    <div class="summary-item" *ngIf="selectedStock.is_serial_tracked">
                        <span class="label">Serial</span>
                        <span class="value serial">{{ selectedStock.serial_quantity }}</span>
                    </div>
                    <div class="summary-item" *ngIf="!selectedStock.is_batch_tracked && !selectedStock.is_serial_tracked">
                        <span class="label">General</span>
                        <span class="value general">{{ selectedStock.general_quantity }}</span>
                    </div>
                </div>
            </div>

            <!-- Stock Movements Table -->
            <div class="movements-table">
                <h3>Pergerakan Stok</h3>
                <p-table
                    [value]="stockMovements"
                    [loading]="isLoading"
                    [paginator]="true"
                    [rows]="10"
                    responsiveLayout="scroll"
                    styleClass="p-datatable-striped"
                    [tableStyle]="{ 'min-width': '100%' }"
                >
                    <ng-template pTemplate="header">
                        <tr>
                            <th pSortableColumn="transaction_date">Tanggal <p-sortIcon field="transaction_date"></p-sortIcon></th>
                            <th pSortableColumn="type">Tipe <p-sortIcon field="type"></p-sortIcon></th>
                            <th pSortableColumn="qty_in">Qty Masuk <p-sortIcon field="qty_in"></p-sortIcon></th>
                            <th pSortableColumn="qty_out">Qty Keluar <p-sortIcon field="qty_out"></p-sortIcon></th>
                            <th pSortableColumn="reference_type">Referensi <p-sortIcon field="reference_type"></p-sortIcon></th>
                            <th>Batch/Serial</th>
                            <th>Notes</th>
                        </tr>
                    </ng-template>

                    <ng-template pTemplate="body" let-movement>
                        <tr>
                            <!-- Date -->
                            <td>
                                <span class="date">{{ movement.transaction_date | date: 'dd/MM/yyyy HH:mm' }}</span>
                            </td>

                            <!-- Type -->
                            <td>
                                <p-tag
                                    [value]="movement.type"
                                    [severity]="getTypeSeverity(movement.type)"
                                ></p-tag>
                            </td>

                            <!-- Qty In -->
                            <td>
                                <span *ngIf="movement.qty_in > 0" class="qty-in">
                                    +{{ movement.qty_in }}
                                </span>
                                <span *ngIf="!movement.qty_in" class="text-muted">-</span>
                            </td>

                            <!-- Qty Out -->
                            <td>
                                <span *ngIf="movement.qty_out > 0" class="qty-out">
                                    -{{ movement.qty_out }}
                                </span>
                                <span *ngIf="!movement.qty_out" class="text-muted">-</span>
                            </td>

                            <!-- Reference -->
                            <td>
                                <span class="reference" *ngIf="movement.reference_type">
                                    <strong>{{ movement.reference_type }}</strong>
                                    <br />
                                    <small>#{{ movement.reference_id }}</small>
                                </span>
                                <span *ngIf="!movement.reference_type" class="text-muted">-</span>
                            </td>

                            <!-- Batch/Serial -->
                            <td>
                                <span *ngIf="movement.batch_number" class="badge bg-warning text-dark">
                                    {{ movement.batch_number }}
                                </span>
                                <span *ngIf="movement.serial_number" class="badge bg-info">
                                    {{ movement.serial_number }}
                                </span>
                                <span *ngIf="!movement.batch_number && !movement.serial_number" class="text-muted">-</span>
                            </td>

                            <!-- Notes -->
                            <td>
                                <span
                                    *ngIf="movement.notes"
                                    class="notes"
                                    [pTooltip]="movement.notes"
                                    tooltipPosition="top"
                                >
                                    {{ movement.notes | slice:0:30 }}{{ movement.notes.length > 30 ? '...' : '' }}
                                </span>
                                <span *ngIf="!movement.notes" class="text-muted">-</span>
                            </td>
                        </tr>
                    </ng-template>

                    <!-- Empty Message -->
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="7" class="text-center p-4">
                                <p class="text-muted">Tidak ada pergerakan stok</p>
                            </td>
                        </tr>
                    </ng-template>

                    <!-- Loading Template -->
                    <ng-template pTemplate="loadingbody">
                        <tr>
                            <td colspan="7">
                                <p-skeleton height="2rem" *ngFor="let i of [1, 2, 3]"></p-skeleton>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>

            <!-- Footer -->
            <ng-template pTemplate="footer">
                <button
                    pButton
                    type="button"
                    label="Tutup"
                    icon="pi pi-times"
                    (click)="onClose()"
                    class="p-button-secondary"
                ></button>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        .modal-header-info {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #dee2e6;
        }

        .info-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 20px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
        }

        .info-item label {
            font-weight: 600;
            font-size: 12px;
            color: #6c757d;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-item .value {
            margin: 0;
            font-size: 16px;
            font-weight: 500;
            color: #212529;
        }

        .stock-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }

        .summary-item {
            display: flex;
            flex-direction: column;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #0d6efd;
        }

        .summary-item .label {
            font-size: 12px;
            color: #6c757d;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .summary-item .value {
            font-size: 24px;
            font-weight: 700;
            margin: 0;
        }

        .summary-item .value.total {
            color: #0d6efd;
        }

        .summary-item .value.batch {
            color: #ffc107;
        }

        .summary-item .value.serial {
            color: #0dcaf0;
        }

        .summary-item .value.general {
            color: #6c757d;
        }

        .movements-table {
            margin-top: 20px;
        }

        .movements-table h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            font-weight: 600;
        }

        .qty-in {
            color: #198754;
            font-weight: 600;
        }

        .qty-out {
            color: #dc3545;
            font-weight: 600;
        }

        .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
        }

        .bg-warning {
            background-color: #ffc107;
            color: #000;
        }

        .bg-info {
            background-color: #0dcaf0;
            color: #fff;
        }

        .text-muted {
            color: #6c757d;
        }

        .text-center {
            text-align: center;
        }

        .p-4 {
            padding: 1.5rem;
        }

        .reference {
            font-size: 12px;
            line-height: 1.5;
        }

        .reference small {
            color: #6c757d;
        }

        .notes {
            font-size: 12px;
            color: #495057;
            max-width: 300px;
            word-break: break-word;
        }

        :deep(.p-dialog .p-dialog-content) {
            padding: 0 30px 30px 30px;
        }

        :deep(.p-datatable .p-datatable-thead > tr > th) {
            background-color: #f8f9fa;
            font-weight: 600;
            border: 1px solid #dee2e6;
            padding: 12px;
            font-size: 12px;
        }

        :deep(.p-datatable .p-datatable-tbody > tr > td) {
            border: 1px solid #dee2e6;
            padding: 12px;
        }

        :deep(.p-datatable .p-datatable-tbody > tr:hover) {
            background-color: #f8f9fa;
        }

        :deep(.p-tag) {
            font-size: 11px;
            font-weight: 600;
        }
    `]
})
export class StockDetailModalComponent implements OnInit, OnChanges, OnDestroy {
    @Input() visible = false;
    @Input() selectedStock: any;
    @Output() visibleChange = new EventEmitter<boolean>();

    private store = inject(Store);
    private destroy$ = new Subject<void>();

    stockMovements: any[] = [];
    isLoading = false;

    get modalTitle(): string {
        if (!this.selectedStock) return 'Detail Stok';
        return `Detail Stok - ${this.selectedStock.product_name} (${this.selectedStock.warehouse_name})`;
    }

    ngOnInit() {
        // Load akan dipanggil saat visible berubah
    }

    ngOnChanges() {
        if (this.visible && this.selectedStock) {
            this.loadStockMovements();
        }
    }

    loadStockMovements() {
        if (this.selectedStock) {
            this.isLoading = true;

            this.store.dispatch(
                new StockCardAction.GetStockCardsByProduct(this.selectedStock.product_id.toString())
            );

            this.store.select(StockCardState.getProductStockCards)
                .pipe(takeUntil(this.destroy$))
                .subscribe((movements: any) => {
                    if (Array.isArray(movements)) {
                        // Filter by warehouse
                        this.stockMovements = movements.filter(
                            m => m.warehouse_id === this.selectedStock.warehouse_id
                        );
                    }
                    this.isLoading = false;
                });
        }
    }

    getTypeSeverity(type: string): string {
        switch (type) {
            case 'IN':
                return 'success';
            case 'OUT':
                return 'danger';
            case 'ADJUSTMENT':
                return 'warning';
            case 'TRANSFER':
                return 'info';
            default:
                return 'secondary';
        }
    }

    onClose() {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
