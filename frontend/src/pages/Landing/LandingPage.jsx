import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SUBJECT_DATA = {
  dbms: {
    name: 'DBMS & Cloud DBs',
    mastery: '87%',
    pct: 87,
    indexScore: '8.7',
    subtitle: 'Unit 1-4 validated. Unit 5 (Distributed Transactions) scheduled for tomorrow.',
    predicted: 'A+ (9.1 SGPA)',
    lab: '5/5 Verified',
    gaps: [
      { label: 'Critical Priority', title: 'Two-Phase Locking (2PL)', desc: '12 Marks in Last 4 Exam Papers', color: 'text-primary', btn: true },
      { label: 'Moderate Gap', title: 'B-Tree vs Hash Indexing', desc: '8 Marks expected in Mid-Term 2', color: 'text-secondary', btn: true },
      { label: 'Resolved Yesterday', title: 'Boyce-Codd Normal Form (BCNF)', desc: 'Mastery index updated to 94%', color: 'text-emerald-700', resolved: true }
    ]
  },
  os: {
    name: 'Operating Systems',
    mastery: '74%',
    pct: 74,
    indexScore: '7.4',
    subtitle: 'Memory management & Virtualization pending revision. Semaphores covered.',
    predicted: 'A (8.3 SGPA)',
    lab: '4/5 Verified',
    gaps: [
      { label: 'High Priority', title: "Banker's Algorithm & Deadlock Avoidance", desc: '10 Marks recurring university PYQ', color: 'text-primary', btn: true },
      { label: 'Moderate Gap', title: 'TLB Miss Handling & Inverted Page Tables', desc: 'Lab assignment due this Friday', color: 'text-secondary', btn: true },
      { label: 'Resolved', title: 'CPU Scheduling (Round Robin & Multi-Level)', desc: 'Mastery verified at 91%', color: 'text-emerald-700', resolved: true }
    ]
  },
  ml: {
    name: 'Machine Learning',
    mastery: '93%',
    pct: 93,
    indexScore: '9.3',
    subtitle: 'Backpropagation derivation and CNN architectures fully mastered.',
    predicted: 'O (10.0 SGPA)',
    lab: '6/6 Verified',
    gaps: [
      { label: 'Target Enrichment', title: 'Self-Attention & Transformer Encoders', desc: 'Recommended for Tier-1 AI/ML roles', color: 'text-primary', btn: true },
      { label: 'Resolved', title: 'Gradient Descent Optimizers (Adam, RMSProp)', desc: 'Scored 100% on unit quiz', color: 'text-emerald-700', resolved: true },
      { label: 'Resolved', title: 'Bias-Variance Tradeoff Analysis', desc: 'Concept mastery solid', color: 'text-emerald-700', resolved: true }
    ]
  }
};

const LOGO_URL = "/assets/LOGO.jpg";

const AVATAR_1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuB7Utyk0hGZkj4fbuj4MV8fxKyNZOW4ykp8SVpB8nj5Mgaa34tk8Ejj1FbxSK7ICZ9j9sc_QzTuRUlPyATIR_tOvGyo0nJtxrXmW0dLL_JvKojTQ15A35hRafkr4nRedOITxjG6sQb8c4i5xIJsB2k7xyXPhi9haPeSI0_8EImDXtbPzIWqYgzbD5tdO7PVr6YanmYzBNqoi5NZTC6IXKn1PbbQF40vmPxGjWwv1xb5avuq0qr9V0ZM";
const AVATAR_2 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCG6sAgqUJhyy2a1-Anmw7f0-1nyxBmFJK-6kUFvNbxyOZmnTiioVlvke2SQaJN-sLfNlZRHg6u7YpxiqUQtmq7P1VBThzE9bgJMyGKOnrErYDM5lcPbAlf5e3B_besNdCdncqKxEoXUbmAwMvA0IDL4u6J79YIxe2msR_IiKH4kZ8Ko5aXf77QyAcheoU2TbT4A7jzApIsLauVdfRG6gN8XugU7fgH7L4IaiHXF_7RQMn2STN7OVs9";
const AVATAR_3 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCPpuUZAK7euQKsJqYC_Ne2L1e51XqNfGy9zKqqGJTYUURtamwU7pjiM81jBowJ65ChueRqOTDC1hqo-7DMQrudY43cuybm82AjN4I0ZJgDwY04nYDeJ6AwijAn6mAExvTufq-5RYyoxLiVxyJWU6Va4_19gJdu5i796Xt8R8t76zqRIgR8hlURgOj9VQMpX1mLJ9S_GUzSyvqxDrM6XP_FfBfacHJYfQbbkhq7tyxV-0b7H2pAAsRS";
const AVATAR_4 = "https://lh3.googleusercontent.com/aida-public/AB6AXuBQlPy_FyIGmVkcRGtNijNN-v-W6T55HTfkNl9cW5gYYbmVR2cGeeAtglkdJQ3thl-mAONw1mCMHz2rz3AhK3YiKYNWwh2dWN9zBBAxCAdglKlN7mfUyAVZSnHjMsug_wa-fZF5aDVP_KtrsEX6JZO9DGuBEcsDmMBaCuU78x8XzXMj7uZnQPEFhEt3bUIeYII9pa3u-xkv9lWXZw0z7dMulP3tT7l8Ko3zcWg2ObYdXZfnK2OcDWOt";

