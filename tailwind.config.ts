import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          purple: "#7C3AED",
          "purple-light": "#A78BFA",
          gold: "#F59E0B",
          "gold-light": "#FCD34D",
          red: "#DC2626",
          "red-light": "#FCA5A5",
          blue: "#1D4ED8",
          "blue-light": "#60A5FA",
          green: "#059669",
          "green-light": "#6EE7B7",
          dark: "#0A0A0F",
          "dark-2": "#0F0F1A",
          "dark-3": "#141428",
          "dark-4": "#1A1A35",
          surface: "#1E1E3A",
          "surface-2": "#252545",
          border: "#2D2D55",
          text: "#E2E8F0",
          "text-muted": "#94A3B8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)",
        "glow-purple": "radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, transparent 70%)",
        "glow-gold": "radial-gradient(ellipse at center, rgba(245,158,11,0.2) 0%, transparent 70%)",
        "hero-gradient": "linear-gradient(135deg, #0A0A0F 0%, #141428 50%, #0A0A0F 100%)",
      },
      boxShadow: {
        "glow-purple": "0 0 30px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.15)",
        "glow-gold": "0 0 20px rgba(245,158,11,0.4), 0 0 40px rgba(245,158,11,0.15)",
        "glow-red": "0 0 20px rgba(220,38,38,0.4)",
        "glow-green": "0 0 20px rgba(5,150,105,0.4)",
        "glass": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "scan-line": "scan-line 4s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "matrix-rain": "matrix-rain 2s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.02)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
