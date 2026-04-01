import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from './PublicLayout';
import { Button } from '../ui/Button';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Target,
  Users,
  Shield,
  MessageSquare,
  BarChart3,
  FileText,
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

const border = 'border-slate-200 dark:border-slate-800';
const borderB = `border-b ${border}`;

const principles = [
  {
    icon: Target,
    title: 'Built for PM workflows',
    description: 'Every response is structured around real PM artifacts — roadmaps, KPI dashboards, RICE scores, competitive matrices.',
  },
  {
    icon: MessageSquare,
    title: 'Two models, one workspace',
    description: 'Claude handles deep strategic analysis. Gemini handles fast classification and query optimization. You get the best of both.',
  },
  {
    icon: BarChart3,
    title: 'Real-time data',
    description: 'Web search pulls current market data, competitor moves, and industry trends — so your decisions aren\'t based on stale information.',
  },
  {
    icon: FileText,
    title: 'Your data, analyzed',
    description: 'Upload CSV, Excel, or JSON files. Get instant insights, visualizations, and trends without touching a spreadsheet.',
  },
  {
    icon: Shield,
    title: 'Privacy first',
    description: 'Encrypted storage, session-based auth, and we never train models on your data. Your workspace stays yours.',
  },
  {
    icon: Users,
    title: 'Open and free',
    description: 'Every feature is free — no paywalls, no usage limits, no credit card. We believe PM tools should be accessible to everyone.',
  },
];

const timeline = [
  { label: 'Idea', description: 'Born from frustration with generic AI tools that don\'t understand product management.' },
  { label: 'Built', description: 'Designed and developed as a focused workspace where PM frameworks meet AI intelligence.' },
  { label: 'Shipped', description: 'Launched free for anyone who makes product decisions — from solo PMs to team leads.' },
];

// ─── Component ───────────────────────────────────────────────────────

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PublicLayout>
      {/* ━━ Hero ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className={borderB}>
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
          <Reveal>
            <div className="mx-auto max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                About StratifyPM
              </p>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                A focused workspace for product decision makers
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                StratifyPM is designed for product leaders who need structured thinking, fast synthesis, and dependable insights. We combine proven frameworks with AI models so your team can keep momentum without losing rigor.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━ Story timeline ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className={borderB}>
        <div className="mx-auto w-full max-w-7xl">
          <Reveal delay={0.05}>
            <div className={`overflow-hidden rounded-none border-x-0`}>
              <div className="grid md:grid-cols-3">
                {timeline.map((item, i) => (
                  <div
                    key={item.label}
                    className={[
                      'p-8 sm:p-12',
                      i < timeline.length - 1 ? `md:border-r max-md:border-b ${border}` : '',
                    ].join(' ')}
                  >
                    <div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-md border border-slate-900 text-sm font-bold text-slate-900 dark:border-white dark:text-white`}>
                      {i + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {item.label}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━ Principles grid ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className={borderB}>
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-24">
          <Reveal>
            <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              What we believe
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <div className={`overflow-hidden rounded-lg border ${border}`}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                {principles.map((p, i) => {
                  const isLastCol3 = (i + 1) % 3 === 0;
                  const isLastCol2 = (i + 1) % 2 === 0;
                  const isLastRow3 = i >= 3;
                  const isLastRow2 = i >= 4;

                  return (
                    <div
                      key={p.title}
                      className={[
                        'p-6 sm:p-8 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60',
                        !isLastCol3 ? 'lg:border-r' : '',
                        !isLastCol2 ? 'sm:max-lg:border-r' : '',
                        !isLastRow3 ? 'lg:border-b' : '',
                        !isLastRow2 ? 'sm:max-lg:border-b' : '',
                        i < principles.length - 1 ? 'max-sm:border-b' : '',
                        border,
                      ].join(' ')}
                    >
                      <p.icon className="mb-4 h-5 w-5 text-slate-900 dark:text-white" />
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {p.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section>
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
          <Reveal>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Ready to try it?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base text-slate-600 dark:text-slate-400">
                Free forever. Set up in 30 seconds.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="rounded-lg text-base">
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PublicLayout>
  );
};
