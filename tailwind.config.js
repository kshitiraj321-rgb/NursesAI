/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter_400Regular', 'sans-serif'],
      },
      colors: {
        // ─── NurseAI Semantic Design Tokens ─────────────────────────────
        // These map to colors.ts tokens and allow semantic NativeWind
        // classes (e.g. bg-surface, text-navy, border-subtle) instead
        // of scattered raw hex values.

        /** Page background — warm off-white */
        "warm-bg": "#F7F8FA",
        /** Card/surface — white */
        "surface": "#FFFFFF",
        /** Primary text — deep navy */
        "navy": "#0E1E3A",
        /** Secondary text — muted slate */
        "slate-body": "#475569",
        /** Tertiary/muted — captions, metadata */
        "muted": "#94A3B8",
        /** Border — subtle divider */
        "border-subtle": "#E5E9F0",
        /** Border — interactive focus */
        "border-active": "#BFDBFE",

        // ─── Brand Accent Tokens ─────────────────────────────────────────
        /** Primary action — professional blue */
        "clinical-blue": {
          DEFAULT: "#2563EB",
          pressed: "#1D4ED8",
          light: "#EFF6FF",
          border: "#BFDBFE",
        },
        /** Secondary accent — muted teal */
        "clinical-teal": {
          DEFAULT: "#0D9488",
          pressed: "#0F766E",
          light: "#F0FDFA",
          border: "#99F6E4",
        },
      },
    },
  },
  plugins: [],
}
