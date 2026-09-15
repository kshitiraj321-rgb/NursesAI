import React from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { practiceRepository } from "../data/practice/repository";
import { knowledgeRepository } from "../data/knowledge/repository";
import { AppScreen } from "../components/ui/AppScreen";
import { AppHeader } from "../components/ui/AppHeader";
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
          <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 p-8 rounded-[20px] items-center w-full max-w-sm">
            <Text className="text-navy dark:text-white font-bold text-lg mb-2 text-center font-sans">
              Mistake Not Found
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-sm mb-6 text-center leading-5 font-sans">
              We could not locate this mistake record. It may have been already resolved.
            </Text>
            <PrimaryButton label="Return to Mistake Bank" onPress={() => router.back()} />
          </View>
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
        className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 mb-6 flex-row"
        accessibilityRole="alert"
      >
        <Text className="text-amber-500 text-base mr-3 mt-0.5">ℹ️</Text>
        <View className="flex-1">
          <Text className="text-amber-800 dark:text-amber-300 font-semibold text-sm mb-1 font-sans">
            Exact selected answer unavailable
          </Text>
          <Text className="text-amber-700/80 dark:text-amber-400/80 text-xs leading-5 font-sans">
            We know you struggled with this concept on the question below, but we cannot deterministically link the exact historical answer you selected during that session.
          </Text>
        </View>
      </View>

      {/* 4. The Question */}
      {failedQuestion ? (
        <View className="mb-8">
          <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 px-1 font-sans">
            Latest Failed Question
          </Text>
          <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-[20px] p-5 mb-6">
            <Text className="text-navy dark:text-white text-base leading-6 mb-5 font-sans">
              {failedQuestion.questionText}
            </Text>

            {/* Options */}
            <View className="space-y-3 mb-1">
              {failedQuestion.options.map((option, idx) => {
                const isCorrect = idx === failedQuestion.correctOptionIndex;
                return (
                  <View
                    key={idx}
                    className={`p-4 rounded-xl border flex-row items-start ${
                      isCorrect
                        ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50"
                        : "bg-surface dark:bg-slate-800/50 border-border-subtle dark:border-slate-700"
                    }`}
                    accessibilityLabel={isCorrect ? "Correct answer" : "Option"}
                  >
                    <Text className={`text-sm flex-1 leading-5 font-sans ${isCorrect ? 'text-emerald-900 dark:text-emerald-100' : 'text-slate-600 dark:text-slate-300'}`}>{option}</Text>
                    {isCorrect && (
                      <Text className="text-emerald-700 dark:text-emerald-400 font-bold ml-3 font-sans">✓ Correct</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* 5. Why Wrong / Explanation */}
          <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 px-1 font-sans">
            Why Wrong? (Explanation)
          </Text>
          <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-[20px] p-5 mb-6">
            {/* Safety Guard: Check verification status */}
            {failedQuestion.meta.verificationStatus === "REVIEW_REQUIRED" && (
              <View className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 mb-4 flex-row items-center">
                <Text className="text-amber-500 mr-2">⚠️</Text>
                <Text className="text-amber-800 dark:text-amber-300 font-semibold text-xs flex-1 leading-5 font-sans">
                  UNVERIFIED: This explanation requires clinical review and is not authoritative.
                </Text>
              </View>
            )}

            <Text className="text-navy dark:text-slate-200 text-sm leading-6 font-sans">
              {failedQuestion.explanation}
            </Text>
            <Text className="text-slate-400 dark:text-slate-500 text-[10px] mt-5 uppercase tracking-widest font-semibold font-sans">
              Note: The correct answer above is not necessarily the one you selected.
            </Text>
          </View>
        </View>
      ) : (
        <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-[20px] p-6 items-center mb-6">
          <Text className="text-slate-500 dark:text-slate-400 text-sm text-center font-sans">
            Question data is currently unavailable.
          </Text>
        </View>
      )}

      {/* 6. Retry Workflow */}
      <View className="mb-8">
        <PrimaryButton
          label="Retry Concept →"
          variant="primary"
          onPress={handleRetry}
        />
      </View>
    </AppScreen>
  );
}
