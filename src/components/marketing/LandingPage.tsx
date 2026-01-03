import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { PublicLayout } from './PublicLayout';
import {
  ArrowRight,
  Shield,
  BarChart3,
  MessageSquare,
  FileText,
  Users,
  Lightbulb,
  CheckCircle,
  ChevronRight,
} from '../ui/icons';

const FadeInSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: MessageSquare,
      title: 'AI-Powered Chat',
      description: 'Intelligent conversations with Claude and Gemini for strategic decisions.',
    },
    {
      icon: BarChart3,
      title: 'Market Intelligence',
      description: 'Real-time web search and competitive analysis capabilities.',
    },
    {
      icon: FileText,
      title: 'File Analysis',
      description: 'Upload CSV, Excel, and text files for instant insights.',
    },
    {
      icon: Lightbulb,
      title: 'Strategic Frameworks',
      description: 'RICE prioritization, SWOT analysis, and more built-in.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared with third parties.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share insights and align stakeholders effortlessly.',
    },
  ];

  const faqs = [
    {
      question: 'What AI models are supported?',
      answer: 'We integrate with Claude (Anthropic) and Gemini (Google) for intelligent conversations.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. All data is encrypted at rest and in transit. We never train models on your data.',
    },
    {
      question: 'Can I export my work?',
      answer: 'Export conversations, analyses, and reports to Markdown, PDF, or CSV formats.',
    },
    {
      question: 'Is this really free?',
      answer: 'Yes! StratifyPM is completely free to use. All features including AI-powered conversations, file analysis, strategic frameworks, and web search are available at no cost. No credit card required.',
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section - Split Layout */}
      <section className="mx-auto w-full max-w-7xl px-6 min-h-[calc(100vh-200px)] flex items-center py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Left Content */}
          <FadeInSection>
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Make smarter product decisions <span className="text-primary relative inline-block">
                    faster
                    <svg className="absolute bottom-0 left-0 w-full h-2" viewBox="0 0 100 8" preserveAspectRatio="none">
                      <path d="M 2,6 Q 25,4 50,6 T 98,6" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    </svg>
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  Stratify combines AI intelligence with proven product management frameworks. Research, analyze, and strategize all in one workspace.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="text-base">
                    Start free trial
                  </Button>
                </Link>
                <Link to="/signin">
                  <button className="px-6 py-3 text-base rounded-lg font-medium transition-all duration-200 flex items-center gap-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white">
                    <span>Sign in</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Free forever</span>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* Right Visual - Demo Preview */}
          <FadeInSection delay={200}>
            <div className="relative">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 ml-2">app.stratifypm.com</div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-950">
                  <div className="flex gap-4">
                    <div className="w-64 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 space-y-3 hidden lg:block">
                      <div className="h-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800" />
                      <div className="h-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800" />
                      <div className="h-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800" />
                        <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-2xl rounded-tl-none p-4 border border-slate-200 dark:border-slate-800">
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="flex gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-primary" />
                        <div className="flex-1 bg-primary rounded-2xl rounded-tr-none p-4 text-primary-foreground">
                          <div className="h-3 bg-primary-foreground/20 rounded w-full mb-2" />
                          <div className="h-3 bg-primary-foreground/20 rounded w-5/6" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <FadeInSection delay={300}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
              Everything you need to ship faster
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Powerful features designed for modern product teams.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* How It Works */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <FadeInSection delay={400}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
              How it works
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: '01', title: 'Ask your question', desc: 'Type naturally about your product decisions.' },
              { step: '02', title: 'Get AI insights', desc: 'Receive analysis with strategic frameworks.' },
              { step: '03', title: 'Take action', desc: 'Export decisions and track outcomes.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* Pricing */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <FadeInSection delay={500}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
              Simple, transparent pricing
            </h2>
          </div>
          <div className="max-w-md mx-auto">
            <div className="rounded-2xl border border-slate-900 dark:border-slate-700 bg-slate-900 dark:bg-slate-800 p-8 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Free</h3>
              <div className="text-4xl font-semibold text-white mb-6">$0</div>
              <ul className="space-y-3 mb-6">
                {['Unlimited conversations', 'Claude & Gemini models', 'File uploads', 'Export to Markdown', 'Strategic frameworks', 'Web search'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300 dark:text-slate-400">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="block text-center py-3 rounded-lg text-sm font-medium transition bg-white text-slate-900 hover:bg-slate-100"
              >
                Get started
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-20">
        <FadeInSection delay={600}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 open:shadow-sm hover:border-primary/30 transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 list-none">
                  <span className="font-medium text-slate-900 dark:text-white text-base">{faq.question}</span>
                  <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500 transition group-open:rotate-90 flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-20">
        <FadeInSection delay={700}>
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-800 p-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">
              Ready to work smarter?
            </h2>
            <p className="text-base text-slate-300 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              Start making better product decisions with AI-powered insights and proven frameworks.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/signup">
                <button className="px-8 py-4 text-base rounded-lg font-medium transition-all duration-200 bg-white text-slate-900 hover:bg-slate-100 shadow-md hover:shadow-lg">
                  Start free trial
                </button>
              </Link>
              <Link to="/signin" className="px-6 py-4 text-base rounded-lg font-medium transition-all duration-200 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                Sign in
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>
    </PublicLayout>
  );
};
