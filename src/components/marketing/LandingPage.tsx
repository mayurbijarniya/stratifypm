import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Target, 
  Users, 
  Shield, 
  MessageSquare,
  ArrowRight,
  FileSearch,
  CheckCircle2
} from 'lucide-react';
import { PublicLayout } from './PublicLayout';
import { Button } from '../ui/Button';

// Brutalist Reveal
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const LandingPage: React.FC = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden border-b-2 border-zinc-900 dark:border-zinc-100">
        {/* Background Layer: Grid & Matrix */}
        <div className="absolute inset-0 pointer-events-none -z-10 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
          {/* Brutalist Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" 
               style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '128px 128px' }} />
          
          {/* Animated Scanning Line */}
          <div className="absolute inset-0 w-full h-[2px] bg-zinc-900/5 dark:bg-zinc-100/5 animate-slide-down pointer-events-none" style={{ animationDuration: '8s', animationIterationCount: 'indefinite' }} />

          {/* Tech/Brutalist SVG Graphic - Centered & Immersive */}
          <svg
            viewBox="0 0 1000 800"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] text-zinc-200 dark:text-zinc-800/40 opacity-80"
          >
            <style>
              {`
                .svgo-grid-line { stroke: currentColor; stroke-width: 1; fill: none; opacity: 0.3; }
                .svgo-anim-line { stroke: currentColor; stroke-width: 3; fill: none; }
                .svgo-point { fill: currentColor; }
                .svgo-text { font-family: 'JetBrains Mono', monospace; font-size: 10px; fill: currentColor; opacity: 0.5; font-weight: bold; }
              `}
            </style>
            
            <g transform="translate(500, 400)">
              {/* Massive Isometric Coordinate Space */}
              {[...Array(5)].map((_, i) => (
                <g key={i} opacity={1 - (i * 0.15)}>
                  <path d={`M ${-400 + (i*80)} ${240 - (i*48)} L ${400 - (i*80)} ${-240 + (i*48)}`} className="svgo-grid-line" />
                  <path d={`M ${-400 + (i*80)} ${-240 + (i*48)} L ${400 - (i*80)} ${240 - (i*48)}`} className="svgo-grid-line" />
                </g>
              ))}

              {/* Vertical Pillars */}
              <line x1="-300" y1="-180" x2="-300" y2="180" className="svgo-grid-line" />
              <line x1="300" y1="-180" x2="300" y2="180" className="svgo-grid-line" />
              <line x1="0" y1="-400" x2="0" y2="400" className="svgo-grid-line" />
              
              {/* Dynamic Path Injections */}
              <path d="M -300 -180 L 0 0 L 300 -180" className="svgo-anim-line" strokeDasharray="60 400" strokeDashoffset="400">
                <animate attributeName="stroke-dashoffset" values="400; -60" dur="4s" repeatCount="indefinite" />
              </path>
              <path d="M -300 180 L 0 0 L 300 180" className="svgo-anim-line" strokeDasharray="60 400" strokeDashoffset="400">
                <animate attributeName="stroke-dashoffset" values="400; -60" dur="3s" repeatCount="indefinite" />
              </path>

              {/* Central Hub Matrix */}
              <rect x="-60" y="-30" width="120" height="60" className="svgo-grid-line" strokeWidth="2" />
              <text x="-55" y="-35" className="svgo-text">STRATEGY_CORE // ACTIVE</text>
              <text x="-55" y="45" className="svgo-text">VERSION_2.0.4</text>
              
              {/* Annotated Nodes */}
              <g transform="translate(200, 120)">
                <circle r="4" className="svgo-point" />
                <text x="10" y="5" className="svgo-text">0x_DATA_01</text>
              </g>
              <g transform="translate(-250, -150)">
                <circle r="4" className="svgo-point" />
                <text x="-80" y="5" className="svgo-text">VAL_PROP_NODE</text>
              </g>
              
              {/* Floating Data Points */}
              <circle cx="0" cy="0" r="12" className="svgo-point" opacity="0.1">
                <animate attributeName="r" values="12; 20; 12" dur="3s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-24 md:py-32 flex flex-col items-center text-center">
          <Reveal>
            <div className="inline-block border-2 border-zinc-900 dark:border-zinc-100 bg-chartreuse text-zinc-900 px-4 py-1 font-bold uppercase tracking-widest text-xs md:text-sm mb-8 shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#f4f4f5]">
              [ STRATEGY TO EXECUTION ]
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter font-heading text-zinc-900 dark:text-zinc-50 leading-tight mb-6 uppercase">
              Stop Guessing. <br />
              <span className="italic font-light tracking-wide text-zinc-500">Start Shipping.</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-base md:text-lg font-normal text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed mb-12">
              The AI co-pilot for Product Managers. <br className="hidden md:block" />
              Turn scattered data into clear roadmaps in seconds.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-none border-2 border-zinc-900 dark:border-zinc-100 !bg-chartreuse !text-zinc-900 hover:!bg-zinc-900 dark:hover:!bg-zinc-100 hover:!text-zinc-50 dark:hover:!text-zinc-900 transition-colors uppercase tracking-widest font-black text-sm py-3 px-8 md:py-4 md:px-10 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#f4f4f5] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                  Try StratifyPM Free
                </Button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto rounded-none border-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-900 hover:text-zinc-50 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-colors uppercase tracking-widest font-bold text-sm py-3 px-8 md:py-4 md:px-10">
                  About
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trust Bar (Social Proof) */}
      <section className="bg-zinc-50 dark:bg-zinc-950 border-b-2 border-zinc-900 dark:border-zinc-100 py-6">
         <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-tighter text-zinc-900 dark:text-zinc-100">
             <Shield className="w-4 h-4" /> Bank-Level Security
           </div>
           <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-tighter text-zinc-900 dark:text-zinc-100">
             <Shield className="w-4 h-4" /> No Model Training
           </div>
           <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-tighter text-zinc-900 dark:text-zinc-100">
             <Shield className="w-4 h-4" /> Encrypted Data
           </div>
         </div>
      </section>

      {/* Problem Section (Agitation) */}
      <section className="py-24 md:py-32 bg-zinc-900 text-zinc-50 border-b-2 border-zinc-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6 leading-tight uppercase tracking-tighter">
              Product Management <br/> Is Chaos.
            </h2>
            <div className="max-w-2xl mx-auto space-y-6 text-base md:text-lg text-zinc-300 leading-relaxed font-normal">
              <p>Too much data. Too many opinions. Not enough time.</p>
              <p>You're drowning in spreadsheets when you should be strategizing.</p>
              <p className="text-white font-bold inline-block border-b-2 border-chartreuse pb-1 mt-4">It’s time to change how you work.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ticker / Banner Section */}
      <section className="border-b-2 border-zinc-900 dark:border-zinc-100 bg-neonorange overflow-hidden py-4">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="text-white font-bold uppercase tracking-widest text-lg font-heading mx-8 flex items-center">
              Research <ArrowRight className="mx-4 w-6 h-6" /> Prioritize <ArrowRight className="mx-4 w-6 h-6" /> Build <ArrowRight className="mx-4 w-6 h-6" /> Launch
            </span>
          ))}
        </div>
      </section>

      {/* Features Grid - Brutalist Matrix */}
      <section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950 border-b-2 border-zinc-900 dark:border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-zinc-900 dark:text-white mb-16 leading-tight uppercase">
              Clarity <br/> On Command.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {features.map((feature, idx) => (
              <div key={idx} className="border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-950 p-8 md:p-10 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 group h-full">
                <div className="w-16 h-16 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center mb-8 group-hover:bg-chartreuse group-hover:text-zinc-900 transition-colors">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold font-heading text-zinc-900 dark:text-white mb-4 uppercase">
                  {feature.title}
                </h3>
                <p className="text-base font-normal text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison/Value Prop */}
      <section className="py-24 md:py-32 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 blur-sm pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center flex flex-col items-center">
            <Reveal>
               <div className="inline-block border-2 border-current px-4 py-1 font-medium uppercase tracking-widest text-xs md:text-sm mb-8">
                [ VALUE PROPOSITION ]
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-12 leading-tight uppercase">
                Build better products, <br/><span className="italic text-zinc-400">faster.</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-8 md:gap-10 text-left max-w-6xl mx-auto">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex flex-col items-start border-2 border-current p-8 bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:-translate-y-2 transition-transform">
                    <div className="mb-6 border-2 border-current p-3 bg-chartreuse text-zinc-950">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold uppercase text-xl md:text-2xl mb-4">{benefit.title}</h4>
                    <p className="text-base text-zinc-300 dark:text-zinc-600 font-normal leading-relaxed">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 border-t-2 border-zinc-900 dark:border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold font-heading text-zinc-900 dark:text-zinc-50 uppercase leading-tight mb-10">
              Ready to elevate <br/> Your Strategy?
            </h2>
            <Link to="/signup" className="w-full sm:w-auto inline-block">
            <Button className="w-full sm:w-auto rounded-none border-2 border-zinc-900 dark:border-zinc-100 !bg-chartreuse !text-zinc-900 hover:!bg-zinc-900 dark:hover:!bg-zinc-100 hover:!text-zinc-50 dark:hover:!text-zinc-900 transition-all uppercase tracking-widest font-black text-sm py-4 px-10 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#f4f4f5] active:scale-95">
              Get Started
            </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </PublicLayout>
  );
};

const features = [
  {
    icon: MessageSquare,
    title: 'Multi-Model Intelligence',
    description: 'Leverage the unique strengths of Claude, Gemini, and GPT in one unified workspace designed for deep product analysis.',
  },
  {
    icon: BarChart3,
    title: 'Instant Data Insights',
    description: 'Upload your CSV or Excel files to automatically generate PRDs and clear data visualizations from your own product data.',
  },
  {
    icon: Target,
    title: 'Smart Frameworks',
    description: 'Base every interaction around proven product goals, RICE scoring, and clear execution matrices to ensure organizational alignment.',
  },
  {
    icon: FileSearch,
    title: 'User Research',
    description: 'Identify market trends, competitor strategies, and industry benchmarks with real-time web search and empathy-driven mapping.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'We do not train models on your data. Your product strategy and sensitive documents remain your own and encrypted at rest.',
  },
  {
    icon: Users,
    title: 'Senior PM Co-Pilot',
    description: 'A powerful, efficient platform built for product leaders who need speed and intelligent companionship in every high-stakes decision.',
  },
];

const benefits = [
  {
    title: 'Instant Blueprints',
    description: 'Transform vague ideas into high-quality execution plans, specs, and roadmaps instantly.',
  },
  {
    title: 'Live Data Streams',
    description: 'Stop relying on old data. Connect your strategy to actual market moves with live search capability.',
  },
  {
    title: 'Unified Workspace',
    description: 'Bring strategy, research, and analysis into a single interface built for execution.',
  },
];

export default LandingPage;
