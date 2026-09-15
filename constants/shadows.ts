/**
 * NurseAI Design System — Elevation Shadows
 *
 * Minimal neutral shadows for light-first clinical aesthetic.
 * Glow effects (glowBlue, glowPurple) have been removed — they
 * conflict with the professional, restrained design direction.
 *
 * USAGE:
 *   style={shadows.card}   — for cards and surfaces
 *   style={shadows.subtle} — for headers/nav
 *   style={shadows.sm}     — legacy/general use
 *   style={shadows.md}     — slightly stronger elevation
 */

export const shadows = {
  /** Very light neutral card shadow — primary card elevation */
  card: {
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  /** Barely-visible surface shadow — headers, tab bar */
  subtle: {
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  /** General-purpose small elevation */
  sm: {
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  /** Medium elevation — modals, bottom sheets */
  md: {
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 5,
  },
};
