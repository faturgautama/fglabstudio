# Design Document

## Overview

The Inventory Stock Management System is a comprehensive solution for tracking and managing inventory movements across multiple warehouses. The system maintains two critical tables: `stock_cards` for audit trail and `product_warehouse_stock` for real-time stock levels. Every inventory transaction (Purchase Order receive/cancel, Stock Movement, Stock Opname) must update both tables atomically to ensure data consistency.

The system supports three tracking methods:

- **Batch Tracking**: Products tracked by batch number and expiry date (e.g., pharmaceuticals, food)
- **Serial Tracking**: Products tracked by unique serial numbers (e.g., electronics, machinery)
- **General Tracking**: Products tracked by quantity only (e.g., raw materials, consumables)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  (Components: PO, Stock Movement, Stock Opname)             │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                      Store Layer (NGXS)                      │
│  (Actions, State Management, Side Effects)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                     Service Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PurchaseOrderService                                 │  │
│  │  - receivePurchaseOrder()                            │  │
│  │  - cancelPurchaseOrder()                             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  StockMovementService                                 │  │
│  │  - createStockMovement()                             │  │
│  │  - adjustStock()                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  StockOpnameService                                   │  │
│  │  - approveStockOpname()                              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  StockCardService (Core)                             │  │
│  │  - addStockCard()                                    │  │
│  │  - getStockCardsByProduct()                          │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ProductWarehouseStockService (Core)                 │  │
│  │  - updateStockOnReceive()                            │  │
│  │  - decrementStockOnIssue()                           │  │
│  │  - recalculateStock()                                │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Data Layer (Dexie/IndexedDB)               │
│  Tables:                                                     │
│  - stock_cards (audit trail)                                │
│  - product_warehouse_stock (current stock)                  │
│  - product_batches (batch tracking)                         │
│  - product_serials (serial tracking)                        │
│  - purchase_orders, purchase_order_items                    │
│  - stock_movements                                          │
│  - stock_opnames, stock_opname_items                        │
└─────────────────────────────────────────────────────────────┘
```

### Transaction Flow

All stock transactions follow this pattern:

1. **Validate** - Check business rules (stock availability, tracking requirements)
2. **Create Transaction Record** - Add to primary table (PO, movement, opname)
3. **Add Stock Card** - Create audit trail entry in `stock_cards`
4. **Update Warehouse Stock** - Update `product_warehouse_stock`
5. **Handle Tracking** - Create batch/serial records if needed
6. **Update Status** - Update transaction status

## Components and Interfaces

### Core Services

#### StockCardService

**Purpose**: Manages stock card entries (audit trail) and coordinates stock updates.

**Key Methods**:

```typescript
addStockCard(
  product_id: number,
  warehouse_id: number,
  type: 'IN' | 'OUT' | 'ADJUSTMENT',
  qty: number,
  reference_type?: string,
  reference_id?: number,
  notes?: string,
  unit_cost?: number
): Observable<number>

getStockCardsByProduct(product_id: string, limit?: number): Observable<StockCard[]>

getStockCardsByProductAndWarehouse(
  product_id: number,
  warehouse_id: number,
  limit?: number
): Observable<StockCard[]>

getStockByWarehouse(product_id: number, warehouse_id: number): Observable<number>
```

**Responsibilities**:

- Create stock card entries with running balance
- Validate stock availability before OUT transactions
- Trigger low stock notifications
- Coordinate with ProductWarehouseStockService

#### ProductWarehouseStockService

**Purpose**: Manages real-time stock levels per product per warehouse.

**Key Methods**:

```typescript
updateStockOnReceive(
  product_id: number | string,
  warehouse_id: number | string,
  quantity: number,
  tracking_type: 'BATCH' | 'SERIAL' | 'GENERAL'
): Promise<void>

decrementStockOnIssue(
  product_id: number | string,
  warehouse_id: number | string,
  quantity: number,
  tracking_type: 'BATCH' | 'SERIAL' | 'GENERAL'
): Promise<void>

recalculateStock(
  product_id: number | string,
  warehouse_id: number | string
): Promise<void>

getStockByWarehouse(warehouse_id: number | string): Promise<any[]>

