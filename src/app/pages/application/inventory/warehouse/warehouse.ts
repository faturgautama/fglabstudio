import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { Subject, takeUntil } from 'rxjs';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { Store } from '@ngxs/store';
import { WarehouseAction, WarehouseState } from '../../../../store/inventory/warehouse';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";
import { DialogModule } from "primeng/dialog";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'app-warehouse',
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
    templateUrl: './warehouse.html',
    styleUrl: './warehouse.scss'
})
export class Warehouse implements OnInit, OnDestroy {

    _store = inject(Store);
    _messageService = inject(MessageService);
    _confirmationService = inject(ConfirmationService);

    Destroy$ = new Subject();

    TableProps: DynamicTableModel.ITable = {
        id: 'warehouse',
        title: 'Daftar Gudang',
        description: 'Daftar gudang dalam sistem inventory',
        column: [
            {
                id: 'code',
                title: 'Kode',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '150px'
            },
            {
                id: 'name',
                title: 'Nama Gudang',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '250px'
            },
            {
                id: 'address',
                title: 'Alamat',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '300px'
            },
            {
                id: 'manager_name',
                title: 'Manager',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '200px'
            },
            {
                id: 'is_default',
                title: 'Default',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '100px'
            },
            {
                id: 'is_active',
                title: 'Status',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '120px'
            },
        ],
        datasource: [],
        filter: [
            {
                id: 'name',
                title: 'Nama Gudang',
                type: DynamicTableModel.IColumnType.TEXT,
                value: ''
            },
        ],
        sort: [
            {
                id: 'name',
                title: 'Nama Gudang',
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
        address: ['', []],
        city: ['', []],
        manager_name: ['', []],
        phone: ['', []],
        is_default: [false, []],
        is_active: [true, []]
    });

    ngOnInit(): void {
        this._store
            .select(WarehouseState.getAll)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => this.TableProps.datasource = result);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleCustomButtonClicked(args: DynamicTableModel.ICustomButton) {
        if (args.id == 'add') {
            this._formState = 'insert';
            this.Form.reset({ is_active: true, is_default: false });
            this._modalToggler = true;
        }
    }

    handleFilter(args: any) {
        const filter = args || {};
        this._store.dispatch(new WarehouseAction.GetWarehouse(filter, {}));
    }

    handleSort(args: any) {
        const sort = args || {};
        this._store.dispatch(new WarehouseAction.GetWarehouse({}, sort));
    }

    handleToolbarClicked(args: any) {
        if (args.toolbar.id == 'detail') {
            this._formState = 'update';
            this._modalToggler = true;
            this.Form.patchValue(args.data);
        };

        if (args.toolbar.id == 'delete') {
            this._confirmationService.confirm({
                message: 'Apakah anda yakin menghapus gudang ini?',
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
                        .dispatch(new WarehouseAction.DeleteWarehouse(args.data.id))
                        .subscribe((result) => {
                            setTimeout(() => {
                                this._messageService.clear();
                                this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Gudang Berhasil Dihapus' });
                            }, 3100);
                        })
                },
            });
        };
    }

    handleSave(args: any) {
        if (this.Form.valid) {
            this._store
                .dispatch(new WarehouseAction.AddWarehouse(args))
                .subscribe((result) => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Gudang Berhasil Disimpan' });
                        this.resetForm(true);
                    }, 3100);
                })
        }
    }

    handleUpdate(args: any) {
        if (this.Form.valid) {
            this._store
                .dispatch(new WarehouseAction.UpdateWarehouse(args))
                .subscribe((result) => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Gudang Berhasil Diubah' });
                        this.resetForm(true);
                    }, 3100);
                })
        }
    }

    private resetForm(closeModal?: boolean) {
        this.Form.reset({ is_active: true, is_default: false });
        if (closeModal) {
            this._modalToggler = false;
        }
    }
}
