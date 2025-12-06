# Design Document - Stock Movement Tracking Enhancement

## Overview

Enhancement ini menambahkan full batch dan serial tracking support pada Stock Movement system. Saat ini, infrastruktur dasar sudah ada (loading batches/serials untuk OUT/TRANSFER), namun belum ada validasi, update ke batch/serial tables, atau handling lengkap untuk semua movement types.

Tujuan enhancement:

1. **Consistency** - Stock Movement tracking sama dengan Purchase Order system
2. **Data Integrity** - Batch/serial tables selalu sync dengan stock movements
3. **Audit Trail** - Complete tracking dari batch/serial lifecycle
4. **User Experience** - Clear UI untuk input dan selection batch/serial

## Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Stock Movement UI                         │
│  - Product selection (with tracking type detection)         │
│  - Batch/Serial input (conditional based on tracking type)  │
│  - Validation (format, availability, quantity match)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              StockMovementService                            │
│  - createStockMovement() - Enhanced with tracking           │
│  - validateBatchAvailability()                              │
│  - validateSerialAvailability()                             │
│  - updateBatchQuantity()                                    │
│  - updateSerialStatus()                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────────┐
│ StockCard    │ │ ProductWH    │ │ Batch/Serial     │
│ Service      │ │ Stock Service│ │ Tables           │
│              │ │              │ │                  │
│ - Add card   │ │ - Update qty │ │ - Update qty     │
│ - Reference  │ │ - By type    │ │ - Update status  │
│   batch/     │ │              │ │ - Create new     │
│   serial     │ │              │ │                  │
└──────────────┘ └──────────────┘ └──────────────────┘
```

### Component Interactions

**IN Movement Flow:**

1. User selects product → Detect tracking type
2. If batch-tracked → Show batch number + expiry date inputs
3. If serial-tracked → Show serial numbers input (array)
4. On save → Create/update batch/serial records
5. Update product_warehouse_stock by tracking type
6. Create stock card with batch/serial reference

**OUT Movement Flow:**

1. User selects product + warehouse → Load available batches/serials
2. If batch-tracked → Show dropdown of available batches
3. If serial-tracked → Show multiselect of available serials
4. Validate availability and quantity
5. On save → Decrement batch quantity or update serial status
6. Update product_warehouse_stock by tracking type
7. Create stock card with batch/serial reference

**TRANSFER Movement Flow:**

1. User selects product + source warehouse → Load available batches/serials
2. Select batch/serials to transfer
3. On save → Decrement from source, increment/create at destination
4. Update product_warehouse_stock at both warehouses
5. Create 2 stock cards (OUT + IN) with batch/serial reference

**ADJUSTMENT Movement Flow:**

1. User selects product + warehouse → Load available batches/serials
2. If positive → Input new batch/serial or select existing
3. If negative → Select batch/serial to adjust
4. On save → Update batch/serial quantity or status
5. Update product_warehouse_stock by tracking type
6. Create stock card with ADJUSTMENT type

## Components and Interfaces

### Enhanced StockMovementService

```typescript
interface IStockMovementService {
  // Existing
  createStockMovement(movement: StockMovementInput): Observable<number>;
  generateMovementNumber(type: string): Observable<string>;
  adjustStock(product_id, warehouse_id, new_quantity, reason, notes?): Observable<number>;

