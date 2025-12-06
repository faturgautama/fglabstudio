# Implementation Plan

- [x] 1. Setup testing infrastructure

  - Install fast-check library for property-based testing
  - Create test helpers and generators for domain objects
  - Setup test database utilities
  - _Requirements: 8.1-8.7_

- [x] 1.1 Install fast-check

  - Run `npm install --save-dev fast-check @types/fast-check`
  - _Requirements: 8.1-8.7_

- [x] 1.2 Create test generators

  - Create `src/test-helpers/generators.ts` with arbitraries for Product, Warehouse, PO, StockMovement, StockOpname
  - Include generators for different tracking types (batch/serial/general)
  - _Requirements: 7.1-7.8_

- [x] 1.3 Create test database utilities

  - Create `src/test-helpers/db-utils.ts` with setup/teardown functions
  - Add helpers for seeding test data
  - _Requirements: 6.1-6.7_

- [x] 2. Verify and fix core stock card functionality

  - Review StockCardService.addStockCard() implementation
  - Ensure firstValueFrom() is used correctly
  - Verify compound index usage
  - _Requirements: 1.1, 3.1, 3.2, 4.1_

- [x] 2.1 Review StockCardService implementation

  - Verify addStockCard() creates entries with all required fields
  - Check running balance calculation logic
  - Ensure warehouse_id is included in all operations
  - _Requirements: 6.1, 6.5_

- [x] 2.2 Write property test for stock card creation

  - **Property 1: Receive creates stock card entries**
  - **Validates: Requirements 1.1**

- [x] 2.3 Write property test for running balance

  - **Property 32: Running balance calculation**
  - **Validates: Requirements 5.4**

- [x] 2.4 Write property test for required fields

  - **Property 34: Stock card required fields**
  - **Validates: Requirements 6.1**

- [x] 3. Verify and fix product warehouse stock functionality

  - Review ProductWarehouseStockService implementation
  - Verify compound index [product_id+warehouse_id] usage
  - Ensure tracking type quantities are maintained separately
  - _Requirements: 1.2, 6.6, 6.7, 7.6-7.8_

- [x] 3.1 Review ProductWarehouseStockService implementation

  - Verify updateStockOnReceive() increments correct quantity field
  - Check decrementStockOnIssue() validates sufficient stock
  - Ensure total_stock calculation is correct
  - _Requirements: 6.6, 6.7_

- [x] 3.2 Write property test for stock increment

  - **Property 2: Receive increments warehouse stock**
  - **Validates: Requirements 1.2**

- [x] 3.3 Write property test for tracking type counters

  - **Property 38: Tracking type counters**
  - **Validates: Requirements 6.6**

- [x] 3.4 Write property test for total stock calculation

  - **Property 39: Total stock calculation**
  - **Validates: Requirements 6.7**

- [x] 3.5 Write property test for batch quantity increment

  - **Property 45: Batch quantity increment**
  - **Validates: Requirements 7.6**

- [x] 3.6 Write property test for serial quantity increment

  - **Property 46: Serial quantity increment**
  - **Validates: Requirements 7.7**

- [x] 3.7 Write property test for general quantity increment

  - **Property 47: General quantity increment**
  - **Validates: Requirements 7.8**

- [ ] 4. Verify and fix Purchase Order receive functionality

  - Review PurchaseOrderService.receivePurchaseOrder() implementation
  - Ensure batch/serial validation works correctly
  - Verify status updates (RECEIVED/PARTIAL)
  - _Requirements: 1.1-1.7_

- [ ] 4.1 Review receive PO implementation

  - Verify batch tracking validation and record creation
  - Check serial tracking validation and record creation
  - Ensure expiry date is stored for perishable items
  - Verify PO status updates correctly
  - _Requirements: 1.3-1.7_

- [ ] 4.2 Write property test for batch tracking validation

  - **Property 3: Batch tracking validation**
  - **Validates: Requirements 1.3**

- [ ] 4.3 Write property test for serial tracking validation

  - **Property 4: Serial tracking validation**
  - **Validates: Requirements 1.4**

- [ ] 4.4 Write property test for expiry date storage

  - **Property 5: Expiry date storage**
  - **Validates: Requirements 1.5**

- [ ] 4.5 Write property test for full receive status

  - **Property 6: Full receive status update**
  - **Validates: Requirements 1.6**

- [ ] 4.6 Write property test for partial receive status

  - **Property 7: Partial receive status update**
  - **Validates: Requirements 1.7**

