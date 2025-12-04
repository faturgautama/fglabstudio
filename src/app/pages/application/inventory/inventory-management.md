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

| Field         | Wajib? | Contoh                                               |
| ------------- | ------ | ---------------------------------------------------- |
| Current Stock | ✅     | 0 (untuk produk baru, akan diupdate saat receive PO) |
| Min Stock     | ✅     | 5                                                    |
| Max Stock     | ❌     | 100                                                  |
| Reorder Point | ❌     | 10                                                   |

> ⚠️ **PENTING**: `Current Stock` adalah **total stock di semua warehouse**. Stock per warehouse akan otomatis dikelola oleh sistem saat receive PO atau stock movement.

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

| Field             | Wajib? | Contoh                         |
| ----------------- | ------ | ------------------------------ |
| Image URL         | ❌     | https://example.com/laptop.jpg |
| Additional Images | ❌     | Array of image URLs            |
| Slug              | ❌     | laptop-dell-xps-15             |
| Meta Description  | ❌     | Laptop Dell XPS 15 terbaik...  |
| Tags              | ❌     | laptop, dell, xps              |

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

✅ Centang **"is_batch_tracked"**

**Kapan digunakan:**

- Produk dengan expiry date (makanan, obat, kosmetik)
- Produk diproduksi dalam batch
- Perlu recall tracking per batch

**Contoh:** Obat-obatan, Makanan, Kosmetik

**Field yang akan digunakan:**

- `batch_number` - Nomor batch unik
- `expiry_date` - Tanggal kadaluarsa
- `manufacturing_date` - Tanggal produksi

---

**Option B: 🔢 Serial Number Tracking**

✅ Centang **"is_serial_tracked"**

**Kapan digunakan:**

- Produk high-value
- Punya warranty per unit
- Unique per unit
- Perlu traceability detail

**Contoh:** Laptop, Handphone, Kendaraan, Mesin

**Field yang akan digunakan:**

- `serial_number` - Nomor serial unik per unit
- `warranty_until` - Tanggal berakhir garansi
- `status` - IN_STOCK, SOLD, DAMAGED, RETURNED

---

**Option C: 📦 + 🔢 Kombinasi (Batch + Serial)**

✅ Centang **keduanya** (`is_batch_tracked` + `is_serial_tracked`)

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

| Field       | Field Name     | Penjelasan                    |
| ----------- | -------------- | ----------------------------- |
| Perishable  | is_perishable  | Produk mudah rusak/kadaluarsa |
| Active      | is_active      | Produk aktif di sistem        |
| Sellable    | is_sellable    | Dapat dijual                  |
| Purchasable | is_purchasable | Dapat dibeli dari supplier    |
| Serialized  | is_serialized  | (Legacy field)                |

#### 3️⃣ Simpan Data Produk

1. Scroll ke bawah
2. Klik tombol **💾 Simpan**
3. Tunggu notifikasi berhasil
4. Data produk akan muncul di tabel

> 💡 **Tips**: Isi minimal data wajib dulu (SKU, Nama, Unit, Harga), data lain bisa diupdate kemudian!

---

### 📊 Bagaimana Stock Dikelola Per Warehouse?

Sistem menggunakan tabel **`product_warehouse_stock`** untuk tracking stock per warehouse:

```typescript
ProductWarehouseStock {
  product_id: number;
  warehouse_id: number;
  total_stock: number;           // Total semua tipe
  batch_quantity: number;        // Qty dari batch tracking
  serial_quantity: number;       // Qty dari serial tracking
  general_quantity: number;      // Qty general (non-batch, non-serial)
  updated_at: Date;
}
```

**Contoh:**

```
Product: Laptop Dell XPS 15
Warehouse: Gudang Pusat (ID: 1)

product_warehouse_stock:
  product_id: 5
  warehouse_id: 1
  total_stock: 10
  batch_quantity: 0
  serial_quantity: 10  (karena serial tracked)
  general_quantity: 0
```

> ✅ **Otomatis**: Stock per warehouse diupdate otomatis saat receive PO atau stock movement!

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

| Field            | Wajib? | Contoh                         |
| ---------------- | ------ | ------------------------------ |
| PO Number        | ✅     | PO/202501/0001 (Auto generate) |
| Supplier         | ✅     | PT. Supplier Elektronik        |
| **Warehouse**    | ✅     | **Gudang Pusat**               |
| Order Date       | ✅     | 15/01/2025                     |
| Expected Date    | ❌     | 22/01/2025                     |
| Status           | ✅     | DRAFT                          |
| Payment Status   | ❌     | UNPAID                         |
| Delivery Address | ❌     | Alamat pengiriman              |
| Tracking Number  | ❌     | TRACK-123                      |
| Invoice Number   | ❌     | INV-001                        |
| Invoice Date     | ❌     | 20/01/2025                     |

