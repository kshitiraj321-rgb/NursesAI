import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { calcMLPerHour, CalcResult } from "../../utils/calculators";
import { AppScreen } from "../../components/ui/AppScreen";
import { GlassCard } from "../../components/ui/GlassCard";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { Pill } from "../../components/ui/Pill";

export default function MLPerHourScreen() {
  const [volume, setVolume] = useState("");
  const [timeHours, setTimeHours] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);

  const handleCalculate = () => {
    const volNum = parseFloat(volume);
    const timeNum = parseFloat(timeHours);
    const res = calcMLPerHour(volNum, timeNum);
    setResult(res);
  };

  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      {/* Header */}
      <GlassCard variant="default" className="mb-6 p-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xl font-bold text-white tracking-tight">
            Infusion Rate Calculator (mL/hr)
          </Text>
          <Pill label="MEDIUM RISK" variant="warning" size="sm" />
        </View>
        <Text className="text-slate-300 text-xs leading-5">
          Calculates electronic infusion pump rate in mL per hour.
        </Text>
      </GlassCard>

      {/* Form Container */}
      <GlassCard variant="default" className="p-4 mb-6 space-y-4">
        <View>
          <Text className="text-slate-200 font-semibold mb-1.5 text-xs uppercase tracking-wider">
            Total Volume (mL)
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

        <View className="mt-3">
          <Text className="text-slate-200 font-semibold mb-1.5 text-xs uppercase tracking-wider">
            Infusion Time (Hours)
          </Text>
          <TextInput
            className="bg-slate-950/80 text-white p-3.5 rounded-xl border border-slate-800 text-base font-semibold focus:border-cyan-500"
            placeholder="e.g. 8 (or 0.5 for 30 mins)"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={timeHours}
            onChangeText={setTimeHours}
          />
          <Text className="text-slate-400 text-xs mt-1.5 leading-4">
            Tip: Enter decimals for partial hours (e.g. 0.5 = 30 min, 1.5 = 90 min).
          </Text>
        </View>

        <View className="pt-2">
          <PrimaryButton
            label="Calculate mL/hr Rate"
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
                Electronic Pump Setting
              </Text>
              <View className="flex-row items-baseline mb-3">
                <Text className="text-4xl font-extrabold text-cyan-400 mr-2">
                  {result.value.toFixed(1)}
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

      {/* Safety Disclaimer */}
      <GlassCard variant="default" className="p-4 mb-6 border-slate-800">
        <Text className="text-amber-400 font-bold text-xs mb-1">
          ⚠ CLINICAL REFERENCE & SAFETY DISCLAIMER
        </Text>
        <Text className="text-slate-400 text-xs leading-4">
          Calculated rate only. Always verify against the prescriber&apos;s order
          before programming the infusion pump. Programming errors can cause
          serious patient harm.
        </Text>
      </GlassCard>
    </AppScreen>
  );
}

