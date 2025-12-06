# Implementation Plan - Stock Movement Tracking Enhancement

## Overview

This implementation plan adds full batch and serial tracking support to Stock Movement system. Tasks are organized to build incrementally, starting with database and service layer, then UI, and finally integration.

---

## Tasks

- [x] 1. Database schema enhancement

  - Add new fields to stock_movements, product_batches, product_serials tables
  - Add indexes for efficient querying
  - Increment database version from 3 to 4
  - Test migration with sample data
  - _Requirements: 10.1, 10.2_

- [x] 2. Enhance StockMovementService with batch tracking for IN movements

  - [x] 2.1 Implement createBatchRecord() method

    - Create or update batch in product_batches table
    - Handle existing batch (increment quantity)
    - Validate batch number format
    - Validate expiry date for perishable products
    - _Requirements: 1.2, 1.5, 1.6, 1.7_

  - [x] 2.2 Enhance createStockMovement() for batch IN

    - Detect batch-tracked products
    - Call createBatchRecord() when batch data provided
    - Update batch_quantity in product_warehouse_stock
    - Add batch_number to stock card
    - _Requirements: 1.2, 1.3, 1.4_

  - [ ]\* 2.3 Write property test for batch IN movement
    - **Property 1: Batch IN movement creates batch record**
    - **Property 2: Batch IN movement increments batch quantity**
    - **Property 5: Batch IN with existing batch increments quantity**
    - **Property 35: Perishable product requires expiry date**
    - **Validates: Requirements 1.2, 1.3, 1.5, 1.6**

- [x] 3. Enhance StockMovementService with serial tracking for IN movements

  - [x] 3.1 Implement createSerialRecords() method

    - Create serial records in product_serials table
    - Set status to IN_STOCK
    - Validate serial uniqueness
    - Validate serial format
    - _Requirements: 2.2, 2.5, 2.7_

  - [x] 3.2 Enhance createStockMovement() for serial IN

    - Detect serial-tracked products
    - Validate quantity matches serial count
    - Call createSerialRecords() when serial data provided
    - Update serial_quantity in product_warehouse_stock
    - Add serial_numbers to stock card
    - _Requirements: 2.2, 2.3, 2.4, 2.6_

  - [ ]\* 3.3 Write property test for serial IN movement
    - **Property 3: Serial IN movement creates serial records**
    - **Property 4: Serial IN movement increments serial quantity**
    - **Property 6: Serial uniqueness validation**
    - **Property 7: Quantity matches serial count**
    - **Validates: Requirements 2.2, 2.3, 2.5, 2.6**

- [x] 4. Enhance StockMovementService with batch tracking for OUT movements

  - [x] 4.1 Implement validateBatchAvailability() method

    - Check batch exists and is active
    - Validate sufficient quantity available
    - Return clear error messages
    - _Requirements: 3.2, 3.7_

  - [x] 4.2 Implement updateBatchQuantity() method

    - Decrement batch quantity
    - Set is_active = false when quantity reaches 0
    - Update updated_at timestamp
    - _Requirements: 3.3, 3.6_

  - [x] 4.3 Enhance createStockMovement() for batch OUT

    - Validate batch availability before operation
    - Call updateBatchQuantity() to decrement
    - Update batch_quantity in product_warehouse_stock
    - Add batch_number to stock card
    - _Requirements: 3.3, 3.4, 3.5_

  - [ ]\* 4.4 Write property test for batch OUT movement
    - **Property 8: Batch OUT movement decrements batch quantity**
    - **Property 9: Batch OUT movement decrements batch_quantity in stock**
    - **Property 12: Batch deactivation when depleted**
    - **Property 13: Batch availability validation**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.6, 3.7**

