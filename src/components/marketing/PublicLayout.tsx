import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Github, Linkedin, Mail } from '../ui/icons';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const border = 'border-slate-200 dark:border-slate-800';

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950">
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-4 z-20 mx-auto max-w-7xl px-4 sm:px-6">
          <div className={`flex items-center justify-between rounded-lg border ${border} bg-white/80 backdrop-blur-md px-6 py-3.5 dark:bg-slate-950/80`}>
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
              <Link to="/terms" className="transition hover:text-slate-900 dark:hover:text-white">
                Terms
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                to="/signin"
                className={`hidden rounded-lg border ${border} px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 md:inline-flex`}
              >
                Sign in
              </Link>
              <Link to="/signup">
                <Button size="sm" className="rounded-lg">Create account</Button>
              </Link>
            </div>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer className={`border-t ${border}`}>
          <div className="mx-auto w-full max-w-7xl px-6">
            {/* Links grid */}
            <div className={`grid gap-10 border-b ${border} py-16 sm:grid-cols-2 md:grid-cols-4`}>
              {/* Brand */}
              <div className="space-y-4">
                <Link to="/" className="flex items-center gap-2">
                  <img src="/logo.svg" alt="StratifyPM" className="h-7 w-auto" />
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">StratifyPM</span>
                </Link>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  The product management workspace powered by proven frameworks and real-time data.
                </p>
              </div>

              {/* Product */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Product</p>
                <div className="space-y-2">
                  <Link to="/about" className="block text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    About
                  </Link>
                  <Link to="/signin" className="block text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    Sign in
                  </Link>
                  <Link to="/signup" className="block text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    Create account
                  </Link>
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Resources</p>
                <div className="space-y-2">
                  <a
                    href="https://github.com/mayurbijarniya/stratifypm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    GitHub
                  </a>
                </div>
              </div>

              {/* Legal */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Legal</p>
                <div className="space-y-2">
                  <Link to="/privacy" className="block text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="block text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    Terms of Service
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <a
                    href="https://github.com/mayurbijarniya/stratifypm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/mayurbijarniya/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="mailto:bijarniya.m@northeastern.edu"
                    className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-slate-500 dark:text-slate-400 md:flex-row">
              <span>&copy; {new Date().getFullYear()} StratifyPM. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
