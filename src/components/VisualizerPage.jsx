import React, { useState, useEffect } from "react";
import { 
  Play, Pause, SkipForward, RotateCcw, Download, Sparkles, FileSpreadsheet,
  Layers, CheckCircle2, AlertCircle, Info, Table, Split
} from "lucide-react";
import { SAMPLE_DATASETS } from "../data/sampleData";
import { JOIN_TYPES, executeJoin } from "../utils/joinEngine";
import { TableVisualizerView } from "./TableVisualizerView";
import { TableEditorModal } from "./TableEditorModal";
import { SqlAndAlgebraPanel } from "./SqlAndAlgebraPanel";
import { StepExecutionStepper } from "./StepExecutionStepper";
import { VennDiagram } from "./VennDiagram";
import { RowLevelVisualizer } from "./RowLevelVisualizer";
import { ProminentJoinResultSection } from "./ProminentJoinResultSection";
import { generatePDFReport, generateCSVReport } from "../utils/exportUtils";

export function VisualizerPage({ initialJoinType = "INNER", isDark = false, onStateChange = null }) {
  // 1. Scenario dataset
  const [selectedScenarioKey, setSelectedScenarioKey] = useState("employee_dept");
  const [tableA, setTableA] = useState(SAMPLE_DATASETS.employee_dept.tableA);
  const [tableB, setTableB] = useState(SAMPLE_DATASETS.employee_dept.tableB);

  // 2. Join configuration
  const [joinType, setJoinType] = useState(initialJoinType);
  const [keyA, setKeyA] = useState("department_id");
  const [keyB, setKeyB] = useState("department_id");

  // 3. Join result state
  const [joinResult, setJoinResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 4. Interactive linking states
  const [selectedRegion, setSelectedRegion] = useState(null); // 'left' | 'right' | 'intersection' | null
  const [hoveredMatchIndex, setHoveredMatchIndex] = useState(null);
  const [editingTableModal, setEditingTableModal] = useState(null); // 'A' or 'B'

  // Sync initialJoinType if updated externally
  useEffect(() => {
    if (initialJoinType && initialJoinType !== joinType) {
      setJoinType(initialJoinType);
    }
  }, [initialJoinType]);

  // Load Scenario Dataset
  const handleScenarioChange = (scenarioKey) => {
    setSelectedScenarioKey(scenarioKey);
    setSelectedRegion(null);
    const scenario = SAMPLE_DATASETS[scenarioKey];
    if (scenario) {
      setTableA(JSON.parse(JSON.stringify(scenario.tableA)));
      setTableB(JSON.parse(JSON.stringify(scenario.tableB)));
      setKeyA(scenario.tableA.keyColumn || scenario.tableA.columns[0]?.name || "");
      setKeyB(scenario.tableB.keyColumn || scenario.tableB.columns[0]?.name || "");
    }
  };

  // Run calculation immediately on mount and when parameters change
  useEffect(() => {
    runJoinComputation();
  }, [tableA, tableB, joinType, keyA, keyB]);

  const runJoinComputation = () => {
    const result = executeJoin({
      tableA,
      tableB,
      joinType,
      keyA,
      keyB
    });
    setJoinResult(result);
    setCurrentStep(0);

    // Notify parent app of updated active visualizer state
    if (typeof onStateChange === "function") {
      onStateChange({
        tableA,
        tableB,
        joinType,
        keyA,
        keyB,
        joinResult: result
      });
    }
  };

  const handleExportPdf = () => {
    // Dynamically re-execute or use current result to ensure 100% current state is exported
    const currentComputed = executeJoin({
      tableA,
      tableB,
      joinType,
      keyA,
      keyB
    });
    generatePDFReport({
      joinResult: currentComputed,
      tableA,
      tableB,
      joinType,
      keyA,
      keyB
    });
  };

  const handleExportCsv = () => {
    const currentComputed = executeJoin({
      tableA,
      tableB,
      joinType,
      keyA,
      keyB
    });
    generateCSVReport({
      joinResult: currentComputed,
      joinType
    });
  };

  const currentJoinMetadata = JOIN_TYPES.find(j => j.id === joinType) || JOIN_TYPES[0];

  return (
    <div className="space-y-8 pb-16">
      
      {/* ============================================================== */}
      {/* 1. WORKFLOW CONTROLS & DOMINANT RUN JOIN BUTTON */}
      {/* ============================================================== */}
      <div 
        className="rounded-3xl border p-5 sm:p-7 shadow-xs space-y-6 transition-all"
        style={{
          background: "linear-gradient(135deg, var(--bg-surface), var(--bg-elevated))",
          borderColor: "var(--border-subtle)"
        }}
      >
        {/* Instruction Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center space-x-2">
            <span 
              className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs tracking-wider uppercase"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
            >
              EDUCATIONAL JOIN WORKFLOW
            </span>
            <span className="text-xs sm:text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              Select a JOIN type and run it to see how records are matched.
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleScenarioChange(selectedScenarioKey)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-opacity hover:opacity-85 shadow-2xs"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-main)"
              }}
              title="Reset tables to default state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            <button
              onClick={handleExportPdf}
              className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
              title="Download Current State PDF Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* 5-Step Workflow Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
          
          {/* Step 1: Choose Tables */}
          <div className="lg:col-span-3 space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-500">
              STEP 1 — Choose Tables
            </div>
            <select
              value={selectedScenarioKey}
              onChange={(e) => handleScenarioChange(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl border outline-none shadow-2xs"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-main)"
              }}
            >
              <option value="employee_dept">Employee & Department (Corporate)</option>
              <option value="student_course">Student & Course (Academic)</option>
              <option value="customer_orders">Customer & Orders (E-Commerce)</option>
              <option value="doctor_patients">Doctor & Patients (Healthcare)</option>
              <option value="library_books">Library & Books (Catalog Loans)</option>
              <option value="fire_department">Fire Department (Emergency Fleet)</option>
              <option value="self_join_hierarchy">Employee Manager Hierarchy (Self-Join)</option>
            </select>
          </div>

          {/* Step 2: Choose JOIN Type */}
          <div className="lg:col-span-4 space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-violet-500">
              STEP 2 — Choose JOIN Type
            </div>
            <div className="flex flex-wrap gap-1.5">
              {JOIN_TYPES.map((jt) => {
                const isSelected = joinType === jt.id;
                let activeClass = "";
                let activeStyle = {};

                if (isSelected) {
                  if (jt.id === "INNER") {
                    activeClass = "rgb-active-join-pill rgb-join-inner text-white";
                    activeStyle = { borderColor: "transparent" };
                  } else if (jt.id === "LEFT") {
                    activeClass = "rgb-active-join-pill rgb-join-left text-white";
                    activeStyle = { borderColor: "transparent" };
                  } else if (jt.id === "RIGHT") {
                    activeClass = "rgb-active-join-pill rgb-join-right text-white";
                    activeStyle = { borderColor: "transparent" };
                  } else if (jt.id === "FULL") {
                    activeClass = "rgb-active-join-pill rgb-join-full text-white";
                    activeStyle = { borderColor: "transparent" };
                  } else if (jt.id === "CROSS") {
                    activeClass = "rgb-active-join-pill rgb-join-cross text-white";
                    activeStyle = { borderColor: "transparent" };
                  } else if (jt.id === "NATURAL") {
                    activeClass = "rgb-active-join-pill rgb-join-natural text-white";
                    activeStyle = { borderColor: "transparent" };
                  } else if (jt.id === "SELF") {
                    activeClass = "rgb-active-join-pill rgb-join-self text-white";
                    activeStyle = { borderColor: "transparent" };
                  }
                } else {
                  activeStyle = { backgroundColor: "var(--bg-elevated)", color: "var(--text-main)", borderColor: "var(--border-subtle)" };
                }

                return (
                  <button
                    key={jt.id}
                    onClick={() => {
                      setJoinType(jt.id);
                      setSelectedRegion(null);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer ${activeClass}`}
                    style={{
                      ...activeStyle,
                      border: isSelected ? "none" : `1px solid ${activeStyle.borderColor || "var(--border-subtle)"}`
                    }}
                  >
                    <span>{jt.symbol}</span>
                    <span>{jt.name.replace(" OUTER", "").replace(" JOIN", "")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Choose Join Columns / Condition */}
          <div className="lg:col-span-3 space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-500">
              STEP 3 — JOIN CONDITION
            </div>
            <div 
              className="p-2 rounded-2xl border flex items-center justify-between text-xs sm:text-sm font-mono shadow-2xs"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)"
              }}
            >
              <select
                value={keyA}
                onChange={(e) => setKeyA(e.target.value)}
                disabled={joinType === "CROSS"}
                className="bg-transparent font-bold outline-none text-blue-500 w-24 truncate disabled:opacity-40"
              >
                {tableA.columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>

              <span className="font-bold text-slate-400 px-1 font-sans">
                {joinType === "CROSS" ? "×" : "="}
              </span>

              <select
                value={keyB}
                onChange={(e) => setKeyB(e.target.value)}
                disabled={joinType === "CROSS"}
                className="bg-transparent font-bold outline-none text-violet-500 w-24 truncate disabled:opacity-40"
              >
                {tableB.columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Step 4: Visually Dominant RUN JOIN Button with Animated RGB Perimeter Gradient */}
          <div className="lg:col-span-2">
            <button
              onClick={runJoinComputation}
              className="rgb-run-button w-full py-3 px-4 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>RUN JOIN</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. THE THREE-TIER CORE ARCHITECTURE: */}
      {/* TIER A: INTERACTIVE VENN DIAGRAM & RELATIONAL SETS (DESKTOP GRID) */}
      {/* DESKTOP PROPORTIONS: Relation A ~28% | Venn ~44% | Relation B ~28% */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Table A Source Preview (~28% desktop width: col-span-3.5 approximated by col-span-4 or col-span-3.3) */}
        <div className="lg:col-span-3 xl:col-span-3 flex flex-col">
          <TableVisualizerView
            table={tableA}
            title="Relation A"
            selectedKey={keyA}
            matchedIndices={joinResult?.matchedAIndices || []}
            unmatchedIndices={joinResult?.unmatchedAIndices || []}
            onEditClick={() => setEditingTableModal('A')}
            selectedRegion={selectedRegion}
            isLeft={true}
          />
        </div>

        {/* Supercharged Interactive Venn Diagram (Tier 1 Centerpiece: ~44-50% width) */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
          <VennDiagram
            joinType={joinType}
            tableA={tableA}
            tableB={tableB}
            keyA={keyA}
            keyB={keyB}
            joinResult={joinResult}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
          />
        </div>

        {/* Table B Source Preview (~28% desktop width) */}
        <div className="lg:col-span-3 xl:col-span-3 flex flex-col">
          <TableVisualizerView
            table={tableB}
            title="Relation B"
            selectedKey={keyB}
            matchedIndices={joinResult?.matchedBIndices || []}
            unmatchedIndices={joinResult?.unmatchedBIndices || []}
            onEditClick={() => setEditingTableModal('B')}
            selectedRegion={selectedRegion}
            isLeft={false}
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* TIER B: ROW-LEVEL MATCHING VISUALIZATION (TUPLE-TO-TUPLE LINKS) */}
      {/* ============================================================== */}
      <RowLevelVisualizer
        tableA={tableA}
        tableB={tableB}
        keyA={keyA}
        keyB={keyB}
        joinType={joinType}
        joinResult={joinResult}
        hoveredMatchIndex={hoveredMatchIndex}
        setHoveredMatchIndex={setHoveredMatchIndex}
      />

      {/* ============================================================== */}
      {/* TIER C: PROMINENT JOIN RESULT SECTION (SYNTHESIZED TABLE) */}
      {/* ============================================================== */}
      <ProminentJoinResultSection
        joinResult={joinResult}
        joinType={joinType}
        tableA={tableA}
        tableB={tableB}
        onExportPdf={handleExportPdf}
        onExportCsv={handleExportCsv}
      />

      {/* ============================================================== */}
      {/* STEP-BY-STEP EXECUTION WALKTHROUGH */}
      {/* ============================================================== */}
      <StepExecutionStepper
        steps={joinResult?.steps || []}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />

      {/* ============================================================== */}
      {/* ANSI SQL QUERY & FORMAL RELATIONAL ALGEBRA PANEL */}
      {/* ============================================================== */}
      <SqlAndAlgebraPanel
        sqlQuery={joinResult?.sqlQuery}
        joinType={joinType}
        algebraNotation={currentJoinMetadata.algebra}
        isDark={isDark}
      />

      {/* Table Editor Modals */}
      <TableEditorModal
        isOpen={editingTableModal === 'A'}
        onClose={() => setEditingTableModal(null)}
        initialTable={tableA}
        tableNameLabel="Table A"
        onSave={(updated) => {
          setTableA(updated);
          if (!updated.columns.some(c => c.name === keyA)) {
            setKeyA(updated.columns[0]?.name || "");
          }
        }}
      />

      <TableEditorModal
        isOpen={editingTableModal === 'B'}
        onClose={() => setEditingTableModal(null)}
        initialTable={tableB}
        tableNameLabel="Table B"
        onSave={(updated) => {
          setTableB(updated);
          if (!updated.columns.some(c => c.name === keyB)) {
            setKeyB(updated.columns[0]?.name || "");
          }
        }}
      />
    </div>
  );
}