- [x] 5. Enhance StockMovementService with serial tracking for OUT movements

  - [x] 5.1 Implement validateSerialAvailability() method

    - Check all serials exist and are IN_STOCK
    - Validate serials belong to correct warehouse
    - Return clear error messages
    - _Requirements: 4.2, 4.7_

  - [x] 5.2 Implement updateSerialStatus() method

    - Update serial status to SOLD
    - Update updated_at timestamp
    - Handle multiple serials in batch
    - _Requirements: 4.3_

  - [x] 5.3 Enhance createStockMovement() for serial OUT

    - Validate serial availability and status
    - Validate quantity matches serial count
    - Call updateSerialStatus() to mark as SOLD
    - Update serial_quantity in product_warehouse_stock
    - Add serial_numbers to stock card
    - _Requirements: 4.3, 4.4, 4.5, 4.6_

  - [ ]\* 5.4 Write property test for serial OUT movement
    - **Property 10: Serial OUT movement updates serial status**
    - **Property 11: Serial OUT movement decrements serial_quantity in stock**
    - **Property 14: Serial status validation**
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.7**

- [ ] 6. Checkpoint - Ensure all IN/OUT tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Enhance StockMovementService with batch tracking for TRANSFER movements

  - [x] 7.1 Implement transferBatch() method

    - Decrement batch quantity in source warehouse
    - Create or increment batch in destination warehouse
    - Maintain same batch_number and expiry_date
    - Set source batch is_active = false if quantity reaches 0
    - _Requirements: 5.2, 5.3, 5.7_

  - [x] 7.2 Enhance createStockMovement() for batch TRANSFER

    - Validate batch availability in source
    - Call transferBatch() to move batch
    - Update batch_quantity in both warehouses
    - Create 2 stock cards (OUT + IN) with batch reference
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [ ]\* 7.3 Write property test for batch TRANSFER
    - **Property 15: TRANSFER batch source decrement**
    - **Property 16: TRANSFER batch destination increment**
    - **Property 17: TRANSFER batch updates both warehouses**
    - **Property 21: TRANSFER creates two stock cards**
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.5, 5.7**

- [x] 8. Enhance StockMovementService with serial tracking for TRANSFER movements

  - [x] 8.1 Implement transferSerials() method

    - Update warehouse_id on serial records
    - Maintain IN_STOCK status
    - Update updated_at timestamp
    - _Requirements: 6.2, 6.5_

  - [x] 8.2 Enhance createStockMovement() for serial TRANSFER

    - Validate serial availability and status in source
    - Validate quantity matches serial count
    - Call transferSerials() to update warehouse
    - Update serial_quantity in both warehouses
    - Create 2 stock cards (OUT + IN) with serial reference
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ]\* 8.3 Write property test for serial TRANSFER
    - **Property 18: TRANSFER serial warehouse update**
    - **Property 19: TRANSFER serial updates both warehouses**
    - **Property 20: TRANSFER serial maintains IN_STOCK status**
    - **Validates: Requirements 6.2, 6.3, 6.5**

- [x] 9. Enhance StockMovementService with batch tracking for ADJUSTMENT movements

  - [x] 9.1 Implement batch ADJUSTMENT logic

    - Handle positive adjustment (increment batch quantity)
    - Handle negative adjustment (decrement batch quantity)
    - Validate negative adjustment doesn't exceed available quantity
    - Set is_active = false when quantity reaches 0
    - _Requirements: 7.2, 7.3, 7.6, 7.7_

  - [x] 9.2 Enhance adjustStock() for batch tracking

    - Detect batch-tracked products
    - Call batch ADJUSTMENT logic
    - Update batch_quantity in product_warehouse_stock
    - Create stock card with ADJUSTMENT type and batch reference
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

  - [ ]\* 9.3 Write property test for batch ADJUSTMENT
    - **Property 22: Positive ADJUSTMENT increments batch quantity**
    - **Property 23: Negative ADJUSTMENT decrements batch quantity**
    - **Validates: Requirements 7.2, 7.3, 7.6, 7.7**

