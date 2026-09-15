import React from "react";
import { Text, View } from "react-native";
import { GlassCard } from "../ui/GlassCard";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/ProgressBar";

interface Props {
  todayProgress: number;
  dailyGoal: number;
  streak: number;
  delay?: number;
}

export default function ProgressCard({ todayProgress, dailyGoal, streak }: Props) {
  const progressRatio = dailyGoal > 0 ? Math.min(todayProgress / dailyGoal, 1) : 0;

  return (
    <GlassCard variant="default" className="mb-6 p-5">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-navy dark:text-white text-base font-bold font-sans">Today&apos;s Study Goal</Text>
        <Text className="text-slate-body dark:text-slate-400 text-sm font-semibold font-sans">
          {todayProgress} / {dailyGoal} questions
        </Text>
      </View>

      <View className="mb-5">
        <ProgressBar progress={progressRatio} height={8} color="#0D9488" />
      </View>

      <View className="flex-row items-center justify-between pt-3 border-t border-border-subtle dark:border-slate-700">
        <View className="flex-row items-center space-x-2">
          <Text className="text-clinical-teal dark:text-teal-400 text-3xl font-extrabold font-sans">{streak}</Text>
          <Text className="text-xl">🔥</Text>
          <View>
            <Text className="text-navy dark:text-white text-sm font-bold font-sans">{streak} Day Streak</Text>
            <Text className="text-slate-body dark:text-slate-400 text-[12px] font-sans">
              {streak > 0 ? "Consistency building" : "Start your streak today"}
            </Text>
          </View>
        </View>

        <Pill label={streak > 0 ? "On Track" : "Get Started"} variant={streak > 0 ? "success" : "neutral"} size="sm" />
      </View>
    </GlassCard>
  );
}

