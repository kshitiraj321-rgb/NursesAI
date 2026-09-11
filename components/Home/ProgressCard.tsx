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
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white text-base font-bold">Today's Study Goal</Text>
        <Text className="text-slate-400 text-xs font-semibold">
          {todayProgress} / {dailyGoal} questions
        </Text>
      </View>

      <View className="mb-4">
        <ProgressBar progress={progressRatio} height={8} color="#10b981" />
      </View>

      <View className="flex-row items-center justify-between pt-2 border-t border-slate-800">
        <View className="flex-row items-center space-x-2">
          <Text className="text-sky-400 text-2xl font-extrabold">{streak}</Text>
          <Text className="text-xl">🔥</Text>
          <View>
            <Text className="text-white text-xs font-bold">{streak} Day Streak</Text>
            <Text className="text-slate-400 text-[11px]">
              {streak > 0 ? "Consistency building" : "Start your streak today"}
            </Text>
          </View>
        </View>

        <Pill label={streak > 0 ? "On Track" : "Get Started"} variant={streak > 0 ? "success" : "neutral"} size="sm" />
      </View>
    </GlassCard>
  );
}