> ⚠️ **PENTING**: **Warehouse** adalah field WAJIB! Ini menentukan ke warehouse mana barang akan masuk saat receive.

**Items:**

3. Klik **➕ Add Item** untuk menambah produk
4. Isi detail item:

| Field           | Wajib? | Contoh             |
| --------------- | ------ | ------------------ |
| Product         | ✅     | Laptop Dell XPS 15 |
| Qty Ordered     | ✅     | 10                 |
| Unit Price      | ✅     | Rp 15.000.000      |
| Discount (%)    | ❌     | 5                  |
| Discount Amount | ❌     | Rp 750.000         |
| Tax (%)         | ❌     | 11                 |
| Tax Amount      | ❌     | Rp 1.650.000       |
| Notes           | ❌     | Urgent order       |

5. Subtotal akan terhitung otomatis

**Footer PO:**

| Field            | Penjelasan           | Contoh             |
| ---------------- | -------------------- | ------------------ |
| Subtotal         | Total sebelum diskon | Rp 150.000.000     |
| Discount (%)     | Diskon keseluruhan   | 2                  |
| Discount Amount  | Nilai diskon         | Rp 3.000.000       |
| Tax Amount       | Pajak                | Rp 16.500.000      |
| Shipping Cost    | Biaya kirim          | Rp 500.000         |
| Other Costs      | Biaya lain-lain      | Rp 0               |
| **Total Amount** | **Total akhir**      | **Rp 164.000.000** |
| Payment Method   | Metode pembayaran    | Transfer Bank      |
| Internal Notes   | Catatan internal     | -                  |
| Attachment URLs  | Dokumen pendukung    | -                  |

6. Klik **💾 Simpan**

✅ **PO berhasil dibuat!** Status: DRAFT

---

### 📋 Field-Field Purchase Order (Lengkap)

**PurchaseOrder Table:**

```typescript
{
  id: number;
  po_number: string;              // Auto generate
  supplier_id: string;            // WAJIB
  warehouse_id: number;           // WAJIB - Warehouse tujuan
  order_date: Date;               // WAJIB
  expected_date: Date;            // Optional
  received_date: Date;            // Auto set saat fully received
  status: 'DRAFT' | 'SUBMITTED' | 'PARTIAL' | 'RECEIVED' | 'CANCELLED';
  subtotal: number;
  discount_amount: number;
  discount_percentage: number;
  tax_amount: number;
  shipping_cost: number;
  other_costs: number;
  total_amount: number;
  payment_status: 'UNPAID' | 'PARTIAL' | 'PAID';
  payment_method: string;
  payment_date: Date;
  delivery_address: string;
  tracking_number: string;
  invoice_number: string;
  invoice_date: Date;
  attachment_urls: string[];      // Array of URLs
  notes: string;
  internal_notes: string;
  created_by: string;
  approved_by: string;
  approved_at: Date;
}
```

**PurchaseOrderItem Table:**

```typescript
{
  id: number;
  purchase_order_id: string;
  product_id: number;
  qty_ordered: number;
  qty_received: number;           // Increment saat receive
  unit_price: number;
  discount_percentage: number;
  discount_amount: number;
  tax_percentage: number;
  tax_amount: number;
  subtotal: number;
  notes: string;
  batch_number: string;           // Diisi saat receive (jika batch tracked)
  expiry_date: Date;              // Diisi saat receive (jika perishable)
  serial_numbers: string[];       // Diisi saat receive (jika serial tracked)
}
```

---

### 📥 Cara Receive Purchase Order

**INI BAGIAN PENTING!** Di sini batch/serial tracking akan digunakan dan stock akan masuk ke warehouse yang ditentukan di PO.

#### 1️⃣ Buka List Purchase Order

- Klik **"Purchase Order"** di sidebar

#### 2️⃣ Receive PO

1. Cari PO yang ingin diterima
2. Klik tombol **📥 Receive** pada PO tersebut
3. Dialog **"Receive Purchase Order"** akan muncul

> 📍 **Info**: Barang akan masuk ke warehouse yang sudah ditentukan di PO Header (field `warehouse_id`)

#### 3️⃣ Input Qty Receive

Untuk setiap item, input **Qty Receive** (jumlah yang diterima)

**Contoh:**

- Ordered: 10 pcs
- Received: 0 pcs (sebelumnya)
- **Receive Now: 10 pcs** ← Input di sini

---

