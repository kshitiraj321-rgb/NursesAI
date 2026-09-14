import React, { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { knowledgeRepository } from "../../data/knowledge/repository";
import {
  AppScreen,
  AppHeader,
  SectionHeader,
  AnimatedPressable,
} from "../../components/ui";

/**
 * Learn Hub — SLICE 2 Redesign
 *
 * Primary hierarchy: Continue Learning → Subjects
 * Answers: "What should I learn next?"
 * No invented statistics, streaks, XP, or fake data.
 */
export default function LearnScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const subjects = knowledgeRepository.getAllSubjects();

  // Continue Learning — uses first available subject/topic/concept
  const continueSubject = subjects.length > 0 ? subjects[0] : undefined;
  const continueTopics = continueSubject
    ? knowledgeRepository.getTopicsForSubject(continueSubject.id)
    : [];
  const continueTopic = continueTopics.length > 0 ? continueTopics[0] : undefined;
  const continueConcepts = continueTopic
    ? knowledgeRepository.getConceptsForTopic(continueTopic.id)
    : [];
  const continueConcept = continueConcepts.length > 0 ? continueConcepts[0] : undefined;

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects;
    const q = searchQuery.toLowerCase();
    return subjects.filter(
      (s) =>
        s.displayName.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
  }, [subjects, searchQuery]);

  const handleSelectSubject = (subjectId: string) => {
    router.push({ pathname: "/topics", params: { subjectId } });
  };

  const handleContinueLearning = () => {
    if (continueTopic && continueConcept) {
      router.push({
        pathname: "/concept-detail",
        params: { topicId: continueTopic.id, conceptId: continueConcept.id },
      });
    } else if (continueSubject) {
      handleSelectSubject(continueSubject.id);
    }
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <AppScreen scrollable edges={["top"]}>
      <AppHeader title="Learn" subtitle="Clinical knowledge library" />

      {/* ── Continue Learning ─────────────────────────────────────────── */}
      {!isSearching && continueSubject && continueTopic && (
        <View className="mb-6">
          <SectionHeader title="Continue Learning" />
          <TouchableOpacity
            onPress={handleContinueLearning}
            activeOpacity={0.92}
            accessibilityRole="button"
            accessibilityLabel={`Continue learning ${continueTopic.displayName || continueTopic.name}`}
            className="bg-clinical-blue rounded-xl p-4 min-h-[44px]"
          >
            <Text className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">
              {continueSubject.displayName}
            </Text>
            <Text className="text-white font-bold text-lg leading-snug mb-1">
              {continueTopic.displayName || continueTopic.name}
            </Text>
            {continueConcept && (
              <Text className="text-blue-100 text-xs mb-3">
                Up next: {continueConcept.title}
              </Text>
            )}
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-bold text-sm">Continue →</Text>
              <Text className="text-blue-200 text-xs">
                {continueConcepts.length} concepts
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Search ───────────────────────────────────────────────────── */}
      <View className="mb-5">
        <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-700 rounded-xl flex-row items-center px-3.5 min-h-[44px]">
          <Text className="text-muted text-sm mr-2">🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search subjects and topics…"
            placeholderTextColor="#94A3B8"
            className="flex-1 text-navy dark:text-white text-sm py-2.5"
            accessibilityLabel="Search subjects and topics"
          />
          {searchQuery.length > 0 && (
            <AnimatedPressable onPress={() => setSearchQuery("")}>
              <View className="ml-1 items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700">
                <Text className="text-slate-500 dark:text-slate-300 text-xs font-bold">✕</Text>
              </View>
            </AnimatedPressable>
          )}
        </View>
      </View>

      {/* ── Subjects ─────────────────────────────────────────────────── */}
      <View className="mb-6">
        <SectionHeader
          title={isSearching ? `Results (${filteredSubjects.length})` : `Subjects (${subjects.length})`}
          subtitle={isSearching ? undefined : "Clinical nursing taxonomy"}
        />

        {filteredSubjects.map((subject, index) => {
          const topicCount = knowledgeRepository.getTopicsForSubject(subject.id).length;
          const isLast = index === filteredSubjects.length - 1;

          return (
            <TouchableOpacity
              key={subject.id}
              onPress={() => handleSelectSubject(subject.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Open ${subject.displayName}`}
              className={`bg-surface dark:bg-slate-800 flex-row items-center px-4 py-3.5 min-h-[56px] ${
                index === 0 ? "rounded-t-xl" : ""
              } ${isLast ? "rounded-b-xl" : ""} border-x border-t border-border-subtle dark:border-slate-700 ${
                isLast ? "border-b" : ""
              }`}
            >
              {/* Left: text */}
              <View className="flex-1 mr-3">
                <Text className="text-navy dark:text-white font-semibold text-sm leading-snug">
                  {subject.displayName}
                </Text>
                {subject.description ? (
                  <Text className="text-slate-500 dark:text-slate-400 text-xs leading-4 mt-0.5" numberOfLines={1}>
                    {subject.description}
                  </Text>
                ) : null}
              </View>
              {/* Right: count + chevron */}
              <View className="flex-row items-center">
                <Text className="text-muted dark:text-slate-500 text-xs mr-2">
                  {topicCount} topics
                </Text>
                <Text className="text-muted dark:text-slate-500 text-base">›</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {filteredSubjects.length === 0 && (
          <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-xl p-6 items-center">
            <Text className="text-slate-500 dark:text-slate-400 text-sm text-center">
              No subjects found for &quot;{searchQuery}&quot;.
            </Text>
          </View>
        )}
      </View>
    </AppScreen>
  );
}
