/**
 * Theme & RGB Color System for Join Operations Visualizer
 * Supports:
 * - 7 Presets: Midnight Blue, Aurora, Cosmic, Ocean, Sunset, Graphite, Light Academic
 * - Custom RGB / HEX picker with real-time CSS variable updates
 * - True Light / Dark mode toggling with persistence and 3-layer depth
 * - Semantic colors (MATCH, UNMATCHED LEFT, UNMATCHED RIGHT, NULL, ACTIVE, SUCCESS, ERROR)
 */

export const THEME_PRESETS = [
  {
    id: "midnight",
    name: "Midnight Blue",
    desc: "Royal Blue + Deep Violet",
    primary: { r: 59, g: 130, b: 246, hex: "#3B82F6" },      // Blue
    accent: { r: 139, g: 92, b: 246, hex: "#8B5CF6" },       // Violet
    accent2: { r: 6, g: 182, b: 212, hex: "#06B6D4" }        // Cyan
  },
  {
    id: "aurora",
    name: "Aurora",
    desc: "Purple + Electric Cyan",
    primary: { r: 147, g: 51, b: 234, hex: "#9333ea" },      // Purple
    accent: { r: 6, g: 182, b: 212, hex: "#06B6D4" },        // Cyan
    accent2: { r: 59, g: 130, b: 246, hex: "#3B82F6" }       // Blue
  },
  {
    id: "cosmic",
    name: "Cosmic",
    desc: "Indigo + Vivid Magenta",
    primary: { r: 99, g: 102, b: 241, hex: "#6366f1" },      // Indigo
    accent: { r: 236, g: 72, b: 153, hex: "#EC4899" },       // Magenta / Pink
    accent2: { r: 168, g: 85, b: 247, hex: "#a855f7" }       // Purple
  },
  {
    id: "ocean",
    name: "Ocean",
    desc: "Cobalt + Aqua Cyan",
    primary: { r: 37, g: 99, b: 235, hex: "#2563eb" },       // Cobalt Blue
    accent: { r: 14, g: 165, b: 233, hex: "#0ea5e9" },       // Cyan
    accent2: { r: 20, g: 184, b: 166, hex: "#14b8a6" }       // Teal / Aqua
  },
  {
    id: "sunset",
    name: "Sunset",
    desc: "Amber Orange + Rose Pink",
    primary: { r: 249, g: 115, b: 22, hex: "#f97316" },      // Warm Orange
    accent: { r: 244, g: 63, b: 94, hex: "#f43f5e" },        // Rose Pink
    accent2: { r: 168, g: 85, b: 247, hex: "#a855f7" }       // Purple
  },
  {
    id: "graphite",
    name: "Graphite",
    desc: "Charcoal Neutral + Royal Violet",
    primary: { r: 124, g: 58, b: 237, hex: "#7c3aed" },      // Royal Violet
    accent: { r: 99, g: 102, b: 241, hex: "#6366f1" },       // Indigo
    accent2: { r: 56, g: 189, b: 248, hex: "#38bdf8" }       // Sky
  },
  {
    id: "academic",
    name: "Academic Clean",
    desc: "Deep Oxford Blue + Amethyst",
    primary: { r: 30, g: 64, b: 175, hex: "#1e40af" },       // Oxford Blue
    accent: { r: 126, g: 34, b: 206, hex: "#7e22ce" },       // Amethyst Purple
    accent2: { r: 2, g: 132, b: 199, hex: "#0284c7" }        // Deep Sky
  }
];

export function hexToRgb(hex) {
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map(c => c + c).join("");
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

export function applyThemeVariables({ primary, accent, isDark }) {
  const root = document.documentElement;

  // Set RGB component variables
  root.style.setProperty("--primary-r", String(primary.r));
  root.style.setProperty("--primary-g", String(primary.g));
  root.style.setProperty("--primary-b", String(primary.b));
  root.style.setProperty("--color-primary", `rgb(${primary.r}, ${primary.g}, ${primary.b})`);
  root.style.setProperty("--color-primary-glow", `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0.25)`);

  root.style.setProperty("--accent-r", String(accent.r));
  root.style.setProperty("--accent-g", String(accent.g));
  root.style.setProperty("--accent-b", String(accent.b));
  root.style.setProperty("--color-accent", `rgb(${accent.r}, ${accent.g}, ${accent.b})`);
  root.style.setProperty("--color-accent-glow", `rgba(${accent.r}, ${accent.g}, ${accent.b}, 0.25)`);

  if (isDark) {
    root.classList.add("dark");
    root.classList.remove("light");
    // Strict Pure Black #000000 Dark Theme (Zero background haze, crisp deep black canvas)
    root.style.setProperty("--bg-app", "#000000");               // Body: #000000
    root.style.setProperty("--bg-page", "#000000");              // Page background: #000000
    root.style.setProperty("--bg-navbar", "#000000");            // Navbar: #000000
    root.style.setProperty("--bg-surface", "#0A0A0A");           // Main Card Interior: #0A0A0A
    root.style.setProperty("--bg-secondary-card", "#0F0F0F");    // Secondary Card: #0F0F0F
    root.style.setProperty("--bg-elevated", "#141414");          // Elevated Card: #141414
    root.style.setProperty("--bg-card-elevated", "#141414");
    root.style.setProperty("--bg-input", "#101010");             // Input: #101010
    root.style.setProperty("--bg-table", "#080808");             // Table: #080808
    root.style.setProperty("--bg-table-header", "#121212");      // Table Header: #121212
    root.style.setProperty("--bg-hover", "rgba(255, 255, 255, 0.04)");
    root.style.setProperty("--text-main", "#F5F5F5");            // Primary Text: #F5F5F5
    root.style.setProperty("--text-muted", "#A3A3A3");           // Secondary Text: #A3A3A3
    root.style.setProperty("--border-subtle", "#242424");        // Border: #242424
    root.style.setProperty("--border-strong", "#333333");
    root.style.setProperty("--table-row-alt", "rgba(18, 18, 18, 0.7)");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
    // Academic Clean Light Theme (#F7F8FC base with crisp white cards)
    root.style.setProperty("--bg-app", "#F7F8FC");
    root.style.setProperty("--bg-page", "#F7F8FC");
    root.style.setProperty("--bg-navbar", "#FFFFFF");
    root.style.setProperty("--bg-surface", "#FFFFFF");
    root.style.setProperty("--bg-secondary-card", "#F8FAFC");
    root.style.setProperty("--bg-elevated", "#F1F4F9");
    root.style.setProperty("--bg-card-elevated", "#FFFFFF");
    root.style.setProperty("--bg-input", "#FFFFFF");
    root.style.setProperty("--bg-table", "#FFFFFF");
    root.style.setProperty("--bg-table-header", "#F1F4F9");
    root.style.setProperty("--bg-hover", "#E8EEF8");
    root.style.setProperty("--text-main", "#111111");
    root.style.setProperty("--text-muted", "#4B5563");
    root.style.setProperty("--border-subtle", "#E2E8F0");
    root.style.setProperty("--border-strong", "#CBD5E1");
    root.style.setProperty("--table-row-alt", "rgba(241, 244, 249, 0.6)");
  }
}
