# Supabase Edge Functions

Koleksi edge functions untuk FGLab Studio dengan Resend email integration.

## 📁 Structure

```
supabase/functions/
├── _shared/
│   ├── email-templates.ts          # Email templates library
│   └── EMAIL_TEMPLATES_GUIDE.md    # Template documentation
├── register/
│   ├── index.ts                    # User registration + welcome email
│   └── README.md                   # API documentation
├── send-trial-reminder/
│   └── index.ts                    # Cron job untuk trial reminder
└── contact-form/
    └── index.ts                    # Contact form handler
```

## 🚀 Available Functions

### 1. Register (`/register`)

**Purpose:** User registration dengan trial aplikasi + welcome email

**Method:** POST

**Request:**

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "trial_product_id": 2
}
```

**Features:**

- ✅ Validasi input lengkap
- ✅ Cek email duplicate
- ✅ Insert user + assign trial (7 hari)
- ✅ Auto-login
- ✅ Kirim welcome email

**Deploy:**

```bash
supabase functions deploy register
```

---

### 2. Send Trial Reminder (`/send-trial-reminder`)

**Purpose:** Cron job untuk kirim reminder trial yang akan expired dalam 3 hari

**Method:** POST (triggered by cron)

**Features:**

- ✅ Query user dengan trial expired dalam 3 hari
- ✅ Kirim reminder email ke semua user
- ✅ Return summary (success/failed count)

**Setup Cron:**

```bash
# Via Supabase Dashboard
# Settings > Edge Functions > Cron Jobs
# Add new cron:
# Function: send-trial-reminder
# Schedule: 0 9 * * * (every day at 9 AM)
```

**Manual Trigger:**

```bash
curl -X POST https://iiaowuevoznophsmlubp.supabase.co/functions/v1/send-trial-reminder \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

**Deploy:**

```bash
supabase functions deploy send-trial-reminder
```

---

### 3. Contact Form (`/contact-form`)

**Purpose:** Handle contact form submission + kirim notifikasi ke admin

**Method:** POST

**Request:**

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone_number": "08123456789",
  "subject": "Pertanyaan tentang Pricing",
  "content": "Halo, saya ingin tanya..."
}
```

**Features:**

- ✅ Validasi input
- ✅ Simpan ke database (table: contact)
- ✅ Kirim email notifikasi ke admin
- ✅ Capture IP address

**Deploy:**

```bash
supabase functions deploy contact-form
```

---

## 🔧 Setup

### 1. Environment Variables

Set di Supabase Dashboard (Settings > Edge Functions > Environment Variables):

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### 2. Deploy All Functions

```bash
# Deploy semua functions sekaligus
supabase functions deploy register
supabase functions deploy send-trial-reminder
supabase functions deploy contact-form
```

### 3. Test Functions

```bash
# Test register
curl -X POST https://your-project.supabase.co/functions/v1/register \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test","email":"test@example.com","password":"pass123","password_confirmation":"pass123","trial_product_id":2}'

# Test contact form
curl -X POST https://your-project.supabase.co/functions/v1/contact-form \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test","email":"test@example.com","phone_number":"08123456789","subject":"Test","content":"Test message"}'

# Test trial reminder (manual trigger)
curl -X POST https://your-project.supabase.co/functions/v1/send-trial-reminder \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

---

## 📧 Email Templates

Semua email templates ada di `_shared/email-templates.ts`:

1. **Welcome Email** - Registration
2. **Trial Expiring** - 3 days before expired
3. **Trial Expired** - After trial ends
4. **Password Reset** - Reset password request
5. **Payment Success** - After successful payment
6. **Contact Form Notification** - Admin notification

Lihat `_shared/EMAIL_TEMPLATES_GUIDE.md` untuk dokumentasi lengkap.

---

## 🔄 Cron Jobs Setup

### Via Supabase Dashboard

1. Buka Supabase Dashboard
2. Settings > Edge Functions
3. Scroll ke "Cron Jobs"
4. Add new cron job:

