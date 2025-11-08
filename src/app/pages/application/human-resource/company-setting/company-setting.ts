import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { EmployeeModel } from '../../../../model/pages/application/human-resource/employee.model';
import { EmployeeConstants } from '../../../../model/pages/application/human-resource/employee.constants';
import { DshBaseLayout } from '../../../../components/dashboard/dsh-base-layout/dsh-base-layout';
import { CompanySettingAction, CompanySettingState } from '../../../../store/human-resource/company-setting';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';

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
    InputNumberModule,
    DatePickerModule,
    CheckboxModule,
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

  // Dropdowns
  TAX_METHODS = EmployeeConstants.TAX_METHODS;
  TAX_PTKP_TYPES = EmployeeConstants.TAX_PTKP_TYPES;

  // Leave types for dropdown
  LEAVE_TYPES = [
    { label: 'Cuti Tahunan', value: 'annual' },
    { label: 'Cuti Melahirkan', value: 'maternity' },
    { label: 'Cuti Ayah', value: 'paternity' },
    { label: 'Cuti Sakit', value: 'sick' },
    { label: 'Cuti Tidak Berbayar', value: 'unpaid' },
    { label: 'Cuti Lainnya', value: 'other' }
  ];

  GENDER_RESTRICTIONS = [
    { label: 'Semua', value: 'all' },
    { label: 'Laki-laki', value: 'male' },
    { label: 'Perempuan', value: 'female' }
  ];

  // Form
  Form = this._formBuilder.group({
    id: ['', []],
    company_name: ['', [Validators.required]],
    effective_date: ['', [Validators.required]],
    is_active: [true, []],
    overtime_rate_per_hour: [0, [Validators.required]],
    has_bpjs_ketenagakerjaan: [false, []],
    bpjs_ketenagakerjaan_employee: [2, []],
    bpjs_ketenagakerjaan_company: [3.7, []],
    has_bpjs_pensiun: [false, []],
    bpjs_pensiun_employee: [1, []],
    bpjs_pensiun_company: [2, []],
    has_bpjs_kesehatan: [false, []],
    bpjs_kesehatan_employee: [1, []],
    bpjs_kesehatan_company: [4, []],
    has_tax: [false, []],
    tax_method: ['gross', []],
    tax_ptkp_type: ['TK0', []],
    created_at: ['', []],
    updated_at: ['', []],
    leave_policies: this._formBuilder.array([]),
  });

  ngOnInit(): void {
    this._store
      .select(CompanySettingState.getSingle)
      .pipe(takeUntil(this.Destroy$))
      .subscribe(result => {
        if (result) {
          this._isEditMode = true;
          const formData: any = { ...result };
          // Convert date object to string if needed
          if (formData.effective_date && typeof formData.effective_date !== 'string') {
            formData.effective_date = new Date(formData.effective_date).toISOString().split('T')[0];
          }
          this.Form.patchValue(formData);

          // Load leave policies
          if (formData.leave_policies && Array.isArray(formData.leave_policies)) {
            const leavePoliciesArray = this.Form.get('leave_policies') as FormArray;
            leavePoliciesArray.clear();
            formData.leave_policies.forEach((policy: any) => {
              leavePoliciesArray.push(this.createLeavePolicy(policy));
            });
          }
        } else {
          this._isEditMode = false;
          this.Form.reset({ is_active: true, tax_method: 'gross', tax_ptkp_type: 'TK0' });
          const leavePoliciesArray = this.Form.get('leave_policies') as FormArray;
          leavePoliciesArray.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.Destroy$.next(0);
    this.Destroy$.complete();
  }

  /**
   * Create a new leave policy form group
   */
  createLeavePolicy(data?: any) {
    return this._formBuilder.group({
      id: [data?.id || '', []],
      code: [data?.code || '', [Validators.required]],
      title: [data?.title || '', [Validators.required]],
      description: [data?.description || '', []],
      leave_type: [data?.leave_type || 'annual', [Validators.required]],
      total_days: [data?.total_days || 0, [Validators.required, Validators.min(0)]],
      gender_restriction: [data?.gender_restriction || 'all', []],
      requires_approval: [data?.requires_approval || true, []],
      is_paid: [data?.is_paid || true, []],
      is_active: [data?.is_active || true, []],
    });
  }

  /**
   * Get leave policies FormArray
   */
  get leavePolicies(): FormArray {
    return this.Form.get('leave_policies') as FormArray;
  }

  /**
   * Get leave policies controls typed as FormGroup[]
   */
  get leavePoliciesControls(): FormGroup[] {
    return this.leavePolicies.controls as FormGroup[];
  }

  /**
   * Add new leave policy
   */
  addLeavePolicy() {
    this.leavePolicies.push(this.createLeavePolicy());
  }

  /**
   * Remove leave policy
   */
  removeLeavePolicy(index: number) {
    this.leavePolicies.removeAt(index);
  }

  handleSave(formValue: any) {
    if (this.Form.valid) {

      console.log("payload =>", formValue);

      // Remove empty id for new records (Dexie auto-increment requirement)
      const payload = { ...formValue };
      if (!payload.id || payload.id === '') {
        delete payload.id;
      }

      // Clean up leave_policies - remove empty ids
      if (Array.isArray(payload.leave_policies)) {
        payload.leave_policies = payload.leave_policies.map((policy: any) => {
          const cleanPolicy = { ...policy };
          if (!cleanPolicy.id || cleanPolicy.id === '') {
            delete cleanPolicy.id;
          }
          return cleanPolicy;
        });
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
    this.Form.reset({ is_active: true, tax_method: 'gross', tax_ptkp_type: 'TK0' });
  }
}