- [x] 10. Enhance StockMovementService with serial tracking for ADJUSTMENT movements

  - [x] 10.1 Implement serial ADJUSTMENT logic

    - Handle positive adjustment (create new serial records)
    - Handle negative adjustment (update serial status to DAMAGED/LOST)
    - Validate serial uniqueness for positive adjustment
    - _Requirements: 8.3, 8.4, 8.7_

  - [x] 10.2 Enhance adjustStock() for serial tracking

    - Detect serial-tracked products
    - Call serial ADJUSTMENT logic
    - Update serial_quantity in product_warehouse_stock
    - Create stock card with ADJUSTMENT type and serial reference
    - _Requirements: 8.3, 8.4, 8.5, 8.6_

  - [ ]\* 10.3 Write property test for serial ADJUSTMENT
    - **Property 24: Positive ADJUSTMENT creates serial records**
    - **Property 25: Negative ADJUSTMENT updates serial status**
    - **Validates: Requirements 8.3, 8.4, 8.7**

- [x] 11. Implement general tracking support

  - [x] 11.1 Ensure general-tracked products work correctly

    - Verify no batch/serial fields required
    - Update only general_quantity in product_warehouse_stock
    - Create stock cards without batch/serial reference
    - Validate total_stock availability for OUT
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.7_

  - [ ]\* 11.2 Write property test for general tracking
    - **Property 26: General tracking updates general_quantity only**
    - **Property 27: General stock availability validation**
    - **Property 29: Stock card creation without tracking reference**
    - **Validates: Requirements 9.2, 9.3, 9.4, 9.7**

- [ ] 12. Checkpoint - Ensure all service layer tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement data integrity and transaction handling

  - [ ] 13.1 Wrap all movement operations in Dexie transactions

    - Use transaction API for atomic updates
    - Rollback on any table update failure
    - Log errors for debugging
    - _Requirements: 10.1, 10.2_

  - [ ] 13.2 Implement total_stock invariant validation

    - After every movement, verify total_stock = batch_quantity + serial_quantity + general_quantity
    - Throw error if invariant violated
    - _Requirements: 10.3_

  - [ ] 13.3 Implement tracking type validation

    - Validate batch data only for batch-tracked products
    - Validate serial data only for serial-tracked products
    - Reject mismatched tracking types
    - _Requirements: 10.4_

  - [ ] 13.4 Implement movement reversal logic

    - Create reverseMovement() method
    - Restore stock quantities, batch quantities, serial statuses
    - Create reversal stock cards
    - _Requirements: 10.5_

  - [ ] 13.5 Implement low stock notification trigger

    - Check if total_stock < reorder_point after OUT/ADJUSTMENT
    - Trigger notification if threshold crossed
    - _Requirements: 10.7_

  - [ ]\* 13.6 Write property tests for data integrity
    - **Property 30: Total stock invariant**
    - **Property 31: Atomic transaction updates**
    - **Property 32: Tracking type validation**
    - **Property 33: Movement reversal restores state**
    - **Property 34: Low stock notification trigger**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.7**

- [x] 14. Enhance UI component for batch tracking

  - [x] 14.1 Add batch input fields to form

    - Add batch_number input field
    - Add expiry_date datepicker
    - Show/hide based on product tracking type and movement type
    - _Requirements: 1.1_

  - [x] 14.2 Add batch selection dropdown for OUT/TRANSFER/ADJUSTMENT

    - Load available batches from warehouse
    - Display batch_number, expiry_date, quantity
    - Filter by is_active = true and quantity > 0
    - _Requirements: 3.1, 5.1, 7.1_

  - [x] 14.3 Implement batch input validation
    - Validate batch_number format
    - Validate expiry_date is future date
    - Validate expiry_date required for perishable products
    - Show clear error messages
    - _Requirements: 1.6, 1.7, 12.1, 12.2_