  // New methods for tracking
  validateBatchAvailability(
    product_id: number,
    warehouse_id: number,
    batch_number: string,
    required_qty: number
  ): Promise<boolean>;
  validateSerialAvailability(
    product_id: number,
    warehouse_id: number,
    serial_numbers: string[]
  ): Promise<boolean>;
  updateBatchQuantity(
    batch_id: number,
    quantity_change: number,
    operation: 'ADD' | 'SUBTRACT'
  ): Promise<void>;
  updateSerialStatus(serial_ids: number[], new_status: SerialStatus): Promise<void>;
  transferBatch(
    batch_id: number,
    from_warehouse: number,
    to_warehouse: number,
    quantity: number
  ): Promise<void>;
  transferSerials(
    serial_ids: number[],
    from_warehouse: number,
    to_warehouse: number
  ): Promise<void>;
  createBatchRecord(
    product_id: number,
    warehouse_id: number,
    batch_number: string,
    expiry_date: Date,
    quantity: number,
    po_id?: number
  ): Promise<number>;
  createSerialRecords(
    product_id: number,
    warehouse_id: number,
    serial_numbers: string[],
    batch_number?: string,
    po_id?: number
  ): Promise<number[]>;
}
```

### Enhanced StockMovement Component

```typescript
interface IStockMovementComponent {
  // Existing
  Form: FormGroup;
  _products: Product[];
  _warehouses: Warehouse[];
  _availableBatches: ProductBatch[];
  _availableSerials: ProductSerial[];
  _selectedProduct: Product | null;

  // Enhanced methods
  onProductChange(): Promise<void>; // Detect tracking type
  onWarehouseChange(): Promise<void>; // Load batches/serials
  loadBatchesAndSerials(): Promise<void>; // Enhanced with all types
  validateBatchInput(): boolean; // Validate batch format & expiry
  validateSerialInput(): boolean; // Validate serial format & count
  handleSave(): void; // Enhanced with tracking validation

  // New methods
  showBatchInput(): boolean; // Show batch fields based on tracking type
  showSerialInput(): boolean; // Show serial fields based on tracking type
  getBatchLabel(): string; // Dynamic label based on movement type
  getSerialLabel(): string; // Dynamic label based on movement type
}
```

### Data Flow for Each Movement Type

**IN Movement with Batch:**

```
User Input → Validate batch format → Check expiry date →
Create/Update batch record → Update batch_quantity →
Create stock card → Success
```

**IN Movement with Serial:**

```
User Input → Validate serial format → Check uniqueness →
Create serial records → Update serial_quantity →
Create stock card → Success
```

**OUT Movement with Batch:**

```
Load available batches → User selects batch → Validate quantity →
Decrement batch quantity → Update batch_quantity →
Deactivate if zero → Create stock card → Success
```

**OUT Movement with Serial:**

```
Load available serials → User selects serials → Validate status →
Update serial status to SOLD → Update serial_quantity →
Create stock card → Success
```

**TRANSFER with Batch:**

```
Load source batches → User selects batch → Validate quantity →
Decrement source batch → Create/Update dest batch →
Update both warehouses → Create 2 stock cards → Success
```

**TRANSFER with Serial:**

```
Load source serials → User selects serials → Validate status →
Update serial warehouse_id → Update both warehouses →
Create 2 stock cards → Success
```

## Data Models

### Enhanced StockMovement Model

```typescript
interface StockMovement {
  id: number;
  movement_number: string;
  type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  product_id: number;
  warehouse_id: number;
  warehouse_from?: number; // For TRANSFER
  warehouse_to?: number; // For TRANSFER
  quantity: number;
  unit_cost?: number;
  total_value?: number;
  reason: string;
  reason_detail?: string;

  // Enhanced tracking fields
  batch_number?: string; // For batch-tracked products
  batch_id?: number; // Reference to product_batches
  serial_numbers?: string[]; // For serial-tracked products
  serial_ids?: number[]; // References to product_serials

  reference_type?: string;
  reference_id?: number;
  approved_by?: string;
  notes?: string;
  movement_date: Date;
  is_active: boolean;
  created_at: Date;
}
```

### ProductBatch Model (Existing)

```typescript
interface ProductBatch {
  id: number;
  product_id: string;
  warehouse_id: number;
  batch_number: string;
  expiry_date?: Date;
  quantity: number;
  purchase_order_id?: string;
  stock_movement_id?: number; // NEW: Reference to movement
  cost_per_unit?: number;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
}
```

### ProductSerial Model (Existing)

```typescript
interface ProductSerial {
  id: number;
  product_id: number;
  warehouse_id: number;
  serial_number: string;
  batch_number?: string;
  status: 'IN_STOCK' | 'SOLD' | 'RETURNED' | 'DAMAGED' | 'LOST';
  purchase_order_id?: string;
  stock_movement_id?: number; // NEW: Reference to movement
  notes?: string;
  created_at: Date;
  updated_at?: Date;
}
```

### StockCard Enhancement

```typescript
interface StockCard {
  id: number;
  product_id: number;
  warehouse_id: number;
  transaction_date: Date;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  reference_type: string;
  reference_id: number;
  qty_in: number;
  qty_out: number;
  balance: number;
  unit_cost?: number;
  total_value?: number;

