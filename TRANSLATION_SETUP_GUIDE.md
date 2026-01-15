# Translation Setup Guide

## ✅ Yang Sudah Dikerjakan

### 1. **product.json** - Updated
File: `public/assets/data/product.json`

**Perubahan:**
- ✅ Semua text diganti dengan translation keys (format: `PRODUCT.xxx`)
- ✅ Gambar banner dan screenshots sudah disesuaikan dengan folder yang ada:
  - My Peoples: `/assets/image/hr/`
  - My Inventory: `/assets/image/inventory/`
  - My POS: `/assets/image/pos/`
- ✅ Menambahkan field baru:
  - `short_description` - Deskripsi singkat untuk card
  - `business_impact` - Dampak bisnis
  - `perfect_for` - Target market
- ✅ Fitur diperluas dari 3 menjadi 8 fitur per produk
- ✅ Review ditambah menjadi 3 per produk

### 2. **id.json** - Bahasa Indonesia (NEW)
File: `public/assets/i18n/id.json`

**Konten:**
- ✅ Semua translation untuk bahasa Indonesia
- ✅ Konten produk lengkap berdasarkan FIVERR_PORTFOLIO.md
- ✅ Deskripsi yang lebih detail dan profesional
- ✅ Business impact dan perfect for setiap produk
- ✅ 8 fitur lengkap per produk dengan deskripsi
- ✅ 3 review per produk (kecuali Surat Jalan yang coming soon)

### 3. **en.json** - Bahasa Inggris (UPDATED)
File: `public/assets/i18n/en.json`

**Perubahan:**
- ✅ Ditambahkan section `PRODUCT` dengan semua translation
- ✅ Konten sama dengan id.json tapi dalam bahasa Inggris
- ✅ Semua fitur, review, dan deskripsi sudah diterjemahkan

---

## 📋 Struktur Translation Keys

### Product Keys Structure:
```
PRODUCT.{Product Name}.{Field}
```

**Contoh:**
- `PRODUCT.My POS.title` → "My POS"
- `PRODUCT.My POS.description` → "Sistem Point of Sales modern..."
- `PRODUCT.My POS.features.1.title` → "Multi Payment Method"
- `PRODUCT.My POS.reviews.1.review` → "Aplikasi POS yang sangat..."

### Highlight Keys (Shared):
```
PRODUCT.Highlight.{Name}
```

**Contoh:**
- `PRODUCT.Highlight.Responsive Design`
- `PRODUCT.Highlight.Offline Mode`
- `PRODUCT.Highlight.PWA`

---

## 🎯 Produk yang Sudah Dikonfigurasi

### 1. **My Peoples (HRIS)**
- **ID:** 1
- **Banner:** `/assets/image/hr/HR - Banner.png`
- **Screenshots:** 5 screenshots (hr_screenshot_1.png - hr_screenshot_5.png)
- **Fitur:** 8 fitur lengkap
- **Review:** 3 review
- **Status:** Published ✅

### 2. **My Inventory**
- **ID:** 2
- **Banner:** `/assets/image/inventory/Inventory Banner.png`
- **Screenshots:** 6 screenshots (inventory_screenshot_1.png - inventory_screenshot_6.png)
- **Fitur:** 8 fitur lengkap
- **Review:** 3 review
- **Status:** Published ✅

### 3. **My POS**
- **ID:** 3
- **Banner:** `/assets/image/pos/POS Banner.png`
- **Screenshots:** 6 screenshots (pos_screenshot_1.png - pos_screenshot_6.png)
- **Fitur:** 8 fitur lengkap
- **Review:** 3 review
- **Status:** Published ✅

### 4. **Surat Jalan**
- **ID:** "surat-jalan"
- **Banner:** `/assets/image/coming_soon.jpg`
- **Screenshots:** Coming soon images
- **Fitur:** 6 fitur
- **Review:** Belum ada (coming soon)
- **Status:** Not Published (Coming Soon) ⏳

---

## 🔧 Cara Menggunakan

### 1. Di Component TypeScript:
```typescript
import { TranslatePipe } from '@ngx-translate/core';

// Di template
{{ 'PRODUCT.My POS.title' | translate }}
{{ 'PRODUCT.My POS.description' | translate }}
```

### 2. Di Template HTML:
```html
<!-- Title -->
<h1>{{ product.title | translate }}</h1>

<!-- Description -->
<p>{{ product.description | translate }}</p>

<!-- Features -->
<div *ngFor="let feature of product.features">
  <h3>{{ feature.title | translate }}</h3>
  <p>{{ feature.description | translate }}</p>
</div>

<!-- Reviews -->
<div *ngFor="let review of product.review">
  <p>{{ review.review | translate }}</p>
</div>
```

