# Quick Testing Guide - Stock Cards Fix

## 🧪 How to Verify the Fix

### Method 1: Browser DevTools (Fastest)

1. **Open DevTools** (F12 or Cmd+Option+I)
2. Go to **Application** tab
3. Expand **IndexedDB** → **fglabstudio** → **stock_cards**
4. Click on **stock_cards** table
5. **Check:** Should see entries after doing transactions

### Method 2: Test Each Transaction Type

#### Test A: Purchase Order Receive ✅

```
1. Go to Purchase Order page
2. Create new PO:
   - Supplier: Any
   - Warehouse: Any
   - Add 1-2 products with quantities
3. Save PO
4. Click "Receive" button
5. Enter received quantities
6. Click "Receive Items"

✅ VERIFY in DevTools → stock_cards:
   - New entry with type: "IN"
   - qty_in: [received quantity]
   - qty_out: 0
   - balance: [running total]
   - reference_type: "PURCHASE_ORDER"
```

#### Test B: Stock Movement ✅

```
1. Go to Stock Movement page
2. Create new movement:
   - Type: IN / OUT / TRANSFER
   - Product: Any
   - Warehouse: Any
   - Quantity: Any number
3. Save movement

✅ VERIFY in DevTools → stock_cards:
   - IN: qty_in filled, qty_out = 0
   - OUT: qty_out filled, qty_in = 0
   - TRANSFER: 2 entries (OUT + IN)
```

#### Test C: Stock Opname ✅

```
1. Go to Stock Opname page
2. Create new opname:
   - Warehouse: Any
   - Add products with physical count
3. System calculates difference
4. Approve opname

✅ VERIFY in DevTools → stock_cards:
   - New entry with type: "ADJUSTMENT"
   - qty_in or qty_out based on difference
   - reference_type: "STOCK_OPNAME"
```

### Method 3: Check Stock Overview UI

```
1. Go to Stock Card / Stock Overview page
2. Find any product in the table
3. Click "Detail" button
4. Modal should open showing transaction history

✅ VERIFY:
   - Table shows all transactions
   - Columns: Date, Type, Qty In, Qty Out, Balance
   - Running balance is correct
   - Reference info is shown
```

## 🐛 If Still Not Working

### Debug Checklist:

1. **Check Console for Errors**

   - Open DevTools → Console tab
   - Look for red error messages
   - Common issues: Database not ready, validation errors

2. **Verify Database Connection**

   ```typescript
   // In console, run:
   await db.stock_cards.count();
   // Should return number of entries
   ```

3. **Check if Observable is Subscribed**

   - Look for `firstValueFrom()` wrapper in code
   - Verify import: `import { firstValueFrom } from 'rxjs'`

4. **Verify Service Injection**
   - Check if `StockCardService` is injected
   - Check if `ProductWarehouseStockService` is injected

## 📊 Expected Data Structure

### stock_cards Table Schema:

```typescript
{
  id: number,
  product_id: number,
  warehouse_id: number,
  transaction_date: Date,
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER',
  reference_type: string,  // 'PURCHASE_ORDER', 'STOCK_MOVEMENT', 'STOCK_OPNAME'
  reference_id: number,
  qty_in: number,
  qty_out: number,
  balance: number,         // Running balance
  unit_cost: number,
  total_value: number,
  notes: string,
  created_at: Date
}
```

### Example Entry:

```json
{
  "id": 1,
  "product_id": 5,
  "warehouse_id": 1,
  "transaction_date": "2024-12-04T10:30:00",
  "type": "IN",
  "reference_type": "PURCHASE_ORDER",
  "reference_id": 12,
  "qty_in": 100,
  "qty_out": 0,
  "balance": 100,
  "unit_cost": 10000,
  "total_value": 1000000,
  "notes": "Receive PO PO/202412/0012 - Batch: BATCH001",
  "created_at": "2024-12-04T10:30:00"
}
```

## ✅ Success Criteria

- [ ] `stock_cards` table has entries after PO receive
- [ ] `stock_cards` table has entries after stock movement
- [ ] `stock_cards` table has entries after stock opname
- [ ] Stock Overview detail modal shows transaction history
- [ ] Running balance calculations are correct
- [ ] No console errors during transactions

---

**Quick Test:** Do 1 PO receive → Check DevTools → Should see new entry in stock_cards table! 🎯
