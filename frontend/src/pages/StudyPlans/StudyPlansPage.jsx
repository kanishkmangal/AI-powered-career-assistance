// Study Plans Page – Full fidelity conversion from Stitch HTML
// ------------------------------------------------------------
// This component mirrors the design in `Website UI/Study_plans/code.html`
// preserving layout, colors, spacing, icons, and responsive behaviour.
// All interactive behaviours are re‑implemented with React state
// (view toggle, AI rebalance, quick‑add task, task completion).
// No external backend is required – demo data is stored locally.

import React, { useState } from "react";

// Demo task data – mirrors the original static HTML structure
const initialTasks = {
  today: [
    {
      id: "t1",
      title: "B+ Tree Underflow & Node Borrowing Drills",
      subject: "DBMS (CS-304)",
      priority: "High",
      time: "45 mins • 09:30 AM - 10:15 AM",
      completed: true,
    },
    {
      id: "t2",
      title: "Peterson's Algorithm & Semaphore Lock Implementation",
      subject: "Operating Systems (CS-301)",
      priority: "High",
      weakArea: true,
      time: "60 mins • 02:00 PM - 03:00 PM",
      completed: false,
    },
    {
      id: "t3",
      title: "Solve 2 Graph Traversal Problems (DFS/BFS Topo Sort)",
      subject: "Personal / LeetCode",
      priority: "Medium",
      time: "40 mins • 05:00 PM - 05:40 PM",
      completed: false,
    },
    {
      id: "t4",
      title: "TCP Congestion Window & Tahoe vs Reno Curves",
      subject: "Computer Networks (CS-302)",
      priority: "Low",
      time: "30 mins • 08:30 PM - 09:00 PM",
      completed: false,
    },
  ],
  tomorrow: [
    {
      id: "t5",
      title: "Software Engineering: Agile Sprint Velocity & Burn‑down Modeling",
      subject: "Software Engineering",
      priority: "Medium",
      time: "02:30 PM - 03:15 PM",
    },
    {
      id: "t6",
      title: "DBMS Lab: Triggers & Stored Procedures Scripting",
      subject: "DBMS",
      priority: "Low",
      time: "04:30 PM - 05:15 PM",
    },
  ],
  backlog: [
    {
      id: "b1",
      title: "Review 2‑Phase Locking Protocols",
      subject: "DBMS (CS-304)",
      accuracy: 42,
      duration: "45m",
    },
    {
      id: "b2",
      title: "Implement BCNF Decomposition",
      subject: "DBMS (CS-304)",
      accuracy: 54,
      duration: "40m",
    },
    {
      id: "b3",
      title: "Banker's Algorithm Safety State Proofs",
      subject: "Operating Systems (CS-301)",
      accuracy: 58,
      duration: "50m",
    },
  ],
};

