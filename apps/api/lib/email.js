import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }
  return transporter;
}

/**
 * Send an OTP verification email to the user
 * @param {string} email
 * @param {string} otp
 * @returns {Promise<{ sent: boolean, previewOtp?: string }>}
 */
export async function sendOtpEmail(email, otp) {
  const mailer = getTransporter();
  const from = process.env.EMAIL_FROM || '"Internship Tracker" <noreply@internshiptracker.in>';

  const subject = `Your Verification Code: ${otp} | Internship Tracker`;
  const text = `Your login/registration verification code for Internship Tracker is: ${otp}. This code expires in 10 minutes.`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e5e7eb; rounded: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1e40af; font-size: 24px; font-weight: 800; margin: 0;">Internship Tracker</h1>
        <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Top Tech Internships in India</p>
      </div>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="color: #334155; font-size: 15px; margin: 0 0 16px;">Here is your single-use verification code:</p>
        <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1e40af; font-family: monospace; padding: 12px; background: #ffffff; border-radius: 8px; border: 1px dashed #93c5fd; display: inline-block;">
          ${otp}
        </div>
        <p style="color: #64748b; font-size: 13px; margin: 16px 0 0;">This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
        If you did not request this verification code, you can safely ignore this email.
      </p>
    </div>
  `;

  if (mailer) {
    try {
      await mailer.sendMail({
        from,
        to: email,
        subject,
        text,
        html
      });
      return { sent: true };
    } catch (err) {
      console.error('SMTP sendMail error, falling back to terminal log:', err.message);
    }
  }

  // Fallback: Log OTP clearly in server terminal
  console.log('\n========================================');
  console.log(`[AUTH OTP CODE] Email: ${email}`);
  console.log(`[AUTH OTP CODE] Verification Code: >>> ${otp} <<<`);
  console.log('========================================\n');

  return { sent: true, previewOtp: otp };
}
