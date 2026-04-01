import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { PublicLayout } from './PublicLayout';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  BarChart3,
  MessageSquare,
  FileText,
  Users,
  CheckCircle,
  ChevronRight,
  Target,
  TrendingUp,
} from '../ui/icons';

// ─── Animation ───────────────────────────────────────────────────────

const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Data ────────────────────────────────────────────────────────────

const features = [
  {
    icon: MessageSquare,
    title: 'Dual AI Models',
    description: 'Claude and Gemini working together — deep analysis meets fast classification.',
  },
  {
    icon: BarChart3,
    title: 'Market Intelligence',
    description: 'Real-time web search pulls current market data, competitor moves, and industry trends.',
  },
  {
    icon: FileText,
    title: 'Data Analysis',
    description: 'Upload CSV, Excel, or JSON. Get instant insights — no data pipeline needed.',
  },
  {
    icon: Target,
    title: 'PM Frameworks',
    description: 'RICE scoring, SWOT, OKRs, competitive matrices — structured thinking on demand.',
  },
  {
    icon: Shield,
    title: 'Private by Default',
    description: 'Encrypted storage, no model training on your data, session-based auth.',
  },
  {
    icon: Users,
    title: 'Built for Teams',
    description: 'Share analyses, export decisions, and align stakeholders from one place.',
  },
];

const steps = [
  { title: 'Ask a question', desc: 'Type naturally about strategy, roadmaps, metrics — or upload a dataset.' },
  { title: 'AI does the work', desc: 'Get structured analysis with frameworks, live data, and clear recommendations.' },
  { title: 'Ship with confidence', desc: 'Export insights, share with your team, and move forward with clarity.' },
];

const faqs = [
  {
    q: 'What AI models does Stratify use?',
    a: 'Claude by Anthropic for deep strategic analysis, and Gemini by Google for fast classification and query optimization. Both work together seamlessly.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. All data is encrypted at rest and in transit. We never use your data for model training. Sessions expire after 30 days.',
  },
  {
    q: 'What file formats can I upload?',
    a: 'CSV, Excel (XLSX/XLS), JSON, and plain text files. Data is analyzed instantly with up to 2,000 rows of context sent to the AI.',
  },
  {
    q: 'Is this actually free?',
    a: 'Completely. Every feature — AI chat, file analysis, frameworks, web search — is free with no usage limits and no credit card required.',
  },
];

const pricingItems = [
  'Unlimited conversations',
  'Claude & Gemini models',
  'File uploads & analysis',
  'Export to Markdown / CSV',
  'PM frameworks & templates',
  'Real-time web search',
];

// ─── Border color helpers (DRY) ──────────────────────────────────────

const border = 'border-slate-200 dark:border-slate-800';
const borderB = `border-b ${border}`;

// ─── FAQ Accordion (exclusive: one open at a time) ──────────────────

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className={borderB}>
      <div className="mx-auto w-full max-w-3xl px-6 py-20 lg:py-24">
        <Reveal>
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Questions & Answers
          </h2>
        </Reveal>

        <div className={`overflow-hidden rounded-lg border ${border}`}>
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className={i < faqs.length - 1 ? borderB : ''}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60"
                >
                  <span className="pr-4 text-[15px] font-medium text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      openIndex === i ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Component ───────────────────────────────────────────────────────

