# Leave Policies Feature - Detailed Changes

## Summary
Added dynamic leave policies management form to the Company Setting component. Users can now add, edit, and remove multiple leave policies (e.g., Annual Leave: 12 days, Maternity Leave: 90 days, etc.) directly from the company settings page.

---

## Component TypeScript Changes

### File: `company-setting.ts`

#### 1. Added FormArray Import
```typescript
// BEFORE
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// AFTER
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
```

#### 2. Added Leave Type Dropdowns
```typescript
// NEW CODE ADDED
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
```

#### 3. Added FormArray to Form Group
```typescript
// BEFORE
Form = this._formBuilder.group({
  id: ['', []],
  company_name: ['', [Validators.required]],
  // ... other fields ...
  created_at: ['', []],
  updated_at: ['', []],
});

// AFTER
Form = this._formBuilder.group({
  id: ['', []],
  company_name: ['', [Validators.required]],
  // ... other fields ...
  created_at: ['', []],
  updated_at: ['', []],
  leave_policies: this._formBuilder.array([]),  // NEW
});
```

#### 4. Enhanced ngOnInit() to Load Existing Policies
```typescript
// ADDED TO ngOnInit()
// Load leave policies
if (formData.leave_policies && Array.isArray(formData.leave_policies)) {
  const leavePoliciesArray = this.Form.get('leave_policies') as FormArray;
  leavePoliciesArray.clear();
  formData.leave_policies.forEach((policy: any) => {
    leavePoliciesArray.push(this.createLeavePolicy(policy));
  });
}
```

#### 5. New Methods Added
```typescript
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
```

---

## Component Template Changes

### File: `company-setting.html`

#### New Section 6: Leave Policies Form

```html
<!-- Section 6: Kebijakan Cuti -->
<div class="bg-white p-5 rounded-lg shadow-sm mb-5">
    <div class="flex flex-row justify-between items-start mb-5 pb-3 border-b border-gray-300">
        <div class="flex flex-col gap-1">
            <p class="text-base font-semibold text-gray-700">Kebijakan Cuti</p>
            <p class="text-sm text-gray-500">Kelola kebijakan cuti perusahaan</p>
        </div>
        <p-button severity="success" size="small" 
            [icon]="'pi pi-plus'" 
            label="Tambah Cuti" 
            (onClick)="addLeavePolicy()">
        </p-button>
    </div>

    @if (leavePolicies.length > 0) {
        <div class="space-y-5">
            @for (policy of leavePolicies.controls; track $index; let i = $index) {
                <!-- Dynamic policy form cards -->
                <!-- Fields:
                     - Kode (Code)
                     - Nama Kebijakan (Title)
                     - Deskripsi (Description)
                     - Jenis Cuti (Leave Type)
                     - Total Hari (Total Days)
                     - Pembatasan Gender (Gender Restriction)
                     - Checkboxes (Is Paid, Requires Approval, Is Active)
                -->
            }
        </div>
    } @else {
        <div class="text-center py-8">
            <p class="text-gray-500">Belum ada kebijakan cuti. Klik tombol "Tambah Cuti" untuk menambahkan.</p>
        </div>
    }
</div>
```

#### Form Fields in Each Policy Card

1. **Kode (Code)** - Text input, required
2. **Nama Kebijakan (Title)** - Text input, required
3. **Deskripsi (Description)** - Textarea, optional
4. **Jenis Cuti (Leave Type)** - Dropdown select, required
5. **Total Hari (Total Days)** - Number input, required
6. **Pembatasan Gender (Gender Restriction)** - Dropdown select, optional
7. **Cuti Berbayar (Is Paid)** - Checkbox
8. **Memerlukan Persetujuan (Requires Approval)** - Checkbox
9. **Aktif (Is Active)** - Checkbox

#### Design Features
- Blue left border (4px) for visual distinction
- Light gray background for policy cards
- Responsive 2-column grid on desktop, 1 column on mobile
- Delete button with trash icon for each policy
- Empty state message when no policies exist

---

## Data Model Reference

The leave policies use the existing `ILeavePolicy` interface:

