# Design Document - Stock Opname Tracking Enhancement

## Overview

Enhancement ini menambahkan full batch dan serial tracking support pada Stock Opname system. Saat ini, stock opname hanya mendukung physical count berdasarkan total quantity per product tanpa mempertimbangkan batch atau serial. Enhancement ini akan memungkinkan:

1. **Batch-level Counting** - Physical count per batch dengan expiry date visibility
2. **Serial-level Verification** - Mark individual serials as found/not found
3. **Accurate Adjustments** - Create adjustments per batch/serial, bukan hanya total
4. **Better Audit Trail** - Track which specific batches/serials had discrepancies

Tujuan enhancement:

1. **Accuracy** - Physical count yang lebih akurat dengan granularity batch/serial
2. **Traceability** - Identify exactly which batch/serial has discrepancy
3. **Compliance** - Meet regulatory requirements untuk batch/serial tracking
4. **Efficiency** - Streamline counting process dengan UI yang intuitif

## Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│              Stock Opname Creation                           │
│  - Select warehouse                                          │
│  - Load products with current stock                          │
│  - For batch-tracked: Load all batches                      │
│  - For serial-tracked: Load all IN_STOCK serials            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Physical Counting                               │
│  - Batch: Input physical quantity per batch                 │
│  - Serial: Mark serials as found/not found                  │
│  - General: Input total physical quantity                   │
│  - Auto-calculate differences                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Approval & Adjustment                           │
│  - Validate all items counted                               │
│  - Create ADJUSTMENT stock cards per batch/serial           │
│  - Update batch quantities / serial statuses                │
│  - Update product_warehouse_stock by tracking type          │
│  - Verify total_stock invariant                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Interactions

**Opname Creation Flow:**

1. User selects warehouse → Load products
2. For each product → Detect tracking type
3. If batch-tracked → Load batches from product_batches
4. If serial-tracked → Load serials from product_serials
5. Create opname items with system stock baseline

**Physical Counting Flow:**

1. User inputs physical count per batch/serial
2. System calculates difference automatically
3. System validates input (reasonable ranges)
4. System updates total discrepancy

**Approval Flow:**

1. Validate all items have physical count
2. For each item with difference:
   - Batch: Update batch quantity, create stock card
   - Serial: Update serial status, create stock card
   - General: Update general_quantity, create stock card
3. Update product_warehouse_stock by tracking type
4. Verify total_stock invariant
5. Set opname status = APPROVED

## Components and Interfaces

### Enhanced StockOpnameService

```typescript
interface IStockOpnameService {
  // Existing
  createStockOpname(opname, items): Observable<number>;
  getStockOpnameWithItems(opname_id): Observable<OpnameWithItems>;
  updateOpnameItem(item_id, physical_stock, notes?): Observable<string>;
  approveStockOpname(opname_id, approved_by): Observable<number>;
  generateOpnameNumber(): Observable<string>;

  // New methods for tracking
  loadBatchesForOpname(product_id: number, warehouse_id: number): Promise<OpnameBatchItem[]>;
  loadSerialsForOpname(product_id: number, warehouse_id: number): Promise<OpnameSerialItem[]>;
  updateBatchPhysicalCount(
    opname_item_id: number,
    batch_id: number,
    physical_qty: number
  ): Promise<void>;
  markSerialAsFound(opname_item_id: number, serial_id: number, found: boolean): Promise<void>;
  approveBatchOpnameItem(opname_item_id: number): Promise<void>;
  approveSerialOpnameItem(opname_item_id: number): Promise<void>;
  approveGeneralOpnameItem(opname_item_id: number): Promise<void>;
  validateOpnameReadyForApproval(opname_id: number): Promise<ValidationResult>;
  recalculateSystemStock(product_id: number, warehouse_id: number): Promise<void>;
}
```

### Enhanced StockOpname Component

```typescript
interface IStockOpnameComponent {
  // Existing
  Form: FormGroup;
  items: FormArray;
  _products: Product[];
  _warehouses: Warehouse[];

  // New properties
  _batchItems: Map<number, OpnameBatchItem[]>; // opname_item_id -> batches
  _serialItems: Map<number, OpnameSerialItem[]>; // opname_item_id -> serials
  _trackingTypes: Map<number, TrackingType>; // product_id -> tracking type

  // Enhanced methods
  loadProductsForOpname(): void; // Enhanced with batch/serial loading
  addItem(): void; // Enhanced to load batches/serials
  calculateItemDifference(index): void; // Enhanced for batch/serial

  // New methods
  showBatchDetails(item_index: number): boolean;
  showSerialDetails(item_index: number): boolean;
  updateBatchPhysicalCount(item_index: number, batch_index: number, qty: number): void;
  toggleSerialFound(item_index: number, serial_index: number): void;
  getBatchDiscrepancy(item_index: number): number;
  getSerialDiscrepancy(item_index: number): number;
  validateBeforeApproval(): boolean;
}
```

