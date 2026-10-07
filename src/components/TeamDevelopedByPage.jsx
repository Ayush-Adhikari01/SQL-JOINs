import React from "react";
import { Users, GraduationCap, Award, ExternalLink } from "lucide-react";

export function TeamDevelopedByPage() {
  const teamMembers = [
    {
      name: "Ayush Adhikari",
      regNo: "25BCE5324",
      role: "Lead Full-Stack Developer & UI/UX Architect",
      initials: "AA",
      color: "from-blue-600 to-indigo-700",
      tasks: "Engineered core in-memory join algorithm engine, dynamic relation visualizer, state synchronization, and PDF report generation."
    },
    {
      name: "Parth Malik",
      regNo: "25BCE5386",
      role: "Database Systems Analyst & Logic Engine Specialist",
      initials: "PM",
      color: "from-purple-600 to-violet-800",
      tasks: "Authored relational algebra formulations, automated 11-point unit testing harness, edge case validation, and SQL generation."
    },
    {
      name: "Keshav Agarwal",
      regNo: "25BCE5503",
      role: "Frontend Engineer & Curriculum Content Researcher",
      initials: "KA",
      color: "from-indigo-600 to-pink-700",
      tasks: "Developed educational curriculum modules (sections A–O), interactive quiz challenges, responsive tables, and theme management."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16">
      {/* Header Banner */}
      <div className="text-center space-y-4">
        <div 
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider"
          style={{
            backgroundColor: "var(--bg-elevated)",
            color: "var(--color-primary)",
            border: "1px solid var(--border-subtle)"
          }}
        >
          <Award className="w-4 h-4" />
          <span>Database Management Systems • Digital Assignment</span>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3.5">
          {/* Circular Professional University Team Emblem */}
          <div 
            className="w-24 h-24 rounded-full overflow-hidden border p-2 shadow-md flex items-center justify-center transition-transform hover:scale-105"
            style={{ 
              backgroundColor: "var(--bg-surface)", 
              borderColor: "rgba(212, 175, 55, 0.55)",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15), 0 0 16px rgba(212, 175, 55, 0.12)"
            }}
          >
            <img 
              src="/Team_logo.png" 
              alt="Team Kapa Official Brand Logo" 
              className="w-full h-full object-contain"
            />
          </div>

          <h2 
            className="text-3xl sm:text-4xl font-bold tracking-tight text-center" 
            style={{ 
              color: "var(--text-main)",
              fontFamily: '"Times New Roman", Times, "Liberation Serif", serif'
            }}
          >
            Team Kapa
          </h2>

          <p className="text-xs sm:text-sm max-w-lg text-center leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Designed, developed, tested, and documented by undergraduate computer science engineers for university evaluation.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 🏆 PREMIUM GOLD ACADEMIC MENTORSHIP CARD (ENTIRE CARD CLICKABLE) */}
      {/* Target: Dr. Swaminathan A's official academic profile (new tab) */}
      {/* ============================================================== */}
      <a
        href="https://sites.google.com/view/swaminathan-a/home?pli=1&authuser=0"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Dr. Swaminathan Annadurai's official academic faculty profile"
        className="gold-mentorship-card block p-6 sm:p-8 rounded-3xl text-left cursor-pointer group no-underline transition-all"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 flex-1">
            {/* Translucent Glass-like Square Container with Champagne Glow */}
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-md"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 248, 231, 0.35)",
                backdropFilter: "blur(6px)"
              }}
            >
              <GraduationCap 
                className="gold-cap-icon w-9 h-9 transition-all duration-300" 
                style={{ 
                  color: "#F4E3A1",
                  filter: "drop-shadow(0 0 6px rgba(244, 227, 161, 0.5))"
                }} 
              />
            </div>

            {/* Academic Content Block */}
            <div className="space-y-1.5 flex-1">
              <div 
                className="text-[11px] sm:text-xs uppercase font-extrabold tracking-widest leading-none"
                style={{ 
                  color: "#F4E3A1",
                  letterSpacing: "0.12em"
                }}
              >
                PROJECT MENTORSHIP & ACADEMIC GUIDANCE
              </div>

              <h3 
                className="text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ color: "#FFFDF5" }}
              >
                Dr. Swaminathan A
              </h3>

              <p 
                className="text-xs sm:text-sm font-medium"
                style={{ color: "#FFF8E7", opacity: 0.95 }}
              >
                Assistant Professor • Department of Database Systems & Computer Science
              </p>

              <p 
                className="text-xs sm:text-[13px] leading-relaxed pt-1 max-w-2xl"
                style={{ color: "#FFFDF5", opacity: 0.88 }}
              >
                Special thanks to Dr. Swaminathan A for guidance on relational algebra correctness, formalizing null-extension logic, and encouraging visual pedagogy in Database Management Systems.
              </p>
            </div>
          </div>

          {/* Subtle External Link Indicator in Top-Right (Premium Interactive Control) */}
          <div 
            className="gold-arrow-container self-start sm:self-center shrink-0 p-2.5 rounded-xl border transition-all duration-300"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.10)",
              borderColor: "rgba(255, 244, 194, 0.35)",
              backdropFilter: "blur(4px)"
            }}
          >
            <ExternalLink 
              className="gold-arrow-icon w-4 h-4 transition-transform duration-300" 
              style={{ color: "#F4E3A1" }} 
            />
          </div>
        </div>
      </a>

      {/* Team Members Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-main)" }}>
          <Users className="w-4 h-4 text-blue-500" />
          <span>Team Members & Individual Contributions</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, mIdx) => (
            <div
              key={mIdx}
              className="rounded-3xl border p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors hover:scale-[1.01]"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-subtle)"
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${member.color} text-white font-black text-sm flex items-center justify-center shadow-md`}>
                    {member.initials}
                  </div>
                  <div>
                    <h4 className="text-base font-bold" style={{ color: "var(--text-main)" }}>
                      {member.name}
                    </h4>
                    <span 
                      className="font-mono text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}
                    >
                      {member.regNo}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                  {member.role}
                </div>

                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {member.tasks}
                </p>
              </div>

              <div 
                className="pt-3 border-t flex items-center justify-between text-[11px]"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
              >
                <span>Computer Science & Eng.</span>
                <span className="font-bold" style={{ color: "var(--color-primary)" }}>B.Tech</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
