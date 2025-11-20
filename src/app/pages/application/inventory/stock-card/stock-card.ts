import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { Subject, takeUntil } from 'rxjs';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { Store } from '@ngxs/store';
import { StockCardAction, StockCardState } from '../../../../store/inventory/stock-card';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-stock-card',
    imports: [
        FormsModule,
        ButtonModule,
        DynamicTable,
        DshBaseLayout,
        ReactiveFormsModule,
        CommonModule,
        DialogModule
    ],
    standalone: true,
    templateUrl: './stock-card.html',
    styleUrl: './stock-card.scss'
})
export class StockCard implements OnInit, OnDestroy {

    _store = inject(Store);
    _messageService = inject(MessageService);

    Destroy$ = new Subject();

    _detailModalToggler = false;
    _selectedStockCard: any = null;

    TableProps: DynamicTableModel.ITable = {
        id: 'stock_card',
        title: 'Kartu Stok',
        description: 'Riwayat transaksi stok produk',
        column: [
            {
                id: 'transaction_date',
                title: 'Tanggal',
                type: DynamicTableModel.IColumnType.DATETIME,
                width: '180px'
            },
            {
                id: 'product_id',
                title: 'Produk',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '250px'
            },
            {
                id: 'type',
                title: 'Tipe',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '120px'
            },
            {
                id: 'reference_type',
                title: 'Referensi',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '150px'
            },
            {
                id: 'qty_in',
                title: 'Masuk',
                type: DynamicTableModel.IColumnType.NUMBER,
                width: '100px'
            },
            {
                id: 'qty_out',
                title: 'Keluar',
                type: DynamicTableModel.IColumnType.NUMBER,
                width: '100px'
            },
            {
                id: 'balance',
                title: 'Saldo',
                type: DynamicTableModel.IColumnType.NUMBER,
                width: '100px'
            },
            {
                id: 'unit_cost',
                title: 'Harga Satuan',
                type: DynamicTableModel.IColumnType.CURRENCY,
                width: '150px'
            },
            {
                id: 'total_value',
                title: 'Total Nilai',
                type: DynamicTableModel.IColumnType.CURRENCY,
                width: '150px'
            },
        ],
        datasource: [],
        filter: [
            {
                id: 'product_id',
                title: 'Produk',
                type: DynamicTableModel.IColumnType.TEXT,
                value: ''
            },
            {
                id: 'type',
                title: 'Tipe',
                type: DynamicTableModel.IColumnType.TEXT,
                value: ''
            },
        ],
        sort: [
            {
                id: 'transaction_date',
                title: 'Tanggal',
                value: ''
            },
        ],
        toolbar: [
            { id: 'detail', icon: 'pi pi-info', title: 'Detail' },
        ],
        paging: true,
        custom_button: []
    };

    ngOnInit(): void {
        this._store
            .select(StockCardState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this.TableProps.datasource = result);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleFilter(args: any) {
        const filter = args || {};
        this._store.dispatch(new StockCardAction.GetStockCard(filter, {}));
    }

    handleSort(args: any) {
        const sort = args || {};
        this._store.dispatch(new StockCardAction.GetStockCard({}, sort));
    }

    handleToolbarClicked(args: any) {
        if (args.toolbar.id == 'detail') {
            this._selectedStockCard = args.data;
            this._detailModalToggler = true;
        }
    }
}
