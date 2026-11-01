import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginStudent } from '../../services/api';

const LOGO_SRC = "/assets/LOGO.jpg";

/**
 * Login Page Component - EduMitra AI
 * Design reference: Website UI/Login Page/code.html
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || isSubmitting) return;

    setIsSubmitting(true);
    setLoginError('');

    try {
      const response = await loginStudent({
        email: email.trim().toLowerCase(),
        password
      });

      if (response && response.status === 'success') {
        localStorage.setItem('edumitra_user', JSON.stringify(response.data));
        navigate('/overview');
      }
    } catch (err) {
      if (err.errors && err.errors.detail) {
        setLoginError(err.errors.detail);
      } else {
        setLoginError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-background">
      {/* Left Column: Feature Highlight & Academic Pulse Showcase */}
      <div className="lg:col-span-5 xl:col-span-5 relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-surface-container overflow-hidden">
        {/* Ambient decorative gradient blooms */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-fixed blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-secondary-fixed blur-3xl opacity-50 pointer-events-none"></div>

        {/* Top Branding */}
        <div className="relative z-10 flex flex-col space-y-8">
          <Link to="/" className="flex items-center space-x-3.5 group">
            <img
              alt="EduMitra AI Logo"
              className="w-11 h-11 rounded-xl shadow-sm object-contain"
              src={LOGO_SRC}
            />
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-on-surface tracking-tight leading-none">
                EduMitra<span className="text-primary-container">.ai</span>
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-0.5">
                Adaptive Intelligence
              </span>
            </div>
          </Link>
          <div className="space-y-3 pt-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm w-fit">
              <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
              <span className="font-label-md text-label-md text-on-surface-variant">Active Term Fall 2024</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-headline-xl max-w-sm tracking-tight leading-tight">
              Your Academic Companion &amp; AI Career Mentor
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Bridging lecture concepts with actionable revision paths, instant conceptual breakthroughs, and career mapping.
            </p>
          </div>
        </div>

        {/* Center: Academic Pulse Showcase Card */}
        <div className="relative z-10 my-10 space-y-4">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    insights
                  </span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface">Weekly Academic Pulse</span>
              </div>
              <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold tracking-wide">
                Live Sync
              </span>
            </div>

            {/* Metrics Stack */}
            <div className="space-y-3">
              {/* Streak Metric */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-container-low transition-colors hover:bg-surface-container">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface font-semibold">14-Day Study Streak Active</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Top 5% consistency in your cohort</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline-variant text-[20px]">check_circle</span>
              </div>

              {/* Exam Metric */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-container-low transition-colors hover:bg-surface-container">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-secondary-fixed-dim flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined text-[18px]">event</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface font-semibold">Next Exam: OS Midterm</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Scheduled for Nov 07 • 6 Modules covered</p>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">In 4d</span>
              </div>

              {/* Weak Topics Remediated */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-container-low transition-colors hover:bg-surface-container">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface font-semibold">2 Weak Topics Remediated</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Virtual Memory &amp; Dining Philosophers</p>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-tertiary-container font-semibold">+18% Ret.</span>
              </div>
            </div>

            {/* Micro Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Syllabus Completion</span>
                <span className="font-label-sm text-label-sm text-on-surface font-bold">78%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary-container rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>

          {/* Student Endorsement Quote */}
          <div className="p-5 rounded-xl bg-surface-container-low shadow-sm relative">
            <span className="material-symbols-outlined absolute right-4 top-4 text-surface-container-high text-3xl select-none">
              format_quote
            </span>
            <p className="font-body-md text-body-md text-on-surface italic relative z-10 pr-6">
              “Personalized study plans and instant AI answers make college prep feel effortless.”
            </p>
            <div className="flex items-center space-x-2.5 mt-3 pt-3">
              <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-semibold text-xs">
                AK
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                Aarav K. • B.Tech Computer Science
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Platform Trust Stats */}
        <div className="relative z-10 pt-4 flex items-center justify-between text-on-surface-variant">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary-container">verified_user</span>
            <span className="font-label-sm text-label-sm">FERPA &amp; GDPR Compliant</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-label-sm text-label-sm">v2.4.1</span>
            <span className="font-label-sm text-label-sm">EduMitra Systems</span>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form Container */}
      <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-12 lg:py-16 bg-surface-container-lowest">
        <div className="w-full max-w-md flex flex-col space-y-8">
          {/* Header Section */}
          <div className="space-y-2">
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              Welcome back to EduMitra AI
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Enter your student credentials to resume your study plan and active research sprints.
            </p>
          </div>

          {/* SSO Login Actions */}
          <div className="flex flex-col space-y-3">
            {/* Institutional / Google SSO */}
            <button
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition duration-150 group shadow-sm text-left cursor-pointer"
              type="button"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z" fill="#4285F4"></path>
                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z" fill="#34A853"></path>
                <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2 0 10.05 0 12s.46 3.8 1.27 5.42l4.01-3.15z" fill="#FBBC05"></path>
                <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"></path>
              </svg>
              <span className="font-label-lg text-label-lg text-on-surface font-medium">Continue with Google / University Email</span>
            </button>

            {/* GitHub SSO */}
            <button
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition duration-150 group shadow-sm text-left cursor-pointer"
              type="button"
            >
              <svg className="w-5 h-5 flex-shrink-0 text-on-surface" fill="currentColor" viewBox="0 0 24 24">
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                ></path>
              </svg>
              <span className="font-label-lg text-label-lg text-on-surface font-medium">Continue with GitHub</span>
            </button>
          </div>

          {/* Or Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full h-px bg-surface-container-high"></div>
            <span className="absolute px-4 bg-surface-container-lowest font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              or sign in with email
            </span>
          </div>

          {/* Form Elements */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block font-label-md text-label-md text-on-surface font-semibold" htmlFor="student-email">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">
                  alternate_email
                </span>
                <input
                  id="student-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md transition focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container shadow-sm"
                  placeholder="student@university.edu"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block font-label-md text-label-md text-on-surface font-semibold" htmlFor="student-password">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  id="student-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md transition focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container shadow-sm"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  id="togglePassword"
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-on-surface-variant hover:text-on-surface transition p-0.5 focus:outline-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]" id="eyeIcon">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Options Row: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-container bg-surface-container-low focus:ring-primary-container focus:ring-offset-0 cursor-pointer accent-primary-container"
                />
                <span className="font-label-md text-label-md text-on-surface-variant">Remember Me</span>
              </label>
              <a
                className="font-label-md text-label-md text-primary-container hover:text-primary transition font-medium hover:underline"
                href="#reset-password"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Error Feedback */}
            {loginError && (
              <div className="p-3.5 rounded-lg bg-error-container text-on-error-container text-body-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                <span>{loginError}</span>
              </div>
            )}

            {/* Primary CTA Button */}
            <button
              className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-label-lg text-label-lg transition duration-200 shadow-sm shadow-primary/20 hover:shadow-md ${
                isSubmitting ? 'bg-primary/70 text-on-primary cursor-wait' : 'bg-primary-container hover:bg-primary text-on-primary cursor-pointer group'
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              <span className="font-semibold tracking-wide">
                {isSubmitting ? 'Signing In...' : 'Sign In to Workspace'}
              </span>
              <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isSubmitting ? 'animate-spin' : 'group-hover:translate-x-1'}`}>
                {isSubmitting ? 'refresh' : 'arrow_forward'}
              </span>
            </button>

            {/* Security reassurance */}
            <div className="flex items-center justify-center space-x-2 pt-2 text-outline">
              <span className="material-symbols-outlined text-[16px]">lock_clock</span>
              <span className="font-body-sm text-body-sm text-center">
                Protected with 256-bit encryption • University SSO compatible
              </span>
            </div>
          </form>

          {/* Bottom Sign Up Link */}
          <div className="text-center pt-2">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary-container hover:text-primary transition hover:underline ml-1"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
