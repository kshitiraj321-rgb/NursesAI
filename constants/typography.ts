/**
 * NurseAI Design System — Typography Tokens
 *
 * Configured using @expo-google-fonts/inter font family loaded in app/_layout.tsx:
 * - Inter_400Regular
 * - Inter_500Medium
 * - Inter_600SemiBold
 * - Inter_700Bold
 */

export const typography = {
  fontFamily: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
  },
  roles: {
    display: {
      fontSize: 32,
      lineHeight: 38,
      letterSpacing: -0.8,
      fontFamily: "Inter_700Bold",
    },
    h1: {
      fontSize: 24,
      lineHeight: 28,
      fontFamily: "Inter_700Bold",
    },
    h2: {
      fontSize: 18,
      lineHeight: 23,
      fontFamily: "Inter_600SemiBold",
    },
    h3: {
      fontSize: 16,
      lineHeight: 22,
      fontFamily: "Inter_500Medium",
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: "Inter_400Regular",
    },
    bodySecondary: {
      fontSize: 14,
      lineHeight: 21,
      fontFamily: "Inter_400Regular",
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontFamily: "Inter_500Medium",
    },
    // Preserving legacy roles for compatibility
    bodyMedium: {
      fontSize: 15,
      lineHeight: 22,
      fontFamily: "Inter_500Medium",
    },
    bodySmall: {
      fontSize: 13,
      lineHeight: 18,
      fontFamily: "Inter_400Regular",
    },
    label: {
      fontSize: 11,
      lineHeight: 14,
      letterSpacing: 0.5,
      fontFamily: "Inter_700Bold",
    },
    button: {
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.2,
      fontFamily: "Inter_700Bold",
    },
    metric: {
      fontSize: 28,
      lineHeight: 34,
      fontFamily: "Inter_700Bold",
    },
  },
};
