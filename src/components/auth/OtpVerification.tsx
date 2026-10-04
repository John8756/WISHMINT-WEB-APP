import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OtpVerificationProps {
  email: string;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({
  email,
  onVerify,
  onResend,
  onBack,
  isLoading = false,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(45);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, val: string) => {
    setErrorMsg(null);
    const cleaned = val.replace(/\D/g, ''); // Numbers only

    if (!cleaned) {
      const updated = [...digits];
      updated[index] = '';
      setDigits(updated);
      return;
    }

    // Single digit input
    const updated = [...digits];
    updated[index] = cleaned[cleaned.length - 1];
    setDigits(updated);

    // Auto-advance to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Backspace on empty input jumps back
        inputRefs.current[index - 1]?.focus();
        const updated = [...digits];
        updated[index - 1] = '';
        setDigits(updated);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const updated = [...digits];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasteData[i] || '';
    }
    setDigits(updated);

    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of your verification code');
      return;
    }

    try {
      const ok = await onVerify(code);
      if (ok) {
        setIsSuccess(true);
        // Trigger celebratory confetti
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4A234A', '#C9A46C', '#B8A5D6', '#E9B8C7', '#FFD700'],
        });
      } else {
        setErrorMsg('Invalid code. Please check and try again or request a new one.');
      }
    } catch {
      setErrorMsg('Verification failed. Please try again.');
    }
  };

  const handleResendClick = async () => {
    if (countdown > 0) return;
    setDigits(['', '', '', '', '', '']);
    setErrorMsg(null);
    setCountdown(45);
    inputRefs.current[0]?.focus();
    await onResend();
  };

  return (
    <div className="w-full">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7A58AA] hover:text-[#4A234A] transition-colors mb-4 cursor-pointer focus:outline-none"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to login</span>
      </button>

      {/* Title & Email Info */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#F3EBF7] border border-[#D5C2E8] flex items-center justify-center text-[#7A58AA] mb-3 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(74,35,74,0.06)]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#4A234A] tracking-tight">
          Verify Your Atelier Code
        </h3>
        <p className="text-xs text-[#6F6468] mt-1 max-w-xs mx-auto leading-relaxed">
          We sent a 6-digit keepsake verification code to
        </p>
        <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full bg-white/70 border border-[#D5C2E8]/60 text-xs font-semibold text-[#4A234A]">
          <Mail className="w-3 h-3 text-[#7A58AA]" />
          <span className="truncate max-w-[200px]">{email || 'your email'}</span>
        </div>
      </div>

      <form onSubmit={handleVerify} className="space-y-5">
        {/* 6-box OTP Input Group */}
        <div className="flex justify-between items-center gap-1.5 sm:gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-10 sm:w-12 h-12 sm:h-14 text-center font-sans font-bold text-lg sm:text-xl rounded-2xl transition-all duration-200 focus:outline-none select-none ${
                digit
                  ? 'bg-white text-[#4A234A] border-2 border-[#7A58AA] shadow-[0_4px_12px_rgba(122,88,170,0.2),inset_0_2px_4px_rgba(255,255,255,0.9)]'
                  : 'bg-[#F7F2FA] text-[#4A234A] border border-[#D5C2E8]/70 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_2px_4px_rgba(255,255,255,0.8)] focus:border-[#7A58AA] focus:bg-white'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-rose-600 bg-rose-50 border border-rose-200/80 rounded-xl px-3 py-2 text-center"
          >
            {errorMsg}
          </motion.div>
        )}

        {/* Resend info */}
        <div className="flex items-center justify-between text-xs text-[#6F6468] px-1">
          <span>Didn&apos;t receive it?</span>
          {countdown > 0 ? (
            <span className="font-medium text-[#7A58AA]">
              Resend in <span className="font-mono">00:{countdown.toString().padStart(2, '0')}</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendClick}
              className="inline-flex items-center gap-1 font-semibold text-[#7A58AA] hover:text-[#4A234A] cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Resend Code</span>
            </button>
          )}
        </div>

        {/* Submit Verification Button */}
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className={`w-full py-3.5 px-6 rounded-2xl font-serif text-base tracking-wider font-semibold text-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(122,88,170,0.35),inset_0_2px_4px_rgba(255,255,255,0.4)] active:translate-y-0.5 active:shadow-[0_2px_8px_rgba(122,88,170,0.35)] ${
            isSuccess
              ? 'bg-emerald-600'
              : 'bg-gradient-to-r from-[#9677C4] to-[#7A58AA] hover:from-[#A284D1] hover:to-[#8864B8]'
          }`}
        >
          {isSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>Verified! Entering Atelier...</span>
            </>
          ) : isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Verifying code...</span>
            </>
          ) : (
            <span>Confirm & Continue</span>
          )}
        </button>
      </form>
    </div>
  );
};
