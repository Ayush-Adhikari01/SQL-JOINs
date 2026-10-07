import React, { useState } from "react";
import { Check, X, ArrowRight, Table, Layers, AlertCircle, Sparkles } from "lucide-react";

export function RowLevelVisualizer({
  tableA,
  tableB,
  keyA,
  keyB,
  joinType,
  joinResult,
  hoveredMatchIndex,
  setHoveredMatchIndex
}) {
  if (!tableA || !tableB || !joinResult) return null;

  const { matchPairs = [], matchedAIndices = [], matchedBIndices = [] } = joinResult;

  // Primary column to identify row in Table A and B
  const displayColA = tableA.columns.find(c => c.name.includes("name") || c.name.includes("title")) || tableA.columns[1] || tableA.columns[0];
  const idColA = tableA.columns[0];

  const displayColB = tableB.columns.find(c => c.name.includes("name") || c.name.includes("title")) || tableB.columns[1] || tableB.columns[0];
  const idColB = tableB.columns[0];

  return (
    <div 
      className="rounded-3xl border p-5 sm:p-6 shadow-xs space-y-4 transition-colors"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)"
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="flex items-center space-x-2.5">
          <div 
            className="p-1.5 rounded-xl text-white shadow-xs"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
          >
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--text-main)" }}>
              Row-Level Relational Matching Visualizer
            </h3>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Live tuple-by-tuple linkage based on equality: <strong className="font-mono text-cyan-500">{tableA.name}.{keyA || 'key'} = {tableB.name}.{keyB || 'key'}</strong>
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
            <span style={{ color: "var(--text-main)" }}>Matched Tuple Pair</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span style={{ color: "var(--text-main)" }}>Unmatched Left</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" />
            <span style={{ color: "var(--text-main)" }}>Unmatched Right</span>
          </span>
        </div>
      </div>

      {/* Main Row Connector Canvas */}
      <div className="space-y-2">
        {/* Table A Rows with connections to Table B */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
          
          {/* Left Column: Relation A Tuples */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
              <span>Relation A: {tableA.name}</span>
              <span className="font-mono text-[10px] text-slate-400">({tableA.rows.length} rows)</span>
            </div>

            <div className="space-y-1.5">
              {tableA.rows.map((rowA, idxA) => {
                const isMatched = matchedAIndices.includes(idxA);
                const valKeyA = rowA[keyA];
                // Find matching right rows
                const matchingPairs = matchPairs.filter(p => p.indexA === idxA);

                return (
                  <div
                    key={idxA}
                    onMouseEnter={() => setHoveredMatchIndex(idxA)}
                    onMouseLeave={() => setHoveredMatchIndex(null)}
                    className="p-2.5 rounded-2xl border text-xs flex items-center justify-between transition-all hover:scale-[1.01]"
                    style={{
                      backgroundColor: isMatched ? "var(--bg-surface)" : "rgba(245, 158, 11, 0.05)",
                      borderColor: isMatched ? "var(--semantic-match)" : "rgba(245, 158, 11, 0.4)",
                      borderLeftWidth: "4px",
                      borderLeftColor: isMatched ? "var(--semantic-match)" : "var(--semantic-unmatched-left)"
                    }}
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <span className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-slate-500/10" style={{ color: "var(--text-main)" }}>
                        {rowA[idColA.name]}
                      </span>
                      <span className="font-semibold truncate" style={{ color: "var(--text-main)" }}>
                        {displayColA ? rowA[displayColA.name] : ""}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">
                        {valKeyA === null ? "NULL" : valKeyA}
                      </span>
                      {isMatched ? (
                        <span className="p-0.5 rounded-full bg-cyan-500/20 text-cyan-500">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="p-0.5 rounded-full bg-amber-500/20 text-amber-500" title="No matching row in right table">
                          <X className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Column: Direct Connectors / Predicate Evaluation */}
          <div className="md:col-span-2 hidden md:flex flex-col items-center justify-center p-2 text-center space-y-2">
            <div className="p-2 rounded-2xl border w-full text-center space-y-1" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
              <span className="text-[10px] uppercase font-bold tracking-widest block text-slate-400">
                Predicate
              </span>
              <div className="font-mono text-xs font-bold text-cyan-500">
                {joinType === "CROSS" ? "× (All)" : "="}
              </div>
              <span className="text-[9px] block text-slate-400">
                {joinResult.stats?.matchedCount || 0} links active
              </span>
            </div>

            <div className="text-[10px] text-slate-400 leading-tight">
              Hover any row to highlight tuple pairs
            </div>
          </div>

          {/* Right Column: Relation B Tuples */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-accent)" }}>
              <span>Relation B: {tableB.name}</span>
              <span className="font-mono text-[10px] text-slate-400">({tableB.rows.length} rows)</span>
            </div>

            <div className="space-y-1.5">
              {tableB.rows.map((rowB, idxB) => {
                const isMatched = matchedBIndices.includes(idxB);
                const valKeyB = rowB[keyB];

                return (
                  <div
                    key={idxB}
                    className="p-2.5 rounded-2xl border text-xs flex items-center justify-between transition-all hover:scale-[1.01]"
                    style={{
                      backgroundColor: isMatched ? "var(--bg-surface)" : "rgba(236, 72, 153, 0.05)",
                      borderColor: isMatched ? "var(--semantic-match)" : "rgba(236, 72, 153, 0.4)",
                      borderRightWidth: "4px",
                      borderRightColor: isMatched ? "var(--semantic-match)" : "var(--semantic-unmatched-right)"
                    }}
                  >
                    <div className="flex items-center space-x-2 shrink-0">
                      {isMatched ? (
                        <span className="p-0.5 rounded-full bg-cyan-500/20 text-cyan-500">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="p-0.5 rounded-full bg-pink-500/20 text-pink-500" title="No matching row in left table">
                          <X className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-500 font-bold">
                        {valKeyB === null ? "NULL" : valKeyB}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 overflow-hidden text-right">
                      <span className="font-semibold truncate" style={{ color: "var(--text-main)" }}>
                        {displayColB ? rowB[displayColB.name] : ""}
                      </span>
                      <span className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-slate-500/10" style={{ color: "var(--text-main)" }}>
                        {rowB[idColB.name]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
