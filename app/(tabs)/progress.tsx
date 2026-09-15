import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { practiceRepository } from "../../data/practice/repository";
import { AppScreen } from "../../components/ui/AppScreen";
import { AppHeader } from "../../components/ui/AppHeader";
import { Pill } from "../../components/ui/Pill";

export default function ProgressScreen() {
  const { uid: userId } = useAuth();

  if (!userId) {
    return (
      <AppScreen edges={["top", "bottom"]}>
        <AppHeader title="Global Progress" showHome />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-slate-500 dark:text-slate-400">Please sign in to view progress.</Text>
        </View>
      </AppScreen>
    );
  }

  const hydrationState = practiceRepository.getHydrationState(userId);

  if (hydrationState.status === "LOADING" || hydrationState.status === "UNHYDRATED") {
    return (
      <AppScreen edges={["top", "bottom"]}>
        <AppHeader title="Global Progress" showHome />
        <View className="flex-1 justify-center items-center px-4" accessibilityRole="progressbar" accessibilityLabel="Loading your progress">
          <ActivityIndicator size="large" color="#0F766E" />
          <Text className="text-slate-500 dark:text-slate-400 mt-4 text-sm">Loading your mastery records...</Text>
        </View>
      </AppScreen>
    );
  }

  if (hydrationState.status === "ERROR") {
    return (
      <AppScreen edges={["top", "bottom"]}>
        <AppHeader title="Global Progress" showHome />
        <View className="flex-1 justify-center items-center px-4">
          <View className="p-8 items-center bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl w-full max-w-sm">
            <Text className="text-rose-700 dark:text-rose-400 font-bold text-lg mb-2 text-center">
              Data Unavailable
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 text-sm text-center leading-5">
              Could not load your mastery progress. Please try again later.
            </Text>
          </View>
        </View>
      </AppScreen>
    );
  }

  // Hydration is complete, safe to pull metrics
  const metrics = practiceRepository.getGlobalMasteryMetrics(userId);
  const activeMistakesCount = practiceRepository.getActiveMistakes(userId).length;

  if (metrics.totalConcepts === 0) {
    return (
      <AppScreen edges={["top", "bottom"]}>
        <AppHeader title="Global Progress" showHome />
        <View className="flex-1 justify-center items-center px-4">
          <View className="p-8 items-center bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl w-full max-w-sm">
            <Text className="text-navy dark:text-white font-bold text-lg mb-2 text-center">
              No Practice Data Yet
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-sm text-center leading-5">
              Complete practice sessions to start building your mastery profile.
            </Text>
          </View>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen edges={["top", "bottom"]}>
      <AppHeader title="Global Progress" subtitle="How am I progressing?" showHome />
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top level stats */}
        <View className="flex-row gap-4 mb-8 mt-2">
          <View className="flex-1">
            <View className="bg-clinical-teal/10 dark:bg-teal-900/20 border border-clinical-teal/20 dark:border-teal-800/50 p-5 rounded-[20px] items-center">
              <Text className="text-clinical-pine dark:text-teal-400 font-bold text-3xl mb-1 font-sans">{metrics.accuracy}%</Text>
              <Text className="text-clinical-pine/80 dark:text-teal-400/80 text-xs font-semibold uppercase tracking-wider text-center font-sans">
                Accuracy
              </Text>
            </View>
          </View>
          <View className="flex-1">
            <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 p-5 rounded-[20px] items-center">
              <Text className="text-navy dark:text-white font-bold text-3xl mb-1 font-sans">{metrics.totalConcepts}</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider text-center font-sans">
                Concepts
              </Text>
            </View>
          </View>
        </View>

        {/* Mastery Breakdown */}
        <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 px-1 font-sans">
          Mastery States
        </Text>
        <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-[20px] overflow-hidden mb-8 shadow-sm">
          <View className="flex-row items-center justify-between p-4 border-b border-border-subtle dark:border-slate-800">
            <Text className="text-navy dark:text-white font-medium text-base font-sans">Mastered</Text>
            <Text className="text-emerald-700 dark:text-emerald-400 font-bold text-lg font-sans">{metrics.mastered}</Text>
          </View>
          <View className="flex-row items-center justify-between p-4 border-b border-border-subtle dark:border-slate-800">
            <Text className="text-navy dark:text-white font-medium text-base font-sans">Improving</Text>
            <Text className="text-clinical-pine dark:text-teal-400 font-bold text-lg font-sans">{metrics.improving}</Text>
          </View>
          <View className="flex-row items-center justify-between p-4">
            <Text className="text-navy dark:text-white font-medium text-base font-sans">Weak</Text>
            <Text className="text-rose-700 dark:text-rose-400 font-bold text-lg font-sans">{metrics.weak}</Text>
          </View>
        </View>

        {/* Mistake Relationship */}
        <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 px-1 font-sans">
          Active Weaknesses
        </Text>
        <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-[20px] p-5 mb-8 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-navy dark:text-white font-semibold text-base font-sans">Current Focus</Text>
            <Pill label={String(activeMistakesCount)} variant={activeMistakesCount > 0 ? "error" : "success"} size="sm" />
          </View>
          <Text className="text-slate-500 dark:text-slate-400 text-sm leading-6 font-sans">
            Concepts currently flagged as weak due to recent mistakes. They require 2 consecutive correct attempts to resolve.
          </Text>
        </View>

        {/* Global Attempts */}
        <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 px-1 font-sans">
          Practice Volume
        </Text>
        <View className="flex-row gap-4 mb-8">
          <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 flex-1 p-5 rounded-[20px] items-center">
            <Text className="text-navy dark:text-white font-bold text-xl mb-1 font-sans">{metrics.totalAttempts}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-semibold font-sans">Total Attempts</Text>
          </View>
          <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 flex-1 p-5 rounded-[20px] items-center">
            <Text className="text-emerald-700 dark:text-emerald-400 font-bold text-xl mb-1 font-sans">{metrics.correctAttempts}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-semibold font-sans">Correct Attempts</Text>
          </View>
        </View>

        <Text className="text-slate-400 dark:text-slate-500 text-[10px] text-center px-4 uppercase tracking-wider leading-4 mb-4">
          Mastery is derived from your performance on current practice content and does not guarantee clinical accuracy in a real-world setting.
        </Text>
      </ScrollView>
    </AppScreen>
  );
}
