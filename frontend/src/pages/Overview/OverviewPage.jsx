import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Overview Page Component (Student Dashboard) - EduMitra AI
 * Design reference: Website UI/Overview Page/code.html
 */
const OverviewPage = () => {
  // Retrieve authenticated student information
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('edumitra_user')) || {};
    } catch {
      return {};
    }
  })();

  const userFullName =
    storedUser.fullName ||
    storedUser.full_name ||
    storedUser.name ||
    (storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName || ''}`.trim() : '') ||
    'Student';

  // Academic performance trend active tab
  const [activeTab, setActiveTab] = useState('6weeks');

  // Study plan tasks state
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Dynamic Programming',
      subtitle: 'Knapsack Variations & Bitmask DP',
      priority: 'High',
      priorityClass: 'bg-error-container text-on-error-container',
      duration: '45 mins',
      completed: false
    },
    {
      id: 2,
      title: 'OS: Virtual Memory',
      subtitle: 'Review Paging, Segmentation Notes',
      priority: 'Med',
      priorityClass: 'bg-surface-container-high text-on-surface-variant',
      duration: 'Completed 30 mins',
      completed: true
    },
    {
      id: 3,
      title: 'DBMS: B+ Tree Drills',
      subtitle: 'Complete 10 Practice MCQs and insertion drills',
      priority: 'High',
      priorityClass: 'bg-error-container text-on-error-container',
      duration: '25 mins',
      completed: false
    }
  ]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="w-full max-w-7xl mx-auto px-space-md sm:px-space-lg lg:px-space-xl py-space-lg space-y-space-lg">
        
        {/* 1. Welcome Header Banner */}
        <header className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-lg sm:p-space-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
          <div className="space-y-space-xs z-10">
            <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[15px] text-primary">calendar_today</span>
              <span>Tuesday, October 24, 2024</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="text-primary font-semibold">Semester 5 (Fall)</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">
              Welcome back, {userFullName}! <span className="inline-block animate-pulse">👋</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Here's your real-time learning telemetry and high-yield milestones for today.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm z-10 shrink-0">
            <a
              className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary font-label-lg text-label-lg font-semibold transition-all shadow-sm"
              href="#ai-study-assistant"
            >
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              <span>Ask AI Tutor</span>
            </a>
            <a
              className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg font-semibold transition-all shadow-sm"
              href="#my-study-plans"
            >
              <span className="material-symbols-outlined text-[18px]">event_available</span>
              <span>View Study Plan</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
          {/* Subtle background flourish */}
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>
        </header>

        {/* 2. KPI Cards (4 Grid) */}
        <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Card 1: Academic Performance */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">Academic Performance</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </div>
              </div>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">8.85</span>
                <span className="font-body-md text-body-md text-on-surface-variant">/ 10.0 GPA</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between">
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary-container font-semibold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +2.4% vs mid-term
              </span>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                Top 10%
              </span>
            </div>
          </div>

          {/* Card 2: Study Streak */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                  STUDY STREAK
                </span>
                <div className="w-10 h-10 rounded-xl bg-primary-fixed/50 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">local_fire_department</span>
                </div>
              </div>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">14</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">Days</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant font-medium">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                42.5 hrs logged (Oct)
              </span>
              <span className="font-label-md text-label-md text-primary font-bold">
                Top 5%
              </span>
            </div>
          </div>

          {/* Card 3: Tasks Completed */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">Completed Tasks</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                </div>
              </div>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">18</span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">/ 22 Tasks</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between">
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant font-medium">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                82% completion rate
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                4 left today
              </span>
            </div>
          </div>

          {/* Card 4: Learning Hours */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">Study Hours This Week</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
              </div>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">28.5</span>
                <span className="font-body-md text-body-md text-on-surface-variant">hrs</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between">
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary-container font-semibold">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                +3.2 hrs vs last week
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Goal: 30 hrs
              </span>
            </div>
          </div>
        </section>

        {/* 3. Academic Performance Trend Chart Panel */}
        <section className="bg-surface-container-lowest rounded-2xl p-space-lg sm:p-space-xl shadow-sm flex flex-col gap-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Academic Performance Trend</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Aggregate continuous evaluation score across continuous drills, quizzes, and lab submissions.
              </p>
            </div>
            <div className="inline-flex p-1 rounded-xl bg-surface-container-low self-start sm:self-auto" role="tablist">
              <button
                aria-selected={activeTab === '6weeks'}
                onClick={() => setActiveTab('6weeks')}
                className={`px-space-sm py-1 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                  activeTab === '6weeks'
                    ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
                role="tab"
              >
                Last 6 Weeks
              </button>
              <button
                aria-selected={activeTab === 'semester'}
                onClick={() => setActiveTab('semester')}
                className={`px-space-sm py-1 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                  activeTab === 'semester'
                    ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
                role="tab"
              >
                Last Semester
              </button>
              <button
                aria-selected={activeTab === 'year'}
                onClick={() => setActiveTab('year')}
                className={`px-space-sm py-1 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                  activeTab === 'year'
                    ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
                role="tab"
              >
                Full Year
              </button>
            </div>
          </div>

          {/* Chart Display Area */}
          <div className="relative w-full pt-4">
            {/* Visual Badges / Legend */}
            <div className="flex items-center justify-end gap-space-md mb-2">
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                <span>Your Mastery Score</span>
              </div>
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                <span className="w-3 h-0.5 bg-outline-variant"></span>
                <span>Class Benchmark (74%)</span>
              </div>
            </div>

            {/* SVG Line Chart with Area and Annotations */}
            <div className="w-full h-64 sm:h-72 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 760 220">
                <defs>
                  <linearGradient id="performanceGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4338ca" stopOpacity="0.28"></stop>
                    <stop offset="100%" stopColor="#4338ca" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>
                {/* Horizontal Background Guide Lines */}
                <line stroke="#dae2fd" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="740" y1="20" y2="20"></line>
                <text className="font-mono" fill="#777586" fontSize="10" textAnchor="end" x="30" y="24">100%</text>
                
                <line stroke="#dae2fd" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="740" y1="70" y2="70"></line>
                <text className="font-mono" fill="#777586" fontSize="10" textAnchor="end" x="30" y="74">85%</text>
                
                <line stroke="#dae2fd" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="740" y1="120" y2="120"></line>
                <text className="font-mono" fill="#777586" fontSize="10" textAnchor="end" x="30" y="124">70%</text>
                
                <line stroke="#dae2fd" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="740" y1="170" y2="170"></line>
                <text className="font-mono" fill="#777586" fontSize="10" textAnchor="end" x="30" y="174">55%</text>
                
                {/* Benchmark Line (74%) -> y = 106 */}
                <line stroke="#c7c4d7" strokeDasharray="4 4" strokeWidth="1.5" x1="40" x2="740" y1="106" y2="106"></line>
                
                {/* Area Path */}
                <path d="M 80,93 L 210,83 L 340,77 L 470,87 L 600,67 L 720,58 L 720,200 L 80,200 Z" fill="url(#performanceGrad)"></path>
                
                {/* Main Trend Line */}
                <path d="M 80,93 L 210,83 L 340,77 L 470,87 L 600,67 L 720,58" fill="none" stroke="#4338ca" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                
                {/* Data Points */}
                <circle cx="80" cy="93" fill="#ffffff" r="4.5" stroke="#4338ca" strokeWidth="2.5"></circle>
                <circle cx="210" cy="83" fill="#ffffff" r="4.5" stroke="#4338ca" strokeWidth="2.5"></circle>
                <circle cx="340" cy="77" fill="#ffffff" r="4.5" stroke="#4338ca" strokeWidth="2.5"></circle>
                <circle cx="470" cy="87" fill="#ffffff" r="4.5" stroke="#4338ca" strokeWidth="2.5"></circle>
                <circle cx="600" cy="67" fill="#ffffff" r="4.5" stroke="#4338ca" strokeWidth="2.5"></circle>
                
                {/* Active Node Point W6 */}
                <circle cx="720" cy="58" fill="#4338ca" r="6" stroke="#ffffff" strokeWidth="2"></circle>
                <circle className="animate-ping" cx="720" cy="58" fill="#4338ca" opacity="0.2" r="10"></circle>
                
                {/* X Axis Labels */}
                <text className="font-medium" fill="#777586" fontSize="11" textAnchor="middle" x="80" y="215">Week 1 (78%)</text>
                <text className="font-medium" fill="#777586" fontSize="11" textAnchor="middle" x="210" y="215">Week 2 (81%)</text>
                <text className="font-medium" fill="#777586" fontSize="11" textAnchor="middle" x="340" y="215">Week 3 (83%)</text>
                <text className="font-medium" fill="#777586" fontSize="11" textAnchor="middle" x="470" y="215">Week 4 (80%)</text>
                <text className="font-medium" fill="#777586" fontSize="11" textAnchor="middle" x="600" y="215">Week 5 (86%)</text>
                <text className="font-bold" fill="#131b2e" fontSize="11" textAnchor="middle" x="720" y="215">Week 6 (Current)</text>
              </svg>

              {/* Interactive Tooltip Card pinned near Week 6 */}
              <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 sm:right-6 sm:top-2 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-xl shadow-lg pointer-events-none flex flex-col gap-0.5 z-20">
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm font-semibold text-secondary-fixed">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                  <span>Week 6 Current Mastery</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-headline-sm text-headline-sm font-bold text-inverse-on-surface">88.5%</span>
                  <span className="text-tertiary-fixed font-label-sm text-label-sm font-semibold">+2.5% jump</span>
                </div>
                <p className="font-body-sm text-body-sm text-inverse-on-surface/80">From CS301 Quiz &amp; OS Deadlock lab submission</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Two-Column Workspace Layout below chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          
          {/* LEFT COLUMN: Wider (8 cols on xl, 7 on lg) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-space-lg min-w-0">
            
            {/* Subject Progress Module */}
            <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Semester Core Subjects</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Continuous tracking across active syllabus modules and next topics.</p>
                </div>
                <a className="font-label-md text-label-md text-primary font-semibold hover:underline inline-flex items-center gap-1" href="#subjects-weak-topics">
                  <span>All Subjects</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </a>
              </div>

              <div className="space-y-space-sm">
                {/* Subject 1: DSA */}
                <div className="p-space-md rounded-xl bg-surface hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-md group">
                  <div className="flex items-center gap-space-md min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[22px]">account_tree</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">Data Structures &amp; Algorithms</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-mono">CS201</span>
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">Mastered / High</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">
                        Next milestone: <span className="font-medium text-on-surface">Graph Algorithms (Dijkstra &amp; Prim's)</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-md shrink-0 sm:self-center">
                    <div className="w-32 flex flex-col gap-1 text-right">
                      <span className="font-label-sm text-label-sm font-bold text-on-surface">86%</span>
                      <div className="w-full h-1.5 rounded-full bg-surface-container">
                        <div className="h-1.5 rounded-full bg-tertiary-container" style={{ width: '86%' }}></div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer" title="Continue subject">
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Subject 2: DBMS */}
                <div className="p-space-md rounded-xl bg-surface hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-md group">
                  <div className="flex items-center gap-space-md min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary shrink-0">
                      <span className="material-symbols-outlined text-[22px]">database</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">Database Management Systems</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-mono">CS304</span>
                        <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">Needs Attention</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">
                        Next milestone: <span className="font-medium text-on-surface">B+ Trees &amp; Query Optimization</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-md shrink-0 sm:self-center">
                    <div className="w-32 flex flex-col gap-1 text-right">
                      <span className="font-label-sm text-label-sm font-bold text-on-surface">68%</span>
                      <div className="w-full h-1.5 rounded-full bg-surface-container">
                        <div className="h-1.5 rounded-full bg-error" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer" title="Continue subject">
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Subject 3: Operating Systems */}
                <div className="p-space-md rounded-xl bg-surface hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-md group">
                  <div className="flex items-center gap-space-md min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[22px]">memory</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">Operating Systems</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-mono">CS301</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">On Track</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">
                        Next milestone: <span className="font-medium text-on-surface">Virtual Memory &amp; Demand Paging</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-md shrink-0 sm:self-center">
                    <div className="w-32 flex flex-col gap-1 text-right">
                      <span className="font-label-sm text-label-sm font-bold text-on-surface">79%</span>
                      <div className="w-full h-1.5 rounded-full bg-surface-container">
                        <div className="h-1.5 rounded-full bg-secondary" style={{ width: '79%' }}></div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer" title="Continue subject">
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Subject 4: Computer Networks */}
                <div className="p-space-md rounded-xl bg-surface hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-md group">
                  <div className="flex items-center gap-space-md min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-tertiary shrink-0">
                      <span className="material-symbols-outlined text-[22px]">hub</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">Computer Networks</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-mono">CS302</span>
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">Exceeding</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">
                        Next milestone: <span className="font-medium text-on-surface">TCP Congestion Control Algorithms</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-md shrink-0 sm:self-center">
                    <div className="w-32 flex flex-col gap-1 text-right">
                      <span className="font-label-sm text-label-sm font-bold text-on-surface">92%</span>
                      <div className="w-full h-1.5 rounded-full bg-surface-container">
                        <div className="h-1.5 rounded-full bg-tertiary-container" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer" title="Continue subject">
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Subject 5: Web Dev */}
                <div className="p-space-md rounded-xl bg-surface hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-md group">
                  <div className="flex items-center gap-space-md min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                      <span className="material-symbols-outlined text-[22px]">web</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">Web Development &amp; Full-Stack</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-mono">CS310</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">On Track</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">
                        Next milestone: <span className="font-medium text-on-surface">Event-Driven Architecture &amp; Microservices</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-md shrink-0 sm:self-center">
                    <div className="w-32 flex flex-col gap-1 text-right">
                      <span className="font-label-sm text-label-sm font-bold text-on-surface">88%</span>
                      <div className="w-full h-1.5 rounded-full bg-surface-container">
                        <div className="h-1.5 rounded-full bg-primary-container" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer" title="Continue subject">
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Identified Weak Topics Section */}
            <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-[22px]">crisis_alert</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Identified Weak Topics</h2>
                </div>
                <a className="font-label-md text-label-md text-primary font-semibold hover:underline inline-flex items-center gap-1" href="#subjects-weak-topics">
                  <span>View All Topics</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {/* Weak Topic 1 */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between space-y-space-md">
                  <div className="space-y-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                        Needs Practice
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">DSA</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Dynamic Programming</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Struggling with 2D Memoization tables. 3 interactive drills pending.
                    </p>
                  </div>
                  <button className="w-full py-2 px-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface text-primary font-label-md text-label-md font-semibold shadow-sm transition-colors text-center cursor-pointer">
                    Practice Now
                  </button>
                </div>

                {/* Weak Topic 2 */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between space-y-space-md">
                  <div className="space-y-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
                        Improving
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">DBMS</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Normalization (BCNF)</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      +14% score increase in the last diagnostic drill session.
                    </p>
                  </div>
                  <button className="w-full py-2 px-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface text-secondary font-label-md text-label-md font-semibold shadow-sm transition-colors text-center cursor-pointer">
                    Review Notes
                  </button>
                </div>

                {/* Weak Topic 3 */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between space-y-space-md">
                  <div className="space-y-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                        Needs Review
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">OS</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Process Deadlocks</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Mid-term exam topic scheduled in 5 days. Core Banker's concept.
                    </p>
                  </div>
                  <button className="w-full py-2 px-space-sm rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md font-semibold shadow-sm transition-colors text-center cursor-pointer">
                    Ask AI Tutor
                  </button>
                </div>
              </div>
            </section>

            {/* Recent Activity Section */}
            <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Recent Learning Telemetry</h2>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Syncing live</span>
              </div>
              <div className="space-y-space-sm">
                {/* Activity 1 */}
                <div className="flex items-start gap-space-md p-space-sm rounded-xl hover:bg-surface transition-colors">
                  <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-space-sm flex-wrap">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                        Completed Quiz: Computer Networks - OSI &amp; TCP/IP Stack
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-space-sm text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                      <span className="text-tertiary-container font-semibold">Score: 95%</span>
                      <span>•</span>
                      <span>30 MCQs completed in 22 mins</span>
                    </div>
                  </div>
                </div>

                {/* Activity 2 */}
                <div className="flex items-start gap-space-md p-space-sm rounded-xl hover:bg-surface transition-colors">
                  <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-space-sm flex-wrap">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                        AI Socratic Session: Solved Banker's Algorithm loan allocation proofs
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Yesterday</span>
                    </div>
                    <div className="flex items-center gap-space-sm text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                      <span className="text-secondary font-semibold">45 min session</span>
                      <span>•</span>
                      <span>Concept Mastery increased from 52% to 74%</span>
                    </div>
                  </div>
                </div>

                {/* Activity 3 */}
                <div className="flex items-start gap-space-md p-space-sm rounded-xl hover:bg-surface transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-space-sm flex-wrap">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                        Completed Topic: Binary Search Tree Balancing &amp; Rotations
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Yesterday</span>
                    </div>
                    <div className="flex items-center gap-space-sm text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                      <span className="text-primary font-semibold">Verified</span>
                      <span>•</span>
                      <span>Code test passed on all edge cases</span>
                    </div>
                  </div>
                </div>

                {/* Activity 4 */}
                <div className="flex items-start gap-space-md p-space-sm rounded-xl hover:bg-surface transition-colors">
                  <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-space-sm flex-wrap">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                        Submitted Lab Assignment: PostgreSQL Indexing Benchmark
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">2 days ago</span>
                    </div>
                    <div className="flex items-center gap-space-sm text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                      <span className="text-tertiary-container font-semibold">Grade: A+</span>
                      <span>•</span>
                      <span>Evaluated by Prof. Srinivasan</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Focused Widgets (4 cols on xl, 5 on lg) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-space-lg">
            
            {/* Today's Study Plan Widget */}
            <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Today's Study Plan</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Prioritized by deadlines and knowledge gap.</p>
                </div>
                <a className="font-label-md text-label-md text-primary font-semibold hover:underline inline-flex items-center" href="#my-study-plans">
                  <span>All Plans</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </a>
              </div>

              <div className="space-y-space-sm">
                {tasks.map((task) => (
                  <label
                    key={task.id}
                    className={`flex items-start gap-space-sm p-space-sm rounded-xl transition-colors cursor-pointer select-none ${
                      task.completed
                        ? 'bg-surface-container-low opacity-75'
                        : 'bg-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mt-1 w-4 h-4 rounded text-primary-container focus:ring-primary-container accent-primary-container cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`font-label-lg text-label-lg text-on-surface font-semibold truncate ${
                            task.completed ? 'line-through text-on-surface-variant' : ''
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded font-label-sm text-label-sm font-semibold shrink-0 ${task.priorityClass}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className={`font-body-sm text-body-sm text-on-surface-variant ${task.completed ? 'line-through' : ''}`}>
                        {task.subtitle}
                      </p>
                      <div
                        className={`flex items-center gap-1 mt-1 font-label-sm text-label-sm ${
                          task.completed ? 'text-tertiary font-semibold' : 'text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {task.completed ? 'check_circle' : 'timer'}
                        </span>
                        <span>{task.duration}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-space-xs flex items-center justify-between border-t-0 font-body-sm text-body-sm text-on-surface-variant">
                <span>{completedCount} of {tasks.length} completed today</span>
                <span className="font-semibold text-primary">~1h 40m total study</span>
              </div>
            </section>

            {/* Recommended Career Pathway AI Card */}
            <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                  <span>AI Career Recommendation</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                  92% Fit
                </span>
              </div>

              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Cloud &amp; Distributed Systems Engineer
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Architect resilient microservices, distributed data stores, and ultra-low latency infrastructure.
                </p>
              </div>

              {/* Why Recommended Section */}
              <div className="p-space-md rounded-xl bg-surface-container-low space-y-space-xs">
                <span className="font-label-sm text-label-sm text-primary font-semibold uppercase tracking-wider">
                  Why This Fits You
                </span>
                <p className="font-body-sm text-body-sm text-on-surface">
                  "Your high scores in <strong>Computer Networks (92%)</strong> and <strong>Operating Systems (79%)</strong> pair exceptionally well with distributed systems engineering roles."
                </p>
              </div>

              {/* Skills Chips */}
              <div className="space-y-1.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Key Relevant Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                    Distributed Systems
                  </span>
                  <span className="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                    PostgreSQL Internals
                  </span>
                  <span className="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                    Go / Java
                  </span>
                  <span className="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                    Kubernetes
                  </span>
                  <span className="px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                    Linux OS
                  </span>
                </div>
              </div>

              {/* Subtitle / Disclaimer */}
              <p className="font-body-sm text-body-sm text-on-surface-variant/80 italic text-[11px] leading-tight">
                Personalized recommendation based on your academic profile, coding commits, and coursework telemetry. Not a guaranteed outcome.
              </p>

              <a
                className="w-full inline-flex items-center justify-center gap-space-xs py-2.5 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold transition-all cursor-pointer"
                href="#career-guidance"
              >
                <span>Explore Career Roadmap</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </section>

            {/* Quick AI Prompt Widget / Help Card */}
            <div className="p-space-lg rounded-2xl bg-primary-container text-on-primary space-y-space-sm relative overflow-hidden shadow-sm">
              <div className="relative z-10 space-y-space-xs">
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-primary-container font-semibold">
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                  <span>EduMitra Mentor Engine</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm font-semibold">Stuck on a tricky problem?</h4>
                <p className="font-body-sm text-body-sm text-on-primary-container">
                  Upload lecture slides, paste pseudocode, or request a Socratic deep-dive into any concept.
                </p>
                <div className="pt-2">
                  <a
                    className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md font-semibold hover:bg-surface-bright transition-all shadow-sm"
                    href="#ai-study-assistant"
                  >
                    <span>Start Socratic Drill</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </a>
                </div>
              </div>
              {/* Decorative circle */}
              <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none"></div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default OverviewPage;
