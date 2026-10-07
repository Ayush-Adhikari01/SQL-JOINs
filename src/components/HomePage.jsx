import React, { useState, useEffect } from "react";
import { ArrowRight, Database, BookOpen, Sparkles, CheckCircle2, Split, Layers, HelpCircle, Users, Table, Cpu, ShieldCheck } from "lucide-react";
import { JOIN_TYPES } from "../utils/joinEngine";

export function HomePage({ setActiveTab, onSelectJoinType }) {
  // Animated join connection simulation in hero
  const [activeJoinRow, setActiveJoinRow] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveJoinRow((prev) => (prev + 1) % 3);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const heroConnections = [
    { a: "101 • Alice", deptA: "1", b: "1 • Engineering", match: true },
    { a: "102 • Bob", deptA: "2", b: "2 • Marketing", match: true },
    { a: "105 • Evan", deptA: "NULL", b: "NULL (Unmatched)", match: false }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Redesigned Compact & Powerful Hero Section */}
      <section 
        className="rounded-3xl p-6 sm:p-10 lg:p-12 border shadow-lg relative overflow-hidden transition-all"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-subtle)"
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline and Call-To-Actions */}
          <div className="lg:col-span-7 space-y-5">
            <div 
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: "var(--bg-elevated)",
                color: "var(--color-primary)",
                border: "1px solid var(--border-subtle)"
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive DBMS Learning Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight" style={{ color: "var(--text-main)" }}>
              See how SQL JOINs <br />
              <span 
                className="bg-clip-text text-transparent font-black"
                style={{ backgroundImage: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
              >
                work — visually.
              </span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
              Explore how relational records are matched, preserved, and combined through dynamic tuple line animations, relational algebra formalisms, and step-by-step in-memory execution.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab("visualizer")}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
              >
                <Database className="w-4 h-4" />
                <span>Launch Live Visualizer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab("learn")}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl border font-bold text-xs sm:text-sm transition-all hover:opacity-80"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-main)"
                }}
              >
                <BookOpen className="w-4 h-4" />
                <span>Learn JOIN Theory</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive JOIN Visual Preview */}
          <div className="lg:col-span-5">
            <div 
              className="p-5 rounded-2xl border shadow-inner space-y-4"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)"
              }}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                <span>Table A: Employee</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-mono">
                  department_id
                </span>
                <span>Table B: Department</span>
              </div>

              {/* Animated Connecting Rows */}
              <div className="space-y-2.5">
                {heroConnections.map((conn, idx) => {
                  const isActive = activeJoinRow === idx;
                  return (
                    <div 
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isActive ? "ring-2 scale-[1.02]" : "opacity-80"
                      }`}
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        borderColor: isActive ? "var(--color-primary)" : "var(--border-subtle)"
                      }}
                    >
                      <div className="font-mono font-semibold" style={{ color: "var(--text-main)" }}>
                        {conn.a}
                      </div>

                      {/* Connection cord with animated dot */}
                      <div className="flex-1 mx-3 flex items-center justify-center">
                        <div 
                          className="h-0.5 flex-1 relative"
                          style={{
                            backgroundColor: conn.match ? "var(--semantic-match)" : "var(--semantic-unmatched-left)"
                          }}
                        >
                          {isActive && (
                            <div 
                              className="w-2 h-2 rounded-full absolute top-1/2 -translate-y-1/2 animate-ping"
                              style={{
                                backgroundColor: conn.match ? "var(--semantic-match)" : "var(--semantic-unmatched-left)"
                              }}
                            />
                          )}
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-1.5 ${
                          conn.match ? "bg-cyan-500/10 text-cyan-500" : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {conn.match ? "MATCH" : "NULL"}
                        </span>
                      </div>

                      <div className="font-mono font-semibold" style={{ color: "var(--text-main)" }}>
                        {conn.b}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] text-center" style={{ color: "var(--text-muted)" }}>
                💡 Click any JOIN below to see complete relations and SQL queries.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "Why JOINs are Difficult" Problem Statement */}
      <section 
        className="rounded-3xl p-6 sm:p-8 border space-y-4"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-subtle)"
        }}
      >
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-500">
          <Cpu className="w-4 h-4" />
          <span>Academic Rationale & Problem Statement</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black" style={{ color: "var(--text-main)" }}>
          Why relational JOINs cause confusion for students
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          "Students often learn SQL JOIN operations through syntax and static textbook examples, making it difficult to understand how records are matched, retained, and combined during execution. The <strong>Join Operations Visualizer</strong> provides an interactive environment where students can enter relational data, select different JOIN operations, observe record matching visually, inspect generated SQL and relational algebra, and understand the resulting dataset step by step."
        </p>
      </section>

      {/* 3. "How Our Visualizer Helps" 4 Feature Cards */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold" style={{ color: "var(--text-main)" }}>
          Educational Capabilities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "1. Interactive Matching",
              desc: "Side-by-side tuple visualization with provenance badges for MATCH, NULL PAD, and Cartesian rows.",
              color: "text-blue-500",
              icon: Database
            },
            {
              title: "2. Step-by-Step Stepper",
              desc: "Pause, play, and trace nested loop comparisons from ingestion to final relational projection.",
              color: "text-violet-500",
              icon: Layers
            },
            {
              title: "3. ANSI SQL & Algebra",
              desc: "Dynamic SQL query generator with Copy button and Codd relational algebra formalism ($R \\bowtie_\\theta S$).",
              color: "text-cyan-500",
              icon: Split
            },
            {
              title: "4. Custom Schema Editor",
              desc: "Add custom tables, define column datatypes, insert tuples, and simulate unique edge cases.",
              color: "text-pink-500",
              icon: Table
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl border shadow-xs space-y-2 transition-all hover:scale-[1.01]"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-subtle)"
                }}
              >
                <div className={`p-2 rounded-xl bg-slate-500/10 w-fit ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold" style={{ color: "var(--text-main)" }}>{item.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Supported Join Types Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold" style={{ color: "var(--text-main)" }}>
            7 Supported Relational Operations
          </h3>
          <span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
            Click any operation to simulate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {JOIN_TYPES.map((jt) => (
            <div
              key={jt.id}
              onClick={() => {
                if (onSelectJoinType) onSelectJoinType(jt.id);
                setActiveTab("visualizer");
              }}
              className="group cursor-pointer rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-subtle)"
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black font-mono" style={{ color: "var(--color-primary)" }}>
                    {jt.symbol}
                  </span>
                  <span 
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-muted)"
                    }}
                  >
                    {jt.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold group-hover:underline" style={{ color: "var(--text-main)" }}>
                  {jt.name}
                </h4>
                <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
                  {jt.summary}
                </p>
              </div>

              <div 
                className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-semibold"
                style={{ borderColor: "var(--border-subtle)", color: "var(--color-primary)" }}
              >
                <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>{jt.algebra}</span>
                <span className="flex items-center gap-1">
                  Simulate <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How It Works Pipeline */}
      <section 
        className="rounded-3xl p-6 sm:p-8 border space-y-4"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-subtle)"
        }}
      >
        <h3 className="text-lg font-bold" style={{ color: "var(--text-main)" }}>
          How the Visualizer Works (4 Simple Steps)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Select Source Relations", desc: "Choose pre-configured enterprise datasets or input custom relations." },
            { step: "02", title: "Select Join Operation", desc: "Pick INNER, LEFT, RIGHT, FULL, CROSS, SELF, or NATURAL JOIN." },
            { step: "03", title: "Resolve Predicate Keys", desc: "Select matching key columns to formulate the join predicate equality." },
            { step: "04", title: "Inspect Result & SQL", desc: "Observe animated matching, inspect SQL query, and export PDF reports." }
          ].map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl border space-y-1.5" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
              <div className="text-lg font-black font-mono" style={{ color: "var(--color-primary)" }}>{s.step}</div>
              <div className="text-xs font-bold" style={{ color: "var(--text-main)" }}>{s.title}</div>
              <div className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Developed By Team Kapa Attribution Banner */}
      <section 
        className="rounded-3xl p-6 sm:p-8 border flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          backgroundColor: "var(--bg-elevated)",
          borderColor: "var(--border-subtle)"
        }}
      >
        <div className="flex items-center space-x-4">
          <img 
            src="/Team_logo.png" 
            alt="Team Kapa" 
            className="w-12 h-12 rounded-xl object-contain p-1 border shadow-xs"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
          />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-500">
              Developed by Team Kapa
            </div>
            <h3 className="text-base font-bold" style={{ color: "var(--text-main)" }}>
              Ayush Adhikari • Parth Malik • Keshav Agarwal
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Mentored by Dr. Swaminathan A, Assistant Professor
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("team")}
          className="px-5 py-2.5 rounded-xl text-xs font-bold border transition-all hover:scale-105"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-main)"
          }}
        >
          View Team Details →
        </button>
      </section>
    </div>
  );
}
