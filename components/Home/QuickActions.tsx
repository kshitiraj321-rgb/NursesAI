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

export default function QuickActions(_props: Props) {
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
            <GlassCard className="p-4 border-l-[6px] border-l-clinical-teal min-h-[100px] justify-between">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="chatbubble-outline" size={20} color="#0D9488" />
                <Text className="text-navy dark:text-white font-bold text-[15px] font-sans">Ask AI</Text>
              </View>
              <Text className="text-slate-body dark:text-slate-400 text-sm mt-2 font-sans">AI tutor & explanation</Text>
            </GlassCard>
          </AnimatedPressable>
        </View>

        <View className="flex-1">
          <AnimatedPressable
            onPress={() => handleNavigate("/(tabs)/learn")}
          >
            <GlassCard className="p-4 border-l-[6px] border-l-clinical-pine min-h-[100px] justify-between">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="book-outline" size={20} color="#134E4A" />
                <Text className="text-navy dark:text-white font-bold text-[15px] font-sans">Quick Learn</Text>
              </View>
              <Text className="text-slate-body dark:text-slate-400 text-sm mt-2 font-sans">Subject index & concepts</Text>
            </GlassCard>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}


