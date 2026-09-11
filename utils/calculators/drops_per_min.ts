/**
 * Drops per Minute Calculator — `drops_per_min`
 *
 * Clinical question: "If my pump/infusion rate is X mL/hr, how many drops/min should I count?"
 *
 * Formula: gtt/min = (Rate_mL_hr × Drop_Factor_gtt_mL) / 60
 *
 * Source: Teasdale & universal nursing calculation standard.
 *
 * Rounding: Math.round() → whole integer.
 *
 * Risk classification: MEDIUM (per ToolMeta registry)
 *
 * GOVERNANCE: AI must never produce this result. Pure deterministic code.
 */

import type { CalcResult, DropFactor } from "./types";

const UX_HIGH_RATE_NOTICE_THRESHOLD = 60; // gtt/min
const MAX_RATE_PER_HOUR = 1_000; // mL/hr

export function calcDropsPerMin(
  ratePerHour: number,
  dropFactor: DropFactor
): CalcResult {
  if (!isFinite(ratePerHour) || ratePerHour <= 0) {
    return { ok: false, error: "Rate (mL/hr) must be greater than zero." };
  }
  if (ratePerHour > MAX_RATE_PER_HOUR) {
    return {
      ok: false,
      error: `Rate exceeds maximum supported (${MAX_RATE_PER_HOUR} mL/hr). Verify prescriber order.`,
    };
  }

  const rawRate = (ratePerHour * dropFactor) / 60;
  const value = Math.round(rawRate);

  const formulaDisplay = `(${ratePerHour} mL/hr × ${dropFactor} gtt/mL) ÷ 60 = ${value} gtt/min`;

  let warning: string | undefined;
  if (value > UX_HIGH_RATE_NOTICE_THRESHOLD) {
    warning =
      "Rate above 60 gtt/min is difficult to count manually. Consider using an infusion pump.";
  }

  return { ok: true, value, unit: "gtt/min", formulaDisplay, warning };
}
