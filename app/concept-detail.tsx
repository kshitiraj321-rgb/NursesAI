import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { knowledgeRepository } from "../data/knowledge/repository";
import { QuickRevisionView } from "../components/learn/QuickRevisionView";
import { FullAnswerView } from "../components/learn/FullAnswerView";
import { TeachMeView } from "../components/learn/TeachMeView";
import {
  AppScreen,
  AppHeader,
  GlassCard,
  PrimaryButton,
  Pill,
} from "../components/ui";

/**
 * Concept Detail Screen — SLICE 2 Redesign
 *
 * Three learning modes: Quick Revision | Full Answer | Teach Me
 * Mode switcher uses clinical pine for active state.
 * All learning data and navigation logic unchanged.
 */
type LearningMode = "quick_revision" | "full_answer" | "teach_me";

const MODES: { key: LearningMode; label: string }[] = [
  { key: "quick_revision", label: "Quick Revision" },
  { key: "full_answer", label: "Full Answer" },
  { key: "teach_me", label: "Teach Me" },
];

export default function ConceptDetailScreen() {
  const { topicId, conceptId } = useLocalSearchParams<{
    topicId?: string;
    conceptId?: string;
  }>();
  const router = useRouter();

  const [mode, setMode] = useState<LearningMode>("quick_revision");

  const topic = topicId ? knowledgeRepository.getTopicById(topicId) : undefined;
  const concepts = topicId ? knowledgeRepository.getConceptsForTopic(topicId) : [];
  const activeConcept = conceptId ? knowledgeRepository.getConceptById(conceptId) : undefined;
  const mnemonics = topicId ? knowledgeRepository.getMnemonicsForTopic(topicId) : [];
  const primaryMnemonic = mnemonics.length > 0 ? mnemonics[0] : undefined;

  const handlePracticeConcept = () => {
    const targetConceptId = activeConcept ? activeConcept.id : concepts[0]?.id;
    if (targetConceptId) {
      router.push({
        pathname: "/practice-session",
        params: { conceptId: targetConceptId },
      });
    }
  };

  return (
    <AppScreen scrollable edges={["top"]}>
      {/* Header */}
      <AppHeader
        title={activeConcept ? activeConcept.title : topic?.displayName || "Concept"}
        subtitle={topic ? `${topic.displayName || topic.name}` : "Clinical concept"}
        showBack
        backText="Concepts"
      />

      {/* ── Concept context card ────────────────────────────────────── */}
      {topic && (
        <GlassCard variant="default" style={{ marginBottom: 16 }}>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-clinical-teal dark:text-teal-400 text-xs font-semibold uppercase tracking-wider flex-1 mr-2 font-sans">
              {topic.displayName || topic.name}
            </Text>
            <Pill label={topic.meta.verificationStatus} variant="trust" size="sm" />
          </View>

          {activeConcept && (
            <Text className="text-navy dark:text-white font-bold text-lg leading-snug mb-3 font-sans">
              {activeConcept.title}
            </Text>
          )}

          <PrimaryButton
            label="Practice This Concept →"
            variant="primary"
            onPress={handlePracticeConcept}
          />
        </GlassCard>
      )}

      {/* ── Mode Switcher ───────────────────────────────────────────── */}
      <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-700 p-1 rounded-xl mb-4 flex-row">
        {MODES.map((m) => {
          const isActive = mode === m.key;
          return (
            <TouchableOpacity
              key={m.key}
              onPress={() => setMode(m.key)}
              activeOpacity={0.8}
              accessibilityRole="tab"
              accessibilityLabel={m.label}
              accessibilityState={{ selected: isActive }}
              className={`flex-1 py-2.5 rounded-lg items-center justify-center min-h-[44px] ${
                isActive
                  ? "bg-clinical-pine"
                  : "bg-transparent"
              }`}
            >
              <Text
                className={`text-xs font-bold font-sans ${
                  isActive
                    ? "text-white"
                    : "text-slate-500 dark:text-slate-400"
                }`}
                numberOfLines={1}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Active Mode View ────────────────────────────────────────── */}
      {topic ? (
        <View className="flex-1 mb-6">
          {mode === "quick_revision" && topic.quickRevision && (
            <QuickRevisionView
              quickRevision={topic.quickRevision}
              mnemonic={primaryMnemonic}
            />
          )}
          {mode === "quick_revision" && !topic.quickRevision && (
            <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-[20px] p-6 items-center">
              <Text className="text-slate-500 dark:text-slate-400 text-sm text-center font-sans">
                Quick revision content is not yet available for this topic.
              </Text>
            </View>
          )}

          {mode === "full_answer" && topic.fullAnswer && (
            <FullAnswerView fullAnswer={topic.fullAnswer} concepts={concepts} />
          )}
          {mode === "full_answer" && !topic.fullAnswer && (
            <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-[20px] p-6 items-center">
              <Text className="text-slate-500 dark:text-slate-400 text-sm text-center font-sans">
                Full answer content is not yet available for this topic.
              </Text>
            </View>
          )}

          {mode === "teach_me" && (
            <TeachMeView topic={topic} concept={activeConcept} />
          )}
        </View>
      ) : (
        <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-[20px] p-6 items-center my-6">
          <Text className="text-slate-500 dark:text-slate-400 text-sm text-center font-sans">
            Topic not found. Please select a topic from the Learn index.
          </Text>
        </View>
      )}
    </AppScreen>
  );
}
