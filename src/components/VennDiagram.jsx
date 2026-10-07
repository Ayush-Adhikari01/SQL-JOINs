import React, { useState } from "react";
import { Sparkles, Layers, Info, Check, Table, Cpu, HelpCircle } from "lucide-react";

export function VennDiagram({
  joinType,
  tableA,
  tableB,
  keyA,
  keyB,
  joinResult,
  selectedRegion,
  onSelectRegion
}) {
  const [hoveredPart, setHoveredPart] = useState(null);

  if (!tableA || !tableB || !joinResult) return null;

  const stats = joinResult.stats || {};
  const totalA = tableA.rows?.length || 0;
  const totalB = tableB.rows?.length || 0;
  const matchedPairs = stats.matchedCount || 0;
  const matchedA = joinResult.matchedAIndices?.length || 0;
  const matchedB = joinResult.matchedBIndices?.length || 0;
  const unmatchedA = stats.unmatchedLeftCount || 0;
  const unmatchedB = stats.unmatchedRightCount || 0;

  // Region Highlight rules based on CURRENT selected JOIN type
  const isLeftHighlighted = ["LEFT", "FULL"].includes(joinType);
  const isRightHighlighted = ["RIGHT", "FULL"].includes(joinType);
  const isIntersectionHighlighted = ["INNER", "LEFT", "RIGHT", "FULL", "SELF", "NATURAL"].includes(joinType);

  // Dynamic plain English and theoretical explanation based STRICTLY on current JOIN type
  let joinTitle = "INNER JOIN";
  let theoreticalFoundation = "";

  if (joinType === "INNER") {
    joinTitle = "INNER JOIN";
    theoreticalFoundation = "INNER JOIN keeps only records where the join condition matches in both relations. Unmatched records from both relations are eliminated from the result.";
  } else if (joinType === "LEFT") {
    joinTitle = "LEFT OUTER JOIN";
    theoreticalFoundation = "LEFT JOIN preserves every record from Relation A and adds matching records from Relation B. Missing matches are represented by NULL.";
  } else if (joinType === "RIGHT") {
    joinTitle = "RIGHT OUTER JOIN";
    theoreticalFoundation = "RIGHT JOIN preserves every record from Relation B and adds matching records from Relation A. Missing matches are represented by NULL.";
  } else if (joinType === "FULL") {
    joinTitle = "FULL OUTER JOIN";
    theoreticalFoundation = "FULL OUTER JOIN preserves records from both relations. Matching records are combined, while unmatched records are retained with NULL values.";
  } else if (joinType === "CROSS") {
    joinTitle = "CROSS JOIN";
    theoreticalFoundation = "CROSS JOIN produces the Cartesian product: every row from Relation A is paired with every row from Relation B without applying an equality predicate.";
  } else if (joinType === "SELF") {
    joinTitle = "SELF JOIN";
    theoreticalFoundation = "SELF JOIN compares a relation with itself using two logical aliases of the same table to resolve reflexive and hierarchical parent-child relationships.";
  } else if (joinType === "NATURAL") {
    joinTitle = "NATURAL JOIN";
    theoreticalFoundation = "NATURAL JOIN automatically matches columns with the same name and combines rows with equal values while projecting common join attributes only once.";
  }

  // -------------------------------------------------------------------------
  // SPECIAL DISPLAY 1: CROSS JOIN (Cartesian Multiplication Grid View)
  // -------------------------------------------------------------------------
  if (joinType === "CROSS") {
    return (
      <div 
        className="w-full rounded-3xl border p-5 sm:p-6 shadow-md transition-all space-y-4"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "rgba(6, 182, 212, 0.4)"
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-rose-500/10 text-rose-500 font-bold font-mono text-sm">
              ⨯
            </span>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--text-main)" }}>
                Cartesian Product Matrix ({tableA.name} × {tableB.name})
              </h3>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {totalA} rows × {totalB} rows = <strong className="text-rose-500">{totalA * totalB} total combinations</strong>
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 font-bold border border-rose-500/30">
            No Predicate Filter
          </span>
        </div>

        {/* Dynamic Multiplication Grid Canvas */}
        <div className="p-4 rounded-2xl border bg-black/40 flex flex-col items-center justify-center space-y-3" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="grid grid-cols-4 gap-2 max-w-md w-full">
            {tableA.rows.slice(0, 3).map((rA, iA) => (
              <React.Fragment key={iA}>
                {tableB.rows.slice(0, 3).map((rB, iB) => (
                  <div
                    key={`${iA}-${iB}`}
                    className="p-2 rounded-xl border text-[10px] text-center font-mono font-bold transition-transform hover:scale-105"
                    style={{
                      backgroundColor: "rgba(59, 130, 246, 0.12)",
                      borderColor: "rgba(59, 130, 246, 0.4)",
                      color: "var(--text-main)"
                    }}
                  >
                    A{iA + 1} × B{iB + 1}
                  </div>
                ))}
                <div className="p-2 rounded-xl text-[10px] text-center font-mono text-slate-400 flex items-center justify-center">
                  ...
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="text-center font-mono text-xs font-bold text-rose-400">
            Output Cardinality: |A| × |B| = {totalA} × {totalB} = {stats.rowCount} Tuples
          </div>
        </div>

        {/* Dynamic Theoretical Foundation Card */}
        <div 
          className="p-3.5 rounded-2xl border text-xs leading-relaxed"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-muted)"
          }}
        >
          <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-rose-500 mb-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>💡 THEORETICAL FOUNDATION • {joinTitle}</span>
          </div>
          <p style={{ color: "var(--text-main)" }}>"{theoreticalFoundation}"</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // SPECIAL DISPLAY 2: SELF JOIN (Hierarchical Unary Relationship Tree)
  // -------------------------------------------------------------------------
  if (joinType === "SELF") {
    return (
      <div 
        className="w-full rounded-3xl border p-5 sm:p-6 shadow-md transition-all space-y-4"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "rgba(6, 182, 212, 0.4)"
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold font-mono text-sm">
              ⟲ ⋈
            </span>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--text-main)" }}>
                Self-Referencing Relational Hierarchy
              </h3>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Correlating relation <strong>{tableA.name}</strong> against an aliased instance of itself
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30">
            Unary Self-Join
          </span>
        </div>

        {/* Tree Branch Diagram */}
        <div className="p-6 rounded-2xl border flex flex-col items-center justify-center space-y-4" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
          <div className="px-4 py-2 rounded-xl border font-bold text-xs shadow-sm" style={{ backgroundColor: "var(--bg-surface)", borderColor: "#3B82F6", color: "#60A5FA" }}>
            Root Table: {tableA.name}
          </div>

          <div className="flex items-center space-x-12 relative">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Role 1: Employee Alias</span>
              <div className="px-3 py-1.5 rounded-xl border text-xs font-mono font-bold bg-blue-500/10 border-blue-500/40 text-blue-400">
                {tableA.alias || "emp"} (Parent)
              </div>
            </div>

            <div className="font-mono text-xs font-bold text-cyan-400 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30">
              {tableA.alias || "emp"}.{keyA} = {tableB.alias || "mgr"}.{keyB}
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Role 2: Manager Alias</span>
              <div className="px-3 py-1.5 rounded-xl border text-xs font-mono font-bold bg-violet-500/10 border-violet-500/40 text-violet-400">
                {tableB.alias || "mgr"} (Child)
              </div>
            </div>
          </div>

          <div className="text-xs font-semibold text-cyan-400 font-mono">
            {stats.matchedCount} Recursive Relationships Matched
          </div>
        </div>

        {/* Dynamic Theoretical Foundation Card */}
        <div 
          className="p-3.5 rounded-2xl border text-xs leading-relaxed"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-muted)"
          }}
        >
          <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-cyan-400 mb-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>💡 THEORETICAL FOUNDATION • {joinTitle}</span>
          </div>
          <p style={{ color: "var(--text-main)" }}>"{theoreticalFoundation}"</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // MAIN DISPLAY: INTERACTIVE ANIMATED VENN DIAGRAM (INNER, LEFT, RIGHT, FULL, NATURAL)
  // WITH ANIMATED RGB PERIMETER BORDER (GLOWING MOVING GRADIENT AROUND EDGES ONLY)
  // -------------------------------------------------------------------------
  return (
    <div className="rgb-card-perimeter w-full">
      <div 
        className="rgb-card-inner p-5 sm:p-6 transition-all space-y-4 select-none"
        style={{
          backgroundColor: "var(--bg-surface)"
        }}
      >
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="flex items-center space-x-2.5">
          <div 
            className="p-1.5 rounded-xl text-white shadow-xs"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6, #06B6D4)" }}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--text-main)" }}>
              Interactive Relational Set Venn Diagram
            </h3>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Click any section to filter and highlight corresponding rows in source tables
            </p>
          </div>
        </div>

        {/* Active Filter Badge */}
        <div className="flex items-center space-x-2">
          {selectedRegion ? (
            <button
              onClick={() => onSelectRegion(null)}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/25 transition-colors cursor-pointer"
            >
              Filter: {selectedRegion.toUpperCase()} ✕
            </button>
          ) : (
            <span className="text-[11px] font-semibold text-slate-400">
              Interactive Selection: Ready
            </span>
          )}
        </div>
      </div>

      {/* SVG Set Diagram Canvas with rich RGB Glow effects */}
      <div className="relative flex flex-col items-center justify-center py-2">
        <svg
          viewBox="0 0 520 260"
          className="w-full max-w-lg h-auto overflow-visible filter drop-shadow-md transition-all"
        >
          <defs>
            <clipPath id="clip-circle-left">
              <circle cx="210" cy="130" r="95" />
            </clipPath>
            <clipPath id="clip-circle-right">
              <circle cx="310" cy="130" r="95" />
            </clipPath>

            {/* Subtle RGB glow filters */}
            <filter id="glow-cyan-intersection" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#06B6D4" floodOpacity="0.6" />
            </filter>
            <filter id="glow-blue-left" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#3B82F6" floodOpacity="0.4" />
            </filter>
            <filter id="glow-violet-right" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#8B5CF6" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* CIRCLE A (Left Relation - Electric Blue / Indigo) */}
          <g 
            className="cursor-pointer group transition-transform duration-200"
            onClick={() => onSelectRegion("left")}
            onMouseEnter={() => setHoveredPart("left")}
            onMouseLeave={() => setHoveredPart(null)}
          >
            <circle
              cx="210"
              cy="130"
              r="95"
              fill={
                isLeftHighlighted || selectedRegion === "left"
                  ? "rgba(59, 130, 246, 0.28)"
                  : "rgba(148, 163, 184, 0.08)"
              }
              stroke={isLeftHighlighted ? "#3B82F6" : "#52525B"}
              strokeWidth={selectedRegion === "left" ? "4" : "2.5"}
              strokeDasharray={isLeftHighlighted ? "none" : "4,2"}
              filter={isLeftHighlighted ? "url(#glow-blue-left)" : "none"}
              className="transition-all duration-300"
            />
          </g>

          {/* CIRCLE B (Right Relation - Violet / Magenta) */}
          <g 
            className="cursor-pointer group transition-transform duration-200"
            onClick={() => onSelectRegion("right")}
            onMouseEnter={() => setHoveredPart("right")}
            onMouseLeave={() => setHoveredPart(null)}
          >
            <circle
              cx="310"
              cy="130"
              r="95"
              fill={
                isRightHighlighted || selectedRegion === "right"
                  ? "rgba(139, 92, 246, 0.28)"
                  : "rgba(148, 163, 184, 0.08)"
              }
              stroke={isRightHighlighted ? "#8B5CF6" : "#52525B"}
              strokeWidth={selectedRegion === "right" ? "4" : "2.5"}
              strokeDasharray={isRightHighlighted ? "none" : "4,2"}
              filter={isRightHighlighted ? "url(#glow-violet-right)" : "none"}
              className="transition-all duration-300"
            />
          </g>

          {/* INTERSECTION AREA (Cyan RGB Glow) */}
          <g 
            clipPath="url(#clip-circle-left)"
            className="cursor-pointer group"
            onClick={() => onSelectRegion("intersection")}
            onMouseEnter={() => setHoveredPart("intersection")}
            onMouseLeave={() => setHoveredPart(null)}
          >
            <circle
              cx="310"
              cy="130"
              r="95"
              fill={
                isIntersectionHighlighted || selectedRegion === "intersection"
                  ? "rgba(6, 182, 212, 0.7)"
                  : "rgba(148, 163, 184, 0.12)"
              }
              filter={isIntersectionHighlighted ? "url(#glow-cyan-intersection)" : "none"}
              className="transition-all duration-300 hover:opacity-90"
            />
          </g>

          {/* LABELS & METRIC COUNTS OVERLAY */}
          {/* Table A Label */}
          <text
            x="145"
            y="105"
            textAnchor="middle"
            fill="currentColor"
            className="font-bold text-sm select-none pointer-events-none"
            style={{ color: "var(--text-main)" }}
          >
            {tableA.name}
          </text>
          <text
            x="145"
            y="125"
            textAnchor="middle"
            fill="#3B82F6"
            className="font-black text-xs font-mono select-none pointer-events-none"
          >
            {totalA} ROWS
          </text>
          <text
            x="145"
            y="143"
            textAnchor="middle"
            fill="#06B6D4"
            className="font-bold text-[10px] font-mono select-none pointer-events-none"
          >
            {matchedA} MATCHED
          </text>
          <text
            x="145"
            y="159"
            textAnchor="middle"
            fill="#F59E0B"
            className="font-bold text-[10px] font-mono select-none pointer-events-none"
          >
            {unmatchedA} UNMATCHED
          </text>

          {/* Table B Label */}
          <text
            x="375"
            y="105"
            textAnchor="middle"
            fill="currentColor"
            className="font-bold text-sm select-none pointer-events-none"
            style={{ color: "var(--text-main)" }}
          >
            {tableB.name}
          </text>
          <text
            x="375"
            y="125"
            textAnchor="middle"
            fill="#8B5CF6"
            className="font-black text-xs font-mono select-none pointer-events-none"
          >
            {totalB} ROWS
          </text>
          <text
            x="375"
            y="143"
            textAnchor="middle"
            fill="#06B6D4"
            className="font-bold text-[10px] font-mono select-none pointer-events-none"
          >
            {matchedB} MATCHED
          </text>
          <text
            x="375"
            y="159"
            textAnchor="middle"
            fill="#EC4899"
            className="font-bold text-[10px] font-mono select-none pointer-events-none"
          >
            {unmatchedB} UNMATCHED
          </text>

          {/* Center Match Label (Intersection) */}
          <text
            x="260"
            y="115"
            textAnchor="middle"
            fill="#FFFFFF"
            className="font-black text-xs uppercase tracking-wider select-none pointer-events-none drop-shadow"
          >
            MATCH
          </text>
          <text
            x="260"
            y="136"
            textAnchor="middle"
            fill="#FFFFFF"
            className="font-black text-xs font-mono select-none pointer-events-none drop-shadow"
          >
            {matchedPairs} MATCHING PAIRS
          </text>
          <text
            x="260"
            y="153"
            textAnchor="middle"
            fill="#E0F2FE"
            className="font-bold text-[9px] uppercase tracking-wider select-none pointer-events-none"
          >
            KEY EQUALITY
          </text>
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredPart && (
          <div 
            className="absolute bottom-2 px-3.5 py-1.5 rounded-xl border text-xs shadow-lg font-semibold pointer-events-none animate-fade-in"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--color-primary)",
              color: "var(--text-main)"
            }}
          >
            {hoveredPart === "left" && (
              <span><strong>{tableA.name}:</strong> {totalA} rows • {matchedA} matched • {unmatchedA} unmatched</span>
            )}
            {hoveredPart === "intersection" && (
              <span className="text-cyan-400"><strong>MATCHING RECORDS:</strong> {matchedPairs} matching pairs ({keyA} = {keyB})</span>
            )}
            {hoveredPart === "right" && (
              <span><strong>{tableB.name}:</strong> {totalB} rows • {matchedB} matched • {unmatchedB} unmatched</span>
            )}
          </div>
        )}
      </div>

      {/* Helpful Cardinality Tip */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>Matched rows can differ between relations when one key value appears multiple times (1:N or M:N fan-out).</span>
        </span>
      </div>

      {/* Dynamic Academic Theoretical Foundation Card */}
      <div 
        className="p-3.5 rounded-2xl border text-xs leading-relaxed"
        style={{
          backgroundColor: "var(--bg-elevated)",
          borderColor: "var(--border-subtle)",
          color: "var(--text-muted)"
        }}
      >
        <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-cyan-400 mb-1 text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>💡 THEORETICAL FOUNDATION • {joinTitle}</span>
        </div>
        <p style={{ color: "var(--text-main)" }}>"{theoreticalFoundation}"</p>
      </div>
    </div>
  </div>
  );
}