getProductStockInAllWarehouses(product_id: number | string): Promise<any[]>
```

**Responsibilities**:

- Maintain separate counters for batch/serial/general quantities
- Calculate total_stock as sum of all tracking types
- Validate sufficient stock before decrements
- Use compound index [product_id+warehouse_id] for queries

#### PurchaseOrderService

**Purpose**: Manages Purchase Order operations including receive and cancel.

**Key Methods**:

```typescript
receivePurchaseOrder(
  po_id: number,
  items: {
    id: number;
    qty_received: number;
    batch_number?: string;
    expiry_date?: Date;
    serial_numbers?: string[];
  }[]
): Observable<string>

cancelPurchaseOrder(po_id: number, reason?: string): Observable<string>

getPurchaseOrderWithItems(po_id: string): Observable<PurchaseOrder>
```

**Receive Flow**:

1. Validate PO exists and has warehouse_id
2. For each item:
   - Validate tracking requirements (batch/serial)
   - Update PO item qty_received
   - Create batch/serial records if needed
   - Add stock card entry (type='IN')
   - Update product warehouse stock
3. Update PO status (RECEIVED/PARTIAL)

**Cancel Flow**:

1. Validate PO exists and not already cancelled
2. Validate cancellation reason (min 10 chars)
3. For each received item:
   - Create stock card entry (type='OUT') to reverse
   - Decrement product warehouse stock
   - Deactivate batches or update serial status
4. Update PO status to CANCELLED

#### StockMovementService

**Purpose**: Manages stock movements (IN, OUT, TRANSFER, ADJUSTMENT).

**Key Methods**:

```typescript
createStockMovement(
  movement: Omit<StockMovement, 'id' | 'created_at'>
): Observable<number>

adjustStock(
  product_id: number,
  warehouse_id: number,
  new_quantity: number,
  reason: string,
  notes?: string
): Observable<number>
```

**Movement Types**:

- **IN**: Add stock to warehouse
- **OUT**: Remove stock from warehouse
- **TRANSFER**: Move stock between warehouses (creates 2 stock cards)
- **ADJUSTMENT**: Adjust stock to specific quantity

#### StockOpnameService

**Purpose**: Manages physical stock counting and reconciliation.

**Key Methods**:

```typescript
createStockOpname(
  opname: Omit<StockOpname, 'id' | 'created_at'>,
  items: Omit<StockOpnameItem, 'id' | 'stock_opname_id'>[]
): Observable<number>

approveStockOpname(opname_id: number, approved_by: string): Observable<number>

