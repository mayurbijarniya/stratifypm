import { getAuthSession } from '../_utils/auth.js';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://stratifypm.mayur.app',
  'https://stratifypm.mayur.run',
];

const ALLOWED_MODELS = new Set(['gemini-3.1-flash-lite']);

function setCORS(req, res) {
  const origin = req.headers.origin || '';
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[1];
  const reqHeaders = req.headers['access-control-request-headers'] || 'Content-Type';

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', reqHeaders);
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
}

export default async function handler(req, res) {
  setCORS(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await getAuthSession(req);
  if (!auth) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Gemini API key configuration' });
  }

  const { model = 'gemini-3.1-flash-lite', body } = req.body || {};
  if (!ALLOWED_MODELS.has(model) || !body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid Gemini request' });
  }

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    return res.send(text);
  } catch (err) {
    console.error('Gemini proxy error:', err);
    return res.status(500).json({ error: 'Gemini request failed' });
  }
}
