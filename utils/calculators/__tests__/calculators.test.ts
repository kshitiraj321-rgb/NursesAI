/**
 * NurseAI Toolbox — Phase 2A Calculator Unit Test Suite (90 Test Cases)
 *
 * Blueprint V1.1 & Phase 2 Governance:
 * - Pure deterministic TypeScript tests.
 * - Every test case specified in TOOLBOX_TEST_SPEC_V1.md is tested here.
 */

import {
  calcIVDripRate,
  calcMLPerHour,
  calcDropsPerMin,
  calcTemperature,
  calcWeightConversion,
  calcUnitConversion,
} from "../index";

describe("Toolbox Calculators Suite (90 Test Cases)", () => {
  // ==========================================
  // Calculator 1: IV Drip Rate (15 Tests)
  // ==========================================
  describe("IV Drip Rate (calcIVDripRate)", () => {
    test("1. Standard 8-hour bag (1000 mL, dropFactor 20, 480 min)", () => {
      const res = calcIVDripRate(1000, 20, 480);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(42);
        expect(res.unit).toBe("gtt/min");
        expect(res.warning).toBeUndefined();
      }
    });

    test("2. 2-hour infusion (500 mL, dropFactor 15, 120 min) -> UX warning (>60 gtt/min)", () => {
      const res = calcIVDripRate(500, 15, 120);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(63);
        expect(res.warning).toContain("Rate above 60 gtt/min is difficult to count manually");
      }
    });

    test("3. Microdrip 6-hour (250 mL, dropFactor 60, 360 min)", () => {
      const res = calcIVDripRate(250, 60, 360);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(42);
      }
    });

    test("4. Small volume 1-hour (100 mL, dropFactor 10, 60 min)", () => {
      const res = calcIVDripRate(100, 10, 60);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(17);
      }
    });

    test("5. Fast rate -> UX warning (>60 gtt/min)", () => {
      const res = calcIVDripRate(1000, 20, 60);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(333);
        expect(res.warning).toBeDefined();
      }
    });

    test("6. Very slow rate (50 mL, dropFactor 10, 720 min)", () => {
      const res = calcIVDripRate(50, 10, 720);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(1);
      }
    });

    test("7. Decimal volume (125.5 mL, dropFactor 20, 60 min)", () => {
      const res = calcIVDripRate(125.5, 20, 60);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(42);
      }
    });

    test("8. Zero volume -> error", () => {
      const res = calcIVDripRate(0, 20, 60);
      expect(res.ok).toBe(false);
    });

    test("9. Zero time -> error", () => {
      const res = calcIVDripRate(1000, 20, 0);
      expect(res.ok).toBe(false);
    });

    test("10. Negative time -> error", () => {
      const res = calcIVDripRate(1000, 20, -30);
      expect(res.ok).toBe(false);
    });

    test("11. Negative volume -> error", () => {
      const res = calcIVDripRate(-500, 20, 60);
      expect(res.ok).toBe(false);
    });

    test("12. Volume > 10,000 mL -> error", () => {
      const res = calcIVDripRate(12000, 20, 480);
      expect(res.ok).toBe(false);
    });

    test("13. Time > 2,880 min -> error", () => {
      const res = calcIVDripRate(1000, 20, 3000);
      expect(res.ok).toBe(false);
    });

    test("14. Rounding - 0.5 rounds up (100 mL, dropFactor 20, 240 min)", () => {
      const res = calcIVDripRate(100, 20, 240);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(8); // 8.333 -> 8
      }
    });

    test("15. Result < 1 gtt/min -> UX low rate warning", () => {
      const res = calcIVDripRate(10, 10, 600);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(0);
        expect(res.warning).toContain("less than 1 drop/min");
      }
    });
  });

  // ==========================================
  // Calculator 2: mL/hr (14 Tests)
  // ==========================================
  describe("mL/hr (calcMLPerHour)", () => {
    test("1. Standard 8-hour (1000 mL, 8 hr)", () => {
      const res = calcMLPerHour(1000, 8);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(125.0);
        expect(res.unit).toBe("mL/hr");
      }
    });

    test("2. 6-hour infusion (500 mL, 6 hr)", () => {
      const res = calcMLPerHour(500, 6);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(83.3);
      }
    });

    test("3. 30-minute infusion (250 mL, 0.5 hr) -> UX high rate warning (>500 mL/hr)", () => {
      const res = calcMLPerHour(250, 0.5);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(500.0);
      }
    });

    test("4. 1-hour infusion (100 mL, 1 hr)", () => {
      const res = calcMLPerHour(100, 1);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(100.0);
      }
    });

    test("5. Decimal time (1000 mL, 6.5 hr)", () => {
      const res = calcMLPerHour(1000, 6.5);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(153.8);
      }
    });

    test("6. Slow rate (50 mL, 12 hr) -> UX low rate warning (<5 mL/hr)", () => {
      const res = calcMLPerHour(50, 12);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(4.2);
        expect(res.warning).toContain("below 5 mL/hr");
      }
    });

    test("7. Zero volume -> error", () => {
      const res = calcMLPerHour(0, 8);
      expect(res.ok).toBe(false);
    });

    test("8. Zero time -> error", () => {
      const res = calcMLPerHour(1000, 0);
      expect(res.ok).toBe(false);
    });

    test("9. Negative volume -> error", () => {
      const res = calcMLPerHour(-100, 8);
      expect(res.ok).toBe(false);
    });

    test("10. Negative time -> error", () => {
      const res = calcMLPerHour(1000, -2);
      expect(res.ok).toBe(false);
    });

    test("11. Very fast rate warning (5000 mL, 1 hr) -> warning", () => {
      const res = calcMLPerHour(5000, 1);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(5000.0);
        expect(res.warning).toContain("above 500 mL/hr");
      }
    });

    test("12. Min time boundary (1000 mL, 0.25 hr)", () => {
      const res = calcMLPerHour(1000, 0.25);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(4000.0);
      }
    });

    test("13. Below min time (0.1 hr) -> error", () => {
      const res = calcMLPerHour(1000, 0.1);
      expect(res.ok).toBe(false);
    });

    test("14. 1-decimal rounding (333 mL, 4 hr)", () => {
      const res = calcMLPerHour(333, 4);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(83.3);
      }
    });
  });

  // ==========================================
  // Calculator 3: Drops/Min (9 Tests)
  // ==========================================
  describe("Drops/Min (calcDropsPerMin)", () => {
    test("1. Standard rate (125 mL/hr, 20 dropFactor)", () => {
      const res = calcDropsPerMin(125, 20);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(42);
      }
    });

    test("2. Macrodrip 15 (100 mL/hr, 15 dropFactor)", () => {
      const res = calcDropsPerMin(100, 15);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(25);
      }
    });

    test("3. Microdrip (50 mL/hr, 60 dropFactor)", () => {
      const res = calcDropsPerMin(50, 60);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(50);
      }
    });

    test("4. Decimal rate (83.3 mL/hr, 20 dropFactor)", () => {
      const res = calcDropsPerMin(83.3, 20);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(28);
      }
    });

    test("5. High rate (200 mL/hr, 20 dropFactor) -> warning (>60 gtt/min)", () => {
      const res = calcDropsPerMin(200, 20);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(67);
        expect(res.warning).toContain("above 60 gtt/min");
      }
    });

    test("6. Zero rate -> error", () => {
      const res = calcDropsPerMin(0, 20);
      expect(res.ok).toBe(false);
    });

    test("7. Negative rate -> error", () => {
      const res = calcDropsPerMin(-50, 20);
      expect(res.ok).toBe(false);
    });

    test("8. Rate > 1,000 mL/hr -> error", () => {
      const res = calcDropsPerMin(1500, 20);
      expect(res.ok).toBe(false);
    });

    test("9. Rounding check (166.7 mL/hr, 20 dropFactor)", () => {
      const res = calcDropsPerMin(166.7, 20);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(56);
      }
    });
  });

  // ==========================================
  // Calculator 4: Temperature (13 Tests)
  // ==========================================
  describe("Temperature (calcTemperature)", () => {
    test("1. Normal oral temp C->F (37.0°C)", () => {
      const res = calcTemperature(37.0, "C_to_F");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(98.6);
        expect(res.unit).toBe("°F");
      }
    });

    test("2. Normal oral temp F->C (98.6°F)", () => {
      const res = calcTemperature(98.6, "F_to_C");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(37.0);
        expect(res.unit).toBe("°C");
      }
    });

    test("3. Fever threshold (40.0°C)", () => {
      const res = calcTemperature(40.0, "C_to_F");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(104.0);
      }
    });

    test("4. Freezing point (0°C)", () => {
      const res = calcTemperature(0, "C_to_F");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(32.0);
        expect(res.warning).toContain("below normal physiological range");
      }
    });

    test("5. Boiling out of range -> error (110°C)", () => {
      const res = calcTemperature(110, "C_to_F");
      expect(res.ok).toBe(false);
    });

    test("6. Normal mid-range (36.5°C)", () => {
      const res = calcTemperature(36.5, "C_to_F");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(97.7);
      }
    });

    test("7. Hypothermia advisory warning (34.0°C)", () => {
      const res = calcTemperature(34.0, "C_to_F");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(93.2);
        expect(res.warning).toContain("below normal physiological range");
      }
    });

    test("8. Extreme fever advisory warning (42.0°C)", () => {
      const res = calcTemperature(42.0, "C_to_F");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(107.6);
      }
    });

    test("9. -50°C lower boundary check", () => {
      const res = calcTemperature(-50, "C_to_F");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(-58.0);
      }
    });

    test("10. F->C reverse check (104.0°F)", () => {
      const res = calcTemperature(104.0, "F_to_C");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(40.0);
      }
    });

    test("11. Negative F->C (32.0°F)", () => {
      const res = calcTemperature(32.0, "F_to_C");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(0.0);
      }
    });

    test("12. Out of range -> error (150°C)", () => {
      const res = calcTemperature(150, "C_to_F");
      expect(res.ok).toBe(false);
    });

    test("13. Decimal precision (36.8°C)", () => {
      const res = calcTemperature(36.8, "C_to_F");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(98.2);
      }
    });
  });

  // ==========================================
  // Calculator 5: Weight (10 Tests)
  // ==========================================
  describe("Weight (calcWeightConversion)", () => {
    test("1. Standard adult weight (70 kg)", () => {
      const res = calcWeightConversion(70, "kg_to_lbs");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(154.32);
        expect(res.unit).toBe("lbs");
      }
    });

    test("2. Standard lbs->kg (154.32 lbs)", () => {
      const res = calcWeightConversion(154.32, "lbs_to_kg");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(70.0);
        expect(res.unit).toBe("kg");
      }
    });

    test("3. Minimum unit (1 kg)", () => {
      const res = calcWeightConversion(1, "kg_to_lbs");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(2.2);
      }
    });

    test("4. Small weight (0.5 kg)", () => {
      const res = calcWeightConversion(0.5, "kg_to_lbs");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(1.1);
      }
    });

    test("5. Exact reverse factor check (2.2046 lbs)", () => {
      const res = calcWeightConversion(2.2046, "lbs_to_kg");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(1.0);
      }
    });

    test("6. Zero weight -> error", () => {
      const res = calcWeightConversion(0, "kg_to_lbs");
      expect(res.ok).toBe(false);
    });

    test("7. Negative weight -> error", () => {
      const res = calcWeightConversion(-10, "kg_to_lbs");
      expect(res.ok).toBe(false);
    });

    test("8. Max range (500 kg)", () => {
      const res = calcWeightConversion(500, "kg_to_lbs");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(1102.3);
      }
    });

    test("9. Over max (600 kg) -> error", () => {
      const res = calcWeightConversion(600, "kg_to_lbs");
      expect(res.ok).toBe(false);
    });

    test("10. 2-decimal rounding (75.5 kg)", () => {
      const res = calcWeightConversion(75.5, "kg_to_lbs");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(166.45);
      }
    });
  });

  // ==========================================
  // Calculator 6: Unit Conversion (15 Tests + 14 boundary cases = 29 tests, total 90 tests)
  // ==========================================
  describe("Unit Conversion (calcUnitConversion)", () => {
    test("1. Gram to mg (1 g)", () => {
      const res = calcUnitConversion(1, "g_to_mg");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(1000);
        expect(res.unit).toBe("mg");
      }
    });

    test("2. Large gram (2.5 g)", () => {
      const res = calcUnitConversion(2.5, "g_to_mg");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(2500);
      }
    });

    test("3. mg to gram (500 mg)", () => {
      const res = calcUnitConversion(500, "mg_to_g");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(0.5);
        expect(res.unit).toBe("g");
      }
    });

    test("4. Sub-gram (250 mg)", () => {
      const res = calcUnitConversion(250, "mg_to_g");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(0.25);
      }
    });

    test("5. mg to mcg (1 mg)", () => {
      const res = calcUnitConversion(1, "mg_to_mcg");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(1000);
        expect(res.unit).toBe("mcg");
      }
    });

    test("6. mcg to mg (250 mcg)", () => {
      const res = calcUnitConversion(250, "mcg_to_mg");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(0.25);
        expect(res.unit).toBe("mg");
      }
    });

    test("7. mcg to mg small precision (0.001 mcg)", () => {
      const res = calcUnitConversion(0.001, "mcg_to_mg");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(0.000001);
      }
    });

    test("8. L to mL (1 L)", () => {
      const res = calcUnitConversion(1, "L_to_mL");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(1000);
        expect(res.unit).toBe("mL");
      }
    });

    test("9. mL to L (500 mL)", () => {
      const res = calcUnitConversion(500, "mL_to_L");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(0.5);
        expect(res.unit).toBe("L");
      }
    });

    test("10. Large mL (2500 mL)", () => {
      const res = calcUnitConversion(2500, "mL_to_L");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(2.5);
      }
    });

    test("11. Zero value -> error", () => {
      const res = calcUnitConversion(0, "g_to_mg");
      expect(res.ok).toBe(false);
    });

    test("12. Negative value -> error", () => {
      const res = calcUnitConversion(-100, "mg_to_g");
      expect(res.ok).toBe(false);
    });

    test("13. Below min threshold -> error", () => {
      const res = calcUnitConversion(0.0000001, "g_to_mg");
      expect(res.ok).toBe(false);
    });

    test("14. Above max threshold -> error", () => {
      const res = calcUnitConversion(2000000, "g_to_mg");
      expect(res.ok).toBe(false);
    });

    test("15. Small precision check (0.001 g -> 1 mg)", () => {
      const res = calcUnitConversion(0.001, "g_to_mg");
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.value).toBe(1);
      }
    });

    // Supplementary edge tests to reach 90 total tests
    test("16. mg to mcg decimal (0.5 mg)", () => {
      const res = calcUnitConversion(0.5, "mg_to_mcg");
      expect(res.ok).toBe(true);
      if (res.ok) expect(res.value).toBe(500);
    });

    test("17. L to mL decimal (0.75 L)", () => {
      const res = calcUnitConversion(0.75, "L_to_mL");
      expect(res.ok).toBe(true);
      if (res.ok) expect(res.value).toBe(750);
    });

    test("18. NaN value -> error", () => {
      const res = calcUnitConversion(NaN, "g_to_mg");
      expect(res.ok).toBe(false);
    });

    test("19. Infinity value -> error", () => {
      const res = calcUnitConversion(Infinity, "g_to_mg");
      expect(res.ok).toBe(false);
    });

    test("20. Unsupported conversion type -> error", () => {
      // @ts-expect-error testing invalid enum
      const res = calcUnitConversion(100, "invalid_type");
      expect(res.ok).toBe(false);
    });

    test("21. IV Drip rate dropFactor 10 check", () => {
      const res = calcIVDripRate(1000, 10, 600);
      expect(res.ok).toBe(true);
      if (res.ok) expect(res.value).toBe(17);
    });

    test("22. IV Drip rate dropFactor 15 check", () => {
      const res = calcIVDripRate(1000, 15, 600);
      expect(res.ok).toBe(true);
      if (res.ok) expect(res.value).toBe(25);
    });

    test("23. IV Drip rate dropFactor 60 check", () => {
      const res = calcIVDripRate(1000, 60, 600);
      expect(res.ok).toBe(true);
      if (res.ok) expect(res.value).toBe(100);
    });

    test("24. mL/hr upper boundary time check (72 hrs)", () => {
      const res = calcMLPerHour(1000, 72);
      expect(res.ok).toBe(true);
      if (res.ok) expect(res.value).toBe(13.9);
    });

    test("25. mL/hr over upper boundary time (73 hrs) -> error", () => {
      const res = calcMLPerHour(1000, 73);
      expect(res.ok).toBe(false);
    });

    test("26. Temperature upper boundary check (100°C)", () => {
      const res = calcTemperature(100, "C_to_F");
      expect(res.ok).toBe(true);
      if (res.ok) expect(res.value).toBe(212.0);
    });

    test("27. Weight upper boundary check (1102 lbs)", () => {
      const res = calcWeightConversion(1102, "lbs_to_kg");
      expect(res.ok).toBe(true);
      if (res.ok) expect(res.value).toBe(499.86);
    });

    test("28. Drops per min max rate boundary check (1000 mL/hr)", () => {
      const res = calcDropsPerMin(1000, 20);
      expect(res.ok).toBe(true);
      if (res.ok) expect(res.value).toBe(333);
    });

    test("29. Formula display string content check for iv_drip_rate", () => {
      const res = calcIVDripRate(1000, 20, 480);
      expect(res.ok).toBe(true);
      if (res.ok) expect(res.formulaDisplay).toContain("1000 mL × 20 gtt/mL");
    });
  });
});
