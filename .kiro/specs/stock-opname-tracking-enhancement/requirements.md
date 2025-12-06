# Requirements Document - Stock Opname Tracking Enhancement

## Introduction

Sistem Stock Opname saat ini hanya mendukung physical count berdasarkan total quantity per product, tanpa mempertimbangkan batch atau serial tracking. Enhancement ini akan menambahkan full support untuk batch dan serial tracking pada stock opname, sehingga physical count dapat dilakukan per-batch atau per-serial, memberikan audit trail yang lebih akurat dan detail.

## Glossary

- **Stock Opname**: Proses physical counting untuk mencocokkan stok fisik dengan stok sistem
- **Batch Tracking**: Metode tracking stok berdasarkan batch number dan expiry date
- **Serial Tracking**: Metode tracking stok berdasarkan serial number unik per unit
- **General Tracking**: Metode tracking stok tanpa batch atau serial (quantity only)
- **Physical Count**: Jumlah stok yang dihitung secara fisik di warehouse
- **System Stock**: Jumlah stok yang tercatat di sistem
- **Discrepancy**: Selisih antara physical count dan system stock
- **Opname Item**: Record individual product dalam stock opname
- **Warehouse**: Lokasi penyimpanan fisik barang

## Requirements

### Requirement 1

**User Story:** Sebagai warehouse staff, saya ingin melakukan stock opname dengan batch tracking, sehingga saya dapat menghitung physical stock per batch dan mengidentifikasi batch mana yang memiliki discrepancy.

#### Acceptance Criteria

1. WHEN user membuat stock opname untuk product dengan batch tracking THEN sistem SHALL menampilkan list of batches di warehouse tersebut
2. WHEN user melakukan physical count THEN sistem SHALL allow input physical quantity per batch
3. WHEN user menyimpan opname item THEN sistem SHALL calculate difference per batch (physical - system)
4. WHEN user menyimpan opname item THEN sistem SHALL store batch_number dan batch_id dalam opname item record
5. WHEN opname diapprove THEN sistem SHALL create ADJUSTMENT stock card per batch dengan difference
6. WHEN opname diapprove THEN sistem SHALL update batch quantity di product_batches table
7. WHEN batch physical count adalah 0 dan system stock > 0 THEN sistem SHALL set batch is_active = false

### Requirement 2

**User Story:** Sebagai warehouse staff, saya ingin melakukan stock opname dengan serial tracking, sehingga saya dapat verify keberadaan setiap serial number secara fisik.

#### Acceptance Criteria

1. WHEN user membuat stock opname untuk product dengan serial tracking THEN sistem SHALL menampilkan list of serials di warehouse tersebut dengan status IN_STOCK
2. WHEN user melakukan physical count THEN sistem SHALL allow marking serials as found atau not found
3. WHEN user menyimpan opname item THEN sistem SHALL calculate found count dan missing count
4. WHEN user menyimpan opname item THEN sistem SHALL store serial_numbers (found) dan missing_serial_numbers dalam opname item record
5. WHEN opname diapprove THEN sistem SHALL update status serial yang not found menjadi LOST
6. WHEN opname diapprove THEN sistem SHALL create ADJUSTMENT stock card dengan reference ke missing serials
7. WHEN ada serial baru ditemukan (tidak di sistem) THEN sistem SHALL allow adding new serial dengan status IN_STOCK

### Requirement 3

**User Story:** Sebagai warehouse staff, saya ingin melakukan stock opname dengan general tracking, sehingga produk tanpa batch/serial tetap dapat di-opname dengan cara yang sama seperti sekarang.

#### Acceptance Criteria

1. WHEN user membuat stock opname untuk product dengan general tracking THEN sistem SHALL menampilkan single row per product
2. WHEN user melakukan physical count THEN sistem SHALL allow input total physical quantity
3. WHEN user menyimpan opname item THEN sistem SHALL calculate difference (physical - system)
4. WHEN user menyimpan opname item THEN sistem SHALL store physical_stock dan difference tanpa batch/serial reference
5. WHEN opname diapprove THEN sistem SHALL create ADJUSTMENT stock card dengan difference
6. WHEN opname diapprove THEN sistem SHALL update general_quantity di product_warehouse_stock table
7. WHEN difference adalah 0 THEN sistem SHALL not create stock card atau adjustment

### Requirement 4