### 🔄 Apa yang Terjadi Saat Receive PO?

Sistem akan otomatis melakukan:

1. **Update PO Item**

   ```typescript
   qty_received += qty_receive_now;
   ```

2. **Insert ke `stock_cards`** (Transaction History)

   ```typescript
   {
     product_id: 5,
     warehouse_id: 1,        // Dari PO header
     type: 'IN',
     qty_in: 10,
     qty_out: 0,
     balance: 10,            // Running balance
     reference_type: 'PURCHASE_ORDER',
     reference_id: po_id,
     notes: 'Receive PO PO/202501/0001'
   }
   ```

3. **Insert/Update `product_warehouse_stock`**

   ```typescript
   {
     product_id: 5,
     warehouse_id: 1,
     total_stock: 10,
     batch_quantity: 0,      // Atau 10 jika batch tracked
     serial_quantity: 10,    // Atau 10 jika serial tracked
     general_quantity: 0     // Atau 10 jika standard
   }
   ```

4. **Update `products.current_stock`**

   ```typescript
   current_stock = SUM(product_warehouse_stock.total_stock);
   ```

5. **Insert ke `product_batches`** (jika batch tracked)

   ```typescript
   {
     product_id: 5,
     warehouse_id: 1,
     batch_number: 'BATCH-001',
     quantity: 10,
     expiry_date: '2027-12-31',
     purchase_order_id: po_id
   }
   ```

6. **Insert ke `product_serials`** (jika serial tracked)
   ```typescript
   // 10 records untuk 10 units
   {
     product_id: 5,
     warehouse_id: 1,
     serial_number: 'SN-001',
     status: 'IN_STOCK',
     purchase_order_id: po_id
   }
   ```

> ✅ **Semua otomatis!** Anda hanya perlu input qty dan batch/serial (jika required)

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

| Type       | Penjelasan                 | Contoh               | Warehouse Field     |
| ---------- | -------------------------- | -------------------- | ------------------- |
| IN         | Stok masuk (selain PO)     | Return dari customer | warehouse_id        |
| OUT        | Stok keluar (selain sales) | Rusak, hilang        | warehouse_id        |
| ADJUSTMENT | Penyesuaian stok           | Koreksi stok opname  | warehouse_id        |
| TRANSFER   | Transfer antar warehouse   | Dari gudang A ke B   | warehouse_from + to |

### Cara Membuat Stock Movement

#### 1️⃣ Akses Menu Stock Movement

- Klik **"Stock Movement"** di sidebar Inventory

#### 2️⃣ Buat Movement Baru

1. Klik tombol **➕ Add**
2. Isi form:

**Untuk Type: IN / OUT / ADJUSTMENT**

| Field           | Wajib? | Contoh                         |
| --------------- | ------ | ------------------------------ |
| Movement Number | ✅     | SM/202501/0001 (Auto generate) |
| Type            | ✅     | OUT                            |
| Product         | ✅     | Laptop Dell XPS 15             |
| **Warehouse**   | ✅     | **Gudang Pusat**               |
| Quantity        | ✅     | 1                              |
| Unit Cost       | ❌     | Rp 15.000.000                  |
| Reason          | ❌     | Damaged                        |
| Reason Detail   | ❌     | Layar pecah                    |
| Movement Date   | ✅     | 15/01/2025                     |
| Notes           | ❌     | Rusak saat handling            |

**Untuk Type: TRANSFER**

| Field              | Wajib? | Contoh                         |
| ------------------ | ------ | ------------------------------ |
| Movement Number    | ✅     | SM/202501/0002 (Auto generate) |
| Type               | ✅     | TRANSFER                       |
| Product            | ✅     | Laptop Dell XPS 15             |
| **Warehouse From** | ✅     | **Gudang Pusat**               |
| **Warehouse To**   | ✅     | **Gudang Cabang A**            |
| Quantity           | ✅     | 5                              |
| Unit Cost          | ❌     | Rp 15.000.000                  |
| Movement Date      | ✅     | 15/01/2025                     |
| Notes              | ❌     | Transfer untuk cabang          |

3. Klik **💾 Simpan**

---

### 🔄 Apa yang Terjadi Saat Stock Movement?

#### Type: IN (Stock Masuk)

```typescript
// Insert ke stock_cards
{
  product_id: 5,
  warehouse_id: 1,
  type: 'IN',
  qty_in: 10,
  qty_out: 0,
  balance: previous_balance + 10,
  reference_type: 'STOCK_MOVEMENT',
  reference_id: movement_id
}

// Update product_warehouse_stock
warehouse_stock.total_stock += 10
```

#### Type: OUT (Stock Keluar)

