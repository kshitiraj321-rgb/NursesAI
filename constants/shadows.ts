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
    shadowColor: "#0E1E3A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  /** Barely-visible surface shadow — headers, tab bar */
  subtle: {
    shadowColor: "#0E1E3A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  /** General-purpose small elevation */
  sm: {
    shadowColor: "#0E1E3A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  /** Medium elevation — modals, bottom sheets */
  md: {
    shadowColor: "#0E1E3A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
};
