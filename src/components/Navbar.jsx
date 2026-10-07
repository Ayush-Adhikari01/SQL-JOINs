import React from "react";
import { Download, Database, BookOpen, HelpCircle, Users, CheckCircle2, Award, Zap, Palette, Sun, Moon } from "lucide-react";

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  isDark, 
  setIsDark, 
  onExportPdf,
  onOpenThemeCustomizer 
}) {
  const navItems = [
    { id: "home", label: "Home", icon: Award },
    { id: "visualizer", label: "Visualizer", icon: Database },
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "practice", label: "Practice Quiz", icon: Zap },
    { id: "testing", label: "Testing", icon: CheckCircle2 },
    { id: "help", label: "Help & Manual", icon: HelpCircle }
  ];

  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors"
      style={{
        backgroundColor: isDark ? "#030303" : "rgba(255, 255, 255, 0.95)",
        borderColor: isDark ? "#222222" : "var(--border-subtle)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Identity with Kapa Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={() => setActiveTab("home")}
          >
            <div 
              className="relative w-10 h-10 rounded-full overflow-hidden border shadow-xs flex items-center justify-center p-1 transition-transform group-hover:scale-105 shrink-0"
              style={{
                backgroundColor: isDark ? "#0A0A0A" : "#FFFFFF",
                borderColor: "rgba(212, 175, 55, 0.45)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
              }}
            >
              <img 
                src="/Team_logo.png" 
                alt="Kapa Logo" 
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg tracking-tight leading-tight flex items-center space-x-1.5">
                <span style={{ color: "var(--text-main)" }}>Join Operations</span>
                <span 
                  className="bg-clip-text text-transparent font-bold"
                  style={{ backgroundImage: "linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899)" }}
                >
                  Visualizer
                </span>
              </div>
              <p className="text-[12px] leading-none mt-0.5 font-normal" style={{ color: "var(--text-muted)" }}>
                DBMS Digital Assignment • Dr. Swaminathan A
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive ? "text-white shadow-xs" : "hover:opacity-85"
                  }`}
                  style={{
                    background: isActive ? "linear-gradient(135deg, #3B82F6, #8B5CF6)" : "transparent",
                    color: isActive ? "#ffffff" : "var(--text-muted)"
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Developed By Link Button */}
            <button
              onClick={() => setActiveTab("team")}
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                activeTab === "team" ? "text-white" : ""
              }`}
              style={{
                backgroundColor: activeTab === "team" ? "var(--color-accent)" : "var(--bg-elevated)",
                borderColor: "var(--border-subtle)",
                color: activeTab === "team" ? "#ffffff" : "var(--text-main)"
              }}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Developed By</span>
            </button>

            {/* Download Report */}
            <button
              onClick={onExportPdf}
              title="Download PDF Execution Report"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all hover:opacity-90 shadow-2xs"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-main)"
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Download</span>
            </button>

            {/* Theme & RGB Palette Customizer Trigger: Crisp and clearly visible in both light & dark mode */}
            <button
              onClick={onOpenThemeCustomizer}
              title="Customize Theme & RGB Color Palette"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all hover:scale-105 shadow-2xs cursor-pointer"
              style={{
                backgroundColor: isDark ? "#111111" : "#FFFFFF",
                borderColor: isDark ? "#3F3F46" : "#CBD5E1",
                color: isDark ? "#F5F5F5" : "#111827",
                boxShadow: isDark ? "0 0 10px rgba(59, 130, 246, 0.25)" : "0 1px 2px rgba(0,0,0,0.05)"
              }}
            >
              <Palette 
                className="w-4 h-4 shrink-0" 
                style={{ color: isDark ? "#FBBF24" : "#4F46E5" }} 
              />
              <span className="font-bold">Theme</span>
            </button>

            {/* Direct Day / Night Quick Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-xl border transition-all hover:scale-105 shadow-2xs flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: isDark ? "#111111" : "#FFFFFF",
                borderColor: isDark ? "#3F3F46" : "#CBD5E1",
                color: isDark ? "#F5F5F5" : "#111827"
              }}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div 
          className="flex lg:hidden overflow-x-auto py-2 border-t space-x-1.5 no-scrollbar"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          {[...navItems, { id: "team", label: "Developed By", icon: Users }].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="whitespace-nowrap flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0"
                style={{
                  backgroundColor: isActive ? "var(--color-primary)" : "var(--bg-elevated)",
                  color: isActive ? "#ffffff" : "var(--text-muted)"
                }}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export function Footer({ setActiveTab }) {
  return (
    <footer 
      className="mt-auto border-t py-8 px-4 text-xs sm:text-sm transition-colors"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
        color: "var(--text-muted)"
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-full overflow-hidden border p-0.5 flex items-center justify-center shrink-0 shadow-2xs"
            style={{ 
              backgroundColor: "var(--bg-surface)",
              borderColor: "rgba(212, 175, 55, 0.45)" 
            }}
          >
            <img 
              src="/Team_logo.png" 
              alt="Team Kapa" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: "var(--text-main)" }}>
              Join Operations Visualizer • Team Kapa
            </div>
            <div>DBMS Digital Assignment • Guided by Dr. Swaminathan A</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 font-medium" style={{ color: "var(--text-muted)" }}>
          <button onClick={() => setActiveTab("home")} className="hover:underline">Home</button>
          <span>•</span>
          <button onClick={() => setActiveTab("visualizer")} className="hover:underline">Visualizer</button>
          <span>•</span>
          <button onClick={() => setActiveTab("learn")} className="hover:underline">Learn</button>
          <span>•</span>
          <button onClick={() => setActiveTab("practice")} className="hover:underline">Practice Quiz</button>
          <span>•</span>
          <button onClick={() => setActiveTab("testing")} className="hover:underline">Testing</button>
          <span>•</span>
          <button onClick={() => setActiveTab("help")} className="hover:underline">Help & Manual</button>
          <span>•</span>
          <button onClick={() => setActiveTab("team")} className="hover:underline">Developed By</button>
        </div>

        <div className="text-center md:text-right text-xs" style={{ color: "var(--text-muted)" }}>
          Developed by <strong>Ayush Adhikari</strong>, <strong>Parth Malik</strong>, <strong>Keshav Agarwal</strong>
          <br />
          Team Kapa • Database Management Systems
        </div>
      </div>
    </footer>
  );
}
