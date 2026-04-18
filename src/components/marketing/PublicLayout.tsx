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
  const logoSrc = theme === 'dark' ? "/sp_dark.svg" : "/sp_light.svg";

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 font-mono selection:bg-zinc-900 selection:text-zinc-50 dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
      <div className="relative z-10">
        {/* Header - Brutalist */}
        <header className="sticky top-0 z-50 w-full border-b-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-950">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link 
              to="/" 
              className="flex items-center gap-3 text-xl font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50 hover:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            >
              <img src={logoSrc} alt="StratifyPM" className="h-6 w-auto" />
              StratifyPM
            </Link>
            <nav className="hidden items-center gap-8 text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 md:flex">
              <Link to="/about" className="hover:text-zinc-900 dark:hover:text-white hover:underline decoration-2 underline-offset-4">
                About
              </Link>
              <Link to="/privacy" className="hover:text-zinc-900 dark:hover:text-white hover:underline decoration-2 underline-offset-4">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-zinc-900 dark:hover:text-white hover:underline decoration-2 underline-offset-4">
                Terms
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                to="/signin"
                className="hidden text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 hover:text-zinc-500 dark:hover:text-zinc-300 transition-colors md:block"
              >
                Sign in
              </Link>
              <Link to="/signup">
                <Button className="rounded-none border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-colors uppercase tracking-widest font-bold text-xs py-2 px-6">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer - Brutalist */}
        <footer className="border-t-2 border-zinc-900 dark:border-zinc-100">
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="grid gap-10 py-20 sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-4 md:col-span-1">
                <Link to="/" className="flex items-center gap-3 text-2xl font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
                  <img src={logoSrc} alt="StratifyPM" className="h-8 w-auto" />
                  Stratify
                </Link>
                <p className="text-sm font-medium uppercase tracking-wider leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Precision product management via multi-model intelligence.
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Platform</p>
                <div className="flex flex-col space-y-4">
                  <Link to="/about" className="text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                    About
                  </Link>
                  <Link to="/signin" className="text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                    Sign in
                  </Link>
                  <Link to="/signup" className="text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                    Sign up
                  </Link>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">System</p>
                <div className="flex flex-col space-y-4">
                  <a href="https://github.com/mayurbijarniya/stratifypm" target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                    Source Code
                  </a>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Compliance</p>
                <div className="flex flex-col space-y-4">
                  <Link to="/privacy" className="text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    Terms of Operation
                  </Link>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <a href="https://github.com/mayurbijarniya/stratifypm" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/mayurbijarniya/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="mailto:bijarniya.m@northeastern.edu" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-6 py-10 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 md:flex-row mt-8">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <span>&copy; {new Date().getFullYear()} StratifyPM _ Architecture.</span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chartreuse animate-pulse" />
                  System Online
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span>V 1.0.0 // PRODUCTION</span>
                <span>ENC_AES_256</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
