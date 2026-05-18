import React, { useEffect } from 'react';
import { PublicLayout } from './PublicLayout';
import { motion } from 'framer-motion';

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: delay / 1000 }}
  >
    {children}
  </motion.div>
);

const sections = [
  {
    title: 'Information we collect',
    items: [
      { term: 'Account email', detail: 'Used only for authentication via one-time passcode. We never store passwords. Your identity is a verified email address and a hashed session token — nothing more.' },
      { term: 'Conversations', detail: 'Messages you send and AI responses are stored strictly to maintain your chat history across sessions. Nothing else.' },
      { term: 'Uploaded files', detail: 'CSV, Excel, JSON, and text files you upload for analysis are stored alongside your conversations in an encrypted database. They are never shared or used for training.' },
      { term: 'Session data', detail: 'Hashed session tokens and expiry timestamps are stored for authentication. No tracking cookies. No analytics scripts. No behavioral profiling.' },
    ],
  },
  {
    title: 'How we use your data',
    items: [
      { term: 'AI responses', detail: 'Your messages transit to Claude (DeepInfra), Gemini (Google AI), or OpenRouter depending on your model selection. We do not control how these providers process data in transit.' },
      { term: 'Web search', detail: 'Real-time queries are sent to Exa AI when market intelligence is needed. Results are cached for 10 minutes per conversation to minimize redundant external calls.' },
      { term: 'No training', detail: 'We never use your conversations, uploaded files, or any usage data to train AI models — proprietary or third-party. Your strategy stays yours.' },
      { term: 'No advertising', detail: 'Zero advertising infrastructure. We do not sell, share, or broker your data with any third party for commercial purposes.' },
    ],
  },
  {
    title: 'Data storage & security',
    items: [
      { term: 'Database', detail: 'All data is stored in PostgreSQL (Neon serverless). Conversations and files are stored as encrypted JSONB. Database access is strictly scoped.' },
      { term: 'Authentication', detail: 'OTP codes and session tokens are SHA-256 hashed before storage. Sessions automatically expire after 30 days. Tokens are never stored in plaintext.' },
      { term: 'Rate limiting', detail: 'OTP requests are capped at 5 attempts per window with a 60-second cooldown to prevent abuse.' },
      { term: 'Access control', detail: 'Every conversation is cryptographically bound to your user ID. No cross-user data access is possible by design.' },
    ],
  },
  {
    title: 'Your rights',
    items: [
      { term: 'Delete conversations', detail: 'You can delete any or all conversations instantly and permanently from your account at any time.' },
      { term: 'Delete account', detail: 'Requesting account deletion permanently removes all associated data — conversations, uploaded files, and active sessions.' },
      { term: 'Data export', detail: 'You can export your conversations and analytical frameworks to Markdown or CSV at any time.' },
    ],
  },
];

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PublicLayout>
      {/* Header */}
      <section className="bg-zinc-50 dark:bg-zinc-950 pt-20 pb-0 border-b-2 border-zinc-900 dark:border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <Reveal>
            <div className="inline-block border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-4 py-1 font-mono font-bold uppercase tracking-widest text-xs mb-8">
              [ COMPLIANCE / PRIVACY ]
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold font-heading text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter leading-[0.92] mb-6">
              Privacy<br />Policy.
            </h1>
            <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed font-sans">
              StratifyPM is built on the principle that your data belongs to you. We store only what is required to keep the product working. No tracking, no advertising, no model training. Here is the exact map of your data.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="bg-zinc-50 dark:bg-zinc-950 py-16 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal delay={100}>
            <div className="grid md:grid-cols-4 gap-8 mb-12 pb-12 border-b-2 border-zinc-200 dark:border-zinc-800">
              <div className="md:col-span-1">
                <p className="font-mono text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
                  Document ID<br />
                  <span className="text-zinc-900 dark:text-zinc-100 font-bold">PRV-SYS-01</span>
                </p>
                <p className="font-mono text-sm leading-relaxed text-zinc-500 dark:text-zinc-500 mt-6">
                  Last Updated<br />
                  <span className="text-zinc-900 dark:text-zinc-100 font-bold uppercase">May {new Date().getFullYear()}</span>
                </p>
              </div>
              <div className="md:col-span-3">
                <p className="text-xl md:text-2xl font-sans text-zinc-900 dark:text-zinc-100 leading-snug">
                  We reject the advertising economy and the surveillance model. This document gives you full visibility into what we collect, why we collect it, and how we protect it.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="border-2 border-zinc-900 dark:border-zinc-100">
            {sections.map((section, si) => (
              <div key={section.title} className="border-b-2 border-zinc-900 dark:border-zinc-100 last:border-b-0">
                <Reveal delay={si * 50}>
                  <div className="grid md:grid-cols-4 min-h-full">
                    {/* Section label */}
                    <div className="md:col-span-1 bg-zinc-100 dark:bg-zinc-900 p-8 border-b-2 md:border-b-0 md:border-r-2 border-zinc-900 dark:border-zinc-100">
                      <h2 className="text-base font-bold font-heading uppercase text-zinc-900 dark:text-zinc-50 tracking-wide leading-tight">
                        {section.title}
                      </h2>
                      <div className="mt-6 font-mono text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        SECT_{String(si + 1).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="md:col-span-3 divide-y-2 divide-zinc-200 dark:divide-zinc-800">
                      {section.items.map((item) => (
                        <div key={item.term} className="p-8 grid md:grid-cols-3 gap-6 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                          <div className="md:col-span-1 font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            → {item.term}
                          </div>
                          <div className="md:col-span-2 text-sm font-sans leading-relaxed text-zinc-600 dark:text-zinc-400">
                            {item.detail}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>

          {/* Contact block */}
          <Reveal delay={200}>
            <div className="mt-16 border-2 border-zinc-900 dark:border-zinc-100 p-10 md:p-12 bg-zinc-900 dark:bg-zinc-100 shadow-[8px_8px_0_0_#CCFF00] dark:shadow-[8px_8px_0_0_#18181b]">
              <h2 className="text-xl md:text-2xl font-bold font-heading uppercase text-zinc-50 dark:text-zinc-900 mb-3">
                Questions or deletion requests?
              </h2>
              <p className="font-sans text-sm text-zinc-400 dark:text-zinc-600 leading-relaxed max-w-2xl mb-8">
                For privacy questions, data export requests, or account deletion, reach out directly. We respond within 48 hours.
              </p>
              <a
                href="mailto:bijarniya.m@northeastern.edu"
                className="inline-block bg-chartreuse text-zinc-900 font-bold uppercase tracking-widest text-sm px-8 py-3.5 border-2 border-zinc-50 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-chartreuse transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]"
              >
                Contact Us →
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </PublicLayout>
  );
};

export default PrivacyPage;
