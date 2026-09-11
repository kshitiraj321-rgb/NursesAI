import React from "react";
import { View, Text } from "react-native";
import { AppScreen } from "../../components/ui/AppScreen";
import { GlassCard } from "../../components/ui/GlassCard";
import { Pill } from "../../components/ui/Pill";
import { SectionHeader } from "../../components/ui/SectionHeader";

export default function AVPUScreen() {
  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      {/* Header Overview Card */}
      <GlassCard variant="default" className="mb-6 p-4">
        <Text className="text-xl font-bold text-white mb-1 tracking-tight">
          AVPU Scale Reference
        </Text>
        <Text className="text-slate-300 text-xs leading-5">
          Rapid assessment scale for measuring patient consciousness during primary survey.
        </Text>
      </GlassCard>

      {/* AVPU Scale Cards */}
      <View className="mb-6 space-y-4">
        <GlassCard className="border-l-4 border-l-emerald-500 p-4 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-emerald-400 font-bold text-lg">
              A — Alert
            </Text>
            <Pill label="Normal Baseline" variant="success" size="sm" />
          </View>
          <Text className="text-slate-300 text-xs leading-5">
            The patient is awake, aware of surroundings, and responds to voice spontaneously.
            Spontaneous eye opening, coherent speech, intact motor function.
          </Text>
        </GlassCard>

        <GlassCard className="border-l-4 border-l-sky-500 p-4 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sky-400 font-bold text-lg">
              V — Voice (Responds to Verbal Stimulus)
            </Text>
            <Pill label="Altered Consciousness" variant="info" size="sm" />
          </View>
          <Text className="text-slate-300 text-xs leading-5">
            The patient responds only when spoken or called to. Response may be eye opening,
            speech, or limb movement in response to auditory commands.
          </Text>
        </GlassCard>

        <GlassCard className="border-l-4 border-l-amber-500 p-4 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-amber-400 font-bold text-lg">
              P — Pain (Responds to Painful Stimulus)
            </Text>
            <Pill label="Urgent Escalation" variant="warning" size="sm" />
          </View>
          <Text className="text-slate-300 text-xs leading-5">
            The patient responds only to tactile painful stimuli (e.g. trapezius squeeze or nail bed pressure).
            Response may be localized withdrawal, moaning, or eye movement.
          </Text>
        </GlassCard>

        <GlassCard className="border-l-4 border-l-rose-500 p-4 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-rose-400 font-bold text-lg">
              U — Unresponsive
            </Text>
            <Pill label="Medical Emergency" variant="error" size="sm" />
          </View>
          <Text className="text-rose-200 text-xs leading-5 font-semibold">
            The patient shows no eye, vocal, or motor response to voice or painful stimuli.
            Critical finding requiring immediate airway support and medical emergency activation.
          </Text>
        </GlassCard>
      </View>

      {/* ACVPU Clinical Context Note */}
      <GlassCard className="mb-6 p-4 border border-cyan-500/30">
        <Text className="text-cyan-400 font-bold text-sm mb-1">
          NHS NEWS2 Update: ACVPU Scale
        </Text>
        <Text className="text-slate-300 text-xs leading-5">
          Modern early warning systems (such as NHS NEWS2) use <Text className="font-bold text-white">ACVPU</Text>, adding <Text className="font-bold text-cyan-300">C (New Confusion)</Text> between Alert and Voice. A new onset of confusion scores 3 points on NEWS2 as a key marker of early deterioration (e.g., sepsis, hypoxia, delirium).
        </Text>
      </GlassCard>

      {/* Safety Disclaimer */}
      <GlassCard className="mb-8 p-4 border border-amber-500/30 bg-amber-950/20">
        <Text className="text-amber-400 font-bold text-xs mb-1">
          ⚠ TRIAGE REFERENCE NOTICE
        </Text>
        <Text className="text-slate-400 text-xs leading-4">
          AVPU is a rapid triage tool. Any finding below Alert (V, P, or U) indicates
          neurological deterioration and requires prompt clinical evaluation.
        </Text>
      </GlassCard>
    </AppScreen>
  );
}


