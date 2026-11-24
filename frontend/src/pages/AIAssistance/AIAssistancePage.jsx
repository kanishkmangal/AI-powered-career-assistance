import React, { useState, useEffect, useRef } from 'react';
import {
  getAISessions,
  getAISessionDetail,
  createAISession,
  updateAISession,
  deleteAISession,
  clearAISession,
  sendAIMessage,
  recordMessageFeedback,
  generatePracticeMCQs,
} from '../../services/api';

/**
 * AIAssistancePage
 * Faithful, full-featured React implementation of the EduMitra AI Socratic Tutor.
 * Source reference: Website UI/AI_Assistance/code.html
 */
const AIAssistancePage = () => {
  // Current user info
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('edumitra_user') || sessionStorage.getItem('edumitra_user')) || {};
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

  const STUDENT_AVATAR =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC76JRGjR7DJPSfhpshAQC7Mii3t8SzfHwAWy4uofAHB6klyXDNhzc2kURfxllUOBjAFuTIcOUhZdm9NHp_Z0uLze-LmsDEHwhWM52axgNfqni_tqFgtsKVEQt011uyRaGmNrFtEADMXquXh-e-_G_UaGnadezIhmp7dAG2W5TPXaVGHvNY-9Lwi65EMCUDYPl3wWcROyf_FmG079tZka1-OXe0lOAK9gTo9mjoeiiQAauPrevjGjKC';

  // State
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [activeMode, setActiveMode] = useState('socratic');
  const [tone, setTone] = useState('concise_academic');
  const [toneDropdownOpen, setToneDropdownOpen] = useState(false);
  const [showToast, setShowToast] = useState(true);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [sessionMenuOpenId, setSessionMenuOpenId] = useState(null);
  const [noticeBanner, setNoticeBanner] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, sending]);

  // Load chat sessions on mount
  useEffect(() => {
    loadSessions();
  }, [userEmail]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const res = await getAISessions(userEmail);
      if (res.status === 'success' && res.data) {
        setSessions(res.data);
        if (res.data.length > 0) {
          // Select first session by default
          const firstId = res.data[0].id;
          setActiveSessionId(firstId);
          loadSessionDetail(firstId);
        }
      }
    } catch (err) {
      console.error('Failed to load chat sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionDetail = async (sessionId) => {
    try {
      const res = await getAISessionDetail(sessionId, userEmail);
      if (res.status === 'success' && res.data) {
        setActiveSession(res.data);
        setActiveMode(res.data.mode || 'socratic');
        setTone(res.data.tone || 'concise_academic');
      }
    } catch (err) {
      console.error('Failed to load session details:', err);
    }
  };

  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId);
    loadSessionDetail(sessionId);
    setHistoryDrawerOpen(false);
    setSessionMenuOpenId(null);
  };

  // Create new session
  const handleNewSession = async () => {
    try {
      const res = await createAISession(
        {
          title: 'New Chat Session',
          subject: 'DBMS (CS-304)',
          semester: 'Semester 6',
          mode: activeMode,
          tone: tone,
        },
        userEmail
      );
      if (res.status === 'success' && res.data) {
        setSessions((prev) => [res.data, ...prev]);
        setActiveSessionId(res.data.id);
        setActiveSession(res.data);
        setHistoryDrawerOpen(false);
      }
    } catch (err) {
      console.error('Failed to create new session:', err);
    }
  };

  // Switch Mode
  const handleModeChange = async (newMode) => {
    setActiveMode(newMode);
    if (activeSessionId) {
      try {
        await updateAISession(activeSessionId, { mode: newMode }, userEmail);
        setActiveSession((prev) => (prev ? { ...prev, mode: newMode } : prev));
      } catch (err) {
        console.error('Failed to update mode:', err);
      }
    }
  };

  // Switch Tone
  const handleToneChange = async (newTone) => {
    setTone(newTone);
    setToneDropdownOpen(false);
    if (activeSessionId) {
      try {
        await updateAISession(activeSessionId, { tone: newTone }, userEmail);
        setActiveSession((prev) => (prev ? { ...prev, tone: newTone } : prev));
      } catch (err) {
        console.error('Failed to update tone:', err);
      }
    }
  };

  // Send message
  const handleSendMessage = async (customPrompt) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || sending || !activeSessionId) return;

    setInputMessage('');
    setSending(true);

    try {
      const res = await sendAIMessage(activeSessionId, { content: textToSend }, userEmail);
      if (res.status === 'success' && res.data) {
        setActiveSession(res.data);
        // Refresh session title in sessions list if updated
        setSessions((prev) =>
          prev.map((s) => (s.id === res.data.id ? { ...s, title: res.data.title, updated_at: res.data.updated_at } : s))
        );
        if (res.ai_configured === false) {
          setNoticeBanner('External AI service (GEMINI_API_KEY) is not configured in backend .env. Recorded in session.');
        } else {
          setNoticeBanner(null);
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  // Clear conversation
  const handleClearConversation = async () => {
    if (!activeSessionId) return;
    try {
      const res = await clearAISession(activeSessionId, userEmail);
      if (res.status === 'success' && res.data) {
        setActiveSession(res.data);
      }
    } catch (err) {
      console.error('Failed to clear conversation:', err);
    } finally {
      setShowClearConfirm(false);
    }
  };

  // Delete session
  const handleDeleteSession = async (sessionId, e) => {
    e?.stopPropagation();
    try {
      await deleteAISession(sessionId, userEmail);
      const remaining = sessions.filter((s) => s.id !== sessionId);
      setSessions(remaining);
      if (activeSessionId === sessionId) {
        if (remaining.length > 0) {
          setActiveSessionId(remaining[0].id);
          loadSessionDetail(remaining[0].id);
        } else {
          setActiveSessionId(null);
          setActiveSession(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  // Pin/Unpin session
  const handleTogglePin = async (sessionId, currentPinned, e) => {
    e?.stopPropagation();
    try {
      const res = await updateAISession(sessionId, { is_pinned: !currentPinned }, userEmail);
      if (res.status === 'success') {
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, is_pinned: !currentPinned } : s))
        );
      }
    } catch (err) {
      console.error('Failed to toggle pin:', err);
    } finally {
      setSessionMenuOpenId(null);
    }
  };

  // Message feedback (thumbs up / down / save note)
  const handleFeedback = async (messageId, type) => {
    try {
      const msg = activeSession?.messages?.find((m) => m.id === messageId);
      const currentMeta = msg?.metadata || {};
      let payload = {};

      if (type === 'saved') {
        payload = { saved: !currentMeta.saved };
      } else if (type === 'up' || type === 'down') {
        payload = { feedback: currentMeta.feedback === type ? null : type };
      }

      const res = await recordMessageFeedback(messageId, payload, userEmail);
      if (res.status === 'success' && res.data) {
        setActiveSession((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: prev.messages.map((m) => (m.id === messageId ? res.data : m)),
          };
        });
      }
    } catch (err) {
      console.error('Failed to record feedback:', err);
    }
  };

  // Copy message text
  const handleCopyText = (messageId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Generate 3 Practice MCQs
  const handleGenerateMCQs = async () => {
    if (!activeSessionId) return;
    setSending(true);
    try {
      const res = await generatePracticeMCQs(activeSessionId, userEmail);
      if (res.status === 'success' && res.data) {
        setActiveSession(res.data);
      }
    } catch (err) {
      console.error('Failed to generate MCQs:', err);
    } finally {
      setSending(false);
    }
  };

  // Voice recording mock toggle
  const handleToggleVoice = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage((prev) =>
          prev ? `${prev} Explain B+ tree deletion steps` : 'Explain B+ tree deletion steps'
        );
      }, 3000);
    }
  };

  // Filtered session grouping
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedSessions = filteredSessions.filter((s) => s.is_pinned);
  const unpinnedSessions = filteredSessions.filter((s) => !s.is_pinned);

  // Split unpinned into Today and Previous 7 Days based on created_at / index
  const todaySessions = unpinnedSessions.slice(0, 2);
  const previousDaysSessions = unpinnedSessions.slice(2);

  const toneLabels = {
    concise_academic: 'Concise Academic',
    socratic: 'In-Depth Socratic',
    eli5: 'Simplified ELI5',
    exam: 'Exam Oriented',
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex h-full w-full overflow-hidden relative">
        {/* Mobile History Backdrop */}
        {historyDrawerOpen && (
          <div
            className="fixed inset-0 top-16 bg-black/40 z-30 md:hidden backdrop-blur-xs"
            onClick={() => setHistoryDrawerOpen(false)}
          />
        )}

        {/* Left Inner Sub-Sidebar: Chat Session History */}
        <aside
          className={`fixed inset-y-16 left-0 z-40 md:static md:z-auto w-72 shrink-0 bg-surface-container-low flex flex-col justify-between h-[calc(100vh-4rem)] select-none transition-transform duration-300 ${
            historyDrawerOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="flex flex-col h-full overflow-hidden">
            {/* New Chat & Search Header */}
            <div className="p-space-md space-y-space-sm">
              <button
                onClick={handleNewSession}
                className="w-full flex items-center justify-center gap-space-sm py-2.5 px-space-md bg-primary-container text-on-primary rounded-xl font-label-lg text-label-lg shadow-sm hover:opacity-95 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_box</span>
                <span>New Chat Session</span>
              </button>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[16px] text-on-surface-variant">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface text-body-sm font-body-sm pl-9 pr-3 py-2 rounded-lg placeholder:text-outline outline-none shadow-sm focus:bg-surface-container-highest transition-colors"
                  placeholder="Search chat history..."
                  type="text"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-outline hover:text-on-surface text-[14px]"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Sessions Feed */}
            <div className="flex-1 overflow-y-auto px-space-sm space-y-space-md pb-space-md">
              {loading && sessions.length === 0 ? (
                <div className="p-4 text-center text-on-surface-variant text-body-sm">
                  <div className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p>Loading sessions...</p>
                </div>
              ) : null}

              {/* Group: Today */}
              {todaySessions.length > 0 && (
                <div className="space-y-1">
                  <div className="px-space-sm py-1 flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-sm text-label-sm tracking-wider uppercase font-semibold">
                      Today
                    </span>
                    <span className="text-label-sm font-label-sm text-outline">
                      {todaySessions.length} {todaySessions.length === 1 ? 'session' : 'sessions'}
                    </span>
                  </div>

                  {todaySessions.map((session) => {
                    const isActive = session.id === activeSessionId;
                    return (
                      <div key={session.id} className="relative group">
                        <button
                          onClick={() => handleSelectSession(session.id)}
                          className={`w-full text-left relative flex items-center gap-space-sm px-space-sm py-2 rounded-xl transition-all font-label-md text-label-md ${
                            isActive
                              ? 'bg-surface-container-lowest shadow-sm text-primary font-semibold'
                              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                          }`}
                        >
                          {isActive && <span className="w-1.5 h-6 bg-primary rounded-full absolute left-1"></span>}
                          <span
                            className={`material-symbols-outlined text-[18px] ${
                              isActive ? 'ml-1.5 text-primary' : 'text-outline'
                            }`}
                          >
                            {isActive ? 'chat_bubble' : 'chat_bubble_outline'}
                          </span>
                          <span className="truncate flex-1 text-on-surface">{session.title}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSessionMenuOpenId(sessionMenuOpenId === session.id ? null : session.id);
                            }}
                            className={`material-symbols-outlined text-[16px] text-outline hover:text-on-surface p-1 rounded transition-opacity ${
                              sessionMenuOpenId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            more_vert
                          </button>
                        </button>

                        {/* Session Actions Dropdown */}
                        {sessionMenuOpenId === session.id && (
                          <div className="absolute right-2 top-full mt-1 w-44 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-1 z-50">
                            <button
                              onClick={(e) => handleTogglePin(session.id, session.is_pinned, e)}
                              className="w-full text-left px-3 py-1.5 text-body-sm text-on-surface hover:bg-surface-container flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[16px] text-secondary">push_pin</span>
                              <span>{session.is_pinned ? 'Unpin Session' : 'Pin to Guides'}</span>
                            </button>
                            <button
                              onClick={(e) => handleDeleteSession(session.id, e)}
                              className="w-full text-left px-3 py-1.5 text-body-sm text-error hover:bg-error-container/30 flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                              <span>Delete Session</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Group: Previous 7 Days */}
              {previousDaysSessions.length > 0 && (
                <div className="space-y-1">
                  <div className="px-space-sm py-1 flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-sm text-label-sm tracking-wider uppercase font-semibold">
                      Previous 7 Days
                    </span>
                  </div>

                  {previousDaysSessions.map((session) => {
                    const isActive = session.id === activeSessionId;
                    return (
                      <div key={session.id} className="relative group">
                        <button
                          onClick={() => handleSelectSession(session.id)}
                          className={`w-full text-left relative flex items-center gap-space-sm px-space-sm py-2 rounded-xl transition-colors font-label-md text-label-md ${
                            isActive
                              ? 'bg-surface-container-lowest shadow-sm text-primary font-semibold'
                              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                          }`}
                        >
                          {isActive && <span className="w-1.5 h-6 bg-primary rounded-full absolute left-1"></span>}
                          <span
                            className={`material-symbols-outlined text-[18px] ${
                              isActive ? 'ml-1.5 text-primary' : 'text-outline'
                            }`}
                          >
                            {isActive ? 'chat_bubble' : 'chat_bubble_outline'}
                          </span>
                          <span className="truncate flex-1 text-on-surface">{session.title}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSessionMenuOpenId(sessionMenuOpenId === session.id ? null : session.id);
                            }}
                            className={`material-symbols-outlined text-[16px] text-outline hover:text-on-surface p-1 rounded transition-opacity ${
                              sessionMenuOpenId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            more_vert
                          </button>
                        </button>

                        {/* Session Actions Dropdown */}
                        {sessionMenuOpenId === session.id && (
                          <div className="absolute right-2 top-full mt-1 w-44 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-1 z-50">
                            <button
                              onClick={(e) => handleTogglePin(session.id, session.is_pinned, e)}
                              className="w-full text-left px-3 py-1.5 text-body-sm text-on-surface hover:bg-surface-container flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[16px] text-secondary">push_pin</span>
                              <span>{session.is_pinned ? 'Unpin Session' : 'Pin to Guides'}</span>
                            </button>
                            <button
                              onClick={(e) => handleDeleteSession(session.id, e)}
                              className="w-full text-left px-3 py-1.5 text-body-sm text-error hover:bg-error-container/30 flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                              <span>Delete Session</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Group: Pinned Study Guides */}
              {pinnedSessions.length > 0 && (
                <div className="space-y-1">
                  <div className="px-space-sm py-1 flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-sm text-label-sm tracking-wider uppercase font-semibold">
                      Pinned Study Guides
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-secondary">push_pin</span>
                  </div>

                  {pinnedSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleSelectSession(session.id)}
                      className="flex items-center gap-space-sm px-space-sm py-2 rounded-xl bg-surface-container-high/60 text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">auto_stories</span>
                      <span className="truncate flex-1 font-medium text-on-surface">{session.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Engine Footnote */}
            <div className="p-space-sm m-space-sm bg-surface-container-lowest rounded-xl shadow-sm space-y-2">
              <div className="flex items-center gap-space-xs text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">psychology</span>
                <span className="font-label-sm text-label-sm font-semibold truncate">Socratic Tutor Engine v2.4</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-tertiary-container"></span>
                  3 syllabi synced
                </span>
                <button
                  onClick={() => setShowManageModal(true)}
                  className="text-primary font-medium hover:underline cursor-pointer"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Conversation Workspace */}
        <section className="flex-1 flex flex-col h-full bg-surface-container-lowest overflow-hidden relative">
          {/* Top Context Header Bar */}
          <header className="h-16 px-space-md sm:px-space-lg shrink-0 bg-surface-container-lowest flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-space-sm sm:gap-space-md min-w-0">
              {/* Mobile History Drawer Toggle */}
              <button
                onClick={() => setHistoryDrawerOpen(!historyDrawerOpen)}
                className="md:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                title="Toggle Chat History"
              >
                <span className="material-symbols-outlined text-[22px]">history</span>
              </button>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-sm">
                  <h1 className="font-headline-sm text-headline-sm text-on-surface truncate">
                    {activeSession?.title || 'B+ Tree Node Redistribution vs Merging'}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold shrink-0">
                    {activeSession?.subject || 'DBMS (CS-304)'}
                  </span>
                  <span className="hidden xl:inline text-on-surface-variant font-label-sm text-label-sm shrink-0">
                    • {activeSession?.semester || 'Semester 6'}
                  </span>
                </div>
              </div>
            </div>

            {/* Mode Selector Pills & Fast Utilities */}
            <div className="flex items-center gap-space-sm">
              <div className="hidden md:flex items-center bg-surface-container-low p-1 rounded-xl">
                <button
                  onClick={() => handleModeChange('socratic')}
                  className={`px-space-sm py-1 font-label-sm text-label-sm font-semibold rounded-lg transition-all flex items-center gap-1 ${
                    activeMode === 'socratic'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                  <span>Socratic Tutor</span>
                </button>
                <button
                  onClick={() => handleModeChange('summary')}
                  className={`px-space-sm py-1 font-label-sm text-label-sm rounded-lg transition-all flex items-center gap-1 ${
                    activeMode === 'summary'
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Quick Exam Summary</span>
                </button>
                <button
                  onClick={() => handleModeChange('drills')}
                  className={`px-space-sm py-1 font-label-sm text-label-sm rounded-lg transition-all flex items-center gap-1 ${
                    activeMode === 'drills'
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">terminal</span>
                  <span>Code &amp; Proof Drills</span>
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => window.print()}
                  className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
                  title="Export Chat as PDF Note"
                >
                  <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                </button>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded-lg transition-colors cursor-pointer"
                  title="Clear Conversation"
                >
                  <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                </button>
              </div>
            </div>
          </header>

          {/* Optional notice banner */}
          {noticeBanner && (
            <div className="px-space-lg py-2 bg-secondary-fixed/40 text-on-secondary-fixed-variant text-label-sm flex items-center justify-between border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary">info</span>
                <span>{noticeBanner}</span>
              </div>
              <button
                onClick={() => setNoticeBanner(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          )}

          {/* Chat Stream Body */}
          <div className="flex-1 overflow-y-auto px-space-md sm:px-space-lg py-space-lg space-y-space-xl">
            {activeSession?.messages?.length === 0 && (
              <div className="max-w-md mx-auto text-center py-12 text-on-surface-variant space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-high text-primary flex items-center justify-center mx-auto shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">school</span>
                </div>
                <h3 className="font-headline-sm text-on-surface">Start a New Inquiry</h3>
                <p className="text-body-md text-outline">
                  Ask any concept question, request textbook derivations, or click one of the quick prompts below.
                </p>
              </div>
            )}

            {activeSession?.messages?.map((msg) => {
              if (msg.sender === 'user') {
                return (
                  <div key={msg.id} className="max-w-4xl mx-auto flex items-start gap-space-md justify-end">
                    <div className="flex flex-col items-end max-w-2xl space-y-1.5">
                      <div className="flex items-center gap-space-sm">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {studentName} •{' '}
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="p-space-lg bg-surface-container text-on-surface rounded-2xl rounded-tr-none shadow-sm leading-relaxed font-body-md text-body-md whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                    <img
                      alt="Student Avatar"
                      className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm"
                      src={STUDENT_AVATAR}
                    />
                  </div>
                );
              }

              // Assistant message
              const meta = msg.metadata || {};
              const badge = meta.badge || 'CS-304 Verified';
              const analogy = meta.analogy;
              const rules = meta.rules;
              const blueprint = meta.blueprint;
              const checkpoint = meta.checkpoint;
              const mcqs = meta.mcqs;
              const isSaved = meta.saved;
              const feedback = meta.feedback;

              return (
                <div key={msg.id} className="max-w-4xl mx-auto flex items-start gap-space-md">
                  <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                  </div>

                  <div className="flex-1 space-y-space-md max-w-3xl">
                    <div className="flex items-center gap-space-sm">
                      <span className="font-label-md text-label-md font-semibold text-primary">
                        EduMitra Socratic AI
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                        {badge}
                      </span>
                    </div>

                    {/* Content Card */}
                    <div className="p-space-lg sm:p-space-xl bg-surface rounded-2xl shadow-sm text-on-surface space-y-space-md">
                      {/* Introductory text */}
                      <p className="font-body-lg text-body-lg font-medium text-on-surface leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>

                      {/* Analogy Callout */}
                      {analogy && (
                        <div className="p-space-md bg-secondary-fixed/30 rounded-xl text-on-secondary-fixed-variant flex items-start gap-space-sm">
                          <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                            tips_and_updates
                          </span>
                          <div className="font-body-md text-body-md space-y-1">
                            <p className="font-semibold text-on-surface">{analogy.title}</p>
                            <p>{analogy.text}</p>
                          </div>
                        </div>
                      )}

                      {/* Rule Sequence */}
                      {rules && rules.length > 0 && (
                        <div className="space-y-space-sm">
                          {rules.map((rule, idx) => (
                            <div key={idx} className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-2">
                              <div
                                className={`flex items-center gap-2 font-semibold font-label-lg text-label-lg ${
                                  rule.number === '1' ? 'text-primary' : 'text-on-surface'
                                }`}
                              >
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${
                                    rule.number === '1'
                                      ? 'bg-primary-fixed text-primary'
                                      : 'bg-surface-container-highest text-on-surface-variant'
                                  }`}
                                >
                                  {rule.number}
                                </span>
                                <span>{rule.title}</span>
                              </div>
                              <p className="font-body-md text-body-md text-on-surface-variant pl-8">
                                {rule.text}
                              </p>
                              {rule.formula && (
                                <div className="ml-8 font-mono text-body-sm bg-surface-container-low p-2 rounded-lg text-primary">
                                  {rule.formula}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Visual ASCII Representation Blueprint */}
                      {blueprint && (
                        <div className="space-y-2">
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                            {blueprint.title}
                          </span>
                          <div className="p-space-md bg-inverse-surface text-inverse-on-surface rounded-xl font-mono text-body-sm overflow-x-auto shadow-sm">
                            <pre className="leading-snug">{blueprint.code}</pre>
                          </div>
                        </div>
                      )}

                      {/* Socratic Challenge Box / Checkpoint Probe */}
                      {checkpoint && (
                        <div className="p-space-md bg-primary-fixed/30 rounded-xl space-y-2">
                          <div className="flex items-center gap-space-xs text-primary font-semibold font-label-lg text-label-lg">
                            <span className="material-symbols-outlined text-[18px]">quiz</span>
                            <span>{checkpoint.title}</span>
                          </div>
                          <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                            {checkpoint.question}
                          </p>
                        </div>
                      )}

                      {/* Interactive MCQs if generated */}
                      {mcqs && mcqs.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                            Interactive Practice MCQs
                          </span>
                          {mcqs.map((mcq) => {
                            const selected = mcqAnswers[mcq.id];
                            const isAnswered = selected !== undefined;
                            const isCorrect = isAnswered && selected === mcq.correct_option;

                            return (
                              <div
                                key={mcq.id}
                                className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-2 border border-outline-variant/30"
                              >
                                <p className="font-body-md text-body-md font-semibold text-on-surface">
                                  {mcq.id}. {mcq.question}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                  {mcq.options.map((opt, optIdx) => {
                                    let btnStyle = 'bg-surface-container-low hover:bg-surface-container-high text-on-surface';
                                    if (isAnswered) {
                                      if (optIdx === mcq.correct_option) {
                                        btnStyle = 'bg-tertiary-fixed text-on-tertiary-fixed font-semibold';
                                      } else if (selected === optIdx) {
                                        btnStyle = 'bg-error-container text-on-error-container font-semibold';
                                      }
                                    }
                                    return (
                                      <button
                                        key={optIdx}
                                        onClick={() => setMcqAnswers({ ...mcqAnswers, [mcq.id]: optIdx })}
                                        className={`p-2 rounded-lg text-left text-body-sm transition-all ${btnStyle}`}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                                {isAnswered && (
                                  <p className="text-body-sm text-on-surface-variant pt-1 border-t border-outline-variant/20">
                                    <strong className={isCorrect ? 'text-tertiary' : 'text-error'}>
                                      {isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
                                    </strong>
                                    {mcq.explanation}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="pt-space-sm flex flex-wrap items-center justify-between gap-space-sm">
                        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                          <button
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="p-2 hover:bg-surface-container-high rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Copy response"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {copiedMessageId === msg.id ? 'check' : 'content_copy'}
                            </span>
                            <span>{copiedMessageId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            onClick={() => handleFeedback(msg.id, 'saved')}
                            className={`p-2 hover:bg-surface-container-high rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                              isSaved ? 'text-primary font-semibold' : ''
                            }`}
                            title="Save to Study Notebook"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isSaved ? 'bookmark' : 'bookmark_add'}
                            </span>
                            <span>{isSaved ? 'Saved' : 'Save Note'}</span>
                          </button>

                          <div className="h-4 w-px bg-outline-variant mx-1"></div>

                          <button
                            onClick={() => handleFeedback(msg.id, 'up')}
                            className={`p-2 hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer ${
                              feedback === 'up' ? 'text-primary' : ''
                            }`}
                            title="Helpful"
                          >
                            <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                          </button>

                          <button
                            onClick={() => handleFeedback(msg.id, 'down')}
                            className={`p-2 hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer ${
                              feedback === 'down' ? 'text-error' : ''
                            }`}
                            title="Needs improvement"
                          >
                            <span className="material-symbols-outlined text-[18px]">thumb_down</span>
                          </button>
                        </div>

                        <button
                          onClick={handleGenerateMCQs}
                          className="px-space-md py-1.5 rounded-lg bg-surface-container text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">quiz</span>
                          <span>Generate 3 Practice MCQs on this concept</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Subtle AI Thinking Indicator Node */}
            {sending && (
              <div className="max-w-4xl mx-auto flex items-center gap-space-md opacity-80">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-primary animate-pulse">
                    auto_awesome
                  </span>
                </div>
                <div className="flex items-center gap-space-sm px-space-md py-2 bg-surface-container-low rounded-full">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    EduMitra Socratic Coach is analyzing your syllabus reference...
                  </span>
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}

            {/* Dismissible Syllabus Toast */}
            {showToast && (
              <div className="max-w-4xl mx-auto p-space-md bg-surface-container rounded-xl flex items-center justify-between gap-space-md shadow-sm">
                <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">info</span>
                  <span>
                    Responses are grounded on uploaded university syllabus &amp; Korth / Silberschatz Database Systems textbooks.
                  </span>
                </div>
                <div className="flex items-center gap-space-sm shrink-0">
                  <button
                    onClick={() => handleSendMessage('Regenerate previous explanation with a simpler step-by-step example.')}
                    className="font-label-sm text-label-sm font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={() => setShowToast(false)}
                    className="text-outline hover:text-on-surface transition-colors p-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Question Prompt Chips */}
          <div className="px-space-md sm:px-space-lg shrink-0 max-w-4xl mx-auto w-full pt-1 pb-2">
            <div className="flex items-center gap-space-sm overflow-x-auto no-scrollbar">
              <span className="text-label-sm font-label-sm text-outline shrink-0 font-medium">Quick Prompts:</span>

              <button
                onClick={() => handleSendMessage('Explain a difficult topic: How does Deadlock Avoidance with Banker’s Algorithm work?')}
                className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px] text-primary">school</span>
                <span>Explain a difficult topic</span>
              </button>

              <button
                onClick={() => handleSendMessage('Help me prepare for an exam: What are the highest-yield topics in DBMS CS-304?')}
                className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px] text-secondary">fact_check</span>
                <span>Help me prepare for an exam</span>
              </button>

              <button
                onClick={() => handleSendMessage('Create a 7-day revision strategy for Semester 6 Midterms.')}
                className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px] text-tertiary">calendar_month</span>
                <span>Create a revision strategy</span>
              </button>

              <button
                onClick={() => handleSendMessage('Help me understand my quiz mistakes on indexing and tree height.')}
                className="px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px] text-error">analytics</span>
                <span>Help me understand my quiz mistakes</span>
              </button>
            </div>
          </div>

          {/* Message Input Dock Area */}
          <footer className="p-space-md pt-0 px-space-md sm:px-space-lg shrink-0 max-w-4xl mx-auto w-full space-y-2">
            <div className="bg-surface-container-low rounded-2xl shadow-sm p-space-sm focus-within:bg-surface-container transition-all">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="w-full bg-transparent text-on-surface font-body-md text-body-md placeholder:text-outline p-space-xs resize-none outline-none"
                placeholder="Ask anything about your syllabus, paste tricky C code, or request exam practice problems..."
                rows={2}
              ></textarea>

              <div className="flex items-center justify-between pt-1 relative">
                <div className="flex items-center gap-space-xs">
                  <button
                    onClick={() => setShowAttachModal(true)}
                    className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest rounded-xl transition-colors cursor-pointer"
                    title="Attach lecture slides or notes"
                  >
                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                  </button>

                  <button
                    onClick={handleToggleVoice}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isRecording
                        ? 'bg-error-container text-error animate-pulse'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest'
                    }`}
                    title={isRecording ? 'Listening...' : 'Voice Input'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isRecording ? 'mic' : 'mic'}
                    </span>
                  </button>

                  {/* Tone Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setToneDropdownOpen(!toneDropdownOpen)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-surface-container-lowest rounded-lg text-on-surface font-label-sm text-label-sm shadow-sm cursor-pointer hover:bg-surface-container-high transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px] text-primary">tune</span>
                      <span className="font-medium">{toneLabels[tone] || 'Concise Academic'}</span>
                      <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
                    </button>

                    {toneDropdownOpen && (
                      <div className="absolute left-0 bottom-full mb-1 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-1 z-50">
                        {Object.entries(toneLabels).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => handleToneChange(key)}
                            className={`w-full text-left px-3 py-1.5 text-body-sm flex items-center justify-between hover:bg-surface-container ${
                              tone === key ? 'text-primary font-semibold' : 'text-on-surface'
                            }`}
                          >
                            <span>{label}</span>
                            {tone === key && (
                              <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || sending}
                  className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md hover:bg-primary transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Send Query"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </div>
            </div>

            <div className="text-center font-body-sm text-body-sm text-outline">
              Responses are provided by EduMitra AI Socratic Engine grounded on AICTE/VTU CS-304 syllabus guidelines.
            </div>
          </footer>
        </section>
      </div>

      {/* Syllabi Sync Manage Modal */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
                <h3 className="font-headline-sm text-on-surface">Synced Syllabi &amp; Grounding</h3>
              </div>
              <button
                onClick={() => setShowManageModal(false)}
                className="text-outline hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-body-md text-on-surface-variant">
              The Socratic Tutor grounds all explanations in university course curricula and core textbooks:
            </p>

            <div className="space-y-2.5">
              <div className="p-3 bg-surface-container-low rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">menu_book</span>
                <div>
                  <h4 className="font-semibold text-on-surface text-body-md">CS-304: Database Management Systems</h4>
                  <p className="text-body-sm text-on-surface-variant">
                    VTU/AICTE 2024-25 • Reference: Silberschatz, Korth, Sudarshan (7th Ed.)
                  </p>
                </div>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">menu_book</span>
                <div>
                  <h4 className="font-semibold text-on-surface text-body-md">CS-301: Design &amp; Analysis of Algorithms</h4>
                  <p className="text-body-sm text-on-surface-variant">
                    Reference: Cormen, Leiserson, Rivest, Stein (CLRS 3rd Ed.)
                  </p>
                </div>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-tertiary text-[20px] mt-0.5">menu_book</span>
                <div>
                  <h4 className="font-semibold text-on-surface text-body-md">CS-302: Operating System Internals</h4>
                  <p className="text-body-sm text-on-surface-variant">
                    Reference: Silberschatz, Galvin, Gagne (10th Ed.)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowManageModal(false)}
                className="px-4 py-2 bg-primary-container text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:bg-primary transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attach Notes / Slides Modal */}
      {showAttachModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">attach_file</span>
                <h3 className="font-headline-sm text-on-surface">Attach Lecture Notes or Code</h3>
              </div>
              <button
                onClick={() => setShowAttachModal(false)}
                className="text-outline hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-body-sm text-on-surface-variant">
              Upload PDF course handouts, PPT slides, or code files (.c, .py, .java) to ground the Socratic AI on your exact classroom assignment.
            </p>

            <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center space-y-2 hover:border-primary transition-colors cursor-pointer bg-surface-container-low">
              <span className="material-symbols-outlined text-[32px] text-outline">cloud_upload</span>
              <p className="font-label-md text-on-surface font-semibold">Click to select file or drag &amp; drop</p>
              <p className="text-body-sm text-outline">PDF, PPTX, TXT, C, CPP, PY up to 15MB</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAttachModal(false)}
                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-xl font-label-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAttachModal(false);
                  setInputMessage((prev) => `${prev} [Attached: CS304_Unit3_Indexing.pdf] `);
                }}
                className="px-4 py-2 bg-primary-container text-on-primary rounded-xl font-label-md font-semibold hover:bg-primary transition-colors"
              >
                Attach Reference
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Conversation Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined text-[24px]">warning</span>
              <h3 className="font-headline-sm text-on-surface">Clear Conversation?</h3>
            </div>
            <p className="text-body-md text-on-surface-variant">
              This will remove all dialogue messages in this session. The session itself and your other saved study guides will remain intact.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-xl font-label-md"
              >
                Cancel
              </button>
              <button
                onClick={handleClearConversation}
                className="px-4 py-2 bg-error text-on-error rounded-xl font-label-md font-semibold hover:opacity-90 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistancePage;
