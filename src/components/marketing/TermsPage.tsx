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
    title: 'Acceptance of terms',
    items: [
      { term: 'Agreement', detail: 'By allocating processing time to StratifyPM, you enter a binding agreement. Use of the service implies absolute acceptance. If you reject these parameters, sever connection immediately.' },
      { term: 'Eligibility', detail: 'System access restricted to entities older than 13 lunar cycles (years). Initiation of the platform guarantees this compliance.' },
      { term: 'Protocol Updates', detail: 'Terms update asynchronously. Continued operation post-update signifies adherence to the revised schema.' },
    ],
  },
  {
    title: 'Operating parameters',
    items: [
      { term: 'Account Security', detail: 'You possess the sole encryption keys (OTP access). Unauthorized access must be reported instantly.' },
      { term: 'Authorized Usage', detail: 'System architecture designed for macro product management, strategic telemetry, and data manipulation. Acceptable for personal or enterprise deployment.' },
      { term: 'Prohibited Actions', detail: 'Strict prohibition on generating malicious vectors, reverse-engineering our multi-agent framework, or DDoSing API rate limits.' },
      { term: 'Data Ingestion', detail: 'You bear absolute liability for uploaded vectors. Do not inject sensitive PII (SSN, medical) unless crucial to your secure tactical analysis.' },
    ],
  },
  {
    title: 'AI Synthesis Liability',
    items: [
      { term: 'Generative Uncertainty', detail: 'Outputs process through Claude, Gemini, or OpenRouter arrays. Inaccuracies exist. StratifyPM denies any mathematical guarantee of correctness.' },
      { term: 'Operator Responsibility', detail: 'You must validate synthetic intelligence outputs before deploying them into real-world business environments.' },
      { term: 'Telemetry Accuracy', detail: 'Live search vectors via Exa AI mirror public reality. We do not sanitize or verify third-party data truthfulness.' },
    ],
  },
  {
    title: 'Intellectual Property',
    items: [
      { term: 'User Vectors', detail: 'You maintain total sovereignty over injected data. We claim zero ownership of your prompts, uploaded arrays, or synthetic outputs.' },
      { term: 'Platform Architecture', detail: 'StratifyPM’s codebase, UI vectors, and operational nodes are our property. No unauthorized forks or cloning.' },
      { term: 'System Feedback', detail: 'Tactical suggestions provided to us may be hardcoded into the platform with zero compensation owed.' },
    ],
  },
  {
    title: 'Asset Liability',
    items: [
      { term: 'As-Is Deployment', detail: 'System provided without warranties. Operations execute "AS IS". We deny fitness for any particular hyper-specific scenario.' },
      { term: 'Zero Indemnity', detail: 'StratifyPM bears no financial or operational liability for catastrophic failures caused by executing AI-generated strategies.' },
      { term: 'Uptime Dynamics', detail: '100% uptime is a myth. Unscheduled maintenance or node failures will temporarily halt service.' },
    ],
  },
  {
    title: 'Termination Protocol',
    items: [
      { term: 'Self-Termination', detail: 'You may sever your connection and request full data annihilation at any timestamp.' },
      { term: 'Admin-Termination', detail: 'We retain absolute right to crush accounts that violate these terms or abuse system bandwidth.' },
      { term: 'Post-Termination', detail: 'All operational rights terminate immediately upon account deletion. Data purged per the Privacy Policy.' },
    ],
  },
];

export const TermsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PublicLayout>
      <section className="bg-zinc-50 dark:bg-zinc-950 pt-20 pb-0">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="inline-block border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-4 py-1 font-bold uppercase tracking-widest text-xs mb-8">
              [ COMPLIANCE / TERMS ]
            </div>
            <h1 className="text-5xl md:text-8xl font-bold font-heading text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter mb-12">
              TERMS OF <br/> OPERATION.
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Brutalist Matrix Layout for Terms */}
      <section className="bg-zinc-50 dark:bg-zinc-950 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border-t-4 border-zinc-900 dark:border-zinc-100 pt-8">
            <Reveal delay={100}>
              <div className="grid md:grid-cols-4 gap-8 mb-16">
                <div className="md:col-span-1 border-r-2 border-zinc-200 dark:border-zinc-800 pr-8">
                   <p className="font-mono text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                     Document ID <br/>
                     <span className="text-zinc-900 dark:text-zinc-100 font-bold">TRM-SYS-01</span>
                   </p>
                   <p className="font-mono text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 mt-6">
                     Last Update <br/>
                     <span className="text-zinc-900 dark:text-zinc-100 font-bold uppercase">March {new Date().getFullYear()}</span>
                   </p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-2xl font-serif text-zinc-900 dark:text-zinc-100 leading-snug">
                    These define the operational rules of engagement with the StratifyPM node. We reject complex legal obfuscation. Command line precision applied to service agreements. Understand these vectors before initiation.
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
              <div className="mt-20 border-4 border-zinc-900 dark:border-zinc-100 p-12 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 shadow-[12px_12px_0_0_#ff2a00]">
                <h2 className="text-2xl font-bold font-heading uppercase mb-4">
                  Require Clarification?
                </h2>
                <p className="font-mono text-sm leading-relaxed max-w-2xl opacity-80 mb-8">
                  If these operational parameters are unclear, or you detect a conflict, halt usage and ping our administrative array:
                </p>
                <a
                  href="mailto:bijarniya.m@northeastern.edu"
                  className="inline-block bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-bold uppercase tracking-widest text-sm px-8 py-4 border-2 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-500 dark:hover:bg-zinc-400 hover:text-white transition-all shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#f4f4f5]"
                >
                  Transmit Query
                </a>
              </div>
            </Reveal>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default TermsPage;
