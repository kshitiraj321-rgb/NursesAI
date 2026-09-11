/**
 * NurseAI Component — MistakeListItem
 *
 * Modernized practice item representing an active weak concept requiring retrieval resolution.
 */

import React from "react";
import { View, Text } from "react-native";
import type { MistakeRecord } from "../../data/types/practice";
import { knowledgeRepository } from "../../data/knowledge/repository";
import { GlassCard } from "../ui/GlassCard";
import { Pill } from "../ui/Pill";
import { AnimatedPressable } from "../ui/AnimatedPressable";
import { ProgressBar } from "../ui/ProgressBar";

interface MistakeListItemProps {
  mistake: MistakeRecord;
  onPressRetry: () => void;
}

export function MistakeListItem({ mistake, onPressRetry }: MistakeListItemProps) {
  const concept = knowledgeRepository.getConceptById(mistake.conceptId);
  const topic = knowledgeRepository.getTopicById(mistake.topicId);

  const consecutive = mistake.consecutiveCorrect;
  const progressFraction = consecutive / 2;

  return (
    <GlassCard variant="accent" className="mb-3 p-4">
      {/* Concept Header Row */}
      <View className="flex-row items-start justify-between mb-1">
        <Text className="text-white font-bold text-base flex-1 mr-2 leading-5">
          {concept ? concept.title : mistake.conceptId}
        </Text>
        <Pill label="WEAK" variant="error" size="sm" />
      </View>

      {/* Metadata Row */}
      <Text className="text-slate-400 text-xs font-medium mb-3">
        {topic ? topic.displayName : mistake.topicId} •{" "}
        <Text className="text-rose-400 font-semibold">{mistake.failureCount} failures</Text>
      </Text>

      {/* Resolution Progress Bar */}
      <View className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 mb-3">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-slate-300 text-xs font-semibold">
            Resolution Progress
          </Text>
          <Text className="text-amber-300 text-xs font-bold">
            {consecutive} / 2 correct
          </Text>
        </View>
        <ProgressBar progress={progressFraction} color="#F59E0B" height={6} />
      </View>

      {/* Retry Action Button */}
      <AnimatedPressable
        onPress={onPressRetry}
        activeScale={0.98}
        className="bg-amber-500 active:bg-amber-600 p-3 rounded-xl items-center flex-row justify-center space-x-2"
        accessibilityRole="button"
        accessibilityLabel={`Review ${concept ? concept.title : "concept"}`}
      >
        <Text className="text-slate-950 font-bold text-sm tracking-wide">
          REVIEW & RETRY →
        </Text>
      </AnimatedPressable>
    </GlassCard>
  );
}

