import React, { useState, useMemo } from "react";
import { View, Text, TextInput } from "react-native";
import { router } from "expo-router";
import { knowledgeRepository } from "../../data/knowledge/repository";
import {
  AppScreen,
  AppHeader,
  GlassCard,
  SectionHeader,
  Pill,
  AnimatedPressable,
} from "../../components/ui";

export default function LearnScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const subjects = knowledgeRepository.getAllSubjects();

  // Primary concept anchor for "Continue Learning" banner
  const continueSubject = subjects.length > 0 ? subjects[0] : undefined;
  const continueTopics = continueSubject ? knowledgeRepository.getTopicsForSubject(continueSubject.id) : [];
  const continueTopic = continueTopics.length > 0 ? continueTopics[0] : undefined;
  const continueConcepts = continueTopic ? knowledgeRepository.getConceptsForTopic(continueTopic.id) : [];
  const continueConcept = continueConcepts.length > 0 ? continueConcepts[0] : undefined;

  // Filter subjects based on search query
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
    router.push({
      pathname: "/topics",
      params: { subjectId },
    });
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

  return (
    <AppScreen scrollable edges={["top"]}>
      {/* App Header */}
      <AppHeader
        title="Learn"
        subtitle="Learn with purpose · Subject Index & Knowledge Graph"
        showHome
      />

      {/* Continue Learning Banner */}
      {continueSubject && continueTopic && (
        <View className="mb-6">
          <SectionHeader title="Continue Learning" />
          <GlassCard variant="interactive" onPress={handleContinueLearning}>
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
                {continueSubject.displayName}
              </Text>
              <Pill label="Active" variant="trust" size="sm" />
            </View>
            <Text className="text-white font-bold text-lg mb-1">
              {continueTopic.displayName || continueTopic.name}
            </Text>
            {continueConcept && (
              <Text className="text-slate-300 text-xs mb-3">
                Module: {continueConcept.title}
              </Text>
            )}
            <View className="flex-row items-center justify-between pt-2 border-t border-slate-800">
              <Text className="text-cyan-400 font-bold text-xs">
                Resume Concept Workspace →
              </Text>
              <Text className="text-slate-400 text-xs font-semibold">
                {continueConcepts.length} Concept Modules
              </Text>
            </View>
          </GlassCard>
        </View>
      )}

      {/* Search Input Field */}
      <View className="mb-6">
        <View className="bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 flex-row items-center">
          <Text className="text-slate-400 text-base mr-2">🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search subjects, topics, and clinical concepts..."
            placeholderTextColor="#64748B"
            className="flex-1 text-white text-sm font-normal py-0"
            accessibilityLabel="Search subjects, topics, and clinical concepts"
          />
          {searchQuery.length > 0 && (
            <AnimatedPressable onPress={() => setSearchQuery("")}>
              <Text className="text-slate-400 text-xs font-bold px-1">✕</Text>
            </AnimatedPressable>
          )}
        </View>
      </View>

      {/* Explore Subjects Section */}
      <View className="mb-6">
        <SectionHeader
          title={`Explore Subjects (${filteredSubjects.length})`}
          subtitle="Clinical Nursing Taxonomy"
        />

        {filteredSubjects.map((subject) => {
          const topicCount = knowledgeRepository.getTopicsForSubject(subject.id).length;
          return (
            <GlassCard
              key={subject.id}
              variant="default"
              onPress={() => handleSelectSubject(subject.id)}
            >
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-white font-bold text-base flex-1 mr-2">
                  {subject.displayName}
                </Text>
                <Pill label={subject.meta.verificationStatus} variant="trust" size="sm" />
              </View>

              <Text className="text-slate-300 text-xs leading-5 mb-3">
                {subject.description}
              </Text>

              <View className="flex-row items-center justify-between pt-2 border-t border-slate-800/80">
                <Text className="text-cyan-400 text-xs font-semibold">
                  Browse {topicCount} Clinical Topics →
                </Text>
                <Text className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  Verified Backbone
                </Text>
              </View>
            </GlassCard>
          );
        })}

        {filteredSubjects.length === 0 && (
          <View className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 items-center">
            <Text className="text-slate-400 text-sm text-center">
              No subjects found matching "{searchQuery}".
            </Text>
          </View>
        )}
      </View>
    </AppScreen>
  );
}
