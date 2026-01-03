import { setCors } from '../_utils/cors.js';
import { getAuthSession } from '../_utils/auth.js';

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getAuthSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.status(200).json({ user: session.user });
}
