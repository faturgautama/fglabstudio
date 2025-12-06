# Requirements Document - Stock Movement Tracking Enhancement

## Introduction

Sistem Stock Movement saat ini sudah memiliki infrastruktur dasar untuk batch dan serial tracking, namun implementasinya belum lengkap. Enhancement ini akan menambahkan full support untuk batch tracking dan serial tracking pada semua tipe stock movement (IN, OUT, TRANSFER, ADJUSTMENT), sehingga konsisten dengan Purchase Order system yang sudah ada.

## Glossary

- **Stock Movement**: Pergerakan stok barang antar warehouse atau perubahan quantity stok
- **Batch Tracking**: Metode tracking stok berdasarkan batch number dan expiry date
- **Serial Tracking**: Metode tracking stok berdasarkan serial number unik per unit
- **General Tracking**: Metode tracking stok tanpa batch atau serial (quantity only)
- **Movement Type**: Jenis pergerakan stok (IN, OUT, TRANSFER, ADJUSTMENT)
- **Product Batch**: Record batch number dengan quantity dan expiry date
- **Product Serial**: Record serial number individual dengan status
- **Warehouse**: Lokasi penyimpanan fisik barang

## Requirements

### Requirement 1

**User Story:** Sebagai warehouse staff, saya ingin melakukan stock IN movement dengan batch tracking, sehingga saya dapat mencatat batch number dan expiry date untuk produk yang masuk.

#### Acceptance Criteria

1. WHEN user memilih product dengan batch tracking untuk IN movement THEN sistem SHALL menampilkan input field untuk batch number dan expiry date
2. WHEN user menyimpan IN movement untuk batch-tracked product THEN sistem SHALL membuat record di product_batches table dengan batch number, expiry date, dan quantity
3. WHEN user menyimpan IN movement untuk batch-tracked product THEN sistem SHALL increment batch_quantity di product_warehouse_stock table
4. WHEN user menyimpan IN movement untuk batch-tracked product THEN sistem SHALL membuat stock card dengan reference ke batch number
5. WHEN batch number sudah ada di warehouse yang sama THEN sistem SHALL menambah quantity pada batch yang existing
6. WHEN product adalah perishable THEN sistem SHALL require expiry date untuk batch tracking
7. WHEN expiry date kurang dari hari ini THEN sistem SHALL menolak input dengan error message

### Requirement 2

**User Story:** Sebagai warehouse staff, saya ingin melakukan stock IN movement dengan serial tracking, sehingga saya dapat mencatat serial numbers untuk produk yang masuk.

#### Acceptance Criteria

1. WHEN user memilih product dengan serial tracking untuk IN movement THEN sistem SHALL menampilkan input field untuk multiple serial numbers
2. WHEN user menyimpan IN movement untuk serial-tracked product THEN sistem SHALL membuat record di product_serials table untuk setiap serial number dengan status IN_STOCK
3. WHEN user menyimpan IN movement untuk serial-tracked product THEN sistem SHALL increment serial_quantity di product_warehouse_stock table
4. WHEN user menyimpan IN movement untuk serial-tracked product THEN sistem SHALL membuat stock card dengan reference ke serial numbers
5. WHEN serial number sudah ada di sistem THEN sistem SHALL menolak input dengan error message
6. WHEN quantity tidak sama dengan jumlah serial numbers THEN sistem SHALL menolak input dengan error message
7. WHEN serial number format tidak valid THEN sistem SHALL menolak input dengan error message

### Requirement 3

**User Story:** Sebagai warehouse staff, saya ingin melakukan stock OUT movement dengan batch tracking, sehingga saya dapat memilih batch mana yang akan dikeluarkan.

#### Acceptance Criteria

1. WHEN user memilih product dengan batch tracking untuk OUT movement THEN sistem SHALL menampilkan dropdown available batches di warehouse tersebut
2. WHEN user memilih batch untuk OUT movement THEN sistem SHALL validate bahwa batch quantity mencukupi
3. WHEN user menyimpan OUT movement untuk batch-tracked product THEN sistem SHALL decrement quantity pada batch yang dipilih
4. WHEN user menyimpan OUT movement untuk batch-tracked product THEN sistem SHALL decrement batch_quantity di product_warehouse_stock table
5. WHEN user menyimpan OUT movement untuk batch-tracked product THEN sistem SHALL membuat stock card dengan reference ke batch number
6. WHEN batch quantity menjadi 0 setelah OUT THEN sistem SHALL set is_active = false pada batch tersebut
7. WHEN batch quantity tidak mencukupi THEN sistem SHALL menolak transaksi dengan error message

### Requirement 4

**User Story:** Sebagai warehouse staff, saya ingin melakukan stock OUT movement dengan serial tracking, sehingga saya dapat memilih serial numbers mana yang akan dikeluarkan.

#### Acceptance Criteria

