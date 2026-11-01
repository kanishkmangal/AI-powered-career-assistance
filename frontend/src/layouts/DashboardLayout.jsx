import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Logo } from '../components';

/**
 * Dashboard Layout
 * Persistent structural shell for EduMitra AI student portal.
 * Design reference: Website UI/Overview Page/code.html
 */
const DashboardLayout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active path matcher
  const isActive = (path) => {
    if (path === '/overview' && (location.pathname === '/overview' || location.pathname === '/dashboard')) return true;
    if ((path === '/my-profile' || path === '/profile') && (location.pathname === '/my-profile' || location.pathname === '/profile')) return true;
    if (path === '/notifications' && location.pathname === '/notifications') return true;
    if (path === '/settings' && location.pathname === '/settings') return true;
    return location.pathname === path;
  };

  const navLinkClass = (path) =>
    `flex items-center justify-between px-space-sm py-2 rounded-lg transition-all ${
      isActive(path)
        ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
    }`;

  // Get dynamic breadcrumb label based on route
  const getBreadcrumbTitle = () => {
    if (location.pathname.includes('profile')) return 'Student Profile';
    if (location.pathname.includes('notification')) return 'Notification Center';
    if (location.pathname.includes('setting')) return 'Account Settings';
    return 'Workspace Hub';
  };

  const AVATAR_SRC = "https://lh3.googleusercontent.com/aida-public/AB6AXuA9dz0NW0K0hvZyzX8ogFNSHEKobc0fQs7meJxWwBV7zwLtMvYNAMkVI3jNX4n0B2y98B7nLlb0IBwwMn8Gh-WQg3_Gpdk8bPsbekafnGN3VPjBTZhscJWPO1RiPfLYu9uBRQD8KAP5RtwUPEpiE7hpEYjkglG7Q5SOojX5E8HfhHjNsXio5FOcUiJ_EKt9FRQQQy89mQXHYkffS283rRDuBULZ-5GEt2wbdL_GaUNwCLBxajzH-7qZ";

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('edumitra_user')) || {};
    } catch {
      return {};
    }
  })();
  const displayName =
    storedUser.fullName ||
    storedUser.full_name ||
    storedUser.name ||
    (storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName || ''}`.trim() : '') ||
    "Student";
  const displaySub = storedUser.institution
    ? `${storedUser.institution}`
    : (storedUser.eduLevel ? `Student • ${storedUser.eduLevel.toUpperCase()}` : "EduMitra Scholar");

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased flex flex-col">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Persistent Sidebar (Aside) */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Brand & Pro Badge */}
          <div className="px-space-lg pt-space-lg pb-space-md flex items-center justify-between">
            <Link to="/overview" className="flex items-center gap-space-sm" onClick={() => setMobileMenuOpen(false)}>
              <Logo className="h-8 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">EduMitra AI</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Learning &amp; Career</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
                Pro
              </span>
              <button
                className="lg:hidden p-1 text-on-surface-variant hover:text-on-surface"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Navigation Links Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-space-md py-space-sm space-y-space-md">
            {/* Main Navigation Group */}
            <div className="space-y-space-xs">
              <span className="px-space-sm font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                Main Navigation
              </span>
              <nav className="space-y-1">
                <Link to="/overview" className={navLinkClass('/overview')} onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    <span className="font-body-md text-body-md">Overview</span>
                  </div>
                </Link>

                <Link to="/my-profile" className={navLinkClass('/my-profile')} onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                    <span className="font-body-md text-body-md">My Profile</span>
                  </div>
                </Link>

                <a href="#academic-progress" className={navLinkClass('/academic-progress')}>
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px]">insights</span>
                    <span className="font-body-md text-body-md">Academic Progress</span>
                  </div>
                </a>

                <a href="#subjects-weak-topics" className={navLinkClass('/subjects-weak-topics')}>
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px]">menu_book</span>
                    <span className="font-body-md text-body-md">Subjects &amp; Topics</span>
                  </div>
                </a>

                <a href="#quizzes-assessments" className={navLinkClass('/quizzes-assessments')}>
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px]">assignment</span>
                    <span className="font-body-md text-body-md">Assessments</span>
                  </div>
                </a>

                <a href="#career-guidance" className={navLinkClass('/career-guidance')}>
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px]">explore</span>
                    <span className="font-body-md text-body-md">Career Guidance</span>
                  </div>
                </a>

                <a href="#ai-study-assistant" className={navLinkClass('/ai-study-assistant')}>
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                    <span className="font-body-md text-body-md">AI Assistant</span>
                  </div>
                  <span className="px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
                    AI
                  </span>
                </a>

                <a href="#my-study-plans" className={navLinkClass('/my-study-plans')}>
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px]">event_note</span>
                    <span className="font-body-md text-body-md">Study Plans</span>
                  </div>
                </a>

                <a href="#resume-builder" className={navLinkClass('/resume-builder')}>
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                    <span className="font-body-md text-body-md">Resume Builder</span>
                  </div>
                </a>
              </nav>
            </div>

            {/* Utilities Navigation Group */}
            <div className="space-y-space-xs">
              <span className="px-space-sm font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                Utilities
              </span>
              <nav className="space-y-1">
                <Link to="/notifications" className={navLinkClass('/notifications')} onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                    <span className="font-body-md text-body-md">Notifications</span>
                  </div>
                  <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-error text-on-error font-label-sm text-label-sm font-semibold">
                    3
                  </span>
                </Link>

                <Link to="/settings" className={navLinkClass('/settings')} onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    <span className="font-body-md text-body-md">Settings</span>
                  </div>
                </Link>
              </nav>
            </div>
          </div>

          {/* User Footer Card */}
          <Link
            to="/my-profile"
            onClick={() => setMobileMenuOpen(false)}
            className="p-space-md bg-surface-container-low m-space-sm rounded-xl flex items-center justify-between hover:bg-surface-container transition-colors group"
          >
            <div className="flex items-center gap-space-sm overflow-hidden">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shrink-0"
                src={AVATAR_SRC}
              />
              <div className="flex flex-col truncate">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                  {displayName}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  {displaySub}
                </span>
              </div>
            </div>
            <button className="text-on-surface-variant group-hover:text-on-surface p-1 rounded hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-[18px]">unfold_more</span>
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Layout Area with Left Padding for Fixed Aside on Desktop */}
      <div className="lg:pl-72 flex-1 flex flex-col">
        {/* Top Sticky Header */}
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-md sm:px-space-lg">
          {/* Left: Mobile hamburger & Breadcrumb */}
          <div className="flex items-center gap-space-sm text-on-surface-variant">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <span className="font-label-md text-label-md text-on-surface-variant font-medium">Platform</span>
            <span className="text-outline-variant font-body-sm">/</span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {getBreadcrumbTitle()}
            </span>
          </div>

          {/* Right: Search, Actions, Notifications & User Avatar */}
          <div className="flex items-center gap-space-sm sm:gap-space-md">
            {/* Quick search input */}
            <div className="hidden md:flex items-center gap-space-sm px-space-md py-1.5 bg-surface-container-low rounded-lg text-on-surface-variant w-48 xl:w-64">
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span className="font-body-md text-body-md flex-1 text-on-surface-variant/70">Quick search...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant font-mono text-xs">
                ⌘K
              </kbd>
            </div>

            {/* Ask AI Mentor */}
            <a
              className="hidden lg:flex items-center gap-space-xs px-space-sm py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-semibold hover:bg-secondary-fixed-dim transition-colors"
              href="#ai-study-assistant"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Ask AI Mentor</span>
            </a>

            {/* New Study Goal CTA */}
            <button className="hidden sm:flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary transition-colors shadow-sm cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>New Study Goal</span>
            </button>

            {/* Notifications Bell */}
            <Link
              to="/notifications"
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors relative"
              aria-label="View notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
            </Link>

            {/* Header User Avatar */}
            <Link to="/my-profile" className="flex items-center gap-space-sm pl-space-xs">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-outline-variant/30 hover:ring-primary transition-all"
                src={AVATAR_SRC}
              />
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="relative pt-16 w-full min-h-screen bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
