import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components';
import { registerStudent } from '../../services/api';

/**
 * Register Page Component - EduMitra AI
 * Design reference: Website UI/Register Page/code.html
 * Enhanced with dynamic password strength, immediate confirm-password validation,
 * alphabet-only validation for name/institution, and strict button disable/enable logic.
 */
const RegisterPage = () => {
  const navigate = useNavigate();

  // Form state
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [email, setEmail] = useState('');
  const [eduLevel, setEduLevel] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeHonorCode, setAgreeHonorCode] = useState(false);

  // Field touched state for inline error display
  const [touched, setTouched] = useState({
    fullName: false,
    institution: false,
    email: false,
    eduLevel: false,
    password: false,
    confirmPassword: false
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // --- Strict Validation Criteria ---

  // 1. Full Name: Only alphabet characters and spaces allowed, min 2 chars
  const nameRegex = /^[A-Za-z\s]+$/;
  const isNameEmpty = fullName.trim().length === 0;
  const isNameAlphabetOnly = nameRegex.test(fullName);
  const isNameValid = !isNameEmpty && isNameAlphabetOnly && fullName.trim().length >= 2;

  // 2. College / Institution: Only alphabet characters and spaces allowed, min 2 chars
  const isInstitutionEmpty = institution.trim().length === 0;
  const isInstitutionAlphabetOnly = nameRegex.test(institution);
  const isInstitutionValid = !isInstitutionEmpty && isInstitutionAlphabetOnly && institution.trim().length >= 2;

  // 3. Email: Standard email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email.trim());

  // 4. Current Education Level: Must select a valid option
  const isEduLevelValid = eduLevel !== '';

  // 5. Password Criteria:
  // - Minimum 8 characters
  // - At least one lowercase letter
  // - At least one uppercase letter
  // - At least one number
  // - At least one special character
  const hasMinLength = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const satisfiedCriteriaCount = [
    hasMinLength,
    hasLower,
    hasUpper,
    hasNumber,
    hasSpecial
  ].filter(Boolean).length;

  const isPasswordValid =
    hasMinLength && hasLower && hasUpper && hasNumber && hasSpecial;

  // Compute dynamic strength representation
  const getPasswordStrength = () => {
    if (!password) {
      return { score: 0, label: 'Weak', barColor: 'bg-surface-container-high', textColor: 'text-outline' };
    }
    if (satisfiedCriteriaCount <= 2 || !hasMinLength) {
      return { score: 1, label: 'Weak', barColor: 'bg-error', textColor: 'text-error' };
    }
    if (satisfiedCriteriaCount >= 3 && satisfiedCriteriaCount <= 4) {
      return { score: 3, label: 'Medium', barColor: 'bg-secondary', textColor: 'text-secondary' };
    }
    if (isPasswordValid) {
      return { score: 4, label: 'Strong', barColor: 'bg-tertiary-container', textColor: 'text-tertiary-container' };
    }
    return { score: 2, label: 'Medium', barColor: 'bg-secondary', textColor: 'text-secondary' };
  };

  const strength = getPasswordStrength();

  // 6. Confirm Password Validation: Must match password and not be empty
  const isConfirmPasswordTouched = confirmPassword.length > 0 || touched.confirmPassword;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = isConfirmPasswordTouched && confirmPassword.length > 0 && password !== confirmPassword;

  // 7. Overall Form Validity: All requirements must be satisfied to enable submit
  const isFormValid =
    isNameValid &&
    isInstitutionValid &&
    isEmailValid &&
    isEduLevelValid &&
    isPasswordValid &&
    passwordsMatch &&
    agreeHonorCode;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to reveal validation errors if any field is invalid
    setTouched({
      fullName: true,
      institution: true,
      email: true,
      eduLevel: true,
      password: true,
      confirmPassword: true
    });

    // Prevent submission if client validation check fails
    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      const response = await registerStudent({
        fullName: fullName.trim(),
        institution: institution.trim(),
        email: email.trim().toLowerCase(),
        eduLevel,
        password,
        confirmPassword,
        agreeHonorCode
      });

      if (response && response.status === 'success') {
        localStorage.setItem('edumitra_user', JSON.stringify(response.data));
        navigate('/overview');
      }
    } catch (err) {
      if (err.errors && err.errors.email) {
        setServerError(Array.isArray(err.errors.email) ? err.errors.email[0] : err.errors.email);
      } else if (err.errors && err.errors.non_field_errors) {
        setServerError(Array.isArray(err.errors.non_field_errors) ? err.errors.non_field_errors[0] : err.errors.non_field_errors);
      } else {
        setServerError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background font-body-md text-on-surface antialiased flex flex-col justify-center items-center">
      <main className="w-full min-h-screen flex flex-col">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Value Showcase & Student Inspiration */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-8 lg:sticky lg:top-8">
                
                {/* Brand Identity */}
                <Link to="/" className="flex items-center gap-3.5 group w-fit">
                  <Logo className="w-11 h-11 rounded-xl shadow-sm object-contain" />
                  <div className="flex flex-col">
                    <span className="font-headline-lg text-headline-lg tracking-tight text-on-surface flex items-center gap-1.5">
                      EduMitra <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">AI</span>
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Intelligent Academic &amp; Career Copilot</span>
                  </div>
                </Link>

                {/* Hero Motivation Message */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    Empowering 40,000+ STEM Students
                  </div>
                  <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                    Accelerate semester mastery with an AI mentor that understands your syllabus.
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    From algorithmic problem solving and lab viva simulations to real-world cloud roadmaps, EduMitra guides your daily engineering journey step by step.
                  </p>
                </div>

                {/* Student Testimonial Spotlight Card */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-12 h-12 rounded-full object-cover shadow-inner"
                        alt="Aarav Sharma"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSqr2Mqqx9EzcQ6vYopcaErPS4vWRX4_7OOmPKMwRXQ_5Hoi5fBS-MK-gug1cs8V3QX806Gsfk9O_uCOQ9M7fMKXR1HVKnEkhh0IbObA1anbo8br6jgWJ-Mj5f38J9F0fpZ9q5118HIrXDQgVzJ4Ao_WmWZz1OlWd2RZIiqUOcqzRkIasUhuJvWovSmhvuqowuJAfr5yQFNecsiV6GNf-AFE5BA-3G2BhgTLigi52bAnOncWMDLdaW"
                      />
                      <div>
                        <h4 className="font-headline-sm text-headline-sm text-on-surface">Aarav Sharma</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Pre-final Year B.Tech CS • NIT Surathkal</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container text-primary">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                      Verified
                    </span>
                  </div>
                  <blockquote className="font-body-md text-body-md text-on-surface/90 italic leading-relaxed">
                    “EduMitra transformed my semester — my GPA leaped from 7.4 to 8.64 while preparing for cloud engineering roles. The diagnostic mock tests pinpointed exactly what I was missing.”
                  </blockquote>

                  {/* Micro Score Progress Metric */}
                  <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined text-lg">trending_up</span>
                      </div>
                      <div>
                        <p className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Target Midterm Score</p>
                        <p className="font-headline-sm text-headline-sm text-on-surface">90%+ On Track</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-label-md text-label-md font-semibold text-tertiary-container bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
                        +16.4% delta
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Feature Perks */}
                <div className="space-y-3.5">
                  <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">
                    Included in your free tier
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-tertiary-fixed/40 text-tertiary-container flex items-center justify-center mt-0.5 shrink-0">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface">Syllabus-aligned AI Socratic tutor available 24/7</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-tertiary-fixed/40 text-tertiary-container flex items-center justify-center mt-0.5 shrink-0">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface">Instant weakness diagnosis for CS &amp; engineering exams</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-tertiary-fixed/40 text-tertiary-container flex items-center justify-center mt-0.5 shrink-0">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface">Industry career roadmap &amp; ATS resume optimizer</span>
                    </li>
                  </ul>
                </div>

                {/* Campus Safety Note */}
                <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm pt-2">
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>Encrypted with FERPA &amp; Institutional Academic Compliance</span>
                </div>
              </div>

              {/* Right Column: Registration Form */}
              <div className="lg:col-span-7">
                <div className="bg-surface-container-lowest p-6 sm:p-8 lg:p-10 rounded-2xl shadow-sm">
                  <div className="mb-8">
                    <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                      Create your free student account
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                      Start mastering your coursework and engineering career journey today.
                    </p>
                  </div>

                  {/* Fast Institutional Sign-up Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                    <button
                      className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface font-label-lg text-label-lg font-medium shadow-sm cursor-pointer"
                      type="button"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                      </svg>
                      <span>Google Workspace / SSO</span>
                    </button>
                    <button
                      className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface font-label-lg text-label-lg font-medium shadow-sm cursor-pointer"
                      type="button"
                    >
                      <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"></path>
                      </svg>
                      <span>GitHub Student Pack</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center my-6">
                    <div className="w-full bg-surface-container-high h-[1px]"></div>
                    <span className="absolute bg-surface-container-lowest px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Or register with email
                    </span>
                  </div>

                  {/* Main Input Form */}
                  <form className="space-y-5" id="signupForm" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="block font-label-md text-label-md font-medium text-on-surface" htmlFor="fullName">
                          Full Name
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">
                            person
                          </span>
                          <input
                            className={`w-full h-11 pl-10 pr-3.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline text-body-md font-body-md shadow-sm border focus:outline-none focus:ring-2 transition-all ${
                              touched.fullName && !isNameValid
                                ? 'border-error focus:ring-error/30'
                                : 'border-outline-variant/30 focus:ring-primary/30 focus:border-primary'
                            }`}
                            id="fullName"
                            placeholder="Aarav Sharma"
                            required
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onBlur={() => handleBlur('fullName')}
                          />
                        </div>
                        {touched.fullName && !isNameEmpty && !isNameAlphabetOnly && (
                          <p className="font-body-sm text-body-sm text-error flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[15px]">error</span>
                            Full Name must contain only alphabet characters.
                          </p>
                        )}
                        {touched.fullName && isNameEmpty && (
                          <p className="font-body-sm text-body-sm text-error flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[15px]">error</span>
                            Full Name is required.
                          </p>
                        )}
                      </div>

                      {/* College / Institution */}
                      <div className="space-y-1.5">
                        <label className="block font-label-md text-label-md font-medium text-on-surface" htmlFor="institution">
                          College / Institution
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">
                            school
                          </span>
                          <input
                            className={`w-full h-11 pl-10 pr-3.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline text-body-md font-body-md shadow-sm border focus:outline-none focus:ring-2 transition-all ${
                              touched.institution && !isInstitutionValid
                                ? 'border-error focus:ring-error/30'
                                : 'border-outline-variant/30 focus:ring-primary/30 focus:border-primary'
                            }`}
                            id="institution"
                            placeholder="NIT Surathkal / Dept of CS"
                            required
                            type="text"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            onBlur={() => handleBlur('institution')}
                          />
                        </div>
                        {touched.institution && !isInstitutionEmpty && !isInstitutionAlphabetOnly && (
                          <p className="font-body-sm text-body-sm text-error flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[15px]">error</span>
                            College / Institution must contain only alphabet characters.
                          </p>
                        )}
                        {touched.institution && isInstitutionEmpty && (
                          <p className="font-body-sm text-body-sm text-error flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[15px]">error</span>
                            College / Institution is required.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label className="block font-label-md text-label-md font-medium text-on-surface" htmlFor="email">
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">
                            alternate_email
                          </span>
                          <input
                            className={`w-full h-11 pl-10 pr-3.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline text-body-md font-body-md shadow-sm border focus:outline-none focus:ring-2 transition-all ${
                              touched.email && !isEmailValid
                                ? 'border-error focus:ring-error/30'
                                : 'border-outline-variant/30 focus:ring-primary/30 focus:border-primary'
                            }`}
                            id="email"
                            placeholder="aarav.sharma@university.edu"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => handleBlur('email')}
                          />
                        </div>
                        {touched.email && email.length > 0 && !isEmailValid && (
                          <p className="font-body-sm text-body-sm text-error flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[15px]">error</span>
                            Please enter a valid email address.
                          </p>
                        )}
                        {touched.email && email.length === 0 && (
                          <p className="font-body-sm text-body-sm text-error flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[15px]">error</span>
                            Email address is required.
                          </p>
                        )}
                      </div>

                      {/* Current Education Level Dropdown */}
                      <div className="space-y-1.5">
                        <label className="block font-label-md text-label-md font-medium text-on-surface" htmlFor="eduLevel">
                          Current Education Level
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">
                            auto_stories
                          </span>
                          <select
                            className={`w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-lowest text-on-surface text-body-md font-body-md shadow-sm border focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
                              touched.eduLevel && !isEduLevelValid
                                ? 'border-error focus:ring-error/30'
                                : 'border-outline-variant/30 focus:ring-primary/30 focus:border-primary'
                            }`}
                            id="eduLevel"
                            required
                            value={eduLevel}
                            onChange={(e) => setEduLevel(e.target.value)}
                            onBlur={() => handleBlur('eduLevel')}
                          >
                            <option disabled value="">
                              Select level
                            </option>
                            <option value="ug">Undergraduate (B.Tech / B.E / B.Sc)</option>
                            <option value="pg">Postgraduate (M.Tech / M.S / MCA)</option>
                            <option value="hs">Senior Secondary / High School (STEM)</option>
                            <option value="other">Self-taught / Bootcamp Student</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">
                            expand_more
                          </span>
                        </div>
                        {touched.eduLevel && !isEduLevelValid && (
                          <p className="font-body-sm text-body-sm text-error flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-[15px]">error</span>
                            Please select your current education level.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Passwords Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Password */}
                      <div className="space-y-1.5">
                        <label className="block font-label-md text-label-md font-medium text-on-surface" htmlFor="password">
                          Password
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">
                            lock
                          </span>
                          <input
                            className={`w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline text-body-md font-body-md shadow-sm border focus:outline-none focus:ring-2 transition-all ${
                              touched.password && !isPasswordValid
                                ? 'border-error focus:ring-error/30'
                                : 'border-outline-variant/30 focus:ring-primary/30 focus:border-primary'
                            }`}
                            id="password"
                            placeholder="••••••••••••"
                            required
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => handleBlur('password')}
                          />
                          <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 cursor-pointer focus:outline-none"
                            id="togglePasswordBtn"
                            type="button"
                            aria-label="Toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <label className="block font-label-md text-label-md font-medium text-on-surface" htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">
                            lock_reset
                          </span>
                          <input
                            className={`w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline text-body-md font-body-md shadow-sm border focus:outline-none focus:ring-2 transition-all ${
                              passwordMismatch
                                ? 'border-error focus:ring-error/30'
                                : 'border-outline-variant/30 focus:ring-primary/30 focus:border-primary'
                            }`}
                            id="confirmPassword"
                            placeholder="••••••••••••"
                            required
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() => handleBlur('confirmPassword')}
                          />
                          <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 cursor-pointer focus:outline-none"
                            type="button"
                            aria-label="Toggle confirm password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {showConfirmPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Immediate Confirm Password Status Feedback */}
                    {passwordMismatch && (
                      <p className="font-body-sm text-body-sm text-error flex items-center gap-1.5 -mt-2">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        Passwords do not match. Please verify your entries.
                      </p>
                    )}
                    {passwordsMatch && (
                      <p className="font-body-sm text-body-sm text-tertiary-container flex items-center gap-1.5 -mt-2">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Passwords match perfectly.
                      </p>
                    )}

                    {/* Dynamic Password Strength Bar Indicator */}
                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex items-center justify-between font-label-sm text-label-sm">
                        <span className="text-on-surface-variant">Security Strength</span>
                        <span className={`font-semibold ${strength.textColor}`} id="strengthText">
                          {strength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 h-1.5">
                        <div
                          className={`rounded-full transition-all duration-300 ${
                            strength.score >= 1 ? strength.barColor : 'bg-surface-container-high'
                          }`}
                        ></div>
                        <div
                          className={`rounded-full transition-all duration-300 ${
                            strength.score >= 2 ? strength.barColor : 'bg-surface-container-high'
                          }`}
                        ></div>
                        <div
                          className={`rounded-full transition-all duration-300 ${
                            strength.score >= 3 ? strength.barColor : 'bg-surface-container-high'
                          }`}
                        ></div>
                        <div
                          className={`rounded-full transition-all duration-300 ${
                            strength.score >= 4 ? strength.barColor : 'bg-surface-container-high'
                          }`}
                        ></div>
                      </div>

                      {/* Criteria checklist guidance */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1 pt-1 text-xs">
                        <span className={`flex items-center gap-1 ${hasMinLength ? 'text-tertiary-container font-medium' : 'text-on-surface-variant/70'}`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {hasMinLength ? 'check' : 'radio_button_unchecked'}
                          </span>
                          8+ characters
                        </span>
                        <span className={`flex items-center gap-1 ${hasLower ? 'text-tertiary-container font-medium' : 'text-on-surface-variant/70'}`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {hasLower ? 'check' : 'radio_button_unchecked'}
                          </span>
                          Lowercase (a-z)
                        </span>
                        <span className={`flex items-center gap-1 ${hasUpper ? 'text-tertiary-container font-medium' : 'text-on-surface-variant/70'}`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {hasUpper ? 'check' : 'radio_button_unchecked'}
                          </span>
                          Uppercase (A-Z)
                        </span>
                        <span className={`flex items-center gap-1 ${hasNumber ? 'text-tertiary-container font-medium' : 'text-on-surface-variant/70'}`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {hasNumber ? 'check' : 'radio_button_unchecked'}
                          </span>
                          Number (0-9)
                        </span>
                        <span className={`flex items-center gap-1 ${hasSpecial ? 'text-tertiary-container font-medium' : 'text-on-surface-variant/70'}`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {hasSpecial ? 'check' : 'radio_button_unchecked'}
                          </span>
                          Special char (!@#$)
                        </span>
                      </div>
                    </div>

                    {/* Terms & Honor Code Checkbox */}
                    <div className="flex items-start gap-3 pt-2">
                      <div className="flex items-center h-5">
                        <input
                          className="w-4 h-4 rounded text-primary focus:ring-primary/40 cursor-pointer accent-primary-container"
                          id="honorCode"
                          required
                          type="checkbox"
                          checked={agreeHonorCode}
                          onChange={(e) => setAgreeHonorCode(e.target.checked)}
                        />
                      </div>
                      <label className="font-body-sm text-body-sm text-on-surface-variant leading-tight cursor-pointer" htmlFor="honorCode">
                        I agree to the{' '}
                        <a className="text-primary hover:underline font-medium" href="#terms">
                          Terms of Service
                        </a>
                        ,{' '}
                        <a className="text-primary hover:underline font-medium" href="#privacy">
                          Privacy Policy
                        </a>
                        , and pledge to adhere to standard{' '}
                        <a className="text-primary hover:underline font-medium" href="#honor">
                          Academic Honor Codes
                        </a>
                        .
                      </label>
                    </div>

                    {/* Server Error Feedback */}
                    {serverError && (
                      <div className="p-3.5 rounded-lg bg-error-container text-on-error-container text-body-sm flex items-start gap-2">
                        <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                        <span>{serverError}</span>
                      </div>
                    )}

                    {/* Submit CTA Button with strict disable/enable logic */}
                    <button
                      className={`w-full py-3.5 px-5 rounded-lg font-headline-sm text-headline-sm shadow-md transition-all flex items-center justify-center gap-2 group ${
                        isFormValid && !isSubmitting
                          ? 'bg-primary-container hover:bg-primary-container/90 text-on-primary hover:shadow-lg cursor-pointer'
                          : 'bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed shadow-none'
                      }`}
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      title={!isFormValid ? 'Please complete all required fields satisfying validation criteria' : 'Create Account'}
                    >
                      <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                      <span className={`material-symbols-outlined text-lg transition-transform ${isSubmitting ? 'animate-spin' : 'group-hover:translate-x-1'}`}>
                        {isSubmitting ? 'refresh' : 'arrow_forward'}
                      </span>
                    </button>

                    {/* Form Status Hint when button is disabled */}
                    {!isFormValid && (
                      <p className="text-center font-body-sm text-body-sm text-on-surface-variant/70">
                        {!agreeHonorCode
                          ? 'Please accept the honor code and terms to proceed'
                          : !isPasswordValid
                          ? 'Password must fulfill all 5 security criteria'
                          : !passwordsMatch
                          ? 'Confirm password must match password'
                          : !isNameValid || !isInstitutionValid
                          ? 'Name and Institution must contain only alphabet characters'
                          : !isEmailValid
                          ? 'Please provide a valid email address'
                          : 'Please fill in all required fields'}
                      </p>
                    )}

                    {/* Bottom Redirect Link */}
                    <div className="text-center pt-2">
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Already have an account?{' '}
                        <Link className="text-primary font-semibold hover:underline transition-colors" to="/login">
                          Sign In
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
