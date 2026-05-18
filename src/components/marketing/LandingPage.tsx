import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Target,
  Users,
  Shield,
  MessageSquare,
  Zap,
  Globe,
  TrendingUp,
  Layers,
  Brain,
  Search,
  Upload,
} from 'lucide-react';
import { PublicLayout } from './PublicLayout';
import { Button } from '../ui/Button';

const Reveal = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// Defined outside component to avoid stale closure in useEffect
const RICE_DATA = [
  { feature: 'Onboarding Flow', r: 9, i: 8, c: '0.9', e: 3, score: '24.0' },
  { feature: 'CSV Export',      r: 7, i: 6, c: '0.8', e: 2, score: '16.8' },
  { feature: 'AI Summaries',    r: 8, i: 9, c: '0.7', e: 4, score: '12.6' },
  { feature: 'Team Collab',     r: 5, i: 9, c: '0.6', e: 5, score:  '5.4' },
];

const MockChat = () => {
  const [visibleRows, setVisibleRows] = useState(0);
  const [showRec, setShowRec] = useState(false);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleRows(count);
      if (count >= RICE_DATA.length) {
        clearInterval(interval);
        setTimeout(() => setShowRec(true), 350);
      }
    }, 520);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-950 shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#f4f4f5] w-full max-w-lg">
      {/* Terminal header */}
      <div className="border-b-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 px-4 py-2.5 flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold text-chartreuse dark:text-zinc-900 uppercase tracking-widest">
          // STRATIFYPM · ACTIVE SESSION
        </span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 dark:bg-zinc-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 dark:bg-zinc-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-chartreuse dark:bg-zinc-800 dark:border-2 dark:border-zinc-400 animate-pulse" />
        </div>
      </div>

      <div className="p-5 space-y-4 font-mono text-xs">
        {/* User message */}
        <div className="flex justify-end">
          <div className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-4 py-2.5 max-w-[85%] border-2 border-zinc-900 dark:border-zinc-100">
            <span className="text-chartreuse dark:text-zinc-700 font-bold">YOU → </span>
            RICE score our top 4 features for Q3
          </div>
        </div>

        {/* AI response */}
        <div className="flex justify-start">
          <div className="bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-100 p-4 w-full">
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-700 dark:text-chartreuse mb-3">
              STRATIFY → RICE ANALYSIS
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-x-2 text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500 border-b-2 border-zinc-300 dark:border-zinc-700 pb-1.5 mb-1">
              <span>Feature</span>
              <span className="text-center">R</span>
              <span className="text-center">I</span>
              <span className="text-center">C</span>
              <span className="text-right">Score</span>
            </div>

            {/* Animated rows */}
            {RICE_DATA.slice(0, visibleRows).map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22 }}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-x-2 text-[10px] py-1.5 border-b border-zinc-200 dark:border-zinc-800 last:border-0 items-center"
              >
                <span className="text-zinc-800 dark:text-zinc-200 font-semibold truncate">{row.feature}</span>
                <span className="text-center text-zinc-500">{row.r}</span>
                <span className="text-center text-zinc-500">{row.i}</span>
                <span className="text-center text-zinc-500">{row.c}</span>
                <span className="text-right font-black text-zinc-50 dark:text-zinc-900 bg-zinc-900 dark:bg-chartreuse px-1.5 py-0.5">
                  {row.score}
                </span>
              </motion.div>
            ))}

            {visibleRows < RICE_DATA.length && (
              <div className="text-zinc-400 text-[10px] mt-2 animate-pulse">
                calculating scores...
              </div>
            )}

            {showRec && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 border-t-2 border-zinc-300 dark:border-zinc-700 pt-2.5 text-[10px] text-zinc-500 dark:text-zinc-400"
              >
                → Ship{' '}
                <span className="font-black text-zinc-900 dark:text-white underline decoration-zinc-900 dark:decoration-chartreuse decoration-2 underline-offset-2">
                  Onboarding Flow
                </span>{' '}
                first — highest ROI, strong reach signal
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-chartreuse animate-pulse" />
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Claude Sonnet 4.6</span>
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            ← switch model anytime
          </span>
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  return (
    <PublicLayout>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden border-b-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-950">
        <div
          className="absolute inset-0 pointer-events-none -z-10 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 w-full py-14 md:py-20">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">

            {/* Left: Copy */}
            <div className="flex flex-col">
              <Reveal>
                <div className="inline-flex items-center gap-2 border-2 border-zinc-900 dark:border-zinc-100 bg-chartreuse text-zinc-900 px-3 py-1 font-mono font-bold uppercase tracking-widest text-xs mb-8 w-fit shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#f4f4f5]">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse" />
                  AI-POWERED PM ASSISTANT
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tighter font-heading text-zinc-900 dark:text-zinc-50 leading-[0.92] mb-6 uppercase">
                  Think like a<br />
                  <span className="relative inline-block">
                    <span className="relative z-10">Senior PM.</span>
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-chartreuse -z-0 opacity-70" />
                  </span>
                  <br />
                  <span className="text-zinc-400 dark:text-zinc-500 italic font-light normal-case tracking-normal text-4xl md:text-5xl xl:text-6xl">
                    Instantly.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10 max-w-md font-sans">
                  The AI assistant built exclusively for Product Managers. Combine Claude, Gemini, and GPT with 12 PM frameworks, file analysis, and live market intelligence — all in one workspace.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto rounded-none border-2 border-zinc-900 dark:border-zinc-100 !bg-chartreuse !text-zinc-900 hover:!bg-zinc-900 dark:hover:!bg-zinc-100 hover:!text-zinc-50 dark:hover:!text-zinc-900 transition-all uppercase tracking-widest font-black text-sm py-3.5 px-8 shadow-[5px_5px_0_0_#18181b] dark:shadow-[5px_5px_0_0_#f4f4f5] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                      Start Free →
                    </Button>
                  </Link>
                  <Link to="/about" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto rounded-none border-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-900 hover:text-zinc-50 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all uppercase tracking-widest font-bold text-sm py-3.5 px-8">
                      How It Works
                    </Button>
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {['3 AI Models', '12 PM Frameworks', 'CSV/Excel Analysis', 'Live Web Search'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-chartreuse border border-zinc-900 dark:border-zinc-100" />
                      <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right: Mock Chat */}
            <Reveal delay={180} className="flex lg:justify-end">
              <MockChat />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES TICKER ──────────────────────────────────────────── */}
      <section className="border-b-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 overflow-hidden py-3">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              {capabilities.map((cap, j) => (
                <span
                  key={j}
                  className="text-zinc-100 dark:text-zinc-900 font-mono font-bold uppercase tracking-widest text-[11px] mx-10 flex items-center gap-2.5 flex-shrink-0"
                >
                  <cap.icon className="w-3 h-3 text-chartreuse dark:text-zinc-700 flex-shrink-0" />
                  {cap.label}
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950 border-b-2 border-zinc-900 dark:border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-end justify-between mb-16 gap-8 flex-wrap">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
                  [ WORKFLOW ]
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">
                  How it<br />works.
                </h2>
              </div>
              <p className="hidden md:block text-zinc-500 dark:text-zinc-400 text-sm font-mono uppercase tracking-wider max-w-xs text-right">
                From raw idea to execution-ready output in seconds
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 border-2 border-zinc-900 dark:border-zinc-100">
            {steps.map((step, idx) => (
              <Reveal key={idx} delay={idx * 120}>
                <div
                  className={`p-10 md:p-12 h-full ${
                    idx < steps.length - 1
                      ? 'border-b-2 md:border-b-0 md:border-r-2 border-zinc-900 dark:border-zinc-100'
                      : ''
                  }`}
                >
                  <div className="font-mono text-6xl font-black text-zinc-300 dark:text-zinc-600 mb-6 leading-none select-none">
                    0{idx + 1}
                  </div>
                  <div className="w-12 h-12 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center mb-6 bg-chartreuse text-zinc-900">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold font-heading uppercase tracking-tight text-zinc-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 border-b-2 border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-16">
              <div className="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-4">
                [ PLATFORM CAPABILITIES ]
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold font-heading uppercase tracking-tighter leading-tight">
                Everything a PM needs.<br />
                <span className="text-zinc-500 dark:text-zinc-400">Nothing they don't.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-700 dark:bg-zinc-300 border border-zinc-700 dark:border-zinc-300">
            {features.map((feature, idx) => (
              <Reveal key={idx} delay={idx * 60}>
                <div className="bg-zinc-900 dark:bg-zinc-100 p-8 md:p-10 group hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors h-full">
                  <div className="w-10 h-10 border-2 border-zinc-700 dark:border-zinc-300 flex items-center justify-center mb-6 group-hover:border-chartreuse group-hover:bg-chartreuse group-hover:text-zinc-900 dark:group-hover:border-zinc-900 dark:group-hover:bg-zinc-900 dark:group-hover:text-chartreuse transition-all text-zinc-500 dark:text-zinc-500">
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-tight text-zinc-100 dark:text-zinc-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400 dark:text-zinc-600 leading-relaxed font-sans mb-4">
                    {feature.description}
                  </p>
                  {feature.tag && (
                    <div className="inline-block font-mono text-[10px] font-bold uppercase tracking-widest bg-chartreuse text-zinc-900 dark:bg-zinc-900 dark:text-chartreuse px-2 py-0.5">
                      {feature.tag}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950 border-b-2 border-zinc-900 dark:border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-16 text-center">
              <div className="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                [ REAL PM WORKFLOWS ]
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold font-heading uppercase tracking-tighter text-zinc-900 dark:text-white leading-tight">
                Built for how PMs<br />actually work.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((uc, idx) => (
              <Reveal key={idx} delay={idx * 80}>
                <div className="border-2 border-zinc-900 dark:border-zinc-100 p-8 group hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#18181b] dark:hover:shadow-[6px_6px_0_0_#f4f4f5] transition-all bg-zinc-50 dark:bg-zinc-950 h-full">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:bg-chartreuse group-hover:text-zinc-900 group-hover:border-zinc-900 transition-all text-zinc-600 dark:text-zinc-400">
                      <uc.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
                        {uc.category}
                      </div>
                      <h3 className="text-lg font-bold uppercase font-heading text-zinc-900 dark:text-white mb-2">
                        {uc.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                        {uc.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                    <div className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                      Example prompt
                    </div>
                    <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 italic">
                      "{uc.prompt}"
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-zinc-900 dark:bg-zinc-100 border-b-2 border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {trust.map((item, idx) => (
              <Reveal key={idx} delay={idx * 80}>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 border-2 border-zinc-700 dark:border-zinc-700 flex items-center justify-center flex-shrink-0 bg-chartreuse text-zinc-900 dark:bg-zinc-900 dark:text-chartreuse">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-100 dark:text-zinc-900 mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-400 dark:text-zinc-600 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-28 md:py-40 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">
              [ GET STARTED FREE ]
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold font-heading text-zinc-900 dark:text-zinc-50 uppercase leading-[0.9] tracking-tighter mb-8">
              Ship better<br />products.
              <br />
              <span className="text-zinc-400 dark:text-zinc-500 italic font-light normal-case tracking-normal text-4xl md:text-5xl">
                Starting today.
              </span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-base mb-10 font-sans max-w-sm mx-auto leading-relaxed">
              No credit card. No setup. Just your email and you're in.
            </p>
            <Link to="/signup" className="inline-block">
              <Button className="rounded-none border-2 border-zinc-900 dark:border-zinc-100 !bg-chartreuse !text-zinc-900 hover:!bg-zinc-900 dark:hover:!bg-zinc-100 hover:!text-zinc-50 dark:hover:!text-zinc-900 transition-all uppercase tracking-widest font-black text-sm py-4 px-12 shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#f4f4f5] hover:translate-y-2 hover:translate-x-2 hover:shadow-none">
                Try StratifyPM Free →
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

    </PublicLayout>
  );
};

// ─── Data ────────────────────────────────────────────────────────────────────

const capabilities = [
  { icon: Brain,       label: 'RICE Scoring' },
  { icon: Globe,       label: 'Live Market Intelligence' },
  { icon: Upload,      label: 'CSV / Excel Analysis' },
  { icon: Layers,      label: 'Product Roadmaps' },
  { icon: Search,      label: 'Competitive Analysis' },
  { icon: Users,       label: 'User Personas' },
  { icon: TrendingUp,  label: 'KPI Dashboards' },
  { icon: Zap,         label: 'Sprint Planning' },
];

const steps = [
  {
    icon: MessageSquare,
    title: 'Ask or Pick a Framework',
    description:
      'Type a free-form question or choose from 12 built-in PM frameworks — RICE, competitive analysis, user personas, sprint planning, and more.',
  },
  {
    icon: Upload,
    title: 'Attach Your Data',
    description:
      'Upload CSVs, Excel sheets, or JSON files. StratifyPM parses your data and injects it directly into the AI analysis — no preprocessing needed.',
  },
  {
    icon: Zap,
    title: 'Get Execution-Ready Output',
    description:
      'Receive structured frameworks, prioritized roadmaps, PRDs, and analysis grounded in your actual data — ready to act on immediately.',
  },
];

const features = [
  {
    icon: Brain,
    title: 'Multi-Model Intelligence',
    description:
      'Switch between Claude, Gemini, and GPT without leaving your conversation. Each model has unique strengths — you choose what fits the task.',
    tag: '3 AI Models',
  },
  {
    icon: Target,
    title: '12 PM Frameworks Built-In',
    description:
      'RICE scoring, Jobs-to-be-Done, sprint planning, competitive analysis, roadmaps, and more — all pre-configured for product management workflows.',
    tag: 'Frameworks',
  },
  {
    icon: BarChart3,
    title: 'File Analysis',
    description:
      'Upload CSV, Excel, or JSON. StratifyPM analyzes up to 2,000 rows and generates insights directly from your actual product data.',
    tag: 'CSV · Excel · JSON',
  },
  {
    icon: Globe,
    title: 'Live Market Intelligence',
    description:
      'Real-time web search via Exa AI surfaces live competitor positioning, market trends, and industry signals inside every relevant response.',
    tag: 'Real-Time',
  },
  {
    icon: Shield,
    title: 'PM-Only Focus',
    description:
      'An intelligent classifier keeps every conversation on-topic. No off-track responses — only expert PM guidance, every time.',
    tag: 'Domain-Focused',
  },
  {
    icon: MessageSquare,
    title: 'Persistent Conversations',
    description:
      'Every conversation saves to your account. Resume your roadmap session, revisit your research, or continue your analysis anytime.',
    tag: 'Always Saved',
  },
];

const useCases = [
  {
    icon: Target,
    category: 'Prioritization',
    title: 'RICE-score your entire backlog',
    description:
      'Upload your feature list as a CSV and get a fully scored, ranked backlog with rationale for each prioritization decision.',
    prompt: 'Score these 12 features using RICE and rank them by priority for our Q3 roadmap.',
  },
  {
    icon: Search,
    category: 'Research',
    title: 'Competitive analysis in seconds',
    description:
      'Get a live, structured breakdown of competitors — positioning, weaknesses, and white space — backed by real-time web data.',
    prompt: 'Do a competitive analysis of Figma vs Sketch vs Adobe XD for enterprise design teams.',
  },
  {
    icon: Users,
    category: 'User Research',
    title: 'Generate personas from your data',
    description:
      'Upload your user survey CSV and get detailed personas, behavioral patterns, and Jobs-to-be-Done frameworks derived from real data.',
    prompt: 'Build 3 user personas from this survey CSV and map their core jobs-to-be-done.',
  },
  {
    icon: BarChart3,
    category: 'Analytics',
    title: 'Turn raw metrics into a KPI plan',
    description:
      'Drop in your metrics spreadsheet and get a structured KPI analysis with trend interpretation and actionable recommendations.',
    prompt: 'Analyze this monthly metrics CSV and identify the 3 KPIs most at risk this quarter.',
  },
];

const trust = [
  {
    title: 'No Model Training',
    description:
      'Your product strategy and proprietary data are never used to train AI models. What you share stays yours, always.',
  },
  {
    title: 'Encrypted at Rest',
    description:
      'All conversations and uploaded files are encrypted. Sessions secured with HTTP-only cookies and hashed tokens.',
  },
  {
    title: 'Passwordless Auth',
    description:
      'Sign in with just your email via OTP — no passwords to forget, no credentials to leak.',
  },
];

export default LandingPage;
