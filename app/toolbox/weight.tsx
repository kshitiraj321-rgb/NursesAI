import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { calcWeightConversion, WeightDirection, CalcResult } from "../../utils/calculators";
import { AppScreen } from "../../components/ui/AppScreen";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { Pill } from "../../components/ui/Pill";
import { AnimatedPressable } from "../../components/ui/AnimatedPressable";

export default function WeightScreen() {
  const [value, setValue] = useState("");
  const [direction, setDirection] = useState<WeightDirection>("kg_to_lbs");
  const [result, setResult] = useState<CalcResult | null>(null);

  const handleCalculate = () => {
    const valNum = parseFloat(value);
    const res = calcWeightConversion(valNum, direction);
    setResult(res);
  };

  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      {/* Header */}
      <View className="mb-6 bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xl font-bold text-navy dark:text-white tracking-tight">
            Weight Unit Converter
          </Text>
          <Pill label="LOW RISK" variant="info" size="sm" />
        </View>
        <Text className="text-slate-500 dark:text-slate-400 text-xs leading-5">
          Converts patient weight between kilograms (kg) and pounds (lbs).
        </Text>
      </View>

      {/* Form Container */}
      <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm space-y-5">
        <View>
          <Text className="text-navy dark:text-white font-bold mb-2 text-xs uppercase tracking-wider">
            Conversion Direction
          </Text>
          <View className="flex-row gap-2">
            <AnimatedPressable
              onPress={() => setDirection("kg_to_lbs")}
              activeScale={0.98}
              className={`flex-1 p-3.5 rounded-xl border items-center ${
                direction === "kg_to_lbs"
                  ? "bg-clinical-blue/10 border-clinical-blue"
                  : "bg-warm-bg dark:bg-slate-950 border-border-subtle dark:border-slate-800"
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  direction === "kg_to_lbs" ? "text-clinical-blue dark:text-clinical-blue" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                kg → lbs
              </Text>
              <Text className={`text-[10px] mt-0.5 ${direction === "kg_to_lbs" ? "text-clinical-blue/80 font-medium" : "text-slate-500 dark:text-slate-400"}`}>
                Kilograms to Pounds
              </Text>
            </AnimatedPressable>

            <AnimatedPressable
              onPress={() => setDirection("lbs_to_kg")}
              activeScale={0.98}
              className={`flex-1 p-3.5 rounded-xl border items-center ${
                direction === "lbs_to_kg"
                  ? "bg-clinical-blue/10 border-clinical-blue"
                  : "bg-warm-bg dark:bg-slate-950 border-border-subtle dark:border-slate-800"
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  direction === "lbs_to_kg" ? "text-clinical-blue dark:text-clinical-blue" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                lbs → kg
              </Text>
              <Text className={`text-[10px] mt-0.5 ${direction === "lbs_to_kg" ? "text-clinical-blue/80 font-medium" : "text-slate-500 dark:text-slate-400"}`}>
                Pounds to Kilograms
              </Text>
            </AnimatedPressable>
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-navy dark:text-white font-bold mb-2 text-xs uppercase tracking-wider">
            Weight Value ({direction === "kg_to_lbs" ? "kg" : "lbs"})
          </Text>
          <TextInput
            className="bg-warm-bg dark:bg-slate-950 text-navy dark:text-white p-4 rounded-xl border border-border-subtle dark:border-slate-800 text-base font-semibold focus:border-clinical-blue focus:bg-white dark:focus:bg-slate-900 transition-colors"
            placeholder={direction === "kg_to_lbs" ? "e.g. 70" : "e.g. 154.3"}
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />
        </View>

        <View className="pt-3">
          <PrimaryButton
            label="Convert Weight"
            onPress={handleCalculate}
          />
        </View>
      </View>

      {/* Result Display */}
      {result && (
        <View className="mb-6">
          {!result.ok ? (
            <View className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 shadow-sm">
              <Text className="text-rose-700 dark:text-rose-400 font-bold text-sm mb-1.5">
                ⚠ Validation Notice
              </Text>
              <Text className="text-rose-600 dark:text-rose-300 text-xs leading-5">{result.error}</Text>
            </View>
          ) : (
            <View className="bg-white dark:bg-slate-900 border-2 border-clinical-blue/30 dark:border-clinical-blue/50 rounded-2xl p-5 shadow-sm">
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                Converted Weight
              </Text>
              <View className="flex-row items-baseline mb-4">
                <Text className="text-5xl font-extrabold text-clinical-blue dark:text-clinical-blue mr-2 tracking-tighter">
                  {result.value.toFixed(2)}
                </Text>
                <Text className="text-xl font-bold text-slate-700 dark:text-slate-200">
                  {result.unit}
                </Text>
              </View>

              <View className="bg-warm-bg dark:bg-slate-950 p-3 rounded-xl border border-border-subtle dark:border-slate-800 mb-4">
                <Text className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold mb-1">Formula used:</Text>
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
        <Text className="text-amber-800 dark:text-amber-400 font-bold text-xs mb-1.5 uppercase tracking-wider">
          ⚠ Clinical Reference Disclaimer
        </Text>
        <Text className="text-amber-700/90 dark:text-amber-300/80 text-xs leading-5">
          Always use a calibrated clinical scale for patient weights used in
          medication dosing calculations.
        </Text>
      </View>
    </AppScreen>
  );
}
