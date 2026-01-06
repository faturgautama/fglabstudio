# 📦 Panduan Mudah Sistem Inventory

> **Panduan praktis untuk mengelola inventory dengan mudah dan cepat**

---

## 🎯 Mulai dari Sini

### Apa yang Bisa Dilakukan?

Sistem ini membantu Anda:

- ✅ Kelola stok barang
- ✅ Buat pesanan ke supplier
- ✅ Lacak nomor batch dan serial
- ✅ Monitor stok di berbagai gudang
- ✅ Cek barang yang hampir habis atau kadaluarsa

---

## 🚀 Langkah Awal (Wajib Ikuti Urutan Ini!)

### 1️⃣ Isi Data Perusahaan

**Kenapa penting?** Data ini akan muncul di semua dokumen dan laporan.

**Cara:**

1. Klik menu **"Inventory"** → **"Company Setting"**
2. Isi data berikut:

| Yang Harus Diisi           | Contoh               |
| -------------------------- | -------------------- |
| Nama Perusahaan\*          | PT. Maju Bersama     |
| Alamat                     | Jl. Sudirman No. 123 |
| Telepon                    | 021-12345678         |
| Email                      | info@perusahaan.com  |
| Mata Uang\*                | IDR                  |
| Kode Produk (SKU Prefix)\* | PRD                  |

\*Wajib diisi

3. Klik **Simpan**

---

### 2️⃣ Buat Kategori Produk

**Untuk apa?** Mengelompokkan produk agar mudah dicari.

**Cara:**

1. Klik **"Category"**
2. Klik tombol **+ Add**
3. Isi nama kategori (contoh: Elektronik, Makanan, Pakaian)
4. Klik **Simpan**

💡 **Tips:** Buat minimal 3-5 kategori dulu

---

### 3️⃣ Tambah Supplier

**Untuk apa?** Menyimpan data pemasok barang.

**Cara:**

1. Klik **"Supplier"**
2. Klik **+ Add**
3. Isi data supplier:
   - Nama Supplier\*
   - Kontak Person
   - Telepon
   - Email
   - Alamat
4. Klik **Simpan**

---

### 4️⃣ Buat Gudang/Warehouse

**Untuk apa?** Menentukan lokasi penyimpanan barang.

**Cara:**

1. Klik **"Warehouse"**
2. Klik **+ Add**
3. Isi data:
   - Kode\* (contoh: GD-001)
   - Nama\* (contoh: Gudang Pusat)
   - Alamat
   - Centang **"Is Default"** untuk gudang utama
4. Klik **Simpan**

⚠️ **Penting:** Minimal harus ada 1 gudang!

---

### 5️⃣ Tambah Produk

**Cara:**

1. Klik **"Product"**
2. Klik **+ Add**
3. Isi data produk:

**Data Wajib:**

- SKU (otomatis terisi)
- Nama Produk
- Unit (PCS, BOX, KG, dll)
- Harga Beli
- Harga Jual
- Stok Minimal

**Pilih Metode Tracking:**

| Metode               | Kapan Digunakan           | Contoh Produk           |
| -------------------- | ------------------------- | ----------------------- |
| **Standard**         | Produk biasa              | Alat tulis, barang umum |
| **📦 Batch**         | Ada tanggal kadaluarsa    | Obat, makanan, kosmetik |
| **🔢 Serial**        | Barang mahal, ada garansi | Laptop, HP, kendaraan   |
| **📦 + 🔢 Keduanya** | Perlu tracking lengkap    | HP (batch + IMEI)       |

4. Klik **Simpan**

---

## 🛒 Cara Pesan Barang (Purchase Order)

### Langkah 1: Buat PO

1. Klik **"Purchase Order"**
2. Klik **+ Add**
3. Isi:
   - Pilih **Supplier\***
   - Pilih **Gudang Tujuan\*** ⭐ (Penting!)
   - Tanggal Order\*
4. Klik **+ Add Item** untuk tambah produk
5. Pilih produk dan isi jumlah pesanan
6. Klik **Simpan**

✅ PO berhasil dibuat dengan status DRAFT

---

### Langkah 2: Terima Barang

Setelah barang datang dari supplier:

1. Buka list **Purchase Order**
2. Cari PO yang ingin diterima
3. Klik tombol **📥 Receive**
4. Isi jumlah barang yang diterima

**Untuk Produk Standard:**

- Isi jumlah saja → Klik **Receive**

**Untuk Produk dengan Batch 📦:**

- Isi jumlah
- Isi **Nomor Batch** (contoh: BATCH-2025-01)
- Isi **Tanggal Kadaluarsa** (jika ada)
- Klik **Receive**

**Untuk Produk dengan Serial 🔢:**

- Isi jumlah (contoh: 3)
- Isi **Nomor Serial** (satu nomor per baris):
  ```
  LAPTOP-001
  LAPTOP-002
  LAPTOP-003
  ```
- Klik **Receive**

5. Selesai! Stok otomatis bertambah di gudang yang dipilih

---

## 📤 Kelola Pergerakan Stok

### Kapan Digunakan?

- Barang rusak/hilang
- Return dari customer
- Transfer antar gudang
- Koreksi stok

