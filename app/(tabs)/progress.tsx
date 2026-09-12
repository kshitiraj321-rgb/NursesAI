import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { practiceRepository } from "../../data/practice/repository";
import { AppScreen } from "../../components/ui/AppScreen";
import { AppHeader } from "../../components/ui/AppHeader";
import { GlassCard } from "../../components/ui/GlassCard";
import { Pill } from "../../components/ui/Pill";

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { uid: userId } = useAuth();

  if (!userId) {
    return (
      <AppScreen edges={["top", "bottom"]}>
        <AppHeader title="Global Progress" showHome />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-slate-400">Please sign in to view progress.</Text>
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
          <ActivityIndicator size="large" color="#38BDF8" />
          <Text className="text-slate-400 mt-4 text-sm">Loading your mastery records...</Text>
        </View>
      </AppScreen>
    );
  }

  if (hydrationState.status === "ERROR") {
    return (
      <AppScreen edges={["top", "bottom"]}>
        <AppHeader title="Global Progress" showHome />
        <View className="flex-1 justify-center items-center px-4">
          <GlassCard className="p-6 items-center w-full max-w-sm border-rose-500/30 bg-rose-950/10">
            <Text className="text-3xl mb-2">⚠️</Text>
            <Text className="text-rose-400 font-bold text-lg mb-1 text-center">
              Data Unavailable
            </Text>
            <Text className="text-slate-400 text-sm text-center leading-5">
              Could not load your mastery progress. Please try again later.
            </Text>
          </GlassCard>
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
          <GlassCard className="p-6 items-center w-full max-w-sm">
            <Text className="text-3xl mb-2">🌱</Text>
            <Text className="text-white font-bold text-lg mb-1 text-center">
              No Practice Data Yet
            </Text>
            <Text className="text-slate-400 text-sm text-center leading-5">
              Complete practice sessions to start building your mastery profile.
            </Text>
          </GlassCard>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen edges={["top", "bottom"]}>
      <AppHeader title="Global Progress" subtitle="Your Mastery & Performance" showHome />
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top level stats */}
        <View className="flex-row gap-3 mb-6 mt-2">
          <View className="flex-1">
            <GlassCard className="p-4 items-center border-sky-500/20 bg-sky-950/10">
              <Text className="text-sky-400 font-bold text-3xl mb-1">{metrics.accuracy}%</Text>
              <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider text-center">
                Global Accuracy
              </Text>
            </GlassCard>
          </View>
          <View className="flex-1">
            <GlassCard className="p-4 items-center">
              <Text className="text-slate-200 font-bold text-3xl mb-1">{metrics.totalConcepts}</Text>
              <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider text-center">
                Concepts Practiced
              </Text>
            </GlassCard>
          </View>
        </View>

        {/* Mastery Breakdown */}
        <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">
          Concept Mastery States
        </Text>
        <GlassCard className="mb-6 p-1">
          <View className="flex-row items-center justify-between p-3 border-b border-slate-800/50">
            <View className="flex-row items-center">
              <Text className="text-emerald-400 mr-3 text-lg">🏆</Text>
              <Text className="text-slate-200 font-semibold text-base">Mastered</Text>
            </View>
            <Text className="text-white font-bold text-lg">{metrics.mastered}</Text>
          </View>
          <View className="flex-row items-center justify-between p-3 border-b border-slate-800/50">
            <View className="flex-row items-center">
              <Text className="text-sky-400 mr-3 text-lg">📈</Text>
              <Text className="text-slate-200 font-semibold text-base">Improving</Text>
            </View>
            <Text className="text-white font-bold text-lg">{metrics.improving}</Text>
          </View>
          <View className="flex-row items-center justify-between p-3">
            <View className="flex-row items-center">
              <Text className="text-rose-400 mr-3 text-lg">⚠️</Text>
              <Text className="text-slate-200 font-semibold text-base">Weak</Text>
            </View>
            <Text className="text-white font-bold text-lg">{metrics.weak}</Text>
          </View>
        </GlassCard>

        {/* Mistake Relationship */}
        <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">
          Mistakes & Weaknesses
        </Text>
        <GlassCard className="mb-6 p-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-slate-200 font-bold text-base">Active Weaknesses</Text>
            <Pill label={String(activeMistakesCount)} variant={activeMistakesCount > 0 ? "error" : "success"} size="sm" />
          </View>
          <Text className="text-slate-400 text-xs leading-5">
            Concepts currently flagged as weak due to recent mistakes. They require 2 consecutive correct attempts to resolve.
          </Text>
        </GlassCard>

        {/* Global Attempts */}
        <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">
          Volume
        </Text>
        <View className="flex-row gap-3 mb-6">
          <GlassCard className="flex-1 p-4 items-center">
            <Text className="text-white font-bold text-xl mb-1">{metrics.totalAttempts}</Text>
            <Text className="text-slate-400 text-[10px] uppercase font-semibold">Total Attempts</Text>
          </GlassCard>
          <GlassCard className="flex-1 p-4 items-center">
            <Text className="text-emerald-400 font-bold text-xl mb-1">{metrics.correctAttempts}</Text>
            <Text className="text-slate-400 text-[10px] uppercase font-semibold">Correct Attempts</Text>
          </GlassCard>
        </View>

        <Text className="text-slate-500 text-[10px] text-center px-4 uppercase tracking-wider mb-4">
          Mastery is derived from your performance on current practice content and does not guarantee clinical accuracy in a real-world setting.
        </Text>
      </ScrollView>
    </AppScreen>
  );
}
