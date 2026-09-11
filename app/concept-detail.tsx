import React, { useState } from "react";
import { View, Text } from "react-native";
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
  AnimatedPressable,
} from "../components/ui";

type LearningMode = "quick_revision" | "full_answer" | "teach_me";

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
      {/* Top Header */}
      <AppHeader
        title={activeConcept ? activeConcept.title : topic?.displayName || "Concept Workspace"}
        subtitle={topic ? `Topic: ${topic.displayName || topic.name}` : "Clinical Concept Workspace"}
        showBack
        backText="Concepts"
      />

      {/* Concept Hero Card */}
      {topic && (
        <GlassCard variant="elevated" style={{ marginBottom: 16 }}>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
              {topic.displayName || topic.name}
            </Text>
            <Pill label={topic.meta.verificationStatus} variant="trust" size="sm" />
          </View>

          {activeConcept && (
            <Text className="text-white font-bold text-xl mb-3">
              {activeConcept.title}
            </Text>
          )}

          {/* Action: Practice This Concept (Strict conceptId routing) */}
          <PrimaryButton
            label="🎯 Practice This Concept (Active Retrieval)"
            variant="emerald"
            onPress={handlePracticeConcept}
          />
        </GlassCard>
      )}

      {/* 3-Mode Segmented Switcher Bar */}
      <View className="flex-row bg-slate-900 border border-slate-800 p-1.5 rounded-2xl mb-4">
        <AnimatedPressable
          onPress={() => setMode("quick_revision")}
          className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
            mode === "quick_revision" ? "bg-cyan-600 shadow-md" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              mode === "quick_revision" ? "text-white" : "text-slate-400"
            }`}
          >
            ⚡ Quick Revision
          </Text>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => setMode("full_answer")}
          className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
            mode === "full_answer" ? "bg-cyan-600 shadow-md" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              mode === "full_answer" ? "text-white" : "text-slate-400"
            }`}
          >
            📘 Full Answer
          </Text>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => setMode("teach_me")}
          className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
            mode === "teach_me" ? "bg-purple-600 shadow-md" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              mode === "teach_me" ? "text-white" : "text-slate-400"
            }`}
          >
            🤖 Teach Me
          </Text>
        </AnimatedPressable>
      </View>

      {/* Active Mode View */}
      {topic ? (
        <View className="flex-1 mb-6">
          {mode === "quick_revision" && topic.quickRevision && (
            <QuickRevisionView
              quickRevision={topic.quickRevision}
              mnemonic={primaryMnemonic}
            />
          )}

          {mode === "full_answer" && topic.fullAnswer && (
            <FullAnswerView
              fullAnswer={topic.fullAnswer}
              concepts={concepts}
            />
          )}

          {mode === "teach_me" && (
            <TeachMeView topic={topic} concept={activeConcept} />
          )}
        </View>
      ) : (
        <View className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 items-center justify-center my-6">
          <Text className="text-slate-400 text-sm text-center">
            Topic not found. Please select a topic from the Learn index.
          </Text>
        </View>
      )}
    </AppScreen>
  );
}
