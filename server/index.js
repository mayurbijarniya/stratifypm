import express from 'express';
import cookieParser from 'cookie-parser';

import exaSearchHandler from '../api/exa/search.js';
import requestOtpHandler from '../api/auth/request-otp.js';
import verifyOtpHandler from '../api/auth/verify-otp.js';
import meHandler from '../api/auth/me.js';
import logoutHandler from '../api/auth/logout.js';
import conversationsHandler from '../api/conversations/index.js';
import conversationHandler from '../api/conversations/[id].js';

const app = express();
const port = Number(process.env.API_PORT || 8787);

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

// CORS headers for local development
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://stratifypm.mayur.app',
    'https://stratifypm.mayur.run',
  ];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.all('/api/exa/search', exaSearchHandler);

app.all('/api/auth/request-otp', requestOtpHandler);
app.all('/api/auth/verify-otp', verifyOtpHandler);
app.all('/api/auth/me', meHandler);
app.all('/api/auth/logout', logoutHandler);

app.all('/api/conversations', conversationsHandler);
app.all('/api/conversations/:id', conversationHandler);

app.listen(port);
console.log(`API server running on http://localhost:${port}`);
