/**
 * Nursing Metric Unit Conversion Calculator — `unit_conversion`
 *
 * Clinical question: "Convert mass or volume between metric nursing units."
 *
 * Permitted conversions ONLY:
 * 1. g → mg (×1000)
 * 2. mg → g (÷1000)
 * 3. mg → mcg (×1000)
 * 4. mcg → mg (÷1000)
 * 5. L → mL (×1000)
 * 6. mL → L (÷1000)
 *
 * Explicitly Excluded in V1:
 * - mEq ↔ mg (substance-specific, dangerous if generalized)
 * - IU ↔ mg (substance-specific)
 * - Household units (tbsp, tsp, oz)
 * - g ↔ mcg (skips unit, forces careful clinical steps)
 *
 * Risk classification: LOW
 *
 * GOVERNANCE: Pure deterministic TypeScript function.
 */

import type { CalcResult, NursingConversion } from "./types";

const MIN_VALUE = 0.000001;
const MAX_VALUE = 1_000_000;

export function calcUnitConversion(
  value: number,
  conversion: NursingConversion
): CalcResult {
  if (!isFinite(value) || value <= 0) {
    return { ok: false, error: "Value must be greater than zero." };
  }
  if (value < MIN_VALUE) {
    return {
      ok: false,
      error: `Value is below minimum threshold (${MIN_VALUE}).`,
    };
  }
  if (value > MAX_VALUE) {
    return {
      ok: false,
      error: `Value exceeds maximum supported (${MAX_VALUE.toLocaleString()}).`,
    };
  }

  let resultValue: number;
  let targetUnit: string;
  let formulaDisplay: string;

  switch (conversion) {
    case "g_to_mg":
      resultValue = value * 1000;
      targetUnit = "mg";
      formulaDisplay = `${value} g × 1,000 = ${formatMetricResult(resultValue)} mg`;
      break;
    case "mg_to_g":
      resultValue = value / 1000;
      targetUnit = "g";
      formulaDisplay = `${value} mg ÷ 1,000 = ${formatMetricResult(resultValue)} g`;
      break;
    case "mg_to_mcg":
      resultValue = value * 1000;
      targetUnit = "mcg";
      formulaDisplay = `${value} mg × 1,000 = ${formatMetricResult(resultValue)} mcg`;
      break;
    case "mcg_to_mg":
      resultValue = value / 1000;
      targetUnit = "mg";
      formulaDisplay = `${value} mcg ÷ 1,000 = ${formatMetricResult(resultValue)} mg`;
      break;
    case "L_to_mL":
      resultValue = value * 1000;
      targetUnit = "mL";
      formulaDisplay = `${value} L × 1,000 = ${formatMetricResult(resultValue)} mL`;
      break;
    case "mL_to_L":
      resultValue = value / 1000;
      targetUnit = "L";
      formulaDisplay = `${value} mL ÷ 1,000 = ${formatMetricResult(resultValue)} L`;
      break;
    default:
      return { ok: false, error: "Unsupported conversion type." };
  }

  const roundedValue = formatMetricResult(resultValue);
  return { ok: true, value: roundedValue, unit: targetUnit, formulaDisplay };
}

function formatMetricResult(num: number): number {
  // Up to 6 decimal places for high precision sub-milligram numbers without floating point noise
  return Math.round(num * 1_000_000) / 1_000_000;
}
