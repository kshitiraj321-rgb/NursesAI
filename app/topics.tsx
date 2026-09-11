import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { knowledgeRepository } from "../data/knowledge/repository";
import {
  AppScreen,
  AppHeader,
  GlassCard,
  SectionHeader,
  Pill,
} from "../components/ui";

export default function TopicsScreen() {
  const { subjectId, subjectName } = useLocalSearchParams<{
    subjectId?: string;
    subjectName?: string;
  }>();
  const router = useRouter();

  let subject = subjectId ? knowledgeRepository.getSubjectById(subjectId) : undefined;
  if (!subject && subjectName) {
    const found = knowledgeRepository.getAllSubjects().find(
      (s) => s.name === subjectName || s.displayName === subjectName
    );
    if (found) subject = found;
  }

  const topics = subject ? knowledgeRepository.getTopicsForSubject(subject.id) : [];

  const handleSelectTopic = (topicId: string) => {
    router.push({
      pathname: "/concepts",
      params: { topicId },
    });
  };

  return (
    <AppScreen scrollable edges={["top"]}>
      {/* Header with Back Button */}
      <AppHeader
        title={subject ? subject.displayName : subjectName || "Topics"}
        subtitle={subject ? subject.description : "Clinical topic index"}
        showBack
        backText="Subjects"
      />

      {/* Topics List Section */}
      <View className="mb-6">
        <SectionHeader
          title={`Clinical Topics (${topics.length})`}
          subtitle="Select a topic to open concepts and learning suite"
        />

        {topics.map((t) => {
          const conceptCount = knowledgeRepository.getConceptsForTopic(t.id).length;
          return (
            <GlassCard
              key={t.id}
              variant="default"
              onPress={() => handleSelectTopic(t.id)}
            >
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-white font-bold text-base flex-1 mr-2">
                  {t.displayName || t.name}
                </Text>
                <Pill label={t.meta.verificationStatus} variant="trust" size="sm" />
              </View>

              <Text className="text-slate-300 text-xs leading-5 mb-3">
                {t.quickRevision?.definition || "Explore high-yield clinical concepts."}
              </Text>

              <View className="flex-row items-center justify-between pt-2 border-t border-slate-800/80">
                <Text className="text-cyan-400 text-xs font-semibold">
                  Open {conceptCount} Concept Modules →
                </Text>
                <Text className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  3 Learning Modes
                </Text>
              </View>
            </GlassCard>
          );
        })}

        {topics.length === 0 && (
          <View className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 items-center">
            <Text className="text-slate-400 text-xs text-center">
              No clinical topics found for this subject.
            </Text>
          </View>
        )}
      </View>
    </AppScreen>
  );
}