export const LandingPage: React.FC = () => {
  return (
    <PublicLayout>
      {/* ━━ Hero ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className={`${borderB}`}>
        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
          {/* Copy */}
          <Reveal>
            <div className="space-y-8">
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.5rem]">
                Ship the right product,{' '}
                <span className="text-primary">faster</span>
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Stratify helps product managers research, prioritize, and
                strategize using proven frameworks and real-time data.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="rounded-lg text-base">
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/signin">
                  <button className={`flex items-center gap-2 rounded-lg border ${border} bg-white px-6 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50 dark:bg-transparent dark:text-slate-300 dark:hover:bg-slate-900`}>
                    Sign in
                  </button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> Free forever
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> Ready in seconds
                </span>
              </div>
            </div>
          </Reveal>

          {/* App preview */}
          <Reveal delay={0.12}>
            <div className={`overflow-hidden rounded-lg border ${border}`}>
              {/* Window bar */}
              <div className={`flex items-center gap-2 ${borderB} px-4 py-3`}>
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                </div>
                <div className="ml-2 text-[11px] text-slate-400 dark:text-slate-500">
                  stratifypm.com/app
                </div>
              </div>

              {/* Chat mock */}
              <div className="space-y-5 p-5 sm:p-6">
                {/* User */}
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    M
                  </div>
                  <div className={`rounded-lg border ${border} px-4 py-2.5 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300`}>
                    How should I prioritize features for our Q2 roadmap?
                  </div>
                </div>

                {/* Assistant */}
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    S
                  </div>
                  <div className={`flex-1 space-y-3 rounded-lg border ${border} px-4 py-3`}>
                    <p className="text-[13px] font-medium text-slate-800 dark:text-slate-200">
                      Here's a RICE analysis based on your inputs:
                    </p>
                    <div className={`overflow-hidden rounded-md border ${border}`}>
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr className={`${borderB} text-left text-slate-500 dark:text-slate-400`}>
                            <th className="px-3 py-2 font-medium">Feature</th>
                            <th className="px-3 py-2 font-medium">Reach</th>
                            <th className="px-3 py-2 font-medium">Impact</th>
                            <th className="px-3 py-2 font-medium">Score</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-700 dark:text-slate-300">
                          <tr className={borderB}>
                            <td className="px-3 py-2">SSO Integration</td>
                            <td className="px-3 py-2">8K</td>
                            <td className="px-3 py-2">High</td>
                            <td className="px-3 py-2 font-semibold text-emerald-600 dark:text-emerald-400">92</td>
                          </tr>
                          <tr className={borderB}>
                            <td className="px-3 py-2">Dashboard v2</td>
                            <td className="px-3 py-2">5K</td>
                            <td className="px-3 py-2">Med</td>
                            <td className="px-3 py-2 font-semibold text-amber-600 dark:text-amber-400">78</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2">Mobile App</td>
                            <td className="px-3 py-2">12K</td>
                            <td className="px-3 py-2">Low</td>
                            <td className="px-3 py-2 font-semibold text-slate-500">54</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400">
                      SSO has the highest RICE score. I'd recommend leading with it for Q2.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━ Features ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className={borderB}>
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-24">
          <Reveal>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Tools that match how PMs actually work
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                Not another generic chat. Every feature is built for product thinking.
              </p>
            </div>
          </Reveal>

          {/* 3×2 bordered grid — shared borders between cells */}
          <Reveal delay={0.05}>
            <div className={`overflow-hidden rounded-lg border ${border}`}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                {features.map((f, i) => {
                  // Right border unless last in row, bottom border unless last row
                  const isLastCol3 = (i + 1) % 3 === 0;
                  const isLastCol2 = (i + 1) % 2 === 0;
                  const isLastRow3 = i >= 3; // row 2 of 2 in 3-col
                  const isLastRow2 = i >= 4; // row 3 of 3 in 2-col

                  return (
                    <div
                      key={f.title}
                      className={[
                        'p-6 sm:p-8 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60',
                        // Right border
                        !isLastCol3 ? 'lg:border-r' : '',
                        !isLastCol2 ? 'sm:max-lg:border-r' : '',
                        // Bottom border
                        !isLastRow3 ? 'lg:border-b' : '',
                        !isLastRow2 ? 'sm:max-lg:border-b' : '',
                        // Mobile: always bottom border except last
                        i < features.length - 1 ? 'max-sm:border-b' : '',
                        border,
                      ].join(' ')}
                    >
                      <f.icon className="mb-4 h-5 w-5 text-slate-900 dark:text-white" />
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        {f.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {f.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━ How it works ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className={borderB}>
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-24">
          <Reveal>
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Three steps. That's it.
            </h2>
            <p className="mx-auto mb-16 max-w-md text-center text-base text-slate-600 dark:text-slate-400">
              No setup, no onboarding flows, no configuration.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <div className={`overflow-hidden rounded-lg border ${border}`}>
              <div className="grid md:grid-cols-3">
                {steps.map((s, i) => (
                  <div
                    key={s.title}
                    className={[
                      'p-8 sm:p-10',
                      i < steps.length - 1 ? `md:border-r max-md:border-b ${border}` : '',
                    ].join(' ')}
                  >
                    <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-md border border-slate-900 text-sm font-bold text-slate-900 dark:border-white dark:text-white">
                      {i + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━ Use cases — alternating 2-col grid ━━━━━━━━━━━━━━━━━━━━━ */}
      <section className={borderB}>
        <div className="mx-auto w-full max-w-7xl">
          {/* Row 1 */}
          <div className={`grid md:grid-cols-2 ${borderB}`}>
            <div className={`flex flex-col justify-center p-8 sm:p-12 lg:p-16 md:border-r ${border}`}>
              <Reveal>
                <TrendingUp className="mb-4 h-6 w-6 text-slate-900 dark:text-white" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Competitive Analysis
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  Pull real-time competitor data from the web and get structured comparisons, market positioning maps, and strategic recommendations — in seconds.
                </p>
              </Reveal>
            </div>
            <div className="flex items-center justify-center bg-slate-50 p-6 sm:p-12 dark:bg-slate-900/40">
              <Reveal delay={0.08}>
                <div className={`w-full max-w-xs rounded-lg border ${border} bg-white p-4 sm:p-5 dark:bg-slate-950`}>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Competitor Matrix</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Feature parity', pct: 82 },
                      { label: 'Pricing model', pct: 91 },
                      { label: 'Market share', pct: 65 },
                      { label: 'User satisfaction', pct: 74 },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                          <span className="ml-2 text-xs font-medium text-slate-400">{item.pct}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-slate-900 dark:bg-white"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Row 2 — reversed */}
          <div className={`grid md:grid-cols-2 ${borderB}`}>
            <div className={`flex items-center justify-center bg-slate-50 p-6 sm:p-12 dark:bg-slate-900/40 md:border-r ${border} max-md:order-2`}>
              <Reveal delay={0.08}>
                <div className={`w-full max-w-xs rounded-lg border ${border} bg-white p-4 sm:p-5 dark:bg-slate-950`}>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Metrics Dashboard</p>
                  <div className="flex h-24 items-end gap-1.5 sm:gap-2">
                    {[44, 72, 50, 89, 61, 78, 100, 67, 94].map((pct, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-slate-900 dark:bg-white"
                        style={{ height: `${pct}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-slate-900 dark:text-white">+23%</span>
                    <span className="text-xs text-slate-400">vs last quarter</span>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 max-md:order-1">
              <Reveal>
                <BarChart3 className="mb-4 h-6 w-6 text-slate-900 dark:text-white" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Metrics & KPIs
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  Upload your data, ask questions in plain language, and get clear visualizations and trend analysis without touching a spreadsheet.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-2">
            <div className={`flex flex-col justify-center p-8 sm:p-12 lg:p-16 md:border-r ${border}`}>
              <Reveal>
                <Target className="mb-4 h-6 w-6 text-slate-900 dark:text-white" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Roadmap Planning
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400">
                  Prioritize with RICE, build quarterly plans, and get AI-powered recommendations on what to ship next — backed by data, not gut feel.
                </p>
              </Reveal>
            </div>
            <div className="flex items-center justify-center bg-slate-50 p-6 sm:p-12 dark:bg-slate-900/40">
              <Reveal delay={0.08}>
                <div className={`w-full max-w-xs rounded-lg border ${border} bg-white p-4 sm:p-5 dark:bg-slate-950`}>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">RICE Scores</p>
                  <div className="space-y-3">
                    {[
                      { name: 'SSO Integration', score: 92 },
                      { name: 'Dashboard v2', score: 78 },
                      { name: 'Mobile App', score: 54 },
                    ].map((item) => (
                      <div key={item.name}>
                        <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                          <span className="ml-2 font-semibold text-slate-900 dark:text-white">{item.score}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-slate-900 dark:bg-white"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ━━ Pricing ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className={borderB}>
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-24">
          <Reveal>
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              No pricing tiers. Just free.
            </h2>
            <p className="mx-auto mb-14 max-w-md text-center text-base text-slate-600 dark:text-slate-400">
              Every feature, every model — zero cost.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className={`mx-auto max-w-sm overflow-hidden rounded-lg border ${border}`}>
              <div className={`${borderB} p-8`}>
                <p className="text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Full access</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-slate-900 dark:text-white">$0</span>
                  <span className="text-slate-400">/forever</span>
                </div>
              </div>
              <div className="p-8">
                <ul className="space-y-3">
                  {pricingItems.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button fullWidth className="mt-8 rounded-lg">
                    Get started
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━ FAQ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <FaqSection />

      {/* ━━ Final CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section>
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
          <Reveal>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Start making better product decisions
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base text-slate-600 dark:text-slate-400">
                It takes 30 seconds to set up. No credit card, no onboarding call.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="rounded-lg text-base">
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/signin">
                  <button className={`rounded-lg border ${border} px-6 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900`}>
                    Sign in
                  </button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PublicLayout>
  );
};