### Cara:

1. Klik **"Stock Movement"**
2. Klik **+ Add**
3. Pilih jenis:

**Stok Masuk (IN):**

- Pilih gudang
- Pilih produk
- Isi jumlah masuk

**Stok Keluar (OUT):**

- Pilih gudang
- Pilih produk
- Isi jumlah keluar
- Isi alasan (rusak, hilang, dll)

**Transfer Antar Gudang:**

- Pilih gudang asal
- Pilih gudang tujuan
- Pilih produk
- Isi jumlah

4. Klik **Simpan**

---

## 📊 Cek Stok Barang

### Lihat Ringkasan & Riwayat Stok (Stock Card)

1. Klik **"Stock Card"**
2. Akan muncul halaman **"Stock Summary"**
3. **Pilih Warehouse** di dropdown untuk filter stok per gudang
4. Tabel akan menampilkan:

   - SKU produk
   - Nama produk
   - Total stok
   - Tipe tracking (📦 Batch / 🔢 Serial / 📋 General)
   - Breakdown qty (Batch Qty, Serial Qty, General Qty)

5. Klik tombol **ikon list (📋)** di kolom "Detail Stok" untuk melihat riwayat pergerakan

**Di Modal Detail, Anda bisa lihat:**

- Informasi produk & warehouse
- Ringkasan stok (Total, Batch, Serial, General)
- **Tabel Pergerakan Stok** dengan detail:
  - Tanggal transaksi
  - Tipe (IN/OUT/TRANSFER/ADJUSTMENT)
  - Qty Masuk (ditampilkan dengan +)
  - Qty Keluar (ditampilkan dengan -)
  - Referensi (PO Number, Movement Number, dll)
  - Batch/Serial Number (jika ada)
  - Catatan

**Visual Flow:**

```
Menu Stock Card → Stock Summary Muncul
                        ↓
        Pilih Warehouse di Dropdown (filter)
                        ↓
        Tabel menampilkan semua produk di warehouse
        (SKU, Nama, Total Stock, Tipe Tracking, dll)
                        ↓
        Klik Icon List (📋) di kolom "Detail Stok"
                        ↓
        Modal Detail Muncul dengan:
        - Header: Info produk & warehouse
        - Summary: Total/Batch/Serial/General qty
        - Tabel: Riwayat pergerakan lengkap
                        ↓
        Lihat semua transaksi IN/OUT/TRANSFER/ADJUSTMENT
        dengan referensi, batch/serial, dan catatan
```

---

### Cek Barang yang Hampir Habis

Di **Dashboard Inventory**, lihat bagian **"Low Stock Products"**

Akan muncul produk yang stoknya di bawah minimum.

---

### Cek Barang yang Hampir Kadaluarsa

Di **Dashboard Inventory**, lihat bagian **"Expiring Batches"**

Akan muncul batch yang akan kadaluarsa dalam 30 hari.

---

## 📋 Stock Opname (Hitung Fisik)

**Untuk apa?** Memastikan stok di sistem sama dengan stok fisik.

**Kapan?** Minimal 1x per bulan, biasanya akhir bulan.

### Cara:

1. Klik **"Stock Opname"**
2. Klik tombol **+ Add** (di toolbar tabel)
3. Isi informasi header:

   - **No. Opname** (otomatis terisi)
   - **Tanggal** (pilih tanggal opname)
   - **Status** (pilih DRAFT untuk mulai)
   - **Gudang** (pilih gudang yang akan di-opname)
   - **Catatan** (opsional)

4. Klik tombol **"Load Produk"** untuk memuat semua produk di gudang tersebut
   - Sistem akan otomatis mengisi **Stok Sistem** untuk setiap produk
5. Hitung stok fisik di gudang
6. Isi hasil hitungan di kolom **"Stok Fisik"** untuk setiap produk
7. Kolom **"Selisih"** akan terhitung otomatis:

   - Hijau (+) = Stok fisik lebih banyak
   - Merah (-) = Stok fisik lebih sedikit
   - 0 = Sesuai

8. Lihat **Ringkasan** di bagian bawah:

   - Total Produk yang dihitung
   - Total Selisih

9. Jika perlu tambah produk manual, klik **"Tambah Item"**
10. Setelah yakin semua benar, ubah **Status** menjadi **APPROVED**
11. Klik **"Simpan"** atau **"Update"**

✅ Stok di sistem akan disesuaikan otomatis dengan hasil hitungan fisik!

**Catatan Penting:**

- Tombol **"Load Produk"** hanya aktif jika gudang sudah dipilih
- Anda bisa hapus item dengan klik tombol **🗑️ (trash)**
- Setiap item bisa diberi catatan khusus
- Stock opname yang sudah APPROVED tidak bisa diubah lagi

**Visual Flow:**

```
List Stock Opname → Klik + Add → Form Muncul
                                    ↓
                    Isi Header (Tanggal, Status, Gudang)
                                    ↓
                    Klik "Load Produk" (otomatis isi stok sistem)
                                    ↓
                    Isi "Stok Fisik" untuk setiap produk
                                    ↓
                    Selisih terhitung otomatis (hijau/merah)
                                    ↓
                    Lihat Ringkasan (Total Produk & Selisih)
                                    ↓
                    Ubah Status → APPROVED → Simpan
                                    ↓
                    Stok di sistem disesuaikan otomatis ✅
```

