import React from "react";
import { View, Text } from "react-native";
import { AppScreen } from "../../components/ui/AppScreen";
import { GlassCard } from "../../components/ui/GlassCard";
import { Pill } from "../../components/ui/Pill";

export default function PainScalesScreen() {
  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      {/* Header Overview Card */}
      <GlassCard variant="default" className="mb-6 p-4">
        <Text className="text-xl font-bold text-white mb-1 tracking-tight">
          Pain Assessment Reference Scales
        </Text>
        <Text className="text-slate-300 text-xs leading-5">
          Validated clinical tools for assessing pain intensity in verbal and preverbal/non-verbal patients.
        </Text>
      </GlassCard>

      {/* Scale 1: Numeric Rating Scale (NRS) */}
      <GlassCard variant="default" className="mb-6 p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-cyan-400 font-bold text-base">
            1. Numeric Rating Scale (NRS)
          </Text>
          <Pill label="Adults & Children ≥ 8 yrs" variant="trust" size="sm" />
        </View>
        <Text className="text-slate-300 text-xs mb-3">
          Self-report scale. Patient rates pain intensity from 0 ("No pain") to 10 ("Worst pain imaginable").
        </Text>

        <View className="space-y-2">
          <GlassCard className="p-3 border-l-4 border-l-emerald-500 flex-row items-center justify-between mb-2">
            <Text className="text-emerald-400 font-bold text-xs">Score 0: No Pain</Text>
            <Text className="text-slate-300 text-xs">Patient completely comfortable</Text>
          </GlassCard>
          <GlassCard className="p-3 border-l-4 border-l-sky-500 flex-row items-center justify-between mb-2">
            <Text className="text-sky-400 font-bold text-xs">Score 1 – 3: Mild Pain</Text>
            <Text className="text-slate-300 text-xs">Noticeable but doesn't interfere with activity</Text>
          </GlassCard>
          <GlassCard className="p-3 border-l-4 border-l-amber-500 flex-row items-center justify-between mb-2">
            <Text className="text-amber-400 font-bold text-xs">Score 4 – 6: Moderate Pain</Text>
            <Text className="text-slate-300 text-xs">Interferes significantly with activity/sleep</Text>
          </GlassCard>
          <GlassCard className="p-3 border-l-4 border-l-rose-500 flex-row items-center justify-between mb-2">
            <Text className="text-rose-400 font-bold text-xs">Score 7 – 10: Severe Pain</Text>
            <Text className="text-rose-200 text-xs font-semibold">Disabling pain — urgent analgesia required</Text>
          </GlassCard>
        </View>
      </GlassCard>

      {/* Scale 2: FLACC Scale */}
      <GlassCard variant="default" className="mb-6 p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-cyan-400 font-bold text-base">
            2. FLACC Scale (Behavioral Assessment)
          </Text>
          <Pill label="2 mos – 7 yrs / Non-verbal" variant="trust" size="sm" />
        </View>
        <Text className="text-slate-300 text-xs mb-3">
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
            <GlassCard key={idx} className="p-3 mb-2 border border-slate-700/60 bg-slate-900/60">
              <Text className="text-cyan-300 font-bold text-xs mb-1.5">{item.cat}</Text>
              <Text className="text-slate-300 text-xs mb-1"><Text className="font-semibold text-slate-100">0 pts:</Text> {item.s0}</Text>
              <Text className="text-slate-300 text-xs mb-1"><Text className="font-semibold text-slate-100">1 pt:</Text> {item.s1}</Text>
              <Text className="text-slate-300 text-xs"><Text className="font-semibold text-slate-100">2 pts:</Text> {item.s2}</Text>
            </GlassCard>
          ))}
        </View>
      </GlassCard>

      {/* Safety Disclaimer */}
      <GlassCard className="mb-8 p-4 border border-amber-500/30 bg-amber-950/20">
        <Text className="text-amber-400 font-bold text-xs mb-1">
          ⚠ ASSESSMENT REFERENCE NOTICE
        </Text>
        <Text className="text-slate-400 text-xs leading-4">
          Pain assessment is subjective and multidimensional. Pain scale scores guide
          clinical judgment and response evaluation, but do not replace holistic assessment.
        </Text>
      </GlassCard>
    </AppScreen>
  );
}


