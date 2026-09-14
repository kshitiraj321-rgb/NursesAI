import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { PracticeMode } from "../../data/types/practice";

interface ModeCardProps {
  mode: PracticeMode;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  onPress: () => void;
}

export function ModeCard({
  title,
  subtitle,
  icon,
  badge,
  onPress,
}: ModeCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Launch practice mode: ${title}`}
      className="bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 p-4 rounded-xl mb-3 flex-row items-center justify-between min-h-[64px]"
    >
      <View className="flex-row items-center flex-1 mr-2">
        <Text className="text-3xl mr-3">{icon}</Text>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-0.5">
            <Text className="text-navy dark:text-white font-bold text-sm">{title}</Text>
            <View className="bg-clinical-blue-light dark:bg-sky-950 px-2 py-0.5 rounded border border-clinical-blue-border dark:border-sky-800/60">
              <Text className="text-clinical-blue dark:text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                {badge}
              </Text>
            </View>
          </View>
          <Text className="text-slate-500 dark:text-slate-400 text-xs leading-4">{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
