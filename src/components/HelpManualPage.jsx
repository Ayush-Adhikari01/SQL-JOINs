import React from "react";
import { HelpCircle, Layers, Sparkles } from "lucide-react";

export function HelpManualPage() {
  const steps = [
    {
      num: 1,
      title: "Select an Example Domain or Create Custom Data",
      desc: "Use the top domain selector dropdown to load preconfigured scenarios (e.g., Employee & Department, Student & Course). Alternatively, click 'Edit Relation' on Table A or Table B to add custom columns and insert records."
    },
    {
      num: 2,
      title: "Choose the Relational JOIN Operation",
      desc: "Click on any of the join pills: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF, or NATURAL JOIN. The system re-evaluates the join dynamically."
    },
    {
      num: 3,
      title: "Select Join Keys for Table A and Table B",
      desc: "Map the matching attribute keys (e.g., department_id in Table A with department_id in Table B). For CROSS JOIN, keys are disabled as it calculates the pure Cartesian product."
    },
    {
      num: 4,
      title: "Observe Interactive Row Matching & Provenance",
      desc: "Matched rows are highlighted with cyan MATCH badges. Left or Right unmatched outer rows are identified with amber/pink badges, and missing opposite columns show clear NULL values."
    },
    {
      num: 5,
      title: "Step Through the Execution Pipeline",
      desc: "Use the Step-by-Step execution bar with Play, Pause, and Step buttons to walk through tuple reading, predicate comparison, NULL extension, and final synthesis."
    },
    {
      num: 6,
      title: "Inspect Generated Standard SQL and Relational Algebra",
      desc: "Review the ANSI SQL query generated in real-time. Click 'Copy SQL' to transfer the code into your IDE or database client. Check the formal relational algebra notation below it."
    },
    {
      num: 7,
      title: "Export Submission-Ready Execution Reports",
      desc: "Click 'Download' in the top navigation bar or 'Export PDF Report' on the visualizer page to download a timestamped, branded PDF with team details and execution stats."
    },
    {
      num: 8,
      title: "Switch Day/Night Theming or Customize RGB Colors",
      desc: "Click the Sun/Moon toggle to switch light/dark mode instantly. Click 'Theme' to select curated presets (Midnight Blue, Aurora, Cosmic) or drag R, G, B sliders to customize the accent palette."
    }
  ];

  const faqs = [
    {
      q: "Why do NULL keys not match in an INNER JOIN?",
      a: "SQL uses three-valued logic (TRUE, FALSE, UNKNOWN). When evaluating NULL = NULL, the result is UNKNOWN, not TRUE. Therefore, rows with NULL in their join key are never matched in equijoins."
    },
    {
      q: "How does CROSS JOIN differ from other joins?",
      a: "A CROSS JOIN has no ON predicate; it produces every possible combination of rows between Table A and Table B (cardinality is |A| × |B|)."
    },
    {
      q: "Can I customize the primary colors of the website?",
      a: "Yes! Click the 'Theme' button in the navbar. You can choose from 7 academic presets or customize the exact Red, Green, and Blue sliders with real-time HEX updates."
    },
    {
      q: "Does the PDF report contain dummy data?",
      a: "No! The PDF generator directly compiles your active table rows, chosen join operation, generated SQL, step details, and actual computed tuples."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div 
          className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider"
          style={{
            backgroundColor: "var(--bg-elevated)",
            color: "var(--color-primary)",
            border: "1px solid var(--border-subtle)"
          }}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>User Documentation & Operator Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "var(--text-main)" }}>
          Join Operations Visualizer User Manual
        </h2>
        <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
          Everything you need to navigate, simulate, customize, and demonstrate this digital assignment.
        </p>
      </div>

      {/* Step by step instructions */}
      <div className="space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--text-main)" }}>
          <Layers className="w-4 h-4 text-blue-500" />
          <span>Step-by-Step Operator Instructions</span>
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-4 rounded-2xl border shadow-xs flex items-start space-x-4 transition-colors"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-subtle)"
              }}
            >
              <div 
                className="w-7 h-7 rounded-xl text-white font-black text-xs flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {st.num}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold" style={{ color: "var(--text-main)" }}>
                  {st.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--text-main)" }}>
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span>Frequently Encountered Questions (FAQs)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {faqs.map((faq, fIdx) => (
            <div
              key={fIdx}
              className="p-5 rounded-2xl border shadow-xs space-y-2 transition-colors"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-subtle)"
              }}
            >
              <h4 className="text-xs sm:text-sm font-bold" style={{ color: "var(--color-primary)" }}>
                {faq.q}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
