import { randomBytes } from 'crypto';
import { sql } from '../_utils/db.js';
import { hashOtp, hashToken, getSessionExpiry } from '../_utils/auth.js';
import { setCors } from '../_utils/cors.js';

const OTP_MAX_ATTEMPTS = 5;
const SESSION_COOKIE_NAME = 'pm_session';

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    const code = String(body.code || '').trim();

    if (!isValidEmail(rawEmail)) {
      return res.status(400).json({ error: 'Enter a valid email address' });
    }

    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: 'Enter a valid 6 digit code' });
    }

    const otpRows = await sql`
      select id, code_hash, expires_at, used_at, attempts
      from otp_requests
      where email = ${rawEmail}
        and used_at is null
        and expires_at > now()
      order by created_at desc
      limit 1
    `;

    if (!otpRows.length) {
      return res.status(400).json({ error: 'Code expired or invalid' });
    }

    const otp = otpRows[0];
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ error: 'Too many attempts. Request a new code.' });
    }

    const expectedHash = hashOtp(rawEmail, code);
    if (expectedHash !== otp.code_hash) {
      await sql`
        update otp_requests
        set attempts = attempts + 1
        where id = ${otp.id}
      `;
      return res.status(400).json({ error: 'Code expired or invalid' });
    }

    await sql`
      update otp_requests
      set used_at = now()
      where id = ${otp.id}
    `;

    const userRows = await sql`
      insert into users (email)
      values (${rawEmail})
      on conflict (email) do update set email = excluded.email
      returning id, email, created_at
    `;

    const user = userRows[0];
    const sessionToken = randomBytes(32).toString('hex');
    const tokenHash = hashToken(sessionToken);
    const expiresAt = getSessionExpiry();
    const maxAgeSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

    await sql`
      insert into user_sessions (user_id, token_hash, expires_at)
      values (${user.id}, ${tokenHash}, ${expiresAt})
    `;

    const isLocalhost = req.headers.host?.includes('localhost');
    const isProduction = process.env.NODE_ENV === 'production' && !isLocalhost;

    const cookieParts = [
      `${SESSION_COOKIE_NAME}=${sessionToken}`,
      'Path=/',
      'HttpOnly',
      isProduction ? 'SameSite=None; Secure' : 'SameSite=Lax',
      `Max-Age=${Math.max(0, maxAgeSeconds)}`,
      // Only set Domain for production, let localhost default to localhost
      isProduction ? 'Domain=.mayur.app' : '',
    ].filter(Boolean);

    res.setHeader('Set-Cookie', cookieParts.join('; '));

    return res.status(200).json({
      token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
      expiresAt,
    });
  } catch {
    return res.status(500).json({ error: 'Unable to verify code' });
  }
}
