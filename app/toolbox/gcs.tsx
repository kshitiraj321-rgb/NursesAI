import React from "react";
import { View, Text } from "react-native";
import { AppScreen } from "../../components/ui/AppScreen";
import { GlassCard } from "../../components/ui/GlassCard";
import { Pill } from "../../components/ui/Pill";

export default function GCSScreen() {
  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      {/* Header */}
      <GlassCard variant="default" className="mb-6 p-4">
        <Text className="text-xl font-bold text-white mb-1 tracking-tight">
          Glasgow Coma Scale (GCS)
        </Text>
        <Text className="text-slate-300 text-xs leading-5">
          Objective assessment tool for measuring level of consciousness following acute brain injury.
        </Text>
      </GlassCard>

      {/* Section 1: Eye Opening (E) */}
      <GlassCard variant="default" className="p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-cyan-400 font-bold text-base">
            Eye Opening Response (E)
          </Text>
          <Pill label="Max 4 points" variant="trust" size="sm" />
        </View>
        <View className="space-y-2">
          {[
            { score: 4, label: "Spontaneous", desc: "Opens eyes automatically without stimulus" },
            { score: 3, label: "To Sound", desc: "Opens eyes when spoken or shouted to" },
            { score: 2, label: "To Pressure", desc: "Opens eyes to fingertip/nail bed pressure" },
            { score: 1, label: "None", desc: "No eye opening to any stimulus" },
          ].map((row) => (
            <View key={row.score} className="bg-slate-950/80 p-3 rounded-xl flex-row items-center justify-between mb-1.5 border border-slate-800">
              <Text className="text-white font-semibold text-xs flex-1 mr-2">{row.label} — <Text className="text-slate-300 font-normal">{row.desc}</Text></Text>
              <Text className="text-cyan-300 font-bold text-sm bg-slate-800 px-2.5 py-1 rounded-lg">{row.score}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Section 2: Verbal Response (V) */}
      <GlassCard variant="default" className="p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-cyan-400 font-bold text-base">
            Verbal Response (V)
          </Text>
          <Pill label="Max 5 points" variant="trust" size="sm" />
        </View>
        <View className="space-y-2">
          {[
            { score: 5, label: "Oriented", desc: "Correctly states name, place, and date" },
            { score: 4, label: "Confused", desc: "Converses but confused/disoriented" },
            { score: 3, label: "Words", desc: "Inappropriate words or random exclamations" },
            { score: 2, label: "Sounds", desc: "Incomprehensible groans or moans" },
            { score: 1, label: "None", desc: "No vocal response to any stimulus" },
          ].map((row) => (
            <View key={row.score} className="bg-slate-950/80 p-3 rounded-xl flex-row items-center justify-between mb-1.5 border border-slate-800">
              <Text className="text-white font-semibold text-xs flex-1 mr-2">{row.label} — <Text className="text-slate-300 font-normal">{row.desc}</Text></Text>
              <Text className="text-cyan-300 font-bold text-sm bg-slate-800 px-2.5 py-1 rounded-lg">{row.score}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Section 3: Motor Response (M) */}
      <GlassCard variant="default" className="p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-cyan-400 font-bold text-base">
            Motor Response (M)
          </Text>
          <Pill label="Max 6 points" variant="trust" size="sm" />
        </View>
        <View className="space-y-2">
          {[
            { score: 6, label: "Obeys Commands", desc: "Follows 2-step motor instruction" },
            { score: 5, label: "Localises Pain", desc: "Brings hand above clavicle to stimulus" },
            { score: 4, label: "Normal Flexion", desc: "Withdraws limb rapidly from painful stimulus" },
            { score: 3, label: "Abnormal Flexion", desc: "Decorticate posture (slow flexion/rotation)" },
            { score: 2, label: "Extension", desc: "Decerebrate posture (elbow extension, internal rotation)" },
            { score: 1, label: "None", desc: "No movement to painful stimulus" },
          ].map((row) => (
            <View key={row.score} className="bg-slate-950/80 p-3 rounded-xl flex-row items-center justify-between mb-1.5 border border-slate-800">
              <Text className="text-white font-semibold text-xs flex-1 mr-2">{row.label} — <Text className="text-slate-300 font-normal">{row.desc}</Text></Text>
              <Text className="text-cyan-300 font-bold text-sm bg-slate-800 px-2.5 py-1 rounded-lg">{row.score}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Total Score Classification */}
      <GlassCard variant="default" className="p-4 mb-6">
        <Text className="text-white font-bold text-base mb-3">
          Total Score Interpretation (3 – 15)
        </Text>
        <View className="space-y-2">
          <View className="bg-emerald-950/70 border border-emerald-700/60 p-3 rounded-xl mb-2">
            <Text className="text-emerald-300 font-bold text-xs">Score 15: Fully Conscious</Text>
            <Text className="text-emerald-100 text-xs">Normal neurological baseline.</Text>
          </View>
          <View className="bg-blue-950/70 border border-blue-700/60 p-3 rounded-xl mb-2">
            <Text className="text-blue-300 font-bold text-xs">Score 13–14: Minor Brain Injury</Text>
            <Text className="text-blue-100 text-xs">Mild neurological impairment.</Text>
          </View>
          <View className="bg-amber-950/70 border border-amber-700/60 p-3 rounded-xl mb-2">
            <Text className="text-amber-300 font-bold text-xs">Score 9–12: Moderate Brain Injury</Text>
            <Text className="text-amber-100 text-xs">Requires close monitoring and serial evaluation.</Text>
          </View>
          <View className="bg-rose-950/70 border border-rose-700/60 p-3 rounded-xl">
            <Text className="text-rose-300 font-bold text-xs">Score ≤ 8: Severe Brain Injury / Coma</Text>
            <Text className="text-rose-100 text-xs font-semibold">Critical threshold — airway protection required. Immediate medical escalation.</Text>
          </View>
        </View>
      </GlassCard>

      {/* Safety Disclaimer */}
      <GlassCard variant="default" className="p-4 mb-6 border-slate-800">
        <Text className="text-amber-400 font-bold text-xs mb-1">
          ⚠ EDUCATIONAL REFERENCE ONLY
        </Text>
        <Text className="text-slate-400 text-xs leading-4">
          GCS assessment requires direct patient examination by a trained clinician.
          This reference guide does not calculate or replace formal neurological documentation.
        </Text>
      </GlassCard>
    </AppScreen>
  );
}

