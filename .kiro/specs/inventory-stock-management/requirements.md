# Requirements Document

## Introduction

Sistem Inventory Stock Management adalah fitur untuk mengelola pergerakan stok barang di warehouse melalui berbagai transaksi seperti Purchase Order (receive & cancel), Stock Movement, dan Stock Opname. Sistem ini harus mencatat setiap transaksi ke dalam stock cards untuk audit trail dan memperbarui stock warehouse secara real-time.

## Glossary

- **System**: Aplikasi Inventory Management FGLabStudio
- **Stock Card**: Catatan historis setiap transaksi pergerakan stok (audit trail)
- **Product Warehouse Stock**: Tabel yang menyimpan jumlah stok aktual per produk per warehouse
- **Purchase Order (PO)**: Pesanan pembelian barang dari supplier
- **Receive PO**: Proses penerimaan barang dari Purchase Order
- **Cancel PO**: Proses pembatalan Purchase Order dan pengembalian stok
- **Stock Movement**: Perpindahan stok antar warehouse atau adjustment stok
- **Stock Opname**: Proses penghitungan fisik stok dan penyesuaian dengan sistem
- **Batch Tracking**: Pelacakan produk berdasarkan nomor batch dan tanggal kadaluarsa
- **Serial Tracking**: Pelacakan produk berdasarkan nomor seri unik
- **General Tracking**: Pelacakan produk tanpa batch atau serial number

## Requirements

### Requirement 1

**User Story:** As an inventory manager, I want to receive items from a Purchase Order, so that the stock is updated in the system and recorded in the audit trail.

#### Acceptance Criteria

1. WHEN a user receives items from a Purchase Order THEN the System SHALL create a stock card entry with type 'IN' for each received item
2. WHEN a user receives items from a Purchase Order THEN the System SHALL increment the product warehouse stock quantity based on tracking type (batch/serial/general)
3. WHEN a user receives batch-tracked items THEN the System SHALL require batch number and create a product batch record
4. WHEN a user receives serial-tracked items THEN the System SHALL require serial numbers and create product serial records
5. WHEN a user receives items with expiry date THEN the System SHALL store the expiry date in the batch record
6. WHEN all items in a Purchase Order are fully received THEN the System SHALL update the PO status to 'RECEIVED'
7. WHEN some items in a Purchase Order are partially received THEN the System SHALL update the PO status to 'PARTIAL'

### Requirement 2

**User Story:** As an inventory manager, I want to cancel a Purchase Order, so that any received stock is reversed and the system reflects the correct inventory levels.

#### Acceptance Criteria

1. WHEN a user cancels a Purchase Order with received items THEN the System SHALL create stock card entries with type 'OUT' to reverse the received quantities
2. WHEN a user cancels a Purchase Order with received items THEN the System SHALL decrement the product warehouse stock by the received quantities
3. WHEN a user cancels a Purchase Order with batch-tracked items THEN the System SHALL deactivate the associated product batches
4. WHEN a user cancels a Purchase Order with serial-tracked items THEN the System SHALL update the serial status to 'RETURNED'
5. WHEN a user cancels a Purchase Order THEN the System SHALL update the PO status to 'CANCELLED'
6. WHEN a user cancels a Purchase Order THEN the System SHALL require a cancellation reason with minimum 10 characters
7. WHEN a user attempts to cancel an already cancelled Purchase Order THEN the System SHALL prevent the cancellation and display a warning message

### Requirement 3

**User Story:** As an inventory manager, I want to move stock between warehouses or adjust stock levels, so that inventory is accurately distributed and recorded.

#### Acceptance Criteria

1. WHEN a user creates a stock movement with type 'IN' THEN the System SHALL create a stock card entry with type 'IN' and increment the warehouse stock
2. WHEN a user creates a stock movement with type 'OUT' THEN the System SHALL create a stock card entry with type 'OUT' and decrement the warehouse stock
3. WHEN a user creates a stock movement with type 'TRANSFER' THEN the System SHALL create two stock card entries (OUT from source warehouse, IN to destination warehouse)
4. WHEN a user creates a stock movement with type 'TRANSFER' THEN the System SHALL decrement stock from source warehouse and increment stock in destination warehouse
5. WHEN a user creates a stock movement with type 'ADJUSTMENT' THEN the System SHALL create a stock card entry with type 'ADJUSTMENT' and update the warehouse stock accordingly
6. WHEN a user creates a stock movement THEN the System SHALL validate that sufficient stock exists for OUT and TRANSFER operations
7. WHEN a user creates a stock movement THEN the System SHALL generate a unique movement number

### Requirement 4

