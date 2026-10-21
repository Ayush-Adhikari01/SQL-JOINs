import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw,
  Check, X, AlertCircle, Sparkles, Edit3
} from "lucide-react";
import { JOIN_TYPES, COMPARISON_OPERATORS } from "../utils/joinEngine";

export function AnimatedJoinVisualizer({
  tableA,
  tableB,
  joinType = "INNER",
  keyA,
  keyB,
  operator = "=",
  joinResult,
  onJoinTypeChange,
  onKeyAChange,
  onKeyBChange,
  onOperatorChange,
  onEditTableA,
  onEditTableB,
  onEditTables,
  onResetData,
  isDark = false
}) {
  const trace = useMemo(() => {
    return joinResult?.executionTrace || [];
  }, [joinResult]);

  // Compact Playback State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1x or 2x
  const timerRef = useRef(null);

  // References for live element-to-element coordinate measurement
  const containerRef = useRef(null);
  const flyingOverlayRef = useRef(null);
  const sourceCellARefs = useRef({}); // `rIdx_colName` -> HTMLTableCellElement
  const sourceCellBRefs = useRef({}); // `rIdx_colName` -> HTMLTableCellElement
  const destCellRefs = useRef({});    // `rIdx_colKey` -> HTMLTableCellElement
  const outputTableContainerRef = useRef(null);
  const lastAnimatedStepRef = useRef(-1);

  // Flight duration and step delays
  const flightDuration = speedMultiplier === 2 ? 460 : 680;
  const staggerDelay = speedMultiplier === 2 ? 35 : 65;

  // Step delay during Auto Play: allows full flight + observation time
  const stepDelayMs = useMemo(() => {
    return speedMultiplier === 2 ? 800 : 1500;
  }, [speedMultiplier]);

  // Reset execution safely whenever join parameters, tables, or trace change
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    lastAnimatedStepRef.current = -1;
    if (flyingOverlayRef.current) {
      flyingOverlayRef.current.innerHTML = "";
    }
    Object.values(destCellRefs.current).forEach((el) => {
      if (el) el.style.opacity = "1";
    });
  }, [joinType, keyA, keyB, operator, tableA, tableB, joinResult]);

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      if (currentStepIndex >= trace.length - 1) {
        setIsPlaying(false);
        return;
      }

      timerRef.current = setTimeout(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= trace.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, stepDelayMs);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, trace.length, stepDelayMs]);

  // Current active step from joinEngine trace
  const currentStep = trace[currentStepIndex] || trace[0] || {
    stepIndex: 0,
    phase: "INIT",
    title: "Ready",
    currentResultRows: [],
    explanation: "Ready to execute join."
  };

  const isComplete = currentStep.phase === "COMPLETE" || currentStepIndex === trace.length - 1;
  const resultColumns = joinResult?.resultColumns || [];
  const currentResultRows = currentStep.currentResultRows || [];

  // ==============================================================
  // REAL FLYING DATA ANIMATION (Element-to-Element Motion)
  // ==============================================================
  const triggerFlyingAnimation = (step) => {
    if (!containerRef.current || !flyingOverlayRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const newRowIdx = step.newlyEmittedIndex;
    if (newRowIdx === null || newRowIdx === undefined) return;

    const leftIdx = step.leftIndex;
    const rightIdx = step.rightIndex;
    const emittedRow = step.emittedRow;
    if (!emittedRow) return;

    // Clear any previous active flying elements
    flyingOverlayRef.current.innerHTML = "";

    resultColumns.forEach((col, cIdx) => {
      let sourceEl = null;
      const isFromA = col.origin === "A";

      if (isFromA && leftIdx !== null && leftIdx !== undefined) {
        sourceEl = sourceCellARefs.current[`${leftIdx}_${col.originalName}`];
      } else if (!isFromA && rightIdx !== null && rightIdx !== undefined) {
        sourceEl = sourceCellBRefs.current[`${rightIdx}_${col.originalName}`];
      }

      const destEl = destCellRefs.current[`${newRowIdx}_${col.key}`];
      const rawVal = emittedRow[col.key];
      const displayVal = rawVal === null || rawVal === undefined ? "NULL" : String(rawVal);

      if (destEl) {
        const destRect = destEl.getBoundingClientRect();
        let startX, startY;

        if (sourceEl) {
          const sourceRect = sourceEl.getBoundingClientRect();
          startX = sourceRect.left - containerRect.left;
          startY = sourceRect.top - containerRect.top;
        } else {
          // If unmatched side outer join, float down from table center
          startX = destRect.left - containerRect.left;
          startY = destRect.top - containerRect.top - 45;
        }

        const endX = destRect.left - containerRect.left;
        const endY = destRect.top - containerRect.top;
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        // Hide text inside destination cell while value is flying toward it
        destEl.style.opacity = "0";

        // Create the flying element with the actual text value
        const flyer = document.createElement("div");
        flyer.innerText = displayVal;
        flyer.className = "flying-data-badge";
        flyer.style.position = "absolute";
        flyer.style.left = `${startX}px`;
        flyer.style.top = `${startY}px`;
        flyer.style.minWidth = `${Math.max(26, destRect.width - 4)}px`;
        flyer.style.height = `${Math.max(20, destRect.height - 4)}px`;
        flyer.style.display = "flex";
        flyer.style.alignItems = "center";
        flyer.style.justifyContent = "center";
        flyer.style.fontSize = "11px";
        flyer.style.fontWeight = "bold";
        flyer.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
        flyer.style.borderRadius = "6px";
        flyer.style.padding = "2px 6px";
        flyer.style.pointerEvents = "none";
        flyer.style.zIndex = "100";
        flyer.style.willChange = "transform, opacity";

        // Color coding: Theme Primary for Table A, Theme Accent for Table B, Slate for NULL
        if (rawVal === null || rawVal === undefined) {
          flyer.style.color = "#CBD5E1";
          flyer.style.background = isDark ? "rgba(30, 41, 59, 0.95)" : "rgba(241, 245, 249, 0.95)";
          flyer.style.border = "1.5px solid #64748B";
          flyer.style.boxShadow = "0 0 10px rgba(100, 116, 139, 0.6)";
        } else if (isFromA) {
          flyer.style.color = "var(--color-primary)";
          flyer.style.background = isDark ? "rgba(10, 10, 10, 0.95)" : "rgba(255, 255, 255, 0.95)";
          flyer.style.border = "1.5px solid var(--color-primary)";
          flyer.style.boxShadow = "0 0 14px var(--color-primary-glow)";
        } else {
          flyer.style.color = "var(--color-accent)";
          flyer.style.background = isDark ? "rgba(10, 10, 10, 0.95)" : "rgba(255, 255, 255, 0.95)";
          flyer.style.border = "1.5px solid var(--color-accent)";
          flyer.style.boxShadow = "0 0 14px var(--color-accent-glow)";
        }

        flyingOverlayRef.current.appendChild(flyer);

        // Web Animations API: lifts off source, arcs smoothly, settles into destination cell
        const anim = flyer.animate([
          {
            transform: "translate(0px, 0px) scale(1)",
            opacity: 0.95
          },
          {
            transform: `translate(${deltaX * 0.5}px, ${deltaY * 0.3 - 22}px) scale(1.18)`,
            opacity: 1
          },
          {
            transform: `translate(${deltaX}px, ${deltaY}px) scale(1)`,
            opacity: 1
          }
        ], {
          duration: flightDuration,
          delay: cIdx * staggerDelay,
          easing: "cubic-bezier(0.2, 0.8, 0.25, 1)",
          fill: "forwards"
        });

        anim.onfinish = () => {
          // Reveal the value in the destination cell with landing flash glow
          destEl.style.opacity = "1";
          destEl.classList.add("cell-landed-glow");
          setTimeout(() => {
            destEl.classList.remove("cell-landed-glow");
          }, 700);
          flyer.remove();
        };
      }
    });
  };

  // Trigger flying values when an output row is emitted
  useEffect(() => {
    // Reset all destination cells to fully visible whenever step changes, preventing stuck opacity if interrupted
    Object.values(destCellRefs.current).forEach((el) => {
      if (el) el.style.opacity = "1";
    });
    if (flyingOverlayRef.current) {
      flyingOverlayRef.current.innerHTML = "";
    }

    if (currentStepIndex !== lastAnimatedStepRef.current) {
      lastAnimatedStepRef.current = currentStepIndex;

      const isEmissionPhase =
        currentStep.phase === "MERGE" ||
        currentStep.phase === "NULL_EXTEND_LEFT" ||
        currentStep.phase === "NULL_EXTEND_RIGHT";

      if (isEmissionPhase && currentStep.emittedRow) {
        // Allow DOM to position the output row before calculating coordinates
        const req = requestAnimationFrame(() => {
          triggerFlyingAnimation(currentStep);
        });
        return () => cancelAnimationFrame(req);
      }
    }
  }, [currentStepIndex, currentStep]);

  // Clean up overlay on unmount
  useEffect(() => {
    return () => {
      if (flyingOverlayRef.current) {
        flyingOverlayRef.current.innerHTML = "";
      }
    };
  }, []);

  // Handlers
  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStepIndex >= trace.length - 1) {
        setCurrentStepIndex(0);
      }
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < trace.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReplay = () => {
    setIsPlaying(false);
    if (flyingOverlayRef.current) {
      flyingOverlayRef.current.innerHTML = "";
    }
    setCurrentStepIndex(0);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === "input" || tag === "select" || tag === "textarea") return;

      if (e.code === "Space") {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleReplay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [trace.length, isPlaying, currentStepIndex]);

  // Concise contextual explanation
  const contextualExplanation = useMemo(() => {
    if (!currentStep) return "Ready";
    if (currentStep.phase === "INIT") {
      return `Loaded ${tableA.name} and ${tableB.name}. Ready to compare rows using ${keyA || "key"} ${operator} ${keyB || "key"}.`;
    }
    if (currentStep.phase === "COMPLETE") {
      return `✓ Complete: ${currentResultRows.length} tuples synthesized from ${joinResult?.stats?.comparisonsCount || 0} comparisons.`;
    }

    const aliasA = tableA.alias || (tableA.name === tableB.name ? "E1" : "a");
    const aliasB = tableB.alias || (tableA.name === tableB.name ? "E2" : "b");
    const leftRow = currentStep.leftRow;
    const rightRow = currentStep.rightRow;
    const leftName = leftRow ? (leftRow.employee_name || leftRow.name || `Row ${currentStep.leftIndex + 1}`) : "";
    const rightName = rightRow ? (rightRow.department_name || rightRow.name || `Row ${currentStep.rightIndex + 1}`) : "";

    const valA = currentStep.valA !== undefined && currentStep.valA !== null ? String(currentStep.valA) : "NULL";
    const valB = currentStep.valB !== undefined && currentStep.valB !== null ? String(currentStep.valB) : "NULL";

    if (currentStep.phase === "COMPARE") {
      if (currentStep.valA === null || currentStep.valB === null) {
        return `Testing ${aliasA}[${leftName}] vs ${aliasB}[${rightName}] • ${keyA}: ${valA} = ${valB} — NULL predicate is UNKNOWN; no row created.`;
      }
      if (currentStep.isMatch) {
        return `MATCH FOUND! ${aliasA}[${leftName}] (${keyA}: ${valA}) = ${aliasB}[${rightName}] (${keyB}: ${valB}). Data will fly into output relation.`;
      }
      return `Testing ${aliasA}[${leftName}] vs ${aliasB}[${rightName}] • ${keyA}: ${valA} ≠ ${valB} — NO MATCH.`;
    }

    if (currentStep.phase === "MERGE") {
      return `Transferring data: values from ${aliasA}[${leftName}] and ${aliasB}[${rightName}] are flying into the output table.`;
    }

    if (currentStep.phase === "NULL_EXTEND_LEFT") {
      return `${aliasA}[${leftName}] has no match • ${joinType} JOIN preserves the employee with NULL department attributes.`;
    }

    if (currentStep.phase === "NULL_EXTEND_RIGHT") {
      return `${aliasB}[${rightName}] has no match • ${joinType} JOIN preserves the department with NULL employee attributes.`;
    }

    return currentStep.explanation || "Evaluating tuple pair...";
  }, [currentStep, tableA, tableB, keyA, keyB, operator, joinType, currentResultRows.length, joinResult]);

  const isSelf = joinType === "SELF" || tableA.name === tableB.name;
  const labelA = isSelf ? `${tableA.name} (Role E1)` : tableA.name;
  const labelB = isSelf ? `${tableB.name} (Role E2)` : tableB.name;

  return (
    <div
      ref={containerRef}
      className="relative rounded-3xl border shadow-sm p-4 sm:p-5 space-y-3 transition-all"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
        color: "var(--text-main)"
      }}
    >
      {/* Absolute overlay dedicated to real flying text elements */}
      <div
        ref={flyingOverlayRef}
        className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
      />

      {/* ============================================================== */}
      {/* 1. COMPACT TOP TOOLBAR: JOIN TYPE & ON PREDICATE */}
      {/* ============================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        {/* Join Type Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {JOIN_TYPES.map((jt) => {
            const isSelected = joinType === jt.id;
            return (
              <button
                key={jt.id}
                onClick={() => onJoinTypeChange(jt.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "text-white shadow-xs font-black"
                    : "hover:bg-neutral-500/10 text-slate-400"
                }`}
                style={
                  isSelected
                    ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))", color: "#FFFFFF" }
                    : { backgroundColor: "var(--bg-elevated)", color: "var(--text-main)" }
                }
                title={jt.summary}
              >
                <span>{jt.symbol}</span> {jt.name.replace(" OUTER", "").replace(" JOIN", "")}
              </button>
            );
          })}
        </div>

        {/* Predicate Selector & Edit Tables Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-xs font-mono px-2.5 py-1 rounded-xl border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
            <span className="text-[11px] font-sans font-semibold text-slate-400">ON</span>
            <select
              value={keyA}
              onChange={(e) => onKeyAChange(e.target.value)}
              disabled={joinType === "CROSS"}
              className="bg-transparent font-bold outline-none cursor-pointer disabled:opacity-40"
              style={{ color: "var(--color-primary)" }}
            >
              {(!keyA || !tableA.columns.some(c => c.name === keyA)) && (
                <option value="" className="text-black bg-white dark:text-white dark:bg-neutral-900">
                  -- Select Key A --
                </option>
              )}
              {tableA.columns.map(c => <option key={c.name} value={c.name} className="text-black bg-white dark:text-white dark:bg-neutral-900">{tableA.alias || "e"}.{c.name}</option>)}
            </select>
            <select
              value={operator}
              onChange={(e) => onOperatorChange(e.target.value)}
              disabled={joinType === "CROSS" || joinType === "NATURAL"}
              className="bg-transparent font-bold outline-none cursor-pointer px-1 disabled:opacity-40"
              style={{ color: "var(--color-accent)" }}
            >
              {COMPARISON_OPERATORS.map(op => <option key={op.value} value={op.value} className="text-black bg-white dark:text-white dark:bg-neutral-900">{op.value}</option>)}
            </select>
            <select
              value={keyB}
              onChange={(e) => onKeyBChange(e.target.value)}
              disabled={joinType === "CROSS"}
              className="bg-transparent font-bold outline-none cursor-pointer disabled:opacity-40"
              style={{ color: "var(--color-accent)" }}
            >
              {(!keyB || !tableB.columns.some(c => c.name === keyB)) && (
                <option value="" className="text-black bg-white dark:text-white dark:bg-neutral-900">
                  -- Select Key B --
                </option>
              )}
              {tableB.columns.map(c => <option key={c.name} value={c.name} className="text-black bg-white dark:text-white dark:bg-neutral-900">{tableB.alias || "d"}.{c.name}</option>)}
            </select>
          </div>

          {/* Clearly Visible Edit Tables Button */}
          <button
            onClick={() => {
              setIsPlaying(false);
              if (typeof onEditTables === "function") {
                onEditTables();
              } else if (typeof onEditTableA === "function") {
                onEditTableA();
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all hover:scale-105 shadow-2xs cursor-pointer"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-main)"
            }}
            title="Edit Employee and Department table data directly"
          >
            <Edit3 className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />
            <span>Edit Tables</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. COMPACT EDUCATIONAL CONTROL STRIP & EXPLANATION */}
      {/* ============================================================== */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-3 py-2 rounded-2xl border"
        style={{
          backgroundColor: "var(--bg-elevated)",
          borderColor: "var(--border-subtle)"
        }}
      >
        {/* Playback Buttons */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={handleReplay}
            disabled={!joinResult?.success}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1 border hover:bg-neutral-500/10 cursor-pointer transition-all shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
            title="Replay from step 1 (R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          <button
            onClick={handlePrev}
            disabled={!joinResult?.success || currentStepIndex === 0}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1 border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-500/10 cursor-pointer transition-all shadow-2xs"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
            title="Previous step (Left Arrow)"
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!joinResult?.success || currentStepIndex >= trace.length - 1}
            className="px-3 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-500/10 cursor-pointer transition-all shadow-2xs"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
            title="Next step (Right Arrow)"
          >
            <span>Next</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleTogglePlay}
            disabled={!joinResult?.success}
            className="px-3 py-1 rounded-xl text-xs font-bold flex items-center space-x-1.5 text-white transition-all cursor-pointer shadow-xs disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: isPlaying
                ? "linear-gradient(135deg, #F59E0B, #D97706)"
                : "linear-gradient(135deg, var(--color-primary), var(--color-accent))"
            }}
            title="Toggle autoplay (Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto Play</span>
              </>
            )}
          </button>

          <button
            onClick={() => setSpeedMultiplier(prev => (prev === 1 ? 2 : 1))}
            disabled={!joinResult?.success}
            className="px-2 py-1 rounded-xl text-xs font-mono font-bold border hover:bg-neutral-500/10 cursor-pointer disabled:opacity-30"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
            title="Toggle speed multiplier"
          >
            {speedMultiplier}×
          </button>
        </div>

        {/* Concise Status & Match Indicator */}
        <div className="flex-1 min-w-0 px-2 flex items-center justify-center sm:justify-start space-x-2">
          {!joinResult?.success ? (
            <div className="flex items-center space-x-1.5 text-rose-500 font-bold text-xs truncate">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 animate-pulse" />
              <span>{joinResult?.errors?.[0] || "Invalid JOIN condition. Please select valid keys."}</span>
            </div>
          ) : (
            <>
              {currentStep.isMatch && (
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase flex items-center space-x-1 shrink-0 shadow-xs animate-bounce"
                  style={{ backgroundColor: "var(--semantic-match)", color: "#000000" }}
                >
                  <Check className="w-3 h-3" />
                  <span>MATCH FOUND</span>
                </span>
              )}
              <p className="text-xs sm:text-sm font-semibold truncate tracking-tight" style={{ color: "var(--text-main)" }}>
                {contextualExplanation}
              </p>
            </>
          )}
        </div>

        {/* Step Counter */}
        <div className="flex items-center space-x-2 shrink-0 text-xs font-mono">
          <span className="px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-700 text-slate-300 font-bold">
            Step {currentStepIndex + 1} of {Math.max(1, trace.length)}
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. THREE SIMULTANEOUS TABLES IN ONE VIEWPORT */}
      {/* ============================================================== */}
      <div className="space-y-4 pt-1">
        
        {/* TOP ROW: TABLE A (LEFT) & TABLE B (RIGHT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          
          {/* Table A: Employee */}
          <div
            className="rounded-2xl border p-3 shadow-xs space-y-2 transition-all relative"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
          >
            <div className="flex items-center justify-between pb-1.5 border-b gap-2" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "var(--color-primary)" }} />
                <h4 className="text-xs sm:text-sm font-bold tracking-tight">
                  {labelA}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono text-slate-400">
                  Key: <strong className="font-bold" style={{ color: "var(--color-primary)" }}>{keyA}</strong>
                </span>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    if (typeof onEditTableA === "function") onEditTableA();
                  }}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-main)"
                  }}
                  title="Edit Employee records"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border-subtle)" }}>
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-table-header)" }}>
                    <th className="py-1 px-2 font-mono text-[10px] text-slate-400 w-8 text-center">#</th>
                    {tableA.columns.map((col) => {
                      const isKey = col.name.toLowerCase() === (keyA || "").toLowerCase();
                      return (
                        <th
                          key={col.name}
                          className="py-1.5 px-2 font-bold text-[11px]"
                          style={{
                            color: isKey ? "var(--color-primary)" : "var(--text-muted)",
                            backgroundColor: isKey ? "var(--color-primary-subtle)" : undefined,
                            fontFamily: isKey ? "monospace" : undefined
                          }}
                        >
                          {col.name}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {tableA.rows.map((row, rIdx) => {
                    const isActive = currentStep.leftIndex === rIdx;
                    const isMatched = isActive && currentStep.isMatch;
                    const isUnmatchedLeft = isActive && currentStep.isUnmatchedLeft;

                    let rowClass = "border-t transition-all ";
                    let rowStyle = { borderColor: "var(--border-subtle)" };
                    if (isActive) {
                      if (isMatched) {
                        rowClass += "font-semibold ";
                        rowStyle.backgroundColor = "var(--semantic-match-subtle)";
                      } else if (isUnmatchedLeft) {
                        rowClass += "bg-amber-500/15 ring-1 ring-amber-400 font-semibold ";
                      } else {
                        rowClass += "font-semibold ";
                        rowStyle.backgroundColor = "var(--color-primary-subtle)";
                      }
                    } else {
                      rowClass += "hover:bg-neutral-500/5 ";
                    }

                    return (
                      <tr key={rIdx} className={rowClass} style={rowStyle}>
                        <td className="py-1 px-2 font-mono text-[10px] text-slate-400 text-center">
                          {isActive ? (
                            <span className="w-2 h-2 rounded-full inline-block animate-ping" style={{ backgroundColor: "var(--color-primary)" }} />
                          ) : (
                            rIdx + 1
                          )}
                        </td>
                        {tableA.columns.map((col) => {
                          const isKey = col.name.toLowerCase() === (keyA || "").toLowerCase();
                          const val = row[col.name];
                          const isNull = val === null || val === undefined;

                          let cellStyle = {};
                          let cellClass = "py-1 px-2 transition-all ";

                          if (isKey && isActive && isMatched) {
                            cellClass += "font-mono font-black border rounded ";
                            cellStyle = {
                              color: "var(--text-main)",
                              borderColor: "var(--semantic-match)",
                              backgroundColor: "var(--semantic-match-subtle)",
                              boxShadow: "0 0 12px var(--semantic-match-glow)"
                            };
                          } else if (isKey && isActive) {
                            cellClass += "font-mono font-bold rounded ";
                            cellStyle = {
                              color: "var(--color-primary)",
                              backgroundColor: "var(--color-primary-subtle)"
                            };
                          } else if (isKey) {
                            cellClass += "font-mono ";
                            cellStyle = { color: "var(--color-primary)" };
                          }

                          return (
                            <td
                              key={col.name}
                              ref={(el) => {
                                if (el) sourceCellARefs.current[`${rIdx}_${col.name}`] = el;
                              }}
                              className={cellClass}
                              style={cellStyle}
                            >
                              {isNull ? (
                                <span className="px-1 py-0.2 rounded text-[10px] font-mono font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
                                  NULL
                                </span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table B: Department */}
          <div
            className="rounded-2xl border p-3 shadow-xs space-y-2 transition-all relative"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
          >
            <div className="flex items-center justify-between pb-1.5 border-b gap-2" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "var(--color-accent)" }} />
                <h4 className="text-xs sm:text-sm font-bold tracking-tight">
                  {labelB}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono text-slate-400">
                  Key: <strong className="font-bold" style={{ color: "var(--color-accent)" }}>{keyB}</strong>
                </span>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    if (typeof onEditTableB === "function") onEditTableB();
                  }}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-main)"
                  }}
                  title="Edit Department records"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border-subtle)" }}>
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-table-header)" }}>
                    <th className="py-1 px-2 font-mono text-[10px] text-slate-400 w-8 text-center">#</th>
                    {tableB.columns.map((col) => {
                      const isKey = col.name.toLowerCase() === (keyB || "").toLowerCase();
                      return (
                        <th
                          key={col.name}
                          className="py-1.5 px-2 font-bold text-[11px]"
                          style={{
                            color: isKey ? "var(--color-accent)" : "var(--text-muted)",
                            backgroundColor: isKey ? "var(--color-accent-subtle)" : undefined,
                            fontFamily: isKey ? "monospace" : undefined
                          }}
                        >
                          {col.name}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {tableB.rows.map((row, rIdx) => {
                    const isActive = currentStep.rightIndex === rIdx;
                    const isMatched = isActive && currentStep.isMatch;
                    const isUnmatchedRight = isActive && currentStep.isUnmatchedRight;

                    let rowClass = "border-t transition-all ";
                    let rowStyle = { borderColor: "var(--border-subtle)" };
                    if (isActive) {
                      if (isMatched) {
                        rowClass += "font-semibold ";
                        rowStyle.backgroundColor = "var(--semantic-match-subtle)";
                      } else if (isUnmatchedRight) {
                        rowClass += "bg-pink-500/15 ring-1 ring-pink-400 font-semibold ";
                      } else {
                        rowClass += "font-semibold ";
                        rowStyle.backgroundColor = "var(--color-accent-subtle)";
                      }
                    } else {
                      rowClass += "hover:bg-neutral-500/5 ";
                    }

                    return (
                      <tr key={rIdx} className={rowClass} style={rowStyle}>
                        <td className="py-1 px-2 font-mono text-[10px] text-slate-400 text-center">
                          {isActive ? (
                            <span className="w-2 h-2 rounded-full inline-block animate-ping" style={{ backgroundColor: "var(--color-accent)" }} />
                          ) : (
                            rIdx + 1
                          )}
                        </td>
                        {tableB.columns.map((col) => {
                          const isKey = col.name.toLowerCase() === (keyB || "").toLowerCase();
                          const val = row[col.name];
                          const isNull = val === null || val === undefined;

                          let cellStyle = {};
                          let cellClass = "py-1 px-2 transition-all ";

                          if (isKey && isActive && isMatched) {
                            cellClass += "font-mono font-black border rounded ";
                            cellStyle = {
                              color: "var(--text-main)",
                              borderColor: "var(--semantic-match)",
                              backgroundColor: "var(--semantic-match-subtle)",
                              boxShadow: "0 0 12px var(--semantic-match-glow)"
                            };
                          } else if (isKey && isActive) {
                            cellClass += "font-mono font-bold rounded ";
                            cellStyle = {
                              color: "var(--color-accent)",
                              backgroundColor: "var(--color-accent-subtle)"
                            };
                          } else if (isKey) {
                            cellClass += "font-mono ";
                            cellStyle = { color: "var(--color-accent)" };
                          }

                          return (
                            <td
                              key={col.name}
                              ref={(el) => {
                                if (el) sourceCellBRefs.current[`${rIdx}_${col.name}`] = el;
                              }}
                              className={cellClass}
                              style={cellStyle}
                            >
                              {isNull ? (
                                <span className="px-1 py-0.2 rounded text-[10px] font-mono font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
                                  NULL
                                </span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: OUTPUT TABLE (RESULT RELATION) */}
        {/* Always visible, reserved row mounted ready for flying values */}
        <div
          className="rounded-2xl border p-3 sm:p-4 shadow-sm space-y-2 transition-all relative"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
        >
          <div className="flex items-center justify-between pb-1.5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <h4 className="text-xs sm:text-sm font-bold tracking-tight">
                Output Relation: <span className="text-emerald-400">{joinType} JOIN</span> Result
              </h4>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">
                Tuples: <strong className="text-emerald-400 font-bold">{currentResultRows.length}</strong> / {joinResult?.resultRows?.length || 0}
              </span>
              {isComplete && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Complete
                </span>
              )}
            </div>
          </div>

          <div
            ref={outputTableContainerRef}
            className="overflow-x-auto overflow-y-auto max-h-48 rounded-xl border"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-table-header)" }}>
                <tr>
                  <th className="py-1 px-2 font-mono text-[10px] text-slate-400 w-8 text-center">#</th>
                  {resultColumns.map((col) => {
                    const isOriginA = col.origin === "A" || col.origin === (tableA.alias || "e");
                    const prefix = col.label ? col.label.split(".")[0] + "." : `${col.origin}.`;
                    return (
                      <th key={col.key} className="py-1.5 px-2 font-mono text-[11px] text-slate-300 font-bold whitespace-nowrap">
                        <span className="font-bold" style={{ color: isOriginA ? "var(--color-primary)" : "var(--color-accent)" }}>
                          {prefix}
                        </span>
                        <span>{col.originalName}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {currentResultRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={resultColumns.length + 1}
                      className="py-6 text-center text-xs text-slate-400 italic"
                    >
                      {currentStepIndex === 0
                        ? "Waiting for matching candidate tuples to be synthesized into the output relation..."
                        : "No tuples have qualified for output yet."}
                    </td>
                  </tr>
                ) : (
                  currentResultRows.map((row, rIdx) => {
                    const isNewRow = currentStep.newlyEmittedIndex === rIdx;
                    let rowClass = "border-t transition-all ";

                    if (isNewRow) {
                      rowClass += "bg-cyan-500/20 ring-1 ring-cyan-400 font-semibold ";
                    } else if (row._meta?.matchStatus === "unmatched_left") {
                      rowClass += "bg-amber-500/5 hover:bg-amber-500/10 ";
                    } else if (row._meta?.matchStatus === "unmatched_right") {
                      rowClass += "bg-pink-500/5 hover:bg-pink-500/10 ";
                    } else {
                      rowClass += "hover:bg-neutral-500/5 ";
                    }

                    return (
                      <tr
                        key={row._meta?.rowId || rIdx}
                        className={rowClass}
                        style={{ borderColor: "var(--border-subtle)" }}
                      >
                        <td className="py-1 px-2 font-mono text-[10px] text-slate-400 text-center">
                          {isNewRow ? (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-ping" />
                          ) : (
                            rIdx + 1
                          )}
                        </td>
                        {resultColumns.map((col) => {
                          const val = row[col.key];
                          const isNull = val === null || val === undefined;

                          return (
                            <td
                              key={col.key}
                              ref={(el) => {
                                if (el) destCellRefs.current[`${rIdx}_${col.key}`] = el;
                              }}
                              className={`py-1 px-2 font-mono text-xs transition-all ${
                                isNewRow ? "text-cyan-200" : ""
                              }`}
                            >
                              {isNull ? (
                                <span className="px-1 py-0.2 rounded text-[10px] font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
                                  NULL
                                </span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
