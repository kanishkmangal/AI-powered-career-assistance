import { useState, useEffect, useMemo } from 'react';
import { getStudentProfile, updateStudentProfile } from '../../services/api';

const DEGREE_PROGRAMS = [
  { code: 'B.Tech', label: 'Bachelor of Technology (B.Tech)', defaultYears: 4 },
  { code: 'B.E.', label: 'Bachelor of Engineering (B.E.)', defaultYears: 4 },
  { code: 'B.Sc.', label: 'Bachelor of Science (B.Sc.)', defaultYears: 3 },
  { code: 'BCA', label: 'Bachelor of Computer Applications (BCA)', defaultYears: 3 },
  { code: 'M.Tech', label: 'Master of Technology (M.Tech)', defaultYears: 2 },
  { code: 'M.E.', label: 'Master of Engineering (M.E.)', defaultYears: 2 },
  { code: 'M.Sc.', label: 'Master of Science (M.Sc.)', defaultYears: 2 },
  { code: 'MCA', label: 'Master of Computer Applications (MCA)', defaultYears: 2 },
  { code: 'Other', label: 'Other Degree / Diploma Program', defaultYears: 4 },
];

const getOrdinal = (n) => {
  const num = parseInt(n, 10);
  if (isNaN(num)) return `${n}th`;
  if (num % 100 >= 11 && num % 100 <= 13) return `${num}th`;
  const lastDigit = num % 10;
  if (lastDigit === 1) return `${num}st`;
  if (lastDigit === 2) return `${num}nd`;
  if (lastDigit === 3) return `${num}rd`;
  return `${num}th`;
};

const getAcademicStanding = (year, sem) => {
  return `${getOrdinal(year)} Year • Semester ${sem}`;
};

