import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, ArrowLeft, 
  Sparkles, Maximize2, ShieldAlert, BookOpen, Clock, AlertTriangle, 
  ExternalLink, Check, ChevronRight, HelpCircle, Filter, Sliders,
  Plus, Minus, Hash, ListChecks, Zap, Layers, RefreshCw
} from "lucide-react";
import confetti from "canvas-confetti";
import { 
  getEligibleQuestions, 
  getQuestionCount, 
  generateTest, 
  getQuestionBankStats,
  getAllTopics,
  getAllQuestionTypes,
  VERIFIED_GATE_PYQS,
  INTERACTIVE_QUESTIONS 
} from "../data/questionBank";

export function PracticeQuizPage() {
  // Mode selection: "setup" | "gate_exam" | "practice_quiz" | "result"
  const [currentView, setCurrentView] = useState("setup");
  const [activeMode, setActiveMode] = useState("gate"); // "gate" | "practice"

  // Setup Options & Dynamic Filters
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL"); // "ALL" | "Easy" | "Medium" | "Hard"
  const [selectedTopic, setSelectedTopic] = useState("ALL");
  const [selectedQuestionType, setSelectedQuestionType] = useState("ALL"); // "ALL" | "MCQ" | "MSQ" | "NAT"
  const [selectedMarks, setSelectedMarks] = useState("ALL"); // "ALL" | 1 | 2 (for GATE)
  const [selectedCount, setSelectedCount] = useState(10);
  const [instantFeedbackMode, setInstantFeedbackMode] = useState(true); // for Interactive Practice

  // Active Test State
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: optionId | string | string[] }
  const [revealedSolutions, setRevealedSolutions] = useState({}); // { [questionId]: boolean } for practice instant check
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [submissionReason, setSubmissionReason] = useState("normal"); // "normal" | "fullscreen_exit"
  const [score, setScore] = useState(0);
  const [scoredMarks, setScoredMarks] = useState(0);
  const [totalPossibleMarks, setTotalPossibleMarks] = useState(0);
  const [fullscreenError, setFullscreenError] = useState("");
  const [testStartTime, setTestStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const isExamActiveRef = useRef(false);
  const questionCardRef = useRef(null);

  // Reset scroll to top whenever entering a new view
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [currentView]);

  // Keep question card predictably in view when navigating questions without full-page jumps
  useEffect(() => {
    if (questionCardRef.current && (currentView === "gate_exam" || currentView === "practice_quiz")) {
      const rect = questionCardRef.current.getBoundingClientRect();
      if (rect.top < 76 || rect.top > window.innerHeight - 120) {
        questionCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [currentIndex, currentView]);

  // -------------------------------------------------------------------------
  // Dynamic Calculation of Bank Statistics
  // -------------------------------------------------------------------------
  const stats = useMemo(() => {
    return getQuestionBankStats(activeMode);
  }, [activeMode]);

  // Unique topics and question types dynamically derived from active question bank
  const availableTopics = useMemo(() => {
    return getAllTopics(activeMode);
  }, [activeMode]);

  const availableQuestionTypes = useMemo(() => {
    return getAllQuestionTypes(activeMode);
  }, [activeMode]);

  // -------------------------------------------------------------------------
  // Dynamic Calculation of Eligible Questions based on Active Filters
  // -------------------------------------------------------------------------
  const currentFilters = useMemo(() => ({
    mode: activeMode,
    difficulty: selectedDifficulty,
    topic: selectedTopic,
    questionType: selectedQuestionType,
    marks: activeMode === "gate" ? selectedMarks : "ALL"
  }), [activeMode, selectedDifficulty, selectedTopic, selectedQuestionType, selectedMarks]);

  const eligibleQuestions = useMemo(() => {
    return getEligibleQuestions(currentFilters);
  }, [currentFilters]);

  const eligibleQuestionCount = eligibleQuestions.length;

  // Whenever eligible pool changes, automatically clamp selectedCount to eligibleQuestionCount
  useEffect(() => {
    if (eligibleQuestionCount === 0) {
      setSelectedCount(0);
    } else if (selectedCount > eligibleQuestionCount) {
      setSelectedCount(eligibleQuestionCount);
    } else if (selectedCount === 0 && eligibleQuestionCount > 0) {
      setSelectedCount(Math.min(10, eligibleQuestionCount));
    }
  }, [eligibleQuestionCount]);

  // When active mode changes, reset topic / questionType / difficulty if needed
  const handleModeChange = (newMode) => {
    setActiveMode(newMode);
    setSelectedDifficulty("ALL");
    setSelectedTopic("ALL");
    setSelectedQuestionType("ALL");
    setSelectedMarks("ALL");
    const count = getQuestionCount({ mode: newMode });
    setSelectedCount(Math.min(10, count));
  };

  // -------------------------------------------------------------------------
  // Fullscreen & Anti-Cheat Auto-Submission Listener for GATE Mode
  // -------------------------------------------------------------------------
  useEffect(() => {
    isExamActiveRef.current = (currentView === "gate_exam" && !testSubmitted);
  }, [currentView, testSubmitted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isExamActiveRef.current) {
        submitTest("fullscreen_exit");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [activeQuestions, userAnswers]);

  // Elapsed Timer during active test
  useEffect(() => {
    let interval = null;
    if ((currentView === "gate_exam" || currentView === "practice_quiz") && !testSubmitted) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentView, testSubmitted]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // -------------------------------------------------------------------------
  // Helper to Evaluate Question Correctness
  // -------------------------------------------------------------------------
  const checkQuestionCorrectness = (q, userAns) => {
    if (userAns === undefined || userAns === null || userAns === "") return false;
    const qType = (q.questionType || q.type || "").toUpperCase();

    if (qType === "MSQ") {
      // Multiple Select: userAns is an array of option IDs
      const correctOptIds = (q.options || [])
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.id)
        .sort();
      const userSelectedIds = Array.isArray(userAns) ? [...userAns].sort() : [];
      if (correctOptIds.length !== userSelectedIds.length) return false;
      return correctOptIds.every((id, idx) => id === userSelectedIds[idx]);
    } else if (qType === "NAT") {
      // Numerical Answer Type: compare string or number equality
      const expected = String(q.answer).trim();
      const actual = String(userAns).trim();
      return expected === actual || Number(expected) === Number(actual);
    } else {
      // Standard MCQ: userAns is option ID (e.g. "B")
      const correctOption = (q.options || []).find((opt) => opt.isCorrect);
      if (correctOption) {
        return userAns === correctOption.id;
      }
      return String(userAns).toUpperCase() === String(q.answer).toUpperCase();
    }
  };

  // -------------------------------------------------------------------------
  // Start Exam / Practice
  // -------------------------------------------------------------------------
  const handleStartTest = async () => {
    setFullscreenError("");

    if (eligibleQuestionCount === 0) {
      setFullscreenError("No questions match the current filter selection. Please reset or adjust filters.");
      return;
    }

    const testQuestions = generateTest(currentFilters, selectedCount);
    if (!testQuestions || testQuestions.length === 0) {
      setFullscreenError("Unable to initialize question set with current parameters.");
      return;
    }

    setActiveQuestions(testQuestions);
    setUserAnswers({});
    setRevealedSolutions({});
    setCurrentIndex(0);
    setTestSubmitted(false);
    setSubmissionReason("normal");
    setElapsedSeconds(0);
    setTestStartTime(Date.now());

    if (activeMode === "gate") {
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
        setCurrentView("gate_exam");
      } catch (err) {
        setFullscreenError("Fullscreen permission was blocked by your browser. Please allow fullscreen access to start the authentic GATE Proctor Mode.");
      }
    } else {
      setCurrentView("practice_quiz");
    }
  };

  // -------------------------------------------------------------------------
  // Submit Test & Calculate Results
  // -------------------------------------------------------------------------
  const submitTest = (reason = "normal") => {
    isExamActiveRef.current = false;
    setSubmissionReason(reason);
    setTestSubmitted(true);

    let rawScore = 0;
    let marksEarned = 0;
    let maxMarks = 0;

    activeQuestions.forEach((q) => {
      const qMarks = q.marks || (activeMode === "gate" ? 2 : 1);
      maxMarks += qMarks;

      const userAns = userAnswers[q.id];
      const isCorrect = checkQuestionCorrectness(q, userAns);

      if (isCorrect) {
        rawScore += 1;
        marksEarned += qMarks;
      } else if (activeMode === "gate" && userAns !== undefined && userAns !== "") {
        // Authentic GATE negative marking for MCQs only (1/3rd negative)
        const qType = (q.questionType || q.type || "").toUpperCase();
        if (qType === "MCQ") {
          marksEarned -= qMarks / 3;
        }
      }
    });

    setScore(rawScore);
    setScoredMarks(Math.max(0, Number(marksEarned.toFixed(2))));
    setTotalPossibleMarks(maxMarks);
    setCurrentView("result");

    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }

    if (rawScore / activeQuestions.length >= 0.7) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  };

  // Option selection handlers
  const handleSelectOption = (questionId, optionId, qType = "MCQ") => {
    if (testSubmitted) return;

    if (qType === "MSQ") {
      setUserAnswers((prev) => {
        const currentList = Array.isArray(prev[questionId]) ? prev[questionId] : [];
        const isAlreadySelected = currentList.includes(optionId);
        const updated = isAlreadySelected
          ? currentList.filter((id) => id !== optionId)
          : [...currentList, optionId];
        return { ...prev, [questionId]: updated };
      });
    } else {
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: optionId
      }));
    }
  };

  const handleNatInputChange = (questionId, value) => {
    if (testSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const toggleRevealSolution = (questionId) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Return to configuration setup
  const handleResetToSetup = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setCurrentView("setup");
    setTestSubmitted(false);
    setUserAnswers({});
    setRevealedSolutions({});
    setActiveQuestions([]);
    setFullscreenError("");
  };

  // Convenient preset question count buttons
  const presetCounts = [5, 10, 20, 30, 50, 100];

  // =========================================================================
  // 1. SETUP / CONFIGURATION SCREEN
  // =========================================================================
  if (currentView === "setup") {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fade-in font-serif">
        {/* Academic Header */}
        <div className="text-center space-y-2">
          <div 
            className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full font-bold text-xs uppercase tracking-wider"
            style={{
              backgroundColor: "var(--bg-elevated)",
              color: activeMode === "gate" ? "var(--semantic-match)" : "var(--color-accent)",
              border: "1px solid var(--border-subtle)"
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Database Assessment Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: "var(--text-main)" }}>
            Relational Algebra & JOIN Assessment System
          </h1>
          <p className="text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Comprehensive knowledge evaluation on relational algebra, equijoins, natural joins, outer joins, join cardinalities, and SQL predicate semantics.
          </p>
        </div>

        {/* Dynamic Question Bank Statistics Row */}
        <div 
          className="rounded-2xl border p-4 sm:p-5 shadow-xs"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 font-mono font-bold">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="uppercase tracking-wider" style={{ color: "var(--text-main)" }}>
                {activeMode === "gate" ? "VERIFIED GATE PYQ BANK" : "INTERACTIVE QUESTION BANK"}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-lg border font-bold bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                {stats.total} Total Pool
              </span>
              <span className="px-2 py-1 rounded-lg border text-emerald-400 bg-emerald-500/10 border-emerald-500/30">
                {stats.difficulty.easy} Easy
              </span>
              <span className="px-2 py-1 rounded-lg border text-amber-400 bg-amber-500/10 border-amber-500/30">
                {stats.difficulty.medium} Medium
              </span>
              <span className="px-2 py-1 rounded-lg border text-rose-400 bg-rose-500/10 border-rose-500/30">
                {stats.difficulty.hard} Hard
              </span>
              {activeMode === "gate" ? (
                <>
                  <span className="px-2 py-1 rounded-lg border text-blue-400 bg-blue-500/10 border-blue-500/30">
                    {stats.marks.marks1} × 1 Mark
                  </span>
                  <span className="px-2 py-1 rounded-lg border text-violet-400 bg-violet-500/10 border-violet-500/30">
                    {stats.marks.marks2} × 2 Marks
                  </span>
                </>
              ) : (
                <>
                  <span className="px-2 py-1 rounded-lg border text-violet-400 bg-violet-500/10 border-violet-500/30">
                    {stats.types.mcq} MCQ
                  </span>
                  <span className="px-2 py-1 rounded-lg border text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30">
                    {stats.types.msq} MSQ
                  </span>
                  <span className="px-2 py-1 rounded-lg border text-sky-400 bg-sky-500/10 border-sky-500/30">
                    {stats.types.nat} NAT
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mode Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: GATE Exam Mode */}
          <div 
            onClick={() => handleModeChange("gate")}
            className={`p-6 rounded-3xl border cursor-pointer transition-all ${
              activeMode === "gate" 
                ? "border-cyan-500 shadow-md ring-2 ring-cyan-500/30" 
                : "hover:border-slate-500 opacity-80"
            }`}
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-mono">
                VERIFIED GATE PYQ BANK
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">100% Genuine Previous Years</span>
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="text-xl font-black flex items-center space-x-2" style={{ color: "var(--text-main)" }}>
                <span>GATE EXAM MODE</span>
                {activeMode === "gate" && <Check className="w-5 h-5 text-cyan-400" />}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Fullscreen exam simulation. Draws strictly from genuine, verified GATE CSE questions (1994–2018) with official marks, negative marking, and auto-submission on fullscreen exit.
              </p>
            </div>
          </div>

          {/* Card 2: Interactive Practice Mode */}
          <div 
            onClick={() => handleModeChange("practice")}
            className={`p-6 rounded-3xl border cursor-pointer transition-all ${
              activeMode === "practice" 
                ? "border-violet-500 shadow-md ring-2 ring-violet-500/30" 
                : "hover:border-slate-500 opacity-80"
            }`}
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30 font-mono">
                INTERACTIVE QUESTION BANK
              </span>
              <span className="text-xs font-mono text-violet-400 font-bold">116+ Curated Problems</span>
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="text-xl font-black flex items-center space-x-2" style={{ color: "var(--text-main)" }}>
                <span>INTERACTIVE PRACTICE</span>
                {activeMode === "practice" && <Check className="w-5 h-5 text-violet-400" />}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Large question bank with MCQs, MSQs, and numerical NAT questions. Offers instant learning feedback, step-by-step explanations, and theoretical analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Setup Card */}
        <div 
          className="rounded-3xl border p-6 sm:p-8 space-y-7 shadow-sm"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
        >
          {/* Header & Dynamic Available Pool Indicator */}
          <div className="flex flex-wrap items-center justify-between pb-4 border-b gap-2" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base sm:text-lg font-bold" style={{ color: "var(--text-main)" }}>
                Dynamic Test Parameters & Filters
              </h3>
            </div>
            
            {/* Dynamic pool count indicator */}
            <div className="text-xs font-mono px-3 py-1 rounded-xl border bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold">
              {activeMode === "gate"
                ? `${eligibleQuestionCount} verified GATE PYQs available`
                : `${eligibleQuestionCount} questions available in pool`}
            </div>
          </div>

          {/* Dynamic Filters Section */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider block font-mono" style={{ color: "var(--text-muted)" }}>
              Filter Criteria (Pool size updates dynamically)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Filter 1: Difficulty */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-400">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-hidden cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-main)"
                  }}
                >
                  <option value="ALL">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Filter 2: Topic */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-400">
                  Topic Focus
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-hidden cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-main)"
                  }}
                >
                  <option value="ALL">All Topics ({availableTopics.length})</option>
                  {availableTopics.map((top) => (
                    <option key={top} value={top}>{top}</option>
                  ))}
                </select>
              </div>

              {/* Filter 3: Question Type */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-400">
                  Question Type
                </label>
                <select
                  value={selectedQuestionType}
                  onChange={(e) => setSelectedQuestionType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-hidden cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-main)"
                  }}
                >
                  <option value="ALL">All Types</option>
                  {availableQuestionTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* GATE Marks Filter */}
            {activeMode === "gate" && (
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">Marks:</span>
                {["ALL", 1, 2].map((mk) => (
                  <button
                    key={mk}
                    type="button"
                    onClick={() => setSelectedMarks(mk)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                      selectedMarks === mk
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                        : "border-slate-800 hover:border-slate-600 text-slate-400"
                    }`}
                  >
                    {mk === "ALL" ? "All Marks" : `${mk} Mark${mk > 1 ? "s" : ""}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* DYNAMIC QUESTION COUNT SELECTOR                                 */}
          {/* =============================================================== */}
          <div className="space-y-4 pt-2 border-t" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider block font-mono" style={{ color: "var(--text-muted)" }}>
                Number of Questions to Select
              </label>
              <span className="text-xs font-mono text-slate-400">
                Max Allowed: <strong className="text-cyan-400">{eligibleQuestionCount}</strong>
              </span>
            </div>

            {eligibleQuestionCount === 0 ? (
              <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Zero questions match this filter combination. Please select "All Topics" or "All Levels" above to broaden your pool.</span>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Large Stepper Controller */}
                <div 
                  className="p-4 sm:p-5 rounded-2xl border flex items-center justify-between max-w-md mx-auto shadow-inner"
                  style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedCount((prev) => Math.max(1, prev - 1))}
                    disabled={selectedCount <= 1}
                    className="w-11 h-11 rounded-xl border flex items-center justify-center font-bold text-lg transition-all disabled:opacity-20 cursor-pointer hover:bg-cyan-500/20 hover:border-cyan-500 text-cyan-400"
                    style={{ borderColor: "var(--border-subtle)" }}
                    title="Decrease question count"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight" style={{ color: "var(--text-main)" }}>
                      {selectedCount}
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      of {eligibleQuestionCount} eligible
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCount((prev) => Math.min(eligibleQuestionCount, prev + 1))}
                    disabled={selectedCount >= eligibleQuestionCount}
                    className="w-11 h-11 rounded-xl border flex items-center justify-center font-bold text-lg transition-all disabled:opacity-20 cursor-pointer hover:bg-cyan-500/20 hover:border-cyan-500 text-cyan-400"
                    style={{ borderColor: "var(--border-subtle)" }}
                    title="Increase question count"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Convenient Preset Buttons */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400 block uppercase">
                    Quick Presets
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {presetCounts.map((count) => {
                      const isSelected = selectedCount === count;
                      const isAvailable = count <= eligibleQuestionCount;
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setSelectedCount(count)}
                          disabled={!isAvailable}
                          className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
                            isSelected
                              ? activeMode === "gate"
                                ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 ring-2 ring-cyan-500/30"
                                : "bg-violet-500/20 border-violet-500 text-violet-400 ring-2 ring-violet-500/30"
                              : "hover:border-slate-500 text-slate-400"
                          } ${!isAvailable ? "opacity-25 cursor-not-allowed" : ""}`}
                          style={{
                            backgroundColor: isSelected ? undefined : "var(--bg-elevated)",
                            borderColor: isSelected ? undefined : "var(--border-subtle)"
                          }}
                        >
                          {count}
                        </button>
                      );
                    })}

                    {/* All Eligible / Max Available button */}
                    <button
                      type="button"
                      onClick={() => setSelectedCount(eligibleQuestionCount)}
                      className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
                        selectedCount === eligibleQuestionCount
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/30"
                          : "hover:border-slate-500 text-slate-400"
                      }`}
                      style={{
                        backgroundColor: selectedCount === eligibleQuestionCount ? undefined : "var(--bg-elevated)",
                        borderColor: selectedCount === eligibleQuestionCount ? undefined : "var(--border-subtle)"
                      }}
                    >
                      All ({eligibleQuestionCount})
                    </button>
                  </div>
                </div>

                {/* Range Slider for Fine-Grained Custom Selection */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>1 Question</span>
                    <span>Slider: {selectedCount}</span>
                    <span>{eligibleQuestionCount} Max</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={eligibleQuestionCount}
                    value={selectedCount}
                    onChange={(e) => setSelectedCount(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Interactive Practice Mode Options */}
          {activeMode === "practice" && (
            <div 
              className="p-4 rounded-2xl border flex items-center justify-between"
              style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold block" style={{ color: "var(--text-main)" }}>
                  Instant Learning Feedback Mode
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Reveal solution and pedagogical explanations immediately after choosing an answer
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInstantFeedbackMode(!instantFeedbackMode)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  instantFeedbackMode ? "bg-violet-500" : "bg-slate-700"
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    instantFeedbackMode ? "right-1" : "left-1"
                  }`} 
                />
              </button>
            </div>
          )}

          {/* Academic Verification Notice */}
          <div 
            className="p-4 rounded-2xl border text-xs leading-relaxed space-y-1"
            style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
          >
            <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-cyan-400 text-[11px] font-mono">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>ACADEMIC VERIFICATION & PROCTOR INTEGRITY</span>
            </div>
            <p>
              {activeMode === "gate"
                ? "The GATE Exam Mode draws exclusively from genuine, verified GATE CSE Previous Year Questions with authentic marks. Exiting fullscreen mode automatically submits and locks your examination paper to prevent tab switching."
                : "The Interactive Practice Bank offers 116+ curated questions covering all facets of Relational Algebra, equijoins, natural joins, outer joins, and SQL execution."}
            </p>
          </div>

          {fullscreenError && (
            <div className="p-3.5 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{fullscreenError}</span>
            </div>
          )}

          {/* Start Test Action Button */}
          <button
            onClick={handleStartTest}
            disabled={eligibleQuestionCount === 0}
            className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))"
            }}
          >
            {activeMode === "gate" ? <Maximize2 className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            <span>
              {activeMode === "gate" 
                ? `START FULLSCREEN GATE EXAM (${selectedCount} PYQs)` 
                : `START INTERACTIVE PRACTICE (${selectedCount} Questions)`}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. ACTIVE TEST / EXAM INTERFACE (GATE EXAM MODE & PRACTICE DRILL)
  // =========================================================================
  if (currentView === "gate_exam" || currentView === "practice_quiz") {
    const currentQ = activeQuestions[currentIndex];
    const totalQ = activeQuestions.length;
    const answeredCount = Object.keys(userAnswers).filter((k) => {
      const ans = userAnswers[k];
      return ans !== undefined && ans !== null && (Array.isArray(ans) ? ans.length > 0 : String(ans).trim() !== "");
    }).length;
    
    const currentQType = (currentQ?.questionType || currentQ?.type || "MCQ").toUpperCase();
    const isAnswerRevealed = Boolean(revealedSolutions[currentQ.id]);
    const currentUserAns = userAnswers[currentQ.id];

    // Determine if the user has selected/entered an answer for this question
    const hasSelectedAnswer = (() => {
      if (currentUserAns === undefined || currentUserAns === null) return false;
      if (currentQType === "MSQ") {
        return Array.isArray(currentUserAns) && currentUserAns.length > 0;
      }
      return String(currentUserAns).trim() !== "";
    })();

    return (
      <div className="max-w-4xl w-full mx-auto space-y-6 pb-20 animate-fade-in font-serif">
        {/* Top Professional Exam Bar - Sticky below main Navbar */}
        <div 
          className="sticky top-[72px] z-30 p-4 rounded-2xl border shadow-sm flex flex-wrap items-center justify-between gap-3 backdrop-blur-md transition-colors"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)"
          }}
        >
          <div className="flex items-center space-x-3">
            <span 
              className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider font-mono shadow-xs"
              style={{
                background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))"
              }}
            >
              {activeMode === "gate" ? "GATE CSE EXAM" : "PRACTICE DRILL"}
            </span>
            <span className="font-bold text-sm hidden sm:inline" style={{ color: "var(--text-main)" }}>
              DBMS: JOIN Operations & Relational Algebra
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center space-x-1" style={{ color: "var(--text-muted)" }}>
              <Clock className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />
              <span>{formatTime(elapsedSeconds)}</span>
            </span>
            <span style={{ color: "var(--text-muted)" }}>
              Answered: <strong style={{ color: "var(--color-primary)" }}>{answeredCount}</strong> / {totalQ}
            </span>
            <span style={{ color: "var(--text-muted)" }}>
              Question: <strong style={{ color: "var(--color-accent)" }}>{currentIndex + 1}</strong> of {totalQ}
            </span>
            <button
              onClick={() => submitTest("normal")}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold hover:bg-rose-500/25 transition-colors cursor-pointer"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Question Card */}
        <div 
          ref={questionCardRef}
          className="w-full p-6 sm:p-10 rounded-3xl border shadow-md space-y-6 flex flex-col justify-between"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)"
          }}
        >
          {/* Question Metadata Header */}
          <div className="space-y-3 pb-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span 
                  className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: "rgba(var(--primary-r), var(--primary-g), var(--primary-b), 0.15)",
                    borderColor: "var(--color-primary)",
                    color: "var(--color-primary)"
                  }}
                >
                  {activeMode === "gate" 
                    ? `★ VERIFIED GATE PYQ • ${currentQ.year} ${currentQ.set ? `(${currentQ.set})` : ""}`
                    : "✦ INTERACTIVE PRACTICE"}
                </span>
                <span className="text-slate-400 font-bold hidden sm:inline">• {currentQ.topic}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                  {currentQType}
                </span>
                <span 
                  className="px-2 py-0.5 rounded font-bold"
                  style={{
                    backgroundColor: "rgba(var(--primary-r), var(--primary-g), var(--primary-b), 0.12)",
                    color: "var(--color-primary)"
                  }}
                >
                  {currentQ.marks || (activeMode === "gate" ? 2 : 1)} Mark{(currentQ.marks || 1) > 1 ? "s" : ""}
                </span>
                <span 
                  className="px-2 py-0.5 rounded font-bold"
                  style={{
                    backgroundColor: "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.12)",
                    color: "var(--color-accent)"
                  }}
                >
                  {currentQ.difficulty}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-xl font-bold leading-relaxed whitespace-pre-line" style={{ color: "var(--text-main)" }}>
              {currentQ.question}
            </h2>

            {currentQType === "MSQ" && (
              <div className="text-xs font-mono font-semibold" style={{ color: "var(--color-accent)" }}>
                ℹ️ Multiple Select Question: One or more options may be correct.
              </div>
            )}
          </div>

          {/* Options & Input Area */}
          <div className="space-y-3.5 my-4">
            {currentQType === "NAT" ? (
              /* Numerical Answer Input */
              <div className="space-y-3 p-4 rounded-2xl border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                <label className="text-xs font-mono font-bold uppercase text-slate-400 block">
                  Enter Numerical Answer:
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={currentUserAns || ""}
                    onChange={(e) => handleNatInputChange(currentQ.id, e.target.value)}
                    placeholder="e.g. 24"
                    className={`p-3 rounded-xl border font-mono text-base font-bold w-48 outline-hidden transition-colors ${
                      isAnswerRevealed
                        ? checkQuestionCorrectness(currentQ, currentUserAns)
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                          : "border-rose-500 bg-rose-500/10 text-rose-300"
                        : ""
                    }`}
                    style={{
                      backgroundColor: isAnswerRevealed ? undefined : "var(--bg-surface)",
                      borderColor: isAnswerRevealed ? undefined : "var(--border-subtle)",
                      color: isAnswerRevealed ? undefined : "var(--text-main)"
                    }}
                  />
                  <span className="text-xs font-mono text-slate-400">Numerical Value</span>
                </div>
              </div>
            ) : (
              /* Multiple Choice / Multiple Select Grid */
              (currentQ.options || []).map((opt) => {
                const isSelected = currentQType === "MSQ"
                  ? Array.isArray(currentUserAns) && currentUserAns.includes(opt.id)
                  : currentUserAns === opt.id;

                const isCorrectOption = opt.isCorrect;
                const showInstantHighlight = Boolean(isAnswerRevealed);

                let borderHighlight = "hover:border-slate-500";
                let dynamicStyle = {
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-main)"
                };

                if (showInstantHighlight) {
                  if (isCorrectOption) {
                    borderHighlight = "bg-emerald-500/15 border-emerald-500 text-emerald-400 font-semibold";
                    dynamicStyle = {};
                  } else if (isSelected && !isCorrectOption) {
                    borderHighlight = "bg-rose-500/15 border-rose-500 text-rose-400 font-semibold";
                    dynamicStyle = {};
                  }
                } else if (isSelected) {
                  borderHighlight = "ring-2 font-bold";
                  dynamicStyle = {
                    backgroundColor: "rgba(var(--primary-r), var(--primary-g), var(--primary-b), 0.15)",
                    borderColor: "var(--color-primary)",
                    color: "var(--text-main)",
                    boxShadow: "0 0 12px var(--color-primary-glow)"
                  };
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id, currentQType)}
                    className={`w-full p-4 rounded-2xl border text-left text-sm sm:text-base transition-all flex items-start space-x-3 cursor-pointer ${borderHighlight}`}
                    style={dynamicStyle}
                  >
                    <span 
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold transition-colors ${
                        showInstantHighlight && isCorrectOption
                          ? "bg-emerald-500 text-black font-black"
                          : showInstantHighlight && isSelected && !isCorrectOption
                          ? "bg-rose-500 text-white font-black"
                          : isSelected 
                          ? "text-white"
                          : "bg-slate-700/50 text-slate-300"
                      }`}
                      style={{
                        backgroundColor: isSelected && !showInstantHighlight ? "var(--color-primary)" : undefined
                      }}
                    >
                      {currentQType === "MSQ" ? (isSelected ? "☑" : "☐") : opt.id}
                    </span>
                    <span className="leading-snug pt-0.5">{opt.text}</span>
                  </button>
                );
              })
            )}

            {/* Instant Answer Checking & Solution Section (Available in both Gate Mode and Practice Mode) */}
            <div className="pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!hasSelectedAnswer && !isAnswerRevealed) return;
                    toggleRevealSolution(currentQ.id);
                  }}
                  disabled={!hasSelectedAnswer && !isAnswerRevealed}
                  title={!hasSelectedAnswer && !isAnswerRevealed ? "Please select an answer first to check" : (isAnswerRevealed ? "Hide Solution" : "Check Answer")}
                  className="px-4 py-2 rounded-xl border text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    color: "var(--color-accent)",
                    borderColor: "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.4)",
                    backgroundColor: "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.12)"
                  }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isAnswerRevealed ? "Hide Solution" : "Check Answer & Solution"}</span>
                </button>

                {!hasSelectedAnswer && !isAnswerRevealed && (
                  <span className="text-xs font-mono text-slate-400 italic">
                    Select an answer above to enable checking
                  </span>
                )}
              </div>

              {isAnswerRevealed && (
                <div 
                  className="mt-3 p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm space-y-2.5 animate-fade-in"
                  style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono font-bold">
                    <div className="flex items-center space-x-2">
                      {checkQuestionCorrectness(currentQ, currentUserAns) ? (
                        <span className="text-emerald-400 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Correct!</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center space-x-1.5">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>Incorrect / Needs Review</span>
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 font-mono text-xs">
                      Correct Answer: <strong className="text-emerald-400">{Array.isArray(currentQ.answer) ? currentQ.answer.join(", ") : currentQ.answer}</strong>
                    </span>
                  </div>
                  {currentQ.explanation && (
                    <div className="pt-2 border-t border-slate-700/40">
                      <p style={{ color: "var(--text-main)" }} className="whitespace-pre-line font-serif leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-opacity disabled:opacity-30 cursor-pointer"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-main)"
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Jump Palette Indicator */}
            <div className="flex items-center space-x-1 overflow-x-auto max-w-[200px] sm:max-w-xs py-1 px-2">
              {activeQuestions.map((qItem, i) => {
                const hasAnswered = userAnswers[qItem.id] !== undefined && userAnswers[qItem.id] !== "" && (!Array.isArray(userAnswers[qItem.id]) || userAnswers[qItem.id].length > 0);
                return (
                  <button
                    key={qItem.id || i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-3.5 h-3.5 rounded-full transition-all shrink-0 cursor-pointer ${
                      i === currentIndex
                        ? "scale-125 ring-2 ring-white/40"
                        : hasAnswered
                        ? "bg-emerald-500"
                        : "bg-slate-700"
                    }`}
                    style={{
                      backgroundColor: i === currentIndex ? "var(--color-primary)" : undefined
                    }}
                    title={`Jump to Question ${i + 1}`}
                  />
                );
              })}
            </div>

            {currentIndex < totalQ - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQ - 1, prev + 1))}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-white font-bold text-xs sm:text-sm shadow-xs transition-transform hover:scale-105 cursor-pointer"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => submitTest("normal")}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-white font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 shadow-xs transition-transform hover:scale-105 cursor-pointer"
              >
                <span>Submit & View Results</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Proctor / Status Notice */}
        <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-500 pt-3 font-mono">
          {activeMode === "gate" ? (
            <span>⚠️ Proctor Active: Exiting fullscreen mode or pressing ESC will immediately submit your examination paper.</span>
          ) : (
            <span>Self-Paced Conceptual Practice Drill • Question {currentIndex + 1} of {totalQ}</span>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. SUBMISSION RESULT & QUESTION-WISE REVIEW SCREEN
  // =========================================================================
  if (currentView === "result") {
    const totalQ = activeQuestions.length;
    const accuracy = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;
    const incorrectCount = totalQ - score;

    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fade-in font-serif">
        {/* Fullscreen auto-submit notification alert if triggered */}
        {submissionReason === "fullscreen_exit" && (
          <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/15 text-amber-300 text-xs sm:text-sm flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
            <div>
              <strong className="block font-bold uppercase tracking-wider font-mono">EXAM SUBMITTED VIA PROCTOR INTEGRITY:</strong>
              <span>Test submitted because fullscreen mode was exited.</span>
            </div>
          </div>
        )}

        {/* Performance Score Card */}
        <div 
          className="border rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md"
            style={{
              backgroundColor: accuracy >= 70 ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
              color: accuracy >= 70 ? "#10B981" : "#F59E0B"
            }}
          >
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "var(--text-main)" }}>
              {activeMode === "gate" ? "GATE CSE Exam Results" : "Practice Assessment Results"}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-400">
              Evaluated on {totalQ} Relational Algebra & JOIN Questions • Time: {formatTime(elapsedSeconds)}
            </p>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {activeMode === "gate" ? (
              <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">GATE Score</span>
                <strong className="text-2xl font-black text-cyan-400">{scoredMarks} / {totalPossibleMarks}</strong>
                <span className="text-[10px] text-slate-400 block font-mono">Marks</span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Total Score</span>
                <strong className="text-2xl font-black text-cyan-400">{score} / {totalQ}</strong>
                <span className="text-[10px] text-slate-400 block font-mono">Questions</span>
              </div>
            )}

            <div className="p-4 rounded-2xl border text-center bg-emerald-500/10 border-emerald-500/30">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block font-mono">Correct</span>
              <strong className="text-2xl font-black text-emerald-400">{score}</strong>
              <span className="text-[10px] text-emerald-400 block font-mono">Answers</span>
            </div>

            <div className="p-4 rounded-2xl border text-center bg-rose-500/10 border-rose-500/30">
              <span className="text-[10px] uppercase font-bold text-rose-400 block font-mono">Incorrect</span>
              <strong className="text-2xl font-black text-rose-400">{incorrectCount}</strong>
              <span className="text-[10px] text-rose-400 block font-mono">Answers</span>
            </div>

            <div className="p-4 rounded-2xl border text-center bg-violet-500/10 border-violet-500/30">
              <span className="text-[10px] uppercase font-bold text-violet-400 block font-mono">Accuracy</span>
              <strong className="text-2xl font-black text-violet-400">{accuracy}%</strong>
              <span className="text-[10px] text-violet-400 block font-mono">Percentage</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartTest}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105 cursor-pointer font-mono"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again (New Random Set)</span>
            </button>

            <button
              onClick={handleResetToSetup}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl border font-bold text-xs sm:text-sm hover:opacity-80 transition-opacity cursor-pointer font-mono"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-main)"
              }}
            >
              <span>Change Question Count / Filters</span>
            </button>
          </div>
        </div>

        {/* Question-by-Question Detailed Academic Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-black flex items-center space-x-2" style={{ color: "var(--text-main)" }}>
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Question-Wise Solution & Theoretical Analysis</span>
          </h3>

          <div className="space-y-5">
            {activeQuestions.map((q, qIndex) => {
              const userAns = userAnswers[q.id];
              const isCorrect = checkQuestionCorrectness(q, userAns);
              const qType = (q.questionType || q.type || "MCQ").toUpperCase();

              return (
                <div
                  key={q.id || qIndex}
                  className="p-6 rounded-3xl border space-y-4 transition-all"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: isCorrect ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"
                  }}
                >
                  {/* Question Header & Verification Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="font-bold text-slate-400">Q{qIndex + 1}.</span>
                      {q.year ? (
                        <span className="px-2.5 py-0.5 rounded-lg font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/40">
                          ★ VERIFIED GATE PYQ • {q.year} {q.set ? `(${q.set})` : ""} Q{q.questionNumber || ""}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-lg font-bold uppercase tracking-wider bg-violet-500/15 text-violet-400 border border-violet-500/40">
                          ✦ INTERACTIVE PRACTICE
                        </span>
                      )}
                      <span className="text-slate-400 hidden sm:inline">• {q.topic}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs font-bold">
                        {qType}
                      </span>
                      {isCorrect ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct (+{q.marks || 1} Marks)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 font-mono">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{userAns ? "Incorrect (0 Marks)" : "Unanswered (0 Marks)"}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="text-base font-semibold leading-relaxed" style={{ color: "var(--text-main)" }}>
                    {q.question}
                  </div>

                  {/* Options Evaluation Grid or NAT result */}
                  {qType === "NAT" ? (
                    <div className="p-3.5 rounded-xl border font-mono text-xs sm:text-sm flex flex-wrap gap-4" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                      <div>
                        <span className="text-slate-400 block text-[11px]">YOUR INPUT:</span>
                        <strong className={isCorrect ? "text-emerald-400" : "text-rose-400"}>
                          {userAns || "None (Unanswered)"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">CORRECT VALUE:</span>
                        <strong className="text-emerald-400">{q.answer}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-mono">
                      {(q.options || []).map((opt) => {
                        const isUserChoice = qType === "MSQ"
                          ? Array.isArray(userAns) && userAns.includes(opt.id)
                          : userAns === opt.id;
                        const isCorrectChoice = opt.isCorrect;

                        let badgeStyle = "bg-slate-800 text-slate-300 border-slate-700";
                        if (isCorrectChoice) {
                          badgeStyle = "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-bold";
                        } else if (isUserChoice && !isCorrectChoice) {
                          badgeStyle = "bg-rose-500/15 border-rose-500/50 text-rose-400 font-bold";
                        }

                        return (
                          <div 
                            key={opt.id}
                            className={`p-3 rounded-xl border flex items-center justify-between ${badgeStyle}`}
                          >
                            <div className="flex items-center space-x-2">
                              <strong className="uppercase font-mono">[{opt.id}]</strong>
                              <span>{opt.text}</span>
                            </div>
                            {isCorrectChoice && <span className="text-[10px] text-emerald-400 font-bold">✓ CORRECT</span>}
                            {isUserChoice && !isCorrectChoice && <span className="text-[10px] text-rose-400 font-bold">✕ YOUR CHOICE</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Comprehensive Theoretical Explanation */}
                  <div 
                    className="p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1"
                    style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
                  >
                    <span className="font-bold uppercase tracking-wider block text-[11px] text-cyan-400 font-mono">
                      Theoretical Examination Explanation
                    </span>
                    <p style={{ color: "var(--text-main)" }} className="whitespace-pre-line font-serif">
                      {q.explanation}
                    </p>
                    {q.sourceUrl && (
                      <div className="pt-2 flex items-center space-x-1 text-[11px] text-cyan-500 font-mono">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <a href={q.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400">
                          Verify PYQ Discussion Reference ({q.id})
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
