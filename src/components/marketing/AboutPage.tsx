import React from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from './PublicLayout';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import {
  Target,
  Users,
  Shield,
  MessageSquare,
  BarChart3,
  FileText,
} from 'lucide-react';

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay: delay / 1000, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const principles = [
  {
    icon: Target,
    title: 'Product-Focused AI',
    description: 'Generic AI outputs are often too vague. We specialize in generating exact PRDs, RICE scoring matrices, and execution roadmaps.',
  },
  {
    icon: MessageSquare,
    title: 'Multi-Model Intelligence',
    description: 'Leverage the unique strengths of Claude, Gemini, and GPT-4 in a single workspace designed for product strategy.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Insights',
    description: 'Our engine connects to live web data to provide you with the most up-to-date market trends and competitor analysis.',
  },
  {
    icon: FileText,
    title: 'Document Analysis',
    description: 'Upload your CSV or Excel data to instantly generate product insights and structured visualizations without any manual work.',
  },
  {
    icon: Shield,
    title: 'Full Privacy',
    description: 'Your data is never used for model training. We prioritize security and ensure your strategic plans remain private.',
  },
  {
    icon: Users,
    title: 'Open Platform',
    description: 'A professional-grade environment built for product leaders who need power and precision without the corporate complexity.',
  },
];

const timeline = [
  { label: 'GENESIS', description: 'Born from the need for precise, professional-grade AI responses that go beyond generic chat hallucinations.' },
  { label: 'ARCHITECTURE', description: 'Engineered with a dual-model framework optimized for strategic PM frameworks and high-integrity data analysis.' },
  { label: 'DEPLOYMENT', description: 'Built for product leaders who require speed, clarity, and absolute data privacy in their daily operations.' },
];

export const AboutPage: React.FC = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col justify-center border-b-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] opacity-10 dark:opacity-20 pointer-events-none">
           {/* Abstract geometric elements removed per user request to maintain simplicity */}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-24 md:py-32">
          
          <Reveal delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter font-heading text-zinc-900 dark:text-zinc-50 leading-tight mb-6 uppercase">
              ABOUT <br/> THE <span className="italic font-light tracking-wide text-zinc-500 dark:text-zinc-400">PLATFORM.</span>
            </h1>
          </Reveal>
          
          <Reveal delay={200}>
            <p className="text-base md:text-lg font-normal leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-2xl">
              StratifyPM is your senior AI partner for product leadership. We’ve built a specialized workspace that strips away the noise, allowing you to focus on high-level strategy, deep analysis, and precisely crafted roadmaps.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="border-b-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {timeline.map((item, i) => (
              <Reveal key={item.label} delay={i * 150}>
                <div className="border-2 border-zinc-800 dark:border-zinc-200 bg-zinc-900 dark:bg-zinc-100 p-8 md:p-10 h-full transition-transform hover:-translate-y-2 hover:-translate-x-2 hover:border-zinc-50 dark:hover:border-zinc-900 hover:bg-zinc-950 dark:hover:bg-zinc-50 group">
                  <div className="text-zinc-400 dark:text-zinc-500 font-bold text-xs md:text-sm tracking-widest uppercase mb-6 group-hover:text-chartreuse transition-colors">[ PHASE 0{i + 1} ]</div>
                  <h3 className="text-xl md:text-2xl font-semibold font-heading uppercase tracking-tight mb-4">
                    {item.label}
                  </h3>
                  <p className="text-base font-normal text-zinc-400 dark:text-zinc-600 leading-relaxed max-w-sm">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950 border-b-2 border-zinc-900 dark:border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-zinc-900 dark:text-zinc-50 uppercase leading-tight mb-16 text-center">
              Our Core Principles.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <div className="border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-950 p-8 md:p-10 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all h-full">
                  <div className="flex items-center justify-between mb-8 border-b-2 border-zinc-900 dark:border-zinc-100 pb-4">
                    <p.icon className="h-8 w-8 text-zinc-900 dark:text-zinc-100" />
                    <span className="font-medium text-xs tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">P_{i+1}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold font-heading uppercase text-zinc-900 dark:text-zinc-50 mb-4">
                    {p.title}
                  </h3>
                  <p className="text-base font-normal text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
                    {p.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(161,161,170,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold font-heading text-zinc-900 uppercase leading-tight mb-8 bg-chartreuse inline-block px-6 py-2 border-2 border-zinc-900">
              BUILD BETTER.
            </h2>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto inline-block">
                <Button className="w-full sm:w-auto rounded-none border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-colors uppercase tracking-widest font-bold text-sm py-3 px-8 md:py-4 md:px-10 shadow-[6px_6px_0_0_#CCFF00]">
                  Start Building Better Products
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
