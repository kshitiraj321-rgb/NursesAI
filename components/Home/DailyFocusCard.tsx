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
        <Text className="text-clinical-teal dark:text-teal-400 font-bold text-sm font-sans uppercase tracking-widest">
          {dailyTopic ? "Recommended Focus" : "Start Your Journey"}
        </Text>
        <Pill label="Daily Anchor" variant="info" size="sm" />
      </View>

      {dailyTopic ? (
        <View className="mb-4 mt-2">
          <Text className="text-navy dark:text-white text-2xl font-bold mb-1 tracking-tight font-sans">{dailyTopic}</Text>
          <Text className="text-slate-body dark:text-slate-400 text-sm mb-3 font-sans">Based on your weakness profile & active recall history</Text>
          {topicStat && (
            <View className="flex-row items-center space-x-2">
              <Pill label={`Accuracy: ${topicStat.accuracy}%`} variant="success" size="sm" />
              <Pill label={`${topicStat.mistakes} mistakes`} variant="warning" size="sm" />
            </View>
          )}
        </View>
      ) : (
        <Text className="text-slate-body dark:text-slate-400 text-sm mb-3 mt-2 font-sans">Begin exploring core nursing topics in the Learn workspace.</Text>
      )}

      <View className="mb-5">
        <ProgressBar progress={progress} height={8} color="#0D9488" />
      </View>

      <PrimaryButton
        label="Continue Learning →"
        onPress={traverse}
        variant="primary"
      />
    </GlassCard>
  );
}


