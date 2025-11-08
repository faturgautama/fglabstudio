# Leave Policies Dynamic Form Guide

## Overview
The Company Setting component now includes a dynamic form for managing company leave policies. Users can add, edit, and remove leave policies directly from the company settings page.

## Features

### 1. Dynamic Form Array
- **Add Multiple Policies**: Click "Tambah Cuti" button to add as many leave policies as needed
- **Remove Policies**: Delete any policy using the trash icon on each policy card
- **Persistent Storage**: All policies are saved with the company settings

### 2. Leave Policy Fields

Each leave policy includes the following configurable fields:

#### Required Fields
- **Kode (Code)**: Unique identifier for the policy (e.g., `CUTI_TAHUNAN`)
- **Nama Kebijakan (Title)**: Policy name (e.g., `Cuti Tahunan`)
- **Jenis Cuti (Leave Type)**: Type of leave
  - Cuti Tahunan (Annual)
  - Cuti Melahirkan (Maternity)
  - Cuti Ayah (Paternity)
  - Cuti Sakit (Sick)
  - Cuti Tidak Berbayar (Unpaid)
  - Cuti Lainnya (Other)
- **Total Hari (Total Days)**: Number of leave days (e.g., `12`)

#### Optional Fields
- **Deskripsi (Description)**: Additional details about the policy
- **Pembatasan Gender (Gender Restriction)**:
  - Semua (All)
  - Laki-laki (Male)
  - Perempuan (Female)

#### Checkboxes
- **Cuti Berbayar (Is Paid)**: Whether the leave is paid (default: true)
- **Memerlukan Persetujuan (Requires Approval)**: Whether approval is needed (default: true)
- **Aktif (Is Active)**: Whether the policy is active (default: true)

## Example Configuration

### Annual Leave (Cuti Tahunan)
```
- Kode: CUTI_TAHUNAN
- Nama: Cuti Tahunan
- Jenis: annual
- Total Hari: 12
- Pembatasan Gender: Semua
- Cuti Berbayar: ✓
- Memerlukan Persetujuan: ✓
- Aktif: ✓
```

### Maternity Leave (Cuti Melahirkan)
```
- Kode: CUTI_MELAHIRKAN
- Nama: Cuti Melahirkan
- Jenis: maternity
- Total Hari: 90
- Pembatasan Gender: Perempuan
- Cuti Berbayar: ✓
- Memerlukan Persetujuan: ✓
- Aktif: ✓
```

### Sick Leave (Cuti Sakit)
```
- Kode: CUTI_SAKIT
- Nama: Cuti Sakit
- Jenis: sick
- Total Hari: 12
- Pembatasan Gender: Semua
- Cuti Berbayar: ✓
- Memerlukan Persetujuan: ✗
- Aktif: ✓
```

## Data Model

The leave policies are stored according to the `ILeavePolicy` interface:

```typescript
export interface ILeavePolicy extends IBaseModel {
  code: string;
  title: string;
  description?: string;
  leave_type: 'annual' | 'maternity' | 'paternity' | 'sick' | 'unpaid' | 'other';
  total_days: number;
  gender_restriction?: 'male' | 'female' | 'all';
  requires_approval: boolean;
  is_paid: boolean;
  is_active: boolean;
}
```

## Form Validation

- **Code & Title**: Required fields - must not be empty
- **Total Days**: Must be a valid number >= 0
- **Leave Type**: Required field

## Component Methods

### TypeScript Methods
- `createLeavePolicy(data?)`: Create a new form group for a leave policy
- `addLeavePolicy()`: Add a new empty leave policy form
- `removeLeavePolicy(index)`: Remove a policy at specified index
- `leavePolicies`: Getter for the leave policies FormArray

### Template
- `leavePolicies.length > 0`: Check if any policies exist
- `leavePolicies.controls`: Iterate over all policy form groups

## Usage in Component

```typescript
// Add new leave policy
handleClick() {
  this.addLeavePolicy();
}

// Remove leave policy at index 0
handleRemove() {
  this.removeLeavePolicy(0);
}

// Access all policies data
const policies = this.Form.get('leave_policies').value;
```

## Integration with Backend

The leave policies are saved as part of the company settings data:
- When saving: All leave policies in the FormArray are included in the form value
- When loading: Existing policies are automatically loaded and populated into the FormArray
- The service handles persistence to the database through `CompanySettingService`

## Styling

The leave policy cards are styled with:
- **Border**: 4px left border in blue (#2563EB) to distinguish policy blocks
- **Background**: Light gray background (#F3F4F6) for visual separation
- **Responsive Layout**: 2 columns on desktop, 1 column on mobile
- **Animations**: Smooth slideIn animation for error messages

## Future Enhancements

Potential improvements:
1. Template for common leave policies
2. Bulk import/export of policies
3. Historical tracking of policy changes
4. Per-department policy variations
5. Carryover balance settings
6. Leave year configuration