  // Enhanced tracking reference
  batch_number?: string; // NEW: Batch reference
  serial_numbers?: string; // NEW: Comma-separated serials

  notes?: string;
  created_at: Date;
}
```

### Database Indexes

**Existing:**

- `product_batches`: `[product_id+warehouse_id]`, `batch_number`
- `product_serials`: `[product_id+warehouse_id]`, `serial_number`
- `stock_cards`: `[product_id+warehouse_id]`

**New indexes needed:**

- `product_batches`: `stock_movement_id` (for reverse lookup)
- `product_serials`: `stock_movement_id` (for reverse lookup)
- `stock_movements`: `batch_number` (for filtering)

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property Reflection

After analyzing all 84 acceptance criteria, I identified several areas of redundancy:

**Redundant Properties:**

1. Criteria 2.6, 4.6, 6.7, 12.5 all test "quantity matches serial count" - Can be combined into one property
2. Criteria 3.2, 3.7, 5.6 all test "batch quantity sufficient" - Can be combined
3. Criteria 4.2, 4.7, 6.6 all test "serial status validation" - Can be combined
4. Criteria 1.3, 2.3, 3.4, 4.4, 5.4, 6.3, 7.4, 8.5, 9.2 all test "product_warehouse_stock updates by tracking type" - Can be combined into comprehensive properties per movement type
5. Criteria 1.4, 2.4, 3.5, 4.5, 5.5, 6.4, 7.5, 8.6, 9.3 all test "stock card creation with proper reference" - Can be combined
6. Criteria 11.1-11.4 all test "display of tracking information" - Can be combined into one property about data completeness

**Properties to Keep Separate:**

- IN vs OUT vs TRANSFER vs ADJUSTMENT operations (different business logic)
- Batch vs Serial vs General tracking (different data structures)
- State transitions (batch deactivation, serial status changes)
- Error conditions (insufficient stock, invalid format, uniqueness violations)

**Final Property Count:** ~35 unique properties (down from 84 criteria)

### Correctness Properties

Property 1: Batch IN movement creates batch record
_For any_ IN movement with batch-tracked product, creating the movement should result in a product_batches record with the specified batch number, expiry date, and quantity
**Validates: Requirements 1.2**

Property 2: Batch IN movement increments batch quantity
_For any_ IN movement with batch-tracked product, the batch_quantity in product_warehouse_stock should increase by the movement quantity
**Validates: Requirements 1.3**

Property 3: Serial IN movement creates serial records
_For any_ IN movement with serial-tracked product, creating the movement should result in product_serials records for each serial number with status IN_STOCK
**Validates: Requirements 2.2**

Property 4: Serial IN movement increments serial quantity
_For any_ IN movement with serial-tracked product, the serial_quantity in product_warehouse_stock should increase by the number of serial numbers
**Validates: Requirements 2.3**

Property 5: Batch IN with existing batch increments quantity
_For any_ batch number that already exists in a warehouse, performing an IN movement with the same batch number should increment the existing batch quantity rather than create a duplicate
**Validates: Requirements 1.5**

Property 6: Serial uniqueness validation
_For any_ serial number that already exists in the system, attempting to create an IN movement with that serial number should be rejected
**Validates: Requirements 2.5**

Property 7: Quantity matches serial count
_For any_ movement with serial-tracked product, the movement quantity must equal the count of serial numbers provided
**Validates: Requirements 2.6, 4.6, 6.7, 12.5**

Property 8: Batch OUT movement decrements batch quantity
_For any_ OUT movement with batch-tracked product, the selected batch quantity should decrease by the movement quantity
**Validates: Requirements 3.3**

Property 9: Batch OUT movement decrements batch*quantity in stock
\_For any* OUT movement with batch-tracked product, the batch_quantity in product_warehouse_stock should decrease by the movement quantity
**Validates: Requirements 3.4**

Property 10: Serial OUT movement updates serial status
_For any_ OUT movement with serial-tracked product, all selected serials should have their status updated to SOLD
**Validates: Requirements 4.3**

Property 11: Serial OUT movement decrements serial*quantity in stock
\_For any* OUT movement with serial-tracked product, the serial_quantity in product_warehouse_stock should decrease by the number of serials
**Validates: Requirements 4.4**

Property 12: Batch deactivation when depleted
_For any_ batch, when an OUT, TRANSFER, or ADJUSTMENT operation reduces its quantity to zero, the batch is_active flag should be set to false
**Validates: Requirements 3.6, 5.7, 7.7**

Property 13: Batch availability validation
_For any_ OUT, TRANSFER, or ADJUSTMENT operation with batch-tracked product, the operation should be rejected if the required quantity exceeds the available batch quantity
**Validates: Requirements 3.2, 3.7, 5.6, 7.6**

Property 14: Serial status validation
_For any_ OUT or TRANSFER operation with serial-tracked product, the operation should be rejected if any selected serial has status other than IN_STOCK
**Validates: Requirements 4.2, 4.7, 6.6**

Property 15: TRANSFER batch source decrement
_For any_ TRANSFER movement with batch-tracked product, the batch quantity in the source warehouse should decrease by the transfer quantity
**Validates: Requirements 5.2**

Property 16: TRANSFER batch destination increment
_For any_ TRANSFER movement with batch-tracked product, the batch quantity in the destination warehouse should increase by the transfer quantity, creating a new batch if needed with the same batch number and expiry date
**Validates: Requirements 5.3**

Property 17: TRANSFER batch updates both warehouses
_For any_ TRANSFER movement with batch-tracked product, both source and destination warehouse batch_quantity values should be updated
**Validates: Requirements 5.4**

Property 18: TRANSFER serial warehouse update
_For any_ TRANSFER movement with serial-tracked product, all selected serials should have their warehouse_id updated to the destination warehouse
**Validates: Requirements 6.2**

Property 19: TRANSFER serial updates both warehouses
_For any_ TRANSFER movement with serial-tracked product, serial_quantity should decrease in source warehouse and increase in destination warehouse
**Validates: Requirements 6.3**

Property 20: TRANSFER serial maintains IN*STOCK status
\_For any* TRANSFER movement with serial-tracked product, all transferred serials should maintain their IN_STOCK status
**Validates: Requirements 6.5**

Property 21: TRANSFER creates two stock cards
_For any_ TRANSFER movement, exactly two stock cards should be created: one OUT from source warehouse and one IN to destination warehouse, both referencing the same movement
**Validates: Requirements 5.5, 6.4**

Property 22: Positive ADJUSTMENT increments batch quantity
_For any_ positive ADJUSTMENT movement with batch-tracked product, the selected batch quantity should increase by the adjustment amount
**Validates: Requirements 7.2**

Property 23: Negative ADJUSTMENT decrements batch quantity
_For any_ negative ADJUSTMENT movement with batch-tracked product, the selected batch quantity should decrease by the adjustment amount
**Validates: Requirements 7.3**

Property 24: Positive ADJUSTMENT creates serial records
_For any_ positive ADJUSTMENT movement with serial-tracked product, new product_serials records should be created with status IN_STOCK
**Validates: Requirements 8.3**

Property 25: Negative ADJUSTMENT updates serial status
_For any_ negative ADJUSTMENT movement with serial-tracked product, selected serials should have their status updated to DAMAGED or LOST based on the reason
**Validates: Requirements 8.4**

Property 26: General tracking updates general*quantity only
\_For any* movement with general-tracked product (no batch or serial), only the general_quantity in product_warehouse_stock should be updated
**Validates: Requirements 9.2**

Property 27: General stock availability validation
_For any_ OUT or TRANSFER operation with general-tracked product, the operation should be rejected if the required quantity exceeds the available total_stock
**Validates: Requirements 9.4, 9.7**

Property 28: Stock card creation with tracking reference
_For any_ movement with batch or serial tracking, the created stock card should include the batch_number or serial_numbers in its reference fields
**Validates: Requirements 1.4, 2.4, 3.5, 4.5, 7.5, 8.6**

Property 29: Stock card creation without tracking reference
_For any_ movement with general tracking, the created stock card should not include batch or serial references
**Validates: Requirements 9.3**

Property 30: Total stock invariant
_For any_ product in any warehouse, after any movement operation, the equation total_stock = batch_quantity + serial_quantity + general_quantity must hold
**Validates: Requirements 10.3**

Property 31: Atomic transaction updates
_For any_ movement operation, if any table update fails (stock_cards, product_warehouse_stock, product_batches, or product_serials), all changes should be rolled back
**Validates: Requirements 10.1, 10.2**

Property 32: Tracking type validation
_For any_ movement operation, if batch or serial data is provided, the product must have the corresponding tracking type enabled (is_batch_tracked or is_serial_tracked)
**Validates: Requirements 10.4**

Property 33: Movement reversal restores state
_For any_ movement that is cancelled or deleted, reversing the operation should restore stock quantities, batch quantities, and serial statuses to their pre-movement state
**Validates: Requirements 10.5**

Property 34: Low stock notification trigger
_For any_ OUT or ADJUSTMENT movement that causes total_stock to fall below the product's reorder_point, a low stock notification should be triggered
**Validates: Requirements 10.7**

Property 35: Perishable product requires expiry date
_For any_ IN movement with batch-tracked perishable product, an expiry date must be provided
**Validates: Requirements 1.6**

## Error Handling

### Validation Errors

**Pre-Operation Validation:**

1. **Tracking Type Mismatch** - Reject if batch/serial data provided for wrong tracking type
2. **Insufficient Stock** - Reject OUT/TRANSFER if available quantity < required quantity
3. **Invalid Serial Status** - Reject if serial not IN_STOCK for OUT/TRANSFER
4. **Duplicate Serial** - Reject if serial number already exists for IN
5. **Quantity Mismatch** - Reject if serial count ≠ quantity
6. **Missing Required Fields** - Reject if batch number missing for batch-tracked IN
7. **Invalid Expiry Date** - Reject if expiry date is in the past
8. **Negative Quantity** - Reject if quantity ≤ 0

**Error Messages:**

- Clear indication of what failed
- Actionable guidance (e.g., "Available batch quantity: 50, Required: 100")
- Reference to specific batch/serial that caused the error

### Transaction Rollback

**Rollback Scenarios:**

1. Database constraint violation
2. Concurrent modification conflict
3. Batch/serial table update failure
4. Stock card creation failure
5. Notification service failure (non-critical, log only)

**Rollback Strategy:**

- Use Dexie transaction API
- Wrap all table updates in single transaction
- On error, throw exception to trigger automatic rollback
- Log error details for debugging

## Performance Considerations

### Query Optimization

**Batch/Serial Loading:**

- Use compound indexes `[product_id+warehouse_id]` for efficient filtering
- Limit results to active batches and IN_STOCK serials only
- Cache available batches/serials during form session

**Bulk Operations:**

- Use `bulkAdd()` for creating multiple serial records
- Use `bulkUpdate()` for updating multiple serials in TRANSFER
- Batch stock card creation when possible

### Database Indexes

**Required Indexes:**

```typescript
// Existing
product_batches: '[product_id+warehouse_id], batch_number, is_active';
product_serials: '[product_id+warehouse_id], serial_number, status';

