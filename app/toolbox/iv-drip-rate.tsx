import React, { useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { calcIVDripRate, DropFactor, CalcResult } from "../../utils/calculators";
import { AppScreen } from "../../components/ui/AppScreen";
import { GlassCard } from "../../components/ui/GlassCard";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { Pill } from "../../components/ui/Pill";
import { AnimatedPressable } from "../../components/ui/AnimatedPressable";

const DROP_FACTORS: { label: string; value: DropFactor; sub: string }[] = [
  { label: "10 gtt/mL", value: 10, sub: "Macrodrip" },
  { label: "15 gtt/mL", value: 15, sub: "Macrodrip" },
  { label: "20 gtt/mL", value: 20, sub: "Standard" },
  { label: "60 gtt/mL", value: 60, sub: "Microdrip" },
];

export default function IVDripRateScreen() {
  const [volume, setVolume] = useState("");
  const [dropFactor, setDropFactor] = useState<DropFactor>(20);
  const [time, setTime] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);

  const handleCalculate = () => {
    const volNum = parseFloat(volume);
    const timeNum = parseFloat(time);
    const res = calcIVDripRate(volNum, dropFactor, timeNum);
    setResult(res);
  };

  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      {/* Tool Header & Description */}
      <GlassCard variant="default" className="mb-6 p-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xl font-bold text-white tracking-tight">
            IV Drip Rate Calculator
          </Text>
          <Pill label="MEDIUM RISK" variant="warning" size="sm" />
        </View>
        <Text className="text-slate-300 text-xs leading-5">
          Calculates manual gravity IV infusion rate in drops per minute (gtt/min).
        </Text>
      </GlassCard>

      {/* Form Container */}
      <GlassCard variant="default" className="p-4 mb-6 space-y-4">
        {/* Infusion Volume Input */}
        <View>
          <Text className="text-slate-200 font-semibold mb-1.5 text-xs uppercase tracking-wider">
            Total Infusion Volume (mL)
          </Text>
          <TextInput
            className="bg-slate-950/80 text-white p-3.5 rounded-xl border border-slate-800 text-base font-semibold focus:border-cyan-500"
            placeholder="e.g. 1000"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={volume}
            onChangeText={setVolume}
          />
        </View>

        {/* Drop Factor Selector */}
        <View className="mt-3">
          <Text className="text-slate-200 font-semibold mb-1.5 text-xs uppercase tracking-wider">
            IV Tubing Drop Factor (gtt/mL)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {DROP_FACTORS.map((item) => {
              const isSelected = dropFactor === item.value;
              return (
                <AnimatedPressable
                  key={item.value}
                  onPress={() => setDropFactor(item.value)}
                  activeScale={0.98}
                  className={`flex-1 min-w-[45%] p-3 rounded-xl border items-center ${
                    isSelected
                      ? "bg-cyan-600/90 border-cyan-400"
                      : "bg-slate-950/60 border-slate-800"
                  }`}
                >
                  <Text
                    className={`font-bold text-sm ${
                      isSelected ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {item.label}
                  </Text>
                  <Text
                    className={`text-[11px] ${
                      isSelected ? "text-cyan-100 font-medium" : "text-slate-400"
                    }`}
                  >
                    {item.sub}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>
        </View>

        {/* Duration Input */}
        <View className="mt-3">
          <Text className="text-slate-200 font-semibold mb-1.5 text-xs uppercase tracking-wider">
            Infusion Duration (Minutes)
          </Text>
          <TextInput
            className="bg-slate-950/80 text-white p-3.5 rounded-xl border border-slate-800 text-base font-semibold focus:border-cyan-500"
            placeholder="e.g. 480 (for 8 hours)"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={time}
            onChangeText={setTime}
          />
        </View>

        {/* Action Button */}
        <View className="pt-2">
          <PrimaryButton
            label="Calculate Drip Rate"
            onPress={handleCalculate}
          />
        </View>
      </GlassCard>

      {/* Validation Error or Calculation Result */}
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
                Calculated Flow Rate
              </Text>
              <View className="flex-row items-baseline mb-3">
                <Text className="text-4xl font-extrabold text-cyan-400 mr-2">
                  {result.value}
                </Text>
                <Text className="text-lg font-bold text-slate-200">
                  {result.unit}
                </Text>
              </View>

              {/* Formula display */}
              <View className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-3">
                <Text className="text-slate-400 text-[11px] font-semibold mb-1">Formula used:</Text>
                <Text className="text-cyan-300 font-mono text-xs">
                  {result.formulaDisplay}
                </Text>
              </View>

              {/* Product Guidance Warning */}
              {result.warning && (
                <View className="bg-amber-950/60 border border-amber-600/80 p-3 rounded-xl">
                  <Text className="text-amber-300 font-bold text-xs mb-1">
                    NOTICE (UX Product Guidance)
                  </Text>
                  <Text className="text-amber-100 text-xs leading-4">
                    {result.warning}
                  </Text>
                </View>
              )}
            </GlassCard>
          )}
        </View>
      )}

      {/* Clinical Reference Safety Disclaimer */}
      <GlassCard variant="default" className="p-4 mb-6 border-slate-800">
        <Text className="text-amber-400 font-bold text-xs mb-1">
          ⚠ CLINICAL REFERENCE & SAFETY DISCLAIMER
        </Text>
        <Text className="text-slate-400 text-xs leading-4">
          This tool is for clinical reference and educational verification only.
          Always verify against the prescriber&apos;s order. Confirm drop factor from
          IV tubing packaging before use. Use an infusion pump where available.
        </Text>
      </GlassCard>
    </AppScreen>
  );
}