**Trial Reminder (Daily at 9 AM):**

```
Function: send-trial-reminder
Schedule: 0 9 * * *
Description: Send trial expiring reminder (3 days before)
```

**Trial Expired Check (Daily at 10 AM):**

```
Function: send-trial-expired
Schedule: 0 10 * * *
Description: Send trial expired notification
```

### Cron Schedule Format

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, 0 & 7 = Sunday)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

**Examples:**

- `0 9 * * *` - Every day at 9:00 AM
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 0` - Every Sunday at midnight
- `30 8 * * 1-5` - Weekdays at 8:30 AM

---

## 🧪 Testing

### Local Testing with Supabase CLI

```bash
# Start local Supabase
supabase start

# Serve function locally
supabase functions serve register --env-file .env.local

# Test locally
curl -X POST http://localhost:54321/functions/v1/register \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test","email":"test@example.com",...}'
```

### View Logs

```bash
# Real-time logs
supabase functions logs register --follow

# Last 100 lines
supabase functions logs register --limit 100
```

---

## 📊 Monitoring

### Resend Dashboard

- Login ke [resend.com](https://resend.com)
- Buka "Logs" untuk melihat email delivery status
- Monitor open rate, click rate, bounce rate

### Supabase Dashboard

- Functions > Logs
- Monitor invocations, errors, execution time
- Set up alerts untuk errors

---

## 🔐 Security

### Rate Limiting

Tambahkan rate limiting di edge functions:

```typescript
import { RateLimiter } from 'https://deno.land/x/rate_limiter/mod.ts';

const limiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
});

// In handler
const ip = req.headers.get('x-forwarded-for') || 'unknown';
if (!limiter.check(ip)) {
  return new Response(JSON.stringify({ error: 'Too many requests' }), {
    status: 429,
    headers: corsHeaders,
  });
}
```

### Input Validation

Selalu validasi input:

- Email format
- Required fields
- String length limits
- SQL injection prevention (use parameterized queries)

### CORS

Update CORS headers sesuai kebutuhan:

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://codebyxerenity.my.id', // Specific domain
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
```

---

## 🐛 Troubleshooting

### Function tidak jalan?

1. Cek logs: `supabase functions logs function-name`
2. Cek environment variables sudah di-set
3. Cek RESEND_API_KEY valid
4. Test dengan curl

### Email tidak terkirim?

1. Cek Resend dashboard > Logs
2. Cek domain sudah verified
3. Cek spam folder
4. Cek rate limit Resend (100/day free tier)

### Cron job tidak jalan?

1. Cek cron schedule format benar
2. Cek function deployed
3. Cek logs di waktu yang dijadwalkan
4. Manual trigger untuk test

---

## 📝 Best Practices

1. **Error Handling**

   - Always catch errors
   - Log errors untuk debugging
   - Return user-friendly error messages

2. **Email Failures**

   - Don't fail main operation if email fails
   - Log email errors
   - Implement retry mechanism

3. **Database Operations**

   - Use transactions untuk multiple operations
   - Implement rollback on failure
   - Use indexes untuk query performance

4. **Testing**

   - Test locally before deploy
   - Test with real email addresses
   - Monitor logs after deploy

5. **Documentation**
   - Document API endpoints
   - Document environment variables
   - Keep README updated

---

## 🚀 Next Steps

### Additional Functions to Build

1. **Password Reset** (`/reset-password`)

   - Generate reset token
   - Send reset email
   - Validate token & update password

2. **Payment Webhook** (`/payment-webhook`)

   - Handle payment gateway webhook
   - Update user subscription
   - Send payment success email

3. **Trial Expired Handler** (`/send-trial-expired`)

   - Cron job untuk cek trial expired
   - Kirim trial expired email
   - Disable user access

4. **Email Verification** (`/verify-email`)
   - Send verification email
   - Verify token
   - Activate account

---

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:

- Email: admin@codebyxerenity.my.id
- Website: https://codebyxerenity.my.id

---

**Happy Coding!** 🚀✨
