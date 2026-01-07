# Email Templates Guide

Koleksi email templates untuk FGLab Studio menggunakan Resend dengan branding Code by Xerenity.

## 📧 Available Templates

### 1. Welcome Email (Registration)

**Function:** `getWelcomeEmail(fullName, appTitle, expiredDate)`

Dikirim saat user berhasil register dengan trial aplikasi.

**Parameters:**

- `fullName`: string - Nama lengkap user
- `appTitle`: string - Nama aplikasi trial
- `expiredDate`: string - Tanggal expired (format: "Senin, 14 Januari 2025")

**Usage:**

```typescript
import { getWelcomeEmail } from '../_shared/email-templates.ts';

const html = getWelcomeEmail('John Doe', 'Inventory (Management Stock)', 'Senin, 14 Januari 2025');

await resend.emails.send({
  from: 'FGLab Studio <noreply@codebyxerenity.my.id>',
  to: 'user@example.com',
  subject: 'Selamat Datang di FGLab Studio! 🎉',
  html: html,
});
```

---

### 2. Trial Expiring Reminder

**Function:** `getTrialExpiringEmail(fullName, appTitle, daysLeft, expiredDate)`

Dikirim 3 hari sebelum trial berakhir untuk reminder user.

**Parameters:**

- `fullName`: string - Nama lengkap user
- `appTitle`: string - Nama aplikasi trial
- `daysLeft`: number - Sisa hari trial (biasanya 3)
- `expiredDate`: string - Tanggal expired

**Usage:**

```typescript
import { getTrialExpiringEmail } from '../_shared/email-templates.ts';

const html = getTrialExpiringEmail(
  'John Doe',
  'Inventory (Management Stock)',
  3,
  'Senin, 14 Januari 2025'
);

await resend.emails.send({
  from: 'FGLab Studio <noreply@codebyxerenity.my.id>',
  to: 'user@example.com',
  subject: 'Trial Anda Akan Berakhir ⏰',
  html: html,
});
```

**Automation Idea:**
Buat cron job atau scheduled function yang jalan setiap hari untuk cek user dengan trial yang akan expired dalam 3 hari.

---

### 3. Trial Expired

**Function:** `getTrialExpiredEmail(fullName, appTitle)`

Dikirim saat trial user sudah berakhir.

**Parameters:**

- `fullName`: string - Nama lengkap user
- `appTitle`: string - Nama aplikasi trial

**Usage:**

```typescript
import { getTrialExpiredEmail } from '../_shared/email-templates.ts';

const html = getTrialExpiredEmail('John Doe', 'Inventory (Management Stock)');

await resend.emails.send({
  from: 'FGLab Studio <noreply@codebyxerenity.my.id>',
  to: 'user@example.com',
  subject: 'Trial Anda Telah Berakhir',
  html: html,
});
```

---

### 4. Password Reset

**Function:** `getPasswordResetEmail(fullName, resetLink)`

Dikirim saat user request reset password.

**Parameters:**

- `fullName`: string - Nama lengkap user
- `resetLink`: string - URL untuk reset password (dengan token)

**Usage:**

```typescript
import { getPasswordResetEmail } from '../_shared/email-templates.ts';

const resetToken = 'abc123xyz';
const resetLink = `https://codebyxerenity.my.id/reset-password?token=${resetToken}`;

const html = getPasswordResetEmail('John Doe', resetLink);

await resend.emails.send({
  from: 'FGLab Studio <noreply@codebyxerenity.my.id>',
  to: 'user@example.com',
  subject: 'Reset Password 🔐',
  html: html,
});
```

**Note:** Link hanya berlaku 1 jam (implement di backend).

---

### 5. Payment Success

**Function:** `getPaymentSuccessEmail(fullName, appTitle, amount, invoiceNumber, activatedDate)`

Dikirim saat user berhasil melakukan pembayaran.

**Parameters:**

- `fullName`: string - Nama lengkap user
- `appTitle`: string - Nama aplikasi yang dibeli
- `amount`: string - Jumlah pembayaran (format: "Rp 99.000")
- `invoiceNumber`: string - Nomor invoice
- `activatedDate`: string - Tanggal aktivasi

**Usage:**

```typescript
import { getPaymentSuccessEmail } from '../_shared/email-templates.ts';

