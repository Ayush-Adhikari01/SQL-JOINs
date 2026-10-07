import React, { useState } from "react";
import { Search, ArrowUpDown, Table, CheckCircle, AlertCircle, Edit3 } from "lucide-react";

export function TableVisualizerView({
  table,
  title,
  selectedKey,
  matchedIndices = [],
  unmatchedIndices = [],
  onEditClick,
  hoveredRowIndex,
  setHoveredRowIndex,
  selectedRegion,
  isLeft = true
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCol, setSortCol] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  if (!table) return null;

  const handleSort = (colName) => {
    if (sortCol === colName) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(colName);
      setSortAsc(true);
    }
  };

  const filteredRows = table.rows
    .map((row, originalIndex) => ({ row, originalIndex }))
    .filter(({ row, originalIndex }) => {
      // Region filter linked from Venn diagram
      if (selectedRegion === "intersection" && !matchedIndices.includes(originalIndex)) {
        return false;
      }
      if (selectedRegion === "left" && !isLeft) {
        return false;
      }
      if (selectedRegion === "right" && isLeft) {
        return false;
      }

      if (!searchTerm) return true;
      return Object.values(row).some(
        val => val !== null && val !== undefined && String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sortCol) return 0;
      const valA = a.row[sortCol];
      const valB = b.row[sortCol];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (sortAsc) return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

  return (
    <div 
      className="flex-1 flex flex-col rounded-3xl border overflow-hidden shadow-xs transition-colors"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: isLeft ? "rgba(59, 130, 246, 0.4)" : "rgba(139, 92, 246, 0.4)"
      }}
    >
      {/* 1. Header with CSS Grid: GUARANTEES FULL RELATION TITLE IS NEVER TRUNCATED */}
      <div 
        className="p-3.5 sm:p-4 border-b transition-colors"
        style={{
          backgroundColor: "var(--bg-elevated)",
          borderColor: "var(--border-subtle)"
        }}
      >
        <div 
          className="grid items-start gap-2"
          style={{ gridTemplateColumns: "minmax(0, 1fr) auto" }}
        >
          {/* Left Title Area: zero truncation, clean wrapping allowed */}
          <div className="flex items-start space-x-2.5">
            <div 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-white shadow-xs flex items-center justify-center shrink-0 mt-0.5"
              style={{
                backgroundColor: isLeft ? "#3B82F6" : "#8B5CF6"
              }}
            >
              <Table className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>

            <div style={{ minWidth: 0, overflow: "visible" }}>
              <h3 
                className="text-xs sm:text-sm font-bold uppercase tracking-wider leading-snug"
                style={{ 
                  color: "var(--text-main)",
                  whiteSpace: "normal",
                  overflow: "visible",
                  textOverflow: "clip",
                  wordBreak: "break-word"
                }}
              >
                {title}: {table.name}
              </h3>
              <p className="text-[11px] leading-tight mt-1" style={{ color: "var(--text-muted)" }}>
                {table.rows.length} records • Key: <strong className="font-mono font-bold" style={{ color: isLeft ? "#3B82F6" : "#8B5CF6" }}>{selectedKey || "None"}</strong>
              </p>
            </div>
          </div>

          {/* Compact Edit Button: fixed width, never squishes or clips title */}
          <button
            onClick={onEditClick}
            className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-xl border text-xs font-semibold shrink-0 transition-all hover:scale-105 flex items-center space-x-1 shadow-2xs cursor-pointer"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: isLeft ? "rgba(59, 130, 246, 0.5)" : "rgba(139, 92, 246, 0.5)",
              color: isLeft ? "#60A5FA" : "#A78BFA"
            }}
            title={`Edit ${table.name} Schema & Rows`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Search and Stats Row */}
      <div 
        className="p-2.5 sm:p-3 border-b flex items-center justify-between gap-2 text-xs"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search rows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs rounded-xl border outline-none transition-colors"
            style={{
              backgroundColor: "var(--bg-input)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-main)"
            }}
          />
        </div>
        <div className="flex items-center space-x-1.5 shrink-0 text-[10px] sm:text-[11px] font-semibold">
          <span className="inline-flex items-center text-cyan-400">
            <CheckCircle className="w-3 h-3 mr-0.5" /> {matchedIndices.length} matched
          </span>
          <span className="text-slate-500">•</span>
          <span className="inline-flex items-center text-amber-400">
            <AlertCircle className="w-3 h-3 mr-0.5" /> {unmatchedIndices.length} unmatched
          </span>
        </div>
      </div>

      {/* 3. Responsive Tuples Table with Charcoal Table Base */}
      <div className="overflow-x-auto flex-1 max-h-72">
        <table className="w-full text-left text-xs" style={{ backgroundColor: "var(--bg-table)" }}>
          <thead 
            className="sticky top-0 border-b text-[11px]"
            style={{
              backgroundColor: "var(--bg-table-header)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-muted)"
            }}
          >
            <tr>
              <th className="p-2 w-7 text-center font-mono">#</th>
              {table.columns.map((col) => {
                const isKey = col.name === selectedKey;
                return (
                  <th
                    key={col.name}
                    onClick={() => handleSort(col.name)}
                    className="p-2 font-mono cursor-pointer hover:opacity-80 transition-opacity select-none whitespace-nowrap"
                    style={{
                      color: isKey ? (isLeft ? "#3B82F6" : "#8B5CF6") : "var(--text-main)",
                      fontWeight: isKey ? 700 : 600
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.name}</span>
                      {isKey && (
                        <span 
                          className="text-[9px] px-1 rounded text-white font-sans font-bold"
                          style={{ backgroundColor: isLeft ? "#3B82F6" : "#8B5CF6" }}
                        >
                          KEY
                        </span>
                      )}
                      <ArrowUpDown className="w-2.5 h-2.5 opacity-50" />
                    </div>
                  </th>
                );
              })}
              <th className="p-2 w-14 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
            {filteredRows.map(({ row, originalIndex }) => {
              const isMatched = matchedIndices.includes(originalIndex);
              const isHovered = hoveredRowIndex === originalIndex;

              return (
                <tr
                  key={originalIndex}
                  onMouseEnter={() => setHoveredRowIndex && setHoveredRowIndex(originalIndex)}
                  onMouseLeave={() => setHoveredRowIndex && setHoveredRowIndex(null)}
                  className="transition-colors cursor-default"
                  style={{
                    backgroundColor: isHovered 
                      ? "var(--bg-hover)" 
                      : isMatched 
                      ? "rgba(6, 182, 212, 0.08)" 
                      : isLeft 
                      ? "rgba(245, 158, 11, 0.08)" 
                      : "rgba(236, 72, 153, 0.08)"
                  }}
                >
                  <td className="p-2 text-center font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {originalIndex + 1}
                  </td>
                  {table.columns.map((col) => {
                    const val = row[col.name];
                    const isKey = col.name === selectedKey;
                    return (
                      <td
                        key={col.name}
                        className="p-2 font-mono whitespace-nowrap truncate max-w-[120px]"
                        style={{
                          fontWeight: isKey ? 700 : 500,
                          color: isKey ? "var(--text-main)" : "var(--text-muted)"
                        }}
                      >
                        {val === null || val === undefined ? (
                          <span 
                            className="italic font-bold px-1.5 py-0.5 rounded text-[10px]"
                            style={{ 
                              backgroundColor: "var(--bg-elevated)", 
                              color: "var(--semantic-null)",
                              border: "1px solid var(--border-subtle)" 
                            }}
                          >
                            NULL
                          </span>
                        ) : (
                          String(val)
                        )}
                      </td>
                    );
                  })}
                  <td className="p-2 text-center whitespace-nowrap">
                    {isMatched ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                        MATCH
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                        isLeft 
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          : "bg-pink-500/15 text-pink-400 border-pink-500/30"
                      }`}>
                        UNMATCH
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
