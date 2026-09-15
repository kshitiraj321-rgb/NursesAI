import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { calcMLPerHour, CalcResult } from "../../utils/calculators";
import { AppScreen } from "../../components/ui/AppScreen";
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
      <View className="mb-6 bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xl font-bold text-navy dark:text-white tracking-tight font-sans">
            Infusion Rate Calculator (mL/hr)
          </Text>
          <Pill label="MEDIUM RISK" variant="warning" size="sm" />
        </View>
        <Text className="text-slate-500 dark:text-slate-400 text-xs leading-5 font-sans">
          Calculates electronic infusion pump rate in mL per hour.
        </Text>
      </View>

      {/* Form Container */}
      <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm space-y-5">
        <View>
          <Text className="text-navy dark:text-white font-bold mb-2 text-xs uppercase tracking-wider font-sans">
            Total Volume (mL)
          </Text>
          <TextInput
            className="bg-warm-bg dark:bg-slate-950 text-navy dark:text-white p-4 rounded-xl border border-border-subtle dark:border-slate-800 text-base font-semibold focus:border-clinical-pine dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-colors font-sans"
            placeholder="e.g. 1000"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={volume}
            onChangeText={setVolume}
          />
        </View>

        <View className="mt-4">
          <Text className="text-navy dark:text-white font-bold mb-2 text-xs uppercase tracking-wider font-sans">
            Infusion Time (Hours)
          </Text>
          <TextInput
            className="bg-warm-bg dark:bg-slate-950 text-navy dark:text-white p-4 rounded-xl border border-border-subtle dark:border-slate-800 text-base font-semibold focus:border-clinical-pine dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-colors font-sans"
            placeholder="e.g. 8 (or 0.5 for 30 mins)"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={timeHours}
            onChangeText={setTimeHours}
          />
          <Text className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-5 font-sans">
            Tip: Enter decimals for partial hours (e.g. 0.5 = 30 min, 1.5 = 90 min).
          </Text>
        </View>

        <View className="pt-3">
          <PrimaryButton
            label="Calculate mL/hr Rate"
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
                Electronic Pump Setting
              </Text>
              <View className="flex-row items-baseline mb-4">
                <Text className="text-5xl font-extrabold text-clinical-pine dark:text-teal-400 mr-2 tracking-tighter font-sans">
                  {result.value.toFixed(1)}
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

              {result.warning && (
                <View className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3.5 rounded-xl">
                  <Text className="text-amber-800 dark:text-amber-400 font-bold text-xs mb-1.5 font-sans">
                    NOTICE (UX Product Guidance)
                  </Text>
                  <Text className="text-amber-700 dark:text-amber-300 text-xs leading-5 font-sans">
                    {result.warning}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {/* Safety Disclaimer */}
      <View className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 mb-6 shadow-sm">
        <Text className="text-amber-800 dark:text-amber-400 font-bold text-xs mb-1.5 uppercase tracking-wider font-sans">
          ⚠ Clinical Reference & Safety Disclaimer
        </Text>
        <Text className="text-amber-700/90 dark:text-amber-300/80 text-xs leading-5 font-sans">
          Calculated rate only. Always verify against the prescriber&apos;s order
          before programming the infusion pump. Programming errors can cause
          serious patient harm.
        </Text>
      </View>
    </AppScreen>
  );
}
