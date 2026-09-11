import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { GlassCard } from "../ui/GlassCard";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/ProgressBar";
import { PrimaryButton } from "../ui/PrimaryButton";

interface Props {
  dailyTopic: string;
  progress: number;
  delay: number;
  topicStat?: { accuracy: number; mistakes: number } | null;
}

export default function DailyFocusCard({ dailyTopic, progress, topicStat }: Props) {
  const router = useRouter();

  const traverse = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    if (!dailyTopic) {
      router.push("/(tabs)/learn" as any);
      return;
    }

    router.push({
      pathname: "/quiz" as any,
      params: { type: "pyq", topic: dailyTopic },
    });
  };

  return (
    <GlassCard variant="elevated" className="mb-6 p-5">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sky-400 font-bold text-sm">
          {dailyTopic ? "Recommended Focus" : "Start Your Journey"}
        </Text>
        <Pill label="Daily Anchor" variant="info" size="sm" />
      </View>

      {dailyTopic ? (
        <View className="mb-3">
          <Text className="text-white text-xl font-bold mb-1 tracking-tight">{dailyTopic}</Text>
          <Text className="text-slate-400 text-xs mb-2">Based on your weakness profile & active recall history</Text>
          {topicStat && (
            <View className="flex-row items-center space-x-2">
              <Pill label={`Accuracy: ${topicStat.accuracy}%`} variant="success" size="sm" />
              <Pill label={`${topicStat.mistakes} mistakes`} variant="warning" size="sm" />
            </View>
          )}
        </View>
      ) : (
        <Text className="text-slate-300 text-xs mb-3">Begin exploring core nursing topics in the Learn workspace.</Text>
      )}

      <View className="mb-4">
        <ProgressBar progress={progress} height={6} color="#38bdf8" />
      </View>

      <PrimaryButton
        label="Continue Learning →"
        onPress={traverse}
        variant="primary"
      />
    </GlassCard>
  );
}


