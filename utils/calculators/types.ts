/**
 * NurseAI Toolbox — Shared Calculator Types
 *
 * Blueprint V1.1 governance:
 * - All calculations are pure deterministic TypeScript.
 * - AI must NEVER participate in calculation.
 * - CalcResult is the single contract between every calculator and its UI.
 *
 * Warning thresholds in calculators are UX product decisions,
 * not universal clinical safety rules. They are clearly labelled
 * as such in each calculator and must not be presented to the user
 * as clinical thresholds.
 */

/** The only return type a calculator function may produce. */
export type CalcResult =
  | {
      ok: true;
      /** The calculated numeric value, already rounded per spec. */
      value: number;
      /** Unit label for display, e.g. "gtt/min", "mL/hr", "°F" */
      unit: string;
      /**
       * Human-readable formula used, for display below the result.
       * Example: "(1000 mL × 20 gtt/mL) ÷ 480 min = 42 gtt/min"
       */
      formulaDisplay: string;
      /**
       * Optional UX warning — a product decision to alert the user
       * to an unusual value. NOT a clinical safety rule.
       * Must be labelled "Note" or "Notice" in UI, never "Warning" in
       * a way that implies clinical authority.
       */
      warning?: string;
    }
  | {
      ok: false;
      /** User-facing validation error message. */
      error: string;
    };

/** The 4 physical drop factors that exist for IV administration sets. */
export type DropFactor = 10 | 15 | 20 | 60;

/** The 6 unit conversions supported in V1. */
export type NursingConversion =
  | "g_to_mg"
  | "mg_to_g"
  | "mg_to_mcg"
  | "mcg_to_mg"
  | "L_to_mL"
  | "mL_to_L";

/** Temperature conversion direction. */
export type TempDirection = "C_to_F" | "F_to_C";

/** Weight conversion direction. */
export type WeightDirection = "kg_to_lbs" | "lbs_to_kg";
