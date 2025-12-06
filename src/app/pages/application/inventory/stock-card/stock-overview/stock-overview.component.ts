import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { ProductWarehouseStockAction, ProductWarehouseStockState } from '../../../../../store/inventory';
import { WarehouseState } from '../../../../../store/inventory';
import { StockDetailModalComponent } from '../stock-detail-modal/stock-detail-modal.component';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-stock-overview',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        TooltipModule,
        SelectModule,
        StockDetailModalComponent
    ],
    templateUrl: './stock-overview.component.html',
    styleUrls: ['./stock-overview.component.scss']
})
export class StockOverviewComponent implements OnInit, OnDestroy {
    private store = inject(Store);
    private destroy$ = new Subject<void>();

    stockData: any[] = [];
    warehouses: any[] = [];
    selectedWarehouseId: number | null = null;
    isLoading = false;

    showDetailModal = false;
    selectedStock: any = null;

    hasBatchTracking = false;
    hasSerialTracking = false;
    hasGeneralTracking = true;

    ngOnInit() {
        this.loadWarehouses();
    }

    loadWarehouses() {
        this.store.select(WarehouseState.getAll)
            .pipe(takeUntil(this.destroy$))
            .subscribe((warehouses: any[]) => {
                this.warehouses = warehouses.filter(w => w.is_active);
            });
    }

    loadStockData() {
        this.store.select(ProductWarehouseStockState.getAllStocks)
            .pipe(takeUntil(this.destroy$))
            .subscribe((stocks: any[]) => {
                this.analyzeStockData(stocks);
            });

        this.store.select(ProductWarehouseStockState.isLoading)
            .pipe(takeUntil(this.destroy$))
            .subscribe(loading => {
                this.isLoading = loading;
            });
    }

    onWarehouseChange(warehouse?: any) {
        if (this.selectedWarehouseId) {
            this.store.dispatch(
                new ProductWarehouseStockAction.GetStockByWarehouse(this.selectedWarehouseId)
            );

            this.store.select(ProductWarehouseStockState.getStockByWarehouse)
                .pipe(takeUntil(this.destroy$))
                .subscribe((stocks: any[]) => {
                    this.analyzeStockData(stocks);
                });
        }
    }

    analyzeStockData(stocks: any[]) {
        this.stockData = stocks;

        // Analyze tracking types
        this.hasBatchTracking = stocks.some(s => s.is_batch_tracked);
        this.hasSerialTracking = stocks.some(s => s.is_serial_tracked);
        this.hasGeneralTracking = stocks.some(s => !s.is_batch_tracked && !s.is_serial_tracked);
    }

    getStockBadgeClass(quantity: number): string {
        if (quantity === 0) return 'bg-danger';
        if (quantity < 10) return 'bg-warning text-dark';
        if (quantity < 50) return 'bg-info';
        return 'bg-success';
    }

    openDetailModal(stock: any) {
        this.selectedStock = { ...stock, warehouse_name: this.warehouses.find(item => item.id == stock.warehouse_id).name };
        this.showDetailModal = true;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
