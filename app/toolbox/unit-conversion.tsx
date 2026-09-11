import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { calcUnitConversion, NursingConversion, CalcResult } from "../../utils/calculators";
import { AppScreen } from "../../components/ui/AppScreen";
import { GlassCard } from "../../components/ui/GlassCard";
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
      <GlassCard variant="default" className="mb-6 p-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xl font-bold text-white tracking-tight">
            Metric Nursing Unit Converter
          </Text>
          <Pill label="LOW RISK" variant="info" size="sm" />
        </View>
        <Text className="text-slate-300 text-xs leading-5">
          Converts mass and volume measurements between standard metric nursing units.
        </Text>
      </GlassCard>

      {/* Form Container */}
      <GlassCard variant="default" className="p-4 mb-6 space-y-4">
        <View>
          <Text className="text-slate-200 font-semibold mb-2 text-xs uppercase tracking-wider">
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
                  className={`p-3 rounded-xl border flex-row items-center justify-between ${
                    isSelected
                      ? "bg-cyan-600/90 border-cyan-400"
                      : "bg-slate-950/60 border-slate-800"
                  }`}
                >
                  <Text
                    className={`font-bold text-xs flex-1 mr-2 ${
                      isSelected ? "text-white" : "text-slate-300"
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

        <View className="mt-3">
          <Text className="text-slate-200 font-semibold mb-1.5 text-xs uppercase tracking-wider">
            Input Value
          </Text>
          <TextInput
            className="bg-slate-950/80 text-white p-3.5 rounded-xl border border-slate-800 text-base font-semibold focus:border-cyan-500"
            placeholder="e.g. 1.0 or 250"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />
        </View>

        <View className="pt-2">
          <PrimaryButton
            label="Convert Metric Unit"
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
                Converted Result
              </Text>
              <View className="flex-row items-baseline mb-3">
                <Text className="text-4xl font-extrabold text-cyan-400 mr-2">
                  {result.value}
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
          ⚠ CLINICAL SAFETY NOTICE
        </Text>
        <Text className="text-slate-400 text-xs leading-4">
          Metric mass and volume conversions only. For electrolyte (mEq) or
          International Unit (IU) conversions, consult pharmacy or institutional
          protocol — these require substance-specific properties.
        </Text>
      </GlassCard>
    </AppScreen>
  );
}

