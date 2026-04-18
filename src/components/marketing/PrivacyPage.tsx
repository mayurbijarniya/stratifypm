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
      { term: 'Account email', detail: 'Used for authentication via one-time passcode. We don\'t collect passwords. Your identity is reduced to an address and a verified hash.' },
      { term: 'Conversations', detail: 'Messages you send and AI responses are stored strictly to maintain your chat history.' },
      { term: 'Uploaded files', detail: 'CSV, Excel, JSON, and text files you upload for analysis are stored alongside your conversations in an encrypted vault.' },
      { term: 'Session data', detail: 'Hashed session tokens and expiry timestamps for authentication. No tracking cookies. No analytics scripts.' },
    ],
  },
  {
    title: 'How we use your data',
    items: [
      { term: 'AI responses', detail: 'Your messages transit to Claude (DeepInfra), Gemini (Google AI), or OpenRouter. We don\'t control how these endpoints process data in transit.' },
      { term: 'Web search', detail: 'Real-time queries are dispatched to Exa AI. Results cache for 600 seconds per conversation to minimize redundant external pings.' },
      { term: 'No training', detail: 'Absolute denial of training. We never use your conversations, files, or telemetry to train proprietary or external AI models.' },
      { term: 'No advertising', detail: 'Zero advertisement infrastructure. We do not sell, share, or broker your data.' },
    ],
  },
  {
    title: 'Data storage & security',
    items: [
      { term: 'Database', detail: 'Cryptographic storage in PostgreSQL (Neon serverless). All arrays stored as encrypted JSONB.' },
      { term: 'Authentication', detail: 'OTP codes and session tokens are SHA-256 hashed pre-storage. Automatic session termination after 30 days.' },
      { term: 'Rate limiting', detail: 'Aggressive throttling: OTP requests hard-capped to 5 per hour with 60s cooldown.' },
      { term: 'Access control', detail: 'Strict scoped access. Conversations are cryptographically bound to your specific user ID.' },
    ],
  },
  {
    title: 'Your rights',
    items: [
      { term: 'Delete conversations', detail: 'Instant, irrevocable deletion of any or all conversations at your command.' },
      { term: 'Delete account', detail: 'Total system purge. Request account deletion to eradicate all associations (conversations, files, active sessions).' },
      { term: 'Data export', detail: 'Extract your architecture. Export conversations and analytical frameworks to raw Markdown or CSV vectors.' },
    ],
  },
];

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PublicLayout>
      <section className="bg-zinc-50 dark:bg-zinc-950 pt-20 pb-0">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="inline-block border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-4 py-1 font-bold uppercase tracking-widest text-xs mb-8">
              [ COMPLIANCE / PRIVACY ]
            </div>
            <h1 className="text-5xl md:text-8xl font-bold font-heading text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter mb-12">
              DATA <br/> MANIFESTO.
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Brutalist Matrix Layout for Privacy */}
      <section className="bg-zinc-50 dark:bg-zinc-950 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border-t-4 border-zinc-900 dark:border-zinc-100 pt-8">
            <Reveal delay={100}>
              <div className="grid md:grid-cols-4 gap-8 mb-16">
                <div className="md:col-span-1 border-r-2 border-zinc-200 dark:border-zinc-800 pr-8">
                   <p className="font-mono text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                     Document ID <br/>
                     <span className="text-zinc-900 dark:text-zinc-100 font-bold">PRV-SYS-01</span>
                   </p>
                   <p className="font-mono text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 mt-6">
                     Last Update <br/>
                     <span className="text-zinc-900 dark:text-zinc-100 font-bold uppercase">March {new Date().getFullYear()}</span>
                   </p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-2xl font-serif text-zinc-900 dark:text-zinc-100 leading-snug">
                    StratifyPM is built on absolute containment. We store only what is mathematically required to maintain session state and history. We reject the advertising economy. This is the exact map of your data flow.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="space-y-0 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100">
              {sections.map((section, si) => (
                <div key={section.title} className="bg-zinc-50 dark:bg-zinc-950 border-b-2 border-zinc-900 dark:border-zinc-100 last:border-b-0">
                  <Reveal delay={si * 50}>
                    <div className="grid md:grid-cols-4 min-h-full">
                      {/* Section Title */}
                      <div className="md:col-span-1 bg-zinc-100 dark:bg-zinc-900 p-8 border-b-2 md:border-b-0 md:border-r-2 border-zinc-900 dark:border-zinc-100">
                         <h2 className="text-xl font-bold font-heading uppercase text-zinc-900 dark:text-zinc-50 tracking-wide">
                           {section.title}
                         </h2>
                         <div className="mt-8 font-mono text-xs text-zinc-400">
                           SECT_0{si + 1}
                         </div>
                      </div>

                      {/* Section Items */}
                      <div className="md:col-span-3 grid grid-cols-1 divide-y-2 divide-zinc-200 dark:divide-zinc-800">
                        {section.items.map((item) => (
                          <div key={item.term} className="p-8 grid md:grid-cols-3 gap-6 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                            <div className="md:col-span-1 font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              &gt; {item.term}
                            </div>
                            <div className="md:col-span-2 text-sm font-sans tracking-wide leading-relaxed text-zinc-600 dark:text-zinc-400">
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

            <Reveal delay={200}>
              <div className="mt-20 border-4 border-zinc-900 dark:border-zinc-100 p-12 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 shadow-[12px_12px_0_0_#ccff00]">
                <h2 className="text-2xl font-bold font-heading uppercase mb-4">
                   Require Purge Operations?
                </h2>
                <p className="font-mono text-sm leading-relaxed max-w-2xl opacity-80 mb-8">
                  For immediate data eradication, privacy audits, or queries regarding this manifesto, transmit a message to the administrator sequence below:
                </p>
                <a
                  href="mailto:bijarniya.m@northeastern.edu"
                  className="inline-block bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-bold uppercase tracking-widest text-sm px-8 py-4 border-2 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-500 dark:hover:bg-zinc-400 hover:text-white transition-all shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#f4f4f5]"
                >
                  Initiate Comms
                </a>
              </div>
            </Reveal>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default PrivacyPage;
