import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://stratifypm.mayur.app',
];

function setCORS(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[1];
  const reqHeaders = req.headers['access-control-request-headers'] || 'Content-Type';
  
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', reqHeaders as string);
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCORS(req, res); // ✅ Always set headers first
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // ✅ Preflight handled here
  }

  try {
    const apiKey = process.env.VITE_EXA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing API key' });
    }

    const upstream = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(req.body),
    });

    const text = await upstream.text();
    return res.status(upstream.status).send(text);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Unknown error' });
  }
}