---

## 🎨 Memahami Badge & Warna

Sistem menggunakan badge dan warna untuk memudahkan identifikasi:

### Badge Tipe Tracking

| Badge      | Arti                                  | Produk                  |
| ---------- | ------------------------------------- | ----------------------- |
| 📦 Batch   | Produk dengan batch tracking          | Obat, makanan, kosmetik |
| 🔢 Serial  | Produk dengan serial tracking         | Laptop, HP, elektronik  |
| 📋 General | Produk standard tanpa tracking khusus | Alat tulis, barang umum |

### Warna Stock Level

| Warna     | Arti                             | Aksi          |
| --------- | -------------------------------- | ------------- |
| 🟢 Hijau  | Stock cukup                      | Normal        |
| 🟡 Kuning | Stock rendah (mendekati minimum) | Perhatikan    |
| 🔴 Merah  | Stock kritis (di bawah minimum)  | Segera order! |

### Warna Selisih (Stock Opname)

| Warna    | Arti                     | Contoh                   |
| -------- | ------------------------ | ------------------------ |
| 🟢 Hijau | Stok fisik lebih banyak  | +5 (fisik 15, sistem 10) |
| 🔴 Merah | Stok fisik lebih sedikit | -3 (fisik 7, sistem 10)  |
| ⚪ Hitam | Sesuai                   | 0 (fisik = sistem)       |

### Badge Tipe Transaksi

| Badge      | Warna  | Arti                  |
| ---------- | ------ | --------------------- |
| IN         | Hijau  | Barang masuk          |
| OUT        | Merah  | Barang keluar         |
| TRANSFER   | Biru   | Transfer antar gudang |
| ADJUSTMENT | Kuning | Penyesuaian stok      |

---

## 💡 Tips Penting

- Anda bisa hapus item dengan klik tombol **🗑️ (trash)**
- Setiap item bisa diberi catatan khusus
- Stock opname yang sudah APPROVED tidak bisa diubah lagi

---

## 💡 Tips Penting

### ✅ Do's (Yang Harus Dilakukan)

1. **Selalu pilih gudang** saat buat PO atau stock movement
2. **Isi batch/serial dengan benar** saat terima barang
3. **Cek low stock** setiap minggu
4. **Cek batch kadaluarsa** setiap bulan
5. **Stock opname** minimal 1x per bulan
6. **Backup data** secara rutin

### ❌ Don'ts (Yang Harus Dihindari)

1. Jangan lupa pilih gudang di PO
2. Jangan asal isi nomor batch/serial
3. Jangan approve stock opname sebelum yakin
4. Jangan cancel PO yang sudah diterima tanpa alasan jelas

---

## 🆘 Masalah Umum & Solusi

### ❓ "Tidak bisa terima PO"

**Cek:**

- Apakah gudang sudah dipilih di PO?
- Apakah batch/serial sudah diisi (jika required)?
- Apakah jumlah serial sesuai dengan qty?

### ❓ "Error: Product requires batch number"

**Solusi:** Produk ini menggunakan batch tracking. Isi nomor batch sebelum receive.

### ❓ "Error: Serial number already exists"

**Solusi:** Nomor serial harus unik. Gunakan nomor yang berbeda.

### ❓ "Stok tidak bertambah setelah receive PO"

**Cek:**

1. Refresh halaman
2. Pastikan PO sudah di-receive (bukan masih DRAFT)
3. Cek di menu Stock Card apakah ada transaksi masuk

### ❓ "Data tidak muncul"

**Solusi:** Klik tombol **Refresh** atau reload halaman (F5)

---

## 📞 Butuh Bantuan?

Jika masih ada kesulitan:

📧 **Email:** support@fglabstudio.com  
💬 **WhatsApp:** +62 XXX-XXXX-XXXX  
🕐 **Jam Kerja:** Senin-Jumat, 09:00-17:00 WIB

---

## 🎯 Checklist Harian

Gunakan checklist ini untuk memastikan semua berjalan lancar:

**Setiap Hari:**

- [ ] Cek PO yang masuk
- [ ] Terima barang yang datang
- [ ] Cek stok yang hampir habis

**Setiap Minggu:**

- [ ] Review PO yang pending
- [ ] Cek batch yang akan kadaluarsa

**Setiap Bulan:**

- [ ] Stock opname
- [ ] Review laporan stok
- [ ] Backup data

---

## 🎉 Selamat Menggunakan!

Sistem ini dirancang untuk memudahkan pekerjaan Anda.

**Mulai dari yang sederhana:**

1. Setup data awal (perusahaan, kategori, supplier, gudang)
2. Tambah 3-5 produk untuk testing
3. Coba buat 1 PO dan terima barang
4. Setelah paham, baru input data lengkap

**Ingat:** Jangan ragu untuk bertanya jika ada yang kurang jelas!

---

**© 2025 FG Lab Studio - Inventory Management System**