```typescript
// Insert ke stock_cards
{
  product_id: 5,
  warehouse_id: 1,
  type: 'OUT',
  qty_in: 0,
  qty_out: 5,
  balance: previous_balance - 5,
  reference_type: 'STOCK_MOVEMENT',
  reference_id: movement_id
}

// Update product_warehouse_stock
warehouse_stock.total_stock -= 5
```

#### Type: TRANSFER (Transfer Antar Warehouse)

```typescript
// Insert 2 stock cards:

// 1. OUT dari warehouse source
{
  product_id: 5,
  warehouse_id: 1,        // Warehouse From
  type: 'TRANSFER',
  qty_in: 0,
  qty_out: 5,
  balance: previous_balance - 5,
  notes: 'Transfer OUT to warehouse 2'
}

// 2. IN ke warehouse destination
{
  product_id: 5,
  warehouse_id: 2,        // Warehouse To
  type: 'TRANSFER',
  qty_in: 5,
  qty_out: 0,
  balance: previous_balance + 5,
  notes: 'Transfer IN from warehouse 1'
}

// Update 2 product_warehouse_stock:
warehouse_1.total_stock -= 5
warehouse_2.total_stock += 5
```

> 💡 **Tips**: Untuk produk dengan batch/serial, system akan otomatis allocate atau minta user pilih

---

### 📋 Field-Field Stock Movement (Lengkap)

```typescript
StockMovement {
  id: number;
  movement_number: string;        // Auto generate
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  product_id: number;
  warehouse_id: number;           // Untuk IN/OUT/ADJUSTMENT
  warehouse_from: number;         // Untuk TRANSFER (source)
  warehouse_to: number;           // Untuk TRANSFER (destination)
  quantity: number;
  unit_cost: number;
  total_value: number;
  reason: string;
  reason_detail: string;
  reference_type: string;
  reference_id: string;
  batch_number: string;
  serial_numbers: string[];
  approved_by: string;
  approved_at: Date;
  notes: string;
  movement_date: Date;
  created_at: Date;
  created_by: string;
}
```

---

## 📊 Stock Opname

Stock Opname adalah proses penghitungan fisik stok untuk memastikan data di sistem sesuai dengan stok fisik **di warehouse tertentu**.

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
| **Warehouse** | ❌     | **Gudang Pusat**               |
| Status        | ✅     | DRAFT                          |
| Notes         | ❌     | Stock opname akhir bulan       |

> 📍 **Info**: Jika warehouse dipilih, hanya produk di warehouse tersebut yang akan di-opname. Jika tidak dipilih, semua produk di semua warehouse.

#### 3️⃣ Tambah Items

3. Klik **➕ Add Item** atau **Load Products**
4. Pilih produk
5. System akan load **System Stock** (stok di sistem untuk warehouse ini)
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
9. Ubah status menjadi **APPROVED**
10. Klik **Approve** button
11. System akan otomatis adjust stok sesuai physical stock

✅ **Hasil:**

- Laptop Dell XPS 15: 10 → 9 (berkurang 1)
- Mouse Logitech: 50 → 52 (bertambah 2)
- Keyboard Mechanical: 20 (tidak berubah)

> ⚠️ **Penting**: Stock opname yang sudah approved tidak bisa diubah!

---

### 🔄 Apa yang Terjadi Saat Approve Stock Opname?

Untuk setiap item dengan `difference ≠ 0`:

#### Jika Difference Positif (+2)

```typescript
// Insert ke stock_cards
{
  product_id: 5,
  warehouse_id: 1,
  type: 'ADJUSTMENT',
  qty_in: 2,              // Positive adjustment
  qty_out: 0,
  balance: previous_balance + 2,
  reference_type: 'STOCK_OPNAME',
  reference_id: opname_id,
  notes: 'Stock Opname: SO/202501/0001 - Adjustment (+2)'
}

// Update product_warehouse_stock
warehouse_stock.total_stock += 2
```

#### Jika Difference Negatif (-1)

```typescript
// Insert ke stock_cards
{
  product_id: 5,
  warehouse_id: 1,
  type: 'ADJUSTMENT',
  qty_in: 0,
  qty_out: 1,             // Negative adjustment
  balance: previous_balance - 1,
  reference_type: 'STOCK_OPNAME',
  reference_id: opname_id,
  notes: 'Stock Opname: SO/202501/0001 - Adjustment (-1)'
}

// Update product_warehouse_stock
warehouse_stock.total_stock -= 1
```

---

### 📋 Field-Field Stock Opname (Lengkap)

**StockOpname Table:**

