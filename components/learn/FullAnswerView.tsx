import React from "react";
import { View, Text, ScrollView } from "react-native";
import type { FullAnswer, Concept } from "../../data/types/knowledge";
import { TrustBadge } from "./TrustBadge";

/**
 * FullAnswerView — SLICE 2 Light-First Update
 *
 * Comprehensive textbook answer with structured clinical sections.
 * Sub-concepts shown as compact expandable rows.
 * Exam pearl at the end using amber semantic surface.
 */
interface FullAnswerViewProps {
  fullAnswer: FullAnswer;
  concepts?: Concept[];
}

/** Individual structured section within the full answer */
function AnswerSection({ label, content }: { label: string; content: string }) {
  if (!content) return null;
  return (
    <View className="mb-4">
      <Text className="text-navy dark:text-slate-200 font-bold text-sm mb-1">{label}</Text>
      <Text className="text-slate-600 dark:text-slate-300 text-xs leading-5">{content}</Text>
    </View>
  );
}

export function FullAnswerView({ fullAnswer, concepts }: FullAnswerViewProps) {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

      {/* ── Definition & Introduction ──────────────────────────────── */}
      <View className="bg-surface dark:bg-slate-800 p-4 rounded-xl border border-border-subtle dark:border-slate-700 mb-3">
        <Text className="text-clinical-blue dark:text-sky-400 font-bold text-xs uppercase tracking-wider mb-1.5">
          Comprehensive Answer
        </Text>
        <Text className="text-navy dark:text-white text-base font-bold mb-2">
          {fullAnswer.definition}
        </Text>
        <Text className="text-slate-500 dark:text-slate-300 text-xs leading-5">
          {fullAnswer.introduction}
        </Text>
      </View>

      {/* ── Structured Clinical Sections ──────────────────────────── */}
      <View className="bg-surface dark:bg-slate-800 p-4 rounded-xl border border-border-subtle dark:border-slate-700 mb-3">
        <AnswerSection label="Etiology & Risk Factors" content={fullAnswer.etiology} />
        <AnswerSection label="Pathophysiology" content={fullAnswer.pathophysiology} />
        <AnswerSection label="Clinical Manifestations" content={fullAnswer.clinicalManifestations} />
        <AnswerSection label="Diagnostic Evaluation" content={fullAnswer.investigations} />
        <AnswerSection label="Medical & Pharmacological Management" content={fullAnswer.management} />
        <View className="mb-0">
          <Text className="text-navy dark:text-slate-200 font-bold text-sm mb-1">
            Nursing Care & Interventions
          </Text>
          <Text className="text-slate-600 dark:text-slate-300 text-xs leading-5">
            {fullAnswer.nursingManagement}
          </Text>
        </View>
      </View>

      {/* ── Sub-Concepts ──────────────────────────────────────────── */}
      {concepts && concepts.length > 0 && (
        <View className="mb-3">
          <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 px-1">
            Sub-Concepts ({concepts.length})
          </Text>
          {concepts.map((c, index) => {
            const isFirst = index === 0;
            const isLast = index === concepts.length - 1;
            return (
              <View
                key={c.id}
                className={`bg-surface dark:bg-slate-800 px-4 py-3 border-x border-t border-border-subtle dark:border-slate-700
                  ${isFirst ? "rounded-t-xl" : ""}
                  ${isLast ? "rounded-b-xl border-b" : ""}
                `}
              >
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-clinical-teal dark:text-teal-400 font-bold text-xs flex-1 mr-2">
                    {c.title}
                  </Text>
                  <TrustBadge status={c.meta.verificationStatus} size="sm" />
                </View>
                <Text className="text-slate-500 dark:text-slate-400 text-xs leading-5 mb-1">
                  {c.content}
                </Text>
                {c.keyTakeaways && c.keyTakeaways.length > 0 && (
                  <Text className="text-slate-400 dark:text-slate-500 text-[11px]">
                    → {c.keyTakeaways.join(" · ")}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* ── Exam Pearl ────────────────────────────────────────────── */}
      {fullAnswer.examTip && (
        <View className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-600/60 p-4 rounded-xl mb-8">
          <Text className="text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-wide mb-1.5">
            Clinical Exam Pearl
          </Text>
          <Text className="text-amber-800 dark:text-amber-100 text-xs leading-5 font-semibold">
            {fullAnswer.examTip}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
