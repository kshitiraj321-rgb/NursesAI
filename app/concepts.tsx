import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { knowledgeRepository } from "../data/knowledge/repository";
import { practiceRepository } from "../data/practice/repository";
import {
  AppScreen,
  AppHeader,
  GlassCard,
  SectionHeader,
  PrimaryButton,
  Pill,
} from "../components/ui";

export default function ConceptsScreen() {
  const { topicId } = useLocalSearchParams<{ topicId?: string }>();
  const router = useRouter();
  const userId = "user_default";

  const topic = topicId ? knowledgeRepository.getTopicById(topicId) : undefined;
  const concepts = topicId ? knowledgeRepository.getConceptsForTopic(topicId) : [];

  const handleSelectConcept = (conceptId?: string) => {
    router.push({
      pathname: "/concept-detail",
      params: { topicId, conceptId },
    });
  };

  return (
    <AppScreen scrollable edges={["top"]}>
      {/* Header with Back Button */}
      <AppHeader
        title={topic ? topic.displayName || topic.name : "Concepts"}
        subtitle="Topic Learning Suite & Sub-Concept Modules"
        showBack
        backText="Topics"
      />

      {/* Topic Hero Card */}
      {topic && (
        <GlassCard variant="interactive" style={{ marginBottom: 20 }}>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xl font-bold text-white flex-1 mr-2">
              {topic.displayName || topic.name}
            </Text>
            <Pill label={topic.meta.verificationStatus} variant="trust" size="sm" />
          </View>

          <Text className="text-slate-300 text-xs leading-5 mb-4">
            {topic.quickRevision?.definition || "Explore high-yield clinical concepts."}
          </Text>

          <PrimaryButton
            label="⚡ Open Topic Learning Suite (3 Modes)"
            variant="emerald"
            onPress={() => handleSelectConcept()}
          />
        </GlassCard>
      )}

      {/* Concepts List Section */}
      <View className="mb-6">
        <SectionHeader
          title={`Sub-Concepts (${concepts.length})`}
          subtitle="Individual concept modules & retrievable units"
        />

        {concepts.map((c) => {
          const mastery = practiceRepository.getConceptMastery(userId, c.id);
          const activeMistake = practiceRepository
            .getActiveMistakes(userId)
            .find((m) => m.conceptId === c.id);

          return (
            <GlassCard
              key={c.id}
              variant="default"
              onPress={() => handleSelectConcept(c.id)}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-bold text-base flex-1 mr-2">
                  {c.title}
                </Text>
                {activeMistake ? (
                  <Pill label="WEAK" variant="error" size="sm" />
                ) : mastery?.state === "MASTERED" ? (
                  <Pill label="MASTERED" variant="success" size="sm" />
                ) : (
                  <Pill label={c.meta.verificationStatus} variant="trust" size="sm" />
                )}
              </View>

              <Text className="text-slate-400 text-xs leading-4 mb-2" numberOfLines={2}>
                {c.content || "High-yield clinical concept module."}
              </Text>

              <View className="flex-row items-center justify-between pt-2 border-t border-slate-800/80">
                <Text className="text-cyan-400 text-xs font-semibold">
                  View Workspace →
                </Text>
                <Text className="text-slate-500 text-[11px] font-bold uppercase">
                  Concept ID: {c.id.split("_").pop()}
                </Text>
              </View>
            </GlassCard>
          );
        })}

        {concepts.length === 0 && (
          <View className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 items-center">
            <Text className="text-slate-400 text-xs text-center">
              No individual concept modules found. Tap above to view Topic Learning Suite.
            </Text>
          </View>
        )}
      </View>
    </AppScreen>
  );
}
