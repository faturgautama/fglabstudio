# 📦 Panduan Lengkap Sistem Inventory Management

## Selamat Datang! 👋

Selamat datang di **Inventory Management System** - Sistem manajemen inventory yang powerful dan mudah digunakan untuk mengelola produk, stok, purchase order, supplier, dan tracking batch/serial number perusahaan Anda.

---

## 📋 Daftar Isi

1. [Persiapan Awal](#persiapan-awal)
2. [Langkah 1: Pengaturan Perusahaan](#langkah-1-pengaturan-perusahaan)
3. [Langkah 2: Menambah Kategori](#langkah-2-menambah-kategori)
4. [Langkah 3: Menambah Supplier](#langkah-3-menambah-supplier)
5. [Langkah 4: Menambah Warehouse](#langkah-4-menambah-warehouse)
6. [Langkah 5: Menambah Produk](#langkah-5-menambah-produk)
7. [Langkah 6: Purchase Order](#langkah-6-purchase-order)
8. [Fitur Batch & Serial Tracking](#fitur-batch-serial-tracking)
9. [Stock Movement](#stock-movement)
10. [Stock Opname](#stock-opname)
11. [Reports & Monitoring](#reports-monitoring)
12. [Tips & Trik](#tips-trik)

---

## 🚀 Persiapan Awal

### Apa yang Perlu Disiapkan?

Sebelum memulai, pastikan Anda sudah menyiapkan:

- ✅ **Data Perusahaan** (Nama, Logo, Alamat, dll)
- ✅ **Daftar Kategori Produk** (Elektronik, Makanan, dll)
- ✅ **Daftar Supplier** (Nama, Kontak, Alamat)
- ✅ **Daftar Warehouse/Gudang**
- ✅ **Data Produk** (SKU, Nama, Harga, Stok)

### Mengakses Aplikasi

1. Buka browser (Chrome, Firefox, atau Edge)
2. Akses URL aplikasi
3. Klik menu **"Inventory"** di sidebar
4. Anda akan masuk ke Dashboard Inventory

> 💡 **Tips**: Gunakan browser terbaru untuk performa optimal!

---

## 🏢 Langkah 1: Pengaturan Perusahaan

**⚠️ PENTING**: Ini adalah langkah WAJIB pertama yang harus dilakukan!

### Mengapa Harus Diisi Dulu?

Pengaturan perusahaan adalah fondasi dari seluruh sistem. Data ini akan digunakan untuk:

- Header dokumen (PO, Invoice, dll)
- SKU prefix untuk generate kode produk
- Informasi kontak di laporan
- Branding perusahaan

### Cara Mengisi Pengaturan Perusahaan

#### 1️⃣ Akses Menu Pengaturan

- Klik menu **"Inventory"** di sidebar
- Klik **"Company Setting"**

#### 2️⃣ Isi Informasi Perusahaan

| Field              | Penjelasan               | Contoh                        |
| ------------------ | ------------------------ | ----------------------------- |
| **Company Name\*** | Nama lengkap perusahaan  | PT. Maju Bersama Indonesia    |
| **Address**        | Alamat lengkap kantor    | Jl. Sudirman No. 123, Jakarta |
| **Phone**          | Nomor telepon kantor     | 021-12345678                  |
| **Email**          | Email perusahaan         | info@majubersama.com          |
| **Currency\***     | Mata uang yang digunakan | IDR                           |
| **SKU Prefix\***   | Prefix untuk kode produk | PRD                           |
| **Logo**           | URL logo perusahaan      | https://example.com/logo.png  |

> **\*** = Field wajib diisi

#### 3️⃣ Simpan Pengaturan

Klik tombol **💾 Simpan** di bagian bawah halaman.

✅ **Selamat!** Pengaturan perusahaan berhasil disimpan!

---

## 📁 Langkah 2: Menambah Kategori

Kategori adalah pengelompokan produk (misalnya: Elektronik, Makanan, Pakaian).

### Cara Menambah Kategori

#### 1️⃣ Akses Menu Kategori

- Klik **"Category"** di sidebar Inventory

#### 2️⃣ Tambah Kategori Baru

1. Klik tombol **➕ Add** di pojok kanan atas tabel
2. Isi form yang muncul:

| Field           | Penjelasan            | Contoh                       |
| --------------- | --------------------- | ---------------------------- |
| **Name\***      | Nama kategori         | Elektronik                   |
| **Description** | Deskripsi singkat     | Produk elektronik dan gadget |
| **Active**      | Status aktif/nonaktif | ✅ (Centang untuk aktif)     |

3. Klik **💾 Simpan**

#### 3️⃣ Contoh Kategori yang Umum

| Nama       | Deskripsi               |
| ---------- | ----------------------- |
| Elektronik | Laptop, HP, Gadget      |
| Makanan    | Makanan & Minuman       |
| Pakaian    | Baju, Celana, Aksesoris |
| Furniture  | Meja, Kursi, Lemari     |
| Alat Tulis | Pulpen, Kertas, Buku    |

> 💡 **Tips**: Buat minimal 3-5 kategori sebelum lanjut ke langkah berikutnya

---

## 🏭 Langkah 3: Menambah Supplier

Supplier adalah vendor/pemasok yang menyediakan produk untuk perusahaan Anda.

### Cara Menambah Supplier

#### 1️⃣ Akses Menu Supplier

- Klik **"Supplier"** di sidebar Inventory

#### 2️⃣ Tambah Supplier Baru

1. Klik tombol **➕ Add**
2. Isi form:

**Informasi Dasar:**

| Field              | Penjelasan         | Contoh                  |
| ------------------ | ------------------ | ----------------------- |
| **Name\***         | Nama supplier      | PT. Supplier Elektronik |
| **Code**           | Kode unik supplier | SUP-001                 |
| **Contact Person** | Nama kontak        | Budi Santoso            |
| **Phone**          | Nomor telepon      | 021-12345678            |
| **Mobile**         | Nomor HP           | 0812-3456-7890          |
| **Email**          | Email supplier     | supplier@example.com    |
| **Website**        | Website supplier   | www.supplier.com        |

**Alamat:**

| Field           | Penjelasan     | Contoh              |
| --------------- | -------------- | ------------------- |
| **Address**     | Alamat lengkap | Jl. Industri No. 45 |
| **City**        | Kota           | Jakarta             |
| **Postal Code** | Kode pos       | 12345               |
| **Country**     | Negara         | Indonesia           |

**Payment & Tax:**

| Field              | Penjelasan        | Contoh                |
| ------------------ | ----------------- | --------------------- |
| **Payment Terms**  | Termin pembayaran | Net 30                |
| **Payment Method** | Metode pembayaran | Transfer Bank         |
| **Bank Name**      | Nama bank         | BCA                   |
| **Bank Account**   | Nomor rekening    | 1234567890            |
| **Tax ID**         | NPWP              | 01.234.567.8-901.000  |
| **Is PKP**         | Apakah PKP?       | ✅ (Centang jika PKP) |

3. Klik **💾 Simpan**

> 💡 **Tips**: Simpan data supplier dengan lengkap untuk memudahkan proses procurement

---

## 🏬 Langkah 4: Menambah Warehouse

Warehouse adalah lokasi penyimpanan stok (gudang/cabang).

### Cara Menambah Warehouse

#### 1️⃣ Akses Menu Warehouse

- Klik **"Warehouse"** di sidebar Inventory

#### 2️⃣ Tambah Warehouse Baru

1. Klik tombol **➕ Add**
2. Isi form:

| Field            | Penjelasan          | Contoh                     |
| ---------------- | ------------------- | -------------------------- |
| **Code\***       | Kode unik warehouse | WH-001                     |
| **Name\***       | Nama warehouse      | Gudang Pusat               |
| **Address**      | Alamat warehouse    | Jl. Gudang No. 1           |
| **City**         | Kota                | Jakarta                    |
| **Manager Name** | Nama manager gudang | John Doe                   |
| **Phone**        | Nomor telepon       | 021-11111111               |
| **Is Default**   | Gudang default?     | ✅ (Centang untuk default) |
| **Active**       | Status aktif        | ✅                         |

3. Klik **💾 Simpan**

#### 3️⃣ Contoh Warehouse

| Kode   | Nama            | Keterangan      |
| ------ | --------------- | --------------- |
| WH-001 | Gudang Pusat    | Gudang utama    |
| WH-002 | Gudang Cabang A | Cabang Jakarta  |
| WH-003 | Gudang Cabang B | Cabang Surabaya |

> 💡 **Tips**: Set satu warehouse sebagai default untuk memudahkan transaksi

---

## 📦 Langkah 5: Menambah Produk

Setelah semua setup di atas selesai, sekarang saatnya input data produk!

### Cara Menambah Produk

#### 1️⃣ Akses Menu Produk

- Klik **"Product"** di sidebar Inventory

#### 2️⃣ Tambah Produk Baru

1. Klik tombol **➕ Add**
2. Isi form (dibagi dalam beberapa section):

### 📌 Section 1: Informasi Dasar

| Field        | Wajib? | Contoh                            |
| ------------ | ------ | --------------------------------- |
| SKU          | ✅     | PRD-001 (Auto generate)           |
| Barcode      | ❌     | 8992761234567                     |
| Category     | ❌     | Elektronik                        |
| Product Name | ✅     | Laptop Dell XPS 15                |
| Description  | ❌     | Laptop high-end untuk profesional |
| Brand        | ❌     | Dell                              |
| Manufacturer | ❌     | Dell Inc.                         |
| Model Number | ❌     | XPS-15-9520                       |

### 📌 Section 2: Unit & Dimensi

| Field              | Wajib? | Contoh  |
| ------------------ | ------ | ------- |
| Unit               | ✅     | PCS     |
| Unit Weight (kg)   | ❌     | 2.5     |
| Unit Volume (m³)   | ❌     | 0.05    |
| Warehouse Location | ❌     | Rak A-1 |
| Length (cm)        | ❌     | 35      |
| Width (cm)         | ❌     | 25      |
| Height (cm)        | ❌     | 2       |
| Weight (kg)        | ❌     | 2.5     |

### 📌 Section 3: Manajemen Stok

| Field         | Wajib? | Contoh                |
| ------------- | ------ | --------------------- |
| Current Stock | ✅     | 0 (untuk produk baru) |
| Min Stock     | ✅     | 5                     |
| Max Stock     | ❌     | 100                   |
| Reorder Point | ❌     | 10                    |

### 📌 Section 4: Harga & Biaya

| Field           | Wajib? | Contoh        |
| --------------- | ------ | ------------- |
| Purchase Price  | ✅     | Rp 15.000.000 |
| Selling Price   | ✅     | Rp 18.000.000 |
| Wholesale Price | ❌     | Rp 17.000.000 |
| Margin (%)      | ❌     | 20            |
| COGS            | ❌     | Rp 15.000.000 |
| Tax Rate (%)    | ❌     | 11            |

### 📌 Section 5: Informasi Supplier

| Field            | Wajib? | Contoh                  |
| ---------------- | ------ | ----------------------- |
| Default Supplier | ❌     | PT. Supplier Elektronik |
| Supplier SKU     | ❌     | DELL-XPS-15             |
| Lead Time (days) | ❌     | 7                       |

### 📌 Section 6: Tanggal & Tracking

| Field              | Wajib? | Contoh     |
| ------------------ | ------ | ---------- |
| Manufacturing Date | ❌     | 01/01/2025 |
| Expiry Date        | ❌     | 31/12/2027 |

### 📌 Section 7: Media & SEO

| Field            | Wajib? | Contoh                         |
| ---------------- | ------ | ------------------------------ |
| Image URL        | ❌     | https://example.com/laptop.jpg |
| Slug             | ❌     | laptop-dell-xps-15             |
| Meta Description | ❌     | Laptop Dell XPS 15 terbaik...  |

### 📌 Section 8: Catatan & Instruksi

| Field                | Wajib? | Contoh                    |
| -------------------- | ------ | ------------------------- |
| Notes                | ❌     | Produk best seller        |
| Handling Notes       | ❌     | Hati-hati, barang fragile |
| Storage Requirements | ❌     | Simpan di tempat kering   |

### 📌 Section 9: Status & Pengaturan ⭐

**INI BAGIAN PENTING UNTUK BATCH/SERIAL TRACKING!**

#### 🎯 Metode Tracking Inventory

Pilih metode tracking yang sesuai dengan jenis produk:

**Option A: 📦 Batch Tracking**

✅ Centang **"Batch Tracking"**

**Kapan digunakan:**

- Produk dengan expiry date (makanan, obat, kosmetik)
- Produk diproduksi dalam batch
- Perlu recall tracking per batch

**Contoh:** Obat-obatan, Makanan, Kosmetik

---

**Option B: 🔢 Serial Number Tracking**

✅ Centang **"Serial Number Tracking"**

**Kapan digunakan:**

- Produk high-value
- Punya warranty per unit
- Unique per unit
- Perlu traceability detail

**Contoh:** Laptop, Handphone, Kendaraan, Mesin

---

**Option C: 📦 + 🔢 Kombinasi (Batch + Serial)**

✅ Centang **keduanya**

**Kapan digunakan:**

- Produk elektronik dengan batch produksi
- Perlu track batch DAN serial

**Contoh:** Handphone (Batch produksi + IMEI)

---

**Option D: Standard (Tidak ada tracking khusus)**

❌ Tidak centang keduanya

**Kapan digunakan:**

- Produk umum tanpa kebutuhan traceability
- Quantity tracking sudah cukup

**Contoh:** Alat tulis, Barang umum

---

**Status Lainnya:**

| Field       | Penjelasan                    |
| ----------- | ----------------------------- |
| Perishable  | Produk mudah rusak/kadaluarsa |
| Active      | Produk aktif di sistem        |
| Sellable    | Dapat dijual                  |
| Purchasable | Dapat dibeli dari supplier    |

#### 3️⃣ Simpan Data Produk

1. Scroll ke bawah
2. Klik tombol **💾 Simpan**
3. Tunggu notifikasi berhasil
4. Data produk akan muncul di tabel

> 💡 **Tips**: Isi minimal data wajib dulu (SKU, Nama, Unit, Harga), data lain bisa diupdate kemudian!

---

## 🛒 Langkah 6: Purchase Order

Purchase Order (PO) adalah dokumen pemesanan barang ke supplier.

### Cara Membuat Purchase Order

#### 1️⃣ Akses Menu Purchase Order

- Klik **"Purchase Order"** di sidebar Inventory

#### 2️⃣ Buat PO Baru

1. Klik tombol **➕ Add**
2. Isi form PO:

**Header PO:**

| Field          | Wajib? | Contoh                         |
| -------------- | ------ | ------------------------------ |
| PO Number      | ✅     | PO/202501/0001 (Auto generate) |
| Supplier       | ✅     | PT. Supplier Elektronik        |
| Order Date     | ✅     | 15/01/2025                     |
| Expected Date  | ❌     | 22/01/2025                     |
| Status         | ✅     | DRAFT                          |
| Payment Status | ❌     | UNPAID                         |

**Items:**

3. Klik **➕ Add Item** untuk menambah produk
4. Isi detail item:

| Field        | Wajib? | Contoh             |
| ------------ | ------ | ------------------ |
| Product      | ✅     | Laptop Dell XPS 15 |
| Qty Ordered  | ✅     | 10                 |
| Unit Price   | ✅     | Rp 15.000.000      |
| Discount (%) | ❌     | 5                  |
| Tax (%)      | ❌     | 11                 |
| Notes        | ❌     | Urgent order       |

5. Subtotal akan terhitung otomatis

**Footer PO:**

| Field            | Penjelasan           | Contoh             |
| ---------------- | -------------------- | ------------------ |
| Subtotal         | Total sebelum diskon | Rp 150.000.000     |
| Discount (%)     | Diskon keseluruhan   | 2                  |
| Tax Amount       | Pajak                | Rp 16.500.000      |
| Shipping Cost    | Biaya kirim          | Rp 500.000         |
| Other Costs      | Biaya lain-lain      | Rp 0               |
| **Total Amount** | **Total akhir**      | **Rp 164.000.000** |

6. Klik **💾 Simpan**

✅ **PO berhasil dibuat!** Status: DRAFT

---

### 📥 Cara Receive Purchase Order

**INI BAGIAN PENTING!** Di sini batch/serial tracking akan digunakan.

#### 1️⃣ Buka List Purchase Order

- Klik **"Purchase Order"** di sidebar

#### 2️⃣ Receive PO

1. Cari PO yang ingin diterima
2. Klik tombol **📥 Receive** pada PO tersebut
3. Dialog **"Receive Purchase Order"** akan muncul

#### 3️⃣ Input Qty Receive

Untuk setiap item, input **Qty Receive** (jumlah yang diterima)

**Contoh:**

- Ordered: 10 pcs
- Received: 0 pcs (sebelumnya)
- **Receive Now: 10 pcs** ← Input di sini

---

### 🎯 Receive Produk STANDARD (Tanpa Batch/Serial)

Jika produk **TIDAK** menggunakan batch/serial tracking:

1. Input **Qty Receive**
2. Klik **Receive Items**

✅ **Selesai!** Stock otomatis bertambah.

---

### 📦 Receive Produk dengan BATCH TRACKING

Jika produk menggunakan **Batch Tracking** (ada badge 📦 Batch):

1. Input **Qty Receive** (contoh: 1000)
2. **WAJIB** input:
   - **Batch Number** (contoh: `PARA-2025-01`)
   - **Expiry Date** (jika produk perishable)

**Contoh Receive Obat:**

```
Product: Paracetamol 500mg 📦
Qty Receive: 1000

Batch Number: PARA-2025-01
Expiry Date: 31/12/2027
```

3. Klik **Receive Items**

✅ **Hasil:**

- Stock bertambah 1000 pcs
- Batch `PARA-2025-01` tersimpan dengan qty 1000
- Expiry date tercatat untuk monitoring

> ⚠️ **Validasi**: Jika batch number tidak diisi, sistem akan menolak dengan error: "Product requires batch number"

---

### 🔢 Receive Produk dengan SERIAL TRACKING

Jika produk menggunakan **Serial Number Tracking** (ada badge 🔢 Serial):

1. Input **Qty Receive** (contoh: 3)
2. **WAJIB** input **Serial Numbers** di textarea:
   - **1 serial = 1 unit**
   - **Satu serial per baris**
   - **Jumlah serial harus sama dengan qty**

**Contoh Receive Laptop:**

```
Product: Laptop Dell XPS 15 🔢
Qty Receive: 3

Serial Numbers:
DELL-SN-001
DELL-SN-002
DELL-SN-003
```

3. System akan menghitung: **3 / 3 serials** ✅
4. Klik **Receive Items**

✅ **Hasil:**

- Stock bertambah 3 pcs
- 3 serial number tersimpan dengan status `IN_STOCK`
- Setiap serial dapat ditrack individual

> ⚠️ **Validasi**:
>
> - Jika jumlah serial tidak sesuai: "Expected 3 serial numbers, got 2"
> - Jika serial sudah ada: "Serial number DELL-SN-001 already exists"
> - Jika ada duplikat: "Duplicate serial numbers found"

---

### 📦 + 🔢 Receive Produk dengan BATCH + SERIAL

Jika produk menggunakan **keduanya** (ada badge 📦 Batch dan 🔢 Serial):

1. Input **Qty Receive** (contoh: 5)
2. **WAJIB** input:
   - **Batch Number**
   - **Expiry Date** (jika perishable)
   - **Serial Numbers** (5 serial untuk 5 unit)

**Contoh Receive Handphone:**

```
Product: iPhone 15 Pro 📦 🔢
Qty Receive: 5

Batch Number: APPLE-2025-W01
Expiry Date: - (tidak perishable)

Serial Numbers:
IMEI-123456789012345
IMEI-123456789012346
IMEI-123456789012347
IMEI-123456789012348
IMEI-123456789012349
```

3. System validasi: **5 / 5 serials** ✅
4. Klik **Receive Items**

✅ **Hasil:**

- Stock bertambah 5 pcs
- Batch `APPLE-2025-W01` tersimpan
- 5 IMEI tersimpan dan linked ke batch
- Warranty tracking per IMEI

---

### 📊 Status Purchase Order

Setelah receive, status PO akan berubah otomatis:

| Status    | Penjelasan                        |
| --------- | --------------------------------- |
| DRAFT     | PO baru dibuat, belum disubmit    |
| SUBMITTED | PO sudah disubmit ke supplier     |
| PARTIAL   | Sebagian item sudah diterima      |
| RECEIVED  | Semua item sudah diterima lengkap |
| CANCELLED | PO dibatalkan                     |

> 💡 **Tips**: Anda bisa receive PO secara bertahap (partial receive)

---

## 🎯 Fitur Batch & Serial Tracking

### 📦 Batch Tracking - Detail

#### Apa itu Batch Tracking?

Batch tracking adalah sistem untuk melacak produk berdasarkan **batch/lot produksi**. Setiap batch memiliki:

- Batch Number (nomor unik)
- Quantity (jumlah stok per batch)
- Expiry Date (tanggal kadaluarsa)
- Manufacturing Date (tanggal produksi)

#### Kapan Menggunakan Batch Tracking?

✅ **Gunakan untuk:**

- Produk dengan expiry date (makanan, obat, kosmetik)
- Produk yang diproduksi dalam batch
- Produk yang perlu recall tracking
- Produk dengan shelf life terbatas

**Contoh Produk:**

- Obat-obatan: Paracetamol, Vitamin
- Makanan: Susu, Snack, Minuman
- Kosmetik: Cream, Lotion, Shampoo
- Bahan Kimia: Cat, Thinner, Resin

#### Cara Kerja Batch Tracking

**1. Saat Receive PO:**

```
Input:
- Batch Number: PARA-2025-01
- Qty: 1000
- Expiry: 31/12/2027

Tersimpan di database:
product_batches table:
  - batch_number: PARA-2025-01
  - quantity: 1000
  - expiry_date: 2027-12-31
  - is_active: true
```

**2. Saat Stock Out (Sales/Transfer):**

```
System otomatis pilih batch menggunakan:
- FIFO (First In First Out) = Batch terlama dulu
- FEFO (First Expired First Out) = Expiry terdekat dulu

Contoh FIFO:
Batch A (masuk 1 Jan) → Keluar dulu
Batch B (masuk 15 Jan) → Keluar kedua

Contoh FEFO:
Batch A (expired 2026) → Keluar dulu
Batch B (expired 2027) → Keluar kedua
```

**3. Monitoring:**

- Cek batch yang akan expired
- Lihat sisa stock per batch
- Track movement per batch

#### Contoh Kasus Batch Tracking

**Kasus: Toko Obat**

```
Produk: Paracetamol 500mg
Tracking: Batch ✅

Receive 1:
- Batch: PARA-2025-01
- Qty: 1000
- Expiry: 31/12/2026

Receive 2:
- Batch: PARA-2025-02
- Qty: 500
- Expiry: 30/06/2027

Stock Total: 1500 pcs

Sales (100 pcs):
System ambil dari PARA-2025-01 (FEFO - expired lebih dulu)
Sisa:
- PARA-2025-01: 900 pcs
- PARA-2025-02: 500 pcs

Monitoring:
- Alert: PARA-2025-01 akan expired dalam 30 hari
```

---

### 🔢 Serial Number Tracking - Detail

#### Apa itu Serial Number Tracking?

Serial number tracking adalah sistem untuk melacak produk **per unit individual**. Setiap unit memiliki:

- Serial Number (nomor unik per unit)
- Status (IN_STOCK, SOLD, DAMAGED, RETURNED)
- Sold Date (tanggal terjual)
- Warranty Info (informasi garansi)

#### Kapan Menggunakan Serial Number Tracking?

✅ **Gunakan untuk:**

- Produk high-value (harga tinggi)
- Produk dengan warranty per unit
- Produk yang unique per unit
- Produk yang perlu traceability detail

**Contoh Produk:**

- Elektronik: Laptop, Handphone, Tablet
- Kendaraan: Motor, Mobil
- Mesin: Mesin industri, Generator
- Alat Berat: Forklift, Crane

#### Cara Kerja Serial Number Tracking

**1. Saat Receive PO:**

```
Input:
Product: Laptop Dell XPS 15
Qty: 3

Serial Numbers:
DELL-SN-001
DELL-SN-002
DELL-SN-003

Tersimpan di database:
product_serials table (3 records):
  1. serial_number: DELL-SN-001, status: IN_STOCK
  2. serial_number: DELL-SN-002, status: IN_STOCK
  3. serial_number: DELL-SN-003, status: IN_STOCK
```

**2. Saat Stock Out (Sales):**

```
Customer beli 1 laptop

User pilih serial: DELL-SN-001

Update database:
  - serial_number: DELL-SN-001
  - status: IN_STOCK → SOLD
  - sold_date: 2025-01-15

Stock berkurang: 3 → 2
Serial IN_STOCK: DELL-SN-002, DELL-SN-003
```

**3. Tracking & Warranty:**

```
Customer: "Laptop saya rusak, serial DELL-SN-001"

System check:
- Serial: DELL-SN-001
- Status: SOLD
- Sold Date: 15/01/2025
- Warranty: 1 tahun (sampai 15/01/2026)
- Masih dalam garansi ✅

Action: Process warranty claim
```

#### Contoh Kasus Serial Number Tracking

**Kasus: Toko Elektronik**

```
Produk: iPhone 15 Pro
Tracking: Serial ✅

Receive PO:
Qty: 5
Serials:
- IMEI-001
- IMEI-002
- IMEI-003
- IMEI-004
- IMEI-005

Stock: 5 units (semua IN_STOCK)

Sales 1:
Customer A beli 1 unit
Serial: IMEI-001 → SOLD
Sold Date: 10/01/2025

Sales 2:
Customer B beli 2 units
Serial: IMEI-002 → SOLD
Serial: IMEI-003 → SOLD
Sold Date: 12/01/2025

Stock: 2 units (IMEI-004, IMEI-005)

Return:
Customer A return (rusak)
Serial: IMEI-001
Status: SOLD → RETURNED
Reason: "Layar bermasalah"

Monitoring:
- Total Units: 5
- IN_STOCK: 2 (IMEI-004, IMEI-005)
- SOLD: 2 (IMEI-002, IMEI-003)
- RETURNED: 1 (IMEI-001)
```

---

### 📦 + 🔢 Kombinasi Batch + Serial

#### Kapan Menggunakan Kombinasi?

Gunakan kombinasi jika produk perlu:

- Track batch produksi DAN
- Track serial number per unit

**Contoh Produk:**

- Handphone (Batch produksi + IMEI)
- Elektronik branded (Batch + Serial)
- Medical devices (Batch + Serial)

#### Cara Kerja Kombinasi

**Saat Receive:**

```
Product: iPhone 15 Pro
Qty: 5

Batch: APPLE-2025-W01
Serials:
- IMEI-001
- IMEI-002
- IMEI-003
- IMEI-004
- IMEI-005

Tersimpan:
1. product_batches:
   - batch_number: APPLE-2025-W01
   - quantity: 5

2. product_serials (5 records):
   - IMEI-001, batch: APPLE-2025-W01, status: IN_STOCK
   - IMEI-002, batch: APPLE-2025-W01, status: IN_STOCK
   - ... dst
```

**Benefit:**

- Track batch produksi (jika ada recall)
- Track serial per unit (untuk warranty)
- Full traceability

---

## 📤 Stock Movement

Stock Movement adalah transaksi keluar/masuk stok selain dari PO (adjustment, transfer, dll).

### Jenis Stock Movement

| Type       | Penjelasan                 | Contoh               |
| ---------- | -------------------------- | -------------------- |
| IN         | Stok masuk (selain PO)     | Return dari customer |
| OUT        | Stok keluar (selain sales) | Rusak, hilang        |
| ADJUSTMENT | Penyesuaian stok           | Koreksi stok opname  |
| TRANSFER   | Transfer antar warehouse   | Dari gudang A ke B   |

### Cara Membuat Stock Movement

#### 1️⃣ Akses Menu Stock Movement

- Klik **"Stock Movement"** di sidebar Inventory

#### 2️⃣ Buat Movement Baru

1. Klik tombol **➕ Add**
2. Isi form:

| Field           | Wajib? | Contoh                         |
| --------------- | ------ | ------------------------------ |
| Movement Number | ✅     | SM/202501/0001 (Auto generate) |
| Type            | ✅     | OUT                            |
| Product         | ✅     | Laptop Dell XPS 15             |
| Warehouse From  | ❌     | Gudang Pusat                   |
| Warehouse To    | ❌     | -                              |
| Quantity        | ✅     | 1                              |
| Reason          | ❌     | Damaged                        |
| Reason Detail   | ❌     | Layar pecah                    |
| Movement Date   | ✅     | 15/01/2025                     |
| Notes           | ❌     | Rusak saat handling            |

3. Klik **💾 Simpan**

> 💡 **Tips**: Untuk produk dengan batch/serial, system akan otomatis allocate atau minta user pilih

---

## 📊 Stock Opname

Stock Opname adalah proses penghitungan fisik stok untuk memastikan data di sistem sesuai dengan stok fisik.

### Cara Melakukan Stock Opname

#### 1️⃣ Akses Menu Stock Opname

- Klik **"Stock Opname"** di sidebar Inventory

#### 2️⃣ Buat Stock Opname Baru

1. Klik tombol **➕ Add**
2. Isi header:

| Field         | Wajib? | Contoh                         |
| ------------- | ------ | ------------------------------ |
| Opname Number | ✅     | SO/202501/0001 (Auto generate) |
| Opname Date   | ✅     | 31/01/2025                     |
| Warehouse     | ❌     | Gudang Pusat                   |
| Status        | ✅     | DRAFT                          |
| Notes         | ❌     | Stock opname akhir bulan       |

#### 3️⃣ Tambah Items

3. Klik **➕ Add Item**
4. Pilih produk
5. System akan load **System Stock** (stok di sistem)
6. Input **Physical Stock** (hasil hitung fisik)
7. **Difference** akan terhitung otomatis

**Contoh:**

| Product             | System Stock | Physical Stock | Difference |
| ------------------- | ------------ | -------------- | ---------- |
| Laptop Dell XPS 15  | 10           | 9              | -1         |
| Mouse Logitech      | 50           | 52             | +2         |
| Keyboard Mechanical | 20           | 20             | 0          |

#### 4️⃣ Approve Stock Opname

8. Review semua items
9. Ubah status menjadi **COMPLETED**
10. Klik **Approve**
11. System akan otomatis adjust stok sesuai physical stock

✅ **Hasil:**

- Laptop Dell XPS 15: 10 → 9 (berkurang 1)
- Mouse Logitech: 50 → 52 (bertambah 2)
- Keyboard Mechanical: 20 (tidak berubah)

> ⚠️ **Penting**: Stock opname yang sudah approved tidak bisa diubah!

---

## 📈 Reports & Monitoring

### 1. Stock Card

Stock Card adalah history transaksi per produk.

**Cara Akses:**

- Klik **"Stock Card"** di sidebar
- Pilih produk
- Lihat history IN/OUT

**Informasi yang ditampilkan:**

- Transaction Date
- Type (IN/OUT/ADJUSTMENT)
- Qty In
- Qty Out
- Balance (saldo stok)
- Reference (PO Number, Movement Number, dll)
- Batch Number (jika ada)
- Serial Number (jika ada)

### 2. Low Stock Report

Produk yang stoknya di bawah minimum.

**Cara Akses:**

- Dashboard Inventory
- Section **"Low Stock Products"**

**Informasi:**

- Product Name
- Current Stock
- Min Stock
- Reorder Point
- Status (Low/Critical)

### 3. Batch Expiry Report

Batch yang akan expired.

**Cara Akses:**

- Dashboard Inventory
- Section **"Expiring Batches"**

**Informasi:**

- Product Name
- Batch Number
- Quantity
- Expiry Date
- Days Until Expiry

> 🔔 **Notifikasi**: System otomatis kirim notifikasi untuk batch yang akan expired dalam 30 hari

### 4. Serial Number Tracking

Track serial number individual.

**Cara Akses:**

- Menu **"Product"**
- Klik detail product
- Tab **"Serial Numbers"**

**Informasi:**

- Serial Number
- Status (IN_STOCK/SOLD/DAMAGED/RETURNED)
- Batch Number (jika ada)
- Sold Date
- Warranty Until
- Notes

### 5. Stock Value Report

Total nilai stok di warehouse.

**Cara Akses:**

- Dashboard Inventory
- Section **"Stock Value"**

**Informasi:**

- Total Products
- Total Quantity
- Total Value (Purchase Price × Qty)
- By Category
- By Warehouse

---

## 💡 Tips & Trik

### ✨ Tips Umum

1. **Setup Awal yang Benar**

   - Isi pengaturan perusahaan dengan lengkap
   - Buat kategori yang jelas dan terstruktur
   - Input data supplier dengan detail
   - Set warehouse default

2. **Manfaatkan Filter & Sort**

   - Gunakan filter untuk cari data spesifik
   - Sort berdasarkan nama/SKU untuk mudah temukan produk
   - Save filter yang sering digunakan

3. **Review Data Berkala**

   - Cek low stock setiap minggu
   - Review batch expiry setiap bulan
   - Validasi serial number tracking
   - Stock opname minimal 1x per bulan

4. **Gunakan Kode yang Konsisten**
   - SKU: PRD-001, PRD-002, dst
   - Batch: PROD-YYYY-MM-XXX
   - Serial: BRAND-TYPE-XXXXX
   - PO: PO/YYYYMM/XXXX

### ⚡ Shortcut

| Aksi         | Cara                      |
| ------------ | ------------------------- |
| Buka Search  | Klik search box di navbar |
| Filter Data  | Klik ikon filter di tabel |
| Refresh Data | Klik tombol refresh       |
| Export Data  | Klik tombol export        |

### 🎯 Best Practices

#### Untuk Admin Inventory

1. ✅ Setup tracking method yang sesuai per produk
2. ✅ Input batch/serial dengan benar saat receive PO
3. ✅ Monitor batch expiry secara berkala
4. ✅ Lakukan stock opname rutin
5. ✅ Backup data setiap akhir bulan

#### Untuk Warehouse Staff

1. ✅ Validasi qty receive dengan teliti
2. ✅ Input batch number sesuai label fisik
3. ✅ Scan serial number jika memungkinkan
4. ✅ Report discrepancy segera
5. ✅ Maintain warehouse organization

#### Untuk Procurement

1. ✅ Buat PO dengan detail lengkap
2. ✅ Follow up PO yang pending
3. ✅ Koordinasi dengan warehouse untuk receive
4. ✅ Monitor lead time supplier
5. ✅ Maintain supplier relationship

### 📦 Tips Batch Tracking

1. **Format Batch Number yang Konsisten**

   ```
   Format: PROD-YYYY-MM-XXX
   Contoh: PARA-2025-01-001

   Benefit:
   - Mudah identifikasi produk
   - Mudah identifikasi periode produksi
   - Mudah sorting
   ```

2. **Selalu Input Expiry Date**

   - Wajib untuk produk perishable
   - Gunakan FEFO untuk produk dengan expiry
   - Set reminder 30 hari sebelum expired

3. **Monitor Batch Movement**

   - Track batch mana yang slow moving
   - Prioritas jual batch yang akan expired
   - Koordinasi dengan sales untuk promo

4. **Batch Recall Procedure**
   ```
   Jika ada masalah dengan batch tertentu:
   1. Identifikasi batch number
   2. Check stock tersisa
   3. Check history sales (siapa yang beli)
   4. Recall dari customer
   5. Mark batch as inactive
   ```

### 🔢 Tips Serial Number Tracking

1. **Format Serial Number yang Jelas**

   ```
   Format: BRAND-TYPE-XXXXX
   Contoh: DELL-XPS15-00001

   Benefit:
   - Mudah identifikasi brand
   - Mudah identifikasi type
   - Unique per unit
   ```

2. **Gunakan Barcode/QR Scanner**

   - Hindari typo saat input
   - Lebih cepat dan akurat
   - Integrate dengan barcode printer

3. **Dokumentasi Serial Number**

   - Simpan copy serial number di tempat aman
   - Backup data serial secara berkala
   - Maintain serial number register

4. **Warranty Tracking**

   ```
   Setup warranty per product:
   - Laptop: 1 tahun
   - Handphone: 1 tahun
   - Mesin: 2 tahun

   System auto calculate warranty expiry:
   Serial: DELL-SN-001
   Sold: 15/01/2025
   Warranty: 1 year
   Expired: 15/01/2026
   ```

5. **Serial Number Status Management**
   ```
   IN_STOCK → SOLD (normal sales)
   SOLD → RETURNED (customer return)
   RETURNED → IN_STOCK (after repair)
   IN_STOCK → DAMAGED (rusak)
   DAMAGED → (dispose/repair)
   ```

### 🚨 Troubleshooting

#### ❓ FAQ (Frequently Asked Questions)

**Q: Data tidak muncul setelah save?**
A: Klik tombol **Refresh** di tabel atau reload halaman.

**Q: Tidak bisa receive PO?**
A: Pastikan:

- Product sudah ada di sistem
- Qty receive tidak melebihi qty ordered
- Batch/serial sudah diisi (jika required)

**Q: Error "Product requires batch number"?**
A: Product di-set batch tracked. Input batch number sebelum receive.

**Q: Error "Serial number already exists"?**
A: Serial number harus unique. Gunakan serial yang berbeda.

**Q: Error "Expected X serial numbers, got Y"?**
A: Jumlah serial harus sama dengan qty. Check input serial numbers.

**Q: Batch tidak muncul di list?**
A: Check:

- Batch sudah di-receive?
- Batch masih active?
- Quantity batch > 0?

**Q: Serial number tidak bisa di-track?**
A: Pastikan:

- Product di-set serial tracked
- Serial sudah di-receive
- Serial number benar

**Q: Stock tidak berkurang saat sales?**
A: Check:

- Stock movement sudah dibuat?
- Type movement = OUT?
- Quantity sudah benar?

**Q: Stock opname tidak bisa approve?**
A: Pastikan:

- Semua items sudah diisi physical stock
- Status masih DRAFT atau IN_PROGRESS
- User punya permission approve

---

## 📊 Workflow Rekomendasi

### 🗓️ Daily (Harian)

- [ ] Cek low stock products
- [ ] Process PO yang masuk
- [ ] Receive PO yang datang
- [ ] Input batch/serial dengan benar
- [ ] Monitor stock movement

### 📅 Weekly (Mingguan)

- [ ] Review PO yang pending
- [ ] Cek batch yang akan expired (30 hari)
- [ ] Validasi serial number tracking
- [ ] Follow up supplier untuk PO delay
- [ ] Review stock value

### 📆 Monthly (Bulanan)

- [ ] **Awal Bulan (Tanggal 1-5):**

  - Backup database bulan sebelumnya
  - Review low stock products
  - Generate stock report

- [ ] **Pertengahan Bulan (Tanggal 15-20):**

  - Validasi batch expiry
  - Check serial warranty expiry
  - Review supplier performance

- [ ] **Akhir Bulan (Tanggal 25-31):**
  - **Stock Opname** untuk semua produk
  - Reconcile stock discrepancy
  - Generate monthly report
  - Backup database akhir bulan

### 📋 Yearly (Tahunan)

- [ ] Review kategori produk
- [ ] Update supplier data
- [ ] Audit batch/serial tracking
- [ ] Review warehouse organization
- [ ] Update system configuration

---

## 🎓 Training Checklist

### For Admin/Staff

- [ ] Understand 3 tracking methods (Standard/Batch/Serial)
- [ ] Know when to use batch vs serial
- [ ] Practice create product with tracking
- [ ] Practice receive PO with batch
- [ ] Practice receive PO with serial
- [ ] Understand validation errors
- [ ] Know how to check batch expiry
- [ ] Know how to track serial number
- [ ] Practice stock movement
- [ ] Practice stock opname

### For Manager

- [ ] Review batch expiry reports weekly
- [ ] Monitor serial number status
- [ ] Audit batch/serial data monthly
- [ ] Ensure staff follow SOP
- [ ] Review stock value regularly
- [ ] Monitor supplier performance

---

## 🆘 Error Messages & Solutions

### Batch Tracking Errors

| Error Message                   | Penyebab                 | Solusi                                    |
| ------------------------------- | ------------------------ | ----------------------------------------- |
| "Product requires batch number" | Batch number tidak diisi | Input batch number sebelum receive        |
| "Product requires expiry date"  | Expiry date tidak diisi  | Input expiry date untuk produk perishable |
| "Insufficient stock in batches" | Stock batch tidak cukup  | Check available batches                   |
| "Batch not found"               | Batch ID tidak valid     | Verify batch exists                       |

### Serial Number Errors

| Error Message                                | Penyebab                       | Solusi                              |
| -------------------------------------------- | ------------------------------ | ----------------------------------- |
| "Product requires serial numbers"            | Serial tidak diisi             | Input serial numbers (one per line) |
| "Must provide X serial numbers"              | Jumlah serial tidak sesuai qty | Input serial sesuai quantity        |
| "Serial number already exists"               | Serial sudah ada di sistem     | Gunakan serial number yang berbeda  |
| "Duplicate serial numbers found"             | Ada serial yang sama           | Pastikan setiap serial unique       |
| "Serial number not found"                    | Serial tidak ada di sistem     | Verify serial number                |
| "Serial number is not available (status: X)" | Serial sudah SOLD/DAMAGED      | Pilih serial dengan status IN_STOCK |

### General Errors

| Error Message               | Penyebab                 | Solusi                     |
| --------------------------- | ------------------------ | -------------------------- |
| "Product not found"         | Product ID tidak valid   | Verify product exists      |
| "Supplier not found"        | Supplier ID tidak valid  | Verify supplier exists     |
| "Warehouse not found"       | Warehouse ID tidak valid | Verify warehouse exists    |
| "Insufficient stock"        | Stock tidak cukup        | Check current stock        |
| "Database operation failed" | Database error           | Retry atau contact support |

---

## 📱 Quick Reference Card

**Simpan ini untuk referensi cepat:**

```
┌─────────────────────────────────────────────────────────────┐
│        INVENTORY MANAGEMENT - QUICK GUIDE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🏢 SETUP AWAL (WAJIB URUT):                                │
│   1. Company Setting                                        │
│   2. Category                                               │
│   3. Supplier                                               │
│   4. Warehouse                                              │
│   5. Product (pilih tracking method)                        │
│                                                             │
│ 📦 TRACKING METHODS:                                        │
│   • Standard: Qty only                                      │
│   • Batch: Batch number + expiry                           │
│   • Serial: Serial number per unit                         │
│   • Both: Batch + Serial                                    │
│                                                             │
│ 🛒 PURCHASE ORDER:                                          │
│   • Create PO → Add items → Save                           │
│   • Receive PO → Input qty + batch/serial → Receive        │
│   • Status: DRAFT → SUBMITTED → PARTIAL → RECEIVED         │
│                                                             │
│ 📥 RECEIVE PO:                                              │
│   Standard: Input qty only                                  │
│   Batch: Input qty + batch number + expiry                 │
│   Serial: Input qty + serial numbers (one per line)        │
│   Both: Input qty + batch + serials                        │
│                                                             │
│ 📤 STOCK OUT:                                               │
│   Standard: Qty berkurang otomatis                          │
│   Batch: System allocate (FIFO/FEFO)                       │
│   Serial: User pilih serial → status SOLD                  │
│                                                             │
│ 📊 MONITORING:                                              │
│   • Low Stock: Check weekly                                 │
│   • Batch Expiry: Check monthly                            │
│   • Serial Status: Track per unit                          │
│   • Stock Opname: Monthly                                   │
│                                                             │
│ 🆘 BUTUH BANTUAN?                                           │
│   📧 support@fglabstudio.com                               │
│   💬 WA: +62 XXX-XXXX-XXXX                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPLETE WORKFLOW                        │
└─────────────────────────────────────────────────────────────┘

1. SETUP PRODUCT
   ├─ Create product
   ├─ Pilih tracking method:
   │  ├─ ❌ Standard (qty only)
   │  ├─ 📦 Batch (batch + expiry)
   │  ├─ 🔢 Serial (serial per unit)
   │  └─ 📦🔢 Both (batch + serial)
   └─ Save product

2. CREATE PURCHASE ORDER
   ├─ Pilih supplier
   ├─ Add items (product + qty + price)
   ├─ Calculate total
   └─ Save PO (status: DRAFT)

3. RECEIVE PO
   ├─ Open PO
   ├─ Click "Receive" button
   ├─ Input qty to receive
   │
   ├─ [If Standard]
   │  └─ Input qty only
   │
   ├─ [If Batch]
   │  ├─ Input batch number
   │  └─ Input expiry date (if perishable)
   │
   ├─ [If Serial]
   │  └─ Input serial numbers (one per line)
   │
   └─ [If Both]
      ├─ Input batch number
      ├─ Input expiry date
      └─ Input serial numbers

4. SYSTEM VALIDATION
   ├─ Check batch/serial requirements
   ├─ Validate serial uniqueness
   ├─ Validate qty vs serial count
   └─ Show errors if any

5. SYSTEM PROCESS (If valid)
   ├─ Save batch to product_batches
   ├─ Save serials to product_serials
   ├─ Update product stock
   ├─ Create stock card entry
   ├─ Update PO status
   └─ Send notification

6. STOCK OUT (Sales/Transfer)
   ├─ Create stock movement
   │
   ├─ [If Standard]
   │  └─ Reduce stock by qty
   │
   ├─ [If Batch]
   │  ├─ System allocate (FIFO/FEFO)
   │  └─ Reduce batch quantity
   │
   ├─ [If Serial]
   │  ├─ User select serials
   │  └─ Update status to SOLD
   │
   └─ Create stock card entry

7. MONITORING & REPORTS
   ├─ Low stock alert
   ├─ Batch expiry report
   ├─ Serial tracking
   ├─ Stock value report
   └─ Stock opname

8. MONTHLY CLOSING
   ├─ Stock opname
   ├─ Reconcile discrepancy
   ├─ Generate reports
   └─ Backup database
```

---

## 📞 Bantuan & Support

### 💬 Butuh Bantuan Lebih Lanjut?

Jika Anda mengalami kesulitan atau ada pertanyaan:

1. **📧 Email**: support@fglabstudio.com
2. **💬 WhatsApp**: +62 XXX-XXXX-XXXX
3. **🌐 Website**: https://fglabstudio.com

**Jam Operasional Support:**

- Senin - Jumat: 09:00 - 17:00 WIB
- Sabtu: 09:00 - 12:00 WIB
- Minggu & Hari Libur: Tutup

### 📚 Resources

- **User Manual**: [Download PDF](#)
- **Video Tutorial**: [Watch on YouTube](#)
- **FAQ**: [Visit FAQ Page](#)
- **Community Forum**: [Join Discussion](#)

---

## 🎉 Selamat!

Anda telah menyelesaikan panduan lengkap Inventory Management System!

### 🌟 Next Steps

1. **Mulai Setup** mengikuti urutan di panduan ini
2. **Testing** fitur-fitur dengan data dummy
3. **Go Live** setelah yakin semua berfungsi
4. **Backup Rutin** untuk keamanan data
5. **Explore** fitur-fitur lanjutan

### 💪 Tips Sukses

> **"The key to success is starting. Start small, test thoroughly, then scale up!"**

Mulai dengan:

- ✅ 1 kategori
- ✅ 1 supplier
- ✅ 1 warehouse
- ✅ 3-5 produk untuk testing (mix standard/batch/serial)
- ✅ 1 PO untuk testing receive

Setelah familiar, baru input data lengkap!

---

## 📝 Catatan Versi

**Version 1.0** - Januari 2025

- ✅ Initial Release
- ✅ Complete documentation
- ✅ Batch tracking implementation
- ✅ Serial number tracking implementation
- ✅ Step-by-step tutorials
- ✅ Troubleshooting guide

---

## 🙏 Terima Kasih!

Terima kasih telah menggunakan **Inventory Management System** by FG Lab Studio.

Kami berkomitmen untuk terus meningkatkan sistem ini agar semakin mudah digunakan dan bermanfaat untuk bisnis Anda.

**Happy Managing! 🚀**

---

**© 2025 Code By Xerenity. All rights reserved.**