```typescript
{
  id: number;
  opname_number: string; // Auto generate
  opname_date: Date;
  warehouse_id: number; // Optional - warehouse yang di-opname
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED';
  total_products: number; // Jumlah produk yang di-opname
  total_discrepancy: number; // Total selisih (abs)
  notes: string;
  created_at: Date;
  created_by: string;
  approved_by: string;
  approved_at: Date;
}
```

**StockOpnameItem Table:**

```typescript
{
  id: number;
  stock_opname_id: number;
  product_id: number;
  system_stock: number; // Stock di sistem
  physical_stock: number; // Stock hasil hitung fisik
  difference: number; // physical - system
  notes: string;
  verified_by: string;
}
```

---

### 📊 Status Stock Opname

| Status      | Penjelasan                              |
| ----------- | --------------------------------------- |
| DRAFT       | Baru dibuat, belum mulai hitung         |
| IN_PROGRESS | Sedang proses hitung fisik              |
| COMPLETED   | Hitung selesai, menunggu approval       |
| APPROVED    | Sudah approved, stock sudah disesuaikan |

> 💡 **Tips**: Lakukan stock opname minimal 1x per bulan untuk memastikan akurasi data!

---

## 📈 Reports & Monitoring

### 1. Stock Card (Transaction History)

Stock Card adalah **history transaksi per produk per warehouse**. Setiap transaksi inventory akan tercatat di sini.

**Cara Akses:**

- Klik **"Stock Card"** di sidebar
- Akan muncul **Stock Overview** table

**Stock Overview Table menampilkan:**

| Column       | Penjelasan                      |
| ------------ | ------------------------------- |
| Product Name | Nama produk                     |
| SKU          | Kode produk                     |
| Warehouse    | Nama warehouse                  |
| Total Stock  | Stock saat ini di warehouse ini |
| Batch Qty    | Qty dari batch tracking         |
| Serial Qty   | Qty dari serial tracking        |
| General Qty  | Qty general (non-batch/serial)  |
| Last Updated | Terakhir diupdate               |
| **Action**   | **Detail button**               |

**Cara Lihat Detail Transaction:**

1. Klik tombol **"Detail"** pada row produk+warehouse
2. Modal akan muncul menampilkan **Stock Card History**

**Stock Card History menampilkan:**

| Column           | Penjelasan                                |
| ---------------- | ----------------------------------------- |
| Transaction Date | Tanggal transaksi                         |
| Type             | IN / OUT / ADJUSTMENT / TRANSFER          |
| Qty In           | Jumlah masuk                              |
| Qty Out          | Jumlah keluar                             |
| Balance          | Saldo stock setelah transaksi (running)   |
| Unit Cost        | Harga per unit                            |
| Total Value      | Total nilai transaksi                     |
| Reference        | PO Number, Movement Number, Opname Number |
| Notes            | Catatan transaksi                         |
| Batch Number     | Nomor batch (jika ada)                    |
| Serial Number    | Nomor serial (jika ada)                   |

**Contoh Stock Card:**

```
Product: Laptop Dell XPS 15
Warehouse: Gudang Pusat

Transaction History:
┌──────────────┬──────┬────────┬─────────┬─────────┬────────────────────┐
│ Date         │ Type │ Qty In │ Qty Out │ Balance │ Reference          │
├──────────────┼──────┼────────┼─────────┼─────────┼────────────────────┤
│ 15/01/2025   │ IN   │ 10     │ 0       │ 10      │ PO/202501/0001     │
│ 16/01/2025   │ OUT  │ 0      │ 2       │ 8       │ SM/202501/0001     │
│ 20/01/2025   │ IN   │ 5      │ 0       │ 13      │ PO/202501/0002     │
│ 25/01/2025   │ ADJ  │ 0      │ 1       │ 12      │ SO/202501/0001     │
└──────────────┴──────┴────────┴─────────┴─────────┴────────────────────┘
```

> 💡 **Tips**: Stock Card adalah **audit trail** lengkap untuk setiap produk di setiap warehouse!

---

### 📊 Stock Overview vs Stock Card

**Stock Overview** (`product_warehouse_stock` table):

- Snapshot stock **saat ini**
- Per product + warehouse
- Menampilkan total_stock, batch_qty, serial_qty, general_qty

**Stock Card** (`stock_cards` table):

- **History transaksi** lengkap
- Per product + warehouse
- Menampilkan semua IN/OUT/ADJUSTMENT/TRANSFER
- Running balance per transaksi

**Hubungan:**

```
Stock Overview.total_stock = Stock Card.balance (transaksi terakhir)
```

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
- **Warehouse sudah dipilih di PO header**
- Qty receive tidak melebihi qty ordered
- Batch/serial sudah diisi (jika required)

