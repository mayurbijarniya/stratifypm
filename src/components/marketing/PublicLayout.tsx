import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Github, Linkedin, Mail } from '../ui/icons';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
      <div className="min-h-screen w-full bg-white dark:bg-slate-950">
      {/* Content wrapper */}
      <div className="relative z-10">
        <header className="sticky top-4 z-20 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm px-6 py-3.5">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              <img src="/logo.svg" alt="StratifyPM" className="h-7 w-auto" />
              StratifyPM
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
              <Link to="/about" className="transition hover:text-slate-900 dark:hover:text-white">
                About
              </Link>
              <Link to="/privacy" className="transition hover:text-slate-900 dark:hover:text-white">
                Privacy
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                to="/signin"
                className="hidden rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 md:inline-flex"
              >
                Sign in
              </Link>
              <Link to="/signup">
                <Button size="sm">Create account</Button>
              </Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="grid gap-12 md:grid-cols-4 mb-12">
              <div className="space-y-3">
                <img src="/logo.svg" alt="StratifyPM" className="h-7 w-auto" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Product</p>
                <div className="space-y-2">
                  <Link to="/about" className="block text-sm text-slate-600 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-white">
                    About
                  </Link>
                  <Link to="/privacy" className="block text-sm text-slate-600 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-white">
                    Privacy
                  </Link>
                  <Link to="/signin" className="block text-sm text-slate-600 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-white">
                    Sign in
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Resources</p>
                <div className="space-y-2">
                  <Link to="/signup" className="block text-sm text-slate-600 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-white">
                    Create account
                  </Link>
                  <a
                    href="https://github.com/mayurbijarniya/stratifypm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-slate-600 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-white"
                  >
                    GitHub
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Legal</p>
                <div className="space-y-2">
                  <Link to="/privacy" className="block text-sm text-slate-600 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-white">
                    Privacy Policy
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <a
                    href="https://github.com/mayurbijarniya/stratifypm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 dark:text-slate-400 transition hover:text-primary"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/mayurbijarniya/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 dark:text-slate-400 transition hover:text-primary"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="mailto:bijarniya.m@northeastern.edu"
                    className="text-slate-600 dark:text-slate-400 transition hover:text-primary"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-8 text-sm text-slate-500 dark:text-slate-400 md:flex-row">
              <span>© 2025 StratifyPM. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
