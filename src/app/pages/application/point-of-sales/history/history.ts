import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { POSTransactionAction, POSTransactionState, POSSettingState } from '../../../../store/point-of-sales';
import { EmployeeState } from '../../../../store/human-resource';
import { POSModel } from '../../../../model/pages/application/point-of-sales/pos.model';
import { printReceipt as printReceiptHelper } from '../cashier/print-receipt.helper';

@Component({
    selector: 'app-pos-history',
    standalone: true,
    imports: [
        CommonModule,
        DshBaseLayout,
        DynamicTable,
        DialogModule,
        ButtonModule,
    ],
    templateUrl: './history.html',
    styleUrl: './history.scss'
})
export class History implements OnInit, OnDestroy {

    private _store = inject(Store);

    Destroy$ = new Subject();

    _modalToggler = {
        detail: false
    };

    SelectedTransaction: any = null;

    TableProps: DynamicTableModel.ITable = {
        id: 'pos-history',
        title: 'Riwayat Transaksi',
        description: 'Daftar semua transaksi penjualan',
        column: [
            {
                id: 'transaction_number',
                title: 'No. Transaksi',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '180px'
            },
            {
                id: 'transaction_date',
                title: 'Tanggal',
                type: DynamicTableModel.IColumnType.DATETIME,
                width: '180px'
            },
            {
                id: 'cashier_name',
                title: 'Kasir',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '150px'
            },
            {
                id: 'total',
                title: 'Total',
                type: DynamicTableModel.IColumnType.CURRENCY,
                width: '150px'
            },
            {
                id: 'payment_method',
                title: 'Pembayaran',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '120px'
            },
            {
                id: 'status',
                title: 'Status',
                type: DynamicTableModel.IColumnType.BADGE,
                width: '120px'
            },
        ],
        datasource: [],
        filter: [
            {
                id: 'transaction_number',
                title: 'No. Transaksi',
                type: DynamicTableModel.IColumnType.TEXT,
                value: ''
            },
            {
                id: 'cashier_id',
                title: 'Kasir',
                type: DynamicTableModel.IColumnType.DROPDOWN,
                value: '',
                select_props: {
                    datasource: [],
                    name: 'full_name',
                    value: 'id'
                }
            },
            {
                id: 'payment_method',
                title: 'Metode Pembayaran',
                type: DynamicTableModel.IColumnType.DROPDOWN,
                value: '',
                select_props: {
                    datasource: [
                        { id: 'CASH', title: 'Tunai' },
                        { id: 'TRANSFER', title: 'Transfer' },
                        { id: 'QRIS', title: 'QRIS' }
                    ],
                    name: 'title',
                    value: 'id'
                }
            },
        ],
        sort: [
            {
                id: 'transaction_date',
                title: 'Tanggal',
                value: 'desc'
            },
            {
                id: 'total',
                title: 'Total',
                value: ''
            },
        ],
        toolbar: [
            { id: 'detail', icon: 'pi pi-eye', title: 'Detail' },
            { id: 'print', icon: 'pi pi-print', title: 'Cetak' },
        ],
        paging: true,
    };

    ngOnInit(): void {
        this.loadTransactions();
        this.loadCashiers();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private loadTransactions() {
        this._store.dispatch(new POSTransactionAction.GetTransaction());
        this._store.select(POSTransactionState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(transactions => {
                const mappedData = (transactions as POSModel.Transaction[]).map((item: any) => ({
                    ...item,
                    cashier_name: item.cashier?.full_name || '-',
                    status: item.status === 'COMPLETED' ? 'Selesai' : 'Dibatalkan'
                }));

                this.TableProps = {
                    ...this.TableProps,
                    datasource: mappedData
                };
            });
    }

    private loadCashiers() {
        this._store.select(EmployeeState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(employees => {
                const cashierFilter = this.TableProps.filter?.find(f => f.id === 'cashier_id');
                if (cashierFilter && cashierFilter.select_props) {
                    cashierFilter.select_props.datasource = employees as any[];
                }
            });
    }

    handleToolbarClick(event: any) {
        if (event.toolbar.id === 'detail') {
            // Load transaction with items
            this._store.dispatch(new POSTransactionAction.GetByIdTransaction(event.data.id!));
            this._store.select(POSTransactionState.getSingle)
                .pipe(takeUntil(this.Destroy$))
                .subscribe(transaction => {
                    if (transaction) {
                        this.SelectedTransaction = transaction;
                        this._modalToggler.detail = true;
                    }
                });
        } else if (event.toolbar.id === 'print') {
            this.printReceipt(event.data);
        }
    }

    printReceipt(transaction: POSModel.Transaction) {
        const setting = this._store.selectSnapshot(POSSettingState.getSingle);
        const items = (transaction.items || []).map(item => ({
            product_id: item.product_id!,
            product_name: item.product_name!,
            product_sku: item.product_sku || "",
            quantity: item.quantity!,
            unit_price: item.unit_price!,
            discount_amount: item.discount_amount || 0,
            discount_percentage: item.discount_percentage || 0,
            subtotal: item.subtotal!,
            current_stock: 0
        }));
        const cashierName = (transaction as any).cashier?.full_name || "-";
        printReceiptHelper(transaction, items, cashierName, setting);
    }

    closeDetailModal() {
        this._modalToggler.detail = false;
        this.SelectedTransaction = null;
    }
}
