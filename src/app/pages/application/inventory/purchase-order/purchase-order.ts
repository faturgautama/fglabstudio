import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { Subject, takeUntil } from 'rxjs';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { Store } from '@ngxs/store';
import { PurchaseOrderAction, PurchaseOrderState } from '../../../../store/inventory/purchase-order';
import { SupplierState } from '../../../../store/inventory/supplier';
import { ProductState } from '../../../../store/inventory/product';
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
import { PurchaseOrderService } from '../../../../services/pages/application/inventory/purchase-order.service';

@Component({
    selector: 'app-purchase-order',
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
    templateUrl: './purchase-order.html',
    styleUrl: './purchase-order.scss'
})
export class PurchaseOrder implements OnInit, OnDestroy {

    _store = inject(Store);
    _purchaseOrderService = inject(PurchaseOrderService);
    _messageService = inject(MessageService);
    _confirmationService = inject(ConfirmationService);
    _formBuilder = inject(FormBuilder);

    Destroy$ = new Subject();

    _pageState = signal<'list' | 'form'>('list');
    _formState: 'insert' | 'update' = 'insert';

    _suppliers: any[] = [];
    _products: any[] = [];

    STATUS_OPTIONS = [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Submitted', value: 'SUBMITTED' },
        { label: 'Partial', value: 'PARTIAL' },
        { label: 'Received', value: 'RECEIVED' },
        { label: 'Cancelled', value: 'CANCELLED' }
    ];

    PAYMENT_STATUS_OPTIONS = [
        { label: 'Unpaid', value: 'UNPAID' },
        { label: 'Partial', value: 'PARTIAL' },
        { label: 'Paid', value: 'PAID' }
    ];

    Form = this._formBuilder.group({
        id: ['', []],
        po_number: ['', [Validators.required]],
        supplier_id: ['', [Validators.required]],
        order_date: [new Date(), [Validators.required]],
        expected_date: ['', []],
        received_date: ['', []],
        status: ['DRAFT', [Validators.required]],
        subtotal: [0, [Validators.required]],
        discount_amount: [0, []],
        discount_percentage: [0, []],
        tax_amount: [0, []],
        shipping_cost: [0, []],
        other_costs: [0, []],
        total_amount: [0, [Validators.required]],
        payment_status: ['UNPAID', []],
        payment_method: ['', []],
        payment_date: ['', []],
        delivery_address: ['', []],
        tracking_number: ['', []],
        invoice_number: ['', []],
        invoice_date: ['', []],
        notes: ['', []],
        internal_notes: ['', []],
        items: this._formBuilder.array([])
    });