**User Story:** Sebagai warehouse manager, saya ingin melihat detail discrepancy per batch/serial pada stock opname, sehingga saya dapat mengidentifikasi masalah inventory dengan lebih spesifik.

#### Acceptance Criteria

1. WHEN user melihat opname detail THEN sistem SHALL menampilkan batch information untuk batch-tracked products (batch_number, expiry_date, system_qty, physical_qty, difference)
2. WHEN user melihat opname detail THEN sistem SHALL menampilkan serial information untuk serial-tracked products (serial_number, status, found/not found)
3. WHEN user melihat opname summary THEN sistem SHALL menampilkan total discrepancy per tracking type (batch, serial, general)
4. WHEN user export opname report THEN sistem SHALL include batch/serial details dalam export
5. WHEN user filter opname by batch THEN sistem SHALL return opnames yang memiliki discrepancy pada batch tersebut
6. WHEN user filter opname by serial THEN sistem SHALL return opnames yang memiliki missing serial tersebut
7. WHEN user melihat opname history THEN sistem SHALL show which batches/serials were adjusted

### Requirement 5

**User Story:** Sebagai warehouse staff, saya ingin sistem menghitung system stock per batch/serial secara akurat, sehingga baseline untuk physical count adalah benar.

#### Acceptance Criteria

1. WHEN opname dibuat THEN sistem SHALL query product_batches table untuk mendapatkan system stock per batch
2. WHEN opname dibuat THEN sistem SHALL query product_serials table untuk mendapatkan list of serials dengan status IN_STOCK
3. WHEN opname dibuat THEN sistem SHALL query product_warehouse_stock table untuk mendapatkan total stock per tracking type
4. WHEN opname dibuat THEN sistem SHALL validate bahwa sum of batch quantities = batch_quantity di product_warehouse_stock
5. WHEN opname dibuat THEN sistem SHALL validate bahwa count of IN_STOCK serials = serial_quantity di product_warehouse_stock
6. WHEN validation gagal THEN sistem SHALL show warning dan suggest recalculation
7. WHEN user request recalculation THEN sistem SHALL rebuild stock dari stock_cards dan batch/serial tables

### Requirement 6

**User Story:** Sebagai warehouse staff, saya ingin approval process yang mempertimbangkan tracking type, sehingga adjustment yang dibuat sesuai dengan jenis tracking produk.

#### Acceptance Criteria

1. WHEN opname diapprove untuk batch-tracked product THEN sistem SHALL create ADJUSTMENT per batch dengan difference
2. WHEN opname diapprove untuk serial-tracked product THEN sistem SHALL update serial status untuk missing serials
3. WHEN opname diapprove untuk general-tracked product THEN sistem SHALL create single ADJUSTMENT dengan total difference
4. WHEN opname diapprove THEN sistem SHALL update product_warehouse_stock by tracking type (batch_quantity, serial_quantity, general_quantity)
5. WHEN opname diapprove THEN sistem SHALL create stock cards dengan reference ke opname dan batch/serial
6. WHEN opname diapprove THEN sistem SHALL validate total_stock invariant (total = batch + serial + general)
7. WHEN approval gagal THEN sistem SHALL rollback semua changes dan maintain opname status

### Requirement 7

**User Story:** Sebagai warehouse manager, saya ingin batch expiry information visible during opname, sehingga saya dapat prioritize counting batches yang mendekati expiry.

#### Acceptance Criteria

1. WHEN user melihat batch list dalam opname THEN sistem SHALL display expiry_date untuk setiap batch
2. WHEN user melihat batch list dalam opname THEN sistem SHALL highlight batches yang expired atau mendekati expiry (< 30 days)
3. WHEN user sort batch list THEN sistem SHALL allow sorting by expiry_date
4. WHEN user filter batch list THEN sistem SHALL allow filtering by expiry date range
5. WHEN opname report generated THEN sistem SHALL include expiry information untuk batch-tracked products
6. WHEN batch expired ditemukan THEN sistem SHALL suggest marking as DAMAGED atau disposal
7. WHEN expired batch physical count > 0 THEN sistem SHALL show warning dan require confirmation

### Requirement 8

**User Story:** Sebagai warehouse staff, saya ingin UI yang intuitif untuk input physical count per batch/serial, sehingga proses counting lebih efisien dan akurat.

#### Acceptance Criteria

