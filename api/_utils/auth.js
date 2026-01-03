import { createHash } from 'crypto';
import { sql } from './db.js';

const authSecret = process.env.AUTH_SECRET;

if (!authSecret) {
  throw new Error('AUTH_SECRET is not set');
}

const SESSION_TTL_DAYS = 30;
const SESSION_COOKIE_NAME = 'pm_session';

const parseCookies = (cookieHeader) => {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
};

const getTokenFromRequest = (req) => {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    return token || null;
  }

  // Try Express req.cookies first (if cookie-parser is used)
  if (req.cookies && req.cookies[SESSION_COOKIE_NAME]) {
    return req.cookies[SESSION_COOKIE_NAME];
  }

  // Fallback to manual cookie parsing
  const cookies = parseCookies(req.headers?.cookie || '');
  return cookies[SESSION_COOKIE_NAME] || null;
};

export const getSessionExpiry = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS);
  return expiresAt;
};

export const hashToken = (token) => {
  return createHash('sha256').update(`${token}:${authSecret}`).digest('hex');
};

export const hashOtp = (email, code) => {
  return createHash('sha256').update(`${email}:${code}:${authSecret}`).digest('hex');
};

export const getAuthSession = async (req) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);

  const sessionRows = await sql`
    select
      s.id,
      s.user_id,
      s.expires_at,
      u.email,
      u.created_at
    from user_sessions s
    join users u on u.id = s.user_id
    where s.token_hash = ${tokenHash}
    limit 1
  `;

  if (!sessionRows.length) {
    return null;
  }

  const session = sessionRows[0];
  const expiresAt = new Date(session.expires_at);

  if (Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
    await sql`delete from user_sessions where id = ${session.id}`;
    return null;
  }

  return {
    session: {
      id: session.id,
      userId: session.user_id,
      expiresAt,
    },
    user: {
      id: session.user_id,
      email: session.email,
      createdAt: new Date(session.created_at),
    }
  };
};