```typescript
export interface ILeavePolicy extends IBaseModel {
  code: string;                                    // Unique identifier
  title: string;                                   // Policy name
  description?: string;                            // Optional description
  leave_type: 'annual' | 'maternity' | 'paternity' | 'sick' | 'unpaid' | 'other';
  total_days: number;                              // Number of leave days
  gender_restriction?: 'male' | 'female' | 'all';  // Optional gender restriction
  requires_approval: boolean;                      // Whether approval is needed
  is_paid: boolean;                                // Whether leave is paid
  is_active: boolean;                              // Whether policy is active
}
```

---

## Usage Scenarios

### Scenario 1: Add Annual Leave Policy
1. Click "Tambah Cuti" button
2. Fill in:
   - Kode: `CUTI_TAHUNAN`
   - Nama: `Cuti Tahunan`
   - Jenis: `Cuti Tahunan`
   - Total Hari: `12`
   - Checkboxes: All checked
3. Click "Simpan"

### Scenario 2: Add Maternity Leave (Female Only)
1. Click "Tambah Cuti" button
2. Fill in:
   - Kode: `CUTI_MELAHIRKAN`
   - Nama: `Cuti Melahirkan`
   - Jenis: `Cuti Melahirkan`
   - Total Hari: `90`
   - Pembatasan Gender: `Perempuan`
   - Checkboxes: All checked
3. Click "Simpan"

### Scenario 3: Add Unpaid Leave
1. Click "Tambah Cuti" button
2. Fill in:
   - Kode: `CUTI_UNPAID`
   - Nama: `Cuti Tidak Berbayar`
   - Jenis: `Cuti Tidak Berbayar`
   - Total Hari: `365`
   - Checkboxes: Uncheck "Cuti Berbayar"
3. Click "Simpan"

### Scenario 4: Remove a Policy
1. Find the policy card to remove
2. Click the trash icon on the card
3. Policy is immediately removed from form
4. Click "Update" to persist changes

---

## Form Validation

| Field | Validation | Error Message |
|-------|-----------|---------------|
| Kode | Required | Kode tidak boleh kosong |
| Nama | Required | Nama tidak boleh kosong |
| Jenis | Required | - |
| Total Hari | Required + Min 0 | Masukkan jumlah hari yang valid |

---

## Technical Details

### FormArray Management
- Uses Angular Reactive Forms `FormArray` for dynamic form management
- `createLeavePolicy()` factory method creates new form groups
- `addLeavePolicy()` adds to array
- `removeLeavePolicy()` removes from array
- `leavePolicies` getter provides easy access

### Form Validation
- Code and Title are required fields
- Total Days must be >= 0
- Leave Type is required
- All values are validated before save

### Data Persistence
- Leave policies save as part of company settings
- Uses existing `CompanySettingService` and state management
- Automatically loads when company settings are loaded
- Included in form value sent to backend

---

## Benefits

✅ **Easy Policy Management** - Add/remove policies with single click  
✅ **Flexible Configuration** - Support for 6 types of leave policies  
✅ **Gender Restrictions** - Can limit policies to specific genders  
✅ **Validation** - Prevents invalid data entry  
✅ **Responsive** - Works on desktop and mobile  
✅ **Integrated** - Uses existing form and state management  
✅ **Scalable** - Support unlimited number of policies  
✅ **Localized** - All labels in Bahasa Indonesia  

---

## Files Created/Modified

1. ✅ **company-setting.ts** - Enhanced with FormArray and new methods
2. ✅ **company-setting.html** - Added Section 6 with dynamic form
3. ✅ **company-setting.scss** - No changes needed (existing styles work)
4. ✅ **LEAVE_POLICIES_GUIDE.md** - New comprehensive guide
5. ✅ **IMPLEMENTATION_SUMMARY.md** - New implementation summary

---

## Testing Checklist

- [ ] Add single leave policy
- [ ] Add multiple leave policies
- [ ] Edit policy values
- [ ] Remove policy from middle of list
- [ ] Remove policy from end of list
- [ ] Verify form validates required fields
- [ ] Verify data saves correctly
- [ ] Verify data loads correctly on reload
- [ ] Test on mobile/responsive view
- [ ] Verify gender restriction dropdown works
- [ ] Verify leave type dropdown works
- [ ] Test empty state message display

---

**Implementation completed**: November 7, 2025
