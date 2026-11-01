import React, { useState } from 'react';

const INITIAL_NOTIFICATIONS = [
  // Today
  {
    id: 1,
    timeline: 'today',
    category: 'study',
    status: 'unread',
    icon: 'schedule',
    iconBg: 'bg-surface-container-high text-primary',
    barColor: 'bg-primary-container',
    dotColor: 'bg-primary',
    title: "Upcoming Study Session: Peterson's Algorithm & Semaphores",
    time: 'Today, 01:40 PM',
    description: 'Your scheduled 60-minute Operating Systems focus block starts in 20 minutes (02:00 PM). Lecture notes and Socratic prep have been pre-loaded.',
    tags: [
      { label: 'Study Reminders', cls: 'bg-surface-container-low text-on-surface-variant' },
      { label: 'Course CS-301', cls: 'bg-surface-container text-primary font-semibold' },
    ],
    primaryAction: 'Open Study Workspace',
    secondaryAction: 'Reschedule 30m',
  },
  {
    id: 2,
    timeline: 'today',
    category: 'quiz',
    status: 'unread',
    icon: 'troubleshoot',
    iconBg: 'bg-secondary-fixed/40 text-on-secondary-fixed-variant',
    barColor: 'bg-secondary',
    dotColor: 'bg-secondary',
    title: 'New Quiz Results: B+ Tree Indexing & Node Redistribution',
    time: 'Today, 11:20 AM',
    description: 'You scored 73.3% (Developing Mastery). The diagnostic engine detected 2 conceptual bottlenecks in node underflow borrowing and has queued 2 remedial drills.',
    highlight: {
      icon: 'warning',
      text: 'Identified Gap: Node underflow balance traversal',
      sub: 'Syllabus weight: 14%',
    },
    tags: [
      { label: 'Quizzes & Assessments', cls: 'bg-surface-container-low text-on-surface-variant' },
      { label: 'Score: 73.3%', cls: 'bg-secondary-fixed text-on-secondary-fixed-variant font-semibold' },
    ],
    primaryAction: 'Practice Remedial Drills',
    primaryCls: 'bg-secondary text-on-secondary hover:bg-secondary/90',
    secondaryAction: 'Diagnostic Report',
  },
  {
    id: 3,
    timeline: 'today',
    category: 'goals',
    status: 'read',
    icon: 'local_fire_department',
    iconBg: 'bg-tertiary-fixed/40 text-tertiary',
    title: '14-Day Study Streak Milestone Achieved! 🔥',
    time: 'Today, 09:00 AM',
    description: "Outstanding consistency! You've logged 14 consecutive active learning days, placing you in the top 5% of your college engineering cohort.",
    tags: [
      { label: 'Goal Milestones', cls: 'bg-tertiary-fixed/30 text-tertiary font-semibold' },
      { label: 'Top 5% Cohort', cls: 'text-on-surface-variant' },
    ],
    secondaryAction: 'View Progress Analytics',
  },

  // Yesterday
  {
    id: 4,
    timeline: 'yesterday',
    category: 'career',
    status: 'unread',
    icon: 'work',
    iconBg: 'bg-secondary-fixed/50 text-on-secondary-fixed',
    barColor: 'bg-secondary-container',
    dotColor: 'bg-secondary-container',
    title: 'New Hiring Role Matched: Cloud Infrastructure Intern @ Microsoft',
    time: 'Yesterday, 04:15 PM',
    description: 'Your profile match score for Distributed Systems Engineer rose to 92% following your recent high-concurrency lab benchmark. 4 new campus slots are now open.',
    tags: [
      { label: '92% Match Score', cls: 'bg-secondary-fixed text-on-secondary-fixed-variant font-semibold' },
      { label: 'Career Guidance', cls: 'bg-surface-container-low text-on-surface-variant' },
    ],
    primaryAction: 'Explore Role Details',
    secondaryAction: 'Update ATS Resume',
  },
  {
    id: 5,
    timeline: 'yesterday',
    category: 'study',
    status: 'read',
    icon: 'auto_awesome',
    iconBg: 'bg-surface-container-high text-primary-container',
    title: 'AI Adaptive Planner Rescheduled 2 Tasks',
    time: 'Yesterday, 06:30 PM',
    description: 'Because your lab submission took longer yesterday, EduMitra automatically balanced your Thursday evening workload to prevent cognitive burnout.',
    tags: [
      { label: 'AI Planner', cls: 'bg-surface-container-low text-on-surface-variant' },
      { label: 'Workload optimized', cls: 'text-on-surface-variant' },
    ],
    secondaryAction: 'Review Updated Schedule',
  },

  // Earlier This Week
  {
    id: 6,
    timeline: 'earlier',
    category: 'quiz',
    status: 'read',
    icon: 'school',
    iconBg: 'bg-surface-container-high text-primary',
    title: 'Upcoming Proctored Midterm in 9 Days: DBMS (CS-304)',
    time: 'Oct 22, 2024',
    description: 'Your Database Systems Midterm examination is scheduled for Nov 02. Current syllabus coverage is at 85%.',
    progress: { label: 'Syllabus Target', value: '85% Ready', percent: 85 },
    tags: [
      { label: 'Quizzes & Assessments', cls: 'bg-surface-container-low text-on-surface-variant' },
      { label: '9 Days Left', cls: 'text-error font-medium' },
    ],
    secondaryAction: 'View Midterm Checklist',
  },
];

