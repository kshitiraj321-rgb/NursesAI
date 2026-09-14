import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { knowledgeRepository } from "../data/knowledge/repository";
import { practiceRepository } from "../data/practice/repository";
import { useAuth } from "../context/AuthContext";
import {
  AppScreen,
  AppHeader,
  GlassCard,
  SectionHeader,
  PrimaryButton,
  Pill,
} from "../components/ui";

/**
 * Concepts Screen — SLICE 2 Redesign
 *
 * Presents concepts for a given topic as structured study material.
 * Mastery/mistake status shown via real practiceRepository data only.
 * Topic hero card with primary CTA above concept list.
 */
export default function ConceptsScreen() {
  const { topicId } = useLocalSearchParams<{ topicId?: string }>();
  const router = useRouter();
  const { uid: userId } = useAuth();

  if (!userId) return null;

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
      <AppHeader
        title={topic ? topic.displayName || topic.name : "Concepts"}
        subtitle="Topic learning suite"
        showBack
        backText="Topics"
      />

      {/* ── Topic Hero ─────────────────────────────────────────────── */}
      {topic && (
        <View className="mb-5">
          <GlassCard variant="interactive">
            <View className="flex-row items-center justify-between mb-2">
              <Pill label={topic.meta.verificationStatus} variant="trust" size="sm" />
              <Text className="text-slate-500 dark:text-slate-400 text-xs">
                {concepts.length} concepts
              </Text>
            </View>

            {topic.quickRevision?.definition ? (
              <Text className="text-slate-600 dark:text-slate-300 text-xs leading-5 mb-4">
                {topic.quickRevision.definition}
              </Text>
            ) : null}

            <PrimaryButton
              label="Open Topic Learning Suite →"
              variant="primary"
              onPress={() => handleSelectConcept()}
            />
          </GlassCard>
        </View>
      )}

      {/* ── Concepts List ──────────────────────────────────────────── */}
      <View className="mb-6">
        <SectionHeader
          title={`Concepts (${concepts.length})`}
          subtitle="Individual study units"
        />

        {concepts.map((c, index) => {
          const mastery = practiceRepository.getConceptMastery(userId, c.id);
          const activeMistake = practiceRepository
            .getActiveMistakes(userId)
            .find((m) => m.conceptId === c.id);

          const isFirst = index === 0;
          const isLast = index === concepts.length - 1;

          // Determine status pill
          let statusPill: React.ReactNode;
          if (activeMistake) {
            statusPill = <Pill label="Weak" variant="error" size="sm" />;
          } else if (mastery?.state === "MASTERED") {
            statusPill = <Pill label="Mastered" variant="success" size="sm" />;
          } else if (mastery?.state === "IMPROVING") {
            statusPill = <Pill label="Improving" variant="info" size="sm" />;
          } else {
            statusPill = null;
          }

          return (
            <TouchableOpacity
              key={c.id}
              onPress={() => handleSelectConcept(c.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Study concept: ${c.title}`}
              className={`bg-surface dark:bg-slate-800 px-4 py-3.5 min-h-[60px]
                border-x border-t border-border-subtle dark:border-slate-700
                ${isFirst ? "rounded-t-xl" : ""}
                ${isLast ? "rounded-b-xl border-b" : ""}
              `}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-navy dark:text-white font-semibold text-sm leading-snug">
                    {c.title}
                  </Text>
                  {c.content ? (
                    <Text
                      className="text-slate-500 dark:text-slate-400 text-xs leading-4 mt-0.5"
                      numberOfLines={2}
                    >
                      {c.content}
                    </Text>
                  ) : null}
                  {c.keyTakeaways && c.keyTakeaways.length > 0 && (
                    <Text
                      className="text-clinical-teal dark:text-teal-400 text-xs mt-1.5"
                      numberOfLines={1}
                    >
                      → {c.keyTakeaways[0]}
                    </Text>
                  )}
                </View>
                <View className="flex-row items-center gap-1 mt-0.5">
                  {statusPill}
                  <Text className="text-muted dark:text-slate-500 text-base ml-1">›</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {concepts.length === 0 && (
          <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-xl p-6 items-center">
            <Text className="text-slate-500 dark:text-slate-400 text-sm text-center">
              No individual concept modules found.{"\n"}Tap above to open the Topic Learning Suite.
            </Text>
          </View>
        )}
      </View>
    </AppScreen>
  );
}
