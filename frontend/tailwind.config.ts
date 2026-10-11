import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        space: {
          background: "var(--space-bg)",
          "surface-1": "var(--space-surface-1)",
          "surface-2": "var(--space-surface-2)",
          border: "var(--space-border)",
          "border-subtle": "var(--space-border-subtle)",
          text: "var(--space-text-main)",
          "text-muted": "var(--space-text-muted)",
        },
        nebula: {
          cyan: "var(--nebula-cyan)",
          "cyan-dim": "var(--nebula-cyan-dim)",
        },
        stellar: {
          amber: "var(--stellar-amber)",
        },
        lunar: {
          silver: "var(--lunar-silver)",
        },
        aurora: {
          green: "var(--aurora-green)",
        },
        crimson: {
          deep: "var(--crimson-deep)",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "112": "28rem",
        "128": "32rem",
      },
      boxShadow: {
        "cosmic-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.4), 0 0 1px 1px rgba(56, 189, 248, 0.08)",
        cosmic: "0 8px 32px 0 rgba(0, 0, 0, 0.45), 0 0 1px 1px rgba(56, 189, 248, 0.15)",
        "cosmic-lg": "0 16px 48px -4px rgba(0, 0, 0, 0.6), 0 0 2px 1px rgba(56, 189, 248, 0.25)",
        "glow-cyan": "0 0 20px -2px rgba(56, 189, 248, 0.4)",
        "glow-amber": "0 0 20px -2px rgba(245, 158, 11, 0.4)",
      },
      backdropBlur: {
        glass: "12px",
        "glass-heavy": "20px",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 10px rgba(56, 189, 248, 0.6))" },
          "50%": { opacity: "0.6", filter: "drop-shadow(0 0 4px rgba(56, 189, 248, 0.2))" },
        },
        orbit: {
          from: { transform: "rotate(0deg) translateX(12px) rotate(0deg)" },
          to: { transform: "rotate(360deg) translateX(12px) rotate(-360deg)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        orbit: "orbit 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