export default function NotificationPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Preference Toggles
  const [dailyDigest, setDailyDigest] = useState(true);
  const [quizAlerts, setQuizAlerts] = useState(true);
  const [careerTelemetry, setCareerTelemetry] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  // Mark single item as read
  const handleMarkAsRead = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'read' } : item))
    );
  };

  // Mark all as read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, status: 'read' })));
  };

  // Filter items
  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return item.status === 'unread';
    return item.category === activeFilter;
  });

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  // Group by timeline
  const todayItems = filteredNotifications.filter((n) => n.timeline === 'today');
  const yesterdayItems = filteredNotifications.filter((n) => n.timeline === 'yesterday');
  const earlierItems = filteredNotifications.filter((n) => n.timeline === 'earlier');

  const countCategory = (cat) => {
    if (cat === 'all') return notifications.length;
    if (cat === 'unread') return notifications.filter((n) => n.status === 'unread').length;
    return notifications.filter((n) => n.category === cat).length;
  };

  return (
    <div className="px-space-lg lg:px-space-xl py-space-lg max-w-[1440px] mx-auto w-full">
      {/* Top Action Toolbar & Context Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-space-xs text-on-surface-variant mb-1">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
              Workspace Hub
            </span>
            <span className="font-body-sm text-body-sm text-outline-variant">/</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Activity Center</span>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-semibold">
              Notifications &amp; Activity Center
            </h1>
            {unreadCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-ping" />
                {unreadCount} Unread Updates
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px]">check</span> All Caught Up
              </span>
            )}
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Stay updated on exam schedules, diagnostic quiz results, AI study plan adjustments, and career milestones.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-space-sm shrink-0">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest shadow-sm hover:bg-surface-container text-on-surface font-label-lg text-label-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">done_all</span>
            <span>Mark All as Read</span>
          </button>
          <button className="p-2 rounded-lg bg-surface-container-lowest shadow-sm hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>
      </section>

      {/* Horizontal Category Tabs & Filters Bar */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-sm mb-space-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { key: 'all', label: 'All Notifications', count: countCategory('all') },
              { key: 'unread', label: 'Unread', count: countCategory('unread'), dot: true },
              { key: 'study', label: 'Study Reminders', count: countCategory('study') },
              { key: 'quiz', label: 'Quiz & Tests', count: countCategory('quiz') },
              { key: 'goals', label: 'Goal Updates', count: countCategory('goals') },
              { key: 'career', label: 'Career Guidance', count: countCategory('career') },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`flex items-center gap-space-xs px-space-md py-2 rounded-lg font-label-md text-label-md transition-all shrink-0 cursor-pointer ${
                  activeFilter === tab.key
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                {tab.dot && <span className="w-2 h-2 rounded-full bg-secondary" />}
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full font-label-sm text-label-sm ${
                    activeFilter === tab.key ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center gap-space-sm shrink-0 self-end lg:self-center">
            <div className="flex items-center bg-surface-container-low px-space-sm py-1.5 rounded-lg text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] mr-1.5">calendar_today</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent font-label-md text-label-md text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="sem">This Semester</option>
              </select>
            </div>
            <button
              onClick={() => {
                setActiveFilter('all');
                setDateRange('7d');
              }}
              className="font-label-md text-label-md text-primary hover:text-primary-container px-space-sm py-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Mosaic (8 Cols Notifications Stream + 4 Cols Digest/Preferences Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Notifications Feed Stream (8 Columns) */}
        <main className="lg:col-span-8 flex flex-col space-y-space-lg">
          {/* TIMELINE SECTION: TODAY */}
          {todayItems.length > 0 && (
            <div className="flex flex-col space-y-space-md">
              <div className="flex items-center justify-between px-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                  <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wide font-semibold">Today</h2>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{todayItems.length} events</span>
              </div>

              {todayItems.map((n) => (
                <NotificationCard key={n.id} item={n} onMarkRead={(e) => handleMarkAsRead(n.id, e)} />
              ))}
            </div>
          )}

          {/* TIMELINE SECTION: YESTERDAY */}
          {yesterdayItems.length > 0 && (
            <div className="flex flex-col space-y-space-md">
              <div className="flex items-center justify-between px-space-xs pt-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                  <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wide font-semibold">Yesterday</h2>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{yesterdayItems.length} events</span>
              </div>

              {yesterdayItems.map((n) => (
                <NotificationCard key={n.id} item={n} onMarkRead={(e) => handleMarkAsRead(n.id, e)} />
              ))}
            </div>
          )}

          {/* TIMELINE SECTION: EARLIER THIS WEEK */}
          {earlierItems.length > 0 && (
            <div className="flex flex-col space-y-space-md">
              <div className="flex items-center justify-between px-space-xs pt-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                  <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wide font-semibold">
                    Earlier This Week
                  </h2>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{earlierItems.length} event</span>
              </div>

              {earlierItems.map((n) => (
                <NotificationCard key={n.id} item={n} onMarkRead={(e) => handleMarkAsRead(n.id, e)} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <div className="flex flex-col items-center justify-center p-space-2xl bg-surface-container-lowest rounded-xl shadow-sm text-center">
              <div className="relative mb-space-md">
                <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[40px]">notifications_paused</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant">
                  <span className="material-symbols-outlined text-[16px]">celebration</span>
                </div>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1 font-semibold">You're all caught up! 🎉</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-space-lg">
                No unread notifications right now. Your study goals and academic roadmap are right on track.
              </p>
              <div className="flex items-center gap-space-sm">
                <button
                  onClick={() => setActiveFilter('all')}
                  className="px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors cursor-pointer"
                >
                  Show All Updates
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Right Column: Preferences, Quick Telemetry & Digest (4 Columns) */}
        <aside className="lg:col-span-4 flex flex-col space-y-space-lg">
          {/* Smart Alert Preferences Card */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
            <div className="flex items-center justify-between mb-space-md pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Smart Alert Preferences</h2>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-medium cursor-pointer hover:underline">Manage</span>
            </div>
            <div className="space-y-space-md">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col pr-space-sm">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">Daily Study Digest</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Morning syllabus briefing &amp; goals</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={dailyDigest}
                    onChange={(e) => setDailyDigest(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container" />
                </label>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col pr-space-sm">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">Quiz Diagnostic Alerts</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Knowledge gap alerts &amp; remedial tasks</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={quizAlerts}
                    onChange={(e) => setQuizAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container" />
                </label>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col pr-space-sm">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">Career Match Telemetry</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Real-time internship &amp; skill fit scans</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={careerTelemetry}
                    onChange={(e) => setCareerTelemetry(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container" />
                </label>
              </div>

              {/* Toggle 4 */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col pr-space-sm">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">Sound Notifications</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Audible chime on session intervals</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={soundAlerts}
                    onChange={(e) => setSoundAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container" />
                </label>
              </div>
            </div>
          </section>

          {/* Upcoming Critical Deadlines Card */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
            <div className="flex items-center justify-between mb-space-md pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-error text-[22px]">event_upcoming</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Critical Deadlines</h2>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Next 14 Days</span>
            </div>
            <div className="space-y-space-sm">
              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-sm hover:bg-surface-container transition-colors">
                <div className="w-8 h-8 rounded bg-surface-container-high flex flex-col items-center justify-center shrink-0">
                  <span className="font-label-sm text-[10px] uppercase font-bold text-error">Nov</span>
                  <span className="font-headline-sm text-[14px] font-bold text-on-surface leading-none">02</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                    DBMS Midterm Exam (CS-304)
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-body-sm text-body-sm text-error font-medium">9 days left</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">• In-person Hall B</span>
                  </div>
                </div>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-sm hover:bg-surface-container transition-colors">
                <div className="w-8 h-8 rounded bg-surface-container-high flex flex-col items-center justify-center shrink-0">
                  <span className="font-label-sm text-[10px] uppercase font-bold text-primary">Oct</span>
                  <span className="font-headline-sm text-[14px] font-bold text-on-surface leading-none">25</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                    OS Semaphore Lab Submission
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-body-sm text-body-sm text-primary font-medium">Due tomorrow, 11:59 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Weekly Notification Digest Summary Widget with SVG Data Spark */}
          <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Weekly Telemetry
              </span>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm text-label-sm font-semibold">
                High Activity
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm mb-space-xs">
              <span className="font-display-lg text-display-lg text-on-surface font-bold">12</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Alerts resolved this week</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Average response time: <span className="font-semibold text-on-surface">1.2 hours</span>. You've cleared 82% of study reminders on schedule.
            </p>
            {/* Micro Inline SVG Activity Sparkline */}
            <div className="pt-space-xs">
              <svg className="w-full h-12 text-primary" fill="none" viewBox="0 0 200 40">
                <path
                  d="M 0 35 Q 25 15, 50 28 T 100 12 T 150 24 T 200 8"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <circle className="fill-primary" cx="200" cy="8" r="4" />
              </svg>
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Today</span>
              </div>
            </div>
          </section>

          {/* AI Assistant Mini Tip Card */}
          <div className="bg-secondary-fixed/30 rounded-xl p-space-md flex items-start gap-space-sm">
            <span className="material-symbols-outlined text-on-secondary-fixed-variant text-[20px] shrink-0 mt-0.5">lightbulb</span>
            <p className="font-body-sm text-body-sm text-on-secondary-fixed-variant">
              <strong>Pro Tip:</strong> EduMitra AI automatically batches non-urgent career notifications during your high-focus study intervals to protect flow state.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Subcomponent: Individual Notification Card
function NotificationCard({ item, onMarkRead }) {
  const isUnread = item.status === 'unread';

  return (
    <article
      className={`group bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden ${
        isUnread ? '' : 'opacity-90'
      }`}
    >
      {isUnread && item.barColor && (
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.barColor}`} />
      )}
      <div className="flex items-start gap-space-md">
        <div className="relative shrink-0">
          <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center`}>
            <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
          </div>
          {isUnread && (
            <span
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                item.dotColor || 'bg-primary'
              } ring-4 ring-surface-container-lowest`}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors truncate">
              {item.title}
            </h3>
            <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">{item.time}</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
            {item.description}
          </p>

          {/* Highlight / Gap pill */}
          {item.highlight && (
            <div className="p-space-sm bg-surface-container-low rounded-lg mb-space-md flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[20px]">{item.highlight.icon}</span>
                <span className="font-body-sm text-body-sm text-on-surface">{item.highlight.text}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">{item.highlight.sub}</span>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {item.progress && (
            <div className="space-y-1.5 mb-space-md max-w-md">
              <div className="flex justify-between text-label-sm font-label-sm text-on-surface-variant">
                <span>{item.progress.label}</span>
                <span className="font-semibold text-tertiary">{item.progress.value}</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="bg-tertiary h-full rounded-full" style={{ width: `${item.progress.percent}%` }} />
              </div>
            </div>
          )}

          {/* Footer tags & buttons */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
            <div className="flex items-center gap-space-sm flex-wrap">
              {item.tags.map((tag, i) => (
                <span key={i} className={`inline-flex items-center px-2 py-0.5 rounded-md font-label-sm text-label-sm ${tag.cls}`}>
                  {tag.label}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-space-xs">
              {item.primaryAction && (
                <button
                  className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-colors shadow-sm cursor-pointer ${
                    item.primaryCls || 'bg-primary-container text-on-primary hover:bg-primary'
                  }`}
                >
                  {item.primaryAction}
                </button>
              )}
              {item.secondaryAction && (
                <button className="px-space-sm py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors cursor-pointer">
                  {item.secondaryAction}
                </button>
              )}
              {isUnread && (
                <button
                  onClick={onMarkRead}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                  title="Mark as read"
                >
                  <span className="material-symbols-outlined text-[20px]">check</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
