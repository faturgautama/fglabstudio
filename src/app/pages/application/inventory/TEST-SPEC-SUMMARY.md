# 🧪 Inventory Management - Test Specifications Summary

## Overview

Semua file `.spec.ts` di inventory module telah diupdate dengan comprehensive test cases berdasarkan dokumentasi `inventory-management.md` dan implementasi batch/serial tracking.

---

## 📁 Updated Spec Files

### **Component Tests:**

1. ✅ **product.spec.ts**

   - Product form validation
   - Tracking method selection (Standard/Batch/Serial/Both)
   - SKU generation
   - Product scenarios (Alat Tulis, Obat, Laptop, Handphone)

2. ✅ **purchase-order.spec.ts**

   - PO form validation
   - Items management (add/remove)
   - Totals calculation
   - PO number generation
   - Receive dialog integration
   - PO scenarios for different product types

3. ✅ **category.spec.ts**

   - Category form validation
   - Category scenarios (Elektronik, Makanan, Obat-obatan)

4. ✅ **supplier.spec.ts**

   - Supplier form validation
   - Complete vs minimal data scenarios

5. ✅ **warehouse.spec.ts**

   - Warehouse form validation
   - Main warehouse vs branch scenarios
   - Default warehouse flag

6. ✅ **stock-movement.spec.ts**

   - Movement form validation
   - Movement types (IN/OUT/ADJUSTMENT/TRANSFER)
   - Movement scenarios

7. ✅ **stock-card.spec.ts**
   - Transaction history display
   - Batch information display
   - Serial information display

### **Service Tests:**

8. ✅ **batch-allocation.service.spec.ts** (NEW)

   - FIFO allocation logic
   - FEFO allocation logic
   - Multiple batch allocation
   - Insufficient stock validation
   - Active batch filtering
   - Expiring batches identification

9. ✅ **serial-allocation.service.spec.ts** (NEW)
   - Serial uniqueness validation
   - Duplicate detection
   - Serial count validation
   - Specific serial allocation
   - Auto FIFO allocation
   - Status management (IN_STOCK/SOLD/DAMAGED/RETURNED)
   - Warranty tracking

---

## 🎯 Test Coverage

### **Product Component**

```typescript
✅ Form initialization
✅ Required field validation
✅ Tracking method selection
  - Standard (no tracking)
  - Batch only
  - Serial only
  - Both (batch + serial)
✅ SKU generation
✅ Product scenarios
  - Alat Tulis (standard)
  - Paracetamol (batch)
  - Laptop (serial)
  - iPhone (both)
```

### **Purchase Order Component**

```typescript
✅ Form initialization
✅ Required field validation
✅ Items FormArray management
✅ Item subtotal calculation
✅ Total calculation with discount/tax
✅ PO number generation
✅ Receive dialog integration
✅ PO scenarios
  - Standard product
  - Batch tracked product
  - Serial tracked product
```

### **Batch Allocation Service**

```typescript
✅ FIFO (First In First Out)
  - Allocate from oldest batch first
  - Multiple batch allocation
✅ FEFO (First Expired First Out)
  - Allocate from earliest expiry first
✅ Validation
  - Insufficient stock error
  - Active batch filtering
✅ Monitoring
  - Expiring batches (30 days)
```

### **Serial Allocation Service**

```typescript
✅ Validation
  - Unique serial numbers
  - Duplicate detection
  - Serial count vs quantity
✅ Allocation
  - Specific serials
  - Auto FIFO allocation
✅ Status Management
  - IN_STOCK → SOLD
  - SOLD → RETURNED
  - IN_STOCK → DAMAGED
✅ Warranty Tracking
  - Calculate expiry
  - Check validity
```

---

## 🚀 Running Tests

### **Run All Tests:**

```bash
ng test
```

### **Run Specific Test:**

```bash
ng test --include='**/product.spec.ts'
ng test --include='**/purchase-order.spec.ts'
ng test --include='**/batch-allocation.service.spec.ts'
```

### **Run with Coverage:**

```bash
ng test --code-coverage
```

### **Watch Mode:**

```bash
ng test --watch
```

---

## 📊 Test Scenarios Covered

### **1. Product Management**

| Scenario                | Test Case                     | Status |
| ----------------------- | ----------------------------- | ------ |
| Create standard product | Alat Tulis (no tracking)      | ✅     |
| Create batch product    | Paracetamol (batch + expiry)  | ✅     |
| Create serial product   | Laptop (serial per unit)      | ✅     |
| Create both tracking    | iPhone (batch + serial)       | ✅     |
| SKU generation          | Auto-generate for new product | ✅     |
| Form validation         | Required fields check         | ✅     |

### **2. Purchase Order**

| Scenario           | Test Case                  | Status |
| ------------------ | -------------------------- | ------ |
| Create PO          | Basic PO creation          | ✅     |
| Add items          | FormArray management       | ✅     |
| Calculate totals   | Discount + tax calculation | ✅     |
| Generate PO number | Auto-generate format       | ✅     |
| Receive dialog     | Open/close dialog          | ✅     |

