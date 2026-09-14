import React from "react";
import { View, Text } from "react-native";
import type { MistakeRecord } from "../../data/types/practice";
import { knowledgeRepository } from "../../data/knowledge/repository";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/ProgressBar";
import { SecondaryButton } from "../ui/SecondaryButton";

interface MistakeListItemProps {
  mistake: MistakeRecord;
  onPressViewDetail: () => void;
}

export function MistakeListItem({ mistake, onPressViewDetail }: MistakeListItemProps) {
  const concept = knowledgeRepository.getConceptById(mistake.conceptId);
  const topic = knowledgeRepository.getTopicById(mistake.topicId);

  const consecutive = mistake.consecutiveCorrect;
  const progressFraction = consecutive / 2;

  return (
    <View className="bg-surface dark:bg-slate-900 border-b border-border-subtle dark:border-slate-800 p-4">
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-navy dark:text-white font-bold text-base flex-1 mr-2 leading-5">
          {concept ? concept.title : mistake.conceptId}
        </Text>
        <Pill label="WEAK" variant="error" size="sm" />
      </View>

      <Text className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-4">
        {topic ? topic.displayName : mistake.topicId} •{" "}
        <Text className="text-rose-600 dark:text-rose-400 font-semibold">{mistake.failureCount} failures</Text>
      </Text>

      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1 mr-4">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
              Resolution Progress
            </Text>
            <Text className="text-clinical-blue dark:text-sky-400 text-xs font-bold">
              {consecutive} / 2 correct
            </Text>
          </View>
          <ProgressBar progress={progressFraction} color="#2563EB" height={6} />
        </View>
      </View>

      <SecondaryButton
        label="Review Details →"
        onPress={onPressViewDetail}
      />
    </View>
  );
}
