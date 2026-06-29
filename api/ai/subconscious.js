import { getAuthSession } from '../_utils/auth.js';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://stratifypm.mayur.app',
  'https://stratifypm.mayur.run',
];

const ALLOWED_MODELS = new Set([
  'subconscious/tim-qwen3.6-27b',
  'subconscious/glm-5.2'
]);

function setCORS(req, res) {
  const origin = req.headers.origin || '';
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[1];
  const reqHeaders = req.headers['access-control-request-headers'] || 'Content-Type';

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', reqHeaders);
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
}

export default async function handler(req, res) {
  setCORS(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await getAuthSession(req);
  if (!auth) return res.status(401).json({ error: 'Not authenticated' });

  // Use SUBCONSCIOUS_API_KEY from environment
  const apiKey = process.env.SUBCONSCIOUS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Subconscious API key configuration' });
  }

  const body = req.body;
  if (!body || typeof body !== 'object' || !body.model || !ALLOWED_MODELS.has(body.model)) {
    return res.status(400).json({ error: 'Invalid Subconscious request: unsupported model' });
  }

  try {
    const upstream = await fetch('https://api.subconscious.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');

    if (body.stream && upstream.body) {
      return upstream.body.pipeTo(new WritableStream({
        write(chunk) {
          res.write(Buffer.from(chunk));
        },
        close() {
          res.end();
        },
        abort(err) {
          console.error('Subconscious stream aborted:', err);
          res.end();
        },
      }));
    }

    return res.send(await upstream.text());
  } catch (err) {
    console.error('Subconscious proxy error:', err);
    return res.status(500).json({ error: 'Subconscious request failed' });
  }
}