- [x] 15. Enhance UI component for serial tracking

  - [x] 15.1 Add serial input fields to form

    - Add serial_numbers textarea or chips input
    - Parse comma-separated or line-separated serials
    - Show/hide based on product tracking type and movement type
    - _Requirements: 2.1_

  - [x] 15.2 Add serial multiselect for OUT/TRANSFER/ADJUSTMENT

    - Load available serials from warehouse
    - Display serial_number and status
    - Filter by status = IN_STOCK
    - Allow multiple selection
    - _Requirements: 4.1, 6.1, 8.2_

  - [x] 15.3 Implement serial input validation
    - Validate serial_number format
    - Validate quantity matches serial count
    - Validate serial uniqueness
    - Show clear error messages
    - _Requirements: 2.6, 2.7, 12.3, 12.4, 12.5_

- [x] 16. Implement conditional field display logic

  - [x] 16.1 Create showBatchInput() method

    - Return true if product is batch-tracked
    - Return true for IN (always allow input)
    - Return true for OUT/TRANSFER/ADJUSTMENT (show selection)
    - _Requirements: 1.1, 3.1, 5.1, 7.1_

  - [x] 16.2 Create showSerialInput() method

    - Return true if product is serial-tracked
    - Return true for IN (always allow input)
    - Return true for OUT/TRANSFER/ADJUSTMENT (show selection)
    - _Requirements: 2.1, 4.1, 6.1, 8.1_

  - [x] 16.3 Update form template with \*ngIf directives
    - Show batch fields when showBatchInput() returns true
    - Show serial fields when showSerialInput() returns true
    - Hide fields for general-tracked products
    - _Requirements: 9.1_

- [x] 17. Enhance movement list and detail views

  - [x] 17.1 Add batch/serial columns to movement table

    - Display batch_number in table column
    - Display serial_numbers (truncated) in table column
    - Show tooltip with full serial list on hover
    - _Requirements: 11.1_

  - [x] 17.2 Enhance movement detail modal

    - Display complete batch information (batch_number, expiry_date, quantity)
    - Display complete serial information (serial_numbers, status)
    - Format dates and quantities nicely
    - _Requirements: 11.2, 11.3_

  - [x] 17.3 Add batch/serial reference to stock card display
    - Show batch_number in stock card entries
    - Show serial_numbers in stock card entries
    - Link to batch/serial detail views if available
    - _Requirements: 11.4_

- [x] 18. Implement filtering and search

  - [x] 18.1 Add batch filter to movement list

    - Add batch_number filter input
    - Query movements by batch_number
    - Display filtered results
    - _Requirements: 11.5_

  - [x] 18.2 Add serial filter to movement list

    - Add serial_number filter input
    - Query movements by serial_numbers (contains)
    - Display filtered results
    - _Requirements: 11.6_

  - [x] 18.3 Enhance export functionality
    - Include batch_number in exported data
    - Include serial_numbers in exported data
    - Format for readability in Excel/CSV
    - _Requirements: 11.7_

- [ ] 19. Final checkpoint - Integration testing

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 20. Documentation and cleanup
  - Update JSDoc comments for all new methods
  - Add inline code comments for complex logic
  - Update README with batch/serial tracking features
  - Create user guide for warehouse staff

---

## Notes

- Tasks marked with `*` are optional (property tests)
- Each task references specific requirements for traceability
- Checkpoints ensure quality at key milestones
- UI tasks come after service layer is complete and tested
- Integration testing validates end-to-end flows

## Estimated Timeline

- **Week 1:** Tasks 1-6 (Database + Service Layer for IN/OUT)
- **Week 2:** Tasks 7-13 (Service Layer for TRANSFER/ADJUSTMENT + Data Integrity)
- **Week 3:** Tasks 14-18 (UI Enhancement + Filtering)
- **Week 4:** Tasks 19-20 (Integration Testing + Documentation)

**Total:** 4 weeks for full implementation
