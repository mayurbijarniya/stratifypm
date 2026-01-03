# StratifyPM

AI-powered assistant for product managers with strategic insights, data analysis, and PM frameworks. Choose between Claude 4.0 Sonnet and Gemini 2.5 Pro models.

## Features

- **Dual AI Models** - Claude 4.0 Sonnet and Gemini 2.5 Pro
- **Real-time Web Search** - Current market data and trends via Exa AI
- **PM Frameworks** - RICE scoring, competitive analysis, user research
- **File Analysis** - Upload CSV/Excel/JSON for insights
- **Conversation Memory** - Persistent chat history with database storage
- **Email Authentication** - OTP-based sign in/sign up
- **Dark/Light Mode** - Professional UI with glassmorphism effects
- **Mobile Optimized** - Responsive design

## Quick Start

1. **Install**
   ```bash
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env.local
   # Add your API keys to .env.local
   ```

3. **Database Setup**
   - Create a Neon PostgreSQL database at https://neon.tech
   - Run `db/schema.sql` against your database

4. **Run**
   ```bash
   npm run dev
   ```

This starts:
- Vite dev server on `http://localhost:5173`
- Local API server on `http://localhost:8787`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google AI Studio API key for Gemini | Yes |
| `VITE_DEEPINFRA_API_KEY` | DeepInfra API key for Claude | Yes |
| `VITE_EXA_API_KEY` | Exa AI API key for web search | Yes |
| `DATABASE_URL` | Neon Postgres connection string | Yes |
| `AUTH_SECRET` | Secret for hashing OTPs and sessions | Yes |
| `RESEND_API_KEY` | Resend API key for OTP email | Yes |
| `RESEND_FROM_EMAIL` | Verified sender email for Resend | Yes |
| `RESEND_FROM_NAME` | Sender name for OTP emails | No |

Get API keys:
- **Google AI Studio**: [API Keys](https://makersuite.google.com/app/apikey)
- **DeepInfra**: [Dashboard](https://deepinfra.com/dash/api_keys)
- **Exa AI**: [Dashboard](https://exa.ai/)
- **Neon**: [Console](https://neon.tech/)
- **Resend**: [API Keys](https://resend.com/api-keys)

## Authentication

StratifyPM uses email-based OTP authentication via Resend:
- Enter your email to receive a 6-digit code
- Enter the code to sign in/up
- Sessions persist via HTTP-only cookies

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Zustand
- **Backend**: Express.js, Neon PostgreSQL, cookie-parser
- **AI**: Claude 4.0 Sonnet (DeepInfra), Gemini 2.5 Pro (Google AI)
- **Web Search**: Exa AI
- **Email**: Resend
- **Build**: Vite

## Project Structure

```
src/
├── components/
│   ├── app/          # AppShell component
│   ├── auth/         # AuthScreen, AuthGate
│   ├── chat/         # MessageInput, MessageList, etc.
│   ├── features/     # FileUpload
│   ├── layout/       # Header, Navbar, Sidebar
│   ├── marketing/    # LandingPage, AboutPage
│   └── ui/           # Reusable UI components
├── stores/           # Zustand stores (appStore, authStore)
├── utils/            # API clients, services
└── hooks/            # Custom React hooks

api/                  # Express API handlers
server/               # Express server entry point
db/                   # Database schema
```

## Security Notes

**Warning: Never commit API keys to version control!**
- Copy `.env.example` to `.env.local` and add your actual API keys
- `.env.local` is in .gitignore

## License

MIT License - see [LICENSE](LICENSE) file for details.
