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
      activeOpacity={0.8}
      className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl mb-3 flex-row items-center justify-between"
    >
      <View className="flex-row items-center flex-1 mr-2">
        <Text className="text-3xl mr-3">{icon}</Text>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-0.5">
            <Text className="text-white font-bold text-base">{title}</Text>
            <View className="bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
              <Text className="text-cyan-300 text-[10px] font-bold uppercase">
                {badge}
              </Text>
            </View>
          </View>
          <Text className="text-slate-400 text-xs leading-4">{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