const TESTIMONIAL_1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuC7y17p-X_MkrNQKxKIP6ZC3VSMao4y6CTRedpF9KbzNXSwSBFe6UwEjW4n6fCHBaMZWcDxaz2aLT2o2BgQpsaA5A-9IkmaTxFa1cftsKPyxm4mXSeE4oyKzqxBGN92xKazaIyjr2ukdDNGXMblqT8zMESLWlcmK_Yzw3cSI6NI1rKdxiVy22xlg9l0k_MuerySGXdoAkGhODPD8ZS_cYBhQGdLAZ0NQQBJf3Z716cjK00G4i8Opzrl";
const TESTIMONIAL_2 = "https://lh3.googleusercontent.com/aida-public/AB6AXuBgnz1J2hQjXeFRjSh3ngr52QK1xV6PcJoIa-VEBCTi7n4_VJueeNxli4YVhOpi_SaT9okIO9Ajtk8E_nqGDuErM8RtOB0Re54lNRIgtah8JIDPvuDoTkbdOUz3kMSWDpz-YIF4_954sgPoEHeu5OoKoRqhYwA09S-wmggQXQnY1KNSz17YG6Vz9lY7u9CXrKZTOgEX3TQyF2rF2dsEAnWNNDAO2QT-W1fiLqsQN80J4emYIg-mi27n";
const TESTIMONIAL_3 = "https://lh3.googleusercontent.com/aida-public/AB6AXuDO8naASXVGZWz_LAYOrdGjTwxkRuvUYsZlS0NA-Ybr4lpTIWyXyj5z8zjajHYdb72g8EyxTyJmCU6neOnfReU6DEjic_rVjkopA2YQxPBF40rrMTHn3GX2m9Vf3w5f5Z5V8EEIijgtLPSrzLwqdYQB27Ut9yTPN2ZrGatCPtUZwUXSc2eXZp_cPRb8JhXs-HicpC8o226J-eBF127n3PfKxcW81rP0-91dme69-N5yzTg4XaDRW7Us";

