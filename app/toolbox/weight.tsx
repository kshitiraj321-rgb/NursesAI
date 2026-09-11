import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { calcWeightConversion, WeightDirection, CalcResult } from "../../utils/calculators";
import { AppScreen } from "../../components/ui/AppScreen";
import { GlassCard } from "../../components/ui/GlassCard";
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
      <GlassCard variant="default" className="mb-6 p-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xl font-bold text-white tracking-tight">
            Weight Unit Converter
          </Text>
          <Pill label="LOW RISK" variant="info" size="sm" />
        </View>
        <Text className="text-slate-300 text-xs leading-5">
          Converts patient weight between kilograms (kg) and pounds (lbs).
        </Text>
      </GlassCard>

      {/* Form Container */}
      <GlassCard variant="default" className="p-4 mb-6 space-y-4">
        <View>
          <Text className="text-slate-200 font-semibold mb-1.5 text-xs uppercase tracking-wider">
            Conversion Direction
          </Text>
          <View className="flex-row gap-2">
            <AnimatedPressable
              onPress={() => setDirection("kg_to_lbs")}
              activeScale={0.98}
              className={`flex-1 p-3 rounded-xl border items-center ${
                direction === "kg_to_lbs"
                  ? "bg-cyan-600/90 border-cyan-400"
                  : "bg-slate-950/60 border-slate-800"
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  direction === "kg_to_lbs" ? "text-white" : "text-slate-300"
                }`}
              >
                kg → lbs
              </Text>
              <Text className={`text-[10px] ${direction === "kg_to_lbs" ? "text-cyan-100" : "text-slate-400"}`}>
                Kilograms to Pounds
              </Text>
            </AnimatedPressable>

            <AnimatedPressable
              onPress={() => setDirection("lbs_to_kg")}
              activeScale={0.98}
              className={`flex-1 p-3 rounded-xl border items-center ${
                direction === "lbs_to_kg"
                  ? "bg-cyan-600/90 border-cyan-400"
                  : "bg-slate-950/60 border-slate-800"
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  direction === "lbs_to_kg" ? "text-white" : "text-slate-300"
                }`}
              >
                lbs → kg
              </Text>
              <Text className={`text-[10px] ${direction === "lbs_to_kg" ? "text-cyan-100" : "text-slate-400"}`}>
                Pounds to Kilograms
              </Text>
            </AnimatedPressable>
          </View>
        </View>

        <View className="mt-3">
          <Text className="text-slate-200 font-semibold mb-1.5 text-xs uppercase tracking-wider">
            Weight Value ({direction === "kg_to_lbs" ? "kg" : "lbs"})
          </Text>
          <TextInput
            className="bg-slate-950/80 text-white p-3.5 rounded-xl border border-slate-800 text-base font-semibold focus:border-cyan-500"
            placeholder={direction === "kg_to_lbs" ? "e.g. 70" : "e.g. 154.3"}
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />
        </View>

        <View className="pt-2">
          <PrimaryButton
            label="Convert Weight"
            onPress={handleCalculate}
          />
        </View>
      </GlassCard>

      {/* Result Display */}
      {result && (
        <View className="mb-6">
          {!result.ok ? (
            <GlassCard variant="accent" className="p-4 border-rose-600/80 bg-rose-950/60">
              <Text className="text-rose-300 font-bold text-sm mb-1">
                ⚠ Validation Notice
              </Text>
              <Text className="text-rose-100 text-xs leading-5">{result.error}</Text>
            </GlassCard>
          ) : (
            <GlassCard variant="accent" className="p-5 border-cyan-500/50">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                Converted Weight
              </Text>
              <View className="flex-row items-baseline mb-3">
                <Text className="text-4xl font-extrabold text-cyan-400 mr-2">
                  {result.value.toFixed(2)}
                </Text>
                <Text className="text-lg font-bold text-slate-200">
                  {result.unit}
                </Text>
              </View>

              <View className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-3">
                <Text className="text-slate-400 text-[11px] font-semibold mb-1">Formula used:</Text>
                <Text className="text-cyan-300 font-mono text-xs">
                  {result.formulaDisplay}
                </Text>
              </View>
            </GlassCard>
          )}
        </View>
      )}

      {/* Safety Disclaimer */}
      <GlassCard variant="default" className="p-4 mb-6 border-slate-800">
        <Text className="text-amber-400 font-bold text-xs mb-1">
          ⚠ CLINICAL REFERENCE DISCLAIMER
        </Text>
        <Text className="text-slate-400 text-xs leading-4">
          Always use a calibrated clinical scale for patient weights used in
          medication dosing calculations.
        </Text>
      </GlassCard>
    </AppScreen>
  );
}

