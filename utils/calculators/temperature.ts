/**
 * Temperature Conversion Calculator — `temperature`
 *
 * Clinical question: "Convert patient temperature between Celsius and Fahrenheit."
 *
 * Formulas:
 * °F = (°C × 9/5) + 32
 * °C = (°F − 32) × 5/9
 *
 * Sourced from SI System of Units mathematical identities.
 *
 * Rounding: 1 decimal place.
 *
 * Risk classification: LOW
 *
 * GOVERNANCE: Pure deterministic TypeScript function.
 */

import type { CalcResult, TempDirection } from "./types";

const MIN_C = -50;
const MAX_C = 100;
const MIN_F = -58;
const MAX_F = 212;

export function calcTemperature(
  value: number,
  direction: TempDirection
): CalcResult {
  if (!isFinite(value)) {
    return { ok: false, error: "Please enter a valid numeric temperature." };
  }

  if (direction === "C_to_F") {
    if (value < MIN_C || value > MAX_C) {
      return {
        ok: false,
        error: "Enter a clinically plausible temperature (−50°C to 100°C).",
      };
    }
    const converted = (value * 9) / 5 + 32;
    const rounded = Math.round(converted * 10) / 10;
    const formulaDisplay = `(${value}°C × 9/5) + 32 = ${rounded.toFixed(1)}°F`;

    let warning: string | undefined;
    if (value < 35) {
      warning = "This temperature is below normal physiological range for humans (<35°C / 95°F).";
    } else if (value > 42) {
      warning = "This temperature is above normal physiological range (>42°C / 107.6°F) and may represent a medical emergency.";
    }

    return { ok: true, value: rounded, unit: "°F", formulaDisplay, warning };
  } else {
    if (value < MIN_F || value > MAX_F) {
      return {
        ok: false,
        error: "Enter a clinically plausible temperature (−58°F to 212°F).",
      };
    }
    const converted = ((value - 32) * 5) / 9;
    const rounded = Math.round(converted * 10) / 10;
    const formulaDisplay = `(${value}°F − 32) × 5/9 = ${rounded.toFixed(1)}°C`;

    let warning: string | undefined;
    if (rounded < 35) {
      warning = "This temperature is below normal physiological range for humans (<35°C / 95°F).";
    } else if (rounded > 42) {
      warning = "This temperature is above normal physiological range (>42°C / 107.6°F) and may represent a medical emergency.";
    }

    return { ok: true, value: rounded, unit: "°C", formulaDisplay, warning };
  }
}
