import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { knowledgeRepository } from "../data/knowledge/repository";
import {
  AppScreen,
  AppHeader,
  SectionHeader,
  Pill,
} from "../components/ui";

/**
 * Topics Screen — SLICE 2 Redesign
 *
 * Presents clinical topics for a given subject as clean, scannable rows.
 * Shows genuinely available metadata: topic name, concept count, definition preview.
 */
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
    router.push({ pathname: "/concepts", params: { topicId } });
  };

  return (
    <AppScreen scrollable edges={["top"]}>
      <AppHeader
        title={subject ? subject.displayName : subjectName || "Topics"}
        subtitle={subject?.description || "Clinical topic index"}
        showBack
        backText="Subjects"
      />

      <View className="mb-6">
        <SectionHeader
          title={`Topics (${topics.length})`}
          subtitle="Select a topic to open its concepts"
        />

        {/* Topic rows — grouped list style */}
        {topics.map((t, index) => {
          const conceptCount = knowledgeRepository.getConceptsForTopic(t.id).length;
          const isFirst = index === 0;
          const isLast = index === topics.length - 1;
          const definition = t.quickRevision?.definition;

          return (
            <TouchableOpacity
              key={t.id}
              onPress={() => handleSelectTopic(t.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Open topic: ${t.displayName || t.name}`}
              className={`bg-surface dark:bg-slate-800 px-4 py-3.5 min-h-[60px] flex-row items-center
                border-x border-t border-border-subtle dark:border-slate-700
                ${isFirst ? "rounded-t-[20px]" : ""}
                ${isLast ? "rounded-b-[20px] border-b" : ""}
              `}
            >
              {/* Text content */}
              <View className="flex-1 mr-3">
                <Text className="text-navy dark:text-white font-semibold text-sm leading-snug font-sans">
                  {t.displayName || t.name}
                </Text>
                {definition ? (
                  <Text
                    className="text-slate-500 dark:text-slate-400 text-xs leading-4 mt-0.5 font-sans"
                    numberOfLines={1}
                  >
                    {definition}
                  </Text>
                ) : null}
              </View>

              {/* Right side: count + verification + chevron */}
              <View className="flex-row items-center gap-2">
                <Text className="text-muted dark:text-slate-500 text-xs font-sans">
                  {conceptCount}
                </Text>
                <Pill label={t.meta.verificationStatus} variant="trust" size="sm" />
                <Text className="text-muted dark:text-slate-500 text-base ml-1">›</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {topics.length === 0 && (
          <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-[20px] p-6 items-center">
            <Text className="text-slate-500 dark:text-slate-400 text-sm text-center font-sans">
              No clinical topics found for this subject.
            </Text>
          </View>
        )}
      </View>
    </AppScreen>
  );
}
