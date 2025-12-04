import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { StockMovementAction, StockMovementState } from '../../../../store/inventory/stock-movement';
import { ProductState } from '../../../../store/inventory/product';
import { WarehouseState } from '../../../../store/inventory/warehouse';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { StockMovementService } from '../../../../services/pages/application/inventory/stock-movement.service';
import { DatabaseService } from '../../../../app.database';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';

@Component({
    selector: 'app-stock-movement',
    imports: [
        FormsModule,
        ButtonModule,
        DshBaseLayout,
        DynamicTable,
        ReactiveFormsModule,
        CommonModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        MultiSelectModule,
        DatePickerModule,
        InputNumberModule,
        TextareaModule,
        MultiSelectModule
    ],
    standalone: true,
    templateUrl: './stock-movement.html',
    styleUrl: './stock-movement.scss'
})
export class StockMovement implements OnInit, OnDestroy {

    _store = inject(Store);
    _stockMovementService = inject(StockMovementService);
    _messageService = inject(MessageService);
    _confirmationService = inject(ConfirmationService);
    _formBuilder = inject(FormBuilder);
    _databaseService = inject(DatabaseService);

    Destroy$ = new Subject();

    _pageState = signal<'list' | 'form'>('list');
    _formState: 'insert' | 'update' = 'insert';

    _products: any[] = [];
    _warehouses: any[] = [];
    _availableBatches: any[] = [];
    _availableSerials: any[] = [];
    _selectedProduct: any = null;

    MOVEMENT_TYPES = [
        { label: 'Masuk', value: 'IN' },
        { label: 'Keluar', value: 'OUT' },
        { label: 'Adjustment', value: 'ADJUSTMENT' },
        { label: 'Transfer', value: 'TRANSFER' }
    ];

    REASON_OPTIONS = [
        { label: 'Pembelian', value: 'PURCHASE' },
        { label: 'Penjualan', value: 'SALES' },
        { label: 'Retur', value: 'RETURN' },
        { label: 'Rusak', value: 'DAMAGED' },
        { label: 'Hilang', value: 'LOST' },
        { label: 'Koreksi Stok', value: 'CORRECTION' },
        { label: 'Lainnya', value: 'OTHER' }
    ];

    Form = this._formBuilder.group({
        id: ['', []],
        movement_number: ['', [Validators.required]],
        type: ['', [Validators.required]],
        product_id: ['', [Validators.required]],
        warehouse_id: ['', [Validators.required]],
        warehouse_from: ['', []],
        warehouse_to: ['', []],
        quantity: [0, [Validators.required, Validators.min(1)]],
        unit_cost: [0, []],
        total_value: [0, []],
        reason: ['', []],
        reason_detail: ['', []],
        reference_type: ['', []],
        reference_id: ['', []],
        batch_number: ['', []],
        serial_numbers: [[], []],
        approved_by: ['', []],
        notes: ['', []],
        movement_date: [new Date(), [Validators.required]]
    });

    TableProps: DynamicTableModel.ITable = {
        id: 'stock_movement',
        title: 'Daftar Stock Movement',
        description: 'Daftar pergerakan stok dalam sistem inventory',
        column: [
            {
                id: 'movement_number',
                title: 'No. Movement',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '150px'
            },
            {
                id: 'movement_date',
                title: 'Tanggal',
                type: DynamicTableModel.IColumnType.DATE,
                width: '150px'
            },
            {
                id: 'type',
                title: 'Tipe',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '120px'
            },
            {
                id: 'product_id',
                title: 'Produk',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '200px'
            },
            {
                id: 'quantity',
                title: 'Qty',
                type: DynamicTableModel.IColumnType.NUMBER,
                width: '100px'
            },
            {
                id: 'reason',
                title: 'Alasan',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '150px'
            },
        ],
        datasource: [],
        filter: [
            {
                id: 'movement_number',
                title: 'No. Movement',
                type: DynamicTableModel.IColumnType.TEXT,
                value: ''
            },
        ],
        sort: [
            {
                id: 'movement_date',
                title: 'Tanggal',
                value: ''
            },
        ],
        toolbar: [
            { id: 'detail', icon: 'pi pi-info', title: 'Detail' },
            { id: 'delete', icon: 'pi pi-trash', title: 'Hapus' },
        ],
        paging: true,
        custom_button: [
            { id: 'add', title: 'Tambah', icon: 'pi pi-plus' }
        ]
    };

