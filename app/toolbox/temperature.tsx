import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { calcTemperature, TempDirection, CalcResult } from "../../utils/calculators";
import { AppScreen } from "../../components/ui/AppScreen";
import { GlassCard } from "../../components/ui/GlassCard";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { Pill } from "../../components/ui/Pill";
import { AnimatedPressable } from "../../components/ui/AnimatedPressable";

export default function TemperatureScreen() {
  const [value, setValue] = useState("");
  const [direction, setDirection] = useState<TempDirection>("C_to_F");
  const [result, setResult] = useState<CalcResult | null>(null);

  const handleCalculate = () => {
    const valNum = parseFloat(value);
    const res = calcTemperature(valNum, direction);
    setResult(res);
  };

  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      {/* Header */}
      <GlassCard variant="default" className="mb-6 p-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xl font-bold text-white tracking-tight">
            Temperature Unit Converter
          </Text>
          <Pill label="LOW RISK" variant="info" size="sm" />
        </View>
        <Text className="text-slate-300 text-xs leading-5">
          Converts patient temperature readings between Celsius (°C) and Fahrenheit (°F).
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
              onPress={() => setDirection("C_to_F")}
              activeScale={0.98}
              className={`flex-1 p-3 rounded-xl border items-center ${
                direction === "C_to_F"
                  ? "bg-cyan-600/90 border-cyan-400"
                  : "bg-slate-950/60 border-slate-800"
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  direction === "C_to_F" ? "text-white" : "text-slate-300"
                }`}
              >
                °C → °F
              </Text>
              <Text className={`text-[10px] ${direction === "C_to_F" ? "text-cyan-100" : "text-slate-400"}`}>
                Celsius to Fahrenheit
              </Text>
            </AnimatedPressable>

            <AnimatedPressable
              onPress={() => setDirection("F_to_C")}
              activeScale={0.98}
              className={`flex-1 p-3 rounded-xl border items-center ${
                direction === "F_to_C"
                  ? "bg-cyan-600/90 border-cyan-400"
                  : "bg-slate-950/60 border-slate-800"
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  direction === "F_to_C" ? "text-white" : "text-slate-300"
                }`}
              >
                °F → °C
              </Text>
              <Text className={`text-[10px] ${direction === "F_to_C" ? "text-cyan-100" : "text-slate-400"}`}>
                Fahrenheit to Celsius
              </Text>
            </AnimatedPressable>
          </View>
        </View>

        <View className="mt-3">
          <Text className="text-slate-200 font-semibold mb-1.5 text-xs uppercase tracking-wider">
            Temperature Value ({direction === "C_to_F" ? "°C" : "°F"})
          </Text>
          <TextInput
            className="bg-slate-950/80 text-white p-3.5 rounded-xl border border-slate-800 text-base font-semibold focus:border-cyan-500"
            placeholder={direction === "C_to_F" ? "e.g. 37.0" : "e.g. 98.6"}
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />
        </View>

        <View className="pt-2">
          <PrimaryButton
            label="Convert Temperature"
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
                Converted Temperature
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
                    PHYSIOLOGICAL ADVISORY
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
          ⚠ CLINICAL REFERENCE DISCLAIMER
        </Text>
        <Text className="text-slate-400 text-xs leading-4">
          Always use a calibrated clinical thermometer for patient measurements.
          This tool is for mathematical unit conversion reference only.
        </Text>
      </GlassCard>
    </AppScreen>
  );
}

