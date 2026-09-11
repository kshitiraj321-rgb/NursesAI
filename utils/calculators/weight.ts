/**
 * Weight Conversion Calculator — `weight`
 *
 * Clinical question: "Convert patient weight between kg and lbs."
 *
 * Formula:
 * lbs = kg × 2.2046
 * kg = lbs / 2.2046
 *
 * Source: SI System of Units standard conversion factor (1 kg ≈ 2.20462 lbs).
 *
 * Rounding: 2 decimal places.
 *
 * Risk classification: LOW
 *
 * GOVERNANCE: Pure deterministic TypeScript function.
 */

import type { CalcResult, WeightDirection } from "./types";

const CONVERSION_FACTOR = 2.2046;
const MIN_KG = 0.5;
const MAX_KG = 500;
const MIN_LBS = 1.1;
const MAX_LBS = 1102;

export function calcWeightConversion(
  value: number,
  direction: WeightDirection
): CalcResult {
  if (!isFinite(value) || value <= 0) {
    return { ok: false, error: "Weight must be greater than zero." };
  }

  if (direction === "kg_to_lbs") {
    if (value < MIN_KG || value > MAX_KG) {
      return {
        ok: false,
        error: `Weight out of supported range (${MIN_KG} – ${MAX_KG} kg).`,
      };
    }
    const raw = value * CONVERSION_FACTOR;
    const rounded = Math.round(raw * 100) / 100;
    const formulaDisplay = `${value} kg × 2.2046 = ${rounded.toFixed(2)} lbs`;
    return { ok: true, value: rounded, unit: "lbs", formulaDisplay };
  } else {
    if (value < MIN_LBS || value > MAX_LBS) {
      return {
        ok: false,
        error: `Weight out of supported range (${MIN_LBS} – ${MAX_LBS} lbs).`,
      };
    }
    const raw = value / CONVERSION_FACTOR;
    const rounded = Math.round(raw * 100) / 100;
    const formulaDisplay = `${value} lbs ÷ 2.2046 = ${rounded.toFixed(2)} kg`;
    return { ok: true, value: rounded, unit: "kg", formulaDisplay };
  }
}
