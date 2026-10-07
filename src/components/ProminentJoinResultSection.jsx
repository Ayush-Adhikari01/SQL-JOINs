import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Search, Filter, Layers, Check, X, Split, Sparkles, Download, FileSpreadsheet } from "lucide-react";

export function ProminentJoinResultSection({
  joinResult,
  joinType,
  tableA,
  tableB,
  onExportPdf,
  onExportCsv
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  if (!joinResult) return null;

  const { success, errors = [], resultColumns = [], resultRows = [], stats = {} } = joinResult;

  if (!success) {
    return (
      <div 
        className="rounded-3xl border p-6 text-center space-y-3"
        style={{
          backgroundColor: "rgba(239, 68, 68, 0.05)",
          borderColor: "rgba(239, 68, 68, 0.3)"
        }}
      >
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-rose-500">Join Execution Could Not Complete</h3>
        <p className="text-xs text-rose-400 max-w-md mx-auto">
          {errors[0] || "Please select valid join keys for both relations to execute."}
        </p>
      </div>
    );
  }

  // Dynamic Plain English Summary
  const matchedCount = stats.matchedCount || 0;
  const unmatchedLeft = stats.unmatchedLeftCount || 0;
  const unmatchedRight = stats.unmatchedRightCount || 0;
  const outputRowCount = stats.rowCount || 0;

  let dynamicExplanation = "";
  if (joinType === "INNER") {
    dynamicExplanation = `${matchedCount} matching record pairs were found and combined. ${unmatchedLeft} ${tableA.name} records and ${unmatchedRight} ${tableB.name} records had no matching keys and were excluded from the inner join.`;
  } else if (joinType === "LEFT") {
    dynamicExplanation = `${matchedCount} matching record pairs were found. All ${tableA.rows.length} records from ${tableA.name} were preserved (${unmatchedLeft} unmatched ${tableA.name} records were padded with NULL for ${tableB.name} attributes).`;
  } else if (joinType === "RIGHT") {
    dynamicExplanation = `${matchedCount} matching record pairs were found. All ${tableB.rows.length} records from ${tableB.name} were preserved (${unmatchedRight} unmatched ${tableB.name} records were padded with NULL for ${tableA.name} attributes).`;
  } else if (joinType === "FULL") {
    dynamicExplanation = `${matchedCount} matching record pairs were combined. All unmatched records (${unmatchedLeft} from ${tableA.name} and ${unmatchedRight} from ${tableB.name}) were preserved and padded with NULL on their opposing sides.`;
  } else if (joinType === "CROSS") {
    dynamicExplanation = `Cartesian product generated: Every single row of ${tableA.name} (${tableA.rows.length}) was paired with every row of ${tableB.name} (${tableB.rows.length}), producing exactly ${outputRowCount} total combinations.`;
  } else {
    dynamicExplanation = `Join executed successfully: Generated ${outputRowCount} resulting tuples with ${matchedCount} matching key alignments.`;
  }

  const filteredRows = resultRows.filter((row) => {
    if (filterType === "matched" && row._meta?.matchStatus !== "matched") return false;
    if (filterType === "unmatched" && !row._meta?.matchStatus?.includes("unmatched")) return false;

    if (!searchTerm) return true;
    return Object.values(row).some(
      val => val !== null && val !== undefined && String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="rgb-card-perimeter w-full">
      <div 
        className="rgb-card-inner p-6 sm:p-8 space-y-6 transition-colors"
        style={{
          backgroundColor: "var(--bg-surface)"
        }}
      >
        {/* 1. Header with Output Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span 
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
            >
              STEP 5 • RESULT DATASET
            </span>
            <span className="text-xs font-mono text-slate-400">
              Evaluated in {stats.executionTimeMs} ms
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black" style={{ color: "var(--text-main)" }}>
            Final Synthesized Relation Output ({joinType} JOIN)
          </h2>
        </div>

        {/* 4 Scorecard Metric Badges & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-2 rounded-2xl border text-center" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Output</span>
            <strong className="text-base font-black text-blue-500">{outputRowCount}</strong>
            <span className="text-[10px] text-slate-400 block">tuples</span>
          </div>

          <div className="px-3 py-2 rounded-2xl border text-center bg-cyan-500/10 border-cyan-500/30">
            <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 block">Matched</span>
            <strong className="text-base font-black text-cyan-600 dark:text-cyan-400">{matchedCount}</strong>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 block">pairs</span>
          </div>

          <div className="px-3 py-2 rounded-2xl border text-center bg-amber-500/10 border-amber-500/30">
            <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">Unmatched Left</span>
            <strong className="text-base font-black text-amber-600 dark:text-amber-400">{unmatchedLeft}</strong>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 block">records</span>
          </div>

          <div className="px-3 py-2 rounded-2xl border text-center bg-pink-500/10 border-pink-500/30">
            <span className="text-[10px] uppercase font-bold text-pink-600 dark:text-pink-400 block">Unmatched Right</span>
            <strong className="text-base font-black text-pink-600 dark:text-pink-400">{unmatchedRight}</strong>
            <span className="text-[10px] text-pink-600 dark:text-pink-400 block">records</span>
          </div>

          {(onExportPdf || onExportCsv) && (
            <div className="flex items-center space-x-1.5 ml-auto sm:ml-2">
              {onExportPdf && (
                <button
                  onClick={onExportPdf}
                  title="Download Current State PDF Report"
                  className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              )}
              {onExportCsv && (
                <button
                  onClick={onExportCsv}
                  title="Download Current Result CSV"
                  className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-85 shadow-2xs"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-main)"
                  }}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Plain English Dynamic Academic Explanation */}
      <div 
        className="p-4 rounded-2xl border flex items-start space-x-3 text-xs sm:text-sm leading-relaxed"
        style={{
          backgroundColor: "var(--bg-elevated)",
          borderColor: "var(--border-subtle)",
          color: "var(--text-main)"
        }}
      >
        <Sparkles className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block text-xs uppercase tracking-wider text-cyan-500 mb-0.5">
            Dynamic Relational Analysis:
          </strong>
          <p style={{ color: "var(--text-muted)" }}>{dynamicExplanation}</p>
        </div>
      </div>

      {/* 3. Search and Provenance Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search result attributes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border outline-none"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-main)"
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400">Filter Provenance:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border outline-none font-semibold"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-main)"
            }}
          >
            <option value="all">All Tuples ({resultRows.length})</option>
            <option value="matched">Matched Tuples Only ({resultRows.filter(r => r._meta?.matchStatus === 'matched').length})</option>
            <option value="unmatched">Unmatched / Padded Only ({resultRows.filter(r => r._meta?.matchStatus?.includes('unmatched')).length})</option>
          </select>
        </div>
      </div>

      {/* 4. Responsive Output Table */}
      <div className="overflow-x-auto rounded-2xl border max-h-80" style={{ borderColor: "var(--border-subtle)" }}>
        <table className="w-full text-left text-xs">
          <thead 
            className="sticky top-0 border-b text-[11px]"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-muted)"
            }}
          >
            <tr>
              <th className="p-3 w-10 text-center font-mono">#</th>
              {resultColumns.map((col) => (
                <th
                  key={col.key}
                  className="p-3 font-mono"
                  style={{
                    borderLeft: `3px solid ${col.origin === "A" ? "var(--color-primary)" : "var(--color-accent)"}`
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-bold" style={{ color: "var(--text-main)" }}>{col.label}</span>
                    <span className="text-[9px] text-slate-400 font-sans">{col.tableName}</span>
                  </div>
                </th>
              ))}
              <th className="p-3 w-32 text-center">Row Provenance</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
            {filteredRows.map((row, rIdx) => {
              const status = row._meta?.matchStatus;
              let badge = null;

              if (status === "matched") {
                badge = (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    <Check className="w-3 h-3 mr-1" /> MATCHED
                  </span>
                );
              } else if (status === "unmatched_left") {
                badge = (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    LEFT OUTER (NULL)
                  </span>
                );
              } else if (status === "unmatched_right") {
                badge = (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/30">
                    RIGHT OUTER (NULL)
                  </span>
                );
              } else {
                badge = (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                    CARTESIAN (×)
                  </span>
                );
              }

              return (
                <tr 
                  key={row._meta?.rowId || rIdx}
                  className="hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: status === "matched" 
                      ? "transparent" 
                      : status === "unmatched_left" 
                      ? "rgba(245, 158, 11, 0.04)" 
                      : status === "unmatched_right" 
                      ? "rgba(236, 72, 153, 0.04)" 
                      : "transparent"
                  }}
                >
                  <td className="p-3 text-center font-mono text-[10px] text-slate-400">{rIdx + 1}</td>
                  {resultColumns.map((col) => {
                    const val = row[col.key];
                    const isNull = val === null || val === undefined;

                    return (
                      <td key={col.key} className="p-3 font-mono">
                        {isNull ? (
                          <span 
                            className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold"
                            style={{
                              backgroundColor: "var(--bg-elevated)",
                              color: "var(--semantic-null)",
                              border: "1px solid var(--border-subtle)"
                            }}
                          >
                            NULL
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-main)", fontWeight: 500 }}>
                            {String(val)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-3 text-center">{badge}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
}
