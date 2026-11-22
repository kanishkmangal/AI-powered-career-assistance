import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getResumeAnalysis, applyResumeAnalysisAction } from '../../services/api';

/**
 * ResumeAnalysisPage (Resume Page - After Upload)
 * Full-fidelity React recreation of the EduMitra AI ATS Diagnostic & Job Alignment Report.
 * Reference: Website UI/Resume_page_after_upload/code.html
 */
const ResumeAnalysisPage = () => {
  const navigate = useNavigate();

  // Current user info
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('edumitra_user')) || {};
    } catch {
      return {};
    }
  })();
  const userEmail = storedUser.email || '';

  // State
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appliedGaps, setAppliedGaps] = useState({});
  const [acceptedRewrites, setAcceptedRewrites] = useState({});
  const [dismissedRewrites, setDismissedRewrites] = useState({});
  const [bannerMessage, setBannerMessage] = useState(null);
  const [addedCurriculum, setAddedCurriculum] = useState({});

  useEffect(() => {
    loadAnalysis();
  }, [userEmail]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      const res = await getResumeAnalysis(userEmail);
      if (res.status === 'success' && res.data) {
        setAnalysisData(res.data);
      }
    } catch (err) {
      console.error('Failed to load resume analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Accept Rewrite
  const handleAcceptRewrite = async (cardId, feedbackMsg) => {
    setAcceptedRewrites((prev) => ({
      ...prev,
      [cardId]: feedbackMsg,
    }));

    try {
      await applyResumeAnalysisAction(
        { rewrite_id: cardId, status: 'accepted' },
        userEmail
      );
    } catch (err) {
      console.error('Failed to persist rewrite:', err);
    }
  };

  // Handle Dismiss / Ignore Suggestion
  const handleDismissSuggestion = async (cardId) => {
    setDismissedRewrites((prev) => ({
      ...prev,
      [cardId]: true,
    }));

    try {
      await applyResumeAnalysisAction(
        { rewrite_id: cardId, status: 'dismissed' },
        userEmail
      );
    } catch (err) {
      console.error('Failed to persist dismissal:', err);
    }
  };

  // Handle Apply Gap / Insert Keyword
  const handleApplyGap = async (gapId, title) => {
    setAppliedGaps((prev) => ({
      ...prev,
      [gapId]: true,
    }));
    setBannerMessage(`"${title}" applied directly to your project competencies.`);
    setTimeout(() => setBannerMessage(null), 4000);

    try {
      await applyResumeAnalysisAction({ gap_id: gapId }, userEmail);
    } catch (err) {
      console.error('Failed to persist gap keyword:', err);
    }
  };

  // Handle Add to Semester Plan
  const handleAddToPlan = (courseName) => {
    setAddedCurriculum((prev) => ({ ...prev, [courseName]: true }));
    setBannerMessage(`"${courseName}" added to your Semester Study Plan.`);
    setTimeout(() => setBannerMessage(null), 4000);
  };

  // Apply all suggested edits
  const handleApplyAllEdits = () => {
    handleAcceptRewrite('rewrite-card-1', 'Rewrite accepted and patched into Project section.');
    handleAcceptRewrite('rewrite-card-2', 'Rewrite applied directly to Experience section.');
    handleApplyGap('gap-1', 'Apache Kafka / Event-Driven Architecture');
    handleApplyGap('gap-2', 'Kubernetes / Helm Chart Deployment');
    setBannerMessage('All ATS recommendations applied. Your resume match score is boosted to 92%!');
  };

  // Print PDF
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full pb-16 px-4 sm:px-8 pt-4">
      {/* Toast Notification Banner */}
      {bannerMessage && (
        <div className="mb-4 p-4 rounded-xl bg-primary-container text-on-primary shadow-md flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">check_circle</span>
            <span className="font-label-md text-label-md">{bannerMessage}</span>
          </div>
          <button
            onClick={() => setBannerMessage(null)}
            className="text-on-primary hover:opacity-80 p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Sub-Header / Top Context Row */}
      <section className="flex flex-col gap-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <nav className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
              <Link to="/resume-builder" className="hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">description</span>
                <span>Resume Builder</span>
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-semibold">Analysis Results</span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                v2.4 Live Diagnostic
              </span>
            </nav>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              ATS Resume Diagnostic &amp; Job Alignment Report
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-4xl">
              Comprehensive multi-tier ATS benchmark analysis against Cloud &amp; Distributed Systems Engineer roles at Tier-1 tech companies.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/resume-builder"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-high transition-all font-label-lg text-label-lg group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:rotate-180 transition-transform">
                sync
              </span>
              <span>Re-upload / Update Resume</span>
            </Link>

            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-high transition-all font-label-lg text-label-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">picture_as_pdf</span>
              <span>Export Full ATS Report PDF</span>
            </button>

            <button
              onClick={handleApplyAllEdits}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary shadow-md hover:bg-primary transition-all font-label-lg text-label-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
              <span>Apply Suggested Edits to Resume</span>
            </button>
          </div>
        </div>
      </section>

      {/* Metric Strip Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {/* Card 1: Overall Score with Radial Gauge */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
              Overall ATS Match
            </span>
            <span className="flex items-center gap-1 font-label-sm text-label-sm text-tertiary bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +14 pts
            </span>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-high"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                ></path>
                <path
                  className="text-primary-container stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeDasharray="86, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                ></path>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold leading-none">86</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-none mt-0.5">/100</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-secondary-container bg-secondary-fixed/50 px-2.5 py-1 rounded-md max-w-fit">
                <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                Top 15% Applicants
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                High Interview Call Probability
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 bg-surface-container-low/60 -mx-6 -mb-6 px-6 py-2.5 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <span>Benchmark: Tier-1 SDE Core</span>
            <span className="font-medium text-primary">Strong Standing</span>
          </div>
        </div>

        {/* Card 2: Keywords & Competencies */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                Core Keywords Match
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">filter_alt</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-display-lg text-display-lg text-on-surface font-bold">88%</span>
              <span className="font-body-md text-body-md text-on-surface-variant">22 of 25 detected</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-surface-container-high rounded-full h-2 mb-3 overflow-hidden">
              <div className="bg-secondary-container h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span className="flex items-center gap-1 text-on-secondary-fixed-variant">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                3 high-yield gaps pending
              </span>
              <span className="font-semibold text-on-surface">Target 90%+</span>
            </div>
          </div>
        </div>

        {/* Card 3: Formatting & ATS Parseability */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                ATS Parseability
              </span>
              <span className="material-symbols-outlined text-tertiary-container text-[20px]">fact_check</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-display-lg text-display-lg text-on-surface font-bold">96%</span>
              <span className="font-body-md text-body-md text-tertiary font-medium">0 Critical Errors</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-surface-container-high rounded-full h-2 mb-3 overflow-hidden">
              <div className="bg-tertiary-fixed-dim h-full rounded-full" style={{ width: '96%' }}></div>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>Standard Unicode &amp; Fonts</span>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-medium">Clean Tree</span>
            </div>
          </div>
        </div>

        {/* Card 4: Impact & Quantifiable Metrics */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                Quantifiable Impact
              </span>
              <span className="material-symbols-outlined text-primary text-[20px]">query_stats</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-display-lg text-display-lg text-on-surface font-bold">78%</span>
              <span className="font-body-md text-body-md text-on-surface-variant">6 of 9 bullets scored</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-surface-container-high rounded-full h-2 mb-3 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '78%' }}></div>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span className="text-error font-medium">3 unquantified points</span>
              <span className="font-semibold text-primary">Needs Polish</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Master Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Detailed Breakdown & Diagnostic Findings (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Section 1: Relevant & Matched Skills */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Matched Core Competencies</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Keywords detected by ATS matching Distributed Systems engineering specs
                  </p>
                </div>
              </div>
              <span className="font-label-sm text-label-sm bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface font-medium">
                22 Matched
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-tertiary font-bold">done_all</span>
                <span>TCP/IP Socket Programming</span>
                <span className="text-tertiary bg-tertiary-fixed/30 font-semibold text-[10px] px-1.5 py-0.2 rounded">
                  High Match
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-tertiary font-bold">done_all</span>
                <span>Distributed Consensus</span>
                <span className="text-tertiary bg-tertiary-fixed/30 font-semibold text-[10px] px-1.5 py-0.2 rounded">
                  High Match
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-tertiary">check</span>
                <span>Docker &amp; Containerization</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-tertiary">check</span>
                <span>Go / Golang</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-tertiary">check</span>
                <span>PostgreSQL &amp; Query Tuning</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-tertiary">check</span>
                <span>OS Threads &amp; Semaphores</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-tertiary">check</span>
                <span>GitOps &amp; Semantic Versioning</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-tertiary">check</span>
                <span>gRPC Protocol Buffers</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-tertiary">check</span>
                <span>Linux Kernel Epoll</span>
              </span>
            </div>
          </section>

          {/* Section 2: Missing Skills & High-Yield Keyword Gaps */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Critical Keyword Gaps</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Missing high-frequency keywords found in 70%+ of target job descriptions
                  </p>
                </div>
              </div>
              <button
                onClick={handleApplyAllEdits}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-on-primary-fixed-variant transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add to Resume Editor</span>
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              {/* Gap Card 1 */}
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 px-2 py-0.5 rounded font-label-sm text-label-sm bg-error-container text-error font-semibold flex-shrink-0">
                    High Impact
                  </span>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      Apache Kafka / Event-Driven Architecture
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Appears in <strong className="text-on-surface">84%</strong> of Cloud Systems postings. Suggested: Incorporate your CS412 event streaming assignment.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleApplyGap('gap-1', 'Apache Kafka / Event-Driven Architecture')}
                  className={`self-start md:self-center px-3 py-1.5 rounded-lg font-label-sm text-label-sm shadow-xs transition-colors whitespace-nowrap cursor-pointer ${
                    appliedGaps['gap-1']
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold'
                      : 'bg-surface-container-lowest text-primary hover:bg-surface-container-high'
                  }`}
                >
                  {appliedGaps['gap-1'] ? '✓ Applied' : 'Apply to Projects'}
                </button>
              </div>

              {/* Gap Card 2 */}
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 px-2 py-0.5 rounded font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed-variant font-semibold flex-shrink-0">
                    Medium Impact
                  </span>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      Kubernetes / Helm Chart Deployment
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Appears in <strong className="text-on-surface">68%</strong> of postings. You currently have Docker listed without orchestration keywords.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleApplyGap('gap-2', 'Kubernetes / Helm Chart Deployment')}
                  className={`self-start md:self-center px-3 py-1.5 rounded-lg font-label-sm text-label-sm shadow-xs transition-colors whitespace-nowrap cursor-pointer ${
                    appliedGaps['gap-2']
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold'
                      : 'bg-surface-container-lowest text-primary hover:bg-surface-container-high'
                  }`}
                >
                  {appliedGaps['gap-2'] ? '✓ Inserted' : 'Insert Keyword'}
                </button>
              </div>

              {/* Gap Card 3 */}
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 px-2 py-0.5 rounded font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed-variant font-semibold flex-shrink-0">
                    Medium Impact
                  </span>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      CI/CD Telemetry (GitHub Actions / Prometheus)
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Appears in <strong className="text-on-surface">61%</strong> of cloud infrastructure postings. Enhances your DevOps competency profile.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleApplyGap('gap-3', 'CI/CD Telemetry (GitHub Actions / Prometheus)')}
                  className={`self-start md:self-center px-3 py-1.5 rounded-lg font-label-sm text-label-sm shadow-xs transition-colors whitespace-nowrap cursor-pointer ${
                    appliedGaps['gap-3']
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold'
                      : 'bg-surface-container-lowest text-primary hover:bg-surface-container-high'
                  }`}
                >
                  {appliedGaps['gap-3'] ? '✓ Inserted' : 'Insert Keyword'}
                </button>
              </div>
            </div>
          </section>

          {/* Section 3: Line-by-Line AI Improvement Suggestions */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Line-by-Line AI Enhancements</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Empirically backed bullet revisions for maximum hiring manager conversion
                  </p>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-semibold">2 Optimizations Ready</span>
            </div>

            <div className="flex flex-col gap-6">
              {/* Suggestion Item 1 */}
              {!dismissedRewrites['rewrite-card-1'] && (
                <div
                  className={`p-5 rounded-xl transition-all ${
                    acceptedRewrites['rewrite-card-1']
                      ? 'bg-tertiary-fixed/20 border border-tertiary/30'
                      : 'bg-surface-container-low flex flex-col gap-4'
                  }`}
                  id="rewrite-card-1"
                >
                  {acceptedRewrites['rewrite-card-1'] ? (
                    <div className="flex items-center justify-between py-2 text-tertiary">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span className="font-label-md text-label-md font-semibold">
                          {acceptedRewrites['rewrite-card-1']}
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm bg-surface-container-lowest px-2.5 py-1 rounded text-on-surface font-medium">
                        Applied
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-label-sm text-label-sm bg-error-container text-error px-2.5 py-0.5 rounded-md font-medium">
                            Impact Weakness
                          </span>
                          <span className="font-label-md text-label-md text-on-surface font-semibold">
                            Project: Distributed Key-Value Engine
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          Line 14 in Projects
                        </span>
                      </div>

                      {/* Before & After Comparison */}
                      <div className="flex flex-col gap-2.5">
                        <div className="p-3 rounded-lg bg-surface-container-lowest/80 flex flex-col gap-1">
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-error">remove_circle_outline</span>
                            Current Phrase (Lacks Metrics)
                          </span>
                          <p className="font-body-md text-body-md text-on-surface-variant italic">
                            “Built a distributed key-value store using Raft consensus algorithm.”
                          </p>
                        </div>
                        <div className="p-3.5 rounded-lg bg-surface-container-high/90 flex flex-col gap-1.5 shadow-xs">
                          <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-primary">auto_awesome</span>
                            EduMitra AI Recommendation (Quantified + High ATS Fit)
                          </span>
                          <p className="font-body-md text-body-md text-on-surface font-medium" id="rewrite-text-1">
                            “Architected distributed key-value store using Go &amp; Raft consensus, achieving 1,200 ops/sec with zero split-brain failure under network partition simulations.”
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[16px]">insights</span>
                          Predicted Recruiter Attention: +42%
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDismissSuggestion('rewrite-card-1')}
                            className="px-3 py-1.5 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                          >
                            Ignore
                          </button>
                          <button
                            onClick={() =>
                              handleAcceptRewrite(
                                'rewrite-card-1',
                                'Rewrite accepted and patched into Project section.'
                              )
                            }
                            className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-on-primary-fixed-variant shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">check</span>
                            <span>Accept Rewrite</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Suggestion Item 2 */}
              {!dismissedRewrites['rewrite-card-2'] && (
                <div
                  className={`p-5 rounded-xl transition-all ${
                    acceptedRewrites['rewrite-card-2']
                      ? 'bg-tertiary-fixed/20 border border-tertiary/30'
                      : 'bg-surface-container-low flex flex-col gap-4'
                  }`}
                  id="rewrite-card-2"
                >
                  {acceptedRewrites['rewrite-card-2'] ? (
                    <div className="flex items-center justify-between py-2 text-tertiary">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span className="font-label-md text-label-md font-semibold">
                          {acceptedRewrites['rewrite-card-2']}
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm bg-surface-container-lowest px-2.5 py-1 rounded text-on-surface font-medium">
                        Applied
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-md font-medium">
                            Passive Action Verb
                          </span>
                          <span className="font-label-md text-label-md text-on-surface font-semibold">
                            Experience: Software Intern @ DataPulse
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          Line 28 in Work History
                        </span>
                      </div>

                      {/* Before & After Comparison */}
                      <div className="flex flex-col gap-2.5">
                        <div className="p-3 rounded-lg bg-surface-container-lowest/80 flex flex-col gap-1">
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-error">remove_circle_outline</span>
                            Current Phrase (Passive voice)
                          </span>
                          <p className="font-body-md text-body-md text-on-surface-variant italic">
                            “Helped team with database query optimization.”
                          </p>
                        </div>
                        <div className="p-3.5 rounded-lg bg-surface-container-high/90 flex flex-col gap-1.5 shadow-xs">
                          <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-primary">auto_awesome</span>
                            EduMitra AI Recommendation (Active Lead + Quantifiable)
                          </span>
                          <p className="font-body-md text-body-md text-on-surface font-medium" id="rewrite-text-2">
                            “Optimized 14 high-frequency PostgreSQL queries by restructuring B-tree indexes, reducing p99 latency by 32%.”
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[16px]">insights</span>
                          Predicted Recruiter Attention: +35%
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDismissSuggestion('rewrite-card-2')}
                            className="px-3 py-1.5 rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                          >
                            Ignore
                          </button>
                          <button
                            onClick={() =>
                              handleAcceptRewrite(
                                'rewrite-card-2',
                                'Rewrite applied directly to Experience section.'
                              )
                            }
                            className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-on-primary-fixed-variant shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">check</span>
                            <span>Accept Rewrite</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Model Output Notification Notice */}
          <div className="p-4 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-primary">info</span>
            <span className="font-body-sm text-body-sm flex-1">
              AI Analysis Engine v2.4 (Simulated model output). Future iterations will run automated real-time LLM job description scraping from direct target portals.
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Targeted Learning Resources & Placement Readiness (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Target Company ATS Alignment Matrix */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Target Company Matrix</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    ATS parser simulation across verified employer rubrics
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">tune</span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Microsoft Azure */}
              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-primary text-[22px]">cloud_sync</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Microsoft Azure</span>
                    <span className="font-body-sm text-body-sm text-tertiary flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Strong Fit
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">91%</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Profile Match</span>
                </div>
              </div>

              {/* Razorpay Platform */}
              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-secondary text-[22px]">payments</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Razorpay Platform</span>
                    <span className="font-body-sm text-body-sm text-tertiary flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Strong Fit
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">89%</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Profile Match</span>
                </div>
              </div>

              {/* Google Cloud */}
              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-tertiary text-[22px]">hub</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Google Cloud</span>
                    <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Good Fit
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">84%</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Profile Match</span>
                </div>
              </div>

              {/* Atlassian */}
              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-outline text-[22px]">dns</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Atlassian</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> Moderate Fit
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">82%</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Profile Match</span>
                </div>
              </div>
            </div>
          </section>

          {/* Next Steps Callout Card */}
          <section className="bg-primary-container text-on-primary rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10 flex flex-col gap-3">
              <div className="inline-flex items-center gap-1.5 bg-surface-container-lowest/15 backdrop-blur-md px-3 py-1 rounded-full text-on-primary font-label-sm text-label-sm max-w-fit">
                <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">bolt</span>
                <span>Immediate Milestone</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold leading-snug">
                Optimize 3 bullet points to reach 92+ ATS score
              </h3>
              <p className="font-body-sm text-body-sm text-on-primary-container max-w-sm">
                Achieving an ATS score above 90 unlocks automated referral matching across top partner tech companies in the EduMitra network.
              </p>
            </div>
            <div className="relative z-10 mt-6 pt-4 border-t border-on-primary/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm font-semibold">+6 pts</span>
                <span className="font-label-sm text-label-sm text-on-primary-container">Potential boost</span>
              </div>
              <Link
                to="/resume-builder"
                className="px-5 py-2.5 rounded-xl bg-surface-container-lowest text-primary font-label-lg text-label-lg shadow-sm hover:bg-surface-container-low transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Edit Resume Now</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </section>

          {/* Suggested Learning Resources to Bridge Gaps */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Curricular Bridge Resources</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Recommended labs &amp; units mapped to your syllabus
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Resource 1: Campus Coursework */}
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-primary font-semibold">Campus Coursework</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface">CS412: Distributed Computing</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Unit 4 Covers Kafka, Streaming &amp; Message Brokers
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-medium">
                    B.Tech Yr 3
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                    Syllabus Matched
                  </span>
                  <button
                    onClick={() => handleAddToPlan('CS412: Distributed Computing')}
                    className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors font-medium flex items-center gap-1 shadow-xs cursor-pointer ${
                      addedCurriculum['CS412: Distributed Computing']
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold'
                        : 'bg-surface-container-lowest text-primary hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                    <span>
                      {addedCurriculum['CS412: Distributed Computing'] ? '✓ In Study Plan' : 'Add to Semester Plan'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Resource 2: Interactive Sandbox Lab */}
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-secondary font-semibold">Hands-on Sandbox Lab</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      Multi-node Raft Consensus Simulation
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Interactive 4-node cluster with network partition emulator
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-medium">
                    45 Mins
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">terminal</span>
                    EduMitra Cloud Lab
                  </span>
                  <button
                    onClick={() => {
                      setBannerMessage('Launching interactive Raft simulation sandbox in isolated sandbox node...');
                      setTimeout(() => setBannerMessage(null), 4000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm hover:bg-primary transition-colors font-medium flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    <span>Launch Lab</span>
                  </button>
                </div>
              </div>

              {/* Resource 3: Certification Track */}
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                      Recommended Credential
                    </span>
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      AWS Solutions Architect Associate
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Self-paced video modules + 3 practical projects (18h)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm font-medium">
                    External
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">stars</span>
                    Tier-1 ATS Preferred
                  </span>
                  <a
                    href="https://aws.amazon.com/certification/certified-solutions-architect-associate/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors font-medium flex items-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    <span>Explore Track</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ATS Parsing Details Accordion/Summary */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                Diagnostic Technical Telemetry
              </span>
              <span className="material-symbols-outlined text-outline text-[18px]">code</span>
            </div>
            <div className="flex flex-col gap-2 font-label-sm text-label-sm">
              <div className="flex justify-between py-1.5 text-on-surface-variant border-b border-surface-container-low">
                <span>Parser Engine Target</span>
                <span className="font-semibold text-on-surface">Greenhouse &amp; Lever Schema v4</span>
              </div>
              <div className="flex justify-between py-1.5 text-on-surface-variant border-b border-surface-container-low">
                <span>Font Encoding Integrity</span>
                <span className="font-semibold text-tertiary">100% UTF-8 Compliant</span>
              </div>
              <div className="flex justify-between py-1.5 text-on-surface-variant border-b border-surface-container-low">
                <span>Complex Table Risk</span>
                <span className="font-semibold text-tertiary">None (Clean semantic div format)</span>
              </div>
              <div className="flex justify-between py-1.5 text-on-surface-variant">
                <span>Date Normalization</span>
                <span className="font-semibold text-on-surface">ISO-8601 (YYYY-MM) standard</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysisPage;