// New
stock_movements: 'batch_number, [batch_id], [serial_ids]';
```

### Caching Strategy

**Cache During Form Session:**

- Available batches for selected product+warehouse
- Available serials for selected product+warehouse
- Product tracking type information

**Invalidate Cache:**

- On warehouse change
- On product change
- After successful movement save

## Migration Strategy

### Database Schema Changes

**Add Fields to stock_movements:**

```sql
ALTER TABLE stock_movements ADD COLUMN batch_id INTEGER;
ALTER TABLE stock_movements ADD COLUMN serial_ids TEXT; -- JSON array
```

**Add Fields to product_batches:**

```sql
ALTER TABLE product_batches ADD COLUMN stock_movement_id INTEGER;
ALTER TABLE product_batches ADD COLUMN updated_at DATETIME;
```

**Add Fields to product_serials:**

```sql
ALTER TABLE product_serials ADD COLUMN stock_movement_id INTEGER;
ALTER TABLE product_serials ADD COLUMN updated_at DATETIME;
```

**Add Indexes:**

```sql
CREATE INDEX idx_stock_movements_batch ON stock_movements(batch_number);
CREATE INDEX idx_product_batches_movement ON product_batches(stock_movement_id);
CREATE INDEX idx_product_serials_movement ON product_serials(stock_movement_id);
```

### Data Migration

**Existing Movements:**

- No retroactive batch/serial assignment needed
- New movements will have full tracking
- Historical movements remain as-is

**Version Upgrade:**

- Increment database version from 3 to 4
- Run migration in `app.database.ts`
- Test migration with sample data

### Backward Compatibility

**Existing Code:**

- Current movement creation still works (no batch/serial)
- New fields are optional
- Gradual rollout possible

**UI Updates:**

- Show/hide tracking fields based on product
- Graceful degradation if tracking data missing
- Clear indicators when tracking is active

## Security Considerations

### Input Validation

**Batch Number:**

- Sanitize input to prevent injection
- Validate format (alphanumeric + hyphens only)
- Max length: 50 characters

**Serial Number:**

- Sanitize input to prevent injection
- Validate format per product requirements
- Max length: 50 characters
- Uniqueness check before insert

**Quantity:**

- Must be positive integer
- Max value: 999,999
- Prevent decimal inputs for serial-tracked products

### Authorization

**Movement Operations:**

- Require authenticated user
- Log user_id with each movement
- Audit trail for all changes

**Batch/Serial Access:**

- Read-only for non-warehouse staff
- Write access for warehouse staff only
- Admin can view all, modify all

## Deployment Plan

### Phase 1: Backend Enhancement (Week 1)

- Add new fields to models
- Implement batch/serial validation methods
- Enhance createStockMovement() with tracking logic
- Write unit tests for new methods

### Phase 2: UI Enhancement (Week 2)

- Add batch/serial input fields to form
- Implement conditional field display
- Add batch/serial selection dropdowns
- Wire up validation messages

### Phase 3: Testing (Week 3)

- Write property-based tests
- Run integration tests
- Performance testing with large datasets
- User acceptance testing

### Phase 4: Deployment (Week 4)

- Database migration
- Deploy to staging
- Smoke testing
- Deploy to production
- Monitor for issues

## Success Metrics

### Functional Metrics

- ✅ All 35 correctness properties pass
- ✅ All 84 acceptance criteria met
- ✅ Zero data integrity issues
- ✅ 100% batch/serial traceability

### Performance Metrics

- ⏱️ Movement creation < 500ms (with tracking)
- ⏱️ Batch/serial loading < 200ms
- ⏱️ TRANSFER operation < 1s (both warehouses)
- 📊 Database size increase < 20%

### Quality Metrics

- 🧪 80%+ code coverage
- 🐛 Zero critical bugs in production
- 📝 Complete audit trail for all movements
- ✨ User satisfaction > 4.5/5

---

**Design document complete. Ready for implementation planning.**
