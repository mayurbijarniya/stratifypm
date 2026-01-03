import React from 'react';
import { PublicLayout } from './PublicLayout';
import { FileText, Settings, Trash2, Lock } from '../ui/icons';

export const PrivacyPage: React.FC = () => {
  const sections = [
    {
      icon: FileText,
      title: 'What we collect',
      description: 'Account email, conversations, and uploaded files you choose to analyze.',
    },
    {
      icon: Settings,
      title: 'How we use data',
      description: 'To provide AI responses, keep your history, and improve reliability.',
    },
    {
      icon: Trash2,
      title: 'Data retention',
      description: 'You can delete conversations at any time. Deletions remove stored data from our database.',
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'We apply access controls and tokenized sessions to protect your workspace.',
    },
  ];

  return (
    <PublicLayout>
      <section className="mx-auto w-full max-w-4xl px-6 py-20">
        <div className="space-y-6 mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Privacy Policy
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Your data stays under your control.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            StratifyPM stores only what is required to deliver your workspace. We do not sell personal data or share it
            with third parties for advertising.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
};
