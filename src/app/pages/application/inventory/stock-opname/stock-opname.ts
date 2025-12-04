import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { Subject, takeUntil } from 'rxjs';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { Store } from '@ngxs/store';
import { StockOpnameAction, StockOpnameState } from '../../../../store/inventory/stock-opname';
import { ProductState } from '../../../../store/inventory/product';
import { WarehouseState } from '../../../../store/inventory/warehouse';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { StockOpnameService } from '../../../../services/pages/application/inventory/stock-opname.service';

@Component({
    selector: 'app-stock-opname',
    imports: [
        FormsModule,
        ButtonModule,
        DynamicTable,
        DshBaseLayout,
        ReactiveFormsModule,
        CommonModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        InputNumberModule,
        TextareaModule
    ],
    standalone: true,
    templateUrl: './stock-opname.html',
    styleUrl: './stock-opname.scss'
})
export class StockOpname implements OnInit, OnDestroy {

    _store = inject(Store);
    _stockOpnameService = inject(StockOpnameService);
    _messageService = inject(MessageService);
    _confirmationService = inject(ConfirmationService);
    _formBuilder = inject(FormBuilder);

    Destroy$ = new Subject();

    _pageState = signal<'list' | 'form'>('list');
    _formState: 'insert' | 'update' = 'insert';

    _products: any[] = [];
    _warehouses: any[] = [];

    STATUS_OPTIONS = [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Approved', value: 'APPROVED' }
    ];

    Form = this._formBuilder.group({
        id: ['', []],
        opname_number: ['', [Validators.required]],
        opname_date: [new Date(), [Validators.required]],
        warehouse_id: ['', []],
        status: ['DRAFT', [Validators.required]],
        total_products: [0, []],
        total_discrepancy: [0, []],
        notes: ['', []],
        items: this._formBuilder.array([])
    });

    TableProps: DynamicTableModel.ITable = {
        id: 'stock_opname',
        title: 'Daftar Stock Opname',
        description: 'Daftar stock opname dalam sistem inventory',
        column: [
            {
                id: 'opname_number',
                title: 'No. Opname',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '150px'
            },
            {
                id: 'opname_date',
                title: 'Tanggal',
                type: DynamicTableModel.IColumnType.DATE,
                width: '150px'
            },
            {
                id: 'total_products',
                title: 'Total Produk',
                type: DynamicTableModel.IColumnType.NUMBER,
                width: '120px'
            },
            {
                id: 'total_discrepancy',
                title: 'Total Selisih',
                type: DynamicTableModel.IColumnType.NUMBER,
                width: '120px'
            },
            {
                id: 'status',
                title: 'Status',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '120px'
            },
        ],
        datasource: [],
        filter: [
            {
                id: 'opname_number',
                title: 'No. Opname',
                type: DynamicTableModel.IColumnType.TEXT,
                value: ''
            },
        ],
        sort: [
            {
                id: 'opname_date',
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
            .select(StockOpnameState.getAll)
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

    get items(): FormArray {
        return this.Form.get('items') as FormArray;
    }

    generateOpnameNumber() {
        if (this._formState === 'insert') {
            this._stockOpnameService.generateOpnameNumber().subscribe(opname_number => {
                this.Form.patchValue({ opname_number });
            });
        }
    }

    addItem() {
        const itemForm = this._formBuilder.group({
            product_id: ['', [Validators.required]],
            system_stock: [0, [Validators.required]],
            physical_stock: [0, [Validators.required]],
            difference: [0, []],
            notes: ['', []]
        });

        this.items.push(itemForm);
    }

    removeItem(index: number) {
        this.items.removeAt(index);
        this.calculateTotals();
    }

    calculateItemDifference(index: number) {
        const item = this.items.at(index);
        const systemStock = item.get('system_stock')?.value || 0;
        const physicalStock = item.get('physical_stock')?.value || 0;
        const difference = physicalStock - systemStock;

        item.patchValue({ difference: difference }, { emitEvent: false });
        this.calculateTotals();
    }

    calculateTotals() {
        const totalProducts = this.items.length;
        let totalDiscrepancy = 0;

        this.items.controls.forEach(item => {
            const diff = Math.abs(item.get('difference')?.value || 0);
            totalDiscrepancy += diff;
        });

        this.Form.patchValue({
            total_products: totalProducts,
            total_discrepancy: totalDiscrepancy
        }, { emitEvent: false });
    }

    loadProductsForOpname() {
        const warehouseId = this.Form.get('warehouse_id')?.value as any;
        this._stockOpnameService.getProductsForOpname(warehouseId).subscribe(products => {
            this.items.clear();
            products.forEach((product: any) => {
                const itemForm = this._formBuilder.group({
                    product_id: [product.id, [Validators.required]],
                    system_stock: [product.current_stock, [Validators.required]],
                    physical_stock: [0, [Validators.required]],
                    difference: [0, []],
                    notes: ['', []]
                });
                this.items.push(itemForm);
            });
            this.calculateTotals();
        });
    }

    handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
        if (args.id == 'add') {
            this._formState = 'insert';
            this._pageState.set('form');
            this.Form.reset({
                status: 'DRAFT',
                opname_date: new Date(),
                total_products: 0,
                total_discrepancy: 0
            });
            this.items.clear();
            this.generateOpnameNumber();
        }
    }

    handleFilter(args: any) {
        const filter = args || {};
        this._store.dispatch(new StockOpnameAction.GetStockOpname(filter, {}));
    }

    handleSort(args: any) {
        const sort = args || {};
        this._store.dispatch(new StockOpnameAction.GetStockOpname({}, sort));
    }

    handleToolbarClicked(args: any) {
        if (args.toolbar.id == 'detail') {
            this._formState = 'update';
            this._pageState.set('form');
            this.Form.patchValue(args.data);
            // TODO: Load items
        }

        if (args.toolbar.id == 'delete') {
            this._confirmationService.confirm({
                message: 'Apakah anda yakin menghapus opname ini?',
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
                        .dispatch(new StockOpnameAction.DeleteStockOpname(args.data.id?.toString() || ''))
                        .subscribe((result) => {
                            setTimeout(() => {
                                this._messageService.clear();
                                this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Opname Berhasil Dihapus' });
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
        if (this.Form.valid && this.items.length > 0) {
            const formValue = this.Form.value as any;
            const { id, items, ...opnameData } = formValue;

            this._store
                .dispatch(new StockOpnameAction.AddStockOpname(opnameData, items || []))
                .subscribe(() => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Opname Berhasil Disimpan' });
                        this.handleBackToList();
                    }, 3100);
                })
        } else {
            this._messageService.add({ severity: 'warn', summary: 'Peringatan', detail: 'Mohon lengkapi form dan tambahkan minimal 1 item' });
        }
    }

    handleUpdate() {
        if (this.Form.valid && this.items.length > 0) {
            const formValue = this.Form.value as any;
            this._store
                .dispatch(new StockOpnameAction.UpdateStockOpname(formValue))
                .subscribe((result) => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Opname Berhasil Diubah' });
                        this.handleBackToList();
                    }, 3100);
                })
        }
    }
}
