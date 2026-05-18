import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Github, Linkedin, Mail } from '../ui/icons';
import { useTheme } from '../../hooks/useTheme';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/sp_dark.svg' : '/sp_light.svg';

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-zinc-900 selection:text-zinc-50 dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
      <div className="relative z-10">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 w-full border-b-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-950">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link
              to="/"
              className="flex items-center gap-3 font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50 hover:opacity-70 transition-opacity"
            >
              <img src={logoSrc} alt="StratifyPM" className="h-6 w-auto" />
              <span className="text-sm">StratifyPM</span>
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              {[
                { to: '/about', label: 'About' },
                { to: '/privacy', label: 'Privacy' },
                { to: '/terms', label: 'Terms' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link
                to="/signin"
                className="hidden font-mono text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors md:block"
              >
                Sign in
              </Link>
              <Link to="/signup">
                <Button className="rounded-none border-2 border-zinc-900 dark:border-zinc-100 !bg-chartreuse !text-zinc-900 hover:!bg-zinc-900 dark:hover:!bg-zinc-100 hover:!text-zinc-50 dark:hover:!text-zinc-900 transition-all font-mono font-black uppercase tracking-widest text-[10px] py-2 px-5 shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#f4f4f5] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main>{children}</main>

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
        <footer className="border-t-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-950">
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="grid gap-10 py-16 sm:grid-cols-2 md:grid-cols-4">

              {/* Brand */}
              <div className="space-y-4 md:col-span-1">
                <Link to="/" className="flex items-center gap-3 font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50 hover:opacity-70 transition-opacity">
                  <img src={logoSrc} alt="StratifyPM" className="h-7 w-auto" />
                  <span className="text-sm">StratifyPM</span>
                </Link>
                <p className="font-sans text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-[200px]">
                  The AI assistant built exclusively for Product Managers.
                </p>
              </div>

              {/* Platform */}
              <div className="space-y-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
                  Platform
                </p>
                <div className="flex flex-col space-y-3">
                  {[
                    { to: '/about', label: 'About' },
                    { to: '/signin', label: 'Sign In' },
                    { to: '/signup', label: 'Get Started' },
                  ].map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Open Source */}
              <div className="space-y-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
                  Open Source
                </p>
                <div className="flex flex-col space-y-3">
                  <a
                    href="https://github.com/mayurbijarniya/stratifypm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                  >
                    Source Code
                  </a>
                </div>
              </div>

              {/* Legal */}
              <div className="space-y-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
                  Legal
                </p>
                <div className="flex flex-col space-y-3">
                  {[
                    { to: '/privacy', label: 'Privacy Policy' },
                    { to: '/terms', label: 'Terms of Service' },
                  ].map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center gap-5 pt-2">
                  <a href="https://github.com/mayurbijarniya/stratifypm" target="_blank" rel="noopener noreferrer"
                    className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                    <Github className="h-4 w-4" />
                  </a>
                  <a href="https://www.linkedin.com/in/mayurbijarniya/" target="_blank" rel="noopener noreferrer"
                    className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="mailto:bijarniya.m@northeastern.edu" target="_blank" rel="noopener noreferrer"
                    className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col items-center justify-between gap-4 border-t-2 border-zinc-200 dark:border-zinc-800 py-8 md:flex-row">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                  &copy; {new Date().getFullYear()} StratifyPM
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-chartreuse dark:bg-zinc-500 animate-pulse" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                    System Online
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                  V 1.0.0
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                  AES-256 Encrypted
                </span>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};
