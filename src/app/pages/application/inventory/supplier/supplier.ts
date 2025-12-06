import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { Subject, takeUntil } from 'rxjs';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { Store } from '@ngxs/store';
import { SupplierAction, SupplierState } from '../../../../store/inventory/supplier';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";
import { DialogModule } from "primeng/dialog";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { SupplierService } from '../../../../services/pages/application/inventory/supplier.service';

@Component({
    selector: 'app-supplier',
    imports: [
        FormsModule,
        ButtonModule,
        DynamicTable,
        DialogModule,
        DshBaseLayout,
        TextareaModule,
        InputTextModule,
        CheckboxModule,
        ReactiveFormsModule,
    ],
    standalone: true,
    templateUrl: './supplier.html',
    styleUrl: './supplier.scss'
})
export class Supplier implements OnInit, OnDestroy {

    _store = inject(Store);
    _supplierService = inject(SupplierService);
    _messageService = inject(MessageService);
    _confirmationService = inject(ConfirmationService);

    Destroy$ = new Subject();

    TableProps: DynamicTableModel.ITable = {
        id: 'supplier',
        title: 'Daftar Supplier',
        description: 'Daftar supplier dalam sistem inventory',
        column: [
            {
                id: 'code',
                title: 'Kode',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '200px'
            },
            {
                id: 'name',
                title: 'Nama Supplier',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '300px'
            },
            {
                id: 'contact_person',
                title: 'Contact Person',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '200px'
            },
            {
                id: 'phone',
                title: 'Telepon',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '150px'
            },
            {
                id: 'email',
                title: 'Email',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '200px'
            },
        ],
        datasource: [],
        filter: [
            {
                id: 'name',
                title: 'Nama Supplier',
                type: DynamicTableModel.IColumnType.TEXT,
                value: ''
            },
            {
                id: 'code',
                title: 'Kode',
                type: DynamicTableModel.IColumnType.TEXT,
                value: ''
            },
        ],
        sort: [
            {
                id: 'name',
                title: 'Nama Supplier',
                value: ''
            },
            {
                id: 'code',
                title: 'Kode',
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
        code: ['', [Validators.required]],
        name: ['', [Validators.required]],
        contact_person: ['', []],
        phone: ['', []],
        mobile: ['', []],
        email: ['', [Validators.email]],
        website: ['', []],
        address: ['', []],
        city: ['', []],
        postal_code: ['', []],
        country: ['', []],
        payment_terms: ['', []],
        payment_method: ['', []],
        bank_name: ['', []],
        bank_account: ['', []],
        tax_id: ['', []],
        is_pkp: [false, []],
        is_active: [true, []],
        notes: ['', []]
    });

    ngOnInit(): void {
        this._store
            .select(SupplierState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this.TableProps.datasource = result);

        this.generateCode();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    generateCode() {
        if (this._formState === 'insert') {
            this._supplierService.generateSupplierCode().subscribe(code => {
                this.Form.patchValue({ code });
            });
        }
    }

    handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
        if (args.id == 'add') {
            this._formState = 'insert';
            this.Form.reset({ is_active: true, is_pkp: false });
            this.generateCode();
            this._modalToggler = true;
        }
    }

    handleFilter(args: any) {
        const filter = args || {};
        this._store.dispatch(new SupplierAction.GetSupplier(filter, {}));
    }

    handleSort(args: any) {
        const sort = args || {};
        this._store.dispatch(new SupplierAction.GetSupplier({}, sort));
    }

    handleToolbarClicked(args: any) {
        if (args.toolbar.id == 'detail') {
            this._formState = 'update';
            this._modalToggler = true;
            this.Form.patchValue(args.data);
        };

        if (args.toolbar.id == 'delete') {
            this._confirmationService.confirm({
                message: 'Apakah anda yakin menghapus supplier ini?',
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
                        .dispatch(new SupplierAction.DeleteSupplier(args.data.id))
                        .subscribe((result) => {
                            setTimeout(() => {
                                this._messageService.clear();
                                this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Supplier Berhasil Dihapus' });
                            }, 3100);
                        })
                },
            });
        };
    }

    handleSave(args: any) {
        if (this.Form.valid) {
            this._store
                .dispatch(new SupplierAction.AddSupplier(args))
                .subscribe((result) => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Supplier Berhasil Disimpan' });
                        this.resetForm(true);
                    }, 3100);
                })
        }
    }

    handleUpdate(args: any) {
        if (this.Form.valid) {
            this._store
                .dispatch(new SupplierAction.UpdateSupplier(args))
                .subscribe((result) => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Supplier Berhasil Diubah' });
                        this.resetForm(true);
                    }, 3100);
                })
        }
    }

    private resetForm(closeModal?: boolean) {
        this.Form.reset({ is_active: true, is_pkp: false });
        if (closeModal) {
            this._modalToggler = false;
        }
    }
}
