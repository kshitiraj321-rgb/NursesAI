/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['PlusJakartaSans_400Regular', 'sans-serif'],
        medium: ['PlusJakartaSans_500Medium', 'sans-serif'],
        semibold: ['PlusJakartaSans_600SemiBold', 'sans-serif'],
        bold: ['PlusJakartaSans_700Bold', 'sans-serif'],
        inter: ['Inter_400Regular', 'sans-serif'],
      },
      colors: {
        // ─── NurseAI Semantic Design Tokens ─────────────────────────────
        /** Page background — Oatmeal */
        "warm-bg": "#FAF9F6",
        /** Card/surface — Pure White */
        "surface": "#FFFFFF",
        /** Primary text — Midnight */
        "navy": "#1E293B",
        /** Secondary text — Slate */
        "slate-body": "#64748B",
        /** Tertiary/muted */
        "muted": "#94A3B8",
        /** Border — subtle divider */
        "border-subtle": "#E5E9F0",
        /** Border — interactive focus */
        "border-active": "#99F6E4",

        // ─── Brand Accent Tokens ─────────────────────────────────────────
        /** Primary brand — Deep Pine */
        "clinical-pine": {
          DEFAULT: "#134E4A",
          pressed: "#0F3D3A",
          light: "#F0FDF4",
          border: "#86EFAC",
        },
        /** Primary action — Soft Teal */
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