### Data Flow for Each Tracking Type

**Batch Opname Flow:**

```
Load batches → Display batch list with system qty →
User inputs physical qty per batch → Calculate difference per batch →
On approve → Update batch quantities → Create stock cards per batch →
Update batch_quantity in product_warehouse_stock
```

**Serial Opname Flow:**

```
Load serials (IN_STOCK) → Display serial list with checkboxes →
User marks found/not found → Calculate found count & missing count →
On approve → Update status of missing serials to LOST →
Create stock card with missing serials →
Update serial_quantity in product_warehouse_stock
```

**General Opname Flow:**

```
Display product with system stock → User inputs total physical qty →
Calculate difference → On approve → Create stock card with difference →
Update general_quantity in product_warehouse_stock
```

## Data Models

### Enhanced StockOpname Model

```typescript
interface StockOpname {
  id: number;
  opname_number: string;
  warehouse_id: number;
  opname_date: Date;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED';
  total_products: number;
  total_discrepancy: number;

  // Enhanced tracking fields
  batch_discrepancy: number; // NEW: Total batch discrepancy
  serial_discrepancy: number; // NEW: Total serial discrepancy
  general_discrepancy: number; // NEW: Total general discrepancy

  approved_by?: string;
  approved_at?: Date;
  notes?: string;
  is_active: boolean;
  created_at: Date;
}
```

### Enhanced StockOpnameItem Model

```typescript
interface StockOpnameItem {
  id: number;
  stock_opname_id: number;
  product_id: number;

  // For general tracking
  system_stock: number;
  physical_stock: number;
  difference: number;

  // Enhanced tracking fields
  tracking_type: 'BATCH' | 'SERIAL' | 'GENERAL'; // NEW
  batch_items?: OpnameBatchItem[]; // NEW: For batch tracking
  serial_items?: OpnameSerialItem[]; // NEW: For serial tracking

  notes?: string;
}
```

### New OpnameBatchItem Model

```typescript
interface OpnameBatchItem {
  id: number;
  opname_item_id: number;
  batch_id: number;
  batch_number: string;
  expiry_date?: Date;
  system_quantity: number;
  physical_quantity: number;
  difference: number;
  is_expired: boolean; // Calculated field
  days_to_expiry?: number; // Calculated field
  notes?: string;
}
```

### New OpnameSerialItem Model

```typescript
interface OpnameSerialItem {
  id: number;
  opname_item_id: number;
  serial_id: number;
  serial_number: string;
  expected_status: 'IN_STOCK'; // Always IN_STOCK for opname
  found: boolean; // User marks as found/not found
  notes?: string;
}
```

### Database Schema Changes

**New Tables:**

```typescript
// stock_opname_batch_items
{
  id: number (PK),
  opname_item_id: number (FK),
  batch_id: number (FK),
  batch_number: string,
  expiry_date: Date,
  system_quantity: number,
  physical_quantity: number,
  difference: number,
  notes: string,
  created_at: Date
}

// stock_opname_serial_items
{
  id: number (PK),
  opname_item_id: number (FK),
  serial_id: number (FK),
  serial_number: string,
  found: boolean,
  notes: string,
  created_at: Date
}
```

**Enhanced Existing Tables:**

```typescript
// stock_opnames - Add fields
{
  ...existing fields,
  batch_discrepancy: number,
  serial_discrepancy: number,
  general_discrepancy: number
}

// stock_opname_items - Add field
{
  ...existing fields,
  tracking_type: 'BATCH' | 'SERIAL' | 'GENERAL'
}
```

### Database Indexes

**New indexes:**

- `stock_opname_batch_items`: `opname_item_id`, `batch_id`, `batch_number`
- `stock_opname_serial_items`: `opname_item_id`, `serial_id`, `serial_number`, `found`

**Enhanced indexes:**

- `stock_opname_items`: Add `tracking_type` to existing indexes

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property Reflection

After analyzing all 84 acceptance criteria, I identified several areas of redundancy:

**Redundant Properties:**

