# Implementation Plan - Stock Opname Tracking Enhancement

## Overview

This implementation plan adds full batch and serial tracking support to Stock Opname system. Tasks are organized to build incrementally, starting with database and service layer, then UI, and finally integration.

---

## Tasks

- [ ] 1. Database schema enhancement

  - Create stock_opname_batch_items table
  - Create stock_opname_serial_items table
  - Add tracking fields to stock_opnames and stock_opname_items tables
  - Add indexes for efficient querying
  - Increment database version from 4 to 5
  - Test migration with sample data
  - _Requirements: 9.1, 9.2_

- [ ] 2. Enhance StockOpnameService with batch tracking for opname creation

  - [ ] 2.1 Implement loadBatchesForOpname() method

    - Query product_batches table by product_id and warehouse_id
    - Filter by is_active = true and quantity > 0
    - Calculate is_expired and days_to_expiry
    - Return OpnameBatchItem array
    - _Requirements: 1.1, 5.1, 7.1_

  - [ ] 2.2 Enhance createStockOpname() for batch-tracked products

    - Detect batch-tracked products
    - Call loadBatchesForOpname() for each batch product
    - Create opname_batch_items records with system_quantity
    - Set physical_quantity = 0 initially
    - Store batch_number and batch_id references
    - _Requirements: 1.1, 1.4_

  - [ ]\* 2.3 Write property test for batch opname creation
    - **Property 1: Batch loading for opname**
    - **Property 3: Batch reference storage**
    - **Property 19: Batch quantity sum validation**
    - **Validates: Requirements 1.1, 1.4, 5.1, 5.4**

- [ ] 3. Enhance StockOpnameService with serial tracking for opname creation

  - [ ] 3.1 Implement loadSerialsForOpname() method

    - Query product_serials table by product_id and warehouse_id
    - Filter by status = IN_STOCK
    - Return OpnameSerialItem array
    - _Requirements: 2.1, 5.2_

  - [ ] 3.2 Enhance createStockOpname() for serial-tracked products

    - Detect serial-tracked products
    - Call loadSerialsForOpname() for each serial product
    - Create opname_serial_items records
    - Set found = false initially
    - Store serial_number and serial_id references
    - _Requirements: 2.1, 2.4_

  - [ ]\* 3.3 Write property test for serial opname creation
    - **Property 7: Serial loading for opname**
    - **Property 9: Serial reference storage**
    - **Property 20: Serial count validation**
    - **Validates: Requirements 2.1, 2.4, 5.2, 5.5**

- [ ] 4. Implement physical count update for batch tracking

  - [ ] 4.1 Implement updateBatchPhysicalCount() method

    - Update physical_quantity for specific batch item
    - Calculate difference = physical_quantity - system_quantity
    - Update opname total_discrepancy and batch_discrepancy
    - _Requirements: 1.2, 1.3_

  - [ ] 4.2 Add validation for batch physical count

    - Validate physical_quantity >= 0
    - Warn if difference > 50% of system_quantity
    - Require notes for large discrepancies
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ]\* 4.3 Write property test for batch difference calculation
    - **Property 2: Batch difference calculation**
    - **Property 27: Auto-calculation on physical count input**
    - **Validates: Requirements 1.3, 8.3**

- [ ] 5. Implement physical count update for serial tracking

  - [ ] 5.1 Implement markSerialAsFound() method

    - Update found flag for specific serial item
    - Calculate found_count and missing_count
    - Update opname total_discrepancy and serial_discrepancy
    - _Requirements: 2.2, 2.3_

  - [ ] 5.2 Add validation for serial marking

    - Require notes when marking serial as not found
    - Warn if all serials marked as not found
    - Require manager approval for all missing
    - _Requirements: 12.4, 12.5_

  - [ ]\* 5.3 Write property test for serial count calculation
    - **Property 8: Serial found/missing count calculation**
    - **Validates: Requirements 2.3**

- [ ] 6. Checkpoint - Ensure all opname creation tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement batch opname approval logic

  - [ ] 7.1 Implement approveBatchOpnameItem() method

    - For each batch with difference != 0:
      - Create ADJUSTMENT stock card with batch reference
      - Update batch quantity in product_batches table
      - Set is_active = false if physical_quantity = 0
    - Update batch_quantity in product_warehouse_stock
    - _Requirements: 1.5, 1.6, 1.7_

  - [ ] 7.2 Add transaction handling for batch approval

    - Wrap all batch updates in Dexie transaction
    - Rollback on any failure
    - Validate total_stock invariant after updates
    - _Requirements: 6.7, 9.3, 9.4_

  - [ ]\* 7.3 Write property test for batch approval
    - **Property 4: Batch adjustment creation on approval**
    - **Property 5: Batch quantity update on approval**
    - **Property 6: Batch deactivation when depleted**
    - **Validates: Requirements 1.5, 1.6, 1.7**

