/**
 * Self-contained direct test runner for Phase 2A (90 Calculator Test Cases)
 *
 * Runs without requiring jest package installation.
 */

import {
  calcIVDripRate,
  calcMLPerHour,
  calcDropsPerMin,
  calcTemperature,
  calcWeightConversion,
  calcUnitConversion,
} from "./index";

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`❌ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
  }
}

console.log("==========================================");
console.log("NurseAI Phase 2A — 90 Test Cases Execution");
console.log("==========================================\n");

// Calculator 1: IV Drip Rate
{
  const r1 = calcIVDripRate(1000, 20, 480);
  assert(r1.ok && r1.value === 42 && !r1.warning, "IV 1: Standard 8-hr bag");

  const r2 = calcIVDripRate(500, 15, 120);
  assert(r2.ok && r2.value === 63 && !!r2.warning, "IV 2: 2-hr infusion warning");

  const r3 = calcIVDripRate(250, 60, 360);
  assert(r3.ok && r3.value === 42, "IV 3: Microdrip 6-hr");

  const r4 = calcIVDripRate(100, 10, 60);
  assert(r4.ok && r4.value === 17, "IV 4: Small vol 1-hr");

  const r5 = calcIVDripRate(1000, 20, 60);
  assert(r5.ok && r5.value === 333 && !!r5.warning, "IV 5: Fast rate warning");

  const r6 = calcIVDripRate(50, 10, 720);
  assert(r6.ok && r6.value === 1, "IV 6: Slow rate");

  const r7 = calcIVDripRate(125.5, 20, 60);
  assert(r7.ok && r7.value === 42, "IV 7: Decimal volume");

  assert(!calcIVDripRate(0, 20, 60).ok, "IV 8: Zero volume");
  assert(!calcIVDripRate(1000, 20, 0).ok, "IV 9: Zero time");
  assert(!calcIVDripRate(1000, 20, -30).ok, "IV 10: Negative time");
  assert(!calcIVDripRate(-500, 20, 60).ok, "IV 11: Negative volume");
  assert(!calcIVDripRate(12000, 20, 480).ok, "IV 12: Volume > 10000");
  assert(!calcIVDripRate(1000, 20, 3000).ok, "IV 13: Time > 2880");

  const r14 = calcIVDripRate(100, 20, 240);
  assert(r14.ok && r14.value === 8, "IV 14: Rounding 0.5");

  const r15 = calcIVDripRate(10, 10, 600);
  assert(r15.ok && r15.value === 0 && !!r15.warning, "IV 15: Rate < 1 warning");
}

// Calculator 2: mL/hr
{
  const r1 = calcMLPerHour(1000, 8);
  assert(r1.ok && r1.value === 125.0, "mL/hr 1: Standard 8-hr");

  const r2 = calcMLPerHour(500, 6);
  assert(r2.ok && r2.value === 83.3, "mL/hr 2: 6-hr");

  const r3 = calcMLPerHour(250, 0.5);
  assert(r3.ok && r3.value === 500.0, "mL/hr 3: 30-min");

  const r4 = calcMLPerHour(100, 1);
  assert(r4.ok && r4.value === 100.0, "mL/hr 4: 1-hr");

  const r5 = calcMLPerHour(1000, 6.5);
  assert(r5.ok && r5.value === 153.8, "mL/hr 5: Decimal time");

  const r6 = calcMLPerHour(50, 12);
  assert(r6.ok && r6.value === 4.2 && !!r6.warning, "mL/hr 6: Low rate warning");

  assert(!calcMLPerHour(0, 8).ok, "mL/hr 7: Zero volume");
  assert(!calcMLPerHour(1000, 0).ok, "mL/hr 8: Zero time");
  assert(!calcMLPerHour(-100, 8).ok, "mL/hr 9: Negative volume");
  assert(!calcMLPerHour(1000, -2).ok, "mL/hr 10: Negative time");

  const r11 = calcMLPerHour(5000, 1);
  assert(r11.ok && r11.value === 5000.0 && !!r11.warning, "mL/hr 11: High rate warning");

  const r12 = calcMLPerHour(1000, 0.25);
  assert(r12.ok && r12.value === 4000.0, "mL/hr 12: Min time boundary");

  assert(!calcMLPerHour(1000, 0.1).ok, "mL/hr 13: Below min time");

  const r14 = calcMLPerHour(333, 4);
  assert(r14.ok && r14.value === 83.3, "mL/hr 14: 1-decimal rounding");
}

// Calculator 3: Drops/Min
{
  const r1 = calcDropsPerMin(125, 20);
  assert(r1.ok && r1.value === 42, "gtt 1: Standard");

  const r2 = calcDropsPerMin(100, 15);
  assert(r2.ok && r2.value === 25, "gtt 2: Macrodrip 15");

  const r3 = calcDropsPerMin(50, 60);
  assert(r3.ok && r3.value === 50, "gtt 3: Microdrip");

  const r4 = calcDropsPerMin(83.3, 20);
  assert(r4.ok && r4.value === 28, "gtt 4: Decimal rate");

  const r5 = calcDropsPerMin(200, 20);
  assert(r5.ok && r5.value === 67 && !!r5.warning, "gtt 5: High rate warning");

  assert(!calcDropsPerMin(0, 20).ok, "gtt 6: Zero rate");
  assert(!calcDropsPerMin(-50, 20).ok, "gtt 7: Negative rate");
  assert(!calcDropsPerMin(1500, 20).ok, "gtt 8: Rate > 1000");

  const r9 = calcDropsPerMin(166.7, 20);
  assert(r9.ok && r9.value === 56, "gtt 9: Rounding");
}

// Calculator 4: Temperature
{
  const r1 = calcTemperature(37.0, "C_to_F");
  assert(r1.ok && r1.value === 98.6, "Temp 1: 37C -> 98.6F");

  const r2 = calcTemperature(98.6, "F_to_C");
  assert(r2.ok && r2.value === 37.0, "Temp 2: 98.6F -> 37C");

  const r3 = calcTemperature(40.0, "C_to_F");
  assert(r3.ok && r3.value === 104.0, "Temp 3: 40C -> 104F");

  const r4 = calcTemperature(0, "C_to_F");
  assert(r4.ok && r4.value === 32.0 && !!r4.warning, "Temp 4: 0C -> 32F");

  assert(!calcTemperature(110, "C_to_F").ok, "Temp 5: Out of range 110C");

  const r6 = calcTemperature(36.5, "C_to_F");
  assert(r6.ok && r6.value === 97.7, "Temp 6: 36.5C");

  const r7 = calcTemperature(34.0, "C_to_F");
  assert(r7.ok && r7.value === 93.2 && !!r7.warning, "Temp 7: Hypothermia warning");

  const r8 = calcTemperature(42.0, "C_to_F");
  assert(r8.ok && r8.value === 107.6, "Temp 8: Extreme fever");

  const r9 = calcTemperature(-50, "C_to_F");
  assert(r9.ok && r9.value === -58.0, "Temp 9: -50C boundary");

  const r10 = calcTemperature(104.0, "F_to_C");
  assert(r10.ok && r10.value === 40.0, "Temp 10: 104F -> 40C");

  const r11 = calcTemperature(32.0, "F_to_C");
  assert(r11.ok && r11.value === 0.0, "Temp 11: 32F -> 0C");

  assert(!calcTemperature(150, "C_to_F").ok, "Temp 12: Out of range 150C");

  const r13 = calcTemperature(36.8, "C_to_F");
  assert(r13.ok && r13.value === 98.2, "Temp 13: 36.8C");
}

// Calculator 5: Weight
{
  const r1 = calcWeightConversion(70, "kg_to_lbs");
  assert(r1.ok && r1.value === 154.32, "Weight 1: 70kg -> 154.32lbs");

  const r2 = calcWeightConversion(154.32, "lbs_to_kg");
  assert(r2.ok && r2.value === 70.0, "Weight 2: 154.32lbs -> 70kg");

  const r3 = calcWeightConversion(1, "kg_to_lbs");
  assert(r3.ok && r3.value === 2.2, "Weight 3: 1kg -> 2.2lbs");

  const r4 = calcWeightConversion(0.5, "kg_to_lbs");
  assert(r4.ok && r4.value === 1.1, "Weight 4: 0.5kg -> 1.1lbs");

  const r5 = calcWeightConversion(2.2046, "lbs_to_kg");
  assert(r5.ok && r5.value === 1.0, "Weight 5: 2.2046lbs -> 1kg");

  assert(!calcWeightConversion(0, "kg_to_lbs").ok, "Weight 6: Zero weight");
  assert(!calcWeightConversion(-10, "kg_to_lbs").ok, "Weight 7: Negative weight");

  const r8 = calcWeightConversion(500, "kg_to_lbs");
  assert(r8.ok && r8.value === 1102.3, "Weight 8: 500kg");

  assert(!calcWeightConversion(600, "kg_to_lbs").ok, "Weight 9: Over max 600kg");

  const r10 = calcWeightConversion(75.5, "kg_to_lbs");
  assert(r10.ok && r10.value === 166.45, "Weight 10: 75.5kg");
}

// Calculator 6: Unit Conversion (15 + 14 = 29 tests)
{
  const r1 = calcUnitConversion(1, "g_to_mg");
  assert(r1.ok && r1.value === 1000, "Unit 1: 1g -> 1000mg");

  const r2 = calcUnitConversion(2.5, "g_to_mg");
  assert(r2.ok && r2.value === 2500, "Unit 2: 2.5g -> 2500mg");

  const r3 = calcUnitConversion(500, "mg_to_g");
  assert(r3.ok && r3.value === 0.5, "Unit 3: 500mg -> 0.5g");

  const r4 = calcUnitConversion(250, "mg_to_g");
  assert(r4.ok && r4.value === 0.25, "Unit 4: 250mg -> 0.25g");

  const r5 = calcUnitConversion(1, "mg_to_mcg");
  assert(r5.ok && r5.value === 1000, "Unit 5: 1mg -> 1000mcg");

  const r6 = calcUnitConversion(250, "mcg_to_mg");
  assert(r6.ok && r6.value === 0.25, "Unit 6: 250mcg -> 0.25mg");

  const r7 = calcUnitConversion(0.001, "mcg_to_mg");
  assert(r7.ok && r7.value === 0.000001, "Unit 7: 0.001mcg");

  const r8 = calcUnitConversion(1, "L_to_mL");
  assert(r8.ok && r8.value === 1000, "Unit 8: 1L -> 1000mL");

  const r9 = calcUnitConversion(500, "mL_to_L");
  assert(r9.ok && r9.value === 0.5, "Unit 9: 500mL -> 0.5L");

  const r10 = calcUnitConversion(2500, "mL_to_L");
  assert(r10.ok && r10.value === 2.5, "Unit 10: 2500mL -> 2.5L");

  assert(!calcUnitConversion(0, "g_to_mg").ok, "Unit 11: Zero");
  assert(!calcUnitConversion(-100, "mg_to_g").ok, "Unit 12: Negative");
  assert(!calcUnitConversion(0.0000001, "g_to_mg").ok, "Unit 13: Below min");
  assert(!calcUnitConversion(2000000, "g_to_mg").ok, "Unit 14: Above max");

  const r15 = calcUnitConversion(0.001, "g_to_mg");
  assert(r15.ok && r15.value === 1, "Unit 15: 0.001g -> 1mg");

  const r16 = calcUnitConversion(0.5, "mg_to_mcg");
  assert(r16.ok && r16.value === 500, "Unit 16: 0.5mg -> 500mcg");

  const r17 = calcUnitConversion(0.75, "L_to_mL");
  assert(r17.ok && r17.value === 750, "Unit 17: 0.75L -> 750mL");

  assert(!calcUnitConversion(NaN, "g_to_mg").ok, "Unit 18: NaN");
  assert(!calcUnitConversion(Infinity, "g_to_mg").ok, "Unit 19: Infinity");
  // @ts-expect-error test invalid enum
  assert(!calcUnitConversion(100, "invalid").ok, "Unit 20: Invalid type");

  const r21 = calcIVDripRate(1000, 10, 600);
  assert(r21.ok && r21.value === 17, "Unit 21: DropFactor 10");

  const r22 = calcIVDripRate(1000, 15, 600);
  assert(r22.ok && r22.value === 25, "Unit 22: DropFactor 15");

  const r23 = calcIVDripRate(1000, 60, 600);
  assert(r23.ok && r23.value === 100, "Unit 23: DropFactor 60");

  const r24 = calcMLPerHour(1000, 72);
  assert(r24.ok && r24.value === 13.9, "Unit 24: 72hr boundary");

  assert(!calcMLPerHour(1000, 73).ok, "Unit 25: 73hr over boundary");

  const r26 = calcTemperature(100, "C_to_F");
  assert(r26.ok && r26.value === 212.0, "Unit 26: 100C");

  const r27 = calcWeightConversion(1102, "lbs_to_kg");
  assert(r27.ok && r27.value === 499.86, "Unit 27: 1102lbs");

  const r28 = calcDropsPerMin(1000, 20);
  assert(r28.ok && r28.value === 333, "Unit 28: 1000 mL/hr");

  const r29 = calcIVDripRate(1000, 20, 480);
  assert(r29.ok && r29.formulaDisplay.includes("1000 mL × 20 gtt/mL"), "Unit 29: Formula string");
}

console.log(`\nResults: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} total tests.`);

if (failed > 0) {
  (globalThis as any).process?.exit(1);
} else {
  console.log("🟢 ALL 90 CALCULATOR TESTS PASSED PERFECTLY!");
  (globalThis as any).process?.exit(0);
}

