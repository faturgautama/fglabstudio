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
    templateUrl: './stock-detail-modal.component.html',
    styleUrls: ['./stock-detail-modal.component.scss']
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

            console.log("selected stock =>", this.selectedStock);

            this.store.dispatch(
                new StockCardAction.GetStockCardsByProductAndWarehouse(
                    this.selectedStock.product_id,
                    this.selectedStock.warehouse_id
                )
            );

            this.store.select(StockCardState.getStockCardsByProductAndWarehouse)
                .pipe(takeUntil(this.destroy$))
                .subscribe((movements: any) => {
                    console.log("stock card =>", movements);

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