**Q: Error "Purchase Order must have warehouse_id"?**
A: **Warehouse adalah field WAJIB di PO!** Pilih warehouse tujuan saat create PO.

**Q: Error "Product requires batch number"?**
A: Product di-set batch tracked (`is_batch_tracked = true`). Input batch number sebelum receive.

**Q: Error "Serial number already exists"?**
A: Serial number harus unique. Gunakan serial yang berbeda.

**Q: Error "Expected X serial numbers, got Y"?**
A: Jumlah serial harus sama dengan qty. Check input serial numbers (one per line).

**Q: Stock Card kosong / tidak ada data?**
A: Kemungkinan penyebab:

1. Belum pernah receive PO → Lakukan receive PO dulu
2. Observable tidak di-subscribe dengan benar → Check console untuk error
3. Database belum ready → Refresh halaman

**Q: Stock Overview tidak menampilkan warehouse?**
A: Check:

- Apakah PO sudah di-receive dengan warehouse_id?
- Apakah `product_warehouse_stock` table terisi?
- Buka DevTools → Application → IndexedDB → product_warehouse_stock

**Q: Balance di Stock Card tidak akurat?**
A: Balance dihitung otomatis saat insert stock card:

```
balance = previous_balance + qty_in - qty_out
```

Jika tidak akurat, kemungkinan ada transaksi yang tidak tercatat.

**Q: Batch tidak muncul di list?**
A: Check:

- Batch sudah di-receive?
- Batch masih active (`is_active = true`)?
- Quantity batch > 0?
- Check table `product_batches` di IndexedDB

**Q: Serial number tidak bisa di-track?**
A: Pastikan:

- Product di-set serial tracked (`is_serial_tracked = true`)
- Serial sudah di-receive
- Serial number benar
- Status serial = 'IN_STOCK'
- Check table `product_serials` di IndexedDB

**Q: Stock tidak berkurang saat sales?**
A: Check:

- Stock movement sudah dibuat?
- Type movement = OUT?
- Quantity sudah benar?
- Warehouse sudah benar?
- Check `stock_cards` table untuk transaksi OUT

**Q: Stock opname tidak bisa approve?**
A: Pastikan:

- Semua items sudah diisi physical stock
- Status masih DRAFT atau IN_PROGRESS atau COMPLETED
- User punya permission approve
- Warehouse sudah dipilih (jika required)

**Q: Transfer antar warehouse tidak jalan?**
A: Pastikan:

- Type = 'TRANSFER'
- `warehouse_from` dan `warehouse_to` sudah diisi
- `warehouse_from` ≠ `warehouse_to`
- Stock di warehouse source cukup

**Q: Product stock tidak update setelah receive PO?**
A: Check flow:

1. Apakah `stock_cards` terisi? → Check table
2. Apakah `product_warehouse_stock` terisi? → Check table
3. Apakah `products.current_stock` terupdate? → Check table
4. Buka Console untuk lihat error

**Q: Bagaimana cara debug jika stock cards tidak tersimpan?**
A:

1. Buka DevTools → Console
2. Cari error message (biasanya merah)
3. Check apakah ada error "await has no effect" → Berarti Observable tidak di-convert ke Promise
4. Check apakah `firstValueFrom()` sudah digunakan
5. Check apakah service method return Observable atau Promise

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

## � Tuechnical Details & Debugging

### Database Tables Overview

**Core Tables:**

1. **products** - Master data produk
2. **warehouses** - Master data warehouse
3. **suppliers** - Master data supplier
4. **categories** - Master data kategori

**Transaction Tables:**

5. **purchase_orders** - Header PO
6. **purchase_order_items** - Detail items PO
7. **stock_movements** - Transaksi stock movement
8. **stock_opnames** - Header stock opname
9. **stock_opname_items** - Detail items stock opname

**Tracking Tables:**

10. **stock_cards** - **Transaction history per product per warehouse**
11. **product_warehouse_stock** - **Current stock per product per warehouse**
12. **product_batches** - Batch tracking data
13. **product_serials** - Serial number tracking data

---

### 🔍 Cara Debug Stock Cards Issue

#### Step 1: Check Browser Console

```javascript
// Buka DevTools (F12) → Console
// Cari error messages (warna merah)

// Common errors:
// ❌ "await has no effect on the type of this expression"
//    → Observable tidak di-convert ke Promise
//    → Solusi: Gunakan firstValueFrom()

// ❌ "Database operation failed"
//    → Database error
//    → Solusi: Check database connection

// ❌ "Product requires batch number"
//    → Validation error
//    → Solusi: Input batch number
```

