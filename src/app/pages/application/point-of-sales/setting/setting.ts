import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { POSSettingAction, POSSettingState } from '../../../../store/point-of-sales';

@Component({
    selector: 'app-pos-setting',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        DshBaseLayout,
        TextareaModule,
        InputTextModule,
        InputNumberModule,
        CheckboxModule,
    ],
    templateUrl: './setting.html',
    styleUrl: './setting.scss'
})
export class Setting implements OnInit, OnDestroy {

    _store = inject(Store);
    _formBuilder = inject(FormBuilder);
    _messageService = inject(MessageService);

    Destroy$ = new Subject();

    _isEditMode = false;
    _isLoading = false;

    Form = this._formBuilder.group({
        id: [null as number | null],
        store_name: ['', [Validators.required]],
        store_address: [''],
        store_phone: [''],
        store_logo: [''],
        transaction_prefix: ['TRX', [Validators.required]],
        enable_shift: [false],
        bank_name: [''],
        bank_account: [''],
        bank_holder: [''],
        qris_image: [''],
        receipt_footer: ['Terima kasih atas kunjungan Anda!'],
    });

    ngOnInit(): void {
        this._store.dispatch(new POSSettingAction.GetSetting());

        this._store
            .select(POSSettingState.getSingle)
            .pipe(takeUntil(this.Destroy$))
            .subscribe(result => {
                if (result) {
                    this._isEditMode = true;
                    this.Form.patchValue(result as any);
                } else {
                    this._isEditMode = false;
                    this.Form.reset({
                        enable_shift: false,
                        transaction_prefix: 'TRX',
                        receipt_footer: 'Terima kasih atas kunjungan Anda!'
                    });
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
            if (!payload.id) {
                delete payload.id;
            }

            this._isLoading = true;
            this._store
                .dispatch(new POSSettingAction.AddSetting(payload))
                .subscribe(() => {
                    this._isLoading = false;
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Berhasil!',
                        detail: 'Pengaturan POS berhasil disimpan'
                    });
                });
        }
    }

    handleUpdate(formValue: any) {
        if (this.Form.valid) {
            this._isLoading = true;
            this._store
                .dispatch(new POSSettingAction.UpdateSetting(formValue))
                .subscribe(() => {
                    this._isLoading = false;
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Berhasil!',
                        detail: 'Pengaturan POS berhasil diubah'
                    });
                });
        }
    }

    handleReset() {
        this.Form.reset({
            enable_shift: false,
            transaction_prefix: 'TRX',
            receipt_footer: 'Terima kasih atas kunjungan Anda!'
        });
    }
}