**User Story:** As an inventory manager, I want to perform stock opname (physical count), so that system stock matches physical stock and discrepancies are recorded.

#### Acceptance Criteria

1. WHEN a user approves a stock opname with stock differences THEN the System SHALL create stock card entries with type 'ADJUSTMENT' for each item with discrepancy
2. WHEN a user approves a stock opname with positive difference THEN the System SHALL create a stock card entry with type 'IN' and increment the warehouse stock
3. WHEN a user approves a stock opname with negative difference THEN the System SHALL create a stock card entry with type 'OUT' and decrement the warehouse stock
4. WHEN a user approves a stock opname THEN the System SHALL update the product warehouse stock to match the physical count
5. WHEN a user approves a stock opname THEN the System SHALL update the opname status to 'APPROVED'
6. WHEN a user creates a stock opname THEN the System SHALL capture the current system stock as the baseline
7. WHEN a user enters physical count THEN the System SHALL calculate the difference automatically

### Requirement 5

**User Story:** As an inventory manager, I want to view stock card history for any product, so that I can audit all stock movements and verify transactions.

#### Acceptance Criteria

1. WHEN a user views stock card details for a product THEN the System SHALL display all stock card entries ordered by transaction date
2. WHEN a user views stock card details THEN the System SHALL display transaction type, quantity in, quantity out, running balance, and reference information
3. WHEN a user views stock card details THEN the System SHALL filter entries by warehouse if warehouse is specified
4. WHEN a user views stock card details THEN the System SHALL calculate running balance correctly based on IN and OUT transactions
5. WHEN a user views stock card details THEN the System SHALL display the source transaction (PO number, movement number, or opname number)

### Requirement 6

**User Story:** As a system administrator, I want the system to maintain data integrity for stock transactions, so that stock levels are always accurate and consistent.

#### Acceptance Criteria

1. WHEN the System creates a stock card entry THEN the System SHALL include product_id, warehouse_id, transaction_date, type, quantity, and reference_id
2. WHEN the System updates product warehouse stock THEN the System SHALL use the compound index [product_id+warehouse_id] for efficient querying
3. WHEN the System processes a stock transaction THEN the System SHALL update both stock_cards and product_warehouse_stock tables atomically
4. WHEN the System encounters an error during stock transaction THEN the System SHALL rollback all changes and display an error message
5. WHEN the System calculates stock balance THEN the System SHALL sum all IN transactions and subtract all OUT transactions
6. WHEN the System stores tracking type quantities THEN the System SHALL maintain separate counters for batch_quantity, serial_quantity, and general_quantity
7. WHEN the System updates product warehouse stock THEN the System SHALL recalculate total_stock as the sum of batch_quantity, serial_quantity, and general_quantity

### Requirement 7

**User Story:** As an inventory manager, I want the system to support different tracking methods (batch, serial, general), so that I can manage different types of products appropriately.

#### Acceptance Criteria

1. WHEN a product is batch-tracked THEN the System SHALL require batch number for all stock transactions
2. WHEN a product is serial-tracked THEN the System SHALL require unique serial numbers for all stock transactions
3. WHEN a product is batch-tracked and perishable THEN the System SHALL require expiry date for all stock IN transactions
4. WHEN a product is serial-tracked THEN the System SHALL validate that serial numbers are unique across the system
5. WHEN a product is general-tracked THEN the System SHALL not require batch or serial information
6. WHEN the System receives batch-tracked items THEN the System SHALL increment batch_quantity in product warehouse stock
7. WHEN the System receives serial-tracked items THEN the System SHALL increment serial_quantity in product warehouse stock
8. WHEN the System receives general-tracked items THEN the System SHALL increment general_quantity in product warehouse stock

### Requirement 8

**User Story:** As a developer, I want clear service methods for stock operations, so that stock management is consistent across all features.

#### Acceptance Criteria

1. WHEN the System needs to add a stock card entry THEN the System SHALL use StockCardService.addStockCard() method
2. WHEN the System needs to update stock on receive THEN the System SHALL use ProductWarehouseStockService.updateStockOnReceive() method
3. WHEN the System needs to decrement stock THEN the System SHALL use ProductWarehouseStockService.decrementStockOnIssue() method
4. WHEN the System needs to recalculate stock THEN the System SHALL use ProductWarehouseStockService.recalculateStock() method
5. WHEN the System calls addStockCard() THEN the System SHALL wrap the call with firstValueFrom() to convert Observable to Promise
6. WHEN the System processes stock transactions THEN the System SHALL use async/await pattern for sequential operations
7. WHEN the System validates stock availability THEN the System SHALL check product_warehouse_stock before allowing OUT transactions