1. Criteria 1.5, 6.1 both test "create ADJUSTMENT per batch" - Can be combined
2. Criteria 2.5, 6.2 both test "update serial status for missing" - Can be combined
3. Criteria 3.5, 6.3 both test "create ADJUSTMENT for general" - Can be combined
4. Criteria 6.6, 9.5 both test "total_stock invariant" - Can be combined
5. Criteria 6.7, 9.4 both test "rollback on error" - Can be combined
6. Criteria 4.1-4.3 all test "display tracking information" - Can be combined into data completeness property
7. Criteria 5.4, 5.5 both test "stock validation" - Can be combined into one invariant property

**Properties to Keep Separate:**

- Batch vs Serial vs General tracking (different data structures and logic)
- Creation vs Approval operations (different phases)
- State transitions (status changes, batch deactivation, serial status updates)
- Validation rules (warehouse consistency, tracking type matching)

**Final Property Count:** ~30 unique properties (down from 84 criteria)

### Correctness Properties

Property 1: Batch loading for opname
_For any_ stock opname created for batch-tracked product, all active batches in the specified warehouse should be loaded as opname batch items
**Validates: Requirements 1.1, 5.1**

Property 2: Batch difference calculation
_For any_ opname batch item, the difference should equal physical_quantity minus system_quantity
**Validates: Requirements 1.3**

Property 3: Batch reference storage
_For any_ opname batch item saved, the batch_number and batch_id should be stored in the opname_batch_items table
**Validates: Requirements 1.4**

Property 4: Batch adjustment creation on approval
_For any_ opname batch item with non-zero difference, approving the opname should create an ADJUSTMENT stock card referencing that batch
**Validates: Requirements 1.5, 6.1**

Property 5: Batch quantity update on approval
_For any_ opname batch item, approving the opname should update the batch quantity in product_batches table to match the physical_quantity
**Validates: Requirements 1.6**

Property 6: Batch deactivation when depleted
_For any_ opname batch item where physical_quantity is 0 and system_quantity > 0, approving should set the batch is_active flag to false
**Validates: Requirements 1.7**

Property 7: Serial loading for opname
_For any_ stock opname created for serial-tracked product, all serials with status IN_STOCK in the specified warehouse should be loaded as opname serial items
**Validates: Requirements 2.1, 5.2**

Property 8: Serial found/missing count calculation
_For any_ opname serial items, the count of items marked as found plus the count marked as not found should equal the total number of serial items
**Validates: Requirements 2.3**

Property 9: Serial reference storage
_For any_ opname serial item saved, the serial_number and found status should be stored in the opname_serial_items table
**Validates: Requirements 2.4**

Property 10: Serial status update on approval
_For any_ opname serial item marked as not found, approving the opname should update the serial status to LOST in product_serials table
**Validates: Requirements 2.5, 6.2**

Property 11: Serial adjustment creation on approval
_For any_ opname with missing serials, approving should create an ADJUSTMENT stock card with reference to the missing serial numbers
**Validates: Requirements 2.6**

Property 12: New serial addition
_For any_ serial number found during opname that doesn't exist in the system, it should be allowed to be added with status IN_STOCK
**Validates: Requirements 2.7**

Property 13: General tracking single row
_For any_ stock opname created for general-tracked product, exactly one opname item should be created per product
**Validates: Requirements 3.1**

Property 14: General difference calculation
_For any_ opname item for general-tracked product, the difference should equal physical_stock minus system_stock
**Validates: Requirements 3.3**

Property 15: General data storage without tracking reference
_For any_ opname item for general-tracked product, the item should store physical_stock and difference without batch_id or serial references
**Validates: Requirements 3.4**

Property 16: General adjustment creation on approval
_For any_ opname item for general-tracked product with non-zero difference, approving should create an ADJUSTMENT stock card
**Validates: Requirements 3.5, 6.3**

Property 17: General quantity update on approval
_For any_ opname item for general-tracked product, approving should update general_quantity in product_warehouse_stock to match physical_stock
**Validates: Requirements 3.6**

Property 18: No adjustment when no difference
_For any_ opname item where difference is 0, approving should not create any stock card or adjustment
**Validates: Requirements 3.7**

Property 19: Batch quantity sum validation
_For any_ product in a warehouse, when opname is created, the sum of all batch quantities should equal the batch_quantity in product_warehouse_stock
**Validates: Requirements 5.4**

Property 20: Serial count validation
_For any_ product in a warehouse, when opname is created, the count of IN_STOCK serials should equal the serial_quantity in product_warehouse_stock
**Validates: Requirements 5.5**

Property 21: Stock recalculation from source
_For any_ product in a warehouse, recalculating stock should rebuild quantities from stock_cards and batch/serial tables, resulting in consistent values
**Validates: Requirements 5.7**

Property 22: Product warehouse stock update by tracking type
_For any_ opname approval, product_warehouse_stock should be updated according to tracking type: batch_quantity for batch-tracked, serial_quantity for serial-tracked, general_quantity for general-tracked
**Validates: Requirements 6.4**

