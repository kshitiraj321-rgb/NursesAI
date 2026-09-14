import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import type { QuickRevision, Mnemonic } from "../../data/types/knowledge";

/**
 * QuickRevisionView — SLICE 2 Light-First Update
 *
 * Presents the 30-second high-yield summary, key causes, symptoms,
 * nursing management, red flags, mnemonic, and recall challenge.
 *
 * Design: white surfaces, border-subtle borders, semantic color blocks
 * (teal for nursing, rose for red flags, amber for recall/mnemonics).
 * No purple. No dark glass. No gradient.
 */
interface QuickRevisionViewProps {
  quickRevision: QuickRevision;
  mnemonic?: Mnemonic;
}

export function QuickRevisionView({
  quickRevision,
  mnemonic,
}: QuickRevisionViewProps) {
  const [showRecallAnswer, setShowRecallAnswer] = useState(false);

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

      {/* ── Definition banner ──────────────────────────────────────── */}
      <View className="bg-clinical-blue-light dark:bg-sky-950/60 border border-clinical-blue-border dark:border-sky-700/60 p-4 rounded-xl mb-3">
        <Text className="text-clinical-blue dark:text-sky-400 font-bold text-xs uppercase tracking-wider mb-1.5">
          30-Second High-Yield Summary
        </Text>
        <Text className="text-navy dark:text-sky-100 text-sm font-semibold leading-5">
          {quickRevision.definition}
        </Text>
      </View>

      {/* ── Key Causes & Symptoms grid ─────────────────────────────── */}
      <View className="flex-row gap-3 mb-3">
        <View className="flex-1 bg-surface dark:bg-slate-800 p-3.5 rounded-xl border border-border-subtle dark:border-slate-700">
          <Text className="text-navy dark:text-slate-200 font-bold text-xs mb-2 uppercase tracking-wide">
            Key Causes
          </Text>
          {quickRevision.keyCauses.map((item, idx) => (
            <Text key={idx} className="text-slate-600 dark:text-slate-300 text-xs leading-4 mb-1">
              · {item}
            </Text>
          ))}
        </View>

        <View className="flex-1 bg-surface dark:bg-slate-800 p-3.5 rounded-xl border border-border-subtle dark:border-slate-700">
          <Text className="text-navy dark:text-slate-200 font-bold text-xs mb-2 uppercase tracking-wide">
            Key Symptoms
          </Text>
          {quickRevision.keySymptoms.map((item, idx) => (
            <Text key={idx} className="text-slate-600 dark:text-slate-300 text-xs leading-4 mb-1">
              · {item}
            </Text>
          ))}
        </View>
      </View>

      {/* ── Nursing Interventions ─────────────────────────────────── */}
      <View className="bg-surface dark:bg-slate-800 p-4 rounded-xl border border-border-subtle dark:border-slate-700 mb-3">
        <Text className="text-clinical-teal dark:text-teal-400 font-bold text-xs uppercase tracking-wide mb-2">
          Priority Nursing Care
        </Text>
        {quickRevision.nursingManagement.map((item, idx) => (
          <Text key={idx} className="text-slate-600 dark:text-slate-300 text-xs leading-5 mb-1">
            · {item}
          </Text>
        ))}
      </View>

      {/* ── Red Flags ─────────────────────────────────────────────── */}
      {quickRevision.redFlags && quickRevision.redFlags.length > 0 && (
        <View className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-700/60 p-4 rounded-xl mb-3">
          <Text className="text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wide mb-1.5">
            Red Flags & Emergency Escalation
          </Text>
          {quickRevision.redFlags.map((flag, idx) => (
            <Text key={idx} className="text-rose-800 dark:text-rose-200 text-xs font-semibold leading-4 mb-0.5">
              ⚠ {flag}
            </Text>
          ))}
        </View>
      )}

      {/* ── Mnemonic ──────────────────────────────────────────────── */}
      {mnemonic && (
        <View className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-700/60 p-4 rounded-xl mb-3">
          <Text className="text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-wide mb-1.5">
            Mnemonic Hook
          </Text>
          <Text className="text-navy dark:text-white font-extrabold text-lg mb-1">
            {mnemonic.mnemonic}
          </Text>
          <Text className="text-amber-800 dark:text-amber-200 text-xs leading-4">
            {mnemonic.expansion}
          </Text>
        </View>
      )}

      {/* ── 30-Second Recall Challenge ────────────────────────────── */}
      <View className="bg-surface dark:bg-slate-800 p-4 rounded-xl border border-border-subtle dark:border-slate-700 mb-8">
        <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wide mb-1.5">
          30-Second Recall Challenge
        </Text>
        <Text className="text-navy dark:text-white text-sm font-semibold mb-3">
          {quickRevision.thirtySecondRecall}
        </Text>

        <TouchableOpacity
          onPress={() => setShowRecallAnswer(!showRecallAnswer)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={showRecallAnswer ? "Hide answer" : "Reveal answer"}
          className="border border-clinical-blue-border dark:border-sky-700 bg-clinical-blue-light dark:bg-sky-950/40 p-2.5 rounded-lg items-center min-h-[44px] justify-center"
        >
          <Text className="text-clinical-blue dark:text-sky-300 font-bold text-xs">
            {showRecallAnswer ? "Hide Answer" : "Tap to Reveal Answer"}
          </Text>
        </TouchableOpacity>

        {showRecallAnswer && (
          <View className="mt-3 bg-warm-bg dark:bg-slate-900 p-3 rounded-lg border border-border-subtle dark:border-slate-700">
            <Text className="text-slate-600 dark:text-slate-300 text-xs leading-5">
              Focus on priority nursing assessment (ABCs, vital signs, and baseline monitoring) followed by immediate notification of the healthcare provider if red flags are present.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
