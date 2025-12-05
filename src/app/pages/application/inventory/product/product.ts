import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { Subject, takeUntil } from 'rxjs';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { Store } from '@ngxs/store';
import { ProductAction, ProductState } from '../../../../store/inventory/product';
import { CategoryState } from '../../../../store/inventory/category';
import { SupplierState } from '../../../../store/inventory/supplier';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";
import { DialogModule } from "primeng/dialog";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ProductService } from '../../../../services/pages/application/inventory/product.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-product',
    imports: [
        FormsModule,
        ButtonModule,
        DynamicTable,
        DialogModule,
        DshBaseLayout,
        TextareaModule,
        InputTextModule,
        CheckboxModule,
        SelectModule,
        InputNumberModule,
        DatePickerModule,
        ReactiveFormsModule,
        CommonModule
    ],
    standalone: true,
    templateUrl: './product.html',
    styleUrl: './product.scss'
})
export class Product implements OnInit, OnDestroy {

    _store = inject(Store);
    _productService = inject(ProductService);
    _messageService = inject(MessageService);
    _confirmationService = inject(ConfirmationService);

    Destroy$ = new Subject();

    _categories: any[] = [];
    _suppliers: any[] = [];

    TableProps: DynamicTableModel.ITable = {
        id: 'product',
        title: 'Daftar Produk',
        description: 'Daftar produk dalam sistem inventory',
        column: [
            {
                id: 'sku',
                title: 'SKU',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '150px'
            },
            {
                id: 'name',
                title: 'Nama Produk',
                type: DynamicTableModel.IColumnType.TEXT,
            },
            {
                id: 'current_stock',
                title: 'Stok',
                type: DynamicTableModel.IColumnType.NUMBER,
                width: '150px'
            },
            {
                id: 'unit',
                title: 'Satuan',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '150px'
            },
            {
                id: 'purchase_price',
                title: 'Harga Beli',
                type: DynamicTableModel.IColumnType.CURRENCY,
                width: '150px'
            },
            {
                id: 'selling_price',
                title: 'Harga Jual',
                type: DynamicTableModel.IColumnType.CURRENCY,
                width: '200px'
            },
        ],
        datasource: [],
        filter: [
            {
                id: 'name',
                title: 'Nama Produk',
                type: DynamicTableModel.IColumnType.TEXT,
                value: ''
            },
            {
                id: 'sku',
                title: 'SKU',
                type: DynamicTableModel.IColumnType.TEXT,
                value: ''
            },
        ],
        sort: [
            {
                id: 'name',
                title: 'Nama Produk',
                value: ''
            },
            {
                id: 'sku',
                title: 'SKU',
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

    _modalToggler = false;

    _formBuilder = inject(FormBuilder);
    _formState: 'insert' | 'update' = 'insert';
    Form = this._formBuilder.group({
        id: ['', []],
        sku: ['', [Validators.required]],
        barcode: ['', []],
        name: ['', [Validators.required]],
        description: ['', []],
        category_id: ['', []],
        unit: ['', [Validators.required]],
        unit_weight: [0, []],
        unit_volume: [0, []],
        current_stock: [0, [Validators.required]],
        min_stock: [0, [Validators.required]],
        max_stock: [0, []],
        reorder_point: [0, []],
        purchase_price: [0, [Validators.required]],
        selling_price: [0, [Validators.required]],
        wholesale_price: [0, []],
        margin_percentage: [0, []],
        brand: ['', []],
        manufacturer: ['', []],
        model_number: ['', []],
        warehouse_location: ['', []],
        is_batch_tracked: [false, []],
        is_serial_tracked: [false, []],
        expiry_date: ['', []],
        manufacturing_date: ['', []],
        image_url: ['', []],
        default_supplier_id: ['', []],
        supplier_sku: ['', []],
        lead_time_days: [0, []],
        tax_rate: [0, []],
        cogs: [0, []],
        is_active: [true, []],
        is_sellable: [true, []],
        is_purchasable: [true, []],
        is_perishable: [false, []],
        is_serialized: [false, []],
        slug: ['', []],
        meta_description: ['', []],
        length_cm: [0, []],
        width_cm: [0, []],
        height_cm: [0, []],
        weight_kg: [0, []],
        notes: ['', []],
        handling_notes: ['', []],
        storage_requirements: ['', []]
    });

    ngOnInit(): void {
        this._store
            .select(ProductState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this.TableProps.datasource = result);

        this._store
            .select(CategoryState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this._categories = result);

        this._store
            .select(SupplierState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this._suppliers = result);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    generateSKU() {
        if (this._formState === 'insert') {
            this._productService.generateSKU().subscribe(sku => {
                this.Form.patchValue({ sku });
            });
        }
    }

    handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
        if (args.id == 'add') {
            this._formState = 'insert';
            this.Form.reset({
                is_active: true,
                is_sellable: true,
                is_purchasable: true,
                is_batch_tracked: false,
                is_serial_tracked: false,
                is_serialized: false,
                is_perishable: false,
                current_stock: 0,
                min_stock: 0,
                max_stock: 0,
                purchase_price: 0,
                selling_price: 0,
                wholesale_price: 0
            });
            this.generateSKU();
            this._modalToggler = true;
        }
    }

    handleFilter(args: any) {
        const filter = args || {};
        this._store.dispatch(new ProductAction.GetProduct(filter, {}));
    }

    handleSort(args: any) {
        const sort = args || {};
        this._store.dispatch(new ProductAction.GetProduct({}, sort));
    }

    handleToolbarClicked(args: any) {
        if (args.toolbar.id == 'detail') {
            this._formState = 'update';
            this._modalToggler = true;
            this.Form.patchValue(args.data);
        };

        if (args.toolbar.id == 'delete') {
            this._confirmationService.confirm({
                message: 'Apakah anda yakin menghapus produk ini?',
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
                        .dispatch(new ProductAction.DeleteProduct(args.data.id))
                        .subscribe((result) => {
                            setTimeout(() => {
                                this._messageService.clear();
                                this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Produk Berhasil Dihapus' });
                            }, 3100);
                        })
                },
            });
        };
    }

    handleSave(args: any) {
        if (this.Form.valid) {
            this._store
                .dispatch(new ProductAction.AddProduct(args))
                .subscribe((result) => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Produk Berhasil Disimpan' });
                        this.resetForm(true);
                    }, 3100);
                })
        }
    }

    handleUpdate(args: any) {
        if (this.Form.valid) {
            this._store
                .dispatch(new ProductAction.UpdateProduct(args))
                .subscribe((result) => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Produk Berhasil Diubah' });
                        this.resetForm(true);
                    }, 3100);
                })
        }
    }

    private resetForm(closeModal?: boolean) {
        this.Form.reset({
            is_active: true,
            is_sellable: true,
            is_purchasable: true,
            is_batch_tracked: false,
            is_serial_tracked: false,
            is_serialized: false,
            is_perishable: false,
            current_stock: 0,
            min_stock: 0,
            max_stock: 0,
            purchase_price: 0,
            selling_price: 0,
            wholesale_price: 0
        });
        if (closeModal) {
            this._modalToggler = false;
        }
    }
}
