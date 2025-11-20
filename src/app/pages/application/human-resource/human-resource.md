# 📚 Panduan Lengkap Sistem HR - People App

## Selamat Datang! 👋

Selamat datang di **People App** - Sistem Manajemen HR yang mudah digunakan untuk mengelola data karyawan, absensi, cuti, lembur, dan payroll perusahaan Anda.

---

## 📋 Daftar Isi

1. [Persiapan Awal](#persiapan-awal)
2. [Langkah 1: Pengaturan Perusahaan](#langkah-1-pengaturan-perusahaan)
3. [Langkah 2: Menambah Departemen](#langkah-2-menambah-departemen)
4. [Langkah 3: Menambah Posisi Jabatan](#langkah-3-menambah-posisi-jabatan)
5. [Langkah 4: Menambah Shift Kerja](#langkah-4-menambah-shift-kerja)
6. [Langkah 5: Menambah Karyawan](#langkah-5-menambah-karyawan)
7. [Fitur Lanjutan](#fitur-lanjutan)
8. [Backup & Restore Database](#backup-restore-database)
9. [Tips & Trik](#tips-trik)

---

## 🚀 Persiapan Awal

### Apa yang Perlu Disiapkan?

Sebelum memulai, pastikan Anda sudah menyiapkan:

- ✅ **Data Perusahaan** (Nama, Alamat, NPWP, dll)
- ✅ **Struktur Organisasi** (Daftar Departemen)
- ✅ **Daftar Posisi/Jabatan**
- ✅ **Jadwal Shift Kerja**
- ✅ **Data Karyawan** (Nama, NIK, Kontak, dll)

### Mengakses Aplikasi

1. Buka browser (Chrome, Firefox, atau Edge)
2. Akses URL aplikasi
3. Anda akan langsung masuk ke Dashboard

> 💡 **Tips**: Gunakan browser terbaru untuk performa optimal!

---

## 🏢 Langkah 1: Pengaturan Perusahaan

**⚠️ PENTING**: Ini adalah langkah WAJIB pertama yang harus dilakukan!

### Mengapa Harus Diisi Dulu?

Pengaturan perusahaan adalah fondasi dari seluruh sistem. Data ini akan digunakan untuk:

- Perhitungan BPJS
- Perhitungan Pajak
- Perhitungan Lembur
- Slip Gaji
- Kebijakan Cuti

### Cara Mengisi Pengaturan Perusahaan

#### 1️⃣ Akses Menu Pengaturan

- Klik tombol **⚙️ Pengaturan** di sidebar kiri bawah
- Atau klik menu **"Pengaturan Perusahaan"** di sidebar

#### 2️⃣ Isi Informasi Umum

| Field                   | Penjelasan                     | Contoh                        |
| ----------------------- | ------------------------------ | ----------------------------- |
| **Nama Perusahaan\***   | Nama lengkap perusahaan        | PT. Maju Bersama Indonesia    |
| **Alamat Perusahaan\*** | Alamat lengkap kantor          | Jl. Sudirman No. 123, Jakarta |
| **No. Telp\***          | Nomor telepon kantor           | 021-12345678                  |
| **No. Fax\***           | Nomor fax kantor               | 021-87654321                  |
| **NPWP**                | NPWP perusahaan                | 01.234.567.8-901.000          |
| **Tanggal Berlaku\***   | Kapan aturan ini mulai berlaku | 01 Januari 2025               |
| **Tarif Lembur/Jam\***  | Upah lembur per jam (Rp)       | 50000                         |

> **\*** = Field wajib diisi

#### 3️⃣ Konfigurasi BPJS Ketenagakerjaan

✅ **Centang "Aktifkan BPJS Ketenagakerjaan"** jika perusahaan mendaftar BPJS

| Field                 | Nilai Standar | Penjelasan                  |
| --------------------- | ------------- | --------------------------- |
| Potongan Karyawan     | 2%            | Dipotong dari gaji karyawan |
| Kontribusi Perusahaan | 3.7%          | Ditanggung perusahaan       |

#### 4️⃣ Konfigurasi BPJS Pensiun

✅ **Centang "Aktifkan BPJS Pensiun"** jika perusahaan mendaftar BPJS Pensiun

| Field                 | Nilai Standar | Penjelasan                  |
| --------------------- | ------------- | --------------------------- |
| Potongan Karyawan     | 1%            | Dipotong dari gaji karyawan |
| Kontribusi Perusahaan | 2%            | Ditanggung perusahaan       |

#### 5️⃣ Konfigurasi BPJS Kesehatan

✅ **Centang "Aktifkan BPJS Kesehatan"** jika perusahaan mendaftar BPJS Kesehatan

| Field                 | Nilai Standar | Penjelasan                  |
| --------------------- | ------------- | --------------------------- |
| Potongan Karyawan     | 1%            | Dipotong dari gaji karyawan |
| Kontribusi Perusahaan | 4%            | Ditanggung perusahaan       |

#### 6️⃣ Konfigurasi Pajak (PPh 21)

✅ **Centang "Aktifkan Perhitungan Pajak"** jika ingin otomatis hitung pajak

**Metode Pajak:**

- **Gross**: Pajak dipotong dari gaji kotor
- **Nett**: Pajak ditanggung perusahaan
- **Gross Up**: Gaji sudah termasuk pajak

**Kategori PTKP** (Penghasilan Tidak Kena Pajak):

- **TK0**: Tidak Kawin, 0 tanggungan
- **TK1**: Tidak Kawin, 1 tanggungan
- **TK2**: Tidak Kawin, 2 tanggungan
- **K0**: Kawin, 0 tanggungan
- **K1**: Kawin, 1 tanggungan
- **K2**: Kawin, 2 tanggungan
- **K3**: Kawin, 3 tanggungan

#### 7️⃣ Kebijakan Cuti

Klik tombol **➕ Tambah Cuti** untuk menambah jenis cuti:

**Contoh Kebijakan Cuti Tahunan:**

- Kode: `CUTI_TAHUNAN`
- Nama: `Cuti Tahunan`
- Jenis Cuti: `Cuti Tahunan`
- Total Hari: `12`
- Pembatasan Gender: `Semua`
- ✅ Cuti Berbayar
- ✅ Memerlukan Persetujuan
- ✅ Aktif

**Contoh Cuti Melahirkan:**

- Kode: `CUTI_MELAHIRKAN`
- Nama: `Cuti Melahirkan`
- Jenis Cuti: `Cuti Melahirkan`
- Total Hari: `90`
- Pembatasan Gender: `Perempuan`
- ✅ Cuti Berbayar
- ✅ Memerlukan Persetujuan
- ✅ Aktif

#### 8️⃣ Simpan Pengaturan

Klik tombol **💾 Simpan** di bagian bawah halaman.

✅ **Selamat!** Pengaturan perusahaan berhasil disimpan!

---

## 🏛️ Langkah 2: Menambah Departemen

Departemen adalah divisi/bagian dalam perusahaan (misalnya: IT, HRD, Finance).

### Cara Menambah Departemen

#### 1️⃣ Akses Menu Departemen

- Klik **"Departemen"** di sidebar kiri
- Atau klik ikon lingkaran warna di sidebar dan klik ➕

#### 2️⃣ Tambah Departemen Baru

1. Klik tombol **➕ Add** di pojok kanan atas tabel
2. Isi form yang muncul:

| Field                 | Penjelasan                     | Contoh                            |
| --------------------- | ------------------------------ | --------------------------------- |
| **Kode Departemen\*** | Kode unik departemen           | IT                                |
| **Nama Departemen\*** | Nama lengkap                   | Information Technology            |
| **Warna**             | Warna identitas (untuk visual) | Blue                              |
| **Keterangan**        | Deskripsi singkat              | Departemen IT mengelola teknologi |

3. Klik **💾 Simpan**

#### 3️⃣ Contoh Departemen yang Umum

| Kode  | Nama                       | Warna  |
| ----- | -------------------------- | ------ |
| HRD   | Human Resource Development | Green  |
| FIN   | Finance & Accounting       | Blue   |
| IT    | Information Technology     | Purple |
| OPS   | Operations                 | Orange |
| MKT   | Marketing                  | Pink   |
| SALES | Sales                      | Red    |

> 💡 **Tips**: Buat minimal 3-5 departemen sebelum lanjut ke langkah berikutnya

---

## 👔 Langkah 3: Menambah Posisi Jabatan

Posisi adalah jabatan karyawan dalam departemen (misalnya: Manager, Staff, Supervisor).

### Cara Menambah Posisi Jabatan

#### 1️⃣ Akses Menu Posisi Jabatan

- Klik **"Posisi Jabatan"** di sidebar kiri

#### 2️⃣ Tambah Posisi Baru

1. Klik tombol **➕ Add** di pojok kanan atas
2. Isi form:

| Field             | Penjelasan           | Contoh                 |
| ----------------- | -------------------- | ---------------------- |
| **Kode Posisi\*** | Kode unik jabatan    | IT-MGR                 |
| **Nama Posisi\*** | Nama lengkap jabatan | IT Manager             |
| **Departemen\***  | Pilih departemen     | Information Technology |
| **Keterangan**    | Deskripsi tugas      | Mengelola tim IT       |

3. Klik **💾 Simpan**

#### 3️⃣ Contoh Posisi Berdasarkan Level

**Level Manajemen:**

- Director
- General Manager
- Manager
- Supervisor

**Level Staff:**

- Senior Staff
- Staff
- Junior Staff
- Intern

#### 4️⃣ Contoh Lengkap Per Departemen

**IT Department:**

- IT Director
- IT Manager
- Senior Developer
- Developer
- Junior Developer

**HR Department:**

- HR Manager
- HR Supervisor
- HR Staff
- Recruitment Staff

---

## ⏰ Langkah 4: Menambah Shift Kerja

Shift adalah jadwal kerja karyawan (misalnya: Shift Pagi, Shift Siang, Shift Malam).

### Cara Menambah Shift

#### 1️⃣ Akses Menu Shift

- Klik **"Shift"** di sidebar kiri

#### 2️⃣ Tambah Shift Baru

1. Klik tombol **➕ Add**
2. Isi form:

| Field                | Penjelasan        | Contoh     |
| -------------------- | ----------------- | ---------- |
| **Kode Shift\***     | Kode unik shift   | SHIFT-1    |
| **Nama Shift\***     | Nama shift        | Shift Pagi |
| **Waktu Mulai\***    | Jam masuk kerja   | 08:00      |
| **Waktu Selesai\***  | Jam pulang kerja  | 17:00      |
| **Durasi Istirahat** | Istirahat (menit) | 60         |

3. Klik **💾 Simpan**

#### 3️⃣ Contoh Shift Umum

| Nama          | Mulai | Selesai | Istirahat |
| ------------- | ----- | ------- | --------- |
| Shift Pagi    | 08:00 | 17:00   | 60 menit  |
| Shift Siang   | 13:00 | 22:00   | 60 menit  |
| Shift Malam   | 22:00 | 07:00   | 60 menit  |
| Shift Regular | 09:00 | 18:00   | 60 menit  |

---

## 👥 Langkah 5: Menambah Karyawan

Setelah semua setup di atas selesai, sekarang saatnya input data karyawan!

### Cara Menambah Karyawan

#### 1️⃣ Akses Menu Karyawan

- Klik **"Karyawan"** di sidebar kiri

#### 2️⃣ Tambah Karyawan Baru

1. Klik tombol **➕ Tambah** di pojok kanan atas
2. Anda akan melihat form dengan 4 section

---

### 📝 Section 1: Informasi Dasar

| Field             | Wajib? | Contoh               |
| ----------------- | ------ | -------------------- |
| Kode Karyawan     | ✅     | EMP001               |
| Nama Lengkap      | ✅     | John Doe             |
| Nama Panggilan    | ❌     | John                 |
| Gender            | ✅     | Laki-laki            |
| Email             | ❌     | john.doe@company.com |
| Nomor Telepon     | ❌     | 081234567890         |
| Tanggal Lahir     | ❌     | 15 Januari 1990      |
| Golongan Darah    | ❌     | A                    |
| Status Perkawinan | ❌     | Menikah              |
| Jumlah Tanggungan | ❌     | 2                    |
| Alamat            | ❌     | Jl. Merdeka No. 45   |
| Kota              | ❌     | Jakarta              |
| Provinsi          | ❌     | DKI Jakarta          |
| Kode Pos          | ❌     | 12345                |

---

### 💼 Section 2: Informasi Pekerjaan

| Field              | Wajib? | Contoh                 |
| ------------------ | ------ | ---------------------- |
| Departemen         | ❌     | Information Technology |
| Posisi Jabatan     | ❌     | Developer              |
| Shift Kerja        | ❌     | Shift Pagi             |
| Tipe Karyawan      | ❌     | Full Time              |
| Status Kepegawaian | ❌     | Tetap                  |
| Status Kerja       | ❌     | Aktif                  |
| Tanggal Bergabung  | ❌     | 01 Januari 2024        |
| Akhir Probasi      | ❌     | 01 April 2024          |
| Tanggal Resign     | ❌     | -                      |
| Lokasi Kantor      | ❌     | Head Office Jakarta    |
| Nomor Workstation  | ❌     | WS-101                 |
| Kerja Remote       | ❌     | ☐                      |

**Penjelasan Status:**

- **Tipe Karyawan**: Full Time, Part Time, Kontrak, Magang
- **Status Kepegawaian**: Tetap, Kontrak, Magang
- **Status Kerja**: Aktif, Resign, Suspend, Cuti

---

### 💰 Section 3: Kompensasi & Dokumen

| Field                     | Wajib? | Contoh               |
| ------------------------- | ------ | -------------------- |
| Gaji Pokok                | ❌     | 8000000              |
| Mata Uang                 | ❌     | IDR                  |
| Nomor Rekening            | ❌     | 1234567890           |
| Nama Pemilik Rekening     | ❌     | John Doe             |
| Nama Bank                 | ❌     | BCA                  |
| NPWP                      | ❌     | 12.345.678.9-012.000 |
| NIK (KTP)                 | ❌     | 3201011234567890     |
| Berlaku Hingga (KTP)      | ❌     | Seumur Hidup         |
| Nomor Passport            | ❌     | A1234567             |
| Berlaku Hingga (Passport) | ❌     | 01 Januari 2030      |

---

### 📌 Section 4: Informasi Tambahan

| Field           | Wajib? | Contoh                          |
| --------------- | ------ | ------------------------------- |
| Keahlian/Skills | ❌     | PHP, Laravel, MySQL, JavaScript |
| Catatan         | ❌     | Karyawan teladan 2023           |
| Karyawan Aktif  | ❌     | ✅                              |

---

#### 3️⃣ Simpan Data Karyawan

1. Scroll ke bawah
2. Klik tombol **💾 Simpan**
3. Tunggu notifikasi berhasil
4. Data karyawan akan muncul di tabel

> 💡 **Tips**: Isi minimal data wajib dulu (Kode & Nama), data lain bisa diupdate kemudian!

---

## 🎯 Fitur Lanjutan

Setelah setup dasar selesai, Anda bisa gunakan fitur-fitur ini:

### 📅 1. Absensi

#### Cara Check In/Out Otomatis (Absen Mandiri)

1. Buka menu **"Absensi"**
2. Klik tombol **"Absen Mandiri"**
3. Masukkan **Kode Karyawan**
4. Pilih **Shift** (opsional)
5. Klik **"Check In / Check Out"**

> 🤖 Sistem otomatis deteksi apakah ini check in atau check out!

#### Cara Input Absensi Manual (Admin)

1. Klik tombol **"Absen Manual"**
2. Pilih **Karyawan**
3. Pilih **Tanggal**
4. Isi **Jam Masuk** & **Jam Keluar**
5. Pilih **Shift** (opsional)
6. Centang **Hadir** jika karyawan hadir
7. Klik **💾 Simpan**

#### Cara Import dari Mesin Fingerprint

1. Klik tombol **"Import Mesin"**
2. Pilih **Format Tanggal** sesuai file CSV Anda
3. Klik **"Pilih File CSV"**
4. Sistem akan validasi data otomatis
5. Review data yang akan diimport
6. Klik **"Import"** jika sudah benar

**Format CSV yang Didukung:**

- Harus ada kolom: Kode Karyawan, Tanggal, Jam
- Format tanggal: DD/MM/YYYY, MM/DD/YYYY, atau YYYY-MM-DD

---

### 🏖️ 2. Cuti

#### Cara Mengajukan Cuti

1. Buka menu **"Cuti"**
2. Klik tombol **➕ Tambah**
3. Isi form:
   - Pilih **Karyawan**
   - Pilih **Kebijakan Cuti** (sistem akan tampilkan sisa cuti)
   - Pilih **Tanggal Mulai** & **Tanggal Akhir**
   - Isi **Alasan Cuti**
   - **Total Hari** akan terhitung otomatis
   - **Status** otomatis sesuai kebijakan
4. Klik **💾 Simpan**

#### Cara Approve/Reject Cuti

1. Klik tombol **✓ Approve** atau **✗ Reject** di tabel
2. Konfirmasi keputusan Anda
3. Status akan terupdate otomatis

> ⚠️ **Penting**: Cuti yang sudah approved akan mengurangi sisa cuti karyawan!

---

### ⏱️ 3. Lembur

#### Cara Input Lembur

1. Buka menu **"Lembur"**
2. Klik **➕ Tambah**
3. Isi form:
   - Pilih **Karyawan**
   - Pilih **Tanggal**
   - Isi **Jam Mulai** & **Jam Akhir**
   - **Total Jam** akan terhitung otomatis
   - Pilih **Tipe Lembur**:
     - **Hari Kerja**: Lembur di hari kerja normal
     - **Hari Weekend**: Lembur di Sabtu/Minggu
     - **Hari Libur Umum**: Lembur di hari libur nasional
   - Isi **Alasan Lembur**
4. Klik **💾 Simpan**

#### Cara Approve Lembur

- Sama seperti approve cuti
- Lembur yang approved akan masuk perhitungan payroll

---

### 💵 4. Payroll

#### Cara Generate Payroll Bulanan

1. Buka menu **"Payroll"**
2. Klik tombol **"Generate Payroll"**
3. Pilih **Bulan** yang akan di-generate
4. Klik **"Generate Payroll"**
5. Tunggu proses selesai (mungkin butuh waktu jika karyawan banyak)

**Apa yang Dihitung Otomatis:**

- ✅ Gaji Pokok dari data karyawan
- ✅ Tunjangan Lembur yang approved
- ✅ Potongan BPJS Kesehatan
- ✅ Potongan BPJS Ketenagakerjaan
- ✅ Potongan BPJS Pensiun
- ✅ Potongan Cuti Tidak Bayar
- ✅ Potongan Pajak PPh 21
- ✅ Gaji Bersih (Take Home Pay)

#### Cara Edit Payroll Manual

1. Klik tombol **ℹ️ Detail** pada payroll yang ingin diedit
2. Anda bisa menambah:
   - **Tunjangan Tambahan** (Transport, Makan, dll)
   - **Potongan Tambahan** (Pinjaman, Denda, dll)
3. Klik nama field untuk mengedit jumlahnya
4. **Total akan terhitung otomatis**
5. Klik **💾 Simpan**

#### Cara Print Slip Gaji

1. Buka detail payroll
2. Klik tombol **🖨️ Print Slip Gaji**
3. Preview slip gaji akan terbuka
4. Klik **"Cetak / Print"**
5. Pilih printer atau save as PDF

#### Cara Tandai Sudah Dibayar

1. Klik tombol **✓ Tandai Dibayar** di tabel payroll
2. Konfirmasi
3. Status akan berubah menjadi **PAID**

---

### 📆 5. Schedule (Kalender Cuti)

Menu ini menampilkan **timeline visual** cuti seluruh karyawan.

#### Cara Menggunakan Schedule

1. Buka menu **"Schedule"**
2. Gunakan tab **Departemen** untuk filter by departemen
3. Gunakan **Search Box** untuk cari karyawan
4. Gunakan tombol **◀ ▶** untuk navigasi bulan
5. Klik **Today** untuk kembali ke bulan ini
6. **Hover** pada bar cuti untuk lihat detail

**Legend Warna Cuti:**

- 🔵 **Biru**: Cuti Tahunan
- 🟣 **Ungu**: Cuti Ayah
- 🔴 **Merah**: Cuti Sakit
- 🟢 **Hijau**: Cuti Lainnya
- 🟠 **Orange**: Cuti Tidak Bayar
- 🟡 **Pink**: Cuti Melahirkan

---

## 💾 Backup & Restore Database

### 🔽 Cara Download Database (Backup)

**Kapan Harus Backup?**

- Setiap akhir bulan
- Sebelum generate payroll
- Sebelum import data besar
- Sebelum update sistem

**Langkah-langkah:**

1. Klik ikon **☁️ Download** di navbar atas
2. Modal **"Download / Upload Database"** akan terbuka
3. Klik tombol **"Download database saya"**
4. File JSON akan terdownload otomatis
5. Simpan file dengan aman!

**Format Nama File:**

```
database-backup-2025-01-15T10-30-00.json
```

> 💡 **Tips**: Rename file dengan format yang mudah diingat, contoh:
>
> - `backup-januari-2025.json`
> - `backup-before-payroll-jan2025.json`

---

### 🔼 Cara Upload Database (Restore)

**Kapan Perlu Restore?**

- Pindah komputer/browser
- Terjadi kesalahan data
- Ingin kembalikan data ke versi sebelumnya

**⚠️ PERINGATAN PENTING:**

- Upload database akan **MENIMPA** semua data yang ada sekarang
- Pastikan Anda backup dulu sebelum restore!
- Proses ini tidak bisa di-undo!

**Langkah-langkah:**

1. Klik ikon **☁️ Download** di navbar
2. Modal **"Download / Upload Database"** terbuka
3. Klik area **"Pilih File Disini"**
4. Pilih file JSON backup Anda
5. File akan muncul dengan detail ukuran
6. Klik tombol **"Upload Database"**
7. Konfirmasi jika ada
8. Tunggu proses selesai
9. Halaman akan **refresh otomatis**

**Format File yang Diterima:**

- ✅ Format: `.json`
- ✅ Ukuran: Tidak dibatasi
- ❌ Bukan JSON: Akan ditolak sistem

---

## 🔍 Fitur Search (Pencarian Cepat)

### Cara Menggunakan Search

1. Klik **kotak search** di navbar atas
2. Modal pencarian akan terbuka
3. Pilih kategori pencarian:
   - **👤 Employee**: Cari karyawan
   - **📋 Menu**: Cari menu/halaman
   - **💵 Payroll**: Cari data payroll
4. Ketik kata kunci
5. Hasil akan muncul real-time
6. Klik hasil untuk langsung ke halaman tersebut

**Contoh Pencarian:**

- Ketik `"john"` → Menemukan karyawan bernama John
- Ketik `"absensi"` → Menemukan menu Absensi
- Ketik `"januari"` → Menemukan payroll bulan Januari

---

## 💡 Tips & Trik

### ✨ Tips Umum

1. **Selalu Backup Rutin**

   - Minimal 1x sebulan
   - Sebelum proses penting
   - Simpan di cloud storage (Google Drive, Dropbox)

2. **Manfaatkan Filter & Sort**

   - Gunakan filter untuk cari data spesifik
   - Sort berdasarkan tanggal/nama untuk mudah temukan data

3. **Review Data Berkala**

   - Cek absensi setiap minggu
   - Review cuti setiap bulan
   - Validasi payroll sebelum generate

4. **Gunakan Kode yang Konsisten**
   - Kode Karyawan: EMP001, EMP002, dst
   - Kode Departemen: IT, HR, FIN, dst
   - Kode Shift: SHIFT-1, SHIFT-2, dst

### ⚡ Shortcut

| Aksi         | Cara                      |
| ------------ | ------------------------- |
| Buka Search  | Klik search box di navbar |
| Buka Sidebar | Klik ikon ☰               |
| Filter Data  | Klik ikon filter di tabel |
| Refresh Data | Klik tombol refresh       |

### 🎯 Best Practices

#### Untuk HRD

1. ✅ Setup pengaturan perusahaan dengan lengkap
2. ✅ Input semua departemen dan posisi
3. ✅ Buat kebijakan cuti yang jelas
4. ✅ Backup data setiap akhir bulan
5. ✅ Generate payroll tepat waktu

#### Untuk Admin

1. ✅ Validasi absensi setiap hari
2. ✅ Approve/reject cuti maksimal 2 hari
3. ✅ Cek data lembur sebelum generate payroll
4. ✅ Print slip gaji sebelum tanggal gajian

#### Untuk Karyawan

1. ✅ Absen tepat waktu
2. ✅ Ajukan cuti minimal H-3
3. ✅ Input lembur sesuai realisasi
4. ✅ Cek slip gaji setiap bulan

---

## 🆘 Troubleshooting

### ❓ FAQ (Frequently Asked Questions)

**Q: Data tidak muncul setelah save?**
A: Klik tombol **Refresh** di tabel atau reload halaman.

**Q: Tidak bisa generate payroll?**
A: Pastikan:

- Pengaturan perusahaan sudah lengkap
- Ada data karyawan aktif
- Bulan yang dipilih belum pernah di-generate

**Q: File CSV tidak bisa diimport?**
A: Check:

- Format file harus `.csv`
- Ada header di baris pertama
- Format tanggal sesuai pilihan
- Kode karyawan harus sudah terdaftar

**Q: Gaji bersih minus/negatif?**
A: Cek:

- Gaji pokok sudah benar?
- Potongan tidak terlalu besar?
- Edit manual di detail payroll jika perlu

**Q: Lupa backup sebelum restore?**
A: Sayangnya data tidak bisa dikembalikan. Selalu backup dulu sebelum restore!

**Q: Cuti tidak terpotong otomatis?**
A: Pastikan:

- Status cuti adalah **Approved**
- Kebijakan cuti sudah aktif
- Cuti berbayar sudah dicentang

**Q: Sistem lambat?**
A: Tips:

- Tutup tab browser yang tidak terpakai
- Clear cache browser
- Gunakan browser terbaru (Chrome/Edge)
- Restart browser

**Q: Print slip gaji error?**
A: Pastikan:

- Pop-up blocker tidak aktif
- Browser sudah update
- Coba browser lain jika masih error

---

## 📊 Workflow Rekomendasi

### 🗓️ Daily (Harian)

- [ ] Cek absensi karyawan hari ini
- [ ] Input absensi manual jika ada yang terlewat
- [ ] Approve/reject pengajuan cuti yang masuk
- [ ] Approve/reject pengajuan lembur yang masuk

### 📅 Weekly (Mingguan)

- [ ] Review data absensi seminggu
- [ ] Cek karyawan yang sering terlambat
- [ ] Validasi data lembur
- [ ] Update data karyawan jika ada perubahan

### 📆 Monthly (Bulanan)

- [ ] **Awal Bulan (Tanggal 1-5):**

  - Backup database bulan sebelumnya
  - Review sisa cuti seluruh karyawan
  - Cek karyawan yang anniversary/ulang tahun

- [ ] **Pertengahan Bulan (Tanggal 15-20):**

  - Validasi seluruh absensi bulan berjalan
  - Validasi seluruh lembur yang approved
  - Validasi cuti yang terpakai

- [ ] **Akhir Bulan (Tanggal 25-30):**
  - **Generate Payroll** untuk bulan berjalan
  - Review dan edit payroll jika perlu
  - Print slip gaji untuk seluruh karyawan
  - Tandai payroll sebagai **PAID** setelah transfer
  - Backup database akhir bulan

### 📋 Yearly (Tahunan)

- [ ] Update pengaturan BPJS jika ada perubahan
- [ ] Update tarif lembur sesuai regulasi
- [ ] Review dan update kebijakan cuti
- [ ] Reset sisa cuti tahunan karyawan
- [ ] Evaluasi struktur organisasi

---

## 🎓 Tutorial Video (Coming Soon)

Video tutorial akan segera tersedia untuk:

1. ▶️ **Pengenalan Sistem** (5 menit)
2. ▶️ **Setup Awal** (15 menit)
3. ▶️ **Input Karyawan** (10 menit)
4. ▶️ **Kelola Absensi** (12 menit)
5. ▶️ **Proses Payroll** (20 menit)
6. ▶️ **Backup & Restore** (8 menit)

---

## 📞 Bantuan & Support

### 💬 Butuh Bantuan Lebih Lanjut?

Jika Anda mengalami kesulitan atau ada pertanyaan:

1. **📧 Email**: support@codebyxerenity.my.id
2. **💬 WhatsApp**: +62 812-3456-7890
3. **🌐 Website**: https://codebyxerenity.my.id

**Jam Operasional Support:**

- Senin - Jumat: 09:00 - 17:00 WIB
- Sabtu: 09:00 - 12:00 WIB
- Minggu & Hari Libur: Tutup

---

## 🔐 Keamanan & Privasi

### 🛡️ Keamanan Data

1. **Data Lokal**: Data tersimpan di browser Anda (IndexedDB)
2. **Tidak Ada Server**: Tidak ada data yang dikirim ke server
3. **Privacy First**: Data 100% milik Anda
4. **Backup Manual**: Anda kontrol penuh backup Anda

### ⚠️ Yang Perlu Diperhatikan

1. **Jangan Share Database**

   - File backup berisi data sensitif karyawan
   - Jangan upload ke tempat publik
   - Simpan dengan password jika perlu

2. **Browser Cache**

   - Jangan clear browser data sembarangan
   - Data tersimpan di IndexedDB browser
   - Selalu backup sebelum clear cache

3. **Komputer Bersama**
   - Logout setelah selesai (jika ada fitur login)
   - Jangan tinggalkan browser terbuka
   - Backup sebelum pindah komputer

---

## 🚀 Fitur Mendatang (Roadmap)

### 🎯 Coming Soon

- [ ] Dashboard Analytics yang lebih lengkap
- [ ] Export Excel untuk semua data
- [ ] Import data karyawan dari Excel
- [ ] Multi-user dengan roles (Admin, HRD, Manager)
- [ ] Notifikasi email untuk approval
- [ ] Mobile App (Android & iOS)
- [ ] Integrasi dengan bank untuk payroll
- [ ] Fingerprint API integration
- [ ] Rekap laporan bulanan otomatis

### 💡 Request Fitur Baru?

Punya ide fitur yang ingin ditambahkan? Hubungi kami!

---

## 📚 Glossary (Istilah Penting)

| Istilah           | Penjelasan                         |
| ----------------- | ---------------------------------- |
| **BPJS**          | Badan Penyelenggara Jaminan Sosial |
| **PPh 21**        | Pajak Penghasilan Pasal 21         |
| **PTKP**          | Penghasilan Tidak Kena Pajak       |
| **Gross**         | Gaji kotor (sebelum potongan)      |
| **Nett**          | Gaji bersih (setelah potongan)     |
| **Take Home Pay** | Gaji yang diterima karyawan        |
| **Payroll**       | Penggajian                         |
| **Shift**         | Jadwal kerja                       |
| **Overtime**      | Lembur                             |
| **Leave**         | Cuti                               |
| **Attendance**    | Absensi                            |
| **Department**    | Departemen/Divisi                  |
| **Position**      | Posisi/Jabatan                     |
| **Allowance**     | Tunjangan                          |
| **Deduction**     | Potongan                           |

---

## ✅ Checklist Setup Lengkap

Print atau bookmark checklist ini untuk memastikan setup sempurna:

### Phase 1: Persiapan Data

- [ ] Siapkan data perusahaan lengkap
- [ ] Siapkan struktur organisasi
- [ ] Siapkan daftar posisi
- [ ] Siapkan jadwal shift
- [ ] Siapkan data karyawan

### Phase 2: Setup Sistem

- [ ] Isi Pengaturan Perusahaan
  - [ ] Informasi Umum
  - [ ] BPJS Ketenagakerjaan
  - [ ] BPJS Pensiun
  - [ ] BPJS Kesehatan
  - [ ] Konfigurasi Pajak
  - [ ] Kebijakan Cuti
- [ ] Input Departemen (minimal 3)
- [ ] Input Posisi Jabatan (minimal 5)
- [ ] Input Shift Kerja (minimal 1)
- [ ] Input Karyawan (minimal 1 untuk testing)

### Phase 3: Testing

- [ ] Test absensi manual
- [ ] Test absensi mandiri
- [ ] Test pengajuan cuti
- [ ] Test input lembur
- [ ] Test generate payroll
- [ ] Test print slip gaji
- [ ] Test backup database
- [ ] Test restore database

### Phase 4: Go Live

- [ ] Input semua karyawan
- [ ] Briefing ke karyawan cara absen
- [ ] Sosialisasi cara ajukan cuti
- [ ] Tentukan PIC untuk approve
- [ ] Setup jadwal backup rutin
- [ ] Mulai operasional!

---

## 🎉 Selamat!

Anda telah menyelesaikan panduan lengkap People App!

### 🌟 Next Steps

1. **Mulai Setup** mengikuti urutan di panduan ini
2. **Testing** fitur-fitur dengan data dummy
3. **Go Live** setelah yakin semua berfungsi
4. **Backup Rutin** untuk keamanan data
5. **Explore** fitur-fitur lanjutan

### 💪 Tips Sukses

> **"The key to success is starting. Start small, test thoroughly, then scale up!"**

Mulai dengan:

- ✅ 1 departemen
- ✅ 1 posisi
- ✅ 1 shift
- ✅ 1-3 karyawan untuk testing

Setelah familiar, baru input data lengkap!

---

## 📱 Quick Reference Card

**Simpan ini untuk referensi cepat:**

```
┌─────────────────────────────────────────────┐
│          PEOPLE APP - QUICK GUIDE           │
├─────────────────────────────────────────────┤
│                                             │
│ 🏢 SETUP AWAL (WAJIB URUT):                │
│   1. Pengaturan Perusahaan                  │
│   2. Departemen                             │
│   3. Posisi Jabatan                         │
│   4. Shift Kerja                            │
│   5. Karyawan                               │
│                                             │
│ 📋 DAILY OPERATIONS:                        │
│   • Absensi: Self check-in atau manual     │
│   • Cuti: Ajukan → Approve → Monitoring    │
│   • Lembur: Input → Approve → Payroll      │
│                                             │
│ 💰 MONTHLY PAYROLL:                         │
│   • Validasi absensi & lembur              │
│   • Generate payroll                        │
│   • Review & edit                           │
│   • Print slip gaji                         │
│   • Tandai sebagai PAID                     │
│   • Backup database                         │
│                                             │
│ 💾 BACKUP:                                  │
│   • Klik ikon ☁️ di navbar                │
│   • Download = Backup                       │
│   • Upload = Restore                        │
│   • SELALU backup sebelum restore!         │
│                                             │
│ 🆘 BUTUH BANTUAN?                           │
│   📧 support@codebyxerenity.my.id          │
│   💬 WA: +62 812-3456-7890                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📝 Catatan Versi

**Version 1.0** - Januari 2025

- ✅ Initial Release
- ✅ Complete documentation
- ✅ Step-by-step tutorials
- ✅ Troubleshooting guide

---

## 🙏 Terima Kasih!

Terima kasih telah menggunakan **People App** by Code by Xerenity.

Kami berkomitmen untuk terus meningkatkan sistem ini agar semakin mudah digunakan dan bermanfaat untuk perusahaan Anda.

**Happy Managing! 🚀**

---

_Dokumen ini terakhir diupdate: 19 Januari 2025_
_© 2025 Code by Xerenity. All rights reserved._
