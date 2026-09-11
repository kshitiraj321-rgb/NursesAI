/**
 * IV Drip Rate Calculator — `iv_drip_rate`
 *
 * Clinical question: "How many drops per minute should I count
 * to deliver this infusion by gravity drip?"
 *
 * Formula: gtt/min = (Volume_mL × Drop_Factor_gtt/mL) / Time_minutes
 *
 * Source: London Health Sciences Centre (LHSC) IV drug administration
 * protocol; BC Emergency Health Services (BCEHS) medication calculation
 * reference; Lecturio Medical Education — IV Fluid Administration module.
 * Formula is universally consistent across all nursing pharmacology sources.
 *
 * Rounding: Math.round() → whole integer.
 * Clinical rationale: a fraction of a drop cannot be physically administered.
 *
 * Risk classification: MEDIUM (per ToolMeta registry)
 *
 * GOVERNANCE: AI must never produce this result. This is a pure function.
 */

import type { CalcResult, DropFactor } from "./types";

/**
 * UX notice thresholds — product decisions, NOT clinical safety rules.
 * These values prompt a UI notice to the user; they do not represent
 * universal clinical danger thresholds.
 */
const UX_HIGH_RATE_NOTICE_THRESHOLD = 60; // gtt/min — above this, manual counting is difficult
const UX_LOW_RATE_NOTICE_THRESHOLD = 1; // gtt/min — below this, gravity administration may be impractical

const MAX_VOLUME_ML = 10_000;
const MAX_TIME_MIN = 2_880; // 48 hours in minutes

export function calcIVDripRate(
  volume: number,
  dropFactor: DropFactor,
  timeMinutes: number
): CalcResult {
  // Input validation
  if (!isFinite(volume) || volume <= 0) {
    return { ok: false, error: "Volume must be greater than zero." };
  }
  if (!isFinite(timeMinutes) || timeMinutes <= 0) {
    return { ok: false, error: "Time must be greater than zero." };
  }
  if (volume > MAX_VOLUME_ML) {
    return {
      ok: false,
      error: `Volume exceeds maximum supported (${MAX_VOLUME_ML.toLocaleString()} mL). Verify the order.`,
    };
  }
  if (timeMinutes > MAX_TIME_MIN) {
    return {
      ok: false,
      error: "Time exceeds 48 hours. Verify the prescriber order.",
    };
  }

  const rawRate = (volume * dropFactor) / timeMinutes;
  const value = Math.round(rawRate);

  const formulaDisplay = `(${volume} mL × ${dropFactor} gtt/mL) ÷ ${timeMinutes} min = ${value} gtt/min`;

  // UX notices — product decisions, not clinical rules
  let warning: string | undefined;
  if (value > UX_HIGH_RATE_NOTICE_THRESHOLD) {
    warning =
      "Rate above 60 gtt/min is difficult to count manually. Consider using an infusion pump where available.";
  } else if (value < UX_LOW_RATE_NOTICE_THRESHOLD) {
    warning =
      "Calculated rate is less than 1 drop/min. Verify the order — this may be too slow for gravity administration.";
  }

  return { ok: true, value, unit: "gtt/min", formulaDisplay, warning };
}
