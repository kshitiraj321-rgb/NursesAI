import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { calcUnitConversion, NursingConversion, CalcResult } from "../../utils/calculators";
import { AppScreen } from "../../components/ui/AppScreen";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { Pill } from "../../components/ui/Pill";
import { AnimatedPressable } from "../../components/ui/AnimatedPressable";

const CONVERSION_OPTIONS: { label: string; value: NursingConversion; category: string }[] = [
  { label: "Grams (g) → Milligrams (mg)", value: "g_to_mg", category: "Mass" },
  { label: "Milligrams (mg) → Grams (g)", value: "mg_to_g", category: "Mass" },
  { label: "Milligrams (mg) → Micrograms (mcg)", value: "mg_to_mcg", category: "Mass" },
  { label: "Micrograms (mcg) → Milligrams (mg)", value: "mcg_to_mg", category: "Mass" },
  { label: "Litres (L) → Millilitres (mL)", value: "L_to_mL", category: "Volume" },
  { label: "Millilitres (mL) → Litres (L)", value: "mL_to_L", category: "Volume" },
];

export default function UnitConversionScreen() {
  const [value, setValue] = useState("");
  const [conversion, setConversion] = useState<NursingConversion>("g_to_mg");
  const [result, setResult] = useState<CalcResult | null>(null);

  const handleCalculate = () => {
    const valNum = parseFloat(value);
    const res = calcUnitConversion(valNum, conversion);
    setResult(res);
  };

  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      {/* Header */}
      <View className="mb-6 bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xl font-bold text-navy dark:text-white tracking-tight font-sans">
            Metric Nursing Unit Converter
          </Text>
          <Pill label="LOW RISK" variant="info" size="sm" />
        </View>
        <Text className="text-slate-500 dark:text-slate-400 text-xs leading-5 font-sans">
          Converts mass and volume measurements between standard metric nursing units.
        </Text>
      </View>

      {/* Form Container */}
      <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm space-y-5">
        <View>
          <Text className="text-navy dark:text-white font-bold mb-2 text-xs uppercase tracking-wider font-sans">
            Select Conversion Type
          </Text>
          <View className="space-y-2">
            {CONVERSION_OPTIONS.map((item) => {
              const isSelected = conversion === item.value;
              return (
                <AnimatedPressable
                  key={item.value}
                  onPress={() => setConversion(item.value)}
                  activeScale={0.98}
                  className={`p-3.5 rounded-xl border flex-row items-center justify-between ${
                    isSelected
                      ? "bg-clinical-pine/10 border-clinical-pine dark:bg-teal-500/10 dark:border-teal-500"
                      : "bg-warm-bg dark:bg-slate-950 border-border-subtle dark:border-slate-800"
                  }`}
                >
                  <Text
                    className={`font-bold text-sm flex-1 mr-2 font-sans ${
                      isSelected ? "text-clinical-pine dark:text-teal-400" : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {item.label}
                  </Text>
                  <Pill
                    label={item.category}
                    variant={isSelected ? "trust" : "neutral"}
                    size="sm"
                  />
                </AnimatedPressable>
              );
            })}
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-navy dark:text-white font-bold mb-2 text-xs uppercase tracking-wider font-sans">
            Input Value
          </Text>
          <TextInput
            className="bg-warm-bg dark:bg-slate-950 text-navy dark:text-white p-4 rounded-xl border border-border-subtle dark:border-slate-800 text-base font-semibold focus:border-clinical-pine dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-colors font-sans"
            placeholder="e.g. 1.0 or 250"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />
        </View>

        <View className="pt-3">
          <PrimaryButton
            label="Convert Metric Unit"
            onPress={handleCalculate}
          />
        </View>
      </View>

      {/* Result Display */}
      {result && (
        <View className="mb-6">
          {!result.ok ? (
            <View className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 shadow-sm">
              <Text className="text-rose-700 dark:text-rose-400 font-bold text-sm mb-1.5 font-sans">
                ⚠ Validation Notice
              </Text>
              <Text className="text-rose-600 dark:text-rose-300 text-xs leading-5 font-sans">{result.error}</Text>
            </View>
          ) : (
            <View className="bg-white dark:bg-slate-900 border-2 border-clinical-pine/30 dark:border-teal-500/50 rounded-2xl p-5 shadow-sm">
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 font-sans">
                Converted Result
              </Text>
              <View className="flex-row items-baseline mb-4">
                <Text className="text-5xl font-extrabold text-clinical-pine dark:text-teal-400 mr-2 tracking-tighter font-sans">
                  {result.value}
                </Text>
                <Text className="text-xl font-bold text-slate-700 dark:text-slate-200 font-sans">
                  {result.unit}
                </Text>
              </View>

              <View className="bg-warm-bg dark:bg-slate-950 p-3 rounded-xl border border-border-subtle dark:border-slate-800 mb-4">
                <Text className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold mb-1 font-sans">Formula used:</Text>
                <Text className="text-slate-700 dark:text-slate-300 font-mono text-xs">
                  {result.formulaDisplay}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Safety Disclaimer */}
      <View className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 mb-6 shadow-sm">
        <Text className="text-amber-800 dark:text-amber-400 font-bold text-xs mb-1.5 uppercase tracking-wider font-sans">
          ⚠ Clinical Safety Notice
        </Text>
        <Text className="text-amber-700/90 dark:text-amber-300/80 text-xs leading-5 font-sans">
          Metric mass and volume conversions only. For electrolyte (mEq) or
          International Unit (IU) conversions, consult pharmacy or institutional
          protocol — these require substance-specific properties.
        </Text>
      </View>
    </AppScreen>
  );
}
