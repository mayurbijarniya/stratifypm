import React from 'react';
import { PublicLayout } from './PublicLayout';
import { Target, Users, Zap, Shield } from '../ui/icons';

export const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Designed for PM workflows',
      description: 'Every response is structured around real PM artifacts, from roadmaps to KPI dashboards.',
    },
    {
      icon: Users,
      title: 'Built for collaboration',
      description: 'Your conversations and uploaded data stay tied to your account for easy follow-up.',
    },
    {
      icon: Zap,
      title: 'Fast to adopt',
      description: 'Start with guided prompts or bring your own data and context for deeper analysis.',
    },
    {
      icon: Shield,
      title: 'Privacy aware',
      description: 'We only store what is needed to serve your workspace and keep it secure.',
    },
  ];

  return (
    <PublicLayout>
      <section className="mx-auto w-full max-w-4xl px-6 py-20">
        <div className="space-y-6 mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            About StratifyPM
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            A focused workspace for product decision makers.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            StratifyPM is designed for product leaders who need structured thinking, fast synthesis, and dependable
            insights. We combine proven frameworks with AI models so your team can keep momentum without losing rigor.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
};
