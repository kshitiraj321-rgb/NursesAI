import React from "react";
import { View, Text } from "react-native";
import { AppScreen } from "../../components/ui/AppScreen";
import { Pill } from "../../components/ui/Pill";

export default function PainScalesScreen() {
  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      {/* Header Overview Card */}
      <View className="mb-6 bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <Text className="text-xl font-bold text-navy dark:text-white mb-2 tracking-tight font-sans">
          Pain Assessment Reference Scales
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 text-xs leading-5 font-sans">
          Validated clinical tools for assessing pain intensity in verbal and preverbal/non-verbal patients.
        </Text>
      </View>

      {/* Scale 1: Numeric Rating Scale (NRS) */}
      <View className="mb-6 bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-navy dark:text-white font-bold text-base font-sans">
            1. Numeric Rating Scale (NRS)
          </Text>
          <Pill label="Adults & Children ≥ 8 yrs" variant="trust" size="sm" />
        </View>
        <Text className="text-slate-500 dark:text-slate-400 text-xs mb-4 leading-5 font-sans">
          Self-report scale. Patient rates pain intensity from 0 (&quot;No pain&quot;) to 10 (&quot;Worst pain imaginable&quot;).
        </Text>

        <View className="space-y-3">
          <View className="p-4 bg-warm-bg dark:bg-slate-950 rounded-xl border border-border-subtle dark:border-slate-800 border-l-4 border-l-emerald-500 flex-row items-center justify-between mb-3">
            <Text className="text-emerald-700 dark:text-emerald-400 font-bold text-xs font-sans">Score 0: No Pain</Text>
            <Text className="text-slate-600 dark:text-slate-300 text-xs text-right w-1/2 font-sans">Patient completely comfortable</Text>
          </View>
          <View className="p-4 bg-warm-bg dark:bg-slate-950 rounded-xl border border-border-subtle dark:border-slate-800 border-l-4 border-l-teal-500 flex-row items-center justify-between mb-3">
            <Text className="text-teal-700 dark:text-teal-400 font-bold text-xs font-sans">Score 1 – 3: Mild Pain</Text>
            <Text className="text-slate-600 dark:text-slate-300 text-xs text-right w-1/2 font-sans">Noticeable but doesn&apos;t interfere with activity</Text>
          </View>
          <View className="p-4 bg-warm-bg dark:bg-slate-950 rounded-xl border border-border-subtle dark:border-slate-800 border-l-4 border-l-amber-500 flex-row items-center justify-between mb-3">
            <Text className="text-amber-700 dark:text-amber-400 font-bold text-xs font-sans">Score 4 – 6: Moderate Pain</Text>
            <Text className="text-slate-600 dark:text-slate-300 text-xs text-right w-1/2 font-sans">Interferes significantly with activity/sleep</Text>
          </View>
          <View className="p-4 bg-warm-bg dark:bg-slate-950 rounded-xl border border-border-subtle dark:border-slate-800 border-l-4 border-l-rose-500 flex-row items-center justify-between mb-3">
            <Text className="text-rose-700 dark:text-rose-400 font-bold text-xs font-sans">Score 7 – 10: Severe Pain</Text>
            <Text className="text-rose-600 dark:text-rose-300 text-xs font-semibold text-right w-1/2 font-sans">Disabling pain — urgent analgesia required</Text>
          </View>
        </View>
      </View>

      {/* Scale 2: FLACC Scale */}
      <View className="mb-6 bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-navy dark:text-white font-bold text-base font-sans">
            2. FLACC Scale (Behavioral Assessment)
          </Text>
          <Pill label="2 mos – 7 yrs / Non-verbal" variant="trust" size="sm" />
        </View>
        <Text className="text-slate-500 dark:text-slate-400 text-xs mb-4 leading-5 font-sans">
          Observational scoring tool. Score 0, 1, or 2 across 5 categories (Total 0–10).
        </Text>

        <View className="space-y-3">
          {[
            {
              cat: "F — Face",
              s0: "No particular expression or smile",
              s1: "Occasional grimace or frown, withdrawn",
              s2: "Frequent/constant chin quivering, clenched jaw",
            },
            {
              cat: "L — Legs",
              s0: "Normal position or relaxed",
              s1: "Uneasy, restless, tense",
              s2: "Kicking, or legs drawn up",
            },
            {
              cat: "A — Activity",
              s0: "Lying quietly, normal position, moves easily",
              s1: "Squirming, shifting back and forth, tense",
              s2: "Arched, rigid or jerking",
            },
            {
              cat: "C — Cry",
              s0: "No cry (awake or asleep)",
              s1: "Moans or whimpers; occasional complaint",
              s2: "Crying steadily, screams or sobs, frequent complaints",
            },
            {
              cat: "C — Consolability",
              s0: "Content, relaxed",
              s1: "Reassured by touching, hugging, or talking to; distractible",
              s2: "Difficult to console or comfort",
            },
          ].map((item, idx) => (
            <View key={idx} className="p-4 mb-3 rounded-xl border border-border-subtle dark:border-slate-800 bg-warm-bg dark:bg-slate-950">
              <Text className="text-clinical-pine dark:text-teal-400 font-bold text-xs mb-2 uppercase tracking-wider font-sans">{item.cat}</Text>
              <Text className="text-slate-600 dark:text-slate-300 text-xs mb-1.5 font-sans"><Text className="font-bold text-navy dark:text-white">0 pts:</Text> {item.s0}</Text>
              <Text className="text-slate-600 dark:text-slate-300 text-xs mb-1.5 font-sans"><Text className="font-bold text-navy dark:text-white">1 pt:</Text> {item.s1}</Text>
              <Text className="text-slate-600 dark:text-slate-300 text-xs font-sans"><Text className="font-bold text-navy dark:text-white">2 pts:</Text> {item.s2}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Safety Disclaimer */}
      <View className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 mb-8 shadow-sm">
        <Text className="text-amber-800 dark:text-amber-400 font-bold text-xs mb-1.5 uppercase tracking-wider font-sans">
          ⚠ Assessment Reference Notice
        </Text>
        <Text className="text-amber-700/90 dark:text-amber-300/80 text-xs leading-5 font-sans">
          Pain assessment is subjective and multidimensional. Pain scale scores guide
          clinical judgment and response evaluation, but do not replace holistic assessment.
        </Text>
      </View>
    </AppScreen>
  );
}