const html = getPaymentSuccessEmail(
  'John Doe',
  'Inventory (Management Stock)',
  'Rp 99.000',
  'INV-2025-001',
  'Selasa, 7 Januari 2025'
);

await resend.emails.send({
  from: 'FGLab Studio <noreply@codebyxerenity.my.id>',
  to: 'user@example.com',
  subject: 'Pembayaran Berhasil! ✅',
  html: html,
});
```

---

### 6. Contact Form Notification (Admin)

**Function:** `getContactFormNotification(name, email, phone, subject, message, ipAddress?)`

Dikirim ke admin saat ada pesan baru dari contact form.

**Parameters:**

- `name`: string - Nama pengirim
- `email`: string - Email pengirim
- `phone`: string - Nomor telepon pengirim
- `subject`: string - Subject pesan
- `message`: string - Isi pesan
- `ipAddress`: string (optional) - IP address pengirim

**Usage:**

```typescript
import { getContactFormNotification } from '../_shared/email-templates.ts';

const html = getContactFormNotification(
  'John Doe',
  'john@example.com',
  '08123456789',
  'Pertanyaan tentang Pricing',
  'Halo, saya ingin tanya tentang harga aplikasi...',
  '192.168.1.1'
);

await resend.emails.send({
  from: 'FGLab Studio <noreply@codebyxerenity.my.id>',
  to: 'admin@codebyxerenity.my.id',
  subject: 'Pesan Baru dari Contact Form 📧',
  html: html,
});
```

---

## 🎨 Template Features

Semua template memiliki:

- ✅ Logo Code by Xerenity di header
- ✅ Gradient background modern
- ✅ Responsive design (mobile-friendly)
- ✅ Consistent branding
- ✅ CTA buttons dengan gradient
- ✅ Info boxes dengan warna berbeda
- ✅ Footer dengan copyright & link website

## 🔧 Customization

### Mengubah Logo

Edit di `email-templates.ts`:

```typescript
const LOGO_URL = 'https://codebyxerenity.my.id/assets/image/your-logo.png';
```

### Mengubah Website URL

```typescript
const WEBSITE_URL = 'https://your-domain.com';
```

### Mengubah Brand Name

```typescript
const BRAND_NAME = 'Your Brand Name';
const APP_NAME = 'Your App Name';
```

### Mengubah Warna

Gradient colors di header:

```css
background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #10b981 100%);
```

Button gradient:

```css
background: linear-gradient(135deg, #0ea5e9, #3b82f6);
```

## 📝 Best Practices

### 1. Subject Lines

- Keep it short (< 50 characters)
- Use emojis sparingly (1-2 max)
- Be clear and actionable
- Avoid spam words (FREE, URGENT, etc.)

### 2. Email Content

- Personalize with user's name
- Keep paragraphs short (2-3 lines)
- Use clear CTA buttons
- Include unsubscribe option (for marketing emails)

### 3. Testing

Test email di berbagai email clients:

- Gmail (web & mobile)
- Outlook
- Apple Mail
- Yahoo Mail

### 4. Deliverability

- Setup SPF, DKIM, DMARC records
- Warm up domain (start with low volume)
- Monitor bounce rate & spam complaints
- Use verified sender domain

## 🚀 Creating New Templates

Template baru harus follow struktur ini:

```typescript
export const getYourNewEmail = (param1: string, param2: string) => {
  const content = `
    ${getEmailHeader('Your Title')}
    
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">
          Halo, ${param1}!
        </h2>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Your content here...
        </p>
        
        ${getCTAButton('Button Text', 'https://your-url.com')}
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
          Salam hangat,<br>
          <strong style="color: #1f2937;">Tim ${APP_NAME}</strong>
        </p>
      </td>
    </tr>
    
    ${getEmailFooter()}
  `;

  return getEmailLayout(content);
};
```

## 📊 Email Analytics

Track email performance di Resend Dashboard:

- Open rate
- Click rate
- Bounce rate
- Spam complaints

## 🔐 Security

- Never include sensitive data in emails
- Use HTTPS for all links
- Implement rate limiting
- Validate email addresses
- Use secure tokens for password reset

## 📞 Support

Jika ada pertanyaan atau butuh custom template, contact:

- Email: admin@codebyxerenity.my.id
- Website: https://codebyxerenity.my.id

---

**Happy Emailing!** 📧✨
