/**
 * NurseAI Design System — Color Palette
 *
 * Semantic token source of truth for the entire application.
 *
 * USAGE RULES:
 * - Import from this file for any inline style={} usage.
 * - Prefer NativeWind semantic utility classes (defined in tailwind.config.js)
 *   over raw hex values in className strings.
 * - Light mode is the default (base). Dark mode is supported via dark: modifiers.
 * - Do NOT scatter raw hex literals throughout application code.
 *
 * TOKEN HIERARCHY:
 *   colors.light.*  — light theme semantic roles
 *   colors.dark.*   — dark theme semantic roles
 *   colors.brand.*  — brand accent palette (use sparingly)
 *   colors.semantic.* — status/feedback colors
 *
 * DEPRECATED (kept for legacy consumer compatibility — do not use in new code):
 *   colors.bg.*
 *   colors.text.*
 *   colors.border.*
 */

export const colors = {
  // ─── Light Theme Semantic Tokens ──────────────────────────────────────────
  light: {
    /** Page/screen background — Oatmeal */
    bg: "#FAF9F6",
    /** Card/surface background — Pure White */
    surface: "#FFFFFF",
    /** Primary text — Midnight */
    textPrimary: "#1E293B",
    /** Secondary text — Slate */
    textSecondary: "#64748B",
    /** Tertiary/muted text — for captions, metadata */
    textMuted: "#94A3B8",
    /** Subtle divider and card border */
    border: "#E5E9F0",
    /** Interactive element border (focus/hover) */
    borderInteractive: "#99F6E4",
  },

  // ─── Dark Theme Semantic Tokens ────────────────────────────────────────────
  dark: {
    /** Page/screen background */
    bg: "#0A0F1C",
    /** Card/surface background */
    surface: "#1E293B",
    /** Primary text */
    textPrimary: "#F8FAFC",
    /** Secondary text */
    textSecondary: "#94A3B8",
    /** Tertiary/muted text */
    textMuted: "#64748B",
    /** Subtle divider and card border */
    border: "#334155",
    /** Interactive element border */
    borderInteractive: "#0D9488",
  },

  // ─── Brand Palette ─────────────────────────────────────────────────────────
  brand: {
    /** Primary action — Deep Pine */
    primary: "#134E4A",
    /** Primary action hover/pressed */
    primaryPressed: "#0F3D3A",
    /** Secondary accent — Soft Teal */
    secondary: "#0D9488",
    /** Secondary accent hover/pressed */
    secondaryPressed: "#0F766E",
  },

  // ─── Semantic / Status Colors ──────────────────────────────────────────────
  semantic: {
    success: "#10B981",
    successBg: "#ECFDF5",
    successBorder: "#A7F3D0",
    warning: "#F59E0B",
    warningBg: "#FFFBEB",
    warningBorder: "#FDE68A",
    error: "#E11D48",
    errorBg: "#FFF1F2",
    errorBorder: "#FECACA",
    info: "#0D9488",
    infoBg: "#F0FDFA",
    infoBorder: "#99F6E4",
  },

  // ─── Legacy Namespaces (deprecated — for backward-compat only) ─────────────
  // These exist solely to prevent breaking existing consumers.
  // Do NOT use in new code. Use colors.light.* or colors.brand.* instead.
  bg: {
    base: "#0F172A",
    surface: "#1E293B",
    elevated: "#1E293B",
    glass: "rgba(255, 255, 255, 0.05)",
    glassDark: "rgba(15, 23, 42, 0.85)",
  },
  text: {
    primary: "#F8FAFC",
    secondary: "#94A3B8",
    tertiary: "#64748B",
    inverse: "#0F172A",
  },
  border: {
    subtle: "#334155",
    active: "#2563EB",
    success: "#10B981",
    error: "#EF4444",
    ai: "#0EA5E9",
  },
};
