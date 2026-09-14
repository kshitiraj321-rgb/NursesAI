import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { practiceRepository } from "../data/practice/repository";
import { AppScreen } from "../components/ui/AppScreen";
import { PrimaryButton } from "../components/ui/PrimaryButton";

export default function PracticeResultsScreen() {
  const router = useRouter();
  const result = practiceRepository.getLatestSessionResult();

  if (!result) {
    return (
      <AppScreen edges={["top", "bottom"]}>
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-surface dark:bg-slate-900/80 border border-border-subtle dark:border-slate-800 p-6 rounded-2xl items-center w-full max-w-sm">
            <Text className="text-4xl mb-3">📋</Text>
            <Text className="text-navy dark:text-white font-bold text-lg mb-2 text-center">
              No Results Available
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-sm mb-6 text-center leading-5">
              Session data is unavailable. This may happen after an app restart.
            </Text>
            <View className="w-full">
              <PrimaryButton
                label="Return to Practice"
                onPress={() => router.replace("/(tabs)/practice" as any)}
              />
            </View>
          </View>
        </View>
      </AppScreen>
    );
  }

  const { 
    mode, 
    totalQuestions, 
    attemptedQuestions, 
    correctAnswers, 
    incorrectAnswers, 
    scorePercent, 
    persistenceStatus
  } = result;

  const isPerfect = scorePercent === 100;
  const hasPersistenceWarning = persistenceStatus === "PARTIAL_PERSISTENCE_FAILURE";

  return (
    <AppScreen edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        accessibilityLabel="Practice Results"
      >
        {/* Header */}
        <View className="items-center mb-8 mt-4">
          <Text className="text-4xl mb-3" accessibilityLabel={isPerfect ? "Perfect score" : "Results"}>
            {isPerfect ? "🏆" : scorePercent >= 70 ? "✅" : "📚"}
          </Text>
          <Text className="text-navy dark:text-white font-bold text-2xl mb-1 text-center">
            {isPerfect ? "Perfect Session!" : "Session Complete"}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-sm text-center capitalize">
            {mode.replace(/_/g, " ")} Practice
          </Text>
        </View>

        {/* Score Card */}
        <View
          className="bg-surface dark:bg-slate-900/80 border border-border-subtle dark:border-slate-700 rounded-2xl p-6 mb-4"
          accessibilityLabel={`Score: ${scorePercent} percent`}
        >
          <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold tracking-wider uppercase mb-3">
            Your Score
          </Text>

          {/* Large Score */}
          <View className="flex-row items-end mb-2">
            <Text className="text-emerald-600 dark:text-emerald-400 font-bold text-6xl leading-none">
              {scorePercent}
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-2xl font-semibold ml-1 mb-2">%</Text>
          </View>

          {/* Text-based status indicator */}
          <View className="flex-row items-center mb-4">
            <Text className={`font-bold text-sm ${scorePercent >= 70 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {scorePercent >= 70 ? "✓ Passing Score" : "⚠️ Needs Improvement"}
            </Text>
          </View>

          {/* Score Bar */}
          <View
            className="bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-6 overflow-hidden"
            accessibilityLabel={`Score bar showing ${scorePercent} percent`}
          >
            <View
              className="h-2 rounded-full"
              style={{
                width: `${scorePercent}%`,
                backgroundColor: scorePercent >= 70 ? "#059669" : "#e11d48",
              }}
            />
          </View>

          {/* Breakdown Grid */}
          <View className="flex-row gap-3">
            <View
              className="flex-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-3 items-center"
              accessibilityLabel={`${correctAnswers} correct answers`}
            >
              <Text className="text-emerald-700 dark:text-emerald-400 font-bold text-2xl">{correctAnswers}</Text>
              <Text className="text-emerald-600 dark:text-slate-400 text-xs mt-0.5">Correct</Text>
            </View>

            <View
              className="flex-1 bg-rose-50 dark:bg-red-500/10 border border-rose-200 dark:border-red-500/30 rounded-xl p-3 items-center"
              accessibilityLabel={`${incorrectAnswers} incorrect answers`}
            >
              <Text className="text-rose-700 dark:text-red-400 font-bold text-2xl">{incorrectAnswers}</Text>
              <Text className="text-rose-600 dark:text-slate-400 text-xs mt-0.5">Incorrect</Text>
            </View>

            <View
              className="flex-1 bg-slate-50 dark:bg-slate-800/60 border border-border-subtle dark:border-slate-700 rounded-xl p-3 items-center"
              accessibilityLabel={`${attemptedQuestions} of ${totalQuestions} questions attempted`}
            >
              <Text className="text-navy dark:text-slate-200 font-bold text-2xl">
                {attemptedQuestions}/{totalQuestions}
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Attempted</Text>
            </View>
          </View>
        </View>

        {/* Persistence Warning */}
        {hasPersistenceWarning && (
          <View
            className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/40 rounded-xl p-4 mb-4 flex-row items-start"
            accessibilityLabel="Persistence warning"
            accessibilityRole="alert"
          >
            <Text className="text-amber-600 dark:text-amber-400 text-base mr-2">⚠️</Text>
            <View className="flex-1">
              <Text className="text-amber-800 dark:text-amber-300 font-semibold text-sm mb-0.5">
                Some progress may not be saved
              </Text>
              <Text className="text-amber-700 dark:text-amber-400/80 text-xs leading-5">
                One or more attempts could not be persisted. Your in-session progress is accurate, but durable history may be incomplete.
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View className="gap-3 mt-4">
          <PrimaryButton
            label="Practice Again"
            variant="emerald"
            onPress={() => router.replace("/(tabs)/practice" as any)}
          />
          <PrimaryButton
            label="Return to Practice Hub"
            variant="outline"
            onPress={() => router.replace("/(tabs)/practice" as any)}
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
}
