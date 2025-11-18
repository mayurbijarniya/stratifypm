# StratifyPM

> AI-powered assistant for product managers with strategic insights, data analysis, and PM frameworks. Choose between Claude 4.0 Sonnet and Gemini 2.5 Pro models.

## Features

- **Dual AI Models** - Claude 4.0 Sonnet and Gemini 2.5 Pro
-   **Real-time Web Search** - Current market data and trends via Exa AI
- **PM Frameworks** - RICE scoring, competitive analysis, user research
-   **File Analysis** - Upload CSV/Excel/JSON for insights
- **Conversation Memory** - Persistent chat history
- **Dark/Light Mode** - Professional UI
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

3. **Run**
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_DEEPINFRA_API_KEY` | DeepInfra API key for Claude | Yes |
| `VITE_GEMINI_API_KEY` | Google AI Studio API key for Gemini | Yes |
| `VITE_EXA_API_KEY` | Exa AI API key for web search | Yes |

Get API keys:
- **DeepInfra**: [Dashboard](https://deepinfra.com/dash/api_keys)
- **Google AI Studio**: [API Keys](https://makersuite.google.com/app/apikey)
- **Exa AI**: [Dashboard](https://exa.ai/)

## Security

**Warning: Never commit API keys to version control!**
- Copy `.env.example` to `.env.local` and add your actual API keys
- Test files are ignored to prevent accidental commits

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI**: Claude 4.0 Sonnet (DeepInfra), Gemini 2.5 Pro (Google AI)
- **State**: Zustand with persistence
- **Build**: Vite

## License

MIT License - see [LICENSE](LICENSE) file for details.
