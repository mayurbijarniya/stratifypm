import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { requestOtp, verifyOtp } from '../../utils/authApi';
import { useAuthStore } from '../../stores/authStore';
import { ArrowLeft, Shield, FolderTree, Mail, Info } from '../ui/icons';

type Step = 'email' | 'verify';

interface AuthScreenProps {
  mode?: 'signin' | 'signup';
  redirectTo?: string;
}

const formatCooldown = (seconds: number) => {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  if (mins > 0) {
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }
  return `${secs}s`;
};

const isGmailEmail = (email: string) => {
  return email.trim().toLowerCase().endsWith('@gmail.com');
};

export const AuthScreen: React.FC<AuthScreenProps> = ({ mode = 'signin', redirectTo = '/app' }) => {
  const { token, setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const canSend = useMemo(() => email.trim().length > 3, [email]);
  const canVerify = useMemo(() => /^\d{6}$/.test(code.trim()), [code]);

  // Check if already authenticated and redirect
  useEffect(() => {
    if (token) {
      // Wait for token to persist to localStorage before redirecting
      const timer = setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [token, navigate, redirectTo]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleSendCode = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const response = await requestOtp(email.trim());
      setStep('verify');
      setCode('');
      setCooldown(60);
      setShowEmailDialog(false);
      if (response?.expiresIn) {
        setInfo(`Code expires in ${Math.floor(response.expiresIn / 60)} minutes.`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send code';
      const retryAfter = (err as { retryAfter?: number })?.retryAfter;
      if (retryAfter) {
        setCooldown(retryAfter);
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (isGmailEmail(email)) {
      // Gmail users proceed directly
      handleSendCode();
    } else {
      // Other email types show dialog
      setShowEmailDialog(true);
    }
  };

  const handleVerify = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const result = await verifyOtp(email.trim(), code.trim());
      if (!result.token || !result.user) {
        throw new Error('Unable to verify code');
      }
      setAuth(result.token, {
        id: result.user.id,
        email: result.user.email,
        createdAt: result.user.createdAt,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid code';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setStep('email');
    setCode('');
    setError('');
    setInfo('');
  };

  const headline = mode === 'signup' ? 'Create your account' : 'Sign in to continue';
  const subheadline = mode === 'signup'
    ? 'Use your email to create an account in seconds.'
    : 'We will email you a one-time code to continue.';

  const descriptionText = mode === 'signup'
    ? 'Create an account to save your analyses, frameworks, and uploaded insights. Get started in seconds.'
    : 'Sign in to keep your analyses, frameworks, and uploaded insights connected to your account.';

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950">
      <div className="absolute left-6 top-6 z-10">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>
      </div>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-12 px-6 py-16 lg:flex-row">
        <div className="hidden lg:block max-w-xl space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <FolderTree className="h-3.5 w-3.5" />
            Product strategy workspace
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Stratify your product decisions with precision.
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg leading-relaxed">
              {descriptionText}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-primary/30 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mx-auto sm:mx-0">
                <FolderTree className="h-5 w-5 text-primary" />
              </div>
              <p className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100 text-center sm:text-left">Structured outputs</p>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 text-center sm:text-left">Keep competitive analyses and roadmaps organized.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-primary/30 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mx-auto sm:mx-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <p className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100 text-center sm:text-left">Secure access</p>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 text-center sm:text-left">One-time codes keep sign in simple and safe.</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {step === 'email' ? headline : 'Enter your code'}
            </h2>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {step === 'email'
                ? subheadline
                : `We sent a 6 digit code to ${email.trim()}`}
            </p>
          </div>

          <div className="space-y-5">
            {step === 'email' ? (
              <div className="space-y-4">
                <Input
                  type="email"
                  label="Email address"
                  placeholder="you@company.com"
                  value={email}
                  onChange={setEmail}
                  disabled={loading}
                  error={error}
                />
              </div>
            ) : (
              <>
                <Input
                  type="text"
                  label="Verification code"
                  placeholder="Enter 6 digit code"
                  value={code}
                  onChange={(value) => setCode(value.replace(/[^\d]/g, '').slice(0, 6))}
                  disabled={loading}
                  error={error}
                />
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={loading || cooldown > 0}
                    className="text-slate-600 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-slate-300 dark:hover:text-white"
                  >
                    {cooldown > 0 ? `Resend in ${formatCooldown(cooldown)}` : 'Resend code'}
                  </button>
                </div>
              </>
            )}

            {info && (
              <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-slate-600 dark:border-primary/30 dark:bg-primary/10 dark:text-slate-300">
                <Mail className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>{info}</span>
              </div>
            )}

            <Button
              fullWidth
              size="lg"
              loading={loading}
              disabled={step === 'email' ? !canSend : !canVerify}
              onClick={step === 'email' ? handleContinue : handleVerify}
            >
              {step === 'email' ? 'Send code' : 'Verify and continue'}
            </Button>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              By continuing, you agree to our terms and privacy policy.
            </p>
          </div>
        </div>
      </div>

      {/* Non-Gmail Email Dialog */}
      {showEmailDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowEmailDialog(false)}
          />
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 mx-4">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Info className="w-7 h-7 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Please use a Gmail address
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    For the best experience, we recommend using your Gmail email address to sign {mode === 'signup' ? 'up' : 'in'}.
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    fullWidth
                    onClick={() => setShowEmailDialog(false)}
                  >
                    Use Gmail instead
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
