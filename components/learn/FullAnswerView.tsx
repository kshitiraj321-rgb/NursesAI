import React from "react";
import { View, Text, ScrollView } from "react-native";
import type { FullAnswer, Concept } from "../../data/types/knowledge";
import { TrustBadge } from "./TrustBadge";

interface FullAnswerViewProps {
  fullAnswer: FullAnswer;
  concepts?: Concept[];
}

export function FullAnswerView({ fullAnswer, concepts }: FullAnswerViewProps) {
  return (
    <ScrollView className="flex-1 space-y-4">
      {/* Textbook Header */}
      <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-4">
        <Text className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
          📘 Comprehensive Textbook Answer
        </Text>
        <Text className="text-white text-base font-bold mb-2">
          {fullAnswer.definition}
        </Text>
        <Text className="text-slate-300 text-xs leading-5">
          {fullAnswer.introduction}
        </Text>
      </View>

      {/* Structured Sections */}
      <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-4">
        <Text className="text-white font-bold text-sm mb-1">Etiology & Risk Factors</Text>
        <Text className="text-slate-300 text-xs leading-5 mb-3">{fullAnswer.etiology}</Text>

        <Text className="text-white font-bold text-sm mb-1">Pathophysiology</Text>
        <Text className="text-slate-300 text-xs leading-5 mb-3">{fullAnswer.pathophysiology}</Text>

        <Text className="text-white font-bold text-sm mb-1">Clinical Manifestations</Text>
        <Text className="text-slate-300 text-xs leading-5 mb-3">{fullAnswer.clinicalManifestations}</Text>

        <Text className="text-white font-bold text-sm mb-1">Diagnostic Evaluation</Text>
        <Text className="text-slate-300 text-xs leading-5 mb-3">{fullAnswer.investigations}</Text>

        <Text className="text-white font-bold text-sm mb-1">Medical & Pharmacological Management</Text>
        <Text className="text-slate-300 text-xs leading-5 mb-3">{fullAnswer.management}</Text>

        <Text className="text-white font-bold text-sm mb-1">Nursing Care & Interventions</Text>
        <Text className="text-slate-300 text-xs leading-5">{fullAnswer.nursingManagement}</Text>
      </View>

      {/* Concepts Breakdown */}
      {concepts && concepts.length > 0 && (
        <View className="mb-4">
          <Text className="text-slate-300 font-bold text-sm mb-3">
            Sub-Concepts ({concepts.length})
          </Text>
          {concepts.map((c) => (
            <View key={c.id} className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 mb-3">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-cyan-300 font-bold text-xs">{c.title}</Text>
                <TrustBadge status={c.meta.verificationStatus} size="sm" />
              </View>
              <Text className="text-slate-300 text-xs leading-5 mb-2">{c.content}</Text>
              {c.keyTakeaways && c.keyTakeaways.length > 0 && (
                <Text className="text-slate-400 text-[11px]">
                  Takeaway: {c.keyTakeaways.join(" • ")}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Exam Tip */}
      {fullAnswer.examTip && (
        <View className="bg-amber-950/70 border border-amber-600/70 p-4 rounded-xl mb-8">
          <Text className="text-amber-300 font-bold text-xs uppercase mb-1">
            💡 Clinical Exam Pearl
          </Text>
          <Text className="text-amber-100 text-xs leading-5 font-semibold">
            {fullAnswer.examTip}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
