import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { practiceRepository } from "../data/practice/repository";
import { knowledgeRepository } from "../data/knowledge/repository";
import { AppScreen } from "../components/ui/AppScreen";
import { AppHeader } from "../components/ui/AppHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { PrimaryButton } from "../components/ui/PrimaryButton";

export default function MistakeDetailScreen() {
  const { conceptId } = useLocalSearchParams<{ conceptId: string }>();
  const router = useRouter();
  const { uid: userId } = useAuth();

  if (!userId || !conceptId) {
    return null;
  }

  // 1. Fetch mistake record deterministically
  const mistake = practiceRepository.getMistakeByConceptId(userId, conceptId);

  if (!mistake) {
    return (
      <AppScreen edges={["top", "bottom"]}>
        <AppHeader title="Mistake Details" showBack onBack={() => router.back()} />
        <View className="flex-1 justify-center items-center px-4">
          <GlassCard className="p-6 items-center w-full max-w-sm">
            <Text className="text-3xl mb-2">🔍</Text>
            <Text className="text-white font-bold text-lg mb-1 text-center">
              Mistake Not Found
            </Text>
            <Text className="text-slate-400 text-sm mb-6 text-center leading-5">
              We could not locate this mistake record. It may have been already resolved.
            </Text>
            <PrimaryButton label="Return to Mistake Bank" onPress={() => router.back()} />
          </GlassCard>
        </View>
      </AppScreen>
    );
  }

  // 2. Resolve related data
  const concept = knowledgeRepository.getConceptById(mistake.conceptId);
  const questions = practiceRepository.getQuestionsForConcept(mistake.conceptId);
  const failedQuestion = questions.find((q) => q.id === mistake.questionId);

  const handleRetry = () => {
    router.push({
      pathname: "/practice-session",
      params: { conceptId: mistake.conceptId },
    });
  };

  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      <AppHeader
        title="Mistake Detail"
        subtitle={concept ? concept.title : "Concept"}
        showBack
        backText="Bank"
        onBack={() => router.back()}
      />

      {/* 3. The exact attempt attribution limitation */}
      <View
        className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 mb-4 flex-row"
        accessibilityRole="alert"
      >
        <Text className="text-slate-300 text-base mr-3">ℹ️</Text>
        <View className="flex-1">
          <Text className="text-slate-200 font-semibold text-sm mb-1">
            Exact selected answer unavailable
          </Text>
          <Text className="text-slate-400 text-xs leading-4">
            We know you struggled with this concept on the question below, but we cannot deterministically link the exact historical answer you selected during that session.
          </Text>
        </View>
      </View>

      {/* 4. The Question */}
      {failedQuestion ? (
        <View className="mb-6">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 px-1">
            Latest Failed Question
          </Text>
          <GlassCard variant="default" className="p-5 mb-4">
            <Text className="text-slate-200 text-base leading-6 mb-4">
              {failedQuestion.questionText}
            </Text>

            {/* Options */}
            <View className="space-y-2 mb-4">
              {failedQuestion.options.map((option, idx) => {
                const isCorrect = idx === failedQuestion.correctOptionIndex;
                return (
                  <View
                    key={idx}
                    className={`p-3 rounded-lg border flex-row items-start ${
                      isCorrect
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-slate-900/60 border-slate-800"
                    }`}
                    accessibilityLabel={isCorrect ? "Correct answer" : "Incorrect option"}
                  >
                    <Text className="text-slate-300 text-sm flex-1">{option}</Text>
                    {isCorrect && (
                      <Text className="text-emerald-400 font-bold ml-2">✓ Correct</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </GlassCard>

          {/* 5. Why Wrong / Explanation */}
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 px-1">
            Why Wrong? (Explanation)
          </Text>
          <GlassCard variant="default" className="p-5 mb-6">
            {/* Safety Guard: Check verification status */}
            {failedQuestion.meta.verificationStatus === "REVIEW_REQUIRED" && (
              <View className="bg-amber-500/10 border border-amber-500/40 rounded-lg p-3 mb-4 flex-row items-center">
                <Text className="text-amber-400 mr-2">⚠️</Text>
                <Text className="text-amber-300 font-semibold text-xs flex-1">
                  UNVERIFIED: This explanation requires clinical review and is not authoritative.
                </Text>
              </View>
            )}

            <Text className="text-slate-300 text-sm leading-6">
              {failedQuestion.explanation}
            </Text>
            <Text className="text-slate-500 text-[10px] mt-4 uppercase tracking-widest font-semibold">
              Note: The correct answer above is not necessarily the one you selected.
            </Text>
          </GlassCard>
        </View>
      ) : (
        <GlassCard className="p-6 items-center mb-6">
          <Text className="text-slate-400 text-sm text-center">
            Question data is currently unavailable.
          </Text>
        </GlassCard>
      )}

      {/* 6. Retry Workflow */}
      <View className="mt-2 mb-8">
        <PrimaryButton
          label="RETRY CONCEPT →"
          variant="emerald"
          onPress={handleRetry}
        />
      </View>
    </AppScreen>
  );
}
