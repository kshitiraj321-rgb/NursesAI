/**
 * NurseAI Design System — Color Palette
 *
 * Light mode default with low-strain dark mode, enforcing semantic roles.
 */

export const colors = {
  light: {
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    border: "#E2E8F0",
  },
  dark: {
    bg: "#0F172A",
    surface: "#1E293B",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    border: "#334155",
  },
  brand: {
    primary: "#4F46E5",
    secondary: "#64748B",
    success: "#10B981",
    danger: "#F43F5E",
    warning: "#F59E0B",
    interactive: "#0EA5E9",
  },
  // Preserving legacy contract structure to prevent breaking existing consumers not using NativeWind classes
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
    active: "#4F46E5",
    success: "#10B981",
    error: "#F43F5E",
    ai: "#0EA5E9",
  },
};
