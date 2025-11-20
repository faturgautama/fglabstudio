import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { CompanySettingAction, CompanySettingState } from '../../../../store/inventory';

@Component({
    selector: 'app-company-setting',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        SelectModule,
        DshBaseLayout,
        TextareaModule,
        InputTextModule,
    ],
    templateUrl: './company-setting.html',
    styleUrl: './company-setting.scss'
})
export class CompanySetting implements OnInit, OnDestroy {

    _store = inject(Store);
    _formBuilder = inject(FormBuilder);
    _messageService = inject(MessageService);

    Destroy$ = new Subject();

    _isEditMode: boolean = false;
    _isLoading: boolean = false;

    CURRENCIES = [
        { label: 'IDR - Indonesian Rupiah', value: 'IDR' },
        { label: 'USD - US Dollar', value: 'USD' },
        { label: 'EUR - Euro', value: 'EUR' },
        { label: 'SGD - Singapore Dollar', value: 'SGD' },
    ];

    Form = this._formBuilder.group({
        id: ['', []],
        name: ['', [Validators.required]],
        logo: ['', []],
        address: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        currency: ['IDR', [Validators.required]],
        sku_prefix: ['', [Validators.required]],
    });

    ngOnInit(): void {
        this._store
            .select(CompanySettingState.getSingle)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => {
                if (result) {
                    this._isEditMode = true;
                    this.Form.patchValue(result as any);
                } else {
                    this._isEditMode = false;
                    this.Form.reset({ currency: 'IDR' });
                }
            });
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleSave(formValue: any) {
        if (this.Form.valid) {
            const payload = { ...formValue };
            if (!payload.id || payload.id === '') {
                delete payload.id;
            }

            this._isLoading = true;
            this._store
                .dispatch(new CompanySettingAction.AddCompanySetting(payload))
                .subscribe(() => {
                    this._isLoading = false;
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Berhasil!',
                            detail: 'Data Pengaturan Perusahaan Berhasil Disimpan'
                        });
                    }, 300);
                });
        }
    }

    handleUpdate(formValue: any) {
        if (this.Form.valid) {
            this._isLoading = true;
            this._store
                .dispatch(new CompanySettingAction.UpdateCompanySetting(formValue))
                .subscribe(() => {
                    this._isLoading = false;
                    setTimeout(() => {
                        this._messageService.clear();
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Berhasil!',
                            detail: 'Data Pengaturan Perusahaan Berhasil Diubah'
                        });
                    }, 300);
                });
        }
    }

    handleReset() {
        this.Form.reset({ currency: 'IDR' });
    }
}