1. WHEN user memilih product dengan serial tracking untuk OUT movement THEN sistem SHALL menampilkan multiselect available serials di warehouse tersebut
2. WHEN user memilih serials untuk OUT movement THEN sistem SHALL validate bahwa semua serial berstatus IN_STOCK
3. WHEN user menyimpan OUT movement untuk serial-tracked product THEN sistem SHALL update status serial menjadi SOLD
4. WHEN user menyimpan OUT movement untuk serial-tracked product THEN sistem SHALL decrement serial_quantity di product_warehouse_stock table
5. WHEN user menyimpan OUT movement untuk serial-tracked product THEN sistem SHALL membuat stock card dengan reference ke serial numbers
6. WHEN quantity tidak sama dengan jumlah serial numbers yang dipilih THEN sistem SHALL menolak input dengan error message
7. WHEN ada serial yang bukan IN_STOCK THEN sistem SHALL menolak transaksi dengan error message

### Requirement 5

**User Story:** Sebagai warehouse staff, saya ingin melakukan TRANSFER movement dengan batch tracking, sehingga batch dapat berpindah antar warehouse dengan benar.

#### Acceptance Criteria

1. WHEN user melakukan TRANSFER untuk batch-tracked product THEN sistem SHALL menampilkan available batches dari warehouse source
2. WHEN user menyimpan TRANSFER untuk batch-tracked product THEN sistem SHALL decrement batch quantity di warehouse source
3. WHEN user menyimpan TRANSFER untuk batch-tracked product THEN sistem SHALL create atau increment batch di warehouse destination dengan batch number dan expiry date yang sama
4. WHEN user menyimpan TRANSFER untuk batch-tracked product THEN sistem SHALL update batch_quantity di kedua warehouse
5. WHEN user menyimpan TRANSFER untuk batch-tracked product THEN sistem SHALL membuat 2 stock cards (OUT dari source, IN ke destination) dengan reference ke batch
6. WHEN batch quantity di source tidak mencukupi THEN sistem SHALL menolak transaksi dengan error message
7. WHEN batch di source menjadi 0 setelah TRANSFER THEN sistem SHALL set is_active = false pada batch di source

### Requirement 6

**User Story:** Sebagai warehouse staff, saya ingin melakukan TRANSFER movement dengan serial tracking, sehingga serial dapat berpindah antar warehouse dengan benar.

#### Acceptance Criteria

1. WHEN user melakukan TRANSFER untuk serial-tracked product THEN sistem SHALL menampilkan available serials dari warehouse source
2. WHEN user menyimpan TRANSFER untuk serial-tracked product THEN sistem SHALL update warehouse_id pada serial records yang dipilih
3. WHEN user menyimpan TRANSFER untuk serial-tracked product THEN sistem SHALL update serial_quantity di kedua warehouse
4. WHEN user menyimpan TRANSFER untuk serial-tracked product THEN sistem SHALL membuat 2 stock cards (OUT dari source, IN ke destination) dengan reference ke serials
5. WHEN user menyimpan TRANSFER untuk serial-tracked product THEN sistem SHALL maintain status serial sebagai IN_STOCK
6. WHEN ada serial yang bukan IN_STOCK THEN sistem SHALL menolak transaksi dengan error message
7. WHEN quantity tidak sama dengan jumlah serial numbers yang dipilih THEN sistem SHALL menolak input dengan error message

### Requirement 7

**User Story:** Sebagai warehouse staff, saya ingin melakukan ADJUSTMENT movement dengan batch tracking, sehingga saya dapat mengoreksi quantity batch yang salah.

#### Acceptance Criteria

1. WHEN user melakukan ADJUSTMENT untuk batch-tracked product THEN sistem SHALL menampilkan available batches di warehouse tersebut
2. WHEN adjustment adalah positive (menambah) THEN sistem SHALL increment batch quantity yang dipilih
3. WHEN adjustment adalah negative (mengurangi) THEN sistem SHALL decrement batch quantity yang dipilih
4. WHEN user menyimpan ADJUSTMENT untuk batch-tracked product THEN sistem SHALL update batch_quantity di product_warehouse_stock table
5. WHEN user menyimpan ADJUSTMENT untuk batch-tracked product THEN sistem SHALL membuat stock card dengan type ADJUSTMENT dan reference ke batch
6. WHEN negative adjustment melebihi batch quantity THEN sistem SHALL menolak transaksi dengan error message
7. WHEN batch quantity menjadi 0 setelah negative adjustment THEN sistem SHALL set is_active = false pada batch tersebut

### Requirement 8

**User Story:** Sebagai warehouse staff, saya ingin melakukan ADJUSTMENT movement dengan serial tracking, sehingga saya dapat menambah atau menghapus serial numbers.

#### Acceptance Criteria

