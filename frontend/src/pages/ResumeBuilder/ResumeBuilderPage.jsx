import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { uploadResume, getLatestResume, deleteResume } from '../../services/api';

/**
 * ResumeBuilderPage
 * Faithful, full-featured React implementation of the EduMitra AI Resume Builder & ATS Optimizer.
 * Source reference: Website UI/Resume_page_before_upload/code.html
 */
const ResumeBuilderPage = () => {
  // Current user context
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('edumitra_user')) || {};
    } catch {
      return {};
    }
  })();
  const userEmail = storedUser.email || '';
  const studentName =
    storedUser.fullName ||
    storedUser.full_name ||
    storedUser.name ||
    (storedUser.firstName ? `${storedUser.firstName} ${storedUser.lastName || ''}`.trim() : '') ||
    'Aarav Sharma';

  // File upload state
  const [activeFile, setActiveFile] = useState({
    id: null,
    name: 'Aarav_Sharma_Resume_v3.2_Draft.pdf',
    sizeFormatted: '1.4 MB',
    isDefaultShowcase: true,
  });
  const [uploadProgress, setUploadProgress] = useState(100);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [invalidFileError, setInvalidFileError] = useState(null);

  // Target role state
  const [targetRole, setTargetRole] = useState(
    'Cloud & Distributed Systems Engineer (L3/Associate)'
  );
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  // ATS Diagnostic Modal state
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);

  // Preview controls
  const [selectedTemplate, setSelectedTemplate] = useState('Deedy Tech (Systems Standard)');
  const [zoomLevel, setZoomLevel] = useState(100);

  // Accordion open/collapse states
  const [accordionsOpen, setAccordionsOpen] = useState({
    education: true,
    skills: true,
    projects: true,
    experience: true,
  });

  const toggleAccordion = (key) => {
    setAccordionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Keywords State
  const [keywords, setKeywords] = useState([
    'Distributed Systems',
    'Kubernetes',
    'Go/Golang',
    'POSIX Concurrency',
  ]);
  const [customKeywordInput, setCustomKeywordInput] = useState('');

  // Resume Form Data (Reactive with live preview)
  const [formData, setFormData] = useState({
    fullName: studentName.toUpperCase(),
    location: 'Karnataka, India',
    email: userEmail || 'aarav.sharma@nitk.edu.in',
    phone: '+91 98765 43210',
    github: 'github.com/aarav-cs',
    degree: 'B.Tech in Computer Science and Engineering',
    institution: 'National Institute of Technology Karnataka, Surathkal',
    cgpa: '8.85 / 10.0',
    expectedCompletion: 'May 2026',
    coursework: [
      'Distributed Systems',
      'Operating Systems Kernel Design',
      'Computer Architecture',
      'Advanced Data Structures',
    ],
    languages: ['C++ (Modern C++20)', 'Go (Golang)', 'Python', 'Bash/POSIX Shell'],
    systems: [
      'Distributed Consensus (Raft)',
      'POSIX Threads & Mutexes',
      'Docker',
      'Apache Kafka',
    ],
    databases: ['PostgreSQL (WAL internals)', 'Redis (In-memory caching)'],
  });

  const fileInputRef = useRef(null);

  // Load latest resume on mount
  useEffect(() => {
    if (userEmail) {
      loadLatestResume();
    }
  }, [userEmail]);

  const loadLatestResume = async () => {
    try {
      const res = await getLatestResume(userEmail);
      if (res.status === 'success' && res.data) {
        setActiveFile({
          id: res.data.id,
          name: res.data.file_name,
          sizeFormatted: res.data.file_size_formatted || '1.4 MB',
          isDefaultShowcase: false,
        });
        if (res.data.target_role) {
          setTargetRole(res.data.target_role);
        }
      }
    } catch (err) {
      console.error('Error loading latest resume:', err);
    }
  };

  // File validation
  const validateFile = (file) => {
    const validExtensions = ['.pdf', '.docx'];
    const nameLower = file.name.toLowerCase();
    const isValidExt = validExtensions.some((ext) => nameLower.endsWith(ext));

    if (!isValidExt) {
      return `Only .pdf and .docx documents under 10MB are supported. "${file.name}" was rejected.`;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return `File size exceeds 10MB limit. "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`;
    }

    return null;
  };

  // Upload handler
  const handleFileUpload = async (file) => {
    if (!file) return;

    const errorMsg = validateFile(file);
    if (errorMsg) {
      setInvalidFileError(errorMsg);
      return;
    }

    setInvalidFileError(null);
    setUploading(true);
    setUploadProgress(20);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    try {
      const formPayload = new FormData();
      formPayload.append('file', file);
      formPayload.append('target_role', targetRole);

      const res = await uploadResume(formPayload, userEmail);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.status === 'success' && res.data) {
        setActiveFile({
          id: res.data.id,
          name: res.data.file_name,
          sizeFormatted: res.data.file_size_formatted || `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          isDefaultShowcase: false,
        });
      }
    } catch (err) {
      clearInterval(progressInterval);
      setInvalidFileError(err.message || 'Resume upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // File input change
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Drag and Drop handlers
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Remove file
  const handleRemoveFile = async () => {
    if (activeFile.id) {
      try {
        await deleteResume(activeFile.id, userEmail);
      } catch (err) {
        console.error('Error deleting resume:', err);
      }
    }
    setActiveFile(null);
  };

  // Trigger file re-select
  const handleTriggerBrowse = () => {
    fileInputRef.current?.click();
  };

  // Add custom keyword
  const handleAddKeyword = (kw) => {
    const val = kw || customKeywordInput.trim();
    if (!val) return;
    if (!keywords.includes(val)) {
      setKeywords((prev) => [...prev, val]);
    }
    setCustomKeywordInput('');
  };

  const handleRemoveKeyword = (kw) => {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  };

  // Coursework management
  const handleRemoveCourse = (course) => {
    setFormData((prev) => ({
      ...prev,
      coursework: prev.coursework.filter((c) => c !== course),
    }));
  };

  const handleAddCourse = () => {
    const newCourse = window.prompt('Enter course title to add:');
    if (newCourse && newCourse.trim()) {
      setFormData((prev) => ({
        ...prev,
        coursework: [...prev.coursework, newCourse.trim()],
      }));
    }
  };

  const handleAddSkill = () => {
    const newSkill = window.prompt('Enter technical skill or tool:');
    if (newSkill && newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        systems: [...prev.systems, newSkill.trim()],
      }));
    }
  };

  // Zoom controls
  const handleZoom = (delta) => {
    setZoomLevel((prev) => {
      const next = prev + delta;
      return next >= 60 && next <= 150 ? next : prev;
    });
  };

  const handleFit = () => {
    setZoomLevel(100);
  };

  const handlePrintExport = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full pb-16 px-4 sm:px-8 pt-4">
      {/* Top Command & Action Bar */}
      <section className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                Workspace v3.4
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
                ATS Scanner Synchronized
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface">
              AI Resume Builder &amp; ATS Optimizer
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Craft an engineering-focused resume aligned with your target tech roles, coursework projects, and verified GitHub telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Target Job Role Selector */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Target Specialization
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      {targetRole}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm whitespace-nowrap">
                      Matches 92% Career Goal
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowRoleSelector(!showRoleSelector)}
                  className="text-on-surface-variant hover:text-primary transition-colors p-1 cursor-pointer"
                  title="Change target role"
                >
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                </button>
              </div>

              {/* Target Role Dropdown */}
              {showRoleSelector && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-2 z-50">
                  <div className="px-3 py-1 font-label-sm text-label-sm text-outline uppercase font-semibold">
                    Select Target Specialization
                  </div>
                  {[
                    'Cloud & Distributed Systems Engineer (L3/Associate)',
                    'Backend Infrastructure & Systems Engineer',
                    'Systems Software & Kernel Development Intern',
                    'Full Stack Platform Engineer (L3)',
                  ].map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setTargetRole(role);
                        setShowRoleSelector(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-body-sm hover:bg-surface-container transition-colors flex items-center justify-between ${
                        targetRole === role ? 'text-primary font-semibold' : 'text-on-surface'
                      }`}
                    >
                      <span>{role}</span>
                      {targetRole === role && (
                        <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action CTAs */}
            <button
              onClick={handleTriggerBrowse}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">cloud_upload</span>
              <span>Upload Resume</span>
            </button>
            <button
              onClick={() => setIsAtsModalOpen(true)}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all shadow-md cursor-pointer"
              id="analyze-ats-btn"
            >
              <span className="material-symbols-outlined text-[20px]">insights</span>
              <span>Analyze with AI ATS</span>
            </button>
          </div>
        </div>
      </section>

      {/* Two-Column Master Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Form & Section Editor (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          {/* Upload Hub Panel */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">upload_file</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Resume Ingestion &amp; Parsing
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Telemetry OCR v2.8 Active
              </span>
            </div>

            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              accept=".pdf,.docx"
              className="hidden"
              type="file"
              onChange={onFileChange}
            />

            {/* Drag & Drop PDF Dropzone */}
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={handleTriggerBrowse}
              className={`group relative flex flex-col items-center justify-center p-8 rounded-xl transition-all cursor-pointer ${
                dragOver
                  ? 'bg-surface-container-high border-2 border-dashed border-primary scale-[1.01]'
                  : 'bg-surface-container-low hover:bg-surface-container border-2 border-transparent'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mb-3 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
              </div>
              <p className="font-label-lg text-label-lg text-on-surface mb-1">
                <span className="font-semibold text-primary underline underline-offset-4">Browse Files</span>{' '}
                or drag &amp; drop your resume PDF here
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Supports PDF, DOCX up to 10MB • Auto-parsed into editable JSON telemetry
              </p>
            </div>

            {/* Active Upload State Card */}
            {activeFile && (
              <div className="flex flex-col p-4 rounded-xl bg-surface-container gap-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate max-w-[280px]">
                        {activeFile.name}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {activeFile.sizeFormatted} • Parsed via EduMitra LLM
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      {uploading ? `Uploading ${uploadProgress}%` : 'Upload Complete'}
                    </span>
                    <button
                      onClick={handleTriggerBrowse}
                      className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                      title="Replace file"
                    >
                      <span className="material-symbols-outlined text-[18px]">cached</span>
                    </button>
                    <button
                      onClick={handleRemoveFile}
                      className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary-container h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Invalid File Alert State */}
            {invalidFileError && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-error-container text-on-error-container">
                <span className="material-symbols-outlined text-[20px] text-error shrink-0 mt-0.5">error</span>
                <div className="flex flex-col flex-1">
                  <span className="font-label-sm text-label-sm font-semibold text-error">
                    Invalid file format rejected
                  </span>
                  <span className="font-body-sm text-body-sm text-on-error-container">
                    {invalidFileError}
                  </span>
                </div>
                <button
                  onClick={() => setInvalidFileError(null)}
                  className="text-error hover:opacity-80 p-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}
          </section>

          {/* Target Alignment & Keyword Tags Section */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">hub</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Target Keyword &amp; ATS Density
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-medium">
                {keywords.length} Target Keywords Active
              </span>
            </div>

            <div className="relative">
              <input
                value={customKeywordInput}
                onChange={(e) => setCustomKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                className="w-full h-11 pl-4 pr-10 rounded-xl bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-all"
                placeholder="Add custom keyword or target competency..."
                type="text"
              />
              <button
                onClick={() => handleAddKeyword()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">
                Active &amp; Auto-suggested for L3 Cloud:
              </span>
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm"
                >
                  <span>+ {kw}</span>
                  <button
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              ))}

              {/* Suggestions to click */}
              {['Distributed Systems', 'Kubernetes', 'Go/Golang', 'POSIX Concurrency']
                .filter((s) => !keywords.includes(s))
                .map((suggested) => (
                  <button
                    key={suggested}
                    onClick={() => handleAddKeyword(suggested)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <span>+ {suggested}</span>
                  </button>
                ))}
            </div>
          </section>

          {/* Interactive Resume Section Editor Accordions */}
          <section className="flex flex-col gap-4">
            {/* Accordion 1: Education */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <div
                onClick={() => toggleAccordion('education')}
                className="flex items-center justify-between p-5 bg-surface-container-lowest cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px]">school</span>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      Education &amp; Academic Credential
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      B.Tech CS • NIT Surathkal (Graduation 2026)
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">
                  {accordionsOpen.education ? 'expand_less' : 'expand_more'}
                </span>
              </div>

              {accordionsOpen.education && (
                <div className="p-6 pt-2 flex flex-col gap-4 bg-surface-container-lowest">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">Degree &amp; Major</label>
                      <input
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        className="h-10 px-3.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container transition-all"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">Institution Name</label>
                      <input
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        className="h-10 px-3.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container transition-all"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">CGPA / Percentage</label>
                      <input
                        value={formData.cgpa}
                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                        className="h-10 px-3.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container transition-all"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">Expected Completion</label>
                      <input
                        value={formData.expectedCompletion}
                        onChange={(e) => setFormData({ ...formData, expectedCompletion: e.target.value })}
                        className="h-10 px-3.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container transition-all"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Verified Coursework Chips</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.coursework.map((course) => (
                        <span
                          key={course}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm"
                        >
                          {course}
                          <span
                            onClick={() => handleRemoveCourse(course)}
                            className="material-symbols-outlined text-[14px] cursor-pointer hover:text-error"
                          >
                            close
                          </span>
                        </span>
                      ))}
                      <button
                        onClick={handleAddCourse}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-container-high text-primary font-label-sm text-label-sm hover:bg-surface-container-highest transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span> Add Course
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Skills & Tech Stack */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-4">
              <div
                onClick={() => toggleAccordion('skills')}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px]">code</span>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      Skills &amp; Systems Stack
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Telemetry-verified programming proficiencies
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddSkill();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span> Add Skill
                  </button>
                  <span className="material-symbols-outlined text-on-surface-variant">
                    {accordionsOpen.skills ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </div>

              {accordionsOpen.skills && (
                <div className="flex flex-col gap-3 pt-2">
                  {/* Languages */}
                  <div className="flex items-baseline gap-3">
                    <span className="font-label-sm text-label-sm text-on-surface-variant w-24 shrink-0 font-medium">
                      Languages:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface font-body-sm text-body-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Systems & Infra */}
                  <div className="flex items-baseline gap-3">
                    <span className="font-label-sm text-label-sm text-on-surface-variant w-24 shrink-0 font-medium">
                      Systems:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.systems.map((sys) => (
                        <span
                          key={sys}
                          className="px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface font-body-sm text-body-sm"
                        >
                          {sys}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Databases */}
                  <div className="flex items-baseline gap-3">
                    <span className="font-label-sm text-label-sm text-on-surface-variant w-24 shrink-0 font-medium">
                      Databases:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.databases.map((db) => (
                        <span
                          key={db}
                          className="px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface font-body-sm text-body-sm"
                        >
                          {db}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Projects */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-5">
              <div
                onClick={() => toggleAccordion('projects')}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px]">terminal</span>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      Systems &amp; Systems Coursework Projects
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Algorithmic metrics and verified implementations
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.alert('Add Project Modal is ready for detailed bullet points.');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-container-high text-primary font-label-md text-label-md hover:bg-surface-container-highest transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span> + Add New Project
                  </button>
                  <span className="material-symbols-outlined text-on-surface-variant">
                    {accordionsOpen.projects ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </div>

              {accordionsOpen.projects && (
                <div className="space-y-4 pt-1">
                  {/* Project 1 */}
                  <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="font-headline-sm text-headline-sm text-on-surface">
                            Distributed Key-Value Store with Raft Consensus
                          </h4>
                          <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm">
                            High ATS Impact
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-body-sm text-body-sm text-primary font-medium">
                            Go • gRPC • Protocol Buffers • LevelDB
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                          title="Edit project"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          className="p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant pl-4 list-disc">
                      <li>
                        Architected an asynchronous leader-election and state replication engine in Go, sustaining up to{' '}
                        <strong className="text-on-surface">14,200 write ops/sec</strong> across a simulated 5-node cluster.
                      </li>
                      <li>
                        Mitigated log compaction overhead by 42% via periodic state snapshots stored concurrently in memory with thread-safe copy-on-write pointers.
                      </li>
                      <li>
                        Integrated linearizable read semantics with zero-downtime cluster reconfiguration via serialized Raft RPC handshakes.
                      </li>
                    </ul>
                  </div>

                  {/* Project 2 */}
                  <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="font-headline-sm text-headline-sm text-on-surface">
                            B+ Tree Concurrency Engine
                          </h4>
                          <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                            Course Capstone
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-body-sm text-body-sm text-primary font-medium">
                            Modern C++20 • pthread • Valgrind • CMake
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                          title="Edit project"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          className="p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant pl-4 list-disc">
                      <li>
                        Engineered a thread-safe disk-backed B+ tree index utilizing latch crabbing protocols for concurrent point queries and range traversals.
                      </li>
                      <li>
                        Eliminated lock-contention hotspots by optimizing node splitting logic with optimistic concurrency controls, boosting multicore throughput by 28%.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 4: Experience / Internships */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-4">
              <div
                onClick={() => toggleAccordion('experience')}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px]">work</span>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      Work Experience &amp; Internships
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Validated professional contributions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.alert('Add Work Experience dialogue.');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-container-high text-primary font-label-md text-label-md hover:bg-surface-container-highest transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span> + Add Work Experience
                  </button>
                  <span className="material-symbols-outlined text-on-surface-variant">
                    {accordionsOpen.experience ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </div>

              {accordionsOpen.experience && (
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3 mt-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface">
                        Backend Engineering Intern
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        TechCorp Labs • Bangalore, India (Summer 2024)
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant pl-4 list-disc">
                    <li>
                      Engineered 4 idempotent asynchronous payment webhooks with Kafka consumer groups, processing over 120,000 requests/day with sub-80ms p99 latency.
                    </li>
                    <li>
                      Refactored legacy SQL query chains into parameterized connection pools, trimming Redis cache miss overhead by 31%.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Live Resume Document Preview & Action Bar (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col gap-4 xl:sticky xl:top-20">
          {/* Preview Header Controls Bar */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              {/* Template Switcher Dropdown */}
              <div className="relative inline-block">
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="h-9 pl-3 pr-8 rounded-lg bg-surface-container-low font-label-md text-label-md text-on-surface font-semibold appearance-none focus:outline-none focus:bg-surface-container cursor-pointer"
                >
                  <option value="Deedy Tech (Systems Standard)">Deedy Tech (Systems Standard)</option>
                  <option value="Modern Minimalist">Modern Minimalist</option>
                  <option value="Academic Standard (MIT Style)">Academic Standard (MIT Style)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-on-surface-variant">
                  arrow_drop_down
                </span>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center bg-surface-container-low rounded-lg p-0.5">
                <button
                  onClick={() => handleZoom(-10)}
                  className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                  title="Zoom out"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="font-label-sm text-label-sm px-2 text-on-surface">{zoomLevel}%</span>
                <button
                  onClick={() => handleZoom(10)}
                  className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                  title="Zoom in"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFit}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">fit_screen</span>
                <span>Fit</span>
              </button>
              <button
                onClick={handlePrintExport}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Live A4-Styled Resume Sheet Canvas */}
          <div className="bg-surface-container-low rounded-xl p-4 shadow-inner flex justify-center overflow-x-auto">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className={`bg-surface-container-lowest text-on-surface w-full max-w-[560px] min-h-[792px] p-8 shadow-md rounded-lg flex flex-col font-body-sm text-body-sm leading-relaxed transition-transform duration-150 ${
                selectedTemplate === 'Modern Minimalist'
                  ? 'font-sans'
                  : selectedTemplate === 'Academic Standard (MIT Style)'
                  ? 'font-serif'
                  : ''
              }`}
            >
              {/* Resume Header: Name & Contact */}
              <div className="flex flex-col items-center text-center pb-4 border-b border-surface-container-high">
                <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface font-bold">
                  {formData.fullName}
                </h1>
                <p className="font-label-md text-label-md text-on-surface-variant mt-1 flex flex-wrap justify-center gap-2">
                  <span>{formData.location}</span> •{' '}
                  <span className="text-primary font-medium">{formData.email}</span> •{' '}
                  <span>{formData.phone}</span> •{' '}
                  <span className="text-secondary font-medium">{formData.github}</span>
                </p>
              </div>

              {/* Section: Education */}
              <div className="mt-4">
                <h2 className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold pb-1 border-b border-surface-container-high">
                  EDUCATION
                </h2>
                <div className="flex justify-between items-baseline mt-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    {formData.institution}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Expected {formData.expectedCompletion}
                  </span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-body-sm">
                  <span>{formData.degree}</span>
                  <span className="font-semibold text-on-surface">CGPA: {formData.cgpa}</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  <strong className="text-on-surface">Relevant Coursework:</strong>{' '}
                  {formData.coursework.join(', ')}.
                </p>
              </div>

              {/* Section: Skills */}
              <div className="mt-4">
                <h2 className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold pb-1 border-b border-surface-container-high">
                  TECHNICAL SKILLS
                </h2>
                <div className="flex flex-col gap-1 mt-2 font-body-sm text-body-sm">
                  <div>
                    <strong className="text-on-surface">Languages:</strong> {formData.languages.join(', ')}.
                  </div>
                  <div>
                    <strong className="text-on-surface">Systems &amp; Frameworks:</strong>{' '}
                    {formData.systems.join(', ')}.
                  </div>
                  <div>
                    <strong className="text-on-surface">Databases &amp; Tools:</strong>{' '}
                    {formData.databases.join(', ')}.
                  </div>
                </div>
              </div>

              {/* Section: Experience */}
              <div className="mt-4">
                <h2 className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold pb-1 border-b border-surface-container-high">
                  EXPERIENCE
                </h2>
                <div className="mt-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      TechCorp Labs
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">May 2024 – Jul 2024</span>
                  </div>
                  <div className="font-body-sm text-body-sm text-secondary font-medium">
                    Backend Engineering Intern • Bangalore, India
                  </div>
                  <ul className="list-disc pl-4 mt-1.5 space-y-1 text-on-surface-variant">
                    <li>
                      Engineered 4 idempotent asynchronous payment webhooks with Kafka consumer groups, processing over 120,000 requests/day with sub-80ms p99 latency.
                    </li>
                    <li>
                      Refactored legacy SQL query chains into parameterized connection pools, trimming Redis cache miss overhead by 31%.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section: Projects */}
              <div className="mt-4">
                <h2 className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold pb-1 border-b border-surface-container-high">
                  KEY PROJECTS
                </h2>
                <div className="mt-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Distributed Key-Value Store with Raft
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Dec 2024</span>
                  </div>
                  <div className="font-body-sm text-body-sm text-primary font-medium">
                    Go, gRPC, Protocol Buffers, LevelDB
                  </div>
                  <ul className="list-disc pl-4 mt-1 space-y-1 text-on-surface-variant">
                    <li>
                      Architected an asynchronous leader-election and state replication engine in Go, sustaining up to 14,200 write ops/sec across a simulated 5-node cluster.
                    </li>
                    <li>
                      Mitigated log compaction overhead by 42% via periodic state snapshots stored concurrently in memory.
                    </li>
                  </ul>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      B+ Tree Concurrency Engine
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Aug 2024</span>
                  </div>
                  <div className="font-body-sm text-body-sm text-primary font-medium">
                    Modern C++20, pthread, Valgrind
                  </div>
                  <ul className="list-disc pl-4 mt-1 space-y-1 text-on-surface-variant">
                    <li>
                      Engineered a thread-safe disk-backed B+ tree index utilizing latch crabbing protocols for concurrent point queries and range traversals.
                    </li>
                    <li>
                      Optimized node splitting logic with optimistic concurrency controls, boosting multicore throughput by 28%.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ATS Ready Notification / Floating Trigger */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant shrink-0">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-semibold text-on-surface">
                  ATS Readiness State: Online
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  AI Resume Analysis &amp; ATS Matching Engine is ready for scanning.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsAtsModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-sm whitespace-nowrap cursor-pointer"
              id="floating-ats-trigger"
            >
              Scan Resume
            </button>
          </div>
        </div>
      </div>

      {/* Interactive ATS Analysis Result Drawer (Modal / Overlay) */}
      {isAtsModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAtsModalOpen(false);
          }}
          className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          id="ats-modal"
        >
          <div className="bg-surface-container-lowest rounded-xl max-w-2xl w-full p-6 shadow-xl flex flex-col gap-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    ATS Diagnostic Complete
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Target: {targetRole}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAtsModalOpen(false)}
                className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                id="close-ats-modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Score Ring & Metric Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-container-low text-center">
                <span className="font-display-lg text-display-lg text-primary font-bold">92%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Match Score
                </span>
                <span className="mt-1 font-body-sm text-body-sm text-on-surface">
                  Tier-1 Shortlist Probable
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-container-low text-center">
                <span className="font-display-lg text-display-lg text-secondary font-bold">14</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Keywords Matched
                </span>
                <span className="mt-1 font-body-sm text-body-sm text-on-surface">
                  Raft, POSIX, Concurrency
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-container-low text-center">
                <span className="font-display-lg text-display-lg text-tertiary font-bold">100%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Format Integrity
                </span>
                <span className="mt-1 font-body-sm text-body-sm text-on-surface">
                  Clean Single-Page A4
                </span>
              </div>
            </div>

            {/* Actionable Insights List */}
            <div className="flex flex-col gap-2.5">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Actionable Recommendations:
              </span>
              <div className="p-3.5 rounded-lg bg-surface-container-low flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <p className="font-body-sm text-body-sm text-on-surface">
                  <strong>Strong Quantifiable Bullets:</strong> The Raft Consensus project clearly states 14,200 write ops/sec. Keep this at the top of the projects block.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-surface-container-low flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  tips_and_updates
                </span>
                <p className="font-body-sm text-body-sm text-on-surface">
                  <strong>Suggested Addition:</strong> Mention container orchestration (e.g. Kubernetes, Helm) in TechCorp Labs internship to bridge cloud infra keywords.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsAtsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
                id="close-ats-modal-btn"
              >
                Dismiss
              </button>
              <Link
                to="/resume-analysis"
                className="px-4 py-2.5 rounded-xl bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">assessment</span>
                <span>View Full ATS Report</span>
              </Link>
              <button
                onClick={() => {
                  handleAddKeyword('Kubernetes');
                  setIsAtsModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-sm cursor-pointer"
              >
                Apply Suggested Edits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilderPage;