    ngOnInit(): void {
        this._store
            .select(StockMovementState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this.TableProps.datasource = result);

        this._store
            .select(ProductState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this._products = result.filter((p: any) => p.is_active));

        this._store
            .select(WarehouseState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this._warehouses = result.filter((w: any) => w.is_active));
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    generateMovementNumber() {
        if (this._formState === 'insert') {
            const type = this.Form.get('type')?.value || 'IN';
            this._stockMovementService.generateMovementNumber(type).subscribe(movement_number => {
                this.Form.patchValue({ movement_number });
            });
        }
    }

    async onTypeChange() {
        this.generateMovementNumber();
        const type = this.Form.get('type')?.value;

        // Reset warehouse fields based on type
        if (type === 'IN') {
            this.Form.patchValue({ warehouse_from: '' });
        } else if (type === 'OUT') {
            this.Form.patchValue({ warehouse_to: '' });
        }

        // Reload batches/serials
        await this.loadBatchesAndSerials();
    }

    calculateTotalValue() {
        const quantity = this.Form.get('quantity')?.value || 0;
        const unitCost = this.Form.get('unit_cost')?.value || 0;
        const totalValue = quantity * unitCost;
        this.Form.patchValue({ total_value: totalValue }, { emitEvent: false });
    }

    async onProductChange() {
        const productId = this.Form.get('product_id')?.value;
        if (!productId) {
            this._selectedProduct = null;
            this._availableBatches = [];
            this._availableSerials = [];
            return;
        }

        // Get product details
        this._selectedProduct = await this._databaseService.db.products.get(Number(productId));

        // Load batches/serials based on warehouse and type
        await this.loadBatchesAndSerials();
    }

    async onWarehouseChange() {
        await this.loadBatchesAndSerials();
    }

    async loadBatchesAndSerials() {
        const productId = this.Form.get('product_id')?.value;
        const type = this.Form.get('type')?.value;
        const warehouseId = this.Form.get('warehouse_id')?.value ||
            this.Form.get('warehouse_from')?.value;

        if (!productId || !warehouseId) {
            this._availableBatches = [];
            this._availableSerials = [];
            return;
        }

        // Only load for OUT/TRANSFER (when taking stock out)
        if (type === 'OUT' || type === 'TRANSFER') {
            // Load batches if batch-tracked
            if (this._selectedProduct?.is_batch_tracked) {
                this._availableBatches = await this._databaseService.db.product_batches
                    .where('[product_id+warehouse_id]')
                    .equals([Number(productId), Number(warehouseId)])
                    .and(batch => batch.is_active && batch.quantity > 0)
                    .toArray();
            }

            // Load serials if serial-tracked
            if (this._selectedProduct?.is_serial_tracked) {
                this._availableSerials = await this._databaseService.db.product_serials
                    .where('[product_id+warehouse_id]')
                    .equals([Number(productId), Number(warehouseId)])
                    .and(serial => serial.status === 'IN_STOCK')
                    .toArray();
            }
        } else {
            // For IN/ADJUSTMENT, allow free text
            this._availableBatches = [];
            this._availableSerials = [];
        }
    }

    handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
        if (args.id == 'add') {
            this._formState = 'insert';
            this._pageState.set('form');
            this.Form.reset({
                movement_date: new Date(),
                quantity: 0,
                unit_cost: 0,
                total_value: 0
            });
        }
    }

    handleFilter(args: any) {
        const filter = args || {};
        this._store.dispatch(new StockMovementAction.GetStockMovement(filter, {}));
    }

    handleSort(args: any) {
        const sort = args || {};
        this._store.dispatch(new StockMovementAction.GetStockMovement({}, sort));
    }

    handleToolbarClicked(args: any) {
        if (args.toolbar.id == 'detail') {
            this._formState = 'update';
            this._pageState.set('form');
            this.Form.patchValue(args.data);
        }

        if (args.toolbar.id == 'delete') {
            this._confirmationService.confirm({
                message: 'Apakah anda yakin menghapus movement ini?',
                header: 'Danger Zone',
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancel',
                rejectButtonProps: {
                    label: 'Cancel',
                    severity: 'secondary',
                    outlined: true,
                },
                acceptButtonProps: {
                    label: 'Hapus',
                    severity: 'danger',
                },
                accept: () => {
                    this._store
                        .dispatch(new StockMovementAction.DeleteStockMovement(args.data.id.toString()))
                        .subscribe((result) => {
                            setTimeout(() => {
                                this._messageService.clear();
                                this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Movement Berhasil Dihapus' });
                            }, 3100);
                        })
                },
            });
        }
    }

    handleBackToList() {
        this._pageState.set('list');
    }

    handleSave() {
        if (this.Form.valid) {
            const formValue = this.Form.value as any;
            const { id, ...payload } = formValue;
            this._store
                .dispatch(new StockMovementAction.AddStockMovement(payload))
                .subscribe((result) => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Movement Berhasil Disimpan' });
                        this.handleBackToList();
                    }, 3100);
                })
        }
    }

    handleUpdate() {
        if (this.Form.valid) {
            const formValue = this.Form.value as any;
            this._store
                .dispatch(new StockMovementAction.UpdateStockMovement(formValue))
                .subscribe((result) => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Movement Berhasil Diubah' });
                        this.handleBackToList();
                    }, 3100);
                })
        }
    }

    get serial_numbers(): FormControl {
        return this.Form.get('serial_numbers') as FormControl;
    }
}
