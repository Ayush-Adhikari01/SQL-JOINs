import React, { useState, useEffect } from "react";
import { Navbar, Footer } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { VisualizerPage } from "./components/VisualizerPage";
import { LearnPage } from "./components/LearnPage";
import { PracticeQuizPage } from "./components/PracticeQuizPage";
import { TestingPage } from "./components/TestingPage";
import { HelpManualPage } from "./components/HelpManualPage";
import { TeamDevelopedByPage } from "./components/TeamDevelopedByPage";
import { ThemeCustomizerModal } from "./components/ThemeCustomizerModal";
import { SAMPLE_DATASETS } from "./data/sampleData";
import { executeJoin } from "./utils/joinEngine";
import { generatePDFReport } from "./utils/exportUtils";
import { THEME_PRESETS, applyThemeVariables } from "./utils/themeEngine";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedJoinType, setSelectedJoinType] = useState("INNER");
  
  // Theme state: dark / light
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme_mode");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Theme preset and custom RGB colors
  const [currentPresetId, setCurrentPresetId] = useState(() => {
    return localStorage.getItem("theme_preset_id") || "midnight";
  });

  const [customPrimary, setCustomPrimary] = useState(() => {
    const saved = localStorage.getItem("theme_primary");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return THEME_PRESETS[0].primary;
  });

  const [customAccent, setCustomAccent] = useState(() => {
    const saved = localStorage.getItem("theme_accent");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return THEME_PRESETS[0].accent;
  });

  // Modal controller for Theme & RGB customizer
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Apply theme variables dynamically whenever colors or mode change
  useEffect(() => {
    applyThemeVariables({
      primary: customPrimary,
      accent: customAccent,
      isDark
    });
    localStorage.setItem("theme_mode", isDark ? "dark" : "light");
    localStorage.setItem("theme_primary", JSON.stringify(customPrimary));
    localStorage.setItem("theme_accent", JSON.stringify(customAccent));
    localStorage.setItem("theme_preset_id", currentPresetId);
  }, [customPrimary, customAccent, isDark, currentPresetId]);

  const handleSelectPreset = (preset) => {
    setCurrentPresetId(preset.id);
    setCustomPrimary(preset.primary);
    setCustomAccent(preset.accent);
  };

  // Live Visualizer State tracking for Global Navbar Export
  const [visualizerState, setVisualizerState] = useState(() => {
    const defaultScenario = SAMPLE_DATASETS.employee_dept;
    return {
      tableA: defaultScenario.tableA,
      tableB: defaultScenario.tableB,
      joinType: "INNER",
      keyA: defaultScenario.tableA.keyColumn,
      keyB: defaultScenario.tableB.keyColumn,
      joinResult: null
    };
  });

  const handleGlobalExportPdf = () => {
    // Dynamically retrieve the current live state
    const currentTableA = visualizerState.tableA || SAMPLE_DATASETS.employee_dept.tableA;
    const currentTableB = visualizerState.tableB || SAMPLE_DATASETS.employee_dept.tableB;
    const currentJoinType = visualizerState.joinType || selectedJoinType || "INNER";
    const currentKeyA = visualizerState.keyA || currentTableA.keyColumn || currentTableA.columns[0]?.name;
    const currentKeyB = visualizerState.keyB || currentTableB.keyColumn || currentTableB.columns[0]?.name;

    // Recalculate or consume current joinResult dynamically
    const computed = executeJoin({
      tableA: currentTableA,
      tableB: currentTableB,
      joinType: currentJoinType,
      keyA: currentKeyA,
      keyB: currentKeyB
    });

    generatePDFReport({
      joinResult: computed,
      tableA: currentTableA,
      tableB: currentTableB,
      joinType: currentJoinType,
      keyA: currentKeyA,
      keyB: currentKeyB
    });
  };

  const handleSelectJoinTypeFromHome = (type) => {
    setSelectedJoinType(type);
    setActiveTab("visualizer");
  };

  return (
    <div 
      className="min-h-screen flex flex-col transition-colors duration-200 relative overflow-x-hidden"
      style={{
        backgroundColor: "var(--bg-app)",
        color: "var(--text-main)"
      }}
    >
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        onExportPdf={handleGlobalExportPdf}
        onOpenThemeCustomizer={() => setIsThemeModalOpen(true)}
      />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {activeTab === "home" && (
          <HomePage
            setActiveTab={setActiveTab}
            onSelectJoinType={handleSelectJoinTypeFromHome}
          />
        )}

        {activeTab === "visualizer" && (
          <VisualizerPage 
            initialJoinType={selectedJoinType} 
            isDark={isDark} 
            onStateChange={setVisualizerState}
          />
        )}

        {activeTab === "learn" && <LearnPage isDark={isDark} />}

        {activeTab === "practice" && <PracticeQuizPage />}

        {activeTab === "testing" && <TestingPage />}

        {activeTab === "help" && <HelpManualPage />}

        {activeTab === "team" && <TeamDevelopedByPage />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Theme & RGB Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentPresetId={currentPresetId}
        onSelectPreset={handleSelectPreset}
        customPrimary={customPrimary}
        onChangeCustomPrimary={(newPrim) => {
          setCustomPrimary(newPrim);
          setCurrentPresetId("custom");
        }}
        customAccent={customAccent}
        onChangeCustomAccent={(newAcc) => {
          setCustomAccent(newAcc);
          setCurrentPresetId("custom");
        }}
        isDark={isDark}
        setIsDark={setIsDark}
      />
    </div>
  );
}
