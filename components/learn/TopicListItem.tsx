import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { Topic } from "../../data/types/knowledge";
import { TrustBadge } from "./TrustBadge";

interface TopicListItemProps {
  topic: Topic;
  onPress: () => void;
}

export function TopicListItem({ topic, onPress }: TopicListItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl mb-3 flex-row items-center justify-between"
    >
      <View className="flex-1 mr-2">
        <Text className="text-white text-base font-bold mb-1">
          {topic.displayName || topic.name}
        </Text>

        <View className="flex-row items-center space-x-2 mt-1">
          <Text className="text-slate-400 text-xs font-medium mr-2">
            {topic.conceptIds.length} Clinical Concepts
          </Text>
          <TrustBadge status={topic.meta.verificationStatus} size="sm" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
