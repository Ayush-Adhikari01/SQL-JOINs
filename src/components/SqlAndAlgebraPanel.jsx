import React, { useState } from "react";
import { Check, Copy, ChevronDown, ChevronUp, Code, BookOpen } from "lucide-react";

/**
 * Syntax highlighter for SQL with full theme-awareness:
 * LIGHT MODE:
 * - Background: #FFFFFF
 * - Base text: #111111
 * - Keywords: blue / purple (#2563EB)
 * - Functions / Aliases: violet (#7C3AED)
 * - Strings: orange/amber (#D97706)
 * - Numbers: cyan (#0891B2)
 * - Comments: gray (#6B7280)
 *
 * DARK MODE:
 * - Background: #111111 (NOT blue, NOT navy, NOT white)
 * - Base text: #F5F5F5
 * - Keywords: #60A5FA (bright blue)
 * - Functions / Aliases: #A78BFA (bright violet)
 * - Strings: #FBBF24 (gold/amber)
 * - Numbers: #22D3EE (cyan)
 * - Comments: #94A3B8 (muted slate)
 */
function HighlightedSql({ sql, isDark }) {
  if (!sql) {
    return (
      <span className={isDark ? "text-neutral-500 italic" : "text-gray-400 italic"}>
        -- Select valid join keys to formulate query
      </span>
    );
  }

  const lines = sql.split("\n");
  const keywords = new Set([
    "SELECT", "FROM", "INNER", "JOIN", "LEFT", "RIGHT", "FULL", "OUTER", "CROSS", 
    "ON", "WHERE", "AS", "NATURAL", "ORDER", "BY", "GROUP", "AND", "OR", "NOT", "IS", "NULL"
  ]);

  return (
    <code>
      {lines.map((line, lIdx) => {
        if (line.trim().startsWith("--")) {
          return (
            <div key={lIdx} style={{ color: isDark ? "#94A3B8" : "#6B7280", fontStyle: "italic" }}>
              {line}
            </div>
          );
        }

        const tokens = line.split(/(\s+|[(),;=.])/);

        return (
          <div key={lIdx} className="leading-relaxed">
            {tokens.map((token, tIdx) => {
              const upper = token.toUpperCase();
              if (keywords.has(upper)) {
                return (
                  <span 
                    key={tIdx} 
                    className="font-bold" 
                    style={{ color: isDark ? "#60A5FA" : "#2563EB" }}
                  >
                    {token}
                  </span>
                );
              }
              if (/^[0-9]+$/.test(token)) {
                return (
                  <span 
                    key={tIdx} 
                    className="font-semibold" 
                    style={{ color: isDark ? "#22D3EE" : "#0891B2" }}
                  >
                    {token}
                  </span>
                );
              }
              if (token.startsWith("'") || token.endsWith("'")) {
                return (
                  <span 
                    key={tIdx} 
                    style={{ color: isDark ? "#FBBF24" : "#D97706" }}
                  >
                    {token}
                  </span>
                );
              }
              if (["e.", "d.", "emp.", "mgr.", "a.", "b."].includes(token.toLowerCase())) {
                return (
                  <span 
                    key={tIdx} 
                    className="font-semibold" 
                    style={{ color: isDark ? "#A78BFA" : "#7C3AED" }}
                  >
                    {token}
                  </span>
                );
              }
              if (["Employee", "Department", "Student", "Course", "Orders", "Customers"].includes(token)) {
                return (
                  <span 
                    key={tIdx} 
                    className="font-bold" 
                    style={{ color: isDark ? "#FFFFFF" : "#000000" }}
                  >
                    {token}
                  </span>
                );
              }
              return (
                <span 
                  key={tIdx} 
                  style={{ color: isDark ? "#F5F5F5" : "#111111" }}
                >
                  {token}
                </span>
              );
            })}
          </div>
        );
      })}
    </code>
  );
}