1. WHEN user melakukan positive ADJUSTMENT untuk serial-tracked product THEN sistem SHALL menampilkan input untuk serial numbers baru
2. WHEN user melakukan negative ADJUSTMENT untuk serial-tracked product THEN sistem SHALL menampilkan multiselect available serials
3. WHEN positive adjustment disimpan THEN sistem SHALL membuat serial records baru dengan status IN_STOCK
4. WHEN negative adjustment disimpan THEN sistem SHALL update status serial menjadi DAMAGED atau LOST sesuai reason
5. WHEN user menyimpan ADJUSTMENT untuk serial-tracked product THEN sistem SHALL update serial_quantity di product_warehouse_stock table
6. WHEN user menyimpan ADJUSTMENT untuk serial-tracked product THEN sistem SHALL membuat stock card dengan type ADJUSTMENT dan reference ke serials
7. WHEN serial number untuk positive adjustment sudah ada THEN sistem SHALL menolak input dengan error message

### Requirement 9

**User Story:** Sebagai warehouse staff, saya ingin sistem menangani general tracking products dengan benar, sehingga produk tanpa batch/serial tetap dapat di-movement.

#### Acceptance Criteria

1. WHEN user memilih product tanpa batch atau serial tracking THEN sistem SHALL tidak menampilkan batch/serial input fields
2. WHEN user menyimpan movement untuk general-tracked product THEN sistem SHALL hanya update general_quantity di product_warehouse_stock table
3. WHEN user menyimpan movement untuk general-tracked product THEN sistem SHALL membuat stock card tanpa batch/serial reference
4. WHEN user melakukan OUT untuk general-tracked product THEN sistem SHALL validate total_stock mencukupi
5. WHEN user melakukan TRANSFER untuk general-tracked product THEN sistem SHALL update general_quantity di kedua warehouse
6. WHEN user melakukan ADJUSTMENT untuk general-tracked product THEN sistem SHALL update general_quantity sesuai adjustment
7. WHEN general stock tidak mencukupi untuk OUT THEN sistem SHALL menolak transaksi dengan error message

### Requirement 10

**User Story:** Sebagai system administrator, saya ingin data integrity terjaga pada semua movement operations, sehingga tidak ada data yang inconsistent.

#### Acceptance Criteria

1. WHEN movement disimpan THEN sistem SHALL update stock_cards, product_warehouse_stock, dan product_batches/serials secara atomic
2. WHEN terjadi error pada salah satu table update THEN sistem SHALL rollback semua changes
3. WHEN movement disimpan THEN sistem SHALL validate bahwa total_stock = batch_quantity + serial_quantity + general_quantity
4. WHEN batch/serial digunakan THEN sistem SHALL validate bahwa tracking type product sesuai
5. WHEN movement dibatalkan atau dihapus THEN sistem SHALL reverse semua stock changes
6. WHEN concurrent movements terjadi THEN sistem SHALL handle race conditions dengan proper locking
7. WHEN movement selesai THEN sistem SHALL trigger low stock notification jika diperlukan

### Requirement 11

**User Story:** Sebagai warehouse staff, saya ingin melihat batch/serial information pada stock movement history, sehingga saya dapat audit trail yang lengkap.

#### Acceptance Criteria

1. WHEN user melihat movement list THEN sistem SHALL menampilkan batch number atau serial numbers jika ada
2. WHEN user melihat movement detail THEN sistem SHALL menampilkan complete batch information (batch number, expiry date, quantity)
3. WHEN user melihat movement detail THEN sistem SHALL menampilkan complete serial information (serial numbers, status)
4. WHEN user melihat stock card THEN sistem SHALL menampilkan batch/serial reference untuk setiap transaction
5. WHEN user filter movement by batch THEN sistem SHALL return semua movements yang menggunakan batch tersebut
6. WHEN user filter movement by serial THEN sistem SHALL return semua movements yang menggunakan serial tersebut
7. WHEN user export movement report THEN sistem SHALL include batch/serial information dalam export

### Requirement 12

**User Story:** Sebagai warehouse manager, saya ingin validasi yang ketat pada batch/serial input, sehingga data yang masuk selalu valid dan akurat.

#### Acceptance Criteria

1. WHEN batch number diinput THEN sistem SHALL validate format sesuai pattern yang ditentukan
2. WHEN expiry date diinput THEN sistem SHALL validate bahwa tanggal adalah future date
3. WHEN serial number diinput THEN sistem SHALL validate format dan uniqueness
4. WHEN quantity diinput untuk batch THEN sistem SHALL validate bahwa quantity > 0
5. WHEN serial numbers diinput THEN sistem SHALL validate bahwa count sesuai dengan quantity
6. WHEN batch/serial dipilih untuk OUT THEN sistem SHALL validate availability dan status
7. WHEN validation gagal THEN sistem SHALL menampilkan error message yang jelas dan actionable
