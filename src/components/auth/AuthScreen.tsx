import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { requestOtp, verifyOtp } from '../../utils/authApi';
import { useAuthStore } from '../../stores/authStore';
import { ArrowLeft, Fingerprint, CheckCircle2 } from 'lucide-react';

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

const leftPanelFeatures = [
  'RICE scoring, competitive analysis & roadmaps',
  'Claude, Gemini, and GPT in one workspace',
  'Upload CSV/Excel for instant data insights',
  'Live market intelligence via real-time search',
  'No passwords — just your email and a code',
];

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

  const canSend = useMemo(() => email.trim().length > 3, [email]);
  const canVerify = useMemo(() => /^\d{6}$/.test(code.trim()), [code]);

  useEffect(() => {
    if (token) {
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
      if (response?.expiresIn) {
        setInfo(`Code valid for ${Math.floor(response.expiresIn / 60)} minutes.`);
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
    handleSendCode();
  };

  const handleVerify = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const result = await verifyOtp(email.trim(), code.trim());
      if (!result.token || !result.user) {
        throw new Error('Verification failed');
      }
      setAuth(result.token, {
        id: result.user.id,
        email: result.user.email,
        createdAt: result.user.createdAt,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid code. Please try again.';
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

  const headline = mode === 'signup' ? 'Create Account' : 'Welcome Back';
  const subline = mode === 'signup'
    ? 'Enter your email to get started — no password needed.'
    : 'Enter your email to receive a sign-in code.';

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute left-6 top-6 z-20 flex items-center gap-2 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50 hover:bg-zinc-900 hover:text-zinc-50 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-colors shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#f4f4f5] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 border-r-2 border-zinc-900 flex-col justify-between px-12 pb-12 pt-32 bg-zinc-900 text-zinc-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border-2 border-zinc-700 bg-chartreuse text-zinc-900 px-3 py-1 font-mono font-bold uppercase tracking-widest text-xs mb-10">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse" />
            AI-POWERED PM ASSISTANT
          </div>

          <h1 className="text-6xl xl:text-7xl font-extrabold font-heading uppercase leading-[0.9] tracking-tighter mb-6">
            Your Senior<br />
            <span className="relative inline-block">
              <span className="relative z-10">PM Co-Pilot.</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-chartreuse -z-0 opacity-60" />
            </span>
          </h1>

          <p className="text-zinc-400 text-base font-sans leading-relaxed mb-10 max-w-sm">
            The AI assistant built exclusively for Product Managers. Make faster, smarter decisions — starting today.
          </p>

          <div className="space-y-3">
            {leftPanelFeatures.map((feat, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-chartreuse flex-shrink-0 mt-0.5" />
                <span className="font-sans text-sm text-zinc-300">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 w-full mt-auto">
          <div className="border-t-2 border-zinc-800 pt-6 flex items-end justify-between font-mono text-xs font-bold uppercase text-zinc-500">
            <span>No credit card required</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-chartreuse animate-pulse" />
              <span>System online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="inline-block border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-3 py-1 font-mono font-bold text-xs uppercase tracking-widest mb-5">
              [ {step === 'email' ? 'STEP 1 OF 2' : 'STEP 2 OF 2'} ]
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading uppercase text-zinc-900 dark:text-zinc-50 tracking-tighter mb-2">
              {headline}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans">{subline}</p>
          </div>

          <div className="space-y-5">
            {step === 'email' ? (
              <div className="space-y-2">
                <label className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && canSend && !loading && handleContinue()}
                  disabled={loading}
                  className="w-full border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900 p-4 text-zinc-900 dark:text-zinc-50 font-sans text-base focus:outline-none focus:ring-0 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors rounded-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
                {error && (
                  <p className="text-red-500 dark:text-red-400 font-mono text-xs uppercase mt-2">{error}</p>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
                    6-Digit Code
                  </label>
                  <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400">
                    Sent to <span className="font-bold text-zinc-900 dark:text-zinc-100">{email}</span>
                  </p>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                    onKeyDown={(e) => e.key === 'Enter' && canVerify && !loading && handleVerify()}
                    disabled={loading}
                    autoFocus
                    className="w-full border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900 p-4 text-center tracking-[0.8em] text-2xl font-bold text-zinc-900 dark:text-zinc-50 font-mono focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors rounded-none placeholder:tracking-normal placeholder:text-base placeholder:font-normal placeholder:opacity-40"
                  />
                  {error && (
                    <p className="text-red-500 dark:text-red-400 font-mono text-xs uppercase mt-2">{error}</p>
                  )}
                </div>

                <div className="flex items-center justify-between font-mono text-xs font-bold uppercase">
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 underline decoration-2 underline-offset-4 transition-colors"
                  >
                    Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={loading || cooldown > 0}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 disabled:opacity-40 transition-colors"
                  >
                    {cooldown > 0 ? `Resend in ${formatCooldown(cooldown)}` : 'Resend Code'}
                  </button>
                </div>
              </>
            )}

            {info && (
              <div className="border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-900 p-4 flex items-start gap-3">
                <Fingerprint className="h-4 w-4 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5" />
                <span className="font-sans text-xs text-zinc-700 dark:text-zinc-300">{info}</span>
              </div>
            )}

            <Button
              loading={loading}
              disabled={step === 'email' ? !canSend : !canVerify}
              onClick={step === 'email' ? handleContinue : handleVerify}
              className="w-full rounded-none border-2 border-zinc-900 dark:border-zinc-100 !bg-chartreuse !text-zinc-900 hover:!bg-zinc-900 dark:hover:!bg-zinc-100 hover:!text-zinc-50 dark:hover:!text-zinc-900 transition-all uppercase tracking-widest font-black text-sm py-4 disabled:opacity-50 shadow-[5px_5px_0_0_#18181b] dark:shadow-[5px_5px_0_0_#f4f4f5] hover:translate-y-1 hover:translate-x-1 hover:shadow-none"
            >
              {step === 'email' ? 'Send Code →' : 'Verify & Sign In →'}
            </Button>

            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 text-center pt-2">
              By continuing, you agree to our{' '}
              <a href="/terms" className="underline hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy" className="underline hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