#### Step 2: Check IndexedDB

```
1. Buka DevTools (F12)
2. Tab "Application"
3. Sidebar kiri → Storage → IndexedDB → fglabstudio
4. Check tables:
   - stock_cards (harus ada data setelah receive PO)
   - product_warehouse_stock (harus ada data per warehouse)
   - product_batches (jika batch tracked)
   - product_serials (jika serial tracked)
```

#### Step 3: Verify Data Flow

**Saat Receive PO, check:**

```typescript
// 1. PO Item updated?
purchase_order_items:
  qty_received: 0 → 10 ✅

// 2. Stock Card created?
stock_cards:
  product_id: 5
  warehouse_id: 1
  type: 'IN'
  qty_in: 10
  balance: 10 ✅

// 3. Warehouse Stock updated?
product_warehouse_stock:
  product_id: 5
  warehouse_id: 1
  total_stock: 10 ✅

// 4. Product total stock updated?
products:
  current_stock: 10 ✅
```

#### Step 4: Check Service Methods

```typescript
// Pastikan method return Observable di-handle dengan benar:

// ❌ WRONG:
await this.stockCardService.addStockCard(...)

// ✅ CORRECT:
await firstValueFrom(this.stockCardService.addStockCard(...))
```

---

### 📊 Data Relationship Diagram

```
products (1) ──────────────┐
                           │
                           ├──> product_warehouse_stock (N)
                           │    - Per warehouse
                           │    - Current stock snapshot
                           │
                           ├──> stock_cards (N)
                           │    - Per warehouse
                           │    - Transaction history
                           │    - Running balance
                           │
                           ├──> product_batches (N)
                           │    - If batch tracked
                           │    - Per warehouse
                           │
                           └──> product_serials (N)
                                - If serial tracked
                                - Per warehouse

warehouses (1) ────────────┐
                           │
                           ├──> product_warehouse_stock (N)
                           ├──> stock_cards (N)
                           ├──> product_batches (N)
                           ├──> product_serials (N)
                           └──> purchase_orders (N)
```

---

### 🧪 Testing Checklist

**Test 1: Receive PO Standard Product**

- [ ] Create PO with warehouse
- [ ] Receive items (qty only)
- [ ] Check stock_cards table → Should have 1 entry (type: IN)
- [ ] Check product_warehouse_stock → Should have 1 entry
- [ ] Check products.current_stock → Should be updated

**Test 2: Receive PO Batch Tracked Product**

- [ ] Create PO with warehouse
- [ ] Receive items (qty + batch + expiry)
- [ ] Check stock_cards table → Should have 1 entry
- [ ] Check product_batches table → Should have 1 entry
- [ ] Check product_warehouse_stock → batch_quantity updated

**Test 3: Receive PO Serial Tracked Product**

- [ ] Create PO with warehouse
- [ ] Receive items (qty + serials)
- [ ] Check stock_cards table → Should have 1 entry
- [ ] Check product_serials table → Should have N entries (N = qty)
- [ ] Check product_warehouse_stock → serial_quantity updated

**Test 4: Stock Movement OUT**

- [ ] Create movement (type: OUT)
- [ ] Check stock_cards table → Should have 1 entry (type: OUT)
- [ ] Check product_warehouse_stock → total_stock decreased

**Test 5: Stock Movement TRANSFER**

- [ ] Create movement (type: TRANSFER)
- [ ] Check stock_cards table → Should have 2 entries (OUT + IN)
- [ ] Check product_warehouse_stock → 2 records updated

**Test 6: Stock Opname**

