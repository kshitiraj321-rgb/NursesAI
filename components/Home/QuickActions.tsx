import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { GlassCard } from "../ui/GlassCard";
import { SectionHeader } from "../ui/SectionHeader";
import { AnimatedPressable } from "../ui/AnimatedPressable";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  delay?: number;
}

export default function QuickActions({}: Props) {
  const router = useRouter();

  const handleNavigate = (route: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.push(route as any);
  };

  return (
    <View className="mb-6">
      <SectionHeader
        title="Quick Workstations"
        subtitle="Fast access to learning tools"
      />

      <View className="flex-row items-center justify-between space-x-3 mt-2">
        <View className="flex-1">
          <AnimatedPressable
            onPress={() => handleNavigate("/(tabs)/askai")}
          >
            <GlassCard className="p-4 border-l-4 border-l-sky-500 min-h-[90px] justify-between">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="chatbubble-outline" size={18} color="#38bdf8" />
                <Text className="text-white font-bold text-sm">Ask AI</Text>
              </View>
              <Text className="text-slate-400 text-xs mt-2">AI tutor & explanation</Text>
            </GlassCard>
          </AnimatedPressable>
        </View>

        <View className="flex-1">
          <AnimatedPressable
            onPress={() => handleNavigate("/(tabs)/learn")}
          >
            <GlassCard className="p-4 border-l-4 border-l-emerald-500 min-h-[90px] justify-between">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="book-outline" size={18} color="#34d399" />
                <Text className="text-white font-bold text-sm">Quick Learn</Text>
              </View>
              <Text className="text-slate-400 text-xs mt-2">Subject index & concepts</Text>
            </GlassCard>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}