Property 23: Stock card creation with proper references
_For any_ opname approval, stock cards created should include references to the opname_id and batch_number or serial_numbers as appropriate
**Validates: Requirements 6.5**

Property 24: Total stock invariant after approval
_For any_ product in a warehouse after opname approval, the equation total_stock = batch_quantity + serial_quantity + general_quantity must hold
**Validates: Requirements 6.6, 9.5**

Property 25: Atomic transaction on approval
_For any_ opname approval, if any table update fails (stock_cards, product_warehouse_stock, product_batches, product_serials), all changes should be rolled back
**Validates: Requirements 6.7, 9.3, 9.4**

Property 26: Batch expiry calculation
_For any_ opname batch item, the is_expired flag should be true if expiry_date < current_date, and days_to_expiry should equal the difference in days
**Validates: Requirements 7.1, 7.2**

Property 27: Auto-calculation on physical count input
_For any_ opname item, when physical count is updated, the difference and total discrepancy should be automatically recalculated
**Validates: Requirements 8.3, 8.4**

Property 28: Warehouse consistency validation
_For any_ stock opname, all opname items must have the same warehouse_id as the parent opname
**Validates: Requirements 9.1**

Property 29: Tracking type consistency validation
_For any_ opname item, the tracking_type must match the product's tracking configuration (is_batch_tracked, is_serial_tracked)
**Validates: Requirements 9.2**

Property 30: Opname reversal restores state
_For any_ approved opname that is cancelled, reversing should restore stock quantities, batch quantities, and serial statuses to their pre-approval state
**Validates: Requirements 9.7**

Property 31: Status transition rules
_For any_ stock opname, status transitions must follow the allowed flow: DRAFT → IN_PROGRESS → COMPLETED → APPROVED, and edits are only allowed in DRAFT or IN_PROGRESS states
**Validates: Requirements 10.1-10.7**

Property 32: Item management based on status
_For any_ stock opname, adding or removing items is only allowed when status is DRAFT or IN_PROGRESS, and is prevented when status is COMPLETED or APPROVED
**Validates: Requirements 11.1, 11.2, 11.7**

## Error Handling

### Validation Errors

**Pre-Operation Validation:**

1. **Warehouse Consistency** - Reject if items have different warehouse_id than opname
2. **Tracking Type Mismatch** - Reject if tracking_type doesn't match product configuration
3. **Negative Physical Count** - Reject if physical_quantity < 0
4. **Large Discrepancy** - Warn if difference > 50% of system stock, require confirmation
5. **All Serials Missing** - Warn if all serials marked as not found, require manager approval
6. **Expired Batch with Stock** - Warn if expired batch has physical_count > 0, require confirmation
7. **Missing Physical Count** - Reject approval if any item doesn't have physical count entered

**Error Messages:**

- Clear indication of what failed
- Actionable guidance (e.g., "Physical count required for all items before approval")
- Reference to specific batch/serial that caused the error
- Suggestions for resolution

### Transaction Rollback

**Rollback Scenarios:**

1. Database constraint violation during approval
2. Stock card creation failure
3. Batch/serial table update failure
4. Product warehouse stock update failure
5. Invariant validation failure (total_stock mismatch)

**Rollback Strategy:**

- Use Dexie transaction API
- Wrap all approval operations in single transaction
- On error, throw exception to trigger automatic rollback
- Maintain opname status as pre-approval
- Log error details for debugging

## Performance Considerations

### Query Optimization

**Batch/Serial Loading:**

- Use compound indexes `[product_id+warehouse_id]` for efficient filtering
- Load only active batches (is_active = true, quantity > 0)
- Load only IN_STOCK serials
- Batch load all items for an opname in single query

**Bulk Operations:**

- Use `bulkAdd()` for creating multiple opname batch/serial items
- Use `bulkUpdate()` for updating multiple batches/serials on approval
- Batch stock card creation when possible

### Database Indexes

**Required Indexes:**

```typescript
// New tables
stock_opname_batch_items: 'opname_item_id, batch_id, batch_number';
stock_opname_serial_items: 'opname_item_id, serial_id, serial_number, found';

// Enhanced existing
stock_opname_items: 'stock_opname_id, product_id, tracking_type';
```

### Caching Strategy

**Cache During Opname Session:**

- Product tracking types (batch/serial/general)
- Available batches per product+warehouse
- Available serials per product+warehouse
- Current system stock values

**Invalidate Cache:**

- On warehouse change
- On product add/remove
- After approval (reload for next opname)

