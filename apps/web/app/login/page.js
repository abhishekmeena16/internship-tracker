'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginUser, registerUser, sendOtp, verifyOtp } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { validateEmailClient } from '../../lib/emailValidation';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-gray-500 font-medium">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/browse';

  const { login } = useAuth();

  // Mode: 'login' | 'register' | 'otp'
  const [authMode, setAuthMode] = useState('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP specific states
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1: Email, 2: Code
  const [previewCode, setPreviewCode] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetMessages = () => {
    setError('');
    setSuccessMsg('');
  };

  // 1. Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both email and password');
      return;
    }

    const emailCheck = validateEmailClient(email.trim());
    if (!emailCheck.isValid) {
      setError(emailCheck.error);
      return;
    }

    resetMessages();
    setLoading(true);

    try {
      const data = await loginUser(email.trim(), password);
      login(data.token, data.user);
      router.push(redirectUrl);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // 2. User Registration (Does NOT auto-redirect; switches to login with confirmation)
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    const emailCheck = validateEmailClient(email.trim());
    if (!emailCheck.isValid) {
      setError(emailCheck.error);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    resetMessages();
    setLoading(true);

    try {
      const res = await registerUser(email.trim(), password, name.trim());
      // Do NOT auto-login or redirect.
      // Switch user to the Login screen with success feedback!
      setAuthMode('login');
      setPassword('');
      setConfirmPassword('');
      setSuccessMsg(res.message || 'Account created successfully! Please sign in with your email and password.');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter a valid email address');
      return;
    }

    const emailCheck = validateEmailClient(email.trim());
    if (!emailCheck.isValid) {
      setError(emailCheck.error);
      return;
    }

    resetMessages();
    setLoading(true);

    try {
      const data = await sendOtp(email.trim(), name.trim());
      setSuccessMsg(`We've sent a 6-digit code to ${email.trim()}`);
      if (data.previewOtp) {
        setPreviewCode(data.previewOtp);
      }
      setOtpStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the full 6-digit verification code');
      return;
    }
    resetMessages();
    setLoading(true);

    try {
      const data = await verifyOtp(email.trim(), otp.trim(), name.trim());
      login(data.token, data.user);
      router.push(redirectUrl);
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-8 py-8 text-center text-white">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black tracking-tight mb-2 hover:opacity-90 transition-opacity">
            <span className="w-8 h-8 rounded-lg bg-white text-blue-900 flex items-center justify-center text-lg font-black shadow-sm">
              IT
            </span>
            Internship Tracker
          </Link>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">
            {redirectUrl.includes('/internships/')
              ? '🔒 Sign in to unlock application link & verified Job ID'
              : redirectUrl.includes('/browse')
              ? '🔒 Sign in to unlock all 480+ internship openings'
              : 'Secure JWT Authentication'}
          </p>
        </div>

        {/* Tab Switcher: Login / Register / OTP */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-sm font-semibold">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); resetMessages(); }}
            className={`flex-1 py-3.5 text-center transition-colors border-b-2 ${
              authMode === 'login'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); resetMessages(); }}
            className={`flex-1 py-3.5 text-center transition-colors border-b-2 ${
              authMode === 'register'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('otp'); resetMessages(); setOtpStep(1); }}
            className={`flex-1 py-3.5 text-center transition-colors border-b-2 ${
              authMode === 'otp'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Email OTP
          </button>
        </div>

        {/* Form Container */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. SIGN IN (EMAIL + PASSWORD) */}
          {authMode === 'login' && (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm shadow-sm"
                  placeholder="name@college.edu or name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-gray-800">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm shadow-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In with JWT →'
                  )}
                </button>
              </div>

              <div className="text-center pt-2 space-y-2">
                <p className="text-xs text-gray-600">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); resetMessages(); }}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Create account
                  </button>
                </p>
                <p className="text-xs text-gray-500">
                  Forgot password?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('otp'); resetMessages(); }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Log in with Email OTP code
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* 2. REGISTER (NAME, EMAIL, PASSWORD) */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Full Name <span className="text-xs font-normal text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  autoComplete="name"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm shadow-sm"
                  placeholder="e.g. Abhishek Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm shadow-sm"
                  placeholder="student@college.edu or name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm shadow-sm"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm shadow-sm"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Creating Account...
                    </>
                  ) : (
                    'Register with JWT Token →'
                  )}
                </button>
              </div>

              <p className="text-xs text-center text-gray-600 pt-1">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); resetMessages(); }}
                  className="text-blue-600 hover:underline font-bold"
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}

          {/* 3. EMAIL OTP */}
          {authMode === 'otp' && (
            <div>
              {otpStep === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm shadow-sm"
                      placeholder="student@college.edu or name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? 'Sending Code...' : 'Send Verification Code →'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {previewCode && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs text-center">
                      <span>🔑 Demo Code: </span>
                      <strong className="font-mono text-sm tracking-widest">{previewCode}</strong>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 text-center">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      className="block w-full py-3 px-4 text-center font-mono text-2xl tracking-[0.5em] font-extrabold border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm"
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? 'Verifying...' : 'Verify & Sign In'}
                    </button>
                  </div>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpStep(1)}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Change email address
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 text-center text-xs text-gray-500">
          <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
            ← Back to Internship Tracker Home
          </Link>
        </div>
      </div>
    </div>
  );
}