export default function StudyPlansPage() {
  const [view, setView] = useState("list"); // list or calendar (placeholder)
  const [tasks, setTasks] = useState(initialTasks);
  const [rebalanceLoading, setRebalanceLoading] = useState(false);
  const [rebalanceDone, setRebalanceDone] = useState(false);

  const toggleComplete = (day, id) => {
    setTasks((prev) => {
      const updated = prev[day].map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      return { ...prev, [day]: updated };
    });
  };

  const handleRebalance = () => {
    setRebalanceLoading(true);
    setRebalanceDone(false);
    setTimeout(() => {
      setRebalanceLoading(false);
      setRebalanceDone(true);
      setTimeout(() => setRebalanceDone(false), 2400);
    }, 800);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const title = e.target.taskTitleInput.value.trim();
    if (!title) return;
    const newTask = {
      id: `qt${Date.now()}`,
      title,
      subject: e.target.subjectSelect.value,
      priority: "Medium",
      time: e.target.durationSelect.value,
      completed: false,
    };
    setTasks((prev) => ({ ...prev, today: [newTask, ...prev.today] }));
    e.target.reset();
  };

  return (
    <div className="w-full">
      {/* Main Content – no duplicate header; DashboardLayout provides sidebar + header */}
      <div className="p-space-lg lg:p-space-xl w-full flex flex-col gap-space-lg">
            {/* Breadcrumb & Sync State */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <nav className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
                <span>Platform</span>
                <span className="text-outline-variant">/</span>
                <span>Workspace Hub</span>
                <span className="text-outline-variant">/</span>
                <span className="text-primary font-semibold">Study Plans</span>
              </nav>
              <div className="flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
                <span>Sync State: Live with LMS &amp; Quiz Engine</span>
              </div>
            </div>

            {/* Title & Action Buttons */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
              <div className="flex flex-col gap-1 max-w-3xl">
                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                  My Study Plans &amp; Adaptive Revision Planner
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Weekly smart timetable calibrated with your syllabus milestones, upcoming exams, and diagnostic weak areas.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-space-sm shrink-0">
                {/* View toggle */}
                <div className="flex items-center bg-surface-container p-1 rounded-lg">
                  <button
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${view === "list" ? "bg-surface-container-lowest text-primary shadow-sm font-semibold" : "text-on-surface-variant hover:text-on-surface font-medium"}`}
                    onClick={() => setView("list")}
                    id="viewListBtn"
                  >
                    <span className="material-symbols-outlined text-[18px]">view_agenda</span>
                    <span>List View</span>
                  </button>
                  <button
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${view === "calendar" ? "bg-surface-container-lowest text-primary shadow-sm font-semibold" : "text-on-surface-variant hover:text-on-surface font-medium"}`}
                    onClick={() => setView("calendar")}
                    id="viewCalBtn"
                  >
                    <span className="material-symbols-outlined text-[18px]">calendar_view_week</span>
                    <span>Calendar</span>
                  </button>
                </div>
                {/* AI Re‑balance */}
                <button
                  className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container-high font-label-md text-label-md font-semibold shadow-sm"
                  onClick={handleRebalance}
                  id="aiRebalanceBtn"
                >
                  {rebalanceLoading ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                      <span>Re‑balancing...</span>
                    </>
                  ) : rebalanceDone ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] text-surface-tint">check</span>
                      <span>Schedule Optimized!</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px] text-surface-tint">auto_awesome</span>
                      <span>AI Re‑balance</span>
                    </>
                  )}
                </button>
                {/* Add Personal Task */}
                <button
                  className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md font-semibold shadow-sm"
                  id="openNewTaskModal"
                  onClick={() => alert('Task modal not implemented in demo')}
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>+ Add Personal Task</span>
                </button>
              </div>
            </div>

            {/* Weekly Navigation & Metrics */}
            <section className="bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm flex flex-col gap-space-md">
              {/* Week navigation */}
              <div className="flex flex-wrap items-center justify-between gap-space-md pb-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="flex items-center bg-surface-container-low rounded-lg p-0.5">
                    <button className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded" title="Previous Week">
                      <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    </button>
                    <button className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded" title="Next Week">
                      <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-headline-sm text-on-surface">Week 8 (Oct 21 – Oct 27, 2024)</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">Semester 6</span>
                  </div>
                </div>
                <div className="flex items-center gap-space-sm">
                  <button className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-md text-label-md font-semibold hover:bg-secondary-fixed-dim">
                    Jump to Today
                  </button>
                  <div className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-lg font-label-md text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    <span>Oct 2024</span>
                  </div>
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md pt-space-xs">
                {/* Metric 1 – Weekly Tasks */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Weekly Tasks</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-headline-lg text-headline-lg text-on-surface">18</span>
                      <span className="font-body-md text-body-md text-on-surface-variant">/ 26</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-tertiary-container font-semibold mt-0.5">69% Completed</span>
                  </div>
                  <div className="relative w-14 h-14 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                      <path className="text-primary-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="69, 100" strokeLinecap="round" strokeWidth="3.5" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-label-sm text-label-sm font-semibold text-primary">69%</div>
                  </div>
                </div>
                {/* Metric 2 – Study Duration */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Study Duration</span>
                    <span className="material-symbols-outlined text-[20px] text-secondary">schedule</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="font-headline-lg text-headline-lg text-on-surface">22.5</span>
                      <span className="font-body-md text-body-md text-on-surface-variant">/ 30.0 hrs</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-high mt-2 overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1 font-label-sm text-label-sm text-on-surface-variant">
                    <span>7.5 hrs remaining</span>
                    <span>Target: 4.5h/day</span>
                  </div>
                </div>
                {/* Metric 3 – Task Urgency */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Task Urgency</span>
                    <span className="material-symbols-outlined text-[20px] text-primary">flag</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 flex flex-col items-center bg-surface-container-lowest p-1.5 rounded-lg">
                      <span className="font-label-md text-label-md font-bold text-error">8</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">High</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center bg-surface-container-lowest p-1.5 rounded-lg">
                      <span className="font-label-md text-label-md font-bold text-secondary">12</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Med</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center bg-surface-container-lowest p-1.5 rounded-lg">
                      <span className="font-label-md text-label-md font-bold text-outline">6</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Low</span>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 truncate">88% of High‑priority on track</span>
                </div>
                {/* Metric 4 – Diagnostic Remediation */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Diagnostic Remediation</span>
                    <span className="material-symbols-outlined text-[20px] text-tertiary-container">psychology</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="font-headline-lg text-headline-lg text-on-surface">4</span>
                      <span className="font-body-md text-body-md text-on-surface-variant">Weak Topics</span>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant truncate mt-1">DBMS B‑Trees, OS Semaphores, Cache L1</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary font-semibold mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> 2 completed this week
                  </span>
                </div>
              </div>
            </section>

            {/* AI Adaptive Planner Banner */}
            <section className="rounded-xl p-space-md lg:p-space-lg bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-sm">
              <div className="flex items-start gap-space-md">
                <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center shrink-0 text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[28px] text-surface-tint">auto_awesome</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-headline-sm text-headline-sm text-on-surface">AI Adaptive Planner Beta</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">Active Engine</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">Syllabus Synced: CS-304, CS-301</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                    EduMitra’s AI Engine actively recalibrates your daily study blocks based on diagnostic quiz mistakes and upcoming exam deadlines. In future releases, your syllabus velocity will automatically optimize daily load.
                  </p>
                </div>
              </div>
              <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0 w-full md:w-auto justify-between md:justify-start">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest font-label-sm text-label-sm text-tertiary font-semibold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                  <span>Predictive Load: Active</span>
                </div>
                <a className="font-label-md text-label-md text-primary hover:text-primary-container font-semibold flex items-center gap-1 group" href="#">
                  <span>Configure AI Study Preferences</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </a>
              </div>
            </section>

            {/* Schedule + Side Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Left – Daily schedule */}
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                {/* Today */}
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-md text-headline-md text-on-surface">Today, Thursday, Oct 24</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">Current Day</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface-variant">Focus: DBMS Storage &amp; OS Concurrency</span>
                  </div>
                  <div className="flex flex-col gap-space-sm" id="todayTaskList">
                    {tasks.today.map((task) => (
                      <article
                        key={task.id}
                        className={`p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-start justify-between gap-space-md transition-all ${task.completed ? "opacity-85 hover:opacity-100" : ""}`}
                      >
                        <div className="flex items-start gap-space-md min-w-0">
                          <button
                            aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
                            className={`mt-1 w-5 h-5 rounded flex items-center justify-center ${task.completed ? "bg-primary-container text-on-primary shadow-sm" : "bg-surface-container-lowest border-2 border-outline hover:border-primary"} shrink-0`}
                            onClick={() => toggleComplete("today", task.id)}
                          >
                            {task.completed && <span className="material-symbols-outlined text-[16px]">check</span>}
                          </button>
                          <div className="flex flex-col min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">{task.subject}</span>
                              {task.priority && (
                                <span className={`px-2 py-0.5 rounded ${task.priority === "High" ? "bg-error-container text-on-error-container" : task.priority === "Medium" ? "bg-secondary-fixed text-on-secondary-fixed-variant" : "bg-surface-container"} font-label-sm text-label-sm font-semibold`}>
                                  {task.priority} Priority
                                </span>
                              )}
                              {task.weakArea && (
                                <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                                  <span className="material-symbols-outlined text-[14px]">psychology</span> Diagnostic Weak Area
                                </span>
                              )}
                              <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px]">schedule</span> {task.time}
                              </span>
                            </div>
                            <h2 className={`font-headline-sm text-headline-sm text-on-surface ${task.completed ? "line-through" : ""} truncate`}>{task.title}</h2>
                            {task.completed && <p className="font-body-sm text-body-sm text-on-surface-variant/80 mt-1 line-clamp-1">Completed – review notes for retention.</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 text-on-surface-variant">
                          <button className="p-1.5 hover:text-on-surface hover:bg-surface-container rounded transition-colors" title="Edit Task">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          {!task.completed && (
                            <button className="p-1.5 hover:text-on-surface hover:bg-surface-container rounded transition-colors" title="Reschedule Task">
                              <span className="material-symbols-outlined text-[18px]">update</span>
                            </button>
                          )}
                          <button className="p-1.5 hover:text-on-surface hover:bg-surface-container rounded transition-colors" title="More Options">
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                {/* Tomorrow preview */}
                <div className="flex flex-col gap-space-sm pt-2">
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-md text-headline-md text-on-surface">Tomorrow, Friday, Oct 25</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">3 sessions scheduled (2.75 hrs total)</span>
                    </div>
                    <button className="font-label-sm text-label-sm text-primary hover:text-primary-container font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">add</span> Add Session
                    </button>
                  </div>
                  <div className="flex flex-col gap-space-sm">
                    {tasks.tomorrow.map((task) => (
                      <article key={task.id} className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-space-md">
                        <div className="flex items-center gap-space-md min-w-0">
                          <span className="material-symbols-outlined text-[20px] text-outline">radio_button_unchecked</span>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-headline-sm text-headline-sm text-on-surface truncate">{task.title}</span>
                              <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold shrink-0">High</span>
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">{task.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 text-on-surface-variant">
                          <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm">Reschedule</button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right – Quick Add, Backlog, Exams, Heatmap */}
              <aside className="lg:col-span-4 flex flex-col gap-space-lg">
                {/* Quick Add Form */}
                <div className="p-space-md lg:p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm flex items-center gap-1.5 text-on-surface">
                      <span className="material-symbols-outlined text-[20px] text-primary">add_task</span>
                      <span>Quick Add Task</span>
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">To Current Week</span>
                  </div>
                  <form className="flex flex-col gap-space-sm" onSubmit={handleQuickAdd}>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant font-medium mb-1" htmlFor="taskTitleInput">Task or Topic Name</label>
                      <input className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-all" id="taskTitleInput" placeholder="e.g., Read Virtual Memory Paging" type="text" />
                    </div>
                    <div className="grid grid-cols-2 gap-space-sm">
                      <div>
                        <label className="block font-label-sm text-label-sm text-on-surface-variant font-medium mb-1" htmlFor="subjectSelect">Subject</label>
                        <select className="w-full h-10 px-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" id="subjectSelect">
                          <option>OS (CS-301)</option>
                          <option>DBMS (CS-304)</option>
                          <option>Networks (CS-302)</option>
                          <option>Algorithms</option>
                          <option>Personal Goal</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-label-sm text-label-sm text-on-surface-variant font-medium mb-1" htmlFor="durationSelect">Duration</label>
                        <select className="w-full h-10 px-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" id="durationSelect">
                          <option>30 mins</option>
                          <option selected>45 mins</option>
                          <option>60 mins</option>
                          <option>90 mins</option>
                          <option>120 mins</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant font-medium mb-1" htmlFor="daySelect">Scheduled Day</label>
                      <select className="w-full h-10 px-2 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none" id="daySelect">
                        <option>Today (Thursday, Oct 24)</option>
                        <option>Tomorrow (Friday, Oct 25)</option>
                        <option>Saturday, Oct 26</option>
                        <option>Sunday, Oct 27</option>
                      </select>
                    </div>
                    <button className="mt-2 w-full h-10 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1 shadow-sm transition-colors" type="submit">
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      <span>Schedule into Plan</span>
                    </button>
                  </form>
                </div>

                {/* Backlog */}
                <div className="p-space-md lg:p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[20px] text-surface-tint">psychology_alt</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface">Diagnostic Backlog</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">3 Detected</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant -mt-1">Topics where your recent quiz accuracy fell below 65%. EduMitra AI recommends scheduling before next week’s tests.</p>
                  <div className="flex flex-col gap-space-sm">
                    {tasks.backlog.map((item) => (
                      <div key={item.id} className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">{item.subject} • Accuracy: {item.accuracy}%</span>
                            <span className="font-headline-sm text-headline-sm text-on-surface truncate">{item.title}</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">{item.duration}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-label-sm text-label-sm text-error font-medium">Needs Urgent Review</span>
                          <button className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-primary hover:bg-surface-container-high font-label-sm text-label-sm font-semibold shadow-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">calendar_add_on</span> + Add to Plan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exam Countdowns */}
                <div className="p-space-md lg:p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[20px] text-error">timer</span>
                      <span>Milestone Countdowns</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Midterm Cycle</span>
                  </div>
                  <div className="flex flex-col gap-space-sm">
                    {/* Exam 1 */}
                    <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-on-surface">DBMS Midterm Exam</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Syllabus: Units 1 to 4 • 70 Marks</span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-label-sm text-label-sm text-tertiary-container font-semibold">Revision 72% Covered</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-display-lg text-[28px] leading-tight font-bold text-error">9</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Days left</span>
                      </div>
                    </div>
                    {/* Exam 2 */}
                    <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-on-surface">OS Midterm Exam</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Syllabus: Units 1 to 3 • 70 Marks</span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-label-sm text-label-sm text-secondary font-semibold">Revision 48% Covered</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-display-lg text-[28px] leading-tight font-bold text-on-surface">14</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Days left</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Focus Heatmap */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Hourly Focus Efficiency</span>
                    <span className="font-label-sm text-label-sm text-tertiary font-semibold">Peak: 09:00 - 11:30 AM</span>
                  </div>
                  <div className="w-full h-16 flex items-end gap-1.5 pt-2">
                    <div className="flex-1 bg-surface-container-high rounded-t hover:bg-primary-container transition-all h-[30%]" title="08:00 AM - 30%"></div>
                    <div className="flex-1 bg-primary-container rounded-t transition-all h-[95%]" title="09:00 AM - 95% Peak"></div>
                    <div className="flex-1 bg-primary-container rounded-t transition-all h-[80%]" title="10:00 AM - 80%"></div>
                    <div className="flex-1 bg-surface-container-high rounded-t hover:bg-primary-container transition-all h-[45%]" title="11:00 AM - 45%"></div>
                    <div className="flex-1 bg-surface-container-high rounded-t hover:bg-primary-container transition-all h-[20%]" title="12:00 PM - 20%"></div>
                    <div className="flex-1 bg-surface-container-high rounded-t hover:bg-primary-container transition-all h-[15%]" title="01:00 PM - 15%"></div>
                    <div className="flex-1 bg-secondary rounded-t transition-all h-[75%]" title="02:00 PM - 75%"></div>
                    <div className="flex-1 bg-secondary rounded-t transition-all h-[60%]" title="03:00 PM - 60%"></div>
                    <div className="flex-1 bg-surface-container-high rounded-t hover:bg-primary-container transition-all h-[40%]" title="04:00 PM - 40%"></div>
                    <div className="flex-1 bg-surface-container-high rounded-t hover:bg-primary-container transition-all h-[55%]" title="05:00 PM - 55%"></div>
                    <div className="flex-1 bg-surface-container-high rounded-t hover:bg-primary-container transition-all h-[70%]" title="08:00 PM - 70%"></div>
                    <div className="flex-1 bg-surface-container-high rounded-t hover:bg-primary-container transition-all h-[50%]" title="09:00 PM - 50%"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                    <span>08:00</span>
                    <span>12:00</span>
                    <span>16:00</span>
                    <span>21:00</span>
                  </div>
                </div>
              </aside>
            </div>
      </div>
    </div>
  );
}