const LandingPage = () => {
  const [activeSubject, setActiveSubject] = useState('dbms');
  const [aiResponse, setAiResponse] = useState(null);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const currentSubject = SUBJECT_DATA[activeSubject] || SUBJECT_DATA.dbms;

  const handleSimulateReview = (topic) => {
    setAiResponse({
      title: `Generated Socratic Step for: ${topic}`,
      content: `"Let's test edge cases. In strict ${topic}, what occurs if an uncommitted transaction aborts while holding exclusive locks? How does cascading rollback impact throughput?"`,
      color: 'text-primary'
    });
  };

  const handleAskCoach = (promptText) => {
    setAiResponse({
      title: 'EduMitra AI Coach Response:',
      content: `"${promptText}: Remember that rather than memorizing, identify the core invariant. What is the fundamental state constraint being preserved here?"`,
      color: 'text-secondary'
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupEmail) {
      setSignupSuccess(true);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
      {/* HEADER NAVBAR */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex items-center justify-between px-space-md md:px-margin">
        <div className="flex items-center gap-space-xl">
          <Link to="/" className="flex items-center gap-space-sm text-on-surface" data-path="landing-page">
            <img alt="EduMitra AI Logo" className="h-8 w-auto object-contain" src={LOGO_URL} />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">EduMitra AI</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">Intelligent Mentorship</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-space-md" data-active-classes="text-primary font-semibold">
            <a className="text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg transition-colors" data-path="features" href="#features">Features</a>
            <a className="text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg transition-colors" data-path="how-it-works" href="#how-it-works">How It Works</a>
            <a className="text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg transition-colors" data-path="benefits" href="#benefits">Benefits</a>
            <a className="text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg transition-colors" data-path="student-stories" href="#student-stories">Student Stories</a>
            <a className="text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg transition-colors" data-path="pricing" href="#interactive-preview">Pricing</a>
          </nav>
        </div>
        <div className="flex items-center gap-space-sm">
          <Link
            to="/login"
            className="px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg font-medium transition-colors"
            data-path="login"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary shadow-sm transition-all"
            data-path="register"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative pt-16 w-full min-h-screen bg-background">
        <div className="flex flex-col w-full">
          {/* Subtle Ambient Glow Effects behind Hero */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-primary/10 via-secondary-container/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-96 right-10 w-96 h-96 bg-tertiary-fixed-dim/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* HERO SECTION */}
            <section className="relative max-w-7xl mx-auto px-space-md md:px-margin pt-space-xl pb-space-2xl md:pb-36 flex flex-col lg:flex-row items-center gap-space-2xl">
              {/* Left Content Column */}
              <div className="flex-1 flex flex-col items-start space-y-space-lg text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-surface-container-high/80 text-primary font-label-md text-label-md shadow-sm">
                  <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span>AI-Powered Academic &amp; Career Intelligence Platform</span>
                  <span className="text-on-surface-variant/50 hidden sm:inline">•</span>
                  <span className="text-on-surface-variant font-medium hidden sm:inline">Higher Ed &amp; Engineering</span>
                </div>
                {/* Headline */}
                <h1 className="font-display-lg text-display-lg md:text-[54px] md:leading-[62px] text-on-surface tracking-tight font-bold">
                  Your Learning Journey, <br className="hidden sm:inline" />
                  <span className="text-primary bg-clip-text">Personalized.</span>
                </h1>
                {/* Supporting Text */}
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  Discover your conceptual strengths, accelerate academic performance with syllabus-grounded Socratic AI,
                  and build an interview-ready career roadmap tailored directly to your engineering goals.
                </p>
                {/* CTA Action Group */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md w-full sm:w-auto pt-space-xs">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-space-sm px-7 py-3.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-semibold shadow-md hover:bg-primary-container hover:shadow-lg transition-all group"
                    data-path="register"
                  >
                    <span>Get Started Free</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                  <a
                    className="inline-flex items-center justify-center gap-space-sm px-6 py-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-medium shadow-sm hover:bg-surface-container-low transition-colors"
                    href="#interactive-preview"
                  >
                    <span className="material-symbols-outlined text-secondary text-[20px]">play_circle</span>
                    <span>Explore Live Demo</span>
                  </a>
                </div>
                {/* Social Proof Stats */}
                <div className="pt-space-md flex flex-wrap items-center gap-space-lg">
                  <div className="flex -space-x-2.5 overflow-hidden">
                    <img className="inline-block h-9 w-9 rounded-full ring-2 ring-surface-container-lowest object-cover" alt="Student avatar" src={AVATAR_1} />
                    <img className="inline-block h-9 w-9 rounded-full ring-2 ring-surface-container-lowest object-cover" alt="Student avatar" src={AVATAR_2} />
                    <img className="inline-block h-9 w-9 rounded-full ring-2 ring-surface-container-lowest object-cover" alt="Student avatar" src={AVATAR_3} />
                    <img className="inline-block h-9 w-9 rounded-full ring-2 ring-surface-container-lowest object-cover" alt="Student avatar" src={AVATAR_4} />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-amber-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-amber-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-amber-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-amber-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-amber-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface ml-1 font-bold">4.9/5</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Trusted by 45,000+ engineering &amp; college students</span>
                  </div>
                </div>
              </div>

              {/* Right Isometric UI Mockup */}
              <div className="flex-1 w-full relative max-w-xl lg:max-w-none">
                <div className="relative bg-surface-container-lowest rounded-2xl shadow-xl p-space-md sm:p-space-lg overflow-hidden">
                  {/* Mockup Topbar */}
                  <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low/60 -mx-space-md -mt-space-md sm:-mx-space-lg sm:-mt-space-lg px-space-md sm:px-space-lg py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-error/60"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400/70"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/70"></div>
                      <span className="text-on-surface-variant font-label-sm text-label-sm ml-2">EduMitra AI • Student Workspace (Semester 6)</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-label-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      Live Sync Active
                    </span>
                  </div>
                  {/* Cards Inner Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    {/* GPA Projection Card */}
                    <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-on-surface-variant">Cumulative GPA Pulse</span>
                        <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
                      </div>
                      <div className="my-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-display-lg text-display-lg text-on-surface font-bold">8.64</span>
                          <span className="font-label-md text-label-md text-on-surface-variant">/ 10.0</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-700 font-label-sm text-label-sm font-semibold mt-1">
                          <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                          <span>+0.32 vs Mid-Term Diagnostic</span>
                        </div>
                      </div>
                      {/* Mini Sparkline inline SVG */}
                      <svg className="w-full h-8 overflow-visible" fill="none" viewBox="0 0 100 24">
                        <path d="M0 20 L20 16 L40 18 L60 11 L80 13 L100 4" stroke="#4338CA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                        <path d="M0 20 L20 16 L40 18 L60 11 L80 13 L100 4 L100 24 L0 24 Z" fill="#4338CA" fillOpacity="0.08"></path>
                      </svg>
                    </div>

                    {/* Active AI Streak & Remediation Target */}
                    <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-on-surface-variant">Active Study Sprint</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-label-sm text-label-sm font-semibold">
                          <span className="material-symbols-outlined text-[14px]">local_fire_department</span> 14 Days
                        </span>
                      </div>
                      <div className="my-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Remediation Node</span>
                        <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">B+ Trees &amp; DB Indexing</h4>
                        <div className="w-full bg-surface-container-highest rounded-full h-2 mt-2 overflow-hidden">
                          <div className="bg-secondary h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      <span className="font-label-sm text-label-sm text-emerald-700 font-semibold">Gap narrowed by 41% this week</span>
                    </div>
                  </div>

                  {/* Socratic AI Chat Snippet Card */}
                  <div className="mt-space-md bg-surface-container rounded-xl p-space-md">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary">
                        <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold text-xs">EduMitra Socratic Tutor</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">DBMS Unit 4</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant bg-surface-container-lowest p-3 rounded-lg text-xs leading-relaxed">
                      "When secondary indexes in PostgreSQL exceed memory limits, why do leaf-node split operations trigger synchronous page write penalties? Let's trace the write-ahead log (WAL) sequence."
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        onClick={() => handleSimulateReview('Write-Ahead Logging (WAL)')}
                        className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-primary font-label-sm text-label-sm hover:bg-primary hover:text-on-primary transition-colors"
                      >
                        Solve WAL Step-by-Step
                      </button>
                      <button
                        onClick={() => handleAskCoach('Show 10-year exam PYQ patterns for B+ Tree splits')}
                        className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface transition-colors"
                      >
                        Show Exam PYQ Pattern
                      </button>
                    </div>
                  </div>

                  {/* Micro Floating Pill */}
                  <div className="mt-space-md flex items-center justify-between bg-primary text-on-primary px-4 py-2.5 rounded-xl shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span className="font-label-md text-label-md font-semibold">Matched Tier-1 Role: Cloud Systems Engineer</span>
                    </div>
                    <span className="font-label-sm text-label-sm font-mono bg-on-primary/20 px-2 py-0.5 rounded text-on-primary">94% Fit</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* INSTITUTION SOCIAL PROOF TICKER */}
          <section className="w-full bg-surface-container py-space-xl overflow-hidden">
            <div className="max-w-7xl mx-auto px-space-md md:px-margin text-center mb-space-md">
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">
                Powering ambitious engineering &amp; university students across leading institutions
              </span>
            </div>
            <div className="max-w-6xl mx-auto px-space-md flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-2 font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">
                <span className="material-symbols-outlined text-primary text-[28px]">school</span>
                <span>IIT DELHI TECHLAB</span>
              </div>
              <div className="flex items-center gap-2 font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[28px]">account_balance</span>
                <span>BITS PILANI CS HUB</span>
              </div>
              <div className="flex items-center gap-2 font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">
                <span className="material-symbols-outlined text-tertiary-container text-[28px]">biotech</span>
                <span>NIT TRICHY ALGO</span>
              </div>
              <div className="flex items-center gap-2 font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">
                <span className="material-symbols-outlined text-primary text-[28px]">domain</span>
                <span>DTU ADVANCED ED</span>
              </div>
              <div className="flex items-center gap-2 font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[28px]">science</span>
                <span>IIIT HYDERABAD AI</span>
              </div>
            </div>
          </section>

          {/* FEATURES GRID */}
          <section className="max-w-7xl mx-auto px-space-md md:px-margin py-space-2xl" id="features">
            <div className="text-center max-w-3xl mx-auto mb-space-2xl">
              <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                Engineered for Academic Excellence
              </span>
              <h2 className="font-display-lg text-display-lg text-on-surface mt-space-sm font-bold">
                Everything you need to master exams and launch high-paying tech careers.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm">
                Conventional study platforms give you generic playlists. EduMitra integrates continuous syllabus telemetry
                with intelligent Socratic mentorship.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {/* Feature 1 */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-space-md group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[26px]">dashboard_customize</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Personalized Learning Dashboard</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
                    Live academic pulse tracking GPA projections, syllabus completion percentage, and automated
                    chapter-level difficulty indexes calibrated to your university curriculum.
                  </p>
                </div>
                <div className="mt-space-lg pt-space-md bg-surface-container-low rounded-xl p-3">
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface">
                    <span>Discrete Math Mastery</span>
                    <span className="font-bold text-primary">88% (Exceeds Avg)</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-space-md group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                    <span className="material-symbols-outlined text-[26px]">monitoring</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Academic Progress Tracking</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
                    Continuous concept-level telemetry that categorizes topics into Mastered, Progressing, and Critical
                    Review so you never waste time revising concepts you already know.
                  </p>
                </div>
                <div className="mt-space-lg pt-space-md bg-surface-container-low rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-[18px]">error</span>
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">OS Semaphores</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">Priority 1 Review</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 text-tertiary-container flex items-center justify-center mb-space-md group-hover:bg-tertiary-container group-hover:text-on-tertiary transition-colors">
                    <span className="material-symbols-outlined text-[26px]">work</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Career &amp; Role Recommendations</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
                    Telemetry-matched industry trajectories (DevOps, Distributed Systems, ML Engineer) calibrated directly
                    to your highest-scoring subjects and coursework strengths.
                  </p>
                </div>
                <div className="mt-space-lg pt-space-md bg-surface-container-low rounded-xl p-3 flex items-center justify-between">
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface">Target: Distributed Systems Engineer</span>
                  <span className="text-emerald-700 font-label-sm text-label-sm font-bold">92% Match</span>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary-container/15 text-primary-container flex items-center justify-center mb-space-md group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[26px]">psychology</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">24/7 Socratic AI Study Assistant</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
                    Trained on university syllabi, textbooks, and past 10-year exam papers. Rather than handing out raw
                    answers, it asks probing questions to build true mental models.
                  </p>
                </div>
                <div className="mt-space-lg pt-space-md bg-surface-container-low rounded-xl p-3 text-xs text-on-surface-variant">
                  <span className="font-semibold text-primary">Socratic Prompt:</span> "Why does quicksort degrade to O(n²) in sorted arrays?"
                </div>
              </div>

              {/* Feature 5 */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-secondary-container/30 text-on-secondary-container flex items-center justify-center mb-space-md group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                    <span className="material-symbols-outlined text-[26px]">calendar_month</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Personalized Study Plans</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
                    Adaptive daily calendars that automatically absorb college lab deadlines, exam dates, and quiz scores,
                    re-balancing workloads so you never suffer pre-exam cramming.
                  </p>
                </div>
                <div className="mt-space-lg pt-space-md bg-surface-container-low rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="text-on-surface font-medium">Exam in 12 days</span>
                  <span className="text-primary font-semibold">Auto-Rescheduled: 3 Sprints</span>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/40 text-on-tertiary-fixed-variant flex items-center justify-center mb-space-md group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                    <span className="material-symbols-outlined text-[26px]">badge</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Live ATS Resume Alignment</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
                    Syncs your academic repo commits, lab assignments, and project deliverables with real Fortune 500 job
                    descriptors to highlight quantifiable impact.
                  </p>
                </div>
                <div className="mt-space-lg pt-space-md bg-surface-container-low rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="text-on-surface font-medium">ATS Optimization</span>
                  <span className="text-emerald-700 font-bold">96/100 Readiness</span>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS SECTION */}
          <section className="w-full bg-surface-container-low py-space-2xl" id="how-it-works">
            <div className="max-w-7xl mx-auto px-space-md md:px-margin">
              <div className="text-center max-w-3xl mx-auto mb-space-2xl">
                <span className="px-3.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                  Frictionless 3-Step Flow
                </span>
                <h2 className="font-display-lg text-display-lg text-on-surface mt-space-sm font-bold">
                  From semester overload to structured clarity.
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm">
                  EduMitra converts unstructured course materials into an intelligent academic guidance system in minutes.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg relative">
                {/* Step 1 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col items-start relative">
                  <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold mb-space-md">1</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Create Your Student Profile</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm mb-space-md">
                    Upload your college syllabus PDF, select your degree, branch, and current semester. EduMitra
                    automatically indexes units, weightages, and grading guidelines.
                  </p>
                  <div className="w-full mt-auto bg-surface-container-low p-3 rounded-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">upload_file</span>
                    <span className="font-label-sm text-label-sm text-on-surface truncate">VTU_CS_Sem6_Syllabus.pdf parsed</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col items-start relative">
                  <span className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-headline-sm text-headline-sm font-bold mb-space-md">2</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Discover Your Strengths</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm mb-space-md">
                    Complete a high-speed 10-minute diagnostic pulse test. The AI isolates subtle conceptual gaps, mastery
                    velocity, and pinpoints exactly which units need attention.
                  </p>
                  <div className="w-full mt-auto bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">Diagnostic Score</span>
                    <span className="font-label-sm text-label-sm font-bold text-secondary">3 Weak Nodes Identified</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col items-start relative">
                  <span className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center font-headline-sm text-headline-sm font-bold mb-space-md">3</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Follow Your Personalized Journey</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm mb-space-md">
                    Execute targeted 25-minute sprints with AI Socratic mentors, practice validated past-year questions, and
                    build portfolio projects aligned with your target job profile.
                  </p>
                  <div className="w-full mt-auto bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">Semester Target</span>
                    <span className="font-label-sm text-label-sm font-bold text-emerald-700">9.0+ SGPA Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE SAMPLE PROGRESS DASHBOARD PREVIEW */}
          <section className="max-w-7xl mx-auto px-space-md md:px-margin py-space-2xl" id="interactive-preview">
            <div className="text-center max-w-3xl mx-auto mb-space-xl">
              <span className="px-3.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                Interactive Preview
              </span>
              <h2 className="font-display-lg text-display-lg text-on-surface mt-space-sm font-bold">
                Experience your live academic command center.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm">
                Click below to simulate real-time mastery recalculations and explore how the AI diagnostic engine operates.
              </p>
            </div>

            {/* Live Interactive App Container */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-space-md sm:p-space-xl">
              {/* Dashboard Top Header Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-lg gap-space-md">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-xl">
                    A
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">Ananya Sharma</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-sm text-label-sm font-semibold">Dean's List Track</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">B.Tech Computer Science &amp; Engineering • Semester 6 • University Roll #2022CS894</p>
                  </div>
                </div>
                {/* Subject Switcher Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl overflow-x-auto" id="subject-tabs">
                  {Object.entries(SUBJECT_DATA).map(([key, data]) => {
                    const isActive = activeSubject === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveSubject(key)}
                        className={`subject-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-surface-container-lowest text-primary shadow-sm'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        data-subject={key}
                      >
                        {data.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Interactive Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg pt-space-md">
                {/* Column 1: Subject Mastery Radar & Stats */}
                <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-space-sm">
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase font-semibold">Subject Mastery Health</span>
                      <span className="font-headline-md text-headline-md font-bold text-primary" id="mastery-pct">{currentSubject.mastery}</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant" id="mastery-subtitle">
                      {currentSubject.subtitle}
                    </p>
                    {/* Custom Clean SVG Radar / Circular Progress */}
                    <div className="flex items-center justify-center py-6">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-surface-container-highest"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                          ></path>
                          <path
                            className="text-primary transition-all duration-700 ease-out"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            id="circle-progress"
                            stroke="currentColor"
                            strokeDasharray={`${currentSubject.pct}, 100`}
                            strokeLinecap="round"
                            strokeWidth="3.5"
                          ></path>
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="font-display-lg text-display-lg text-on-surface font-bold leading-none" id="circle-text">
                            {currentSubject.indexScore}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Index</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-space-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant">Predicted Grade</span>
                      <span className="font-bold text-emerald-700 font-mono" id="predicted-grade">{currentSubject.predicted}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant">Lab Submissions</span>
                      <span className="font-bold text-on-surface" id="lab-stats">{currentSubject.lab}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Dynamic Knowledge Gap Remediation List */}
                <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col">
                  <div className="flex items-center justify-between mb-space-md">
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">Knowledge Gap Radar</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Prioritized by exam question frequency</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">Active</span>
                  </div>
                  <div className="space-y-space-sm flex-1" id="gap-list">
                    {currentSubject.gaps.map((g, index) => (
                      <div key={index} className="p-3 bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-between">
                        <div>
                          <span className={`font-label-sm text-label-sm ${g.color} font-semibold`}>{g.label}</span>
                          <p className="font-headline-sm text-headline-sm text-on-surface text-sm font-semibold">{g.title}</p>
                          <span className="text-on-surface-variant font-body-sm text-body-sm text-xs">{g.desc}</span>
                        </div>
                        {g.btn ? (
                          <button
                            onClick={() => handleSimulateReview(g.title)}
                            className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary transition-all"
                          >
                            Practice
                          </button>
                        ) : (
                          <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Socratic AI Accelerator Simulation */}
                <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-space-sm">
                      <span className="material-symbols-outlined text-primary text-[22px]">psychology_alt</span>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">Ask Socratic AI Coach</h4>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Ask any exam question or complex concept to inspect instant pedagogical breakdown.
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleAskCoach('Explain ACID properties in distributed transactions')}
                        className="w-full text-left p-2.5 rounded-lg bg-surface-container-lowest text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-all flex items-center justify-between"
                      >
                        <span>"Explain ACID in distributed systems..."</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                      <button
                        onClick={() => handleAskCoach('Derive master theorem formula for divide & conquer')}
                        className="w-full text-left p-2.5 rounded-lg bg-surface-container-lowest text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-all flex items-center justify-between"
                      >
                        <span>"Derive Master Theorem formula..."</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                      <button
                        onClick={() => handleAskCoach('How does page replacement LRU prevent thrashing?')}
                        className="w-full text-left p-2.5 rounded-lg bg-surface-container-lowest text-xs font-medium text-on-surface hover:bg-surface-container hover:text-primary transition-all flex items-center justify-between"
                      >
                        <span>"How does LRU prevent thrashing?..."</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Output Display Area */}
                  <div className="mt-space-md p-3.5 bg-surface-container-lowest rounded-xl min-h-[90px] flex items-center justify-center text-center" id="ai-response-box">
                    {aiResponse ? (
                      <div className="flex flex-col text-left w-full space-y-1">
                        <span className={`font-label-sm text-label-sm ${aiResponse.color} font-bold`}>{aiResponse.title}</span>
                        <p className="text-xs text-on-surface">{aiResponse.content}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-on-surface-variant italic">Select a prompt above to see EduMitra Socratic guidance stream live...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BENEFITS FOR STUDENTS (3-COLUMN VALUE PROPOSITION) */}
          <section className="w-full bg-surface-container-low py-space-2xl" id="benefits">
            <div className="max-w-7xl mx-auto px-space-md md:px-margin">
              <div className="text-center max-w-3xl mx-auto mb-space-2xl">
                <span className="px-3.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                  Student Benefits
                </span>
                <h2 className="font-display-lg text-display-lg text-on-surface mt-space-sm font-bold">
                  High-performance outcomes, minimal stress.
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm">
                  Built by engineers for university students who want to top exams without sacrificing their coding side-projects.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                {/* Benefit 1 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-space-md">
                      <span className="material-symbols-outlined text-[32px]">schedule</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">Save 8+ Hours Every Week</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
                      Stop scouring fragmented 2-hour YouTube tutorials or unorganized lecture slides. EduMitra summarizes
                      syllabus-aligned reading packs into high-density 10-minute syntheses.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-md bg-surface-container-low p-3.5 rounded-xl">
                    <span className="font-label-sm text-label-sm text-on-surface-variant block font-semibold">AVERAGE TIME SAVED</span>
                    <span className="font-headline-md text-headline-md text-primary font-bold">34 Hours / Month</span>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-space-md">
                      <span className="material-symbols-outlined text-[32px]">grade</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">Turn Weak Topics into 90%+ Mastery</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
                      Targeted adaptive remediation quizzes eliminate conceptual fog before midterm and semester finals
                      arrive, ensuring solid performance in high-weightage topics.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-md bg-surface-container-low p-3.5 rounded-xl">
                    <span className="font-label-sm text-label-sm text-on-surface-variant block font-semibold">EXAM ACCURACY GAIN</span>
                    <span className="font-headline-md text-headline-md text-emerald-700 font-bold">+28% Higher Scores</span>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-space-md">
                      <span className="material-symbols-outlined text-[32px]">trending_up</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">Graduate Job-Ready</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
                      Bridge the college-to-industry gap. Translate theoretical assignments into production-grade GitHub
                      projects mapped directly to ₹14L – ₹28L tech engineering roles.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-md bg-surface-container-low p-3.5 rounded-xl">
                    <span className="font-label-sm text-label-sm text-on-surface-variant block font-semibold">CAREER PLACEMENT ACCELERATION</span>
                    <span className="font-headline-md text-headline-md text-secondary font-bold">4.2x Interview Shortlists</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STUDENT TESTIMONIALS SECTION */}
          <section className="max-w-7xl mx-auto px-space-md md:px-margin py-space-2xl" id="student-stories">
            <div className="text-center max-w-3xl mx-auto mb-space-2xl">
              <span className="px-3.5 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                Student Stories
              </span>
              <h2 className="font-display-lg text-display-lg text-on-surface mt-space-sm font-bold">
                Loved by students who went from borderline GPAs to Tier-1 offers.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {/* Story 1 */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between">
                <p className="font-body-md text-body-md text-on-surface-variant italic">
                  "Before EduMitra, I was terrified of Database Internals and OS Semaphores. The Socratic tutor broke down
                  memory locking in 15 minutes what my professor couldn't in 3 weeks. Boosted my SGPA from 7.1 to 8.9."
                </p>
                <div className="mt-space-lg flex items-center gap-3">
                  <img className="w-10 h-10 rounded-full object-cover" alt="Rohan Nair" src={TESTIMONIAL_1} />
                  <div>
                    <h5 className="font-headline-sm text-headline-sm text-on-surface font-bold">Rohan Nair</h5>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">CSE, 3rd Year • BITS Pilani</span>
                  </div>
                </div>
              </div>

              {/* Story 2 */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between">
                <p className="font-body-md text-body-md text-on-surface-variant italic">
                  "The Resume Analysis matched my college microservices project directly to AWS and Kubernetes keywords. I
                  cracked my dream Cloud Engineer internship at a leading fintech firm during 7th semester campus
                  placements!"
                </p>
                <div className="mt-space-lg flex items-center gap-3">
                  <img className="w-10 h-10 rounded-full object-cover" alt="Priya Patel" src={TESTIMONIAL_2} />
                  <div>
                    <h5 className="font-headline-sm text-headline-sm text-on-surface font-bold">Priya Patel</h5>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Cloud Intern @ Razorpay • NIT Trichy</span>
                  </div>
                </div>
              </div>

              {/* Story 3 */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between">
                <p className="font-body-md text-body-md text-on-surface-variant italic">
                  "The adaptive study planner is the best feature. Whenever hackathons or lab deadlines came up, EduMitra
                  automatically balanced my review sessions without me stressing out before semester exams."
                </p>
                <div className="mt-space-lg flex items-center gap-3">
                  <img className="w-10 h-10 rounded-full object-cover" alt="Kartik Mehta" src={TESTIMONIAL_3} />
                  <div>
                    <h5 className="font-headline-sm text-headline-sm text-on-surface font-bold">Kartik Mehta</h5>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Information Tech, 4th Year • DTU</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* HIGH-IMPACT FINAL CTA BANNER */}
          <section className="max-w-7xl mx-auto px-space-md md:px-margin pb-space-2xl" id="pricing">
            <div className="relative rounded-3xl bg-primary text-on-primary p-space-xl md:p-space-2xl overflow-hidden shadow-xl">
              {/* Decorative Backdrop Graphic */}
              <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-on-primary/10 blur-2xl pointer-events-none"></div>
              <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
              <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
                <span className="px-3.5 py-1 rounded-full bg-on-primary/15 text-primary-fixed font-label-sm text-label-sm font-semibold uppercase tracking-wider mb-space-md">
                  Start Your AI Journey Today
                </span>
                <h2 className="font-display-lg text-display-lg md:text-[46px] md:leading-[52px] text-on-primary font-bold">
                  Ready to elevate your academic and career potential?
                </h2>
                <p className="font-body-lg text-body-lg text-on-primary/85 mt-space-sm max-w-xl">
                  Join thousands of university students excelling in college exams and landing dream tech positions with
                  personalized AI mentorship.
                </p>
                {/* Fast Email Signup Field */}
                <form className="mt-space-lg w-full max-w-md flex flex-col sm:flex-row gap-space-xs" onSubmit={handleSignup}>
                  <input
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="flex-1 px-4 py-3.5 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-fixed shadow-sm"
                    placeholder="Enter your university or college email"
                    required
                    type="email"
                  />
                  <button
                    className="px-6 py-3.5 rounded-xl bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg font-bold hover:bg-secondary-fixed transition-colors shadow-md flex items-center justify-center gap-2"
                    type="submit"
                  >
                    <span>Get Started Free</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </form>
                {signupSuccess && (
                  <div className="mt-3 text-sm text-secondary-fixed font-medium" id="signup-confirmation">
                    ✓ Welcome aboard! Confirmation link dispatched to your student email.
                  </div>
                )}
                <p className="font-label-sm text-label-sm text-on-primary/70 mt-space-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span> No credit card required • Free tier forever for college students
                </p>
              </div>
            </div>
          </section>

          {/* EXTENDED FOOTER */}
          <div className="w-full bg-surface-container py-space-2xl">
            <div className="max-w-7xl mx-auto px-space-md md:px-margin">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-space-lg mb-space-2xl">
                {/* Logo Column */}
                <div className="col-span-2">
                  <div className="flex items-center gap-space-sm mb-space-sm">
                    <img alt="EduMitra AI Logo" className="h-8 w-auto object-contain" src={LOGO_URL} />
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">EduMitra AI</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                    The next-generation academic intelligence companion, bridging high-difficulty engineering syllabi and
                    industry hiring benchmarks.
                  </p>
                  <div className="flex items-center gap-3 mt-space-md text-on-surface-variant">
                    <a className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center hover:text-primary transition-colors" href="#" title="GitHub">
                      <span className="material-symbols-outlined text-[20px]">code</span>
                    </a>
                    <a className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center hover:text-primary transition-colors" href="#" title="LinkedIn">
                      <span className="material-symbols-outlined text-[20px]">share</span>
                    </a>
                    <a className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center hover:text-primary transition-colors" href="#" title="Discord">
                      <span className="material-symbols-outlined text-[20px]">forum</span>
                    </a>
                  </div>
                </div>
                {/* Links Column: Product */}
                <div className="flex flex-col space-y-2">
                  <span className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">Product</span>
                  <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#features">Features</a>
                  <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#interactive-preview">Socratic AI Tutor</a>
                  <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">GPA Predictor</a>
                  <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Resume Optimizer</a>
                </div>
                {/* Links Column: Company */}
                <div className="flex flex-col space-y-2">
                  <span className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">Company</span>
                  <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">About Us</a>
                  <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Careers (Hiring!)</a>
                  <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">University Partners</a>
                  <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Press &amp; Media</a>
                </div>
                {/* Links Column: Resources */}
                <div className="flex flex-col space-y-2">
                  <span className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">Resources</span>
                  <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Syllabus Hub</a>
                  <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">PYQ Question Banks</a>
                  <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Student Discord</a>
                  <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Security &amp; FERPA</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-surface-container-lowest text-on-surface-variant py-space-xl border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-space-md md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm">
            <img alt="EduMitra AI" className="h-6 w-auto object-contain opacity-80" src={LOGO_URL} />
            <span className="font-label-md text-label-md text-on-surface-variant">© 2025 EduMitra AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-space-lg">
            <a className="font-label-md text-label-md hover:text-on-surface transition-colors" data-path="privacy-policy" href="#">Privacy Policy</a>
            <a className="font-label-md text-label-md hover:text-on-surface transition-colors" data-path="terms-of-service" href="#">Terms of Service</a>
            <a className="font-label-md text-label-md hover:text-on-surface transition-colors" data-path="contact" href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
