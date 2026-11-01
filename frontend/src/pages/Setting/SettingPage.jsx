import React, { useState, useEffect, useMemo } from 'react';
import { getStudentProfile, updateStudentProfile, changePassword } from '../../services/api';

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem('edumitra_user')) || {};
    } catch {
      return {};
    }
  };

  const storedUser = getStoredUser();

  // ─── Account State (populated from DB) ───
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [institution, setInstitution] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [degree, setDegree] = useState('');
  const [branch, setBranch] = useState('');
  const [currentYear, setCurrentYear] = useState(1);
  const [currentSemester, setCurrentSemester] = useState(1);
  const [academicStanding, setAcademicStanding] = useState('');

  // ─── Security State (always empty on load) ───
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [passwordError, setPasswordError] = useState('');

  // ─── Notification Toggles ───
  const [dailyDigest, setDailyDigest] = useState(true);
  const [bottleneckAlerts, setBottleneckAlerts] = useState(true);
  const [examCountdown, setExamCountdown] = useState(true);
  const [careerAlerts, setCareerAlerts] = useState(true);
  const [streakPush, setStreakPush] = useState(false);

  // ─── Appearance State (Light / Dark only) ───
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('edumitra_theme') || 'light';
  });
  const [fontScale, setFontScale] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  // ─── Privacy State ───
  const [recruiterVisibility, setRecruiterVisibility] = useState(true);
  const [telemetrySharing, setTelemetrySharing] = useState(true);
  const [aiTrainingOptOut, setAiTrainingOptOut] = useState(true);

  // ─── Toast Helper ───
  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // ─── Theme persistence ───
  useEffect(() => {
    localStorage.setItem('edumitra_theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // ─── Load profile from Neon DB ───
  useEffect(() => {
    const user = getStoredUser();
    const userEmail = user.email;
    if (!userEmail) {
      setIsLoadingProfile(false);
      return;
    }

    setIsLoadingProfile(true);
    getStudentProfile(userEmail)
      .then((res) => {
        if (res && res.data) {
          const d = res.data;
          setFullName(d.full_name || '');
          setEmail(d.email || userEmail);
          setRollNumber(d.roll_number || '');
          setInstitution(d.institution || '');
          setSecondaryEmail(d.personal_email || '');
          setDegree(d.degree || '');
          setBranch(d.branch || '');
          setCurrentYear(d.current_year || 1);
          setCurrentSemester(d.current_semester || 1);
          setAcademicStanding(d.academic_standing || '');
        }
      })
      .catch((err) => {
        console.warn('Failed to load profile for settings:', err);
        // Fallback to localStorage
        setFullName(user.fullName || user.full_name || '');
        setEmail(user.email || '');
        setRollNumber(user.rollNumber || '');
        setInstitution(user.institution || '');
        setSecondaryEmail(user.personalEmail || '');
      })
      .finally(() => setIsLoadingProfile(false));
  }, []);

  // ─── Password strength computation ───
  const passwordStrength = useMemo(() => {
    if (!newPass) return { label: '', percent: 0, color: 'bg-surface-container' };
    let score = 0;
    if (newPass.length >= 8) score += 20;
    if (newPass.length >= 12) score += 10;
    if (/[a-z]/.test(newPass)) score += 15;
    if (/[A-Z]/.test(newPass)) score += 15;
    if (/[0-9]/.test(newPass)) score += 15;
    if (/[^A-Za-z0-9]/.test(newPass)) score += 15;
    if (newPass.length >= 16) score += 10;

    if (score >= 80) return { label: `Strong (${score}%)`, percent: score, color: 'bg-tertiary' };
    if (score >= 50) return { label: `Moderate (${score}%)`, percent: score, color: 'bg-secondary' };
    return { label: `Weak (${score}%)`, percent: score, color: 'bg-error' };
  }, [newPass]);

  const passwordsMatch = useMemo(() => {
    if (!confirmPass || !newPass) return null;
    return newPass === confirmPass;
  }, [newPass, confirmPass]);

  // ─── Save Account Settings to DB ───
  const handleSaveAccount = async () => {
    setIsSavingAccount(true);
    try {
      const payload = {
        full_name: fullName,
        personal_email: secondaryEmail,
      };
      const res = await updateStudentProfile(email, payload);
      if (res && res.status === 'success') {
        // Sync localStorage
        const stored = getStoredUser();
        const updated = {
          ...stored,
          fullName: res.data.full_name || fullName,
          personalEmail: res.data.personal_email || secondaryEmail,
          institution: res.data.institution || institution,
          rollNumber: res.data.roll_number || rollNumber,
        };
        localStorage.setItem('edumitra_user', JSON.stringify(updated));
        triggerToast('Account settings saved to database.');
      }
    } catch (err) {
      triggerToast(err.message || 'Failed to save account settings.', 'error');
    } finally {
      setIsSavingAccount(false);
    }
  };

  // ─── Change Password via backend ───
  const handleChangePassword = async () => {
    setPasswordError('');

    if (!currentPass) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!newPass) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (!confirmPass) {
      setPasswordError('Please confirm your new password.');
      return;
    }
    if (newPass !== confirmPass) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await changePassword({
        email: email,
        current_password: currentPass,
        new_password: newPass,
        confirm_password: confirmPass,
      });
      if (res && res.status === 'success') {
        triggerToast(res.message || 'Password updated successfully.');
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
      }
    } catch (err) {
      const errorMsg = err.message || 'Password update failed.';
      const fieldErrors = err.errors || {};
      if (fieldErrors.new_password) {
        setPasswordError(Array.isArray(fieldErrors.new_password) ? fieldErrors.new_password.join(' ') : fieldErrors.new_password);
      } else if (fieldErrors.confirm_password) {
        setPasswordError(fieldErrors.confirm_password);
      } else {
        setPasswordError(errorMsg);
      }
      triggerToast(errorMsg, 'error');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleScrollTo = (tabId) => {
    setActiveTab(tabId);
    const element = document.getElementById(`${tabId}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSavePreferences = () => {
    triggerToast('Preferences updated and synchronized.');
  };

  const handleResetDefaults = () => {
    setThemeMode('light');
    setFontScale('normal');
    setHighContrast(false);
    setDailyDigest(true);
    setBottleneckAlerts(true);
    setExamCountdown(true);
    setCareerAlerts(true);
    setStreakPush(false);
    triggerToast('Values reset to institutional defaults.');
  };

  // ─── Detect current browser/session info ───
  const currentSessionInfo = useMemo(() => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    let browser = 'Browser';
    if (ua.includes('Edg/')) browser = 'Microsoft Edge';
    else if (ua.includes('Chrome')) browser = 'Google Chrome';
    else if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
    else if (ua.includes('Safari')) browser = 'Apple Safari';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

    let os = 'Desktop';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('CrOS')) os = 'ChromeOS';

    return {
      label: `${os} • ${browser}`,
      os,
      browser,
    };
  }, []);

  return (
    <div className="w-full pb-16 px-space-md sm:px-space-lg lg:px-space-xl max-w-[1440px] mx-auto">
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-opacity duration-300 ${
          toastType === 'error'
            ? 'bg-error-container text-on-error-container'
            : 'bg-inverse-surface text-inverse-on-surface'
        }`}>
          <span className="material-symbols-outlined text-[20px]">
            {toastType === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="font-label-lg text-label-lg font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
              Workspace Management
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            Settings &amp; Preferences
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-xl">
            Configure account security, notification policies, workspace appearance, and privacy governance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="h-10 px-4 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-low font-label-lg text-label-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">restart_alt</span>
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSavePreferences}
            className="h-10 px-5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-1">
            {[
              { id: 'account', icon: 'person', label: 'Account Profile' },
              { id: 'security', icon: 'shield', label: 'Security & Auth' },
              { id: 'notifications', icon: 'notifications_active', label: 'Notifications' },
              { id: 'appearance', icon: 'brush', label: 'Workspace Theme' },
              { id: 'privacy', icon: 'policy', label: 'FERPA & Privacy' },
              { id: 'sessions', icon: 'devices', label: 'Sessions & Logout' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleScrollTo(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-label-lg text-label-lg transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-surface-container-high text-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary' : 'bg-transparent'}`} />
                </button>
              );
            })}

            {/* Institutional Status Card */}
            <div className="mt-4 p-3 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-tertiary">school</span>
                <span className="font-label-sm text-label-sm font-semibold">Institutional Status</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                {institution ? `Enrolled under ${institution}.` : 'Enrolled Student.'}
              </p>
              <div className="mt-2 text-label-sm font-label-sm text-primary font-semibold flex items-center gap-1">
                <span>Sync verified</span>
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 9-Col Sections */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          {/* SECTION 1: ACCOUNT SETTINGS */}
          <section className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm" id="account-section">
            <div className="flex items-start justify-between pb-6">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Account Settings</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                  Your official institutional identification and contact channels.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-primary font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Campus Verified</span>
              </span>
            </div>

            {/* Profile Avatar & Info Card */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-surface-container-low mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-headline-md text-headline-md font-bold shadow-sm">
                  {fullName.split(' ').filter(Boolean).map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'ST'}
                </div>
                <button
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer"
                  title="Upload new photo"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  {fullName || 'Student'}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {degree ? `${degree} Student` : 'Undergraduate Scholar'}
                  {rollNumber ? ` • Roll ID #${rollNumber}` : ''}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  {institution && (
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                      {institution}
                    </span>
                  )}
                  {academicStanding && (
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                      {academicStanding}
                    </span>
                  )}
                </div>
              </div>
              <button className="px-3.5 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container transition-colors cursor-pointer">
                Update Photo
              </button>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Displayed across assessments, project submissions, and AI chats.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">Student ID / Roll Number</label>
                  <span className="text-tertiary flex items-center gap-1 font-label-sm text-label-sm font-semibold">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    <span>Verified</span>
                  </span>
                </div>
                <input
                  type="text"
                  disabled
                  value={rollNumber || '—'}
                  className="h-10 px-3.5 rounded-lg bg-surface-container text-on-surface-variant font-body-md text-body-md cursor-not-allowed font-mono"
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {rollNumber ? 'Locked by Academic Registrar.' : 'Not yet set. Update from My Profile page.'}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">University Email Address</label>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-tertiary font-label-sm text-label-sm flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    <span>Primary Single Sign-On</span>
                  </span>
                </div>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="h-10 px-3.5 rounded-lg bg-surface-container text-on-surface-variant font-body-md text-body-md cursor-not-allowed"
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Used for official syllabus updates, semester reports, and grade synchronizations.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Secondary Personal Email</label>
                <input
                  type="email"
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  placeholder="e.g. personal@gmail.com"
                  className="h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  For password reset safeguards and post-graduation credential continuity.
                </span>
              </div>

              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Institution / Campus Node</label>
                <input
                  type="text"
                  disabled
                  value={institution || '—'}
                  className="h-10 px-3.5 rounded-lg bg-surface-container text-on-surface-variant font-body-md text-body-md cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Academic Program &amp; Semester</label>
                <input
                  type="text"
                  disabled
                  value={
                    degree && academicStanding
                      ? `${degree} ${branch ? `• ${branch}` : ''} • ${academicStanding}`
                      : degree || 'Not specified'
                  }
                  className="h-10 px-3.5 rounded-lg bg-surface-container text-on-surface-variant font-body-md text-body-md cursor-not-allowed"
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Managed from your My Profile page. View-only here.
                </span>
              </div>
            </div>

            {/* Save Account Button */}
            <div className="mt-6 pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveAccount}
                disabled={isSavingAccount}
                className="h-10 px-5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSavingAccount ? 'sync' : 'save'}
                </span>
                <span>{isSavingAccount ? 'Saving...' : 'Save Account Changes'}</span>
              </button>
            </div>
          </section>

          {/* SECTION 2: SECURITY & AUTHENTICATION */}
          <section className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm" id="security-section">
            <div className="flex items-start justify-between pb-6">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Change Password &amp; Security
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                  Manage authentication protocols and secure your academic records.
                </p>
              </div>
              <span className="p-2 rounded-lg bg-surface-container text-primary">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </span>
            </div>

            {/* Password Error Alert */}
            {passwordError && (
              <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container flex items-center gap-2 font-label-md text-label-md">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{passwordError}</span>
                <button onClick={() => setPasswordError('')} className="ml-auto hover:opacity-80">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full h-10 pl-3.5 pr-10 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showCurrentPass ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full h-10 pl-3.5 pr-10 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showNewPass ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {newPass && (
                  <div className="mt-2 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-label-sm font-label-sm">
                      <span className="text-on-surface-variant">Security Strength</span>
                      <span className="font-semibold" style={{ color: passwordStrength.percent >= 80 ? '#00423c' : passwordStrength.percent >= 50 ? '#006398' : '#ba1a1a' }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden flex">
                      <div
                        className={`${passwordStrength.color} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${passwordStrength.percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full h-10 pl-3.5 pr-10 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showConfirmPass ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {passwordsMatch !== null && (
                  <span className={`font-body-sm text-body-sm flex items-center gap-1 mt-2 ${passwordsMatch ? 'text-tertiary' : 'text-error'}`}>
                    <span className="material-symbols-outlined text-[15px]">
                      {passwordsMatch ? 'check_circle' : 'cancel'}
                    </span>
                    <span>{passwordsMatch ? 'Passwords match perfectly' : 'Passwords do not match'}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Update Password Button */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={isSavingPassword || !currentPass || !newPass || !confirmPass}
                className="h-10 px-5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSavingPassword ? 'sync' : 'lock_reset'}
                </span>
                <span>{isSavingPassword ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>

            {/* 2FA Card */}
            <div className="mt-6 p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-surface-container text-primary">
                  <span className="material-symbols-outlined text-[20px]">smartphone</span>
                </div>
                <div>
                  <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                    Two-Factor Authentication (2FA)
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Adds an extra verification step using authenticator app or SMS code.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </section>

          {/* SECTION 3: NOTIFICATION PREFERENCES */}
          <section className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm" id="notifications-section">
            <div className="flex items-start justify-between pb-6">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Notification Preferences
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                  Control what alerts you receive and how often they fire.
                </p>
              </div>
              <span className="p-2 rounded-lg bg-surface-container text-secondary">
                <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {/* Daily Digest */}
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-surface-container text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">wb_sunny</span>
                  </div>
                  <div>
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">Daily Morning Study Digest</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Scheduled briefing with today's prioritized concepts, lecture syncs, and micro-tasks.
                    </p>
                    <span className="font-label-sm text-label-sm text-primary font-semibold mt-1 inline-block">
                      Scheduled: 08:00 AM IST
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" checked={dailyDigest} onChange={(e) => setDailyDigest(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {/* Bottleneck Alerts */}
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-surface-container text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">crisis_alert</span>
                  </div>
                  <div>
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                      Diagnostic Quiz Bottleneck Alerts
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Immediate notifications when AI detects recurring errors in algorithmic topics.
                    </p>
                    <span className="font-label-sm text-label-sm text-primary font-semibold mt-1 inline-block">
                      Trigger: Real-time analysis
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" checked={bottleneckAlerts} onChange={(e) => setBottleneckAlerts(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {/* Exam Reminders */}
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-surface-container text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">event_repeat</span>
                  </div>
                  <div>
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                      Exam &amp; Midterm Countdown Reminders
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Automated syllabus pacing checkpoints mapped to official academic calendar.
                    </p>
                    <span className="font-label-sm text-label-sm text-primary font-semibold mt-1 inline-block">
                      Cadence: 14 &amp; 7 days prior
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" checked={examCountdown} onChange={(e) => setExamCountdown(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {/* Career Alerts */}
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-surface-container text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">work_history</span>
                  </div>
                  <div>
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                      Career Match &amp; Internship Alerts
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Targeted alerts for software engineering fellowships matching your tech stack.
                    </p>
                    <span className="font-label-sm text-label-sm text-primary font-semibold mt-1 inline-block">
                      Condition: When match &gt; 80%
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" checked={careerAlerts} onChange={(e) => setCareerAlerts(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {/* Study Streak */}
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-surface-container text-on-surface">
                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                  </div>
                  <div>
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                      Socratic AI Study Streak Push Notifications
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Incentivizing nudge notifications to maintain uninterrupted daily coding challenges.
                    </p>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-1 inline-block">
                      Currently paused
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" checked={streakPush} onChange={(e) => setStreakPush(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </section>

          {/* SECTION 4: THEME & WORKSPACE APPEARANCE (Light / Dark only) */}
          <section className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm" id="appearance-section">
            <div className="flex items-start justify-between pb-6">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Theme &amp; Workspace Appearance
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                  Customize the visual styling, canvas contrasts, and layout typography.
                </p>
              </div>
              <span className="p-2 rounded-lg bg-surface-container text-primary">
                <span className="material-symbols-outlined text-[20px]">brush</span>
              </span>
            </div>

            {/* Color Theme Preview Cards — Light & Dark only */}
            <div className="mb-6">
              <label className="font-label-md text-label-md text-on-surface font-semibold mb-3 block">
                Color Theme Canvas
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Light */}
                <label
                  onClick={() => setThemeMode('light')}
                  className={`cursor-pointer relative flex flex-col p-4 rounded-xl transition-all border ${
                    themeMode === 'light'
                      ? 'bg-surface-container border-primary shadow-sm'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-primary">light_mode</span>
                      <span>Light Mode</span>
                    </span>
                    <input
                      type="radio"
                      name="theme"
                      checked={themeMode === 'light'}
                      onChange={() => setThemeMode('light')}
                      className="w-4 h-4 accent-primary"
                    />
                  </div>
                  <div className="h-20 rounded-lg bg-white p-2.5 flex flex-col justify-between shadow-xs border border-outline-variant/30">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                      <span className="w-12 h-1.5 rounded-full bg-slate-200" />
                    </div>
                    <div className="space-y-1">
                      <span className="w-full h-1.5 rounded bg-slate-100 block" />
                      <span className="w-3/4 h-1.5 rounded bg-slate-100 block" />
                    </div>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                    Clean white &amp; soft lavender surfaces
                  </span>
                </label>

                {/* Dark */}
                <label
                  onClick={() => setThemeMode('dark')}
                  className={`cursor-pointer relative flex flex-col p-4 rounded-xl transition-all border ${
                    themeMode === 'dark'
                      ? 'bg-surface-container border-primary shadow-sm'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                      <span>Dark Mode</span>
                    </span>
                    <input
                      type="radio"
                      name="theme"
                      checked={themeMode === 'dark'}
                      onChange={() => setThemeMode('dark')}
                      className="w-4 h-4 accent-primary"
                    />
                  </div>
                  <div className="h-20 rounded-lg bg-slate-900 p-2.5 flex flex-col justify-between shadow-xs border border-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                      <span className="w-12 h-1.5 rounded-full bg-slate-700" />
                    </div>
                    <div className="space-y-1">
                      <span className="w-full h-1.5 rounded bg-slate-800 block" />
                      <span className="w-3/4 h-1.5 rounded bg-slate-800 block" />
                    </div>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                    High-contrast slate &amp; deep navy
                  </span>
                </label>
              </div>
            </div>

            {/* Density & Contrast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Font Scale &amp; Density</label>
                <div className="grid grid-cols-3 gap-2">
                  {['compact', 'normal', 'comfortable'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFontScale(s)}
                      className={`py-2 px-3 rounded-lg font-label-md text-label-md text-center capitalize transition-all cursor-pointer ${
                        fontScale === s
                          ? 'bg-primary text-on-primary font-semibold shadow-sm'
                          : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Controls spacing between lecture nodes and code snippets.
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">High Contrast Accessibility</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Enhance token contrast for formula visibility.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </section>

          {/* SECTION 5: FERPA & PRIVACY */}
          <section className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm" id="privacy-section">
            <div className="flex items-start justify-between pb-6">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Privacy, FERPA &amp; Data Sharing
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                  Control how your learning logs and diagnostic telemetry are governed.
                </p>
              </div>
              <span className="p-2 rounded-lg bg-surface-container text-tertiary">
                <span className="material-symbols-outlined text-[20px]">policy</span>
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                    Profile Visibility to Campus Hiring Partners
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Allow verified national recruitment consortia to view your verified skills badge portfolio.
                  </p>
                  <span className="font-label-sm text-label-sm text-primary font-semibold mt-1 inline-block">
                    Visible to Verified Recruiters only
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" checked={recruiterVisibility} onChange={(e) => setRecruiterVisibility(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                    Academic Performance Telemetry Sharing
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Share cumulative semester GPA and validated coding benchmarks with the Career Cell.
                  </p>
                  <span className="font-label-sm text-label-sm text-tertiary font-semibold mt-1 inline-block">
                    Compliance: FERPA &amp; Institute Policy Standard
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" checked={telemetrySharing} onChange={(e) => setTelemetrySharing(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">AI Model Training Opt-Out</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Strictly preserve full student confidentiality. Exclude your Socratic tutoring chats and proprietary code submissions from institutional model training.
                  </p>
                  <span className="font-label-sm text-label-sm text-primary font-semibold mt-1 inline-block">
                    Private mode active
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" checked={aiTrainingOptOut} onChange={(e) => setAiTrainingOptOut(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>

            <div className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => triggerToast('Data export initiated. Bundle will download shortly.')}
                className="flex-1 sm:flex-initial h-10 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">download</span>
                <span>Download Personal Data (PDF &amp; JSON)</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Account deletion requires Registrar authentication.')}
                className="w-full sm:w-auto h-10 px-4 rounded-lg bg-error-container hover:bg-error hover:text-on-error text-error font-label-lg text-label-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                <span>Delete Account &amp; Purge Data</span>
              </button>
            </div>
          </section>

          {/* SECTION 6: ACTIVE SESSIONS & LOGOUT — Single current session only */}
          <section className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm" id="sessions-section">
            <div className="flex items-start justify-between pb-6">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Active Sessions &amp; Sign Out
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                  Your current authenticated browser session.
                </p>
              </div>
              <span className="p-2 rounded-lg bg-surface-container text-error">
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </span>
            </div>

            {/* Single Current Session Card */}
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-surface-container text-primary">
                  <span className="material-symbols-outlined text-[22px]">laptop_mac</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                      {currentSessionInfo.label}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-tertiary font-label-sm text-label-sm font-semibold">
                      Active Now
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Current desktop browser session
                  </p>
                </div>
              </div>
              <span className="text-tertiary flex items-center gap-1.5 font-label-sm text-label-sm font-semibold self-start sm:self-center">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                <span>This Device</span>
              </span>
            </div>

            {/* Logout Button */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="w-full sm:w-auto h-10 px-5 rounded-lg bg-error text-on-error hover:bg-red-700 font-label-lg text-label-lg transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
                <span>Sign Out of EduMitra AI</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-6 shadow-xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">warning</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Sign Out from EduMitra AI?</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                You will be required to re-authenticate via your student credentials to resume your adaptive study sessions.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="h-10 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  localStorage.removeItem('edumitra_user');
                  localStorage.removeItem('edumitra_theme');
                  window.location.href = '/login';
                }}
                className="h-10 px-4 rounded-lg bg-error hover:bg-red-700 text-on-error font-label-lg text-label-lg transition-colors shadow-sm cursor-pointer"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
