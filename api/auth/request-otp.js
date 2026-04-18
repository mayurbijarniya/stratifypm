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
    subject: `Your StratifyPM verification code: ${code}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
  <style>
    /* Reset & Base */
    body, table, td, p, a, h1, h2 { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

    .main-body { background-color: #f4f4f5; color: #18181b; }
    .content-box { border: 3px solid #18181b; background-color: #ffffff; }
    .code-box { border: 3px solid #18181b; background-color: #CCFF00; box-shadow: 6px 6px 0 0 #18181b; }
    .text-main { color: #18181b; }
    .text-muted { color: #71717a; }

    /* Dark Mode Override */
    @media (prefers-color-scheme: dark) {
      .main-body { background-color: #09090b !important; color: #f4f4f5 !important; }
      .content-box { border: 3px solid #f4f4f5 !important; background-color: #09090b !important; }
      .code-box { border: 3px solid #f4f4f5 !important; background-color: #CCFF00 !important; box-shadow: 6px 6px 0 0 #f4f4f5 !important; }
      .text-main { color: #f4f4f5 !important; }
      .text-muted { color: #a1a1aa !important; }
      .text-code { color: #000000 !important; }
    }
  </style>
</head>
<body class="main-body" style="margin: 0; padding: 0; font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif; line-height: 1.5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Content Container -->
        <table role="presentation" class="content-box" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 500px; padding: 40px;">
          <tr>
            <td>
              <!-- Header -->
              <p style="margin: 0 0 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; font-size: 11px; color: #71717a;">[ SECURITY CODE ]</p>
              <h1 class="text-main" style="margin: 0 0 24px; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em;">StratifyPM Access</h1>

              <p class="text-main" style="margin: 0 0 24px; font-size: 16px; font-weight: 500;">
                Hello, use the following code to sign in to your StratifyPM account. This code ensures your account remains secure.
              </p>

              <!-- OTP Code Module -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="width: 100%; margin: 32px 0;">
                <tr>
                  <td class="code-box" style="padding: 24px; text-align: center;">
                    <span class="text-code" style="color: #000000; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 42px; font-weight: 900; letter-spacing: 0.2em;">${code}</span>
                  </td>
                </tr>
              </table>

              <p class="text-muted" style="margin: 24px 0 0; font-size: 14px;">
                Valid for <span style="font-weight: bold; text-decoration: underline;">${OTP_TTL_MINUTES} minutes</span>.
                If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 500px; padding: 24px 0;">
          <tr>
            <td align="left">
              <p class="text-muted" style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
                © ${new Date().getFullYear()} STRATIFYPM // AI-DRIVEN PRODUCT STRATEGY
              </p>
            </td>
          </tr>
        </table>
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