### 3. Switch Language:
```typescript
import { TranslateService } from '@ngx-translate/core';

constructor(private translate: TranslateService) {}

switchToIndonesian() {
  this.translate.use('id');
}

switchToEnglish() {
  this.translate.use('en');
}
```

---

## 📝 Field Baru yang Ditambahkan

### Di product.json:
1. **short_description** - Deskripsi singkat untuk card produk
2. **business_impact** - Dampak bisnis menggunakan produk
3. **perfect_for** - Target market / cocok untuk siapa

### Cara menggunakan:
```html
<!-- Card Product -->
<p>{{ product.short_description | translate }}</p>

<!-- Product Detail Page -->
<div class="business-impact">
  <h3>Business Impact</h3>
  <p>{{ product.business_impact | translate }}</p>
</div>

<div class="perfect-for">
  <h3>Perfect For</h3>
  <p>{{ product.perfect_for | translate }}</p>
</div>
```

---

## 🎨 Konten Berdasarkan FIVERR_PORTFOLIO.md

Semua konten produk sudah disesuaikan dengan deskripsi di FIVERR_PORTFOLIO.md:

### ✅ My POS:
- Deskripsi lengkap tentang sistem kasir modern
- 8 fitur utama (Multi Payment, Real-time Reporting, dll)
- Business impact: "3x lebih cepat"
- Perfect for: Retail, F&B, dll
- 3 review positif

### ✅ My Inventory:
- Deskripsi tentang sistem inventory powerful
- 8 fitur utama (Stock Alert, Barcode Scanner, dll)
- Business impact: "Mengurangi waktu 60%"
- Perfect for: Distributor, Wholesaler, dll
- 3 review positif

### ✅ My Peoples:
- Deskripsi tentang HRIS lengkap
- 8 fitur utama (Employee Database, Attendance, Payroll, dll)
- Business impact: "Menghemat 20+ jam per bulan"
- Perfect for: Perusahaan 10-500 karyawan
- 3 review positif

### ✅ Surat Jalan:
- Deskripsi tentang delivery note system
- 6 fitur utama (Digital Signature, Tracking, dll)
- Business impact: "Meningkatkan efisiensi operasional"
- Perfect for: Distribusi, Logistik
- Status: Coming Soon

---

## 🚀 Next Steps

### 1. Test Translation:
```bash
npm start
```
Buka browser dan test switch language antara ID dan EN.

### 2. Update Component (Jika Perlu):
Jika ada component yang masih hardcode text, update dengan translation pipe:
```typescript
// Before
title = "My POS";

// After
title = "PRODUCT.My POS.title";
```

### 3. Add Language Switcher:
Tambahkan button untuk switch language di navbar:
```html
<button (click)="translate.use('id')">🇮🇩 ID</button>
<button (click)="translate.use('en')">🇬🇧 EN</button>
```

---

## 📊 Summary

| File | Status | Bahasa | Items |
|------|--------|--------|-------|
| product.json | ✅ Updated | Translation Keys | 4 products |
| id.json | ✅ Created | Indonesia | Complete |
| en.json | ✅ Updated | English | Complete |

**Total Translation Keys:** 200+ keys
**Products:** 4 (3 published, 1 coming soon)
**Features per Product:** 8 (6 untuk Surat Jalan)
**Reviews per Product:** 3 (kecuali Surat Jalan)

---

## 💡 Tips

1. **Konsistensi:** Gunakan translation keys di semua tempat, jangan ada hardcode text
2. **Fallback:** Set fallback language ke 'en' di app.config.ts
3. **Loading:** Translation di-load saat app init, jadi pastikan file json valid
4. **Testing:** Test kedua bahasa untuk memastikan semua key ada
5. **Images:** Pastikan semua gambar banner dan screenshot ada di folder yang benar

---

## 🐛 Troubleshooting

### Translation tidak muncul:
1. Check console untuk error
2. Pastikan translation key benar (case-sensitive)
3. Pastikan file json valid (no syntax error)
4. Clear browser cache

### Gambar tidak muncul:
1. Check path gambar di product.json
2. Pastikan file gambar ada di folder public/assets/image/
3. Check case-sensitive filename (HR - Banner.png vs hr - banner.png)

---

**Done! 🎉**

Semua sudah siap untuk digunakan. Tinggal test dan deploy!
