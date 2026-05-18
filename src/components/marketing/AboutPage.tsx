import React from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from './PublicLayout';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import {
  Target,
  Shield,
  MessageSquare,
  BarChart3,
  Globe,
  Brain,
  ArrowRight,
} from 'lucide-react';

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.65, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const stats = [
  { value: '12', label: 'Built-in PM Frameworks', sub: 'RICE, JTBD, roadmaps & more' },
  { value: '3', label: 'AI Models Available', sub: 'Claude · Gemini · GPT' },
  { value: '2K', label: 'Rows per File Analysis', sub: 'CSV, Excel, JSON' },
  { value: '0', label: 'Passwords Required', sub: 'Passwordless OTP auth' },
];

const principles = [
  {
    icon: Brain,
    title: 'Built for Product Managers',
    description: 'Not a general-purpose chatbot. Every prompt, framework, and output is purpose-built for the specific decisions PMs make every day.',
  },
  {
    icon: MessageSquare,
    title: 'Multi-Model Intelligence',
    description: 'Choose Claude, Gemini, or GPT for each conversation. Different models excel at different tasks — strategy, analysis, and ideation each have a champion.',
  },
  {
    icon: Globe,
    title: 'Live Market Intelligence',
    description: 'Real-time web search via Exa AI means your competitive analysis and market research are grounded in what\'s happening today, not last quarter.',
  },
  {
    icon: BarChart3,
    title: 'Your Data, Analyzed Instantly',
    description: 'Upload your CSV, Excel, or JSON files and get structured insights, personas, and KPI analysis directly from your actual product data — no preprocessing.',
  },
  {
    icon: Shield,
    title: 'Privacy You Can Trust',
    description: 'Your data is never used to train AI models. Conversations are encrypted at rest, sessions are token-hashed, and you own everything you create.',
  },
  {
    icon: Target,
    title: 'Execution-Ready Outputs',
    description: 'Not vague ideas — prioritized backlogs, full PRDs, sprint plans, and personas you can drop directly into your workflow and act on immediately.',
  },
];

const story = [
  {
    phase: '01',
    label: 'THE PROBLEM',
    description: 'Generic AI tools generate generic answers. Product Managers were spending hours reformatting outputs, re-prompting for context, and manually applying frameworks. The tool gap was real.',
  },
  {
    phase: '02',
    label: 'THE BUILD',
    description: 'We built a purpose-engineered workspace — one that speaks PM natively. Every feature maps to a real workflow: from backlog scoring to competitive research to user persona creation.',
  },
  {
    phase: '03',
    label: 'THE RESULT',
    description: 'A platform that makes every PM think, decide, and ship like a senior. Multi-model AI, live data, file analysis, and 12 frameworks — in a single, focused workspace.',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <PublicLayout>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[75vh] flex flex-col justify-center border-b-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none -z-10 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-20 md:py-28">
          <Reveal>
            <div className="inline-flex items-center gap-2 border-2 border-zinc-900 dark:border-zinc-100 bg-chartreuse text-zinc-900 px-3 py-1 font-mono font-bold uppercase tracking-widest text-xs mb-8 shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#f4f4f5]">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse" />
              ABOUT STRATIFYPM
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter font-heading text-zinc-900 dark:text-zinc-50 leading-[0.92] mb-6 uppercase">
              The AI assistant<br />
              <span className="relative inline-block">
                <span className="relative z-10">built for PMs.</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-chartreuse -z-0 opacity-70" />
              </span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-base md:text-xl font-normal leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-2xl">
              StratifyPM is a purpose-built AI workspace for Product Managers who are done with generic answers. We combine multi-model AI, real-time market intelligence, and 12 PM frameworks into a single tool that makes you faster, sharper, and more decisive.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="border-b-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-zinc-700 dark:divide-zinc-300">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="px-8 py-10 text-center">
                  <div className="text-4xl md:text-5xl font-black font-heading text-chartreuse dark:text-zinc-900 mb-1 leading-none">
                    {stat.value}
                  </div>
                  <div className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-100 dark:text-zinc-900 mb-1">
                    {stat.label}
                  </div>
                  <div className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">
                    {stat.sub}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950 border-b-2 border-zinc-900 dark:border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-16">
              <div className="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">[ HOW WE GOT HERE ]</div>
              <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">
                The story.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 border-2 border-zinc-900 dark:border-zinc-100">
            {story.map((item, idx) => (
              <Reveal key={idx} delay={idx * 120}>
                <div
                  className={`p-10 md:p-12 h-full ${idx < story.length - 1 ? 'border-b-2 md:border-b-0 md:border-r-2 border-zinc-900 dark:border-zinc-100' : ''}`}
                >
                  <div className="font-mono text-5xl font-black text-zinc-300 dark:text-zinc-600 mb-4 leading-none select-none">
                    {item.phase}
                  </div>
                  <div className="inline-block font-mono text-[10px] font-bold uppercase tracking-widest bg-chartreuse text-zinc-900 dark:bg-zinc-900 dark:text-chartreuse px-2 py-0.5 mb-5">
                    {item.label}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRINCIPLES ───────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-zinc-900 dark:bg-zinc-100 border-b-2 border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-16">
              <div className="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-3">
                [ WHAT WE STAND FOR ]
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-zinc-50 dark:text-zinc-900 uppercase tracking-tighter leading-none">
                Our principles.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-700 dark:bg-zinc-300 border border-zinc-700 dark:border-zinc-300">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="bg-zinc-900 dark:bg-zinc-100 p-8 md:p-10 group hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors h-full">
                  <div className="w-10 h-10 border-2 border-zinc-700 dark:border-zinc-300 flex items-center justify-center mb-6 group-hover:border-chartreuse group-hover:bg-chartreuse group-hover:text-zinc-900 dark:group-hover:border-zinc-900 dark:group-hover:bg-zinc-900 dark:group-hover:text-chartreuse transition-all text-zinc-500">
                    <p.icon className="w-4 h-4" />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-2">
                    P_{String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-tight text-zinc-100 dark:text-zinc-900 mb-3">
                    {p.title}
                  </h3>
                  <p className="text-sm text-zinc-400 dark:text-zinc-600 leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-28 md:py-40 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">
              [ START TODAY — NO CREDIT CARD ]
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold font-heading text-zinc-900 dark:text-zinc-50 uppercase leading-[0.9] tracking-tighter mb-6">
              Think bigger.<br />
              <span className="relative inline-block">
                <span className="relative z-10">Ship faster.</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-chartreuse -z-0 opacity-70" />
              </span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg mb-10 font-sans max-w-md mx-auto leading-relaxed">
              Join Product Managers who use StratifyPM to make smarter decisions, faster — every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto inline-block">
                <Button className="w-full sm:w-auto rounded-none border-2 border-zinc-900 dark:border-zinc-100 !bg-chartreuse !text-zinc-900 hover:!bg-zinc-900 dark:hover:!bg-zinc-100 hover:!text-zinc-50 dark:hover:!text-zinc-900 transition-all uppercase tracking-widest font-black text-sm py-4 px-10 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#f4f4f5] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                  Get Started Free <ArrowRight className="inline w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/" className="w-full sm:w-auto inline-block">
                <Button variant="outline" className="w-full sm:w-auto rounded-none border-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-900 hover:text-zinc-50 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all uppercase tracking-widest font-bold text-sm py-4 px-10">
                  See the Product
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </PublicLayout>
  );
};

export default AboutPage;