- [ ] Create opname with difference
- [ ] Approve opname
- [ ] Check stock_cards table → Should have entries for adjusted items
- [ ] Check product_warehouse_stock → Stock adjusted

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
│   4. Warehouse ⭐ (PENTING!)                                │
│   5. Product (pilih tracking method)                        │
│                                                             │
│ 📦 TRACKING METHODS:                                        │
│   • Standard: Qty only                                      │
│   • Batch: is_batch_tracked = true                         │
│   • Serial: is_serial_tracked = true                       │
│   • Both: Batch + Serial = true                            │
│                                                             │
│ 🛒 PURCHASE ORDER:                                          │
│   • Create PO → Pilih WAREHOUSE ⭐ → Add items → Save      │
│   • Receive PO → Input qty + batch/serial → Receive        │
│   • Status: DRAFT → SUBMITTED → PARTIAL → RECEIVED         │
│   • ⚠️ WAREHOUSE WAJIB di PO header!                       │
│                                                             │
│ 📥 RECEIVE PO (Stock masuk ke warehouse di PO):            │
│   Standard: Input qty only                                  │
│   Batch: Input qty + batch number + expiry                 │
│   Serial: Input qty + serial numbers (one per line)        │
│   Both: Input qty + batch + serials                        │
│                                                             │
│ 📤 STOCK MOVEMENT:                                          │
│   IN/OUT/ADJUSTMENT: Pilih warehouse                        │
│   TRANSFER: Pilih warehouse_from + warehouse_to            │
│   System auto create stock_cards entry                     │
│                                                             │
│ 📊 STOCK TRACKING:                                          │
│   • stock_cards: Transaction history per warehouse         │
│   • product_warehouse_stock: Current stock per warehouse   │
│   • Balance = previous_balance + qty_in - qty_out          │
│                                                             │
│ 📊 MONITORING:                                              │
│   • Stock Card: View transaction history                   │
│   • Stock Overview: View current stock per warehouse       │
│   • Low Stock: Check weekly                                 │
│   • Batch Expiry: Check monthly                            │
│   • Serial Status: Track per unit                          │
│   • Stock Opname: Monthly per warehouse                    │
│                                                             │
│ 🔧 DEBUGGING:                                               │
│   • Check Console for errors                               │
│   • Check IndexedDB → stock_cards table                    │
│   • Check IndexedDB → product_warehouse_stock table        │
│   • Verify firstValueFrom() used for Observables           │
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
   │  ├─ 📦 Batch (is_batch_tracked = true)
   │  ├─ 🔢 Serial (is_serial_tracked = true)
   │  └─ 📦🔢 Both (both = true)
   └─ Save product

2. CREATE PURCHASE ORDER
   ├─ Pilih supplier
   ├─ ⭐ Pilih WAREHOUSE (WAJIB!)
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
   ├─ Check warehouse_id exists
   ├─ Check batch/serial requirements
   ├─ Validate serial uniqueness
   ├─ Validate qty vs serial count
   └─ Show errors if any

5. SYSTEM PROCESS (If valid)
   ├─ Update PO item qty_received
   │
   ├─ INSERT stock_cards:
   │  ├─ product_id
   │  ├─ warehouse_id ⭐ (from PO)
   │  ├─ type: 'IN'
   │  ├─ qty_in: qty_received
   │  ├─ balance: previous + qty_in
   │  └─ reference: PO number
   │
   ├─ INSERT/UPDATE product_warehouse_stock:
   │  ├─ product_id
   │  ├─ warehouse_id ⭐
   │  ├─ total_stock += qty
   │  ├─ batch_quantity (if batch)
   │  ├─ serial_quantity (if serial)
   │  └─ general_quantity (if standard)
   │
   ├─ UPDATE products.current_stock:
   │  └─ SUM(all warehouses)
   │
   ├─ [If Batch] INSERT product_batches:
   │  ├─ product_id
   │  ├─ warehouse_id ⭐
   │  ├─ batch_number
   │  ├─ quantity
   │  └─ expiry_date
   │
   ├─ [If Serial] INSERT product_serials:
   │  ├─ product_id
   │  ├─ warehouse_id ⭐
   │  ├─ serial_number
   │  └─ status: 'IN_STOCK'
   │
   ├─ Update PO status
   └─ Send notification

6. STOCK MOVEMENT
   ├─ Create movement
   ├─ Pilih warehouse (IN/OUT/ADJUSTMENT)
   ├─ Atau pilih warehouse_from + to (TRANSFER)
   │
   ├─ INSERT stock_cards:
   │  ├─ For IN/OUT: 1 entry
   │  └─ For TRANSFER: 2 entries (OUT + IN)
   │
   ├─ UPDATE product_warehouse_stock:
   │  ├─ For IN/OUT: 1 warehouse
   │  └─ For TRANSFER: 2 warehouses
   │
   └─ UPDATE products.current_stock

7. STOCK OPNAME
   ├─ Create opname (pilih warehouse)
   ├─ Input physical stock
   ├─ Calculate difference
   ├─ Approve opname
   │
   ├─ For each item with difference:
   │  ├─ INSERT stock_cards (type: ADJUSTMENT)
   │  ├─ UPDATE product_warehouse_stock
   │  └─ UPDATE products.current_stock
   │
   └─ Mark opname as APPROVED

8. MONITORING & REPORTS
   ├─ Stock Card: View per product per warehouse
   ├─ Stock Overview: Current stock per warehouse
   ├─ Low stock alert
   ├─ Batch expiry report
   ├─ Serial tracking
   └─ Stock value report

9. MONTHLY CLOSING
   ├─ Stock opname per warehouse
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
