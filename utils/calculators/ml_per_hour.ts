/**
 * Infusion Rate (mL/hr) Calculator — `ml_per_hour`
 *
 * Clinical question: "What rate do I set on the infusion pump?"
 *
 * Formula: mL/hr = Volume_mL / Time_hours
 *
 * Source: Mometrix Nursing, Picmonic, Atlantic Emergency Health Services.
 * Universal electronic infusion pump standard.
 *
 * Rounding: 1 decimal place. Infusion pumps display 1 decimal place.
 *
 * Risk classification: MEDIUM (per ToolMeta registry)
 *
 * GOVERNANCE: AI must never produce this result. Pure deterministic code.
 */

import type { CalcResult } from "./types";

/**
 * UX notice thresholds — product decisions, NOT clinical safety rules.
 */
const UX_HIGH_RATE_NOTICE_THRESHOLD = 500; // mL/hr
const UX_LOW_RATE_NOTICE_THRESHOLD = 5; // mL/hr

const MAX_VOLUME_ML = 10_000;
const MAX_TIME_HOURS = 72;
const MIN_TIME_HOURS = 0.25; // 15 minutes

export function calcMLPerHour(volume: number, timeHours: number): CalcResult {
  if (!isFinite(volume) || volume <= 0) {
    return { ok: false, error: "Volume must be greater than zero." };
  }
  if (!isFinite(timeHours) || timeHours <= 0) {
    return { ok: false, error: "Time must be greater than zero." };
  }
  if (timeHours < MIN_TIME_HOURS) {
    return {
      ok: false,
      error: "Minimum supported time is 15 minutes (0.25 hr).",
    };
  }
  if (volume > MAX_VOLUME_ML) {
    return {
      ok: false,
      error: `Volume exceeds maximum supported (${MAX_VOLUME_ML.toLocaleString()} mL).`,
    };
  }
  if (timeHours > MAX_TIME_HOURS) {
    return {
      ok: false,
      error: "Time exceeds 72 hours. Verify prescriber order.",
    };
  }

  const rawRate = volume / timeHours;
  // Round to 1 decimal place
  const value = Math.round(rawRate * 10) / 10;

  const formulaDisplay = `${volume} mL ÷ ${timeHours} hr = ${value.toFixed(1)} mL/hr`;

  // UX notices — product decisions, not clinical safety laws
  let warning: string | undefined;
  if (value > UX_HIGH_RATE_NOTICE_THRESHOLD) {
    warning =
      "Rate above 500 mL/hr is unusually high. Verify prescriber order before programming pump.";
  } else if (value < UX_LOW_RATE_NOTICE_THRESHOLD) {
    warning =
      "Rate below 5 mL/hr requires a precision syringe pump. Verify with pharmacy.";
  }

  return { ok: true, value, unit: "mL/hr", formulaDisplay, warning };
}
