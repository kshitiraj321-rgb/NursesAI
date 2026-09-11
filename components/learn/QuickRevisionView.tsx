import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import type { QuickRevision, Mnemonic } from "../../data/types/knowledge";

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
    <ScrollView className="flex-1 space-y-4">
      {/* 30-second High-Yield Banner */}
      <View className="bg-cyan-950/80 border border-cyan-600/60 p-4 rounded-xl mb-4">
        <Text className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
          ⚡ 30-Second High-Yield Summary
        </Text>
        <Text className="text-cyan-100 text-sm font-semibold leading-5">
          {quickRevision.definition}
        </Text>
      </View>

      {/* Key Causes & Symptoms Grid */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-slate-800 p-3.5 rounded-xl border border-slate-700">
          <Text className="text-slate-200 font-bold text-xs mb-2">
            🔑 Key Causes / Etiology
          </Text>
          {quickRevision.keyCauses.map((item, idx) => (
            <Text key={idx} className="text-slate-300 text-xs leading-4 mb-1">
              • {item}
            </Text>
          ))}
        </View>

        <View className="flex-1 bg-slate-800 p-3.5 rounded-xl border border-slate-700">
          <Text className="text-slate-200 font-bold text-xs mb-2">
            🩺 Key Symptoms
          </Text>
          {quickRevision.keySymptoms.map((item, idx) => (
            <Text key={idx} className="text-slate-300 text-xs leading-4 mb-1">
              • {item}
            </Text>
          ))}
        </View>
      </View>

      {/* Nursing Interventions */}
      <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-4">
        <Text className="text-emerald-400 font-bold text-xs uppercase mb-2">
          👩‍⚕️ Priority Nursing Care
        </Text>
        {quickRevision.nursingManagement.map((item, idx) => (
          <Text key={idx} className="text-slate-200 text-xs leading-5 mb-1">
            • {item}
          </Text>
        ))}
      </View>

      {/* Red Flags Banner */}
      {quickRevision.redFlags && quickRevision.redFlags.length > 0 && (
        <View className="bg-rose-950/70 border border-rose-700/60 p-4 rounded-xl mb-4">
          <Text className="text-rose-400 font-bold text-xs uppercase mb-1">
            🚨 Red Flags & Emergency Escalation
          </Text>
          {quickRevision.redFlags.map((flag, idx) => (
            <Text key={idx} className="text-rose-100 text-xs font-semibold leading-4 mb-0.5">
              ⚠ {flag}
            </Text>
          ))}
        </View>
      )}

      {/* Mnemonic Hook */}
      {mnemonic && (
        <View className="bg-purple-950/80 border border-purple-700/60 p-4 rounded-xl mb-4">
          <Text className="text-purple-300 font-bold text-xs uppercase mb-1">
            💡 Mnemonic Hook
          </Text>
          <Text className="text-white font-extrabold text-lg mb-1">
            {mnemonic.mnemonic}
          </Text>
          <Text className="text-purple-200 text-xs leading-4">
            {mnemonic.expansion}
          </Text>
        </View>
      )}

      {/* 30-Second Recall Challenge */}
      <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-8">
        <Text className="text-amber-400 font-bold text-xs uppercase mb-1">
          🧠 30-Second Recall Challenge
        </Text>
        <Text className="text-white text-sm font-semibold mb-3">
          {quickRevision.thirtySecondRecall}
        </Text>

        <TouchableOpacity
          onPress={() => setShowRecallAnswer(!showRecallAnswer)}
          className="bg-amber-500/20 border border-amber-500/40 p-2.5 rounded-lg items-center"
        >
          <Text className="text-amber-300 font-bold text-xs">
            {showRecallAnswer ? "Hide Answer" : "Tap to Reveal Answer"}
          </Text>
        </TouchableOpacity>

        {showRecallAnswer && (
          <View className="mt-3 bg-slate-900 p-3 rounded-lg border border-slate-700">
            <Text className="text-slate-200 text-xs leading-5">
              Answer: Focus on priority nursing assessment (ABCs, vital signs, and baseline monitoring) followed by immediate notification of the healthcare provider if red flags are present.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
