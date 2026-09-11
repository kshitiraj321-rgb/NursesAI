import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { Subject } from "../../data/types/knowledge";
import { TrustBadge } from "./TrustBadge";

interface SubjectCardProps {
  subject: Subject;
  onPress: () => void;
}

export function SubjectCard({ subject, onPress }: SubjectCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl mb-3 flex-row items-center justify-between"
    >
      <View className="flex-1 mr-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-white text-base font-bold flex-1 mr-2">
            {subject.displayName}
          </Text>
          {subject.weightage && (
            <View className="bg-blue-950 px-2 py-0.5 rounded border border-blue-700/60">
              <Text className="text-blue-300 text-xs font-bold">
                {subject.weightage}
              </Text>
            </View>
          )}
        </View>

        <Text className="text-slate-400 text-xs mb-2 leading-4">
          {subject.description || `${subject.name} modules and clinical topics.`}
        </Text>

        <View className="flex-row items-center space-x-2">
          <Text className="text-slate-400 text-xs font-medium mr-2">
            {subject.topicIds.length} Clinical Topics
          </Text>
          <TrustBadge status={subject.meta.verificationStatus} size="sm" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