- [ ] 5. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Verify and fix Purchase Order cancel functionality

  - Review PurchaseOrderService.cancelPurchaseOrder() implementation
  - Ensure stock reversal works correctly
  - Verify batch deactivation and serial status updates
  - _Requirements: 2.1-2.7_

- [ ] 6.1 Review cancel PO implementation

  - Verify OUT stock cards are created to reverse received quantities
  - Check stock decrement logic
  - Ensure batch deactivation works
  - Verify serial status updates to 'RETURNED'
  - Check cancellation reason validation (min 10 chars)
  - Verify idempotence (can't cancel twice)
  - _Requirements: 2.1-2.7_

- [ ] 6.2 Write property test for cancel reversal stock cards

  - **Property 8: Cancel creates reversal stock cards**
  - **Validates: Requirements 2.1**

- [ ] 6.3 Write property test for cancel stock decrement

  - **Property 9: Cancel decrements warehouse stock**
  - **Validates: Requirements 2.2**

- [ ] 6.4 Write property test for batch deactivation

  - **Property 10: Cancel deactivates batches**
  - **Validates: Requirements 2.3**

- [ ] 6.5 Write property test for serial status update

  - **Property 11: Cancel updates serial status**
  - **Validates: Requirements 2.4**

- [ ] 6.6 Write property test for cancel status update

  - **Property 12: Cancel updates PO status**
  - **Validates: Requirements 2.5**

- [ ] 6.7 Write property test for cancel reason validation

  - **Property 13: Cancel reason validation**
  - **Validates: Requirements 2.6**

- [ ] 6.8 Write property test for cancel idempotence

  - **Property 14: Cancel idempotence**
  - **Validates: Requirements 2.7**

- [ ] 7. Verify and fix Stock Movement functionality

  - Review StockMovementService.createStockMovement() implementation
  - Ensure TRANSFER creates two stock cards
  - Verify stock availability validation
  - _Requirements: 3.1-3.7_

- [ ] 7.1 Review stock movement implementation

  - Verify IN movements create stock card and increment stock
  - Check OUT movements create stock card and decrement stock
  - Ensure TRANSFER creates two stock cards (OUT + IN)
  - Verify TRANSFER updates both warehouses correctly
  - Check ADJUSTMENT logic
  - Verify stock availability validation for OUT/TRANSFER
  - Ensure movement number uniqueness
  - _Requirements: 3.1-3.7_

- [ ] 7.2 Write property test for IN movement

  - **Property 15: IN movement creates stock card and increments**
  - **Validates: Requirements 3.1**

- [ ] 7.3 Write property test for OUT movement

  - **Property 16: OUT movement creates stock card and decrements**
  - **Validates: Requirements 3.2**

- [ ] 7.4 Write property test for TRANSFER two stock cards

  - **Property 17: TRANSFER creates two stock cards**
  - **Validates: Requirements 3.3**

- [ ] 7.5 Write property test for TRANSFER warehouse updates

  - **Property 18: TRANSFER updates both warehouses**
  - **Validates: Requirements 3.4**

- [ ] 7.6 Write property test for ADJUSTMENT

  - **Property 19: ADJUSTMENT creates stock card and updates stock**
  - **Validates: Requirements 3.5**

- [ ] 7.7 Write property test for stock availability validation

  - **Property 20: Stock availability validation**
  - **Validates: Requirements 3.6, 8.7**

- [ ] 7.8 Write property test for movement number uniqueness

  - **Property 21: Movement number uniqueness**
  - **Validates: Requirements 3.7**

- [ ] 8. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Verify and fix Stock Opname functionality

  - Review StockOpnameService.approveStockOpname() implementation
  - Ensure adjustment stock cards are created for differences
  - Verify stock reconciliation to physical count
  - _Requirements: 4.1-4.7_

- [ ] 9.1 Review stock opname implementation

  - Verify approval creates ADJUSTMENT stock cards for items with differences
  - Check positive difference increases stock
  - Ensure negative difference decreases stock
  - Verify final stock equals physical count
  - Check opname status update to APPROVED
  - Verify baseline capture on creation
  - Ensure difference calculation is correct
  - _Requirements: 4.1-4.7_

- [ ] 9.2 Write property test for opname adjustment cards

  - **Property 22: Opname approval creates adjustment cards**
  - **Validates: Requirements 4.1**

- [ ] 9.3 Write property test for positive difference

  - **Property 23: Positive difference increases stock**
  - **Validates: Requirements 4.2**

- [ ] 9.4 Write property test for negative difference

  - **Property 24: Negative difference decreases stock**
  - **Validates: Requirements 4.3**

- [ ] 9.5 Write property test for stock reconciliation

  - **Property 25: Opname reconciles to physical count**
  - **Validates: Requirements 4.4**

- [ ] 9.6 Write property test for opname status update

  - **Property 26: Opname approval updates status**
  - **Validates: Requirements 4.5**

- [ ] 9.7 Write property test for baseline capture

  - **Property 27: Opname captures baseline**
  - **Validates: Requirements 4.6**

- [ ] 9.8 Write property test for difference calculation

  - **Property 28: Opname calculates difference**
  - **Validates: Requirements 4.7**

- [ ] 10. Verify stock card query functionality

  - Review StockCardService query methods
  - Ensure ordering by transaction date works
  - Verify warehouse filtering
  - _Requirements: 5.1-5.5_

- [ ] 10.1 Review stock card query implementation

  - Verify getStockCardsByProduct() returns entries ordered by date
  - Check data completeness in query results
  - Ensure warehouse filtering works correctly
  - Verify reference information is included
  - _Requirements: 5.1-5.5_

- [ ] 10.2 Write property test for stock card ordering

  - **Property 29: Stock cards ordered by date**
  - **Validates: Requirements 5.1**

- [ ] 10.3 Write property test for data completeness

  - **Property 30: Stock card data completeness**
  - **Validates: Requirements 5.2**

- [ ] 10.4 Write property test for warehouse filtering

  - **Property 31: Warehouse filtering**
  - **Validates: Requirements 5.3**

- [ ] 10.5 Write property test for reference information

  - **Property 33: Reference information inclusion**
  - **Validates: Requirements 5.5**

- [ ] 11. Verify data integrity and error handling

  - Review error handling across all services
  - Ensure atomic updates of stock_cards and product_warehouse_stock
  - Verify transaction rollback on errors
  - _Requirements: 6.3, 6.4_

- [ ] 11.1 Review error handling implementation

  - Verify atomic updates (both tables updated or neither)
  - Check transaction rollback on errors
  - Ensure descriptive error messages
  - _Requirements: 6.3, 6.4_

- [ ] 11.2 Write property test for atomic updates

  - **Property 35: Atomic table updates**
  - **Validates: Requirements 6.3**

- [ ] 11.3 Write property test for transaction rollback

  - **Property 36: Transaction rollback on error**
  - **Validates: Requirements 6.4**

- [ ] 11.4 Write property test for balance calculation formula

  - **Property 37: Balance calculation formula**
  - **Validates: Requirements 6.5**

- [ ] 12. Verify tracking method requirements

  - Review tracking validation across all services
  - Ensure batch/serial requirements are enforced
  - Verify general tracking has no extra requirements
  - _Requirements: 7.1-7.5_

- [ ] 12.1 Review tracking validation implementation

  - Verify batch tracking requires batch number
  - Check serial tracking requires serial numbers
  - Ensure perishable items require expiry date
  - Verify serial number uniqueness validation
  - Check general tracking has no extra requirements
  - _Requirements: 7.1-7.5_

- [ ] 12.2 Write property test for batch tracking requirement

  - **Property 40: Batch tracking requirement**
  - **Validates: Requirements 7.1**

- [ ] 12.3 Write property test for serial tracking requirement

  - **Property 41: Serial tracking requirement**
  - **Validates: Requirements 7.2**

- [ ] 12.4 Write property test for perishable expiry requirement

  - **Property 42: Perishable expiry requirement**
  - **Validates: Requirements 7.3**

- [ ] 12.5 Write property test for serial uniqueness

  - **Property 43: Serial number uniqueness**
  - **Validates: Requirements 7.4**

- [ ] 12.6 Write property test for general tracking no requirements

  - **Property 44: General tracking no requirements**
  - **Validates: Requirements 7.5**

- [ ] 13. Final Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Update documentation

  - Update service JSDoc comments with examples
  - Document error codes and messages
  - Create developer guide for stock management
  - _Requirements: All_

- [ ] 14.1 Update service documentation

  - Add JSDoc comments to all public methods
  - Include usage examples in comments
  - Document error scenarios
  - _Requirements: All_

- [ ] 14.2 Create developer guide
  - Write guide for implementing new stock transaction types
  - Document testing patterns
  - Include troubleshooting section
  - _Requirements: All_
