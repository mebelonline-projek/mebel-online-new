import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  const resetUrl = `${APP_URL}/admin/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: `Muara Teweh Furniture <${FROM_EMAIL}>`,
      to: email,
      subject: "Reset Password - Muara Teweh Furniture",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="background: linear-gradient(135deg, #B31324, #8A0F1C); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Muara Teweh Furniture</h1>
                <p style="color: #F5A300; margin: 5px 0 0; font-size: 14px;">Reset Password</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <h2 style="color: #333; font-size: 20px; margin: 0 0 15px;">Halo,</h2>
                <p style="color: #666; line-height: 1.6; margin: 0 0 20px;">
                  Kami menerima permintaan untuk mereset password akun admin Anda. 
                  Klik tombol di bawah ini untuk membuat password baru:
                </p>
                <table cellpadding="0" cellspacing="0" style="margin: 0 auto 20px;">
                  <tr>
                    <td style="background-color: #B31324; border-radius: 5px; text-align: center;">
                      <a href="${resetUrl}" 
                         style="display: inline-block; padding: 12px 30px; color: #ffffff; 
                                text-decoration: none; font-size: 16px; border-radius: 5px;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="color: #666; line-height: 1.6; margin: 0 0 20px; font-size: 13px;">
                  Atau salin link berikut ke browser Anda:
                </p>
                <p style="background-color: #f5f5f5; padding: 10px; border-radius: 3px; 
                          font-size: 12px; color: #333; word-break: break-all;">
                  ${resetUrl}
                </p>
                <p style="color: #999; font-size: 12px; line-height: 1.4; margin: 20px 0 0;">
                  Link ini akan kadaluarsa dalam 1 jam. Jika Anda tidak meminta reset password, 
                  abaikan email ini.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f5f5f5; padding: 20px; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  Muara Teweh Furniture &copy; ${new Date().getFullYear()}
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send reset email:", error);
    return {
      success: false,
      error: "Gagal mengirim email. Silakan coba lagi.",
    };
  }
}

export async function sendTestEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: `Muara Teweh Furniture <${FROM_EMAIL}>`,
      to: email,
      subject: "Test Email - Muara Teweh Furniture",
      html: `
        <h1>Test Email</h1>
        <p>Email ini adalah test untuk memastikan konfigurasi Resend berfungsi.</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send test email:", error);
    return {
      success: false,
      error: "Gagal mengirim email test.",
    };
  }
}