    TableProps: DynamicTableModel.ITable = {
        id: 'purchase_order',
        title: 'Daftar Purchase Order',
        description: 'Daftar purchase order dalam sistem inventory',
        column: [
            {
                id: 'po_number',
                title: 'No. PO',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '150px'
            },
            {
                id: 'order_date',
                title: 'Tanggal Order',
                type: DynamicTableModel.IColumnType.DATE,
                width: '150px'
            },
            {
                id: 'supplier_id',
                title: 'Supplier',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '200px'
            },
            {
                id: 'total_amount',
                title: 'Total',
                type: DynamicTableModel.IColumnType.CURRENCY,
                width: '150px'
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
                id: 'po_number',
                title: 'No. PO',
                type: DynamicTableModel.IColumnType.TEXT,
                value: ''
            },
        ],
        sort: [
            {
                id: 'order_date',
                title: 'Tanggal Order',
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
            .select(PurchaseOrderState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this.TableProps.datasource = result);

        this._store
            .select(SupplierState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this._suppliers = result.filter((s: any) => s.is_active));

        this._store
            .select(ProductState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this._products = result.filter((p: any) => p.is_active && p.is_purchasable));
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    get items(): FormArray {
        return this.Form.get('items') as FormArray;
    }

    generatePONumber() {
        if (this._formState === 'insert') {
            this._purchaseOrderService.generatePONumber().subscribe(po_number => {
                this.Form.patchValue({ po_number });
            });
        }
    }

    addItem() {
        const itemForm = this._formBuilder.group({
            product_id: ['', [Validators.required]],
            qty_ordered: [0, [Validators.required, Validators.min(1)]],
            qty_received: [0, []],
            unit_price: [0, [Validators.required, Validators.min(0)]],
            discount_percentage: [0, []],
            discount_amount: [0, []],
            tax_percentage: [0, []],
            tax_amount: [0, []],
            subtotal: [0, []],
            notes: ['', []],
            batch_number: ['', []],
            expiry_date: ['', []],
            serial_numbers: [[], []]
        });

        this.items.push(itemForm);
    }

    removeItem(index: number) {
        this.items.removeAt(index);
        this.calculateTotals();
    }

    calculateItemSubtotal(index: number) {
        const item = this.items.at(index);
        const qty = item.get('qty_ordered')?.value || 0;
        const price = item.get('unit_price')?.value || 0;
        const discountPct = item.get('discount_percentage')?.value || 0;
        const taxPct = item.get('tax_percentage')?.value || 0;

        const baseAmount = qty * price;
        const discountAmount = baseAmount * (discountPct / 100);
        const afterDiscount = baseAmount - discountAmount;
        const taxAmount = afterDiscount * (taxPct / 100);
        const subtotal = afterDiscount + taxAmount;

        item.patchValue({
            discount_amount: discountAmount,
            tax_amount: taxAmount,
            subtotal: subtotal
        }, { emitEvent: false });

        this.calculateTotals();
    }

    calculateTotals() {
        let subtotal = 0;
        this.items.controls.forEach(item => {
            subtotal += item.get('subtotal')?.value || 0;
        });

        const discountPct = this.Form.get('discount_percentage')?.value || 0;
        const discountAmount = subtotal * (discountPct / 100);
        const taxAmount = this.Form.get('tax_amount')?.value || 0;
        const shippingCost = this.Form.get('shipping_cost')?.value || 0;
        const otherCosts = this.Form.get('other_costs')?.value || 0;

        const total = subtotal - discountAmount + taxAmount + shippingCost + otherCosts;

        this.Form.patchValue({
            subtotal: subtotal,
            discount_amount: discountAmount,
            total_amount: total
        }, { emitEvent: false });
    }

    handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
        if (args.id == 'add') {
            this._formState = 'insert';
            this._pageState.set('form');
            this.Form.reset({
                status: 'DRAFT',
                payment_status: 'UNPAID',
                order_date: new Date(),
                subtotal: 0,
                discount_amount: 0,
                discount_percentage: 0,
                tax_amount: 0,
                shipping_cost: 0,
                other_costs: 0,
                total_amount: 0
            });
            this.items.clear();
            this.addItem();
            this.generatePONumber();
        }
    }

    handleFilter(args: any) {
        const filter = args || {};
        this._store.dispatch(new PurchaseOrderAction.GetPurchaseOrder(filter, {}));
    }

    handleSort(args: any) {
        const sort = args || {};
        this._store.dispatch(new PurchaseOrderAction.GetPurchaseOrder({}, sort));
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
                message: 'Apakah anda yakin menghapus PO ini?',
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
                        .dispatch(new PurchaseOrderAction.DeletePurchaseOrder(args.data.id.toString()))
                        .subscribe((result) => {
                            setTimeout(() => {
                                this._messageService.clear();
                                this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'PO Berhasil Dihapus' });
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
            const { items, ...poData } = formValue;

            this._store
                .dispatch(new PurchaseOrderAction.AddPurchaseOrder(poData, items || []))
                .subscribe(() => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'PO Berhasil Disimpan' });
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
                .dispatch(new PurchaseOrderAction.UpdatePurchaseOrder(formValue))
                .subscribe((result) => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'PO Berhasil Diubah' });
                        this.handleBackToList();
                    }, 3100);
                })
        }
    }
}