- [ ] 8. Implement serial opname approval logic

  - [ ] 8.1 Implement approveSerialOpnameItem() method

    - For each serial marked as not found:
      - Update serial status to LOST in product_serials table
      - Create ADJUSTMENT stock card with serial reference
    - Update serial_quantity in product_warehouse_stock
    - _Requirements: 2.5, 2.6_

  - [ ] 8.2 Add support for adding new serials during opname

    - Allow adding serial numbers found but not in system
    - Create new serial records with status IN_STOCK
    - Update serial_quantity accordingly
    - _Requirements: 2.7_

  - [ ]\* 8.3 Write property test for serial approval
    - **Property 10: Serial status update on approval**
    - **Property 11: Serial adjustment creation on approval**
    - **Property 12: New serial addition**
    - **Validates: Requirements 2.5, 2.6, 2.7**

- [ ] 9. Implement general tracking opname approval logic

  - [ ] 9.1 Implement approveGeneralOpnameItem() method

    - If difference != 0:
      - Create ADJUSTMENT stock card with difference
      - Update general_quantity in product_warehouse_stock
    - If difference = 0, skip adjustment
    - _Requirements: 3.5, 3.6, 3.7_

  - [ ]\* 9.2 Write property test for general approval
    - **Property 16: General adjustment creation on approval**
    - **Property 17: General quantity update on approval**
    - **Property 18: No adjustment when no difference**
    - **Validates: Requirements 3.5, 3.6, 3.7**

- [ ] 10. Enhance approveStockOpname() with tracking type routing

  - [ ] 10.1 Implement tracking type detection and routing

    - For each opname item, detect tracking_type
    - Route to approveBatchOpnameItem(), approveSerialOpnameItem(), or approveGeneralOpnameItem()
    - Update product_warehouse_stock by tracking type
    - Create stock cards with proper references
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 10.2 Implement total_stock invariant validation

    - After all approvals, verify total_stock = batch_quantity + serial_quantity + general_quantity
    - Throw error if invariant violated
    - Trigger rollback on validation failure
    - _Requirements: 6.6, 9.5_

  - [ ]\* 10.3 Write property test for approval process
    - **Property 22: Product warehouse stock update by tracking type**
    - **Property 23: Stock card creation with proper references**
    - **Property 24: Total stock invariant after approval**
    - **Property 25: Atomic transaction on approval**
    - **Validates: Requirements 6.4, 6.5, 6.6, 9.3, 9.4, 9.5**

- [ ] 11. Checkpoint - Ensure all approval tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Implement stock recalculation logic

  - [ ] 12.1 Implement recalculateSystemStock() method

    - Rebuild batch quantities from product_batches table
    - Rebuild serial quantities from product_serials table (count IN_STOCK)
    - Rebuild general quantities from stock_cards
    - Update product_warehouse_stock with recalculated values
    - Validate invariants after recalculation
    - _Requirements: 5.7_

  - [ ]\* 12.2 Write property test for recalculation
    - **Property 21: Stock recalculation from source**
    - **Validates: Requirements 5.7**

- [ ] 13. Implement opname reversal logic

  - [ ] 13.1 Implement reverseOpnameApproval() method

    - Create reversal stock cards (opposite of original adjustments)
    - Restore batch quantities to pre-approval values
    - Restore serial statuses to pre-approval values
    - Restore product_warehouse_stock to pre-approval values
    - Set opname status back to COMPLETED
    - _Requirements: 9.7_

  - [ ]\* 13.2 Write property test for reversal
    - **Property 30: Opname reversal restores state**
    - **Validates: Requirements 9.7**

- [ ] 14. Implement validation methods

  - [ ] 14.1 Implement validateOpnameReadyForApproval() method

    - Check all items have physical count entered
    - Check warehouse_id consistency across all items
    - Check tracking_type matches product configuration
    - Return validation result with error messages
    - _Requirements: 8.7, 9.1, 9.2_

  - [ ] 14.2 Implement validation for large discrepancies

    - Warn if any item has difference > 50% of system stock
    - Require confirmation for large discrepancies
    - Require notes explaining the discrepancy
    - _Requirements: 12.2, 12.3_

  - [ ]\* 14.3 Write property test for validation
    - **Property 28: Warehouse consistency validation**
    - **Property 29: Tracking type consistency validation**
    - **Validates: Requirements 9.1, 9.2**

- [ ] 15. Implement workflow and status management

  - [ ] 15.1 Implement status transition logic

    - Allow DRAFT → IN_PROGRESS → COMPLETED → APPROVED
    - Prevent edits when status = APPROVED
    - Allow edits when status = DRAFT or IN_PROGRESS
    - Validate status transitions
    - _Requirements: 10.1-10.7_

  - [ ] 15.2 Implement item management based on status

    - Allow add/remove items when status = DRAFT or IN_PROGRESS
    - Prevent add/remove when status = COMPLETED or APPROVED
    - Recalculate totals when items added/removed
    - _Requirements: 11.1, 11.2, 11.7_

  - [ ]\* 15.3 Write property test for workflow
    - **Property 31: Status transition rules**
    - **Property 32: Item management based on status**
    - **Validates: Requirements 10.1-10.7, 11.1, 11.2, 11.7**

