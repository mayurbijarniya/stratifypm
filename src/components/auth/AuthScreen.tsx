import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { requestOtp, verifyOtp } from '../../utils/authApi';
import { useAuthStore } from '../../stores/authStore';
import { ArrowLeft, Terminal, AlertTriangle, Fingerprint } from 'lucide-react';

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
      setShowEmailDialog(false);
      if (response?.expiresIn) {
        setInfo(`CODE VALID FOR ${Math.floor(response.expiresIn / 60)} MINUTES.`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Uplink Failed';
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
      handleSendCode();
    } else {
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
        throw new Error('Key Validation Failed');
      }
      setAuth(result.token, {
        id: result.user.id,
        email: result.user.email,
        createdAt: result.user.createdAt,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid Key Sequence';
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

  const headline = mode === 'signup' ? 'SIGN UP' : 'SIGN IN';

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Back Button Overlay */}
      <button
        onClick={() => navigate('/')}
        className="absolute left-6 top-6 z-20 flex items-center gap-2 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50 hover:bg-zinc-900 hover:text-zinc-50 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-colors shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#f4f4f5] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Left side Graphic (Brutalist panel) */}
      <div className="hidden lg:flex w-1/2 border-r-2 border-zinc-900 dark:border-zinc-100 flex-col justify-between px-12 pb-12 pt-32 bg-zinc-900 text-zinc-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 10px)' }} />
         <div className="relative z-10 w-full">
            <h1 className="text-8xl font-bold font-heading uppercase leading-none tracking-tighter mb-8">
              STRATIFY <br/> DIRECT.
            </h1>
            <div className="border-l-4 border-zinc-50 pl-6 space-y-4 font-mono font-bold uppercase">
              <p>Welcome to StratifyPM</p>
              <p>Please connect to continue.</p>
            </div>
         </div>
         <div className="relative z-10 w-full mt-auto">
            <div className="border-t-4 border-zinc-50 pt-6 flex items-end justify-between font-mono font-bold uppercase">
               <span>SYSTEM ONLINE</span>
               <Terminal className="h-8 w-8" />
            </div>
         </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
         <div className="w-full max-w-md">
            <div className="mb-12">
               <div className="inline-block border-2 border-zinc-900 dark:border-zinc-100 px-3 py-1 font-mono font-bold text-xs uppercase mb-4 dark:text-zinc-400">
                 [ AUTH_{step.toUpperCase()} ]
               </div>
               <h2 className="text-4xl font-bold font-heading uppercase text-zinc-900 dark:text-zinc-50">
                 {headline}
               </h2>
            </div>

            <div className="space-y-6">
              {step === 'email' ? (
                <div className="space-y-2">
                  <label className="font-mono text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Email Address</label>
                  <input
                    type="email"
                    placeholder="operator@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900 p-4 text-zinc-900 dark:text-zinc-50 font-mono focus:outline-none focus:ring-0 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors rounded-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                  />
                  {error && <p className="text-red-600 font-mono text-xs uppercase mt-2">{error}</p>}
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="font-mono text-xs font-bold uppercase tracking-widest dark:text-zinc-400">Verification Code</label>
                    <input
                      type="text"
                      placeholder="000 000"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                      disabled={loading}
                      className="w-full border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900 p-4 text-center tracking-[1em] text-xl font-bold text-zinc-900 dark:text-zinc-50 font-mono focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors rounded-none placeholder:tracking-normal placeholder:text-sm placeholder:font-normal placeholder:opacity-50"
                    />
                    {error && <p className="text-red-600 font-mono text-xs uppercase mt-2">{error}</p>}
                  </div>
                  
                  <div className="flex items-center justify-between font-mono text-xs font-bold uppercase">
                    <button
                      type="button"
                      onClick={handleChangeEmail}
                      className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 underline decoration-2 underline-offset-4"
                    >
                      Change Email
                    </button>
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={loading || cooldown > 0}
                      className="text-zinc-500 hover:text-zinc-900 disabled:opacity-50 dark:hover:text-zinc-50"
                    >
                      {cooldown > 0 ? `RESEND ${formatCooldown(cooldown)}` : 'Resend Code'}
                    </button>
                  </div>
                </>
              )}

              {info && (
                <div className="border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-900 p-4 flex items-start gap-3">
                  <Fingerprint className="h-5 w-5 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5" />
                  <span className="font-mono text-xs font-bold uppercase text-zinc-900 dark:text-zinc-100">{info}</span>
                </div>
              )}

              <Button
                loading={loading}
                disabled={step === 'email' ? !canSend : !canVerify}
                onClick={step === 'email' ? handleContinue : handleVerify}
                className="w-full rounded-none border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-colors uppercase tracking-widest font-bold text-sm py-3 px-8 md:py-4 md:px-10 disabled:opacity-50 shadow-[6px_6px_0_0_#CCFF00] hover:translate-y-1 hover:translate-x-1 hover:shadow-none"
              >
                {step === 'email' ? 'SEND CODE' : 'VERIFY CODE'}
              </Button>

              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 text-center mt-8">
                By continuing, you agree to our Terms of Operation.
              </p>
            </div>
         </div>
      </div>

      {/* Non-Gmail Dialog */}
      {showEmailDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/80 backdrop-blur-sm">
           <div className="w-full max-w-md border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-950 p-8">
             <div className="flex flex-col border-l-4 border-zinc-900 dark:border-zinc-100 pl-6 mb-8">
               <AlertTriangle className="h-8 w-8 text-zinc-900 dark:text-zinc-100 mb-4" />
               <h3 className="text-xl font-bold font-heading uppercase text-zinc-900 dark:text-zinc-50 mb-2">
                 EMAIL NOTICE
               </h3>
               <p className="font-mono text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed uppercase">
                 For optimal delivery, Gmail domains are strictly recommended for this session.
               </p>
             </div>
             <Button
                onClick={() => setShowEmailDialog(false)}
                className="w-full rounded-none border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-colors uppercase tracking-widest font-bold text-xs py-4"
              >
                Acknowledge
              </Button>
           </div>
        </div>
      )}
    </div>
  );
};
