import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { Subject, takeUntil } from 'rxjs';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { Store } from '@ngxs/store';
import { CategoryAction, CategoryState } from '../../../../store/inventory/category';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";
import { DialogModule } from "primeng/dialog";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-category',
    imports: [
        FormsModule,
        ButtonModule,
        DynamicTable,
        DialogModule,
        DshBaseLayout,
        SelectModule,
        TitleCasePipe,
        TextareaModule,
        InputTextModule,
        CheckboxModule,
        ReactiveFormsModule,
    ],
    standalone: true,
    templateUrl: './category.html',
    styleUrl: './category.scss'
})
export class Category implements OnInit, OnDestroy {

    _store = inject(Store);
    _messageService = inject(MessageService);
    _confirmationService = inject(ConfirmationService);

    Destroy$ = new Subject();

    TableProps: DynamicTableModel.ITable = {
        id: 'category',
        title: 'Daftar Kategori Produk',
        description: 'Daftar kategori produk dalam sistem inventory',
        column: [
            {
                id: 'name',
                title: 'Nama Kategori',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '300px'
            },
            {
                id: 'description',
                title: 'Deskripsi',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '400px'
            },
            {
                id: 'color',
                title: 'Warna',
                type: DynamicTableModel.IColumnType.BUTTON_ICON,
                button_icon: {
                    title: 'color',
                    icon_class: 'pi pi-circle-fill',
                    icon_color: 'color',
                    use_parsing_func: true,
                }
            },
            {
                id: 'is_active',
                title: 'Status',
                type: DynamicTableModel.IColumnType.TEXT,
                width: '120px'
            },
            {
                id: 'created_at',
                title: 'Waktu Entry',
                type: DynamicTableModel.IColumnType.DATETIME,
                width: '300px'
            },
        ],
        datasource: [],
        filter: [
            {
                id: 'name',
                title: 'Nama Kategori',
                type: DynamicTableModel.IColumnType.TEXT,
                value: ''
            },
        ],
        sort: [
            {
                id: 'name',
                title: 'Nama Kategori',
                value: ''
            },
            {
                id: 'created_at',
                title: 'Waktu Entry',
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
        name: ['', [Validators.required]],
        description: ['', []],
        color: ['', [Validators.required]],
        is_active: [true, []]
    });

    _colorDatasource = [
        { id: 'red', value: 'text-red-600' },
        { id: 'orange', value: 'text-orange-600' },
        { id: 'amber', value: 'text-amber-600' },
        { id: 'yellow', value: 'text-yellow-600' },
        { id: 'lime', value: 'text-lime-600' },
        { id: 'green', value: 'text-green-600' },
        { id: 'emerald', value: 'text-emerald-600' },
        { id: 'teal', value: 'text-teal-600' },
        { id: 'cyan', value: 'text-cyan-600' },
        { id: 'sky', value: 'text-sky-600' },
        { id: 'blue', value: 'text-blue-600' },
        { id: 'indigo', value: 'text-indigo-600' },
        { id: 'violet', value: 'text-violet-600' },
        { id: 'purple', value: 'text-purple-600' },
        { id: 'fuchsia', value: 'text-fuchsia-600' },
        { id: 'pink', value: 'text-pink-600' },
        { id: 'rose', value: 'text-rose-600' },
        { id: 'slate', value: 'text-slate-600' },
        { id: 'gray', value: 'text-gray-600' },
        { id: 'zinc', value: 'text-zinc-600' },
        { id: 'neutral', value: 'text-neutral-600' },
        { id: 'stone', value: 'text-stone-600' },
    ];

    ngOnInit(): void {
        this._store
            .select(CategoryState.getAll)
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
            this.Form.reset({ is_active: true });
            this._modalToggler = true;
        }
    }

    handleFilter(args: any) {
        const filter = args || {};
        this._store.dispatch(new CategoryAction.GetCategory(filter, {}));
    }

    handleSort(args: any) {
        const sort = args || {};
        this._store.dispatch(new CategoryAction.GetCategory({}, sort));
    }

    handleToolbarClicked(args: any) {
        if (args.toolbar.id == 'detail') {
            this._formState = 'update';
            this._modalToggler = true;
            this.Form.patchValue(args.data);
        };

        if (args.toolbar.id == 'delete') {
            this._confirmationService.confirm({
                message: 'Apakah anda yakin menghapus kategori ini?',
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
                        .dispatch(new CategoryAction.DeleteCategory(args.data.id))
                        .subscribe((result) => {
                            setTimeout(() => {
                                this._messageService.clear();
                                this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Kategori Berhasil Dihapus' });
                            }, 3100);
                        })
                },
            });
        };
    }

    handleSave(args: any) {
        if (this.Form.valid) {
            this._store
                .dispatch(new CategoryAction.AddCategory(args))
                .subscribe((result) => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Kategori Berhasil Disimpan' });
                        this.resetForm(true);
                    }, 3100);
                })
        }
    }

    handleUpdate(args: any) {
        if (this.Form.valid) {
            this._store
                .dispatch(new CategoryAction.UpdateCategory(args))
                .subscribe((result) => {
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Kategori Berhasil Diubah' });
                        this.resetForm(true);
                    }, 3100);
                })
        }
    }

    private resetForm(closeModal?: boolean) {
        this.Form.reset({ is_active: true });
        if (closeModal) {
            this._modalToggler = false;
        }
    }
}