1. WHEN user melakukan opname untuk batch-tracked product THEN sistem SHALL display batch list dengan input field untuk physical quantity per batch
2. WHEN user melakukan opname untuk serial-tracked product THEN sistem SHALL display serial list dengan checkbox untuk marking found/not found
3. WHEN user input physical quantity THEN sistem SHALL auto-calculate difference dan update total discrepancy
4. WHEN user mark serial as found THEN sistem SHALL update found count dan missing count
5. WHEN user menggunakan barcode scanner THEN sistem SHALL auto-mark serial as found atau increment batch quantity
6. WHEN user complete counting untuk satu product THEN sistem SHALL show summary (total counted, total missing, total discrepancy)
7. WHEN user save opname THEN sistem SHALL validate bahwa semua items sudah di-count (physical_stock diisi)

### Requirement 9

**User Story:** Sebagai system administrator, saya ingin data integrity terjaga pada stock opname operations, sehingga tidak ada data yang inconsistent.

#### Acceptance Criteria

1. WHEN opname disimpan THEN sistem SHALL validate bahwa warehouse_id consistent untuk semua items
2. WHEN opname disimpan THEN sistem SHALL validate bahwa tracking type sesuai dengan product configuration
3. WHEN opname diapprove THEN sistem SHALL update stock_cards, product_warehouse_stock, product_batches, dan product_serials secara atomic
4. WHEN terjadi error pada approval THEN sistem SHALL rollback semua changes
5. WHEN opname diapprove THEN sistem SHALL validate total_stock invariant setelah adjustment
6. WHEN concurrent opnames terjadi THEN sistem SHALL prevent double approval dengan locking mechanism
7. WHEN opname dibatalkan setelah approval THEN sistem SHALL reverse semua adjustments

### Requirement 10

**User Story:** Sebagai warehouse manager, saya ingin opname workflow yang jelas dengan status tracking, sehingga saya dapat monitor progress opname.

#### Acceptance Criteria

1. WHEN opname dibuat THEN sistem SHALL set status = DRAFT
2. WHEN counting dimulai THEN sistem SHALL allow update status ke IN_PROGRESS
3. WHEN counting selesai THEN sistem SHALL allow update status ke COMPLETED
4. WHEN opname diapprove THEN sistem SHALL set status = APPROVED dan record approved_by dan approved_at
5. WHEN opname status = APPROVED THEN sistem SHALL prevent further edits
6. WHEN opname status = DRAFT atau IN_PROGRESS THEN sistem SHALL allow editing items
7. WHEN opname status = COMPLETED THEN sistem SHALL allow approval atau return to IN_PROGRESS

### Requirement 11

**User Story:** Sebagai warehouse staff, saya ingin dapat menambah atau mengurangi items dari opname, sehingga saya dapat adjust scope opname sesuai kebutuhan.

#### Acceptance Criteria

1. WHEN opname status = DRAFT atau IN_PROGRESS THEN sistem SHALL allow adding new products ke opname
2. WHEN opname status = DRAFT atau IN_PROGRESS THEN sistem SHALL allow removing products dari opname
3. WHEN product ditambahkan THEN sistem SHALL load current system stock per batch/serial
4. WHEN product dihapus THEN sistem SHALL recalculate total_products dan total_discrepancy
5. WHEN product dengan batch tracking ditambahkan THEN sistem SHALL load all active batches
6. WHEN product dengan serial tracking ditambahkan THEN sistem SHALL load all IN_STOCK serials
7. WHEN opname status = COMPLETED atau APPROVED THEN sistem SHALL prevent adding/removing items

### Requirement 12

**User Story:** Sebagai warehouse manager, saya ingin validation yang ketat pada physical count input, sehingga data yang masuk selalu valid dan reasonable.

#### Acceptance Criteria

1. WHEN physical quantity diinput THEN sistem SHALL validate bahwa quantity >= 0
2. WHEN physical quantity sangat berbeda dari system stock (> 50% difference) THEN sistem SHALL show warning dan require confirmation
3. WHEN batch physical quantity > system quantity significantly THEN sistem SHALL require notes explaining the increase
4. WHEN serial marked as not found THEN sistem SHALL require notes explaining the loss
5. WHEN all serials marked as not found THEN sistem SHALL show warning dan require manager approval
6. WHEN expired batch has physical count > 0 THEN sistem SHALL require confirmation dan notes
7. WHEN validation gagal THEN sistem SHALL show clear error message dengan actionable guidance
