import { randomInt } from 'crypto';
import { sql } from '../_utils/db.js';
import { hashOtp } from '../_utils/auth.js';
import { setCors } from '../_utils/cors.js';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const resendFromName = process.env.RESEND_FROM_NAME || 'StratifyPM';

const OTP_TTL_MINUTES = 10;
const OTP_COOLDOWN_SECONDS = 60;
const OTP_MAX_PER_HOUR = 5;

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const sendOtpEmail = async (email, code) => {
  if (!resendApiKey || !resendFromEmail) {
    throw new Error('Missing RESEND configuration');
  }

  // Extract username from email for personalization
  const emailUsername = email.split('@')[0];

  const payload = {
    from: `${resendFromName} <${resendFromEmail}>`,
    to: email,
    subject: `Your StratifyPM verification code`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
  <style>
    /* Reset styles */
    body, table, td, p, a, h1, h2 { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #0f172a !important; }
      .email-text { color: #e2e8f0 !important; }
      .email-text-muted { color: #94a3b8 !important; }
      .email-heading { color: #f8fafc !important; }
      .email-strong { color: #f8fafc !important; }
      .email-footer { color: #94a3b8 !important; }
      .email-box { background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important; }
    }
  </style>
</head>
<body class="email-body" style="margin: 0; padding: 0; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 0 auto; padding: 60px 20px;">
    <!-- Content - Starts directly with Welcome -->
    <tr>
      <td style="text-align: center;">
        <!-- Welcome Message -->
        <h1 class="email-heading" style="margin: 0 0 12px; font-size: 28px; font-weight: 700; color: #0f172a;">Welcome to StratifyPM!</h1>
        <p class="email-text" style="margin: 0 0 28px; font-size: 16px; color: #475569;">Hi ${emailUsername},</p>

        <!-- Main Text -->
        <p class="email-text" style="margin: 0 0 16px; font-size: 15px; color: #334155;">
          Thanks for signing up! To get started, please verify your email address by entering the code below.
        </p>
        <p class="email-text-muted" style="margin: 0 0 32px; font-size: 14px; color: #64748b;">
          This code will expire in <strong class="email-strong" style="color: #0f172a;">${OTP_TTL_MINUTES} minutes</strong>.
        </p>

        <!-- OTP Code Box -->
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
          <tr>
            <td class="email-box" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 20px 36px; border-radius: 12px;">
              <span style="color: white; font-size: 34px; font-weight: 700; letter-spacing: 8px; font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;">${code}</span>
            </td>
          </tr>
        </table>

        <!-- Help Text -->
        <p class="email-text-muted" style="margin: 32px 0 0; font-size: 13px; color: #64748b;">
          Didn't request this code? You can safely ignore this email.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding-top: 48px; text-align: center;">
        <p class="email-text-muted" style="margin: 0 0 6px; font-size: 14px; color: #64748b;">
          <strong class="email-strong" style="color: #0f172a;">StratifyPM</strong> — AI-Powered Product Management
        </p>
        <p class="email-footer" style="margin: 0; font-size: 12px; color: #94a3b8;">
          Strategic planning, user research, and data-driven insights.
        </p>
        <p class="email-footer" style="margin: 16px 0 0; font-size: 11px; color: #94a3b8;">
          © 2025 StratifyPM. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend error: ${response.status} ${errorText}`);
  }
};

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const rawEmail = String(body.email || '').trim().toLowerCase();

    if (!isValidEmail(rawEmail)) {
      return res.status(400).json({ error: 'Enter a valid email address' });
    }

    const lastRequest = await sql`
      select created_at
      from otp_requests
      where email = ${rawEmail}
      order by created_at desc
      limit 1
    `;

    if (lastRequest.length) {
      const lastCreated = new Date(lastRequest[0].created_at);
      const elapsedSeconds = (Date.now() - lastCreated.getTime()) / 1000;
      if (elapsedSeconds < OTP_COOLDOWN_SECONDS) {
        return res.status(429).json({
          error: 'Please wait before requesting another code',
          retryAfter: Math.ceil(OTP_COOLDOWN_SECONDS - elapsedSeconds),
        });
      }
    }

    const recentCount = await sql`
      select count(*) as count
      from otp_requests
      where email = ${rawEmail}
        and created_at > now() - interval '1 hour'
    `;

    const requestCount = Number(recentCount[0]?.count || 0);
    if (requestCount >= OTP_MAX_PER_HOUR) {
      return res.status(429).json({
        error: 'Too many requests. Try again later.',
        retryAfter: 3600,
      });
    }

    const code = String(randomInt(100000, 1000000));
    const codeHash = hashOtp(rawEmail, code);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    const requestIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null;

    await sql`
      insert into otp_requests (email, code_hash, expires_at, request_ip)
      values (${rawEmail}, ${codeHash}, ${expiresAt}, ${requestIp})
    `;

    await sendOtpEmail(rawEmail, code);

    return res.status(200).json({
      success: true,
      expiresIn: OTP_TTL_MINUTES * 60,
    });
  } catch (err) {
    console.error('OTP send error:', err.message);
    return res.status(500).json({ error: 'Unable to send code', detail: err.message });
  }
}
