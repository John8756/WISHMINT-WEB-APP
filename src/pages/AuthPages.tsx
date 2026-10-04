import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import {
  WishmintClayCharacter,
  CharacterPose,
} from '../components/auth/WishmintClayCharacter';
import {
  ClayCloud,
  ClayPottedPlant,
  ClayPottedFlower,
} from '../components/auth/ClayBackgroundProps';
import { OtpVerification } from '../components/auth/OtpVerification';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  Sparkles,
  Heart,
  Loader2,
  CheckCircle,
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'signup' | 'forgot-password' | 'otp';
}

export const AuthPages: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const { login, signup, navigateTo, showToast } = useShop();

  // Mode state
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password' | 'otp'>(
    initialMode
  );

  // Form inputs
  const [name, setName] = useState('');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Focus tracking for character poses
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Compute character pose based on interaction
  const getCharacterPose = (): CharacterPose => {
    if (successMessage) return 'success';
    if (errorMessage) return 'error';
    if (mode === 'otp') return 'otp';
    if (mode === 'forgot-password') return 'forgot';
    if (isPasswordFocused) {
      return showPassword ? 'peeking' : 'covering';
    }
    if (isEmailFocused) return 'typing';
    return 'idle';
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailOrUsername.trim() || !password.trim()) {
      setErrorMessage('Please fill in both your email and password');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await login(emailOrUsername.trim(), password);
      if (ok) {
        setSuccessMessage('Welcome back to Wishmint! ✨');
        showToast('Successfully signed in. Opening your keepsake account...');
        setTimeout(() => {
          navigateTo('account');
        }, 1200);
      } else {
        setErrorMessage('Invalid credentials. Please verify your details.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !emailOrUsername.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await signup(name.trim(), emailOrUsername.trim(), password);
      if (ok) {
        setSuccessMessage('Account created! Welcome to our Circle 💜');
        showToast('Welcome to Wishmint Atelier! Starting OTP verification...');
        // Transition smoothly to OTP verification
        setTimeout(() => {
          setMode('otp');
          setSuccessMessage(null);
        }, 1000);
      } else {
        setErrorMessage('Could not create account. Please check your details.');
      }
    } catch {
      setErrorMessage('Signup encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailOrUsername.trim()) {
      setErrorMessage('Please enter your email to receive a recovery code');
      return;
    }

    setIsLoading(true);
    // Simulate sending recovery OTP
    setTimeout(() => {
      setIsLoading(false);
      showToast(`Artisanal reset code sent to ${emailOrUsername}! ✉️`);
      setMode('otp');
    }, 800);
  };

  const handleVerifyOtp = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate OTP verification
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        if (code === '123456' || code.length === 6) {
          showToast('Code confirmed! Welcome to Wishmint 🌸');
          setTimeout(() => {
            navigateTo('home');
          }, 1500);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 900);
    });
  };

  const handleResendOtp = async () => {
    showToast(`Fresh OTP code sent to ${emailOrUsername || 'your email'}! 💌`);
  };

  const handleSocialClick = (provider: 'Google' | 'Apple' | 'Facebook') => {
    showToast(`${provider} login placeholder ready — authentication hooks will connect here.`);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#C4B5E0] via-[#BAA6DC] to-[#A792CF] flex flex-col items-center justify-start pt-4 sm:pt-6 md:pt-28 lg:pt-32 pb-36 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-x-hidden selection:bg-[#E9B8C7] selection:text-[#4A234A]">
      {/* ====================================================
          3D CLAY BACKGROUND PROPS (Clouds, Plant & Flower)
          ==================================================== */}
      {/* Floating 3D Clouds (Positioned below header line) */}
      <ClayCloud className="top-12 md:top-28 left-4 md:left-20" delay={0} scale={1.05} />
      <ClayCloud className="top-24 md:top-40 right-4 md:right-24" delay={1.5} scale={0.9} />
      <ClayCloud className="bottom-16 left-8 hidden md:block" delay={2} scale={0.85} />

      {/* 3D Potted Plant (Left on Desktop/Tablet) */}
      <div className="hidden lg:block absolute bottom-8 left-8 xl:left-24 z-0 pointer-events-none">
        <ClayPottedPlant />
      </div>

      {/* 3D Potted Flower (Right on Desktop/Tablet) */}
      <div className="hidden lg:block absolute bottom-10 right-8 xl:right-24 z-0 pointer-events-none">
        <ClayPottedFlower />
      </div>

      {/* Content wrapper with natural height adaptation */}
      <div className="w-full max-w-[420px] flex flex-col items-center my-auto z-10">
        {/* Return Navigation Pill - Gracefully placed above card below header */}
        <div className="w-full mb-3 sm:mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            aria-label="Return to store"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 hover:bg-white text-[#4A234A] text-xs font-medium shadow-[0_4px_12px_rgba(74,35,74,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-white/80 transition-all cursor-pointer group active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Return to Store</span>
          </button>
          <span className="text-[11px] font-medium text-white/85 tracking-wider uppercase font-sans">
            Wishmint Sanctuary
          </span>
        </div>

        {/* ====================================================
            MAIN 3D CLAY CARD (Phone-Proportioned Clay Canvas)
            ==================================================== */}
        <motion.div
          initial={{ y: 25, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="relative z-10 w-full rounded-[38px] sm:rounded-[42px] bg-[#FFF9F5] p-4.5 sm:p-7 shadow-[0_30px_70px_-15px_rgba(74,35,74,0.32),0_12px_24px_rgba(0,0,0,0.08),inset_0_3px_6px_rgba(255,255,255,0.95),inset_0_-4px_10px_rgba(74,35,74,0.04)] border border-white/90"
        >
        {/* ==================================================
            CARD HEADER: Warm Heart & Sparkles Rays
            ================================================== */}
        <div className="text-center pt-2 pb-1 relative">
          {/* 3D Clay Heart Icon */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-8 h-8 mx-auto rounded-full bg-[#FFA4B6] flex items-center justify-center shadow-[0_4px_10px_rgba(255,164,182,0.5),inset_0_2px_3px_rgba(255,255,255,0.8)] mb-2"
          >
            <Heart className="w-4 h-4 text-white fill-white" />
          </motion.div>

          {/* Heading with Decorative Warm Sparkle Rays */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#C9A46C] text-sm tracking-widest font-serif font-bold">
              ✦
            </span>
            <h2 className="font-serif text-[28px] sm:text-[32px] font-bold text-[#4A234A] leading-tight tracking-tight">
              {mode === 'login'
                ? 'Welcome Back'
                : mode === 'signup'
                ? 'Join Our Atelier'
                : mode === 'forgot-password'
                ? 'Reset Access'
                : 'Secret Code'}
            </h2>
            <span className="text-[#C9A46C] text-sm tracking-widest font-serif font-bold">
              ✦
            </span>
          </div>

          <p className="text-xs text-[#6F6468] font-sans mt-0.5 font-medium">
            {mode === 'login'
              ? 'Login to continue your journey'
              : mode === 'signup'
              ? 'Create an account for personalized keepsakes'
              : mode === 'forgot-password'
              ? 'Enter your email to receive recovery instructions'
              : 'Verifying your artisanal credentials'}
          </p>
        </div>

        {/* ==================================================
            INTERACTIVE 3D CLAY CHARACTER (Leaning Over Ledge)
            ================================================== */}
        <div className="relative -mb-4 z-20 flex justify-center">
          <WishmintClayCharacter
            pose={getCharacterPose()}
            isPasswordVisible={showPassword}
          />
        </div>

        {/* ==================================================
            INNER FLOATING FORM CONTAINER (Elevated 3D Layer)
            ================================================== */}
        <div className="relative z-30 rounded-[34px] bg-[#FFFFFF] p-5 sm:p-6 shadow-[0_16px_36px_rgba(74,35,74,0.1),0_2px_6px_rgba(0,0,0,0.04),inset_0_2px_5px_rgba(255,255,255,0.95)] border border-[#F2E7ED]">
          {/* Mode Switcher Tabs for Login & Signup */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="flex items-center justify-center p-1 rounded-2xl bg-[#F6F0F8] mb-5 border border-[#EADBEE]">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-[#4A234A] shadow-[0_2px_8px_rgba(74,35,74,0.12)]'
                    : 'text-[#867277] hover:text-[#4A234A]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-[#4A234A] shadow-[0_2px_8px_rgba(74,35,74,0.12)]'
                    : 'text-[#867277] hover:text-[#4A234A]'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium"
            >
              {errorMessage}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs text-center font-medium flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* ==============================================
              VIEW ROUTER: Login / Signup / Forgot / OTP
              ============================================== */}
          <AnimatePresence mode="wait">
            {/* 1. LOGIN VIEW */}
            {mode === 'login' && (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLoginSubmit}
                className="space-y-3.5"
              >
                {/* Username / Email Input */}
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 w-8 h-8 rounded-full bg-[#E5D7F0] flex items-center justify-center text-[#7A58AA] shadow-inner pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    placeholder="Email or Username"
                    className="w-full pl-13 pr-4 py-3 rounded-2xl bg-[#F7F2FA] text-sm text-[#4A234A] placeholder-[#8A7990] font-sans border border-[#EADBEE] focus:outline-none focus:border-[#7A58AA] focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] transition-all"
                  />
                </div>

                {/* Password Input */}
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 w-8 h-8 rounded-full bg-[#E5D7F0] flex items-center justify-center text-[#7A58AA] shadow-inner pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    placeholder="Password"
                    className="w-full pl-13 pr-11 py-3 rounded-2xl bg-[#F7F2FA] text-sm text-[#4A234A] placeholder-[#8A7990] font-sans border border-[#EADBEE] focus:outline-none focus:border-[#7A58AA] focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] transition-all tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 text-[#8A7990] hover:text-[#4A234A] transition-colors p-1 cursor-pointer focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot-password');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] font-semibold text-[#7A58AA] hover:text-[#4A234A] hover:underline cursor-pointer focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Pill CTA Button (Soft 3D Purple/Plum) */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#9677C4] to-[#7A58AA] hover:from-[#A284D1] hover:to-[#8864B8] text-white font-serif text-base tracking-wider font-semibold shadow-[0_8px_20px_rgba(122,88,170,0.35),inset_0_2px_4px_rgba(255,255,255,0.4)] active:translate-y-0.5 active:shadow-[0_2px_8px_rgba(122,88,170,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Entering Atelier...</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </button>

                {/* Social Login Separator */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-[#EADBEE] w-full" />
                  <span className="bg-white px-3 text-[10px] uppercase tracking-wider text-[#8A7990] font-sans font-medium whitespace-nowrap">
                    or continue with
                  </span>
                  <div className="border-t border-[#EADBEE] w-full" />
                </div>

                {/* Social Login Circular Buttons */}
                <div className="flex items-center justify-center gap-4">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('Google')}
                    aria-label="Sign in with Google"
                    className="w-11 h-11 rounded-full bg-[#FAF5FC] border border-[#EADBEE] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.04),inset_0_2px_3px_rgba(255,255,255,0.9)] hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('Apple')}
                    aria-label="Sign in with Apple"
                    className="w-11 h-11 rounded-full bg-[#FAF5FC] border border-[#EADBEE] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.04),inset_0_2px_3px_rgba(255,255,255,0.9)] hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.62-.75 1.04-1.8 0.92-2.89-.95.04-2.09.64-2.77 1.44-.59.69-1.12 1.77-.98 2.84 1.06.08 2.21-.57 2.83-1.39z" />
                    </svg>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('Facebook')}
                    aria-label="Sign in with Facebook"
                    className="w-11 h-11 rounded-full bg-[#FAF5FC] border border-[#EADBEE] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.04),inset_0_2px_3px_rgba(255,255,255,0.9)] hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                </div>

                {/* Footer Switch */}
                <div className="text-center pt-2">
                  <p className="text-xs text-[#6F6468]">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="font-bold text-[#7A58AA] hover:text-[#4A234A] cursor-pointer hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </motion.form>
            )}

            {/* 2. SIGNUP VIEW */}
            {mode === 'signup' && (
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSignupSubmit}
                className="space-y-3.5"
              >
                {/* Full Name */}
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 w-8 h-8 rounded-full bg-[#E5D7F0] flex items-center justify-center text-[#7A58AA] shadow-inner pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    placeholder="Full Name"
                    className="w-full pl-13 pr-4 py-3 rounded-2xl bg-[#F7F2FA] text-sm text-[#4A234A] placeholder-[#8A7990] font-sans border border-[#EADBEE] focus:outline-none focus:border-[#7A58AA] focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] transition-all"
                  />
                </div>

                {/* Email Address */}
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 w-8 h-8 rounded-full bg-[#E5D7F0] flex items-center justify-center text-[#7A58AA] shadow-inner pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    placeholder="Email Address"
                    className="w-full pl-13 pr-4 py-3 rounded-2xl bg-[#F7F2FA] text-sm text-[#4A234A] placeholder-[#8A7990] font-sans border border-[#EADBEE] focus:outline-none focus:border-[#7A58AA] focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] transition-all"
                  />
                </div>

                {/* Password */}
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 w-8 h-8 rounded-full bg-[#E5D7F0] flex items-center justify-center text-[#7A58AA] shadow-inner pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    placeholder="Create Password (min. 6 chars)"
                    className="w-full pl-13 pr-11 py-3 rounded-2xl bg-[#F7F2FA] text-sm text-[#4A234A] placeholder-[#8A7990] font-sans border border-[#EADBEE] focus:outline-none focus:border-[#7A58AA] focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] transition-all tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#8A7990] hover:text-[#4A234A] transition-colors p-1 cursor-pointer focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 w-8 h-8 rounded-full bg-[#E5D7F0] flex items-center justify-center text-[#7A58AA] shadow-inner pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    placeholder="Confirm Password"
                    className="w-full pl-13 pr-4 py-3 rounded-2xl bg-[#F7F2FA] text-sm text-[#4A234A] placeholder-[#8A7990] font-sans border border-[#EADBEE] focus:outline-none focus:border-[#7A58AA] focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] transition-all tracking-wider"
                  />
                </div>

                {/* Sign Up CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#9677C4] to-[#7A58AA] hover:from-[#A284D1] hover:to-[#8864B8] text-white font-serif text-base tracking-wider font-semibold shadow-[0_8px_20px_rgba(122,88,170,0.35),inset_0_2px_4px_rgba(255,255,255,0.4)] active:translate-y-0.5 active:shadow-[0_2px_8px_rgba(122,88,170,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>

                {/* Footer Switch */}
                <div className="text-center pt-2">
                  <p className="text-xs text-[#6F6468]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="font-bold text-[#7A58AA] hover:text-[#4A234A] cursor-pointer hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </motion.form>
            )}

            {/* 3. FORGOT PASSWORD VIEW */}
            {mode === 'forgot-password' && (
              <motion.form
                key="forgot-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleForgotPasswordSubmit}
                className="space-y-4"
              >
                <div className="text-center pb-1">
                  <span className="text-xs text-[#6F6468]">
                    Don&apos;t worry! Enter your email and we&apos;ll dispatch a quick verification code.
                  </span>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 w-8 h-8 rounded-full bg-[#E5D7F0] flex items-center justify-center text-[#7A58AA] shadow-inner pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-13 pr-4 py-3 rounded-2xl bg-[#F7F2FA] text-sm text-[#4A234A] placeholder-[#8A7990] font-sans border border-[#EADBEE] focus:outline-none focus:border-[#7A58AA] focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#9677C4] to-[#7A58AA] hover:from-[#A284D1] hover:to-[#8864B8] text-white font-serif text-base tracking-wider font-semibold shadow-[0_8px_20px_rgba(122,88,170,0.35),inset_0_2px_4px_rgba(255,255,255,0.4)] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending code...</span>
                    </>
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="text-xs font-semibold text-[#7A58AA] hover:text-[#4A234A] hover:underline cursor-pointer"
                  >
                    Return to login
                  </button>
                </div>
              </motion.form>
            )}

            {/* 4. OTP VERIFICATION VIEW */}
            {mode === 'otp' && (
              <motion.div
                key="otp-view"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <OtpVerification
                  email={emailOrUsername}
                  onVerify={handleVerifyOtp}
                  onResend={handleResendOtp}
                  onBack={() => setMode('login')}
                  isLoading={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      </div>
    </div>
  );
};
