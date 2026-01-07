// Email Templates for FGLab Studio
// Using Resend with Code by Xerenity branding

const LOGO_URL = "https://codebyxerenity.my.id/assets/image/logo_transparent_landscape.png";
const WEBSITE_URL = "https://codebyxerenity.my.id";
const BRAND_NAME = "Code by Xerenity";
const APP_NAME = "FGLab Studio";

// Base email layout
const getEmailLayout = (content: string) => {
    return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${APP_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Email header with logo
const getEmailHeader = (title: string) => {
    return `
<tr>
  <td style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #10b981 100%); padding: 40px 30px; text-align: center;">
    <img src="${LOGO_URL}" alt="${BRAND_NAME}" style="max-width: 200px; height: auto; margin-bottom: 20px;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">${title}</h1>
  </td>
</tr>
  `;
};

// Email footer
const getEmailFooter = () => {
    return `
<tr>
  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
      Email ini dikirim otomatis, mohon tidak membalas email ini.
    </p>
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
      © ${new Date().getFullYear()} <strong>${BRAND_NAME}</strong>. All rights reserved.
    </p>
    <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
      <a href="${WEBSITE_URL}" style="color: #3b82f6; text-decoration: none;">${WEBSITE_URL.replace('https://', '')}</a>
    </p>
  </td>
</tr>
  `;
};

// CTA Button
const getCTAButton = (text: string, url: string) => {
    return `
<table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
  <tr>
    <td align="center">
      <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
        ${text}
      </a>
    </td>
  </tr>
</table>
  `;
};

// Info Box
const getInfoBox = (title: string, items: { label: string; value: string; highlight?: boolean }[]) => {
    const rows = items.map(item => `
    <tr>
      <td style="color: #1e3a8a; font-size: 14px; padding: 8px 0;">
        <strong>${item.label}:</strong>
      </td>
      <td style="color: ${item.highlight ? '#dc2626' : '#1e3a8a'}; font-size: 14px; padding: 8px 0; text-align: right; font-weight: ${item.highlight ? 'bold' : 'normal'};">
        ${item.value}
      </td>
    </tr>
  `).join('');

    return `
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #dbeafe; border-radius: 12px; margin: 30px 0;">
  <tr>
    <td style="padding: 25px;">
      <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">
        ${title}
      </h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${rows}
      </table>
    </td>
  </tr>
</table>
  `;
};

// ============================================
// 1. WELCOME EMAIL (Registration)
// ============================================
export const getWelcomeEmail = (fullName: string, appTitle: string, expiredDate: string) => {
    const content = `
    ${getEmailHeader('Selamat Datang! 🎉')}
    
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Halo, ${fullName}!</h2>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Terima kasih telah mendaftar di <strong>${APP_NAME}</strong>. Akun Anda telah berhasil dibuat dan siap digunakan!
        </p>
        
        ${getInfoBox('🎁 Trial Aplikasi Anda', [
        { label: 'Aplikasi', value: appTitle },
        { label: 'Durasi Trial', value: '7 Hari' },
        { label: 'Berakhir', value: expiredDate, highlight: true }
    ])}
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          Manfaatkan masa trial Anda untuk mengeksplorasi semua fitur yang tersedia. Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.
        </p>
        
        ${getCTAButton('Mulai Sekarang →', `${WEBSITE_URL}/your-apps`)}
        
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

// ============================================
// 2. TRIAL EXPIRING REMINDER (3 days before)
// ============================================
export const getTrialExpiringEmail = (fullName: string, appTitle: string, daysLeft: number, expiredDate: string) => {
    const content = `
    ${getEmailHeader('Trial Anda Akan Berakhir ⏰')}
    
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Halo, ${fullName}!</h2>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Trial aplikasi <strong>${appTitle}</strong> Anda akan berakhir dalam <strong style="color: #dc2626;">${daysLeft} hari</strong>.
        </p>
        
        ${getInfoBox('📅 Detail Trial', [
        { label: 'Aplikasi', value: appTitle },
        { label: 'Sisa Waktu', value: `${daysLeft} Hari`, highlight: true },
        { label: 'Berakhir', value: expiredDate, highlight: true }
    ])}
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          Jangan lewatkan kesempatan untuk terus menggunakan aplikasi ini. Upgrade sekarang untuk akses tanpa batas!
        </p>
        
        ${getCTAButton('Upgrade Sekarang →', `${WEBSITE_URL}/upgrade`)}
        
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

// ============================================
// 3. TRIAL EXPIRED
// ============================================
export const getTrialExpiredEmail = (fullName: string, appTitle: string) => {
    const content = `
    ${getEmailHeader('Trial Anda Telah Berakhir')}
    
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Halo, ${fullName}!</h2>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Trial aplikasi <strong>${appTitle}</strong> Anda telah berakhir. Terima kasih telah mencoba aplikasi kami!
        </p>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 12px; margin: 30px 0; border-left: 4px solid #f59e0b;">
          <tr>
            <td style="padding: 20px;">
              <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;">
                <strong>💡 Ingin melanjutkan?</strong><br>
                Upgrade ke versi premium untuk mendapatkan akses penuh ke semua fitur tanpa batas waktu.
              </p>
            </td>
          </tr>
        </table>
        
        ${getCTAButton('Upgrade ke Premium →', `${WEBSITE_URL}/upgrade`)}
        
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

// ============================================
// 4. PASSWORD RESET
// ============================================
export const getPasswordResetEmail = (fullName: string, resetLink: string) => {
    const content = `
    ${getEmailHeader('Reset Password 🔐')}
    
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Halo, ${fullName}!</h2>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Kami menerima permintaan untuk reset password akun Anda. Klik tombol di bawah untuk membuat password baru.
        </p>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-radius: 12px; margin: 30px 0; border-left: 4px solid #dc2626;">
          <tr>
            <td style="padding: 20px;">
              <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.6;">
                <strong>⚠️ Penting:</strong><br>
                Link ini hanya berlaku selama 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.
              </p>
            </td>
          </tr>
        </table>
        
        ${getCTAButton('Reset Password →', resetLink)}
        
        <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
          Atau copy link berikut ke browser Anda:<br>
          <a href="${resetLink}" style="color: #3b82f6; word-break: break-all;">${resetLink}</a>
        </p>
        
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

// ============================================
// 5. PAYMENT SUCCESS
// ============================================
export const getPaymentSuccessEmail = (
    fullName: string,
    appTitle: string,
    amount: string,
    invoiceNumber: string,
    activatedDate: string
) => {
    const content = `
    ${getEmailHeader('Pembayaran Berhasil! ✅')}
    
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Halo, ${fullName}!</h2>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Terima kasih! Pembayaran Anda telah berhasil diproses. Aplikasi Anda sekarang aktif dan siap digunakan.
        </p>
        
        ${getInfoBox('💳 Detail Pembayaran', [
        { label: 'Aplikasi', value: appTitle },
        { label: 'Jumlah', value: amount, highlight: true },
        { label: 'No. Invoice', value: invoiceNumber },
        { label: 'Tanggal Aktivasi', value: activatedDate }
    ])}
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #d1fae5; border-radius: 12px; margin: 30px 0; border-left: 4px solid #10b981;">
          <tr>
            <td style="padding: 20px;">
              <p style="color: #065f46; font-size: 14px; margin: 0; line-height: 1.6;">
                <strong>🎉 Selamat!</strong><br>
                Anda sekarang memiliki akses penuh ke semua fitur premium tanpa batas waktu.
              </p>
            </td>
          </tr>
        </table>
        
        ${getCTAButton('Buka Aplikasi →', `${WEBSITE_URL}/your-apps`)}
        
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

// ============================================
// 6. CONTACT FORM NOTIFICATION (Admin)
// ============================================
export const getContactFormNotification = (
    name: string,
    email: string,
    phone: string,
    subject: string,
    message: string,
    ipAddress?: string
) => {
    const content = `
    ${getEmailHeader('Pesan Baru dari Contact Form 📧')}
    
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Pesan Baru Masuk</h2>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Ada pesan baru dari contact form website.
        </p>
        
        ${getInfoBox('👤 Detail Pengirim', [
        { label: 'Nama', value: name },
        { label: 'Email', value: email },
        { label: 'Telepon', value: phone },
        { label: 'Subject', value: subject },
        ...(ipAddress ? [{ label: 'IP Address', value: ipAddress }] : [])
    ])}
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; border-radius: 12px; margin: 30px 0;">
          <tr>
            <td style="padding: 20px;">
              <p style="color: #1f2937; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">
                Pesan:
              </p>
              <p style="color: #4b5563; font-size: 14px; margin: 0; line-height: 1.6; white-space: pre-wrap;">
${message}
              </p>
            </td>
          </tr>
        </table>
        
        ${getCTAButton('Balas Email →', `mailto:${email}`)}
      </td>
    </tr>
    
    ${getEmailFooter()}
  `;

    return getEmailLayout(content);
};
