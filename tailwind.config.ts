import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#060B14",
          900: "#0B121F",
          850: "#0F1A2B",
          800: "#131F33",
          700: "#1B2A44",
          600: "#28395A",
        },
        ink: {
          100: "#EAF0FB",
          300: "#AEBBD4",
          500: "#7A8BAC",
        },
        volt: {
          400: "#7CF5C4",
          500: "#3DE8A0",
          600: "#22C285",
        },
        amp: {
          400: "#5FD4FF",
          500: "#2BB6F0",
        },
        warn: {
          400: "#FFC15E",
          500: "#F5A623",
        },
        danger: {
          400: "#FF6E6E",
          500: "#F03D3D",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(61,232,160,0.15), 0 8px 30px -8px rgba(61,232,160,0.25)",
        card: "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 24px -14px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        flow: {
          "0%": { strokeDashoffset: "24" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        flow: "flow 1s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
