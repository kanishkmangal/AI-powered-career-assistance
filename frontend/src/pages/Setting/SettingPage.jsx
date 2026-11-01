import React, { useState } from 'react';

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [toastMsg, setToastMsg] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('edumitra_user')) || {};
    } catch {
      return {};
    }
  })();

  const initialFullName =
    storedUser.fullName ||
    storedUser.full_name ||
    storedUser.name ||
    (storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName || ''}`.trim() : '') ||
    'Student';

  // Form State
  const [fullName, setFullName] = useState(initialFullName);
  const [secondaryEmail, setSecondaryEmail] = useState(storedUser.personalEmail || storedUser.secondaryEmail || 'student.personal@gmail.com');
  const [academicProgram, setAcademicProgram] = useState(storedUser.degree ? `${storedUser.degree} • ${storedUser.academicStanding || 'Year 3'}` : 'B.Tech Computer Science & Engineering • Semester 6');

  // Security State
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [currentPass, setCurrentPass] = useState('currentPasswordExample#2024');
  const [newPass, setNewPass] = useState('AaravNITK#2024@Secure');
  const [confirmPass, setConfirmPass] = useState('AaravNITK#2024@Secure');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Notification Toggles
  const [dailyDigest, setDailyDigest] = useState(true);
  const [bottleneckAlerts, setBottleneckAlerts] = useState(true);
  const [examCountdown, setExamCountdown] = useState(true);
  const [careerAlerts, setCareerAlerts] = useState(true);
  const [streakPush, setStreakPush] = useState(false);

  // Appearance State
  const [themeMode, setThemeMode] = useState('light'); // 'light' | 'dark' | 'system'
  const [fontScale, setFontScale] = useState('normal'); // 'compact' | 'normal' | 'comfortable'
  const [highContrast, setHighContrast] = useState(false);

  // Privacy State
  const [recruiterVisibility, setRecruiterVisibility] = useState(true);
  const [telemetrySharing, setTelemetrySharing] = useState(true);
  const [aiTrainingOptOut, setAiTrainingOptOut] = useState(true);

  // Show Toast
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2800);
  };

  const handleScrollTo = (tabId) => {
    setActiveTab(tabId);
    const element = document.getElementById(`${tabId}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSavePreferences = () => {
    triggerToast('Preferences updated and synchronized across devices.');
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

  return (
    <div className="w-full pb-16 px-space-md sm:px-space-lg lg:px-space-xl max-w-[1440px] mx-auto">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-opacity duration-300">
          <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">check_circle</span>
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
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">Security &amp; Preferences</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">
            Account &amp; Preferences
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage your student profile credentials, learning notifications, visual themes, and academic privacy controls.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={handleResetDefaults}
            className="h-10 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">restart_alt</span>
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={handleSavePreferences}
            className="h-10 px-5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3-Col Nav + 9-Col Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Nav Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm sticky top-20 flex flex-col gap-1">
            <div className="px-3 py-2 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Navigation
            </div>

            {[
              { id: 'account', label: 'Account Profile', icon: 'badge' },
              { id: 'security', label: 'Security & Auth', icon: 'lock_reset' },
              { id: 'notifications', label: 'Notifications', icon: 'notifications_active' },
              { id: 'appearance', label: 'Workspace Theme', icon: 'palette' },
              { id: 'privacy', label: 'FERPA & Privacy', icon: 'verified_user' },
              { id: 'sessions', label: 'Sessions & Logout', icon: 'power_settings_new' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
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
                Enrolled under NITK National Student Network node.
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
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{fullName}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Undergraduate Scholar • Roll ID #{storedUser.rollNumber || "2022CS0894"}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                    {storedUser.institution || "NIT Surathkal"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                    Class of 2026
                  </span>
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
                    <span>Institutional Verified</span>
                  </span>
                </div>
                <input
                  type="text"
                  disabled
                  value="2022CS0894"
                  className="h-10 px-3.5 rounded-lg bg-surface-container text-on-surface-variant font-body-md text-body-md cursor-not-allowed font-mono"
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Locked by NITK Academic Registrar. Contact faculty admin to update.
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
                  value={storedUser.email || "student@university.edu"}
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
                  value={storedUser.institution || "National Institute of Technology (NIT)"}
                  className="h-10 px-3.5 rounded-lg bg-surface-container text-on-surface-variant font-body-md text-body-md cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Academic Program &amp; Semester</label>
                <input
                  type="text"
                  value={academicProgram}
                  onChange={(e) => setAcademicProgram(e.target.value)}
                  className="h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                />
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
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
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                />
                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-label-sm font-label-sm">
                    <span className="text-on-surface-variant">Security Strength</span>
                    <span className="text-tertiary font-semibold">Strong (94%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden flex">
                    <div className="bg-tertiary w-11/12 h-full rounded-full" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="h-10 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-colors"
                />
                <span className="font-body-sm text-body-sm text-tertiary flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  <span>Passwords match perfectly</span>
                </span>
              </div>
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
                    University Authenticator app / SMS backup OTP
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-tertiary font-label-sm text-label-sm font-semibold">
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                      Auto-prompted on unfamiliar IP addresses
                    </span>
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer self-end sm:self-center">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => triggerToast('Password update initiated (Demo).')}
                className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </section>

          {/* SECTION 3: NOTIFICATION PREFERENCES */}
          <section className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm" id="notifications-section">
            <div className="flex items-start justify-between pb-6">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Notification Preferences</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                  Control pacing, frequency, and delivery of automated academic insights.
                </p>
              </div>
              <span className="p-2 rounded-lg bg-surface-container text-secondary">
                <span className="material-symbols-outlined text-[20px]">ring_volume</span>
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
                  <input
                    type="checkbox"
                    checked={dailyDigest}
                    onChange={(e) => setDailyDigest(e.target.checked)}
                    className="sr-only peer"
                  />
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
                  <input
                    type="checkbox"
                    checked={bottleneckAlerts}
                    onChange={(e) => setBottleneckAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
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
                      Automated syllabus pacing checkpoints mapped to official NITK academic calendar.
                    </p>
                    <span className="font-label-sm text-label-sm text-primary font-semibold mt-1 inline-block">
                      Cadence: 14 &amp; 7 days prior
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={examCountdown}
                    onChange={(e) => setExamCountdown(e.target.checked)}
                    className="sr-only peer"
                  />
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
                  <input
                    type="checkbox"
                    checked={careerAlerts}
                    onChange={(e) => setCareerAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
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
                  <input
                    type="checkbox"
                    checked={streakPush}
                    onChange={(e) => setStreakPush(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </section>

          {/* SECTION 4: THEME & WORKSPACE APPEARANCE */}
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

            {/* Color Theme Preview Cards */}
            <div className="mb-6">
              <label className="font-label-md text-label-md text-on-surface font-semibold mb-3 block">
                Color Theme Canvas
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                {/* System */}
                <label
                  onClick={() => setThemeMode('system')}
                  className={`cursor-pointer relative flex flex-col p-4 rounded-xl transition-all border ${
                    themeMode === 'system'
                      ? 'bg-surface-container border-primary shadow-sm'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">devices</span>
                      <span>System Default</span>
                    </span>
                    <input
                      type="radio"
                      name="theme"
                      checked={themeMode === 'system'}
                      onChange={() => setThemeMode('system')}
                      className="w-4 h-4 accent-primary"
                    />
                  </div>
                  <div className="h-20 rounded-lg overflow-hidden flex shadow-xs border border-outline-variant/30">
                    <div className="w-1/2 bg-white p-2 flex flex-col justify-between">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span className="w-full h-1 bg-slate-200 rounded" />
                    </div>
                    <div className="w-1/2 bg-slate-900 p-2 flex flex-col justify-between">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 self-end" />
                      <span className="w-full h-1 bg-slate-700 rounded" />
                    </div>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                    Auto-syncs with host OS configuration
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
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    className="sr-only peer"
                  />
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
                  <input
                    type="checkbox"
                    checked={recruiterVisibility}
                    onChange={(e) => setRecruiterVisibility(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                    Academic Performance Telemetry Sharing
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Share cumulative semester GPA and validated coding benchmarks with the NITK Career Cell.
                  </p>
                  <span className="font-label-sm text-label-sm text-tertiary font-semibold mt-1 inline-block">
                    Compliance: FERPA &amp; Institute Policy Standard
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={telemetrySharing}
                    onChange={(e) => setTelemetrySharing(e.target.checked)}
                    className="sr-only peer"
                  />
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
                  <input
                    type="checkbox"
                    checked={aiTrainingOptOut}
                    onChange={(e) => setAiTrainingOptOut(e.target.checked)}
                    className="sr-only peer"
                  />
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

          {/* SECTION 6: ACTIVE SESSIONS & LOGOUT */}
          <section className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm" id="sessions-section">
            <div className="flex items-start justify-between pb-6">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Active Sessions &amp; Sign Out
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                  Review active authenticated devices and terminate unattended sessions.
                </p>
              </div>
              <span className="p-2 rounded-lg bg-surface-container text-error">
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </span>
            </div>

            {/* Session 1: Current */}
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-surface-container text-primary">
                  <span className="material-symbols-outlined text-[22px]">laptop_mac</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">macOS Chrome (Apple Silicon)</h4>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-tertiary font-label-sm text-label-sm font-semibold">
                      Active Now
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Bengaluru, Karnataka, India • IP 106.51.12.89
                  </p>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Last accessed via campus Eduroam tunnel
                  </span>
                </div>
              </div>
              <span className="text-tertiary flex items-center gap-1 font-label-sm text-label-sm font-semibold self-start sm:self-center">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                <span>This Device</span>
              </span>
            </div>

            {/* Session 2: Secondary */}
            <div className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-surface-container text-on-surface-variant">
                  <span className="material-symbols-outlined text-[22px]">phone_android</span>
                </div>
                <div>
                  <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">OnePlus 11 • Mobile App</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Mangaluru, Karnataka, India • IP 49.37.214.10
                  </p>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Last active 3 hours ago</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => triggerToast('Mobile session revoked.')}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm self-start sm:self-center cursor-pointer"
              >
                Revoke Session
              </button>
            </div>

            {/* Logout Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => triggerToast('All other sessions terminated.')}
                className="w-full sm:w-auto h-10 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors cursor-pointer"
              >
                Log Out of All Devices
              </button>
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
                You will be required to re-authenticate via your student single sign-on credentials to resume your adaptive study sessions.
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
