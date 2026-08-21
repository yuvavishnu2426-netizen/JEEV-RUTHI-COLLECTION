import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Smartphone, Mail, ArrowRight, ShieldCheck,
  Lock, AlertCircle, CheckCircle, RefreshCw
} from 'lucide-react';
import { sendPhoneOtp, verifyPhoneOtp, sendEmailOtp, verifyEmailOtp, signInWithGoogle } from '../../lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'input' | 'otp' | 'success' | 'magic_link_sent';
type AuthMethod = 'mobile' | 'email';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('mobile');
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState<AuthStep>('input');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('input');
      setInputValue('');
      setOtp(Array(authMethod === 'mobile' ? 6 : 8).fill(''));
      setError(null);
      setResendTimer(0);
    }
  }, [isOpen, authMethod]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startResendTimer = () => {
    setResendTimer(60);
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!isOpen) return null;

  // ── Send OTP ──────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!inputValue.trim()) return;

    setLoading(true);
    try {
      let result: { error: string | null };
      if (authMethod === 'mobile') {
        const phone = inputValue.replace(/\D/g, '');
        if (phone.length < 10) {
          setError('Please enter a valid 10-digit mobile number.');
          setLoading(false);
          return;
        }
        result = await sendPhoneOtp(phone);
      } else {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
          setError('Please enter a valid email address.');
          setLoading(false);
          return;
        }
        result = await sendEmailOtp(inputValue);
      }

      if (result.error) {
        setError(result.error);
      } else {
        setStep('otp');
        setOtp(Array(authMethod === 'mobile' ? 6 : 8).fill(''));
        startResendTimer();
        setTimeout(() => inputRefs.current[0]?.focus(), 300);
      }
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP ────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const token = otp.join('');
    const requiredLength = authMethod === 'mobile' ? 6 : 8;
    if (token.length < requiredLength) {
      setError(`Please enter the complete ${requiredLength}-digit OTP.`);
      return;
    }

    setLoading(true);
    try {
      let result: { session: any; error: string | null };
      if (authMethod === 'mobile') {
        result = await verifyPhoneOtp(inputValue, token);
      } else {
        result = await verifyEmailOtp(inputValue, token);
      }

      if (result.error) {
        setError(result.error);
      } else {
        setStep('success');
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Google Login ──────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
    // Page will redirect to Google, no need to handle success here
  };

  // ── OTP Input Handling ────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const expectedLength = authMethod === 'mobile' ? 6 : 8;
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, expectedLength);
    if (pasted.length === expectedLength) {
      setOtp(pasted.split(''));
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError(null);
    setLoading(true);
    try {
      let result: { error: string | null };
      if (authMethod === 'mobile') {
        result = await sendPhoneOtp(inputValue);
      } else {
        result = await sendEmailOtp(inputValue);
      }
      if (result.error) {
        setError(result.error);
      } else {
        setOtp(Array(authMethod === 'mobile' ? 6 : 8).fill(''));
        startResendTimer();
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md bg-white text-[#111] rounded-3xl shadow-2xl border border-amber-500/20 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#111111] text-[#D4AF37] p-8 text-center relative border-b border-[#222]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-2 rounded-full"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1e1e1e] border border-[#D4AF37]/50 mb-3 shadow-lg">
              <Lock className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h2 className="font-cinzel text-xl font-bold text-white tracking-widest">
              SECURE CONCIERGE PORTAL
            </h2>
            <p className="text-xs text-gray-400 tracking-wider mt-1">
              Join the privileged inner circle of JEEV RUTHI COLLECTION
            </p>
          </div>

          <div className="p-8">

            {/* ── INPUT STEP ─────────────────────────────────────── */}
            {step === 'input' && (
              <>
                {/* Method Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl mb-6">
                  {(['mobile', 'email'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => { setAuthMethod(method); setInputValue(''); setError(null); setOtp(Array(method === 'mobile' ? 6 : 8).fill('')); }}
                      className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
                        authMethod === method
                          ? 'bg-[#111111] text-[#D4AF37] shadow-md'
                          : 'text-gray-700 hover:text-black'
                      }`}
                    >
                      {method === 'mobile'
                        ? <><Smartphone className="w-4 h-4" /><span>MOBILE OTP</span></>
                        : <><Mail className="w-4 h-4" /><span>EMAIL OTP</span></>
                      }
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 tracking-wider">
                      {authMethod === 'mobile' ? 'MOBILE NUMBER' : 'EMAIL ADDRESS'}
                    </label>
                    <div className="relative">
                      {authMethod === 'mobile' && (
                        <span className="absolute left-4 top-3 text-xs font-bold text-gray-500">+91</span>
                      )}
                      <input
                        type={authMethod === 'mobile' ? 'tel' : 'email'}
                        required
                        placeholder={authMethod === 'mobile' ? '98765 43210' : 'you@example.com'}
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value); setError(null); }}
                        className={`w-full py-3 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white font-medium transition ${
                          authMethod === 'mobile' ? 'pl-12' : 'pl-4'
                        }`}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !inputValue.trim()}
                    className="w-full bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition duration-300 py-3.5 rounded-xl font-cinzel font-bold text-xs tracking-widest shadow-lg flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /><span>SENDING OTP...</span></>
                    ) : (
                      <><span>REQUEST SECURE OTP</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" /></>
                    )}
                  </button>
                </form>

                {/* Google Login */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-3 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.705-.06-1.405-.19-2.065H12v4.51h6.6c-.29 1.495-1.11 2.765-2.37 3.625v3.015h3.835c2.245-2.065 3.68-5.11 3.68-9.085Z"/>
                      <path fill="#34A853" d="M12 24c3.3 0 6.07-1.09 8.09-2.955l-3.835-3.015c-1.095.735-2.505 1.17-4.255 1.17-3.27 0-6.04-2.21-7.03-5.18H1.05v3.1A12.001 12.001 0 0 0 12 24Z"/>
                      <path fill="#FBBC05" d="M4.97 14.02a7.197 7.197 0 0 1 0-4.04v-3.1H1.05A11.97 11.97 0 0 0 0 12c0 1.93.455 3.755 1.05 5.12l3.92-3.1Z"/>
                      <path fill="#EA4335" d="M12 4.75c1.795 0 3.41.615 4.675 1.815l3.51-3.51C18.07 1.17 15.3 0 12 0 7.31 0 3.255 2.77 1.05 6.88l3.92 3.1C5.96 7.01 8.73 4.75 12 4.75Z"/>
                    </svg>
                    <span>CONTINUE WITH GOOGLE</span>
                  </button>
                </div>
              </>
            )}

            {/* ── MAGIC LINK SENT STEP ──────────────────────────────────────── */}
            {step === 'magic_link_sent' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="text-center mb-6 mt-4">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border-2 border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="font-cinzel font-extrabold text-lg text-[#111] uppercase tracking-widest">Link Sent</h3>
                  <p className="text-sm text-gray-600 mt-4 leading-relaxed px-4">
                    We've securely sent a magic sign-in link to <br/><span className="font-bold text-[#D4AF37]">{inputValue}</span>.
                  </p>
                  <p className="text-[11px] text-gray-500 mt-4 font-medium px-4">
                    Check your inbox and click the link to automatically log in. You can close this window.
                  </p>
                </div>
                <button
                  onClick={() => onClose()}
                  className="w-full bg-[#111111] text-[#D4AF37] hover:bg-white transition duration-300 py-3.5 rounded-xl font-cinzel font-bold text-xs tracking-widest shadow-lg flex items-center justify-center cursor-pointer mt-6 border border-[#111]"
                >
                  CLOSE WINDOW
                </button>
              </motion.div>
            )}

            {/* ── OTP STEP ──────────────────────────────────────── */}
            {step === 'otp' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-sm">ENTER ONE TIME PASSWORD</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Sent to{' '}
                    <span className="font-mono text-[#D4AF37] font-bold">
                      {authMethod === 'mobile' ? `+91 ${inputValue}` : inputValue}
                    </span>
                  </p>
                  <button
                    onClick={() => { setStep('input'); setError(null); }}
                    className="text-[11px] text-amber-600 hover:underline font-bold mt-1"
                  >
                    Change {authMethod === 'mobile' ? 'Mobile Number' : 'Email'}
                  </button>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  {/* OTP inputs */}
                  <div className="flex justify-center gap-1.5 sm:gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        className={`bg-gray-50 border-2 border-[#D4AF37]/50 rounded-xl text-center font-bold font-mono focus:outline-none focus:border-[#D4AF37] focus:bg-white transition ${otp.length === 8 ? 'w-8 h-10 text-lg sm:w-10 sm:h-12' : 'w-12 h-12 text-xl sm:rounded-2xl'}`}
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otp.join('').length < 6}
                    className="w-full bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition duration-300 py-3.5 rounded-xl font-cinzel font-bold text-xs tracking-widest shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /><span>VERIFYING...</span></>
                    ) : (
                      <><ShieldCheck className="w-4 h-4" /><span>VERIFY & SIGN IN</span></>
                    )}
                  </button>

                  <div className="text-center text-xs text-gray-500">
                    {resendTimer > 0 ? (
                      <span>Resend OTP in <strong className="text-[#D4AF37]">{resendTimer}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={loading}
                        className="text-amber-600 font-bold hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── SUCCESS STEP ─────────────────────────────────── */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-[#111]">WELCOME BACK</h3>
                <p className="text-xs text-gray-500 mt-2">Successfully authenticated. Redirecting...</p>
              </motion.div>
            )}

          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-[11px] text-center text-gray-500 border-t border-gray-100 flex items-center justify-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secured by Supabase Auth — Phone OTP & OAuth2</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
