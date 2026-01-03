import { setCors } from '../_utils/cors.js';
import { getAuthSession } from '../_utils/auth.js';
import { sql } from '../_utils/db.js';

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getAuthSession(req);
  if (session?.session?.id) {
    await sql`delete from user_sessions where id = ${session.session.id}`;
  }

  const isLocalhost = req.headers.host?.includes('localhost');
  const isProduction = process.env.NODE_ENV === 'production' && !isLocalhost;

  const cookieParts = [
    'pm_session=',
    'Path=/',
    'HttpOnly',
    isProduction ? 'SameSite=None; Secure' : 'SameSite=Lax',
    'Max-Age=0',
    isProduction ? 'Domain=.mayur.app' : '',
  ].filter(Boolean);

  res.setHeader('Set-Cookie', cookieParts.join('; '));
  return res.status(204).end();
}