- [ ] 16. Checkpoint - Ensure all service layer tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Enhance UI component for batch tracking

  - [ ] 17.1 Add batch display to opname form

    - Display batch list for batch-tracked products
    - Show batch_number, expiry_date, system_quantity
    - Add input field for physical_quantity per batch
    - Highlight expired batches (red) and near-expiry batches (yellow)
    - _Requirements: 1.1, 1.2, 7.1, 7.2_

  - [ ] 17.2 Implement batch sorting and filtering

    - Allow sorting by expiry_date, batch_number, quantity
    - Allow filtering by expiry date range
    - Allow filtering by expired/near-expiry status
    - _Requirements: 7.3, 7.4_

  - [ ] 17.3 Add batch auto-calculation
    - Auto-calculate difference when physical_quantity changed
    - Update total_discrepancy and batch_discrepancy
    - Show summary (total counted, total difference)
    - _Requirements: 1.3, 8.3, 8.6_

- [ ] 18. Enhance UI component for serial tracking

  - [ ] 18.1 Add serial display to opname form

    - Display serial list for serial-tracked products
    - Show serial_number with checkbox for found/not found
    - Allow marking multiple serials at once
    - Show found count and missing count
    - _Requirements: 2.1, 2.2, 8.2_

  - [ ] 18.2 Implement barcode scanner support

    - Auto-mark serial as found when scanned
    - Show visual feedback for successful scan
    - Handle duplicate scans gracefully
    - _Requirements: 8.5_

  - [ ] 18.3 Add serial auto-calculation
    - Auto-calculate found/missing counts when checkbox toggled
    - Update total_discrepancy and serial_discrepancy
    - Show summary (total found, total missing)
    - _Requirements: 2.3, 8.4, 8.6_

- [ ] 19. Implement conditional display logic

  - [ ] 19.1 Create showBatchDetails() method

    - Return true if product is batch-tracked
    - Load batches when true
    - Show batch section in UI
    - _Requirements: 1.1_

  - [ ] 19.2 Create showSerialDetails() method

    - Return true if product is serial-tracked
    - Load serials when true
    - Show serial section in UI
    - _Requirements: 2.1_

  - [ ] 19.3 Update form template with conditional sections
    - Show batch section when showBatchDetails() returns true
    - Show serial section when showSerialDetails() returns true
    - Show simple quantity input for general tracking
    - _Requirements: 3.1, 3.2_

- [ ] 20. Enhance opname detail and reporting views

  - [ ] 20.1 Add batch/serial information to opname detail

    - Display batch details (batch_number, expiry_date, system_qty, physical_qty, difference)
    - Display serial details (serial_number, found/not found status)
    - Show discrepancy summary by tracking type
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 20.2 Enhance opname export functionality

    - Include batch details in export
    - Include serial details in export
    - Format for readability in Excel/CSV
    - _Requirements: 4.4_

  - [ ] 20.3 Add filtering by batch/serial
    - Add batch_number filter to opname list
    - Add serial_number filter to opname list
    - Display filtered results
    - _Requirements: 4.5, 4.6_

- [ ] 21. Implement validation UI feedback

  - [ ] 21.1 Add validation warnings for large discrepancies

    - Show warning icon when difference > 50%
    - Require confirmation before saving
    - Require notes field for explanation
    - _Requirements: 12.2, 12.3_

  - [ ] 21.2 Add validation warnings for expired batches

    - Show warning when expired batch has physical_count > 0
    - Require confirmation and notes
    - Suggest marking as DAMAGED
    - _Requirements: 7.7, 12.6_

  - [ ] 21.3 Add validation warnings for all serials missing
    - Show warning when all serials marked as not found
    - Require manager approval
    - Require detailed notes
    - _Requirements: 12.5_

- [ ] 22. Implement approval workflow UI

  - [ ] 22.1 Add pre-approval validation

    - Check all items have physical count
    - Check no validation errors
    - Show summary of adjustments to be made
    - Require confirmation before approval
    - _Requirements: 8.7_

  - [ ] 22.2 Add approval progress indicator

    - Show progress bar during approval
    - Display which items are being processed
    - Show success/error messages per item
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 22.3 Add post-approval summary
    - Show total adjustments made
    - Show stock cards created
    - Show updated stock levels
    - Provide link to view stock cards
    - _Requirements: 4.7_

- [ ] 23. Final checkpoint - Integration testing

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 24. Documentation and cleanup
  - Update JSDoc comments for all new methods
  - Add inline code comments for complex logic
  - Update README with batch/serial opname features
  - Create user guide for warehouse staff

---

## Notes

- Tasks marked with `*` are optional (property tests)
- Each task references specific requirements for traceability
- Checkpoints ensure quality at key milestones
- UI tasks come after service layer is complete and tested
- Integration testing validates end-to-end flows

## Estimated Timeline

- **Week 1:** Tasks 1-6 (Database + Service Layer for Creation)
- **Week 2:** Tasks 7-16 (Service Layer for Approval + Validation)
- **Week 3:** Tasks 17-22 (UI Enhancement + Workflow)
- **Week 4:** Tasks 23-24 (Integration Testing + Documentation)

**Total:** 4 weeks for full implementation