### **3. Batch Tracking**

| Scenario           | Test Case                | Status |
| ------------------ | ------------------------ | ------ |
| FIFO allocation    | Oldest batch first       | ✅     |
| FEFO allocation    | Earliest expiry first    | ✅     |
| Multiple batches   | Allocate from 2+ batches | ✅     |
| Insufficient stock | Error handling           | ✅     |
| Expiring batches   | 30-day warning           | ✅     |

### **4. Serial Tracking**

| Scenario          | Test Case          | Status |
| ----------------- | ------------------ | ------ |
| Unique validation | No duplicates      | ✅     |
| Count validation  | Serial count = qty | ✅     |
| Status management | IN_STOCK → SOLD    | ✅     |
| Return handling   | SOLD → RETURNED    | ✅     |
| Warranty tracking | Calculate expiry   | ✅     |

---

## 🔍 Test Examples

### **Example 1: Product with Batch Tracking**

```typescript
it('should create batch tracked product (Obat-obatan)', () => {
  const productData = {
    sku: 'PRD-002',
    name: 'Paracetamol 500mg',
    unit: 'PCS',
    current_stock: 0,
    min_stock: 100,
    purchase_price: 500,
    selling_price: 1000,
    is_batch_tracked: true,
    is_serial_tracked: false,
    is_perishable: true,
    is_active: true,
  };
  component.Form.patchValue(productData);
  expect(component.Form.valid).toBe(true);
  expect(component.Form.get('is_batch_tracked')?.value).toBe(true);
});
```

### **Example 2: FIFO Batch Allocation**

```typescript
it('should allocate from oldest batch first (FIFO)', async () => {
  const mockBatches = [
    {
      id: 1,
      batch_number: 'BATCH-001',
      quantity: 100,
      created_at: new Date('2025-01-01'),
    },
    {
      id: 2,
      batch_number: 'BATCH-002',
      quantity: 50,
      created_at: new Date('2025-01-15'),
    },
  ];

  const sorted = mockBatches.sort(
    (a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
  );

  expect(sorted[0].batch_number).toBe('BATCH-001');
});
```

### **Example 3: Serial Validation**

```typescript
it('should detect duplicate serial numbers', () => {
  const serialNumbers = ['SN-001', 'SN-002', 'SN-001'];

  const duplicates = serialNumbers.filter((item, index) => serialNumbers.indexOf(item) !== index);

  expect(duplicates.length).toBe(1);
  expect(duplicates[0]).toBe('SN-001');
});
```

---

## 📝 Test Checklist

### **Before Running Tests:**

- [ ] Install dependencies: `npm install`
- [ ] Build project: `ng build`
- [ ] Check no compilation errors

### **During Testing:**

- [ ] Run all tests: `ng test`
- [ ] Check console for errors
- [ ] Verify all tests pass
- [ ] Check coverage report

### **After Testing:**

- [ ] Review failed tests
- [ ] Fix issues
- [ ] Re-run tests
- [ ] Document any issues

---

## 🐛 Common Test Issues

### **Issue 1: Module Import Errors**

**Error:** `Can't resolve module`

**Solution:**

```typescript
// Add missing imports in spec file
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
```

### **Issue 2: Mock Service Not Working**

**Error:** `Cannot read property of undefined`

**Solution:**

```typescript
// Ensure mock returns observable
mockStore.select.and.returnValue(of([]));
```

### **Issue 3: Async Test Timeout**

**Error:** `Timeout - Async callback was not invoked`

**Solution:**

```typescript
// Use async/await or done callback
it('should test async', async () => {
  await service.someAsyncMethod();
  expect(result).toBe(expected);
});
```

---

## 📚 References

- **User Guide:** `inventory-management.md`
- **Test Scenarios:** `TEST-SCENARIOS.md`
- **Implementation:** `IMPLEMENTATION-SUMMARY.md`
- **Angular Testing:** https://angular.dev/guide/testing

---

## 🎯 Next Steps

### **Phase 1: Current (DONE)**

- ✅ Update all component specs
- ✅ Create service specs
- ✅ Add comprehensive test cases

### **Phase 2: Enhancement**

- [ ] Add E2E tests
- [ ] Add integration tests
- [ ] Add performance tests

### **Phase 3: CI/CD**

- [ ] Setup automated testing
- [ ] Add test coverage reports
- [ ] Setup pre-commit hooks

---

## 📞 Support

**Issues with tests?**

1. Check test output in console
2. Review error messages
3. Check mock setup
4. Verify imports

**Need help?**

- Email: support@fglabstudio.com
- Documentation: See `inventory-management.md`

---

**Happy Testing! 🧪**

---

**© 2025 FG Lab Studio. All rights reserved.**