## Migration Strategy

### Database Schema Changes

**Create New Tables:**

```sql
CREATE TABLE stock_opname_batch_items (
  id INTEGER PRIMARY KEY,
  opname_item_id INTEGER NOT NULL,
  batch_id INTEGER NOT NULL,
  batch_number TEXT NOT NULL,
  expiry_date DATETIME,
  system_quantity INTEGER NOT NULL,
  physical_quantity INTEGER NOT NULL,
  difference INTEGER NOT NULL,
  notes TEXT,
  created_at DATETIME NOT NULL
);

CREATE TABLE stock_opname_serial_items (
  id INTEGER PRIMARY KEY,
  opname_item_id INTEGER NOT NULL,
  serial_id INTEGER NOT NULL,
  serial_number TEXT NOT NULL,
  found INTEGER NOT NULL,  -- 0 or 1 (boolean)
  notes TEXT,
  created_at DATETIME NOT NULL
);
```

**Add Fields to Existing Tables:**

```sql
ALTER TABLE stock_opnames ADD COLUMN batch_discrepancy INTEGER DEFAULT 0;
ALTER TABLE stock_opnames ADD COLUMN serial_discrepancy INTEGER DEFAULT 0;
ALTER TABLE stock_opnames ADD COLUMN general_discrepancy INTEGER DEFAULT 0;

ALTER TABLE stock_opname_items ADD COLUMN tracking_type TEXT DEFAULT 'GENERAL';
```

**Add Indexes:**

```sql
CREATE INDEX idx_opname_batch_items_opname ON stock_opname_batch_items(opname_item_id);
CREATE INDEX idx_opname_batch_items_batch ON stock_opname_batch_items(batch_id);
CREATE INDEX idx_opname_serial_items_opname ON stock_opname_serial_items(opname_item_id);
CREATE INDEX idx_opname_serial_items_serial ON stock_opname_serial_items(serial_id);
CREATE INDEX idx_opname_serial_items_found ON stock_opname_serial_items(found);
```

### Data Migration

**Existing Opnames:**

- No retroactive batch/serial assignment needed
- Existing opnames remain as general tracking
- New opnames will have full tracking support

**Version Upgrade:**

- Increment database version from 4 to 5
- Run migration in `app.database.ts`
- Test migration with sample data

### Backward Compatibility

**Existing Code:**

- Current opname creation still works (general tracking)
- New fields are optional
- Gradual rollout possible

**UI Updates:**

- Show/hide batch/serial sections based on tracking type
- Graceful degradation if tracking data missing
- Clear indicators when tracking is active

## Security Considerations

### Input Validation

**Physical Quantity:**

- Must be non-negative integer
- Max value: 999,999
- Warn if > 50% different from system stock

**Batch Number:**

- Sanitize input to prevent injection
- Validate format (alphanumeric + hyphens only)
- Max length: 50 characters

**Serial Number:**

- Sanitize input to prevent injection
- Validate format per product requirements
- Max length: 50 characters

### Authorization

**Opname Operations:**

- Require authenticated user
- Log user_id with each opname
- Audit trail for all changes

**Approval Authority:**

- Only warehouse managers can approve
- Large discrepancies require additional approval
- All serials missing requires manager approval

## Deployment Plan

### Phase 1: Backend Enhancement (Week 1)

- Create new tables for batch/serial items
- Add new fields to existing tables
- Implement batch/serial loading methods
- Write validation methods

### Phase 2: Service Layer (Week 2)

- Enhance createStockOpname() with tracking logic
- Implement approval methods per tracking type
- Add recalculation logic
- Write unit tests

### Phase 3: UI Enhancement (Week 3)

- Add batch/serial display to opname form
- Implement physical count input per batch/serial
- Add auto-calculation logic
- Wire up validation messages

### Phase 4: Testing & Deployment (Week 4)

- Integration testing
- User acceptance testing
- Deploy to staging
- Deploy to production
- Monitor for issues

## Success Metrics

### Functional Metrics

- ✅ All 32 correctness properties pass
- ✅ All 84 acceptance criteria met
- ✅ Zero data integrity issues
- ✅ 100% batch/serial traceability in opname

### Performance Metrics

- ⏱️ Opname creation < 1s (with batch/serial loading)
- ⏱️ Physical count update < 200ms
- ⏱️ Approval operation < 2s (all adjustments)
- 📊 Database size increase < 30%

### Quality Metrics

- 🧪 80%+ code coverage
- 🐛 Zero critical bugs in production
- 📝 Complete audit trail for all opnames
- ✨ User satisfaction > 4.5/5

---

**Design document complete. Ready for implementation planning.**
