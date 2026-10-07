import React, { useState } from "react";
import { Sliders, Palette, Check, Sparkles, X, Sun, Moon, RotateCcw } from "lucide-react";
import { THEME_PRESETS, rgbToHex, hexToRgb } from "../utils/themeEngine";

export function ThemeCustomizerModal({
  isOpen,
  onClose,
  currentPresetId,
  onSelectPreset,
  customPrimary,
  onChangeCustomPrimary,
  customAccent,
  onChangeCustomAccent,
  isDark,
  setIsDark
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border shadow-2xl p-6 space-y-6 transition-all"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-subtle)",
          color: "var(--text-main)"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center space-x-2.5">
            <div 
              className="p-2 rounded-xl text-white shadow-sm"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Theme & RGB Color System</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Academic palette & live RGB customization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:opacity-75 transition-opacity"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Day / Night Toggle Section */}
        <div className="p-4 rounded-2xl border space-y-2" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Display Mode (Day / Night)
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsDark(false)}
              className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                !isDark 
                  ? "shadow-sm border-blue-500 bg-white text-blue-700 ring-2 ring-blue-500/20" 
                  : "bg-transparent text-gray-400 hover:text-gray-200"
              }`}
              style={{ borderColor: !isDark ? "var(--color-primary)" : "var(--border-subtle)" }}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>☀ Light Academic</span>
            </button>

            <button
              onClick={() => setIsDark(true)}
              className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                isDark 
                  ? "shadow-sm border-blue-500 text-blue-400 ring-2 ring-blue-500/20" 
                  : "bg-transparent text-gray-500 hover:text-gray-900"
              }`}
              style={{ 
                backgroundColor: isDark ? "#0A0A0A" : "transparent",
                borderColor: isDark ? "var(--color-primary)" : "var(--border-subtle)" 
              }}
            >
              <Moon className="w-4 h-4 text-blue-400" />
              <span>🌙 Pure Black & Charcoal</span>
            </button>
          </div>
        </div>

        {/* Professional Presets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Curated Academic Presets
            </span>
            <span className="text-[11px] font-semibold" style={{ color: "var(--color-primary)" }}>
              7 Presets
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {THEME_PRESETS.map((preset) => {
              const isSelected = currentPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected ? "ring-2 ring-offset-1" : "hover:scale-[1.01]"
                  }`}
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: isSelected ? "var(--color-primary)" : "var(--border-subtle)"
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3.5 h-3.5 rounded-full shadow-xs" 
                        style={{ backgroundColor: preset.primary.hex }}
                      />
                      <div 
                        className="w-3.5 h-3.5 rounded-full shadow-xs -ml-2" 
                        style={{ backgroundColor: preset.accent.hex }}
                      />
                      <span className="text-xs font-bold">{preset.name}</span>
                    </div>
                    <span className="text-[10px] block" style={{ color: "var(--text-muted)" }}>
                      {preset.desc}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* RGB Color Customizer Sliders */}
        <div className="p-4 rounded-2xl border space-y-4" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Live RGB & HEX Accent Picker
              </span>
            </div>
            <div className="flex items-center space-x-2 font-mono text-[11px] font-bold px-2 py-0.5 rounded border" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
              <span>RGB({customPrimary.r}, {customPrimary.g}, {customPrimary.b})</span>
              <span>•</span>
              <span style={{ color: "var(--color-primary)" }}>{customPrimary.hex}</span>
            </div>
          </div>

          {/* Color Preview Swatch */}
          <div 
            className="h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-inner"
            style={{ background: `linear-gradient(90deg, ${customPrimary.hex}, ${customAccent.hex})` }}
          >
            Custom UI Accent Gradient
          </div>

          {/* Primary Color RGB Sliders */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold" style={{ color: "var(--text-muted)" }}>
              Primary Brand Color (R, G, B)
            </div>

            {/* Red */}
            <div className="flex items-center space-x-3 text-xs">
              <span className="w-4 font-mono font-bold text-rose-500">R</span>
              <input
                type="range"
                min="0"
                max="255"
                value={customPrimary.r}
                onChange={(e) => {
                  const r = Number(e.target.value);
                  const hex = rgbToHex(r, customPrimary.g, customPrimary.b);
                  onChangeCustomPrimary({ ...customPrimary, r, hex });
                }}
                className="flex-1 accent-rose-500"
              />
              <span className="w-8 font-mono text-right">{customPrimary.r}</span>
            </div>

            {/* Green */}
            <div className="flex items-center space-x-3 text-xs">
              <span className="w-4 font-mono font-bold text-emerald-500">G</span>
              <input
                type="range"
                min="0"
                max="255"
                value={customPrimary.g}
                onChange={(e) => {
                  const g = Number(e.target.value);
                  const hex = rgbToHex(customPrimary.r, g, customPrimary.b);
                  onChangeCustomPrimary({ ...customPrimary, g, hex });
                }}
                className="flex-1 accent-emerald-500"
              />
              <span className="w-8 font-mono text-right">{customPrimary.g}</span>
            </div>

            {/* Blue */}
            <div className="flex items-center space-x-3 text-xs">
              <span className="w-4 font-mono font-bold text-blue-500">B</span>
              <input
                type="range"
                min="0"
                max="255"
                value={customPrimary.b}
                onChange={(e) => {
                  const b = Number(e.target.value);
                  const hex = rgbToHex(customPrimary.r, customPrimary.g, b);
                  onChangeCustomPrimary({ ...customPrimary, b, hex });
                }}
                className="flex-1 accent-blue-500"
              />
              <span className="w-8 font-mono text-right">{customPrimary.b}</span>
            </div>
          </div>

          {/* Quick Color Picker HTML input */}
          <div className="flex items-center justify-between pt-2 border-t text-xs" style={{ borderColor: "var(--border-subtle)" }}>
            <span style={{ color: "var(--text-muted)" }}>Direct Color Swatch:</span>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customPrimary.hex}
                onChange={(e) => {
                  const hex = e.target.value;
                  const rgb = hexToRgb(hex);
                  onChangeCustomPrimary({ ...rgb, hex });
                }}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono font-semibold uppercase">{customPrimary.hex}</span>
            </div>
          </div>
        </div>

        {/* Semantic Note */}
        <div className="p-3 rounded-xl border text-[11px] leading-relaxed" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
          🛡️ <strong>Note on Semantic Integrity:</strong> Join match states retain consistent semantic colors: 
          <span className="text-cyan-500 font-bold ml-1">MATCH (Cyan)</span>, 
          <span className="text-amber-500 font-bold ml-1">UNMATCHED (Amber)</span>, and 
          <span className="text-emerald-500 font-bold ml-1">SUCCESS (Green)</span>.
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
