import React from "react";
import { View, Text } from "react-native";
import { AppScreen } from "../../components/ui/AppScreen";
import { Pill } from "../../components/ui/Pill";

export default function AVPUScreen() {
  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      {/* Header Overview Card */}
      <View className="mb-6 bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <Text className="text-xl font-bold text-navy dark:text-white mb-2 tracking-tight font-sans">
          AVPU Scale Reference
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 text-xs leading-5 font-sans">
          Rapid assessment scale for measuring patient consciousness during primary survey.
        </Text>
      </View>

      {/* AVPU Scale Cards */}
      <View className="mb-6 space-y-4">
        <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 border-l-4 border-l-emerald-500 rounded-2xl p-5 shadow-sm mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-emerald-700 dark:text-emerald-400 font-bold text-lg font-sans">
              A — Alert
            </Text>
            <Pill label="Normal Baseline" variant="success" size="sm" />
          </View>
          <Text className="text-slate-600 dark:text-slate-300 text-xs leading-5 font-sans">
            The patient is awake, aware of surroundings, and responds to voice spontaneously.
            Spontaneous eye opening, coherent speech, intact motor function.
          </Text>
        </View>

        <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 border-l-4 border-l-sky-500 rounded-2xl p-5 shadow-sm mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sky-700 dark:text-sky-400 font-bold text-lg font-sans">
              V — Voice (Responds to Verbal Stimulus)
            </Text>
            <Pill label="Altered Consciousness" variant="info" size="sm" />
          </View>
          <Text className="text-slate-600 dark:text-slate-300 text-xs leading-5 font-sans">
            The patient responds only when spoken or called to. Response may be eye opening,
            speech, or limb movement in response to auditory commands.
          </Text>
        </View>

        <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 border-l-4 border-l-amber-500 rounded-2xl p-5 shadow-sm mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-amber-700 dark:text-amber-400 font-bold text-lg font-sans">
              P — Pain (Responds to Painful Stimulus)
            </Text>
            <Pill label="Urgent Escalation" variant="warning" size="sm" />
          </View>
          <Text className="text-slate-600 dark:text-slate-300 text-xs leading-5 font-sans">
            The patient responds only to tactile painful stimuli (e.g. trapezius squeeze or nail bed pressure).
            Response may be localized withdrawal, moaning, or eye movement.
          </Text>
        </View>

        <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 border-l-4 border-l-rose-500 rounded-2xl p-5 shadow-sm mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-rose-700 dark:text-rose-400 font-bold text-lg font-sans">
              U — Unresponsive
            </Text>
            <Pill label="Medical Emergency" variant="error" size="sm" />
          </View>
          <Text className="text-rose-600 dark:text-rose-300 text-xs leading-5 font-semibold font-sans">
            The patient shows no eye, vocal, or motor response to voice or painful stimuli.
            Critical finding requiring immediate airway support and medical emergency activation.
          </Text>
        </View>
      </View>

      {/* ACVPU Clinical Context Note */}
      <View className="mb-6 bg-surface dark:bg-slate-900 border-2 border-clinical-pine/30 dark:border-teal-500/50 rounded-2xl p-5 shadow-sm">
        <Text className="text-clinical-pine dark:text-teal-400 font-bold text-sm mb-2 uppercase tracking-wider font-sans">
          NHS NEWS2 Update: ACVPU Scale
        </Text>
        <Text className="text-slate-600 dark:text-slate-300 text-xs leading-5 font-sans">
          Modern early warning systems (such as NHS NEWS2) use <Text className="font-bold text-navy dark:text-white">ACVPU</Text>, adding <Text className="font-bold text-clinical-pine dark:text-teal-400">C (New Confusion)</Text> between Alert and Voice. A new onset of confusion scores 3 points on NEWS2 as a key marker of early deterioration (e.g., sepsis, hypoxia, delirium).
        </Text>
      </View>

      {/* Safety Disclaimer */}
      <View className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 mb-8 shadow-sm">
        <Text className="text-amber-800 dark:text-amber-400 font-bold text-xs mb-1.5 uppercase tracking-wider font-sans">
          ⚠ Triage Reference Notice
        </Text>
        <Text className="text-amber-700/90 dark:text-amber-300/80 text-xs leading-5 font-sans">
          AVPU is a rapid triage tool. Any finding below Alert (V, P, or U) indicates
          neurological deterioration and requires prompt clinical evaluation.
        </Text>
      </View>
    </AppScreen>
  );
}
