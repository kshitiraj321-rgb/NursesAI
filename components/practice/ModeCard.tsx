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
      className="bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 p-5 rounded-[20px] mb-3 flex-row items-center justify-between min-h-[74px]"
    >
      <View className="flex-row items-center flex-1 mr-2">
        <Text className="text-3xl mr-3">{icon}</Text>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-navy dark:text-white font-bold text-[15px] font-sans">{title}</Text>
            <View className="bg-clinical-teal-light dark:bg-teal-950 px-2 py-0.5 rounded border border-clinical-teal-border dark:border-teal-800/60">
              <Text className="text-clinical-teal dark:text-teal-300 text-[10px] font-bold uppercase tracking-wider font-sans">
                {badge}
              </Text>
            </View>
          </View>
          <Text className="text-slate-body dark:text-slate-400 text-sm leading-5 font-sans">{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