export function SqlAndAlgebraPanel({ sqlQuery, joinType, algebraNotation, isDark = false }) {
  const [copied, setCopied] = useState(false);
  const [showAlgebra, setShowAlgebra] = useState(true);

  const handleCopy = () => {
    if (!sqlQuery) return;
    navigator.clipboard.writeText(sqlQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* ============================================================== */}
      {/* 1. SQL QUERY BOX: THEME-AWARE DESIGN */}
      {/* LIGHT: #FFFFFF background, #111111 text, #D1D5DB border */}
      {/* DARK: #111111 background, #F5F5F5 text, #292929 border */}
      {/* ============================================================== */}
      <div 
        className="rounded-2xl border shadow-sm overflow-hidden flex flex-col justify-between transition-colors"
        style={{
          backgroundColor: isDark ? "#111111" : "#FFFFFF",
          borderColor: isDark ? "#292929" : "#D1D5DB"
        }}
      >
        <div>
          {/* Header Bar */}
          <div 
            className="p-3.5 border-b flex items-center justify-between"
            style={{
              backgroundColor: isDark ? "#161616" : "#F9FAFB",
              borderColor: isDark ? "#292929" : "#E5E7EB"
            }}
          >
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4" style={{ color: isDark ? "#60A5FA" : "#2563EB" }} />
              <span 
                className="text-xs font-bold uppercase tracking-wider" 
                style={{ color: isDark ? "#F5F5F5" : "#111111" }}
              >
                Generated Standard SQL Query
              </span>
            </div>

            {/* Copy SQL Button */}
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:scale-105 cursor-pointer shadow-xs"
              style={{
                backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
                borderColor: isDark ? "#333333" : "#D1D5DB",
                color: copied 
                  ? (isDark ? "#34D399" : "#059669") 
                  : (isDark ? "#E5E5E5" : "#1F2937")
              }}
              title="Copy ANSI SQL to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" style={{ color: isDark ? "#34D399" : "#059669" }} />
                  <span className="font-bold" style={{ color: isDark ? "#34D399" : "#059669" }}>✓ Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  <span>Copy SQL</span>
                </>
              )}
            </button>
          </div>

          {/* Code display */}
          <div 
            className="p-5 font-mono text-xs overflow-x-auto leading-relaxed border-b"
            style={{
              backgroundColor: isDark ? "#111111" : "#FFFFFF",
              color: isDark ? "#F5F5F5" : "#111111",
              borderColor: isDark ? "#292929" : "#E5E7EB"
            }}
          >
            <pre className="font-mono">
              <HighlightedSql sql={sqlQuery} isDark={isDark} />
            </pre>
          </div>
        </div>

        {/* Footer Note */}
        <div 
          className="p-3 text-[11px] flex items-center justify-between"
          style={{
            backgroundColor: isDark ? "#161616" : "#F9FAFB",
            color: isDark ? "#A3A3A3" : "#4B5563"
          }}
        >
          <span>💡 Compliant with ANSI SQL standard (PostgreSQL, MySQL 8.0, Oracle DB, SQL Server, SQLite).</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. RELATIONAL ALGEBRA FORMALISM BOX: THEME-AWARE DESIGN */}
      {/* ============================================================== */}
      <div 
        className="rounded-2xl border shadow-sm overflow-hidden flex flex-col justify-between transition-colors"
        style={{
          backgroundColor: isDark ? "#111111" : "#FFFFFF",
          borderColor: isDark ? "#292929" : "#D1D5DB"
        }}
      >
        <div>
          <div 
            className="p-3.5 border-b flex items-center justify-between cursor-pointer"
            onClick={() => setShowAlgebra(!showAlgebra)}
            style={{
              backgroundColor: isDark ? "#161616" : "#F9FAFB",
              borderColor: isDark ? "#292929" : "#E5E7EB"
            }}
          >
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" style={{ color: isDark ? "#A78BFA" : "#7C3AED" }} />
              <span 
                className="text-xs font-bold uppercase tracking-wider" 
                style={{ color: isDark ? "#F5F5F5" : "#111111" }}
              >
                Relational Algebra Formalism
              </span>
            </div>
            <button style={{ color: isDark ? "#A3A3A3" : "#6B7280" }}>
              {showAlgebra ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showAlgebra && (
            <div className="p-4 space-y-3" style={{ backgroundColor: isDark ? "#111111" : "#FFFFFF" }}>
              <div 
                className="p-4 rounded-xl border text-center shadow-xs"
                style={{
                  backgroundColor: isDark ? "#161616" : "#F8FAFC",
                  borderColor: isDark ? "#292929" : "#E2E8F0"
                }}
              >
                <div 
                  className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                  style={{ color: isDark ? "#A3A3A3" : "#6B7280" }}
                >
                  Algebraic Operator Expression
                </div>
                <div 
                  className="font-mono text-xl font-black tracking-wide"
                  style={{ color: isDark ? "#A78BFA" : "#7C3AED" }}
                >
                  {algebraNotation || "R ⋈_θ S"}
                </div>
              </div>

              <div 
                className="text-xs space-y-1.5 leading-relaxed" 
                style={{ color: isDark ? "#D4D4D8" : "#374151" }}
              >
                <p>
                  <strong>Theoretical Basis:</strong> In Codd's Relational Algebra, a theta-join (<code className="font-mono font-bold" style={{ color: isDark ? "#A78BFA" : "#7C3AED" }}>σ_θ(R × S)</code>) is defined as a selection operation over the Cartesian product of two relations.
                </p>
                <p style={{ color: isDark ? "#A3A3A3" : "#4B5563" }}>
                  {joinType === "INNER" && "The natural/equi-join retains only those tuples where the join attribute values strictly satisfy equality."}
                  {joinType === "LEFT" && "The left outer join (⟕) extends theta-join by appending NULL values for tuples of R that fail to join with any tuple in S."}
                  {joinType === "RIGHT" && "The right outer join (⟖) extends theta-join by appending NULL values for tuples of S that fail to join with any tuple in R."}
                  {joinType === "FULL" && "The full outer join (⟗) takes the union of both outer extensions, guaranteeing no loss of tuples from either relation."}
                  {joinType === "CROSS" && "The cross join represents the pure Cartesian product (R × S) generating |R| × |S| candidate tuples."}
                  {joinType === "SELF" && "Unary join with rename operator ρ: ρ(R_1, R) ⋈_θ ρ(R_2, R)."}
                  {joinType === "NATURAL" && "Implicit join over identical attribute sets: Π(R ⋈ S) projection without duplicating key column."}
                </p>
              </div>
            </div>
          )}
        </div>

        <div 
          className="p-3 border-t text-[11px]" 
          style={{ 
            backgroundColor: isDark ? "#161616" : "#F9FAFB",
            borderColor: isDark ? "#292929" : "#E5E7EB", 
            color: isDark ? "#A3A3A3" : "#6B7280" 
          }}
        >
          Reference: Silberschatz, Korth, Sudarshan — <em>Database System Concepts</em>, Ch. 2 & Ch. 6.
        </div>
      </div>
    </div>
  );
}