updateOpnameItem(item_id: string, physical_stock: number, notes?: string): Observable<string>
```

**Approval Flow**:

1. Validate opname exists and not already approved
2. For each item with difference:
   - Calculate difference (physical - system)
   - Create stock card entry (type='ADJUSTMENT')
   - Update product warehouse stock
3. Update opname status to APPROVED

## Data Models

### StockCard

```typescript
interface StockCard {
  id?: number;
  product_id: number;
  warehouse_id: number;
  transaction_date: Date;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  reference_type?: string; // 'PURCHASE_ORDER', 'STOCK_MOVEMENT', 'STOCK_OPNAME'
  reference_id?: number;
  qty_in: number;
  qty_out: number;
  balance: number; // Running balance
  unit_cost?: number;
  total_value?: number;
  notes?: string;
  created_at: Date;
}
```

**Indexes**:

- Primary: `++id`
- Compound: `[product_id+warehouse_id]` (for efficient warehouse-specific queries)
- Single: `product_id`, `warehouse_id`, `transaction_date`, `type`, `reference_id`

### ProductWarehouseStock

```typescript
interface ProductWarehouseStock {
  id?: number;
  product_id: number;
  warehouse_id: number;
  total_stock: number;
  batch_quantity: number;
  serial_quantity: number;
  general_quantity: number;
  updated_at: Date;
}
```

**Indexes**:

- Primary: `++id`
- Compound: `[product_id+warehouse_id]` (unique constraint)
- Single: `product_id`, `warehouse_id`

**Invariant**: `total_stock = batch_quantity + serial_quantity + general_quantity`

### ProductBatch

```typescript
interface ProductBatch {
  id?: number;
  product_id: string;
  warehouse_id: number;
  batch_number: string;
  expiry_date?: Date;
  quantity: number;
  purchase_order_id?: string;
  cost_per_unit?: number;
  is_active: boolean;
  created_at: Date;
}
```

### ProductSerial

```typescript
interface ProductSerial {
  id?: number;
  product_id: number;
  warehouse_id: number;
  serial_number: string;
  batch_number?: string;
  status: 'IN_STOCK' | 'SOLD' | 'RETURNED' | 'DAMAGED';
  purchase_order_id?: string;
  notes?: string;
  created_at: Date;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Purchase Order Receive Properties

**Property 1: Receive creates stock card entries**
_For any_ Purchase Order with items, when receiving items, the system should create a stock card entry with type='IN' for each received item
**Validates: Requirements 1.1**

**Property 2: Receive increments warehouse stock**
_For any_ product and warehouse, when receiving items, the product warehouse stock quantity should increase by the received quantity based on tracking type
**Validates: Requirements 1.2**

**Property 3: Batch tracking validation**
_For any_ batch-tracked product, receiving items without a batch number should fail, and receiving with a batch number should create a product batch record
**Validates: Requirements 1.3**

**Property 4: Serial tracking validation**
_For any_ serial-tracked product, receiving items without serial numbers should fail, and receiving with serial numbers should create product serial records
**Validates: Requirements 1.4**

**Property 5: Expiry date storage**
_For any_ perishable product with expiry date, receiving items should store the expiry date in the batch record
**Validates: Requirements 1.5**

**Property 6: Full receive status update**
_For any_ Purchase Order, when all items are fully received (qty_received >= qty_ordered for all items), the PO status should be 'RECEIVED'
**Validates: Requirements 1.6**

**Property 7: Partial receive status update**
_For any_ Purchase Order, when some items are partially received (qty_received > 0 but < qty_ordered for any item), the PO status should be 'PARTIAL'
**Validates: Requirements 1.7**

### Purchase Order Cancel Properties

**Property 8: Cancel creates reversal stock cards**
_For any_ Purchase Order with received items, cancelling should create stock card entries with type='OUT' that match the received quantities
**Validates: Requirements 2.1**

**Property 9: Cancel decrements warehouse stock**
_For any_ Purchase Order with received items, cancelling should decrement the product warehouse stock by the received quantities
**Validates: Requirements 2.2**

**Property 10: Cancel deactivates batches**
_For any_ Purchase Order with batch-tracked items, cancelling should mark the associated product batches as inactive
**Validates: Requirements 2.3**

**Property 11: Cancel updates serial status**
_For any_ Purchase Order with serial-tracked items, cancelling should update the serial status to 'RETURNED'
**Validates: Requirements 2.4**

**Property 12: Cancel updates PO status**
_For any_ Purchase Order, cancelling should update the status to 'CANCELLED'
**Validates: Requirements 2.5**

**Property 13: Cancel reason validation**
_For any_ Purchase Order, cancelling with a reason less than 10 characters should fail, and cancelling with 10+ characters should succeed
**Validates: Requirements 2.6**

**Property 14: Cancel idempotence**
_For any_ Purchase Order, attempting to cancel an already cancelled PO should fail with an appropriate error message
**Validates: Requirements 2.7**

### Stock Movement Properties

**Property 15: IN movement creates stock card and increments**
_For any_ stock movement with type='IN', the system should create a stock card entry with type='IN' and increment the warehouse stock
**Validates: Requirements 3.1**

**Property 16: OUT movement creates stock card and decrements**
_For any_ stock movement with type='OUT', the system should create a stock card entry with type='OUT' and decrement the warehouse stock
**Validates: Requirements 3.2**

**Property 17: TRANSFER creates two stock cards**
_For any_ stock movement with type='TRANSFER', the system should create exactly two stock card entries (one OUT from source, one IN to destination)
**Validates: Requirements 3.3**

**Property 18: TRANSFER updates both warehouses**
_For any_ stock movement with type='TRANSFER', the source warehouse stock should decrease and destination warehouse stock should increase by the same quantity
**Validates: Requirements 3.4**

**Property 19: ADJUSTMENT creates stock card and updates stock**
_For any_ stock movement with type='ADJUSTMENT', the system should create a stock card entry with type='ADJUSTMENT' and update the warehouse stock accordingly
**Validates: Requirements 3.5**

**Property 20: Stock availability validation**
_For any_ stock movement with type='OUT' or 'TRANSFER', attempting the operation with insufficient stock should fail with an appropriate error
**Validates: Requirements 3.6, 8.7**

**Property 21: Movement number uniqueness**
_For any_ set of stock movements, all movement numbers should be unique
**Validates: Requirements 3.7**

### Stock Opname Properties

**Property 22: Opname approval creates adjustment cards**
_For any_ stock opname with items having differences, approving should create stock card entries with type='ADJUSTMENT' for each item with non-zero difference
**Validates: Requirements 4.1**

**Property 23: Positive difference increases stock**
_For any_ stock opname item with positive difference (physical > system), approving should increment the warehouse stock
**Validates: Requirements 4.2**

**Property 24: Negative difference decreases stock**
_For any_ stock opname item with negative difference (physical < system), approving should decrement the warehouse stock
**Validates: Requirements 4.3**

**Property 25: Opname reconciles to physical count**
_For any_ stock opname, after approval, the product warehouse stock should equal the physical count entered
**Validates: Requirements 4.4**

**Property 26: Opname approval updates status**
_For any_ stock opname, approving should update the status to 'APPROVED'
**Validates: Requirements 4.5**

**Property 27: Opname captures baseline**
_For any_ stock opname, creating should capture the current system stock as the baseline (system_stock field)
**Validates: Requirements 4.6**

**Property 28: Opname calculates difference**
_For any_ stock opname item, the difference should equal physical_count minus system_stock
**Validates: Requirements 4.7**

### Stock Card Query Properties

**Property 29: Stock cards ordered by date**
_For any_ product, querying stock cards should return entries ordered by transaction_date in descending order
**Validates: Requirements 5.1**

**Property 30: Stock card data completeness**
_For any_ stock card query result, each entry should contain transaction type, qty_in, qty_out, balance, and reference information
**Validates: Requirements 5.2**

**Property 31: Warehouse filtering**
_For any_ product and warehouse, querying stock cards with warehouse filter should return only entries for that warehouse
**Validates: Requirements 5.3**

**Property 32: Running balance calculation**
_For any_ sequence of stock card entries, the running balance at each step should equal the sum of all previous IN quantities minus all previous OUT quantities
**Validates: Requirements 5.4**

**Property 33: Reference information inclusion**
_For any_ stock card entry, the result should include the source transaction reference (PO number, movement number, or opname number)
**Validates: Requirements 5.5**

### Data Integrity Properties

**Property 34: Stock card required fields**
_For any_ stock card entry created, it should contain non-null values for product_id, warehouse_id, transaction_date, type, and quantity
**Validates: Requirements 6.1**

**Property 35: Atomic table updates**
_For any_ stock transaction, both stock_cards and product_warehouse_stock tables should be updated, or neither should be updated if an error occurs
**Validates: Requirements 6.3**

**Property 36: Transaction rollback on error**
_For any_ stock transaction that encounters an error, no partial changes should be committed to the database
**Validates: Requirements 6.4**

**Property 37: Balance calculation formula**
_For any_ product and warehouse, the stock balance should equal the sum of all IN transactions minus the sum of all OUT transactions
**Validates: Requirements 6.5**

**Property 38: Tracking type counters**
_For any_ product warehouse stock, the system should maintain separate non-negative counters for batch_quantity, serial_quantity, and general_quantity
**Validates: Requirements 6.6**

**Property 39: Total stock calculation**
_For any_ product warehouse stock, total_stock should equal batch_quantity plus serial_quantity plus general_quantity
**Validates: Requirements 6.7**

### Tracking Method Properties

**Property 40: Batch tracking requirement**
_For any_ batch-tracked product, all stock IN transactions should require a batch number, and transactions without it should fail
**Validates: Requirements 7.1**

**Property 41: Serial tracking requirement**
_For any_ serial-tracked product, all stock IN transactions should require serial numbers, and transactions without them should fail
**Validates: Requirements 7.2**

**Property 42: Perishable expiry requirement**
_For any_ batch-tracked perishable product, all stock IN transactions should require an expiry date, and transactions without it should fail
**Validates: Requirements 7.3**

**Property 43: Serial number uniqueness**
_For any_ serial-tracked product, attempting to receive items with duplicate serial numbers should fail with an appropriate error
**Validates: Requirements 7.4**

**Property 44: General tracking no requirements**
_For any_ general-tracked product, stock IN transactions should succeed without batch number or serial numbers
**Validates: Requirements 7.5**

**Property 45: Batch quantity increment**
_For any_ batch-tracked product, receiving items should increment the batch_quantity field in product warehouse stock
**Validates: Requirements 7.6**

**Property 46: Serial quantity increment**
_For any_ serial-tracked product, receiving items should increment the serial_quantity field in product warehouse stock
**Validates: Requirements 7.7**

**Property 47: General quantity increment**
_For any_ general-tracked product, receiving items should increment the general_quantity field in product warehouse stock
**Validates: Requirements 7.8**

## Error Handling

### Validation Errors

All validation errors should be thrown with descriptive messages:

```typescript
// Stock availability
throw new Error(`Insufficient stock in warehouse ${warehouse.name}. Available: ${currentStock}`);

// Tracking requirements
throw new Error(`Product "${product.name}" requires batch number`);
throw new Error(
  `Product "${product.name}" requires ${qty} serial numbers, but ${provided} provided`
);

// Business rules
throw new Error('Purchase Order is already cancelled');
throw new Error('Source and destination warehouse must be different');
```

### Error Recovery

- All database operations use transactions where possible
- Failed operations should not leave partial data
- Error messages should be user-friendly and actionable
- System should log errors for debugging

## Testing Strategy

### Unit Testing

Unit tests will cover:

- Service method inputs/outputs
- Error handling for invalid inputs
- Edge cases (zero quantities, negative values)
- Database query correctness
- Observable/Promise conversion with firstValueFrom()

### Property-Based Testing

Property-based tests will use **fast-check** library for TypeScript/JavaScript.

**Configuration**:

- Minimum 100 iterations per property test
- Custom generators for domain objects (products, warehouses, POs)
- Shrinking enabled to find minimal failing cases

**Test Structure**:

```typescript
import fc from 'fast-check';

describe('Property: Receive creates stock card entries', () => {
  it('should create stock card with type=IN for each received item', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          po: purchaseOrderArbitrary(),
          items: fc.array(receiveItemArbitrary(), { minLength: 1 }),
        }),
        async ({ po, items }) => {
          // Setup
          await setupPO(po);

          // Execute
          await receivePurchaseOrder(po.id, items);

          // Verify
          const stockCards = await getStockCards(po.id);
          expect(stockCards).toHaveLength(items.length);
          expect(stockCards.every((sc) => sc.type === 'IN')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Generators**:

- `productArbitrary()`: Generate products with random tracking types
- `warehouseArbitrary()`: Generate warehouses
- `purchaseOrderArbitrary()`: Generate POs with items
- `stockMovementArbitrary()`: Generate stock movements
- `stockOpnameArbitrary()`: Generate stock opnames

### Integration Testing

Integration tests will verify:

- End-to-end flows (create PO → receive → view stock cards)
- Multi-warehouse scenarios
- Batch and serial tracking workflows
- Error scenarios with database rollback

## Performance Considerations

### Database Indexes

Critical indexes for performance:

- `stock_cards`: `[product_id+warehouse_id]` for warehouse-specific queries
- `product_warehouse_stock`: `[product_id+warehouse_id]` for upsert operations
- `product_batches`: `[product_id+warehouse_id]` for batch lookups
- `product_serials`: `[product_id+warehouse_id]` for serial lookups

### Query Optimization

- Use compound indexes for multi-field queries
- Limit result sets with `.limit()` for large datasets
- Use `.reverse()` for descending order queries
- Batch operations with `.bulkAdd()` for multiple inserts

### Caching Strategy

- Cache product tracking settings to avoid repeated lookups
- Cache warehouse information for display
- Invalidate cache on product/warehouse updates

## Security Considerations

- Validate all user inputs before database operations
- Prevent negative stock quantities
- Require authorization for sensitive operations (cancel PO, approve opname)
- Log all stock transactions for audit trail
- Validate serial number uniqueness to prevent fraud

## Deployment Notes

### Database Migration

When deploying the compound index update:

1. Increment database version in `app.database.ts`
2. Add compound index to `stock_cards` table schema
3. Dexie will automatically migrate existing data
4. Test migration in development first
5. Backup production database before deployment

### Rollback Plan

If issues occur after deployment:

1. Revert to previous version
2. Database schema changes are backward compatible
3. No data loss expected (indexes are additive)

## Future Enhancements

- Real-time stock synchronization across multiple devices
- Barcode scanning for faster stock operations
- Automated reorder point notifications
- Stock forecasting based on historical data
- Multi-currency support for international warehouses
- Batch expiry alerts and FEFO (First Expired, First Out) logic
