import React from "react";
import { View, Text } from "react-native";
import { AppScreen } from "../../components/ui/AppScreen";
import { Pill } from "../../components/ui/Pill";

export default function GCSScreen() {
  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      {/* Header */}
      <View className="mb-6 bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <Text className="text-xl font-bold text-navy dark:text-white mb-2 tracking-tight font-sans">
          Glasgow Coma Scale (GCS)
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 text-xs leading-5 font-sans">
          Objective assessment tool for measuring level of consciousness following acute brain injury.
        </Text>
      </View>

      {/* Section 1: Eye Opening (E) */}
      <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-5 mb-5 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-navy dark:text-white font-bold text-base font-sans">
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
            <View key={row.score} className="bg-warm-bg dark:bg-slate-950 p-3.5 rounded-xl flex-row items-center justify-between mb-2 border border-border-subtle dark:border-slate-800">
              <Text className="text-navy dark:text-white font-semibold text-xs flex-1 mr-3 font-sans">{row.label} — <Text className="text-slate-500 dark:text-slate-400 font-normal">{row.desc}</Text></Text>
              <Text className="text-clinical-pine dark:text-teal-400 font-bold text-sm bg-white dark:bg-slate-800 border border-border-subtle dark:border-transparent px-3 py-1.5 rounded-lg font-sans">{row.score}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Section 2: Verbal Response (V) */}
      <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-5 mb-5 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-navy dark:text-white font-bold text-base font-sans">
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
            <View key={row.score} className="bg-warm-bg dark:bg-slate-950 p-3.5 rounded-xl flex-row items-center justify-between mb-2 border border-border-subtle dark:border-slate-800">
              <Text className="text-navy dark:text-white font-semibold text-xs flex-1 mr-3 font-sans">{row.label} — <Text className="text-slate-500 dark:text-slate-400 font-normal">{row.desc}</Text></Text>
              <Text className="text-clinical-pine dark:text-teal-400 font-bold text-sm bg-white dark:bg-slate-800 border border-border-subtle dark:border-transparent px-3 py-1.5 rounded-lg font-sans">{row.score}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Section 3: Motor Response (M) */}
      <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-5 mb-5 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-navy dark:text-white font-bold text-base font-sans">
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
            <View key={row.score} className="bg-warm-bg dark:bg-slate-950 p-3.5 rounded-xl flex-row items-center justify-between mb-2 border border-border-subtle dark:border-slate-800">
              <Text className="text-navy dark:text-white font-semibold text-xs flex-1 mr-3 font-sans">{row.label} — <Text className="text-slate-500 dark:text-slate-400 font-normal">{row.desc}</Text></Text>
              <Text className="text-clinical-pine dark:text-teal-400 font-bold text-sm bg-white dark:bg-slate-800 border border-border-subtle dark:border-transparent px-3 py-1.5 rounded-lg font-sans">{row.score}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Total Score Classification */}
      <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm">
        <Text className="text-navy dark:text-white font-bold text-base mb-4 font-sans">
          Total Score Interpretation (3 – 15)
        </Text>
        <View className="space-y-3">
          <View className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-3.5 rounded-xl mb-3">
            <Text className="text-emerald-800 dark:text-emerald-400 font-bold text-xs mb-1 font-sans">Score 15: Fully Conscious</Text>
            <Text className="text-emerald-700 dark:text-emerald-300 text-xs leading-4 font-sans">Normal neurological baseline.</Text>
          </View>
          <View className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 p-3.5 rounded-xl mb-3">
            <Text className="text-teal-800 dark:text-teal-400 font-bold text-xs mb-1 font-sans">Score 13–14: Minor Brain Injury</Text>
            <Text className="text-teal-700 dark:text-teal-300 text-xs leading-4 font-sans">Mild neurological impairment.</Text>
          </View>
          <View className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3.5 rounded-xl mb-3">
            <Text className="text-amber-800 dark:text-amber-400 font-bold text-xs mb-1 font-sans">Score 9–12: Moderate Brain Injury</Text>
            <Text className="text-amber-700 dark:text-amber-300 text-xs leading-4 font-sans">Requires close monitoring and serial evaluation.</Text>
          </View>
          <View className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-3.5 rounded-xl">
            <Text className="text-rose-800 dark:text-rose-400 font-bold text-xs mb-1 font-sans">Score ≤ 8: Severe Brain Injury / Coma</Text>
            <Text className="text-rose-700 dark:text-rose-300 text-xs font-semibold leading-5 font-sans">Critical threshold — airway protection required. Immediate medical escalation.</Text>
          </View>
        </View>
      </View>

      {/* Safety Disclaimer */}
      <View className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 mb-6 shadow-sm">
        <Text className="text-amber-800 dark:text-amber-400 font-bold text-xs mb-1.5 uppercase tracking-wider font-sans">
          ⚠ Educational Reference Only
        </Text>
        <Text className="text-amber-700/90 dark:text-amber-300/80 text-xs leading-5 font-sans">
          GCS assessment requires direct patient examination by a trained clinician.
          This reference guide does not calculate or replace formal neurological documentation.
        </Text>
      </View>
    </AppScreen>
  );
}
