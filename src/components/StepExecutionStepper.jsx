import React, { useState, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Activity } from "lucide-react";

export function StepExecutionStepper({ steps, currentStep, setCurrentStep, isPlaying, setIsPlaying }) {
  useEffect(() => {
    let interval = null;
    if (isPlaying && steps && steps.length > 0) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, steps, setCurrentStep, setIsPlaying]);

  if (!steps || steps.length === 0) return null;

  const activeStepObj = steps[currentStep] || steps[0];

  return (
    <div className="rgb-card-perimeter w-full">
      <div 
        className="rgb-card-inner p-5 space-y-4 transition-colors"
        style={{
          backgroundColor: "var(--bg-surface)"
        }}
      >
        {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div 
            className="p-1.5 rounded-xl text-white shadow-xs"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
          >
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--text-main)" }}>
              Step-by-Step Join Execution Walkthrough
            </h3>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Trace evaluation pipeline from relation ingestion to predicate matching and projection.
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div 
          className="flex items-center space-x-1.5 p-1 rounded-xl border"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)"
          }}
        >
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
            }}
            title="Reset to Step 1"
            className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
            style={{ color: "var(--text-main)" }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(Math.max(0, currentStep - 1));
            }}
            disabled={currentStep === 0}
            title="Previous Step"
            className="p-1.5 rounded-lg disabled:opacity-40 transition-opacity"
            style={{ color: "var(--text-main)" }}
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (currentStep >= steps.length - 1) setCurrentStep(0);
              setIsPlaying(!isPlaying);
            }}
            title={isPlaying ? "Pause" : "Auto-Play Steps"}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg text-white font-bold text-xs shadow-xs transition-transform hover:scale-105"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
            }}
            disabled={currentStep === steps.length - 1}
            title="Next Step"
            className="p-1.5 rounded-lg disabled:opacity-40 transition-opacity"
            style={{ color: "var(--text-main)" }}
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center space-x-2">
        {steps.map((s, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <button
              key={idx}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(idx);
              }}
              className="flex-1 h-2 rounded-full transition-all"
              style={{
                backgroundColor: isCurrent 
                  ? "var(--color-primary)" 
                  : isDone 
                  ? "var(--color-accent)" 
                  : "var(--bg-elevated)",
                opacity: isCurrent ? 1 : isDone ? 0.6 : 0.4
              }}
              title={`Step ${idx + 1}: ${s.title}`}
            />
          );
        })}
      </div>

      {/* Active Step Content Card */}
      <div 
        className="p-4 rounded-xl border transition-colors"
        style={{
          backgroundColor: "var(--bg-elevated)",
          borderColor: "var(--border-subtle)"
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
            Step {activeStepObj.stepNumber} of {steps.length}: {activeStepObj.title}
          </div>
          <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
            Phase {activeStepObj.stepNumber}
          </span>
        </div>
        <p className="text-xs sm:text-sm font-semibold mb-1" style={{ color: "var(--text-main)" }}>
          {activeStepObj.description}
        </p>
        <p className="text-xs leading-relaxed font-mono" style={{ color: "var(--text-muted)" }}>
          {activeStepObj.details}
        </p>
      </div>
    </div>
  </div>
  );
}