export default function MyProfilePage() {
  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem('edumitra_user')) || {};
    } catch {
      return {};
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [formData, setFormData] = useState(() => {
    const cur = getStoredUser();
    const curYear = cur.currentYear || 3;
    const curSem = cur.currentSemester || 5;
    return {
      firstName: cur.firstName || (cur.fullName ? cur.fullName.split(' ')[0] : 'Student'),
      lastName: cur.lastName || (cur.fullName ? cur.fullName.split(' ').slice(1).join(' ') : ''),
      email: cur.email || 'teacher.demo@university.edu',
      personalEmail: cur.personalEmail || '',
      phone: cur.phone || '',
      timezone: cur.timezone || 'Asia/Kolkata (IST)',
      city: cur.city || 'Bengaluru, India',
      bio: cur.bio || 'Passionate CS undergraduate focusing on distributed backend systems, OS internals, and algorithmic problem-solving.',
      degree: cur.degree || 'B.Tech',
      degreeDurationYears: cur.degreeDurationYears || 4,
      branch: cur.branch || 'Computer Science & Engineering',
      institution: cur.institution || 'National Institute of Technology (NIT)',
      currentYear: curYear,
      currentSemester: curSem,
      academicStanding: cur.academicStanding || getAcademicStanding(curYear, curSem),
      graduation: cur.graduation || 'May 2026',
      rollNumber: cur.rollNumber || '12320146',
      targetDomain: cur.targetDomain || 'Distributed Systems',
    };
  });

  const [initialData, setInitialData] = useState(null);

  const [semesterRecords, setSemesterRecords] = useState([
    { semester_number: 1, sgpa: '8.40', max_scale: '10.00', credits_earned: '22' },
    { semester_number: 2, sgpa: '8.65', max_scale: '10.00', credits_earned: '24' },
    { semester_number: 3, sgpa: '8.70', max_scale: '10.00', credits_earned: '23' },
    { semester_number: 4, sgpa: '8.95', max_scale: '10.00', credits_earned: '24' },
    { semester_number: 5, sgpa: '8.85', max_scale: '10.00', credits_earned: '20' },
  ]);

  const [initialSemesterRecords, setInitialSemesterRecords] = useState(null);

  const [skills, setSkills] = useState([
    { id: 1, name: 'C++', level: 'Advanced', levelClass: 'bg-tertiary/10 text-tertiary' },
    { id: 2, name: 'Go (Golang)', level: 'Intermediate', levelClass: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
    { id: 3, name: 'Python', level: 'Proficient', levelClass: 'bg-primary-fixed text-on-primary-fixed-variant' },
    { id: 4, name: 'SQL', level: 'Advanced', levelClass: 'bg-tertiary/10 text-tertiary' },
    { id: 5, name: 'TypeScript', level: 'Intermediate', levelClass: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
  ]);

  // Backend loader
  const populateFromBackend = (data) => {
    const prog = DEGREE_PROGRAMS.find(d => d.code === data.degree || d.label === data.degree);
    const duration = data.degree_duration_years || (prog ? prog.defaultYears : 4);
    const curYear = data.current_year || 1;
    const curSem = data.current_semester || 1;

    const mapped = {
      firstName: data.first_name || (data.full_name ? data.full_name.split(' ')[0] : 'Student'),
      lastName: data.last_name || (data.full_name ? data.full_name.split(' ').slice(1).join(' ') : ''),
      email: data.email || '',
      personalEmail: data.personal_email || '',
      phone: data.phone_number || '',
      timezone: data.timezone || 'Asia/Kolkata (IST)',
      city: data.city || 'Bengaluru, India',
      bio: data.bio || '',
      degree: data.degree || 'B.Tech',
      degreeDurationYears: duration,
      branch: data.branch || 'Computer Science & Engineering',
      institution: data.institution || '',
      currentYear: curYear,
      currentSemester: curSem,
      academicStanding: data.academic_standing || getAcademicStanding(curYear, curSem),
      graduation: data.expected_graduation || 'May 2026',
      rollNumber: data.roll_number || '',
      targetDomain: data.target_domain || 'Distributed Systems',
    };

    setFormData(mapped);
    setInitialData(mapped);

    if (data.semester_records && data.semester_records.length > 0) {
      const recs = data.semester_records.map(r => ({
        semester_number: r.semester_number,
        sgpa: r.sgpa !== null && r.sgpa !== undefined ? String(r.sgpa) : '',
        max_scale: r.max_scale ? String(r.max_scale) : '10.00',
        credits_earned: r.credits_earned !== null && r.credits_earned !== undefined ? String(r.credits_earned) : '',
      }));
      setSemesterRecords(recs);
      setInitialSemesterRecords(recs);
    } else {
      setInitialSemesterRecords([]);
    }

    setHasChanges(false);
  };

  useEffect(() => {
    const user = getStoredUser();
    const email = user.email;
    if (!email) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getStudentProfile(email)
      .then(res => {
        if (res && res.data) {
          populateFromBackend(res.data);
        }
      })
      .catch(err => {
        console.warn('Could not load profile from Neon DB:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleDegreeChange = (newDegree) => {
    const prog = DEGREE_PROGRAMS.find(d => d.code === newDegree);
    const newDuration = prog ? prog.defaultYears : formData.degreeDurationYears;
    
    let newYear = formData.currentYear;
    if (newYear > newDuration) newYear = newDuration;

    let newSem = formData.currentSemester;
    if (newSem > newDuration * 2) newSem = newDuration * 2;

    const newStanding = getAcademicStanding(newYear, newSem);

    setFormData(prev => ({
      ...prev,
      degree: newDegree,
      degreeDurationYears: newDuration,
      currentYear: newYear,
      currentSemester: newSem,
      academicStanding: newStanding,
    }));
    setHasChanges(true);
  };

  const handleYearChange = (yearVal) => {
    const year = parseInt(yearVal, 10);
    const minSem = (year - 1) * 2 + 1;
    const maxSem = year * 2;
    let sem = formData.currentSemester;
    if (sem < minSem || sem > maxSem) {
      sem = minSem;
    }
    const standing = getAcademicStanding(year, sem);
    setFormData(prev => ({
      ...prev,
      currentYear: year,
      currentSemester: sem,
      academicStanding: standing,
    }));
    setHasChanges(true);
  };

  const handleSemesterChange = (semVal) => {
    const sem = parseInt(semVal, 10);
    const year = Math.ceil(sem / 2);
    const standing = getAcademicStanding(year, sem);
    setFormData(prev => ({
      ...prev,
      currentSemester: sem,
      currentYear: year,
      academicStanding: standing,
    }));
    setHasChanges(true);
  };

  const handleSemesterRecordChange = (semNum, field, val) => {
    setSemesterRecords(prev => {
      const next = [...prev];
      const idx = next.findIndex(r => r.semester_number === semNum);
      if (idx >= 0) {
        next[idx] = { ...next[idx], [field]: val };
      } else {
        next.push({
          semester_number: semNum,
          sgpa: field === 'sgpa' ? val : '',
          max_scale: '10.00',
          credits_earned: field === 'credits_earned' ? val : '',
        });
      }
      return next;
    });
    setHasChanges(true);
  };

  // Build full list of semester slots from 1 to currentSemester
  const mergedSemesterList = useMemo(() => {
    const list = [];
    const curSem = parseInt(formData.currentSemester, 10) || 1;
    for (let s = 1; s <= curSem; s++) {
      const found = semesterRecords.find(r => r.semester_number === s);
      if (found) {
        list.push(found);
      } else {
        list.push({
          semester_number: s,
          sgpa: '',
          max_scale: '10.00',
          credits_earned: '',
        });
      }
    }
    return list;
  }, [semesterRecords, formData.currentSemester]);

  // Dynamic CGPA & Trajectory metrics
  const metrics = useMemo(() => {
    const valid = mergedSemesterList.filter(
      r => r.sgpa !== '' && !isNaN(parseFloat(r.sgpa)) && parseFloat(r.sgpa) >= 0
    );

    if (valid.length === 0) {
      return {
        hasData: false,
        cgpa: null,
        cgpaDisplay: 'N/A',
        isCreditWeighted: false,
        totalCredits: 0,
        minGpa: 'N/A',
        peakGpa: 'N/A',
        peakSem: null,
        delta: null,
        points: [],
      };
    }

    const allCreditsPresent = valid.every(
      r => r.credits_earned && !isNaN(parseInt(r.credits_earned, 10)) && parseInt(r.credits_earned, 10) > 0
    );

    let totalCredits = 0;
    let cgpa = 0;

    if (allCreditsPresent) {
      totalCredits = valid.reduce((acc, r) => acc + parseInt(r.credits_earned, 10), 0);
      const weightedSum = valid.reduce((acc, r) => acc + (parseFloat(r.sgpa) * parseInt(r.credits_earned, 10)), 0);
      cgpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : (0).toFixed(2);
    } else {
      totalCredits = valid.reduce((acc, r) => acc + (parseInt(r.credits_earned, 10) || 0), 0);
      const sum = valid.reduce((acc, r) => acc + parseFloat(r.sgpa), 0);
      cgpa = (sum / valid.length).toFixed(2);
    }

    const numericSgpas = valid.map(r => parseFloat(r.sgpa));
    const minGpa = Math.min(...numericSgpas).toFixed(2);

    let peakRecord = valid[0];
    for (const r of valid) {
      if (parseFloat(r.sgpa) > parseFloat(peakRecord.sgpa)) {
        peakRecord = r;
      }
    }

    const firstGpa = parseFloat(valid[0].sgpa);
    const lastGpa = parseFloat(valid[valid.length - 1].sgpa);
    const deltaNum = (lastGpa - firstGpa).toFixed(2);
    const delta = `${deltaNum >= 0 ? '+' : ''}${deltaNum} since Sem ${valid[0].semester_number}`;

    const n = valid.length;
    const minY = 5.0;
    const maxY = 10.0;
    const points = valid.map((r, i) => {
      const x = n === 1 ? 190 : Math.round(30 + (i * (320 / (n - 1))));
      const val = Math.max(0, Math.min(10, parseFloat(r.sgpa)));
      const y = Math.round(105 - ((val - minY) / (maxY - minY)) * 85);
      const clampedY = Math.max(18, Math.min(108, y));
      return { x, y: clampedY, sem: r.semester_number, sgpa: parseFloat(r.sgpa).toFixed(2) };
    });

    return {
      hasData: true,
      cgpa,
      cgpaDisplay: `${cgpa} / 10.0`,
      isCreditWeighted: allCreditsPresent,
      totalCredits,
      minGpa,
      peakGpa: parseFloat(peakRecord.sgpa).toFixed(2),
      peakSem: peakRecord.semester_number,
      delta,
      points,
    };
  }, [mergedSemesterList]);

  const handleDiscard = () => {
    if (initialData) {
      setFormData(initialData);
    }
    if (initialSemesterRecords) {
      setSemesterRecords(initialSemesterRecords);
    }
    setHasChanges(false);
    setErrorMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const curSem = parseInt(formData.currentSemester, 10) || 1;
      const validRecords = semesterRecords
        .filter(r => r.semester_number <= curSem && r.sgpa !== '' && !isNaN(parseFloat(r.sgpa)))
        .map(r => ({
          semester_number: r.semester_number,
          sgpa: parseFloat(r.sgpa).toFixed(2),
          max_scale: r.max_scale ? parseFloat(r.max_scale).toFixed(2) : '10.00',
          credits_earned: r.credits_earned !== '' && !isNaN(parseInt(r.credits_earned, 10))
            ? parseInt(r.credits_earned, 10)
            : null,
        }));

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        personal_email: formData.personalEmail,
        phone_number: formData.phone,
        timezone: formData.timezone,
        city: formData.city,
        bio: formData.bio,
        target_domain: formData.targetDomain,
        institution: formData.institution,
        degree: formData.degree,
        branch: formData.branch,
        degree_duration_years: parseInt(formData.degreeDurationYears, 10) || 4,
        current_year: parseInt(formData.currentYear, 10) || 1,
        current_semester: curSem,
        expected_graduation: formData.graduation,
        roll_number: formData.rollNumber,
        semester_records: validRecords,
      };

      const res = await updateStudentProfile(formData.email, payload);
      if (res && res.status === 'success' && res.data) {
        populateFromBackend(res.data);
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 3500);

        // Update local session cache
        const stored = getStoredUser();
        const updatedUser = {
          ...stored,
          fullName: res.data.full_name,
          firstName: res.data.first_name,
          lastName: res.data.last_name,
          institution: res.data.institution,
          degree: res.data.degree,
          branch: res.data.branch,
          academicStanding: res.data.academic_standing,
          currentYear: res.data.current_year,
          currentSemester: res.data.current_semester,
        };
        localStorage.setItem('edumitra_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Error saving profile to backend:', err);
      setErrorMessage(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = () => {
    const name = window.prompt('Enter new skill name (e.g. Rust, Kotlin):');
    if (name && name.trim()) {
      setSkills(prev => [...prev, {
        id: Date.now(),
        name: name.trim(),
        level: 'Active',
        levelClass: 'bg-primary-fixed text-on-primary-fixed-variant'
      }]);
      setHasChanges(true);
    }
  };

  const handleRemoveSkill = (id) => {
    setSkills(prev => prev.filter(s => s.id !== id));
    setHasChanges(true);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-space-md md:px-space-xl py-space-lg space-y-space-xl pb-32">

      {/* Saved Toast */}
      {showSavedToast && (
        <div className="fixed top-20 right-6 z-50 bg-tertiary-container text-on-tertiary-container px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 font-label-md text-label-md animate-fade-in border border-tertiary/20">
          <span className="material-symbols-outlined text-[18px]">done_all</span>
          Profile &amp; GPA trajectory permanently saved to database!
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-space-md rounded-xl bg-error-container text-on-error-container flex items-center justify-between gap-space-md shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span className="font-label-md text-label-md font-semibold">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-on-error-container hover:opacity-80">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Top Status Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-wrap items-center gap-space-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-md text-label-md">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Verified Student Profile
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-label-md">
            <span className="material-symbols-outlined text-[16px]">school</span>
            Placement Cohort 2025
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md">
            <span className="material-symbols-outlined text-[16px]">database</span>
            Connected to Neon DB
          </span>
        </div>
        <div className="flex items-center gap-space-sm shrink-0">
          <button className="px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-low font-label-lg text-label-lg shadow-sm transition-all flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            Export Profile PDF
          </button>
          <button
            onClick={handleDiscard}
            disabled={!hasChanges}
            className={`px-space-md py-2 rounded-lg font-label-lg text-label-lg transition-all ${
              hasChanges ? 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high' : 'text-on-surface-variant/40 cursor-not-allowed'
            }`}
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-space-lg py-2 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg shadow-sm transition-all flex items-center gap-space-xs disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSaving ? 'sync' : 'check_circle'}
            </span>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Profile Header Hero + Completion Diagnostic */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
        {/* Main Profile Card */}
        <div className="xl:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-surface-container-high/40 pointer-events-none blur-3xl" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-lg relative z-10">
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-surface-container flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[64px] text-on-surface-variant">person</span>
              </div>
              <button className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-primary text-on-primary shadow-md hover:bg-primary-container transition-all" title="Update Profile Picture">
                <span className="material-symbols-outlined text-[16px] block">photo_camera</span>
              </button>
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-space-xs">
                <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                  {`${formData.firstName} ${formData.lastName}`.trim() || 'Student'}
                </h1>
                <span className="material-symbols-outlined text-primary text-[22px]" title="Accredited Scholar">verified</span>
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">
                {formData.branch} • {formData.academicStanding}
              </p>
              <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 pt-1 text-on-surface-variant font-body-sm text-body-sm">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">account_balance</span>
                  {formData.institution || 'University'}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[16px] text-secondary">badge</span>
                  Roll: {formData.rollNumber || 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">location_on</span>
                  {formData.city}
                </span>
              </div>
            </div>
          </div>
          {/* Quick Highlight Badges Footer */}
          <div className="mt-space-lg pt-space-md bg-surface-container-low rounded-lg p-space-md flex flex-wrap items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-lg">
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Cumulative GPA</div>
                <div className="font-headline-lg text-headline-lg text-primary font-bold">
                  {metrics.cgpa ? metrics.cgpa : 'N/A'} <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">/ 10.0</span>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-outline-variant/40" />
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Target Domain</div>
                <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">{formData.targetDomain || 'Computer Science'}</div>
              </div>
              <div className="h-8 w-[1px] bg-outline-variant/40 hidden sm:block" />
              <div className="hidden sm:block">
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Placement Readiness</div>
                <div className="font-headline-sm text-headline-sm text-tertiary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span> Tier 1 Target
                </div>
              </div>
            </div>
            <a href="#academic-performance" className="inline-flex items-center gap-1 text-primary font-label-md text-label-md hover:underline font-semibold">
              View Grade Trend <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
            </a>
          </div>
        </div>

        {/* Profile Strength Diagnostics Card */}
        <div className="xl:col-span-4 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-lg text-label-lg font-semibold text-on-surface">Profile Strength</span>
              <span className="font-headline-sm text-headline-sm font-bold text-primary">85% Complete</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Complete high-impact profile nodes to boost visibility with campus recruitment leads and AI mentorship matching.
            </p>
            {/* Segmented Progress Bar */}
            <div className="w-full grid grid-cols-10 gap-1 mb-space-lg">
              <div className="h-2 rounded-full bg-primary-container col-span-2" />
              <div className="h-2 rounded-full bg-primary-container col-span-2" />
              <div className="h-2 rounded-full bg-primary-container col-span-2" />
              <div className="h-2 rounded-full bg-primary-container col-span-2" />
              <div className="h-2 rounded-full bg-secondary col-span-1" />
              <div className="h-2 rounded-full bg-surface-container-high col-span-1" />
            </div>
            {/* Pending Checklist */}
            <div className="space-y-space-sm">
              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-start justify-between gap-space-sm">
                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">add_link</span>
                  <div>
                    <div className="font-label-md text-label-md font-semibold text-on-surface">Add GitHub / Portfolio URL</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Links repository proof for engineering teams</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold shrink-0">+10%</span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-start justify-between gap-space-sm">
                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">upload_file</span>
                  <div>
                    <div className="font-label-md text-label-md font-semibold text-on-surface">Upload Semester Transcript</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Required for verified GPA credentialing</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold shrink-0">+5%</span>
              </div>
            </div>
          </div>
          <div className="pt-space-md mt-space-sm">
            <button className="w-full py-2 px-space-md rounded-lg bg-surface-container-high hover:bg-surface-container text-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1 transition-all">
              <span>Quick-Fix Missing Credentials</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md py-space-xs">
        <div className="flex items-center gap-space-xs overflow-x-auto p-1 bg-surface-container-lowest rounded-xl shadow-sm">
          <a href="#personal-info" className="px-space-md py-2 rounded-lg text-primary bg-surface-container-high font-label-lg text-label-lg font-semibold shrink-0 transition-colors">
            1. Personal Information
          </a>
          <a href="#education-details" className="px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-lg text-label-lg font-medium shrink-0 transition-colors">
            2. Education Details
          </a>
          <a href="#academic-performance" className="px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-lg text-label-lg font-medium shrink-0 transition-colors">
            3. Performance &amp; GPA
          </a>
          <a href="#skills-competencies" className="px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-lg text-label-lg font-medium shrink-0 transition-colors">
            4. Skills &amp; Stack
          </a>
          <a href="#specialization-domains" className="px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-lg text-label-lg font-medium shrink-0 transition-colors">
            5. Focus Domains
          </a>
          <a href="#coursework-catalog" className="px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-lg text-label-lg font-medium shrink-0 transition-colors">
            6. Verified Courses
          </a>
          <a href="#career-aspirations" className="px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-lg text-label-lg font-medium shrink-0 transition-colors">
            7. Career Goals
          </a>
        </div>
      </div>

      {/* Section 1: Personal Information */}
      <section id="personal-info" className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-lg">
        <div className="flex items-center justify-between pb-space-sm">
          <div>
            <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Section 01</span>
            <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">Personal Information</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Update primary contact coordinates and public bio statement.</p>
          </div>
          <span className="p-2 rounded-lg bg-surface-container text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">badge</span>
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md font-medium text-on-surface">University Email</label>
              <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-0.5 font-semibold">
                <span className="material-symbols-outlined text-[14px]">lock</span> Verified
              </span>
            </div>
            <input
              readOnly
              value={formData.email}
              type="email"
              className="w-full h-10 px-space-md rounded-lg bg-surface-container-high/60 text-on-surface-variant font-body-md text-body-md cursor-not-allowed"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">Alternate / Personal Email</label>
            <input
              type="email"
              value={formData.personalEmail}
              onChange={(e) => handleFieldChange('personalEmail', e.target.value)}
              placeholder="e.g. personal@gmail.com"
              className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">Time Zone &amp; City</label>
            <div className="grid grid-cols-2 gap-space-xs">
              <input
                type="text"
                value={formData.timezone}
                onChange={(e) => handleFieldChange('timezone', e.target.value)}
                placeholder="Timezone"
                className="w-full h-10 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all"
              />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                placeholder="City"
                className="w-full h-10 px-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">Primary Career Target Domain</label>
            <input
              type="text"
              value={formData.targetDomain}
              onChange={(e) => handleFieldChange('targetDomain', e.target.value)}
              placeholder="e.g. Distributed Systems, ML Engineering"
              className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md font-medium text-on-surface">Professional Bio / Academic Summary</label>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                {formData.bio.length} / 500 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => handleFieldChange('bio', e.target.value)}
              maxLength={500}
              className="w-full p-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all leading-relaxed"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Education Details */}
      <section id="education-details" className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-lg">
        <div className="flex items-center justify-between pb-space-sm">
          <div>
            <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Section 02</span>
            <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">Education Details</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Formal curriculum parameters and academic residency details.</p>
          </div>
          <span className="p-2 rounded-lg bg-surface-container text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">school</span>
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {/* Degree Dropdown */}
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">Current Degree / Program</label>
            <select
              value={formData.degree}
              onChange={(e) => handleDegreeChange(e.target.value)}
              className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all cursor-pointer"
            >
              <optgroup label="Undergraduate Programs">
                <option value="B.Tech">Bachelor of Technology (B.Tech) - 4 Years</option>
                <option value="B.E.">Bachelor of Engineering (B.E.) - 4 Years</option>
                <option value="B.Sc.">Bachelor of Science (B.Sc.) - 3 Years</option>
                <option value="BCA">Bachelor of Computer Applications (BCA) - 3 Years</option>
              </optgroup>
              <optgroup label="Postgraduate Programs">
                <option value="M.Tech">Master of Technology (M.Tech) - 2 Years</option>
                <option value="M.E.">Master of Engineering (M.E.) - 2 Years</option>
                <option value="M.Sc.">Master of Science (M.Sc.) - 2 Years</option>
                <option value="MCA">Master of Computer Applications (MCA) - 2 Years</option>
              </optgroup>
              <optgroup label="Other Programs">
                <option value="Other">Other Degree / Diploma Program</option>
              </optgroup>
            </select>
          </div>

          {/* Major / Branch */}
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">Major / Branch</label>
            <input
              type="text"
              value={formData.branch}
              onChange={(e) => handleFieldChange('branch', e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
              className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all"
            />
          </div>

          {/* Institution */}
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">Institution Name</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => handleFieldChange('institution', e.target.value)}
              placeholder="e.g. National Institute of Technology (NIT)"
              className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all"
            />
          </div>

          {/* Academic Year Dropdown */}
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">Current Academic Year</label>
            <select
              value={formData.currentYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all cursor-pointer"
            >
              {Array.from({ length: formData.degreeDurationYears }, (_, i) => i + 1).map(y => (
                <option key={y} value={y}>{getOrdinal(y)} Year</option>
              ))}
            </select>
          </div>

          {/* Current Semester Dropdown */}
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">Current Semester</label>
            <select
              value={formData.currentSemester}
              onChange={(e) => handleSemesterChange(e.target.value)}
              className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all cursor-pointer"
            >
              {Array.from({ length: formData.degreeDurationYears * 2 }, (_, i) => i + 1).map(s => (
                <option key={s} value={s}>Semester {s} ({getOrdinal(Math.ceil(s / 2))} Year)</option>
              ))}
            </select>
          </div>

          {/* Dynamic Academic Standing */}
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">Academic Standing</label>
            <div className="w-full h-10 px-space-md rounded-lg bg-surface-container-high/60 text-primary font-label-lg text-label-lg font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              {getAcademicStanding(formData.currentYear, formData.currentSemester)}
            </div>
          </div>

          {/* Expected Graduation */}
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">Expected Graduation</label>
            <input
              type="text"
              value={formData.graduation}
              onChange={(e) => handleFieldChange('graduation', e.target.value)}
              placeholder="e.g. May 2026"
              className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all"
            />
          </div>

          {/* Roll Number */}
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">University Registration / Roll No.</label>
            <input
              value={formData.rollNumber}
              onChange={(e) => handleFieldChange('rollNumber', e.target.value)}
              type="text"
              placeholder="e.g. 12320146"
              className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-mono font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Academic Performance & GPA Trajectory */}
      <section id="academic-performance" className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
          <div>
            <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Section 03</span>
            <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">Academic Performance &amp; GPA Trajectory</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Validated grade point trajectory across enrolled semesters.</p>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="px-3 py-1 rounded bg-surface-container-high text-primary font-label-md text-label-md font-bold">
              Cumulative: {metrics.cgpa ? `${metrics.cgpa} / 10.0` : 'N/A'} {metrics.isCreditWeighted ? '(Credit Weighted)' : '(Unweighted Avg)'}
            </span>
            <span className="px-2 py-1 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
              Top 5% in Class
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          {/* Dynamic SVG Progression Curve */}
          <div className="lg:col-span-5 bg-surface-container-low p-space-lg rounded-xl flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-label-md text-label-md font-semibold text-on-surface">GPA Progression Curve</span>
              {metrics.delta && (
                <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> {metrics.delta}
                </span>
              )}
            </div>

            <div className="w-full py-space-sm">
              {metrics.hasData && metrics.points.length > 0 ? (
                <svg className="w-full h-32 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 120">
                  <defs>
                    <linearGradient id="gpaGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#4338CA" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4338CA" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1" x1="20" x2="380" y1="100" y2="100" />
                  <line stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1" x1="20" x2="380" y1="60" y2="60" />
                  <line stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1" x1="20" x2="380" y1="20" y2="20" />

                  {metrics.points.length > 1 && (
                    <>
                      <path
                        d={`M ${metrics.points[0].x},${metrics.points[0].y} ${metrics.points.slice(1).map(p => `L ${p.x},${p.y}`).join(' ')} L ${metrics.points[metrics.points.length - 1].x},110 L ${metrics.points[0].x},110 Z`}
                        fill="url(#gpaGradient)"
                      />
                      <polyline
                        fill="none"
                        points={metrics.points.map(p => `${p.x},${p.y}`).join(' ')}
                        stroke="#4338CA"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                      />
                    </>
                  )}

                  {metrics.points.map((p) => {
                    const isCur = p.sem === parseInt(formData.currentSemester, 10);
                    const isPeak = p.sem === metrics.peakSem;
                    return (
                      <g key={p.sem}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          fill={isCur ? "#006398" : "#4338CA"}
                          r={isCur || isPeak ? 5 : 4}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text
                          fill={isCur ? "#006398" : "#464554"}
                          fontSize="10"
                          fontWeight={isCur ? "bold" : "normal"}
                          textAnchor="middle"
                          x={p.x}
                          y="118"
                        >
                          {`S${p.sem}${isCur ? ' (Cur)' : ''}`}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                <div className="h-32 flex flex-col items-center justify-center text-center p-3 rounded-lg border border-dashed border-outline-variant/60">
                  <span className="material-symbols-outlined text-[28px] text-on-surface-variant/40 mb-1">show_chart</span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface-variant">No GPA trajectory recorded yet</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant/70 text-xs">Enter your semester SGPAs on the right to visualize your progression.</span>
                </div>
              )}
            </div>

            <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
              <span>Minimum: {metrics.minGpa}</span>
              <span>Peak: {metrics.peakGpa} {metrics.peakSem ? `(Sem ${metrics.peakSem})` : ''}</span>
            </div>
          </div>

          {/* Editable Semester metric cards (Sem 1 to current_semester) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-space-sm">
            {mergedSemesterList.map((s) => {
              const isPeak = metrics.hasData && s.semester_number === metrics.peakSem;
              const isCur = s.semester_number === parseInt(formData.currentSemester, 10);
              return (
                <div
                  key={s.semester_number}
                  className={`p-space-sm rounded-lg border transition-all ${
                    isCur
                      ? 'bg-secondary-fixed/40 border-secondary'
                      : isPeak
                      ? 'bg-surface-container-high/60 border-primary/30'
                      : 'bg-surface-container-low border-transparent'
                  } relative flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-label-sm text-label-sm uppercase font-semibold ${isCur ? 'text-secondary font-bold' : isPeak ? 'text-primary' : 'text-on-surface-variant'}`}>
                      Sem {s.semester_number} {isCur ? '(Cur)' : ''}
                    </span>
                    {isPeak && (
                      <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-primary text-on-primary font-label-sm text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[11px]">star</span> Peak
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 my-1">
                    <div>
                      <label className="text-[10px] text-on-surface-variant font-medium block">SGPA</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max={s.max_scale || 10}
                        placeholder="8.50"
                        value={s.sgpa}
                        onChange={(e) => handleSemesterRecordChange(s.semester_number, 'sgpa', e.target.value)}
                        className="w-full h-8 px-2 rounded bg-surface-container-lowest font-headline-sm text-headline-sm font-bold text-on-surface border border-outline-variant/40 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-on-surface-variant font-medium block">Credits</label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="60"
                        placeholder="e.g. 24"
                        value={s.credits_earned || ''}
                        onChange={(e) => handleSemesterRecordChange(s.semester_number, 'credits_earned', e.target.value)}
                        className="w-full h-7 px-2 rounded bg-surface-container-lowest font-body-sm text-body-sm text-on-surface border border-outline-variant/40 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Honors */}
        <div className="pt-space-sm">
          <h3 className="font-label-lg text-label-lg font-semibold text-on-surface mb-space-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">military_tech</span>
            Verified Academic Honors &amp; Scholarships
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="p-space-md rounded-lg bg-surface-container-low flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">award_star</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">Dean's Honor Roll (Semesters 3 &amp; 4)</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Awarded for consistent semester GPA &gt; 8.5 in Computer Science</div>
              </div>
            </div>
            <div className="p-space-md rounded-lg bg-surface-container-low flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">National Merit Scholar</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Top 0.5% percentile rank in Engineering Entrance Fellowship</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Skills & Competencies */}
      <section id="skills-competencies" className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
          <div>
            <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Section 04</span>
            <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">Skills &amp; Competencies</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Core programming paradigms, systems competencies, and technical abilities.</p>
          </div>
          <button onClick={handleAddSkill} className="px-space-md py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-primary font-label-md text-label-md font-semibold flex items-center gap-1 transition-all">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add New Skill
          </button>
        </div>
        <div className="space-y-space-md">
          {/* Programming Languages */}
          <div>
            <div className="font-label-md text-label-md font-semibold text-on-surface-variant mb-space-xs uppercase tracking-wider">Programming Languages</div>
            <div className="flex flex-wrap gap-space-xs">
              {skills.map(skill => (
                <span key={skill.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md">
                  <span className="font-semibold">{skill.name}</span>
                  <span className={`px-1.5 py-0.5 rounded ${skill.levelClass} text-label-sm font-semibold`}>{skill.level}</span>
                  <button onClick={() => handleRemoveSkill(skill.id)} className="text-on-surface-variant hover:text-error transition-colors" title="Remove skill">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </span>
              ))}
            </div>
          </div>
          {/* Core Technical Skills */}
          <div>
            <div className="font-label-md text-label-md font-semibold text-on-surface-variant mb-space-xs uppercase tracking-wider">Core Technical &amp; Systems Architecture</div>
            <div className="flex flex-wrap gap-space-xs">
              {[
                { icon: 'account_tree', label: 'Data Structures & Algorithms' },
                { icon: 'memory', label: 'Operating Systems Internals' },
                { icon: 'database', label: 'Database Normalization & Query Tuning' },
                { icon: 'deployed_code', label: 'Docker & Kubernetes' },
                { icon: 'sync_alt', label: 'REST & gRPC Architecture' },
              ].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary font-label-md text-label-md font-medium">
                  <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                  {t.label}
                </span>
              ))}
            </div>
          </div>
          {/* Soft Skills */}
          <div>
            <div className="font-label-md text-label-md font-semibold text-on-surface-variant mb-space-xs uppercase tracking-wider">Engineering Practice &amp; Professional Skills</div>
            <div className="flex flex-wrap gap-space-xs">
              {['Technical Problem Solving', 'Team Leadership & Mentoring', 'Written Technical Communication'].map((s, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Academic Interests & Focus Domains */}
      <section id="specialization-domains" className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
        <div className="flex items-center justify-between pb-space-sm">
          <div>
            <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Section 05</span>
            <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">Academic Interests &amp; Focus Domains</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Fields of active investigation, elective coursework, and research.</p>
          </div>
          <span className="p-2 rounded-lg bg-surface-container text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {[
            { icon: 'lan', iconBg: 'bg-primary-container text-on-primary', title: 'Distributed Systems', desc: 'Consensus protocols (Raft/Paxos), partitioned caching, distributed transactions.' },
            { icon: 'cloud', iconBg: 'bg-secondary text-on-secondary', title: 'Cloud Computing', desc: 'Serverless compute paradigms, microservices scalability, container orchestrations.' },
            { icon: 'storage', iconBg: 'bg-tertiary-container text-on-tertiary-container', title: 'Database Engine Architecture', desc: 'LSM-trees vs B-Trees, write-ahead logging, lock-free concurrency engines.' },
            { icon: 'terminal', iconBg: 'bg-surface-container-high text-primary', title: 'Compiler Design', desc: 'Intermediate representations, LLVM optimization pipelines, syntax analyzers.' },
            { icon: 'security', iconBg: 'bg-surface-container-high text-primary', title: 'Cybersecurity & Cryptography', desc: 'Zero-knowledge primitives, modern symmetric cipher primitives, TLS handshakes.', wide: true },
          ].map((d, i) => (
            <div key={i} className={`p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-sm ${d.wide ? 'sm:col-span-2 lg:col-span-2' : ''}`}>
              <span className={`p-2 rounded-lg ${d.iconBg} shrink-0`}>
                <span className="material-symbols-outlined text-[20px]">{d.icon}</span>
              </span>
              <div>
                <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">{d.title}</div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: Verified Courses */}
      <section id="coursework-catalog" className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
          <div>
            <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Section 06</span>
            <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">Verified University Coursework</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Transcript-verified technical curricula completed with awarded scores.</p>
          </div>
          <button className="text-primary hover:text-primary-container font-label-md text-label-md font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            Verify Official Transcripts
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {[
            { code: 'CS201', name: 'Advanced Data Structures', meta: 'Completed Spring 2024 • Prof. S. Sen', grade: 'A+ (10.0)', gradeCls: 'bg-tertiary/10 text-tertiary' },
            { code: 'CS202', name: 'Discrete Mathematics & Graph Theory', meta: 'Completed Spring 2024 • Prof. R. Ramanujan', grade: 'A (9.0)', gradeCls: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
            { code: 'CS301', name: 'Computer Organization & Architecture', meta: 'Completed Fall 2023 • Prof. A. Mukherjee', grade: 'A+ (10.0)', gradeCls: 'bg-tertiary/10 text-tertiary' },
            { code: 'CS302', name: 'Object-Oriented Software Design', meta: 'Completed Fall 2023 • Prof. M. Kulkarni', grade: 'A (9.0)', gradeCls: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
          ].map((course, i) => (
            <div key={i} className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between space-y-space-sm">
              <div className="flex items-start justify-between gap-space-sm">
                <div>
                  <span className="font-label-sm text-label-sm text-primary font-bold font-mono">{course.code}</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{course.name}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{course.meta}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-block px-2.5 py-1 rounded ${course.gradeCls} font-headline-sm text-headline-sm font-bold`}>{course.grade}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
                <span className="flex items-center gap-1 font-label-sm">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                  Institutional Verified
                </span>
                <button className="text-primary hover:underline font-label-sm text-label-sm font-semibold flex items-center gap-0.5">
                  <span>View Syllabus</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Career Aspirations */}
      <section id="career-aspirations" className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-lg">
        <div className="flex items-center justify-between pb-space-sm">
          <div>
            <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Section 07</span>
            <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">Career Aspirations &amp; Target Roles</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Configured preferences for campus placements and internship dispatching.</p>
          </div>
          <span className="p-2 rounded-lg bg-surface-container text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">explore</span>
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          <div className="p-space-md rounded-xl bg-surface-container-low space-y-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-medium">Primary Target Role</span>
            <div className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">dns</span>
              {formData.targetDomain ? `${formData.targetDomain} / Backend Engineer` : 'Software Development Engineer'}
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Targeting SDE-1 / Infrastructure Eng levels</p>
          </div>
          <div className="p-space-md rounded-xl bg-surface-container-low space-y-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-medium">Target Industry Segments</span>
            <div className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[20px]">domain</span>
              High-Scale Tech / Cloud Infra / Fintech
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Tier-1 product enterprises &amp; high-frequency systems</p>
          </div>
          <div className="p-space-md rounded-xl bg-surface-container-low space-y-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-medium">Preferred Internship Timeline</span>
            <div className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-[20px]">calendar_month</span>
              Summer 2025 (May – July)
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">8-12 weeks full-time summer engagement</p>
          </div>
          <div className="p-space-md rounded-xl bg-surface-container-low space-y-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-medium">Location Flexibility</span>
            <div className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">pin_drop</span>
              Hybrid / Remote / Bengaluru / Hyderabad
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Willing to relocate for flagship headquarters</p>
          </div>
          <div className="p-space-md rounded-xl bg-surface-container-low space-y-1 lg:col-span-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-medium">Target Compensation Expectations</span>
            <div className="font-headline-sm text-headline-sm text-primary font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">currency_rupee</span>
              ₹18,00,000 – ₹24,00,000 CTC (Tier-1 Tech Benchmark)
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Aligned with current placement baseline stats for Distributed Systems cohort</p>
          </div>
        </div>
      </section>

      {/* Sticky Floating Action Bar */}
      <div className={`fixed bottom-6 left-72 right-0 px-space-xl flex justify-center pointer-events-none transition-all duration-300 z-40 ${hasChanges ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="pointer-events-auto bg-inverse-surface text-inverse-on-surface rounded-xl shadow-xl px-space-lg py-space-sm flex items-center gap-space-lg max-w-2xl w-full justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-container" />
            </span>
            <div className="flex flex-col">
              <span className="font-label-lg text-label-lg font-semibold text-inverse-on-surface">Unsaved changes detected</span>
              <span className="font-body-sm text-body-sm text-inverse-on-surface/70">Your edits will persist to database</span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              onClick={handleDiscard}
              className="px-space-md py-1.5 rounded-lg text-inverse-on-surface/80 hover:text-inverse-on-surface hover:bg-surface-container-high/20 font-label-md text-label-md transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold shadow transition-colors flex items-center gap-1 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isSaving ? 'sync' : 'save'}
              </span>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
