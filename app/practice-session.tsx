import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { practiceRepository } from "../data/practice/repository";
import { knowledgeRepository } from "../data/knowledge/repository";
import type { PracticeQuestion, PracticeMode } from "../data/types/practice";
import { ConceptCheckCard } from "../components/practice/ConceptCheckCard";
import { McqCard } from "../components/practice/McqCard";
import { MnemonicRecallCard } from "../components/practice/MnemonicRecallCard";
import { CaseRecognitionCard } from "../components/practice/CaseRecognitionCard";
import { FeedbackBanner } from "../components/practice/FeedbackBanner";
import { TeachMeView } from "../components/learn/TeachMeView";
import { AppScreen } from "../components/ui/AppScreen";
import { ProgressBar } from "../components/ui/ProgressBar";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { BottomSheet } from "../components/ui/BottomSheet";

export default function PracticeSessionScreen() {
  const { mode, topicId, conceptId } = useLocalSearchParams<{
    mode?: string;
    topicId?: string;
    conceptId?: string;
  }>();
  const router = useRouter();

  const userId = "user_default";
  const selectedMode = (mode as PracticeMode) || "MCQ";

  // Query concept-anchored questions
  let sessionQuestions: PracticeQuestion[] = [];
  if (conceptId) {
    sessionQuestions = practiceRepository.getQuestionsForConcept(conceptId);
  } else if (topicId) {
    sessionQuestions = practiceRepository.getQuestionsForTopic(topicId, selectedMode);
  } else {
    sessionQuestions = practiceRepository.getQuestionsForMode(selectedMode);
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showTutorModal, setShowTutorModal] = useState(false);

  const currentQ = sessionQuestions[currentIndex];
  const topic = currentQ ? knowledgeRepository.getTopicById(currentQ.topicId) : undefined;
  const mnemonic = currentQ?.mnemonicId
    ? knowledgeRepository.getMnemonicById(currentQ.mnemonicId)
    : undefined;

  const handleSelectOption = (index: number) => {
    if (answered || !currentQ) return;

    setSelectedIndex(index);
    setAnswered(true);
    const correct = index === currentQ.correctOptionIndex;
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + 1);
    }

    // Record attempt in repository (triggers mastery & mistake updates)
    practiceRepository.recordAttempt({
      id: `attempt_${Date.now()}`,
      userId,
      questionId: currentQ.id,
      conceptId: currentQ.conceptId,
      topicId: currentQ.topicId,
      mode: currentQ.mode,
      selectedOptionIndex: index,
      isCorrect: correct,
      timeSpentSeconds: 10,
      attemptedAt: new Date().toISOString(),
    });
  };

  const handleNextQuestion = () => {
    setSelectedIndex(null);
    setAnswered(false);
    setIsCorrect(false);
    if (currentIndex + 1 < sessionQuestions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Session complete -> return deterministically to Practice Hub
      router.replace("/(tabs)/practice" as any);
    }
  };

  if (!currentQ || sessionQuestions.length === 0) {
    return (
      <AppScreen edges={["top", "bottom"]}>
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl items-center w-full max-w-sm">
            <Text className="text-3xl mb-2">🎯</Text>
            <Text className="text-white font-bold text-lg mb-1 text-center">
              No Questions Available
            </Text>
            <Text className="text-slate-400 text-sm mb-6 text-center leading-5">
              No concept-anchored questions found for this selection.
            </Text>
            <View className="w-full">
              <PrimaryButton
                label="Return to Practice Hub"
                onPress={() => router.replace("/(tabs)/practice" as any)}
              />
            </View>
          </View>
        </View>
      </AppScreen>
    );
  }

  const progressFraction = (currentIndex + 1) / sessionQuestions.length;
  const questionNumStr = String(currentIndex + 1).padStart(2, "0");
  const totalNumStr = String(sessionQuestions.length).padStart(2, "0");

  return (
    <AppScreen edges={["top", "bottom"]}>
      {/* Session Top Bar */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/practice" as any)}
            activeOpacity={0.7}
            className="py-1 flex-row items-center"
            accessibilityRole="button"
            accessibilityLabel="Exit Practice Session"
          >
            <Text className="text-cyan-400 font-bold text-sm">← Practice</Text>
          </TouchableOpacity>

          <View className="flex-row items-center space-x-3">
            <Text className="text-slate-400 font-medium text-xs">
              Score: <Text className="text-emerald-400 font-bold">{score}</Text>
            </Text>
            <View className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/60">
              <Text className="text-slate-300 font-semibold text-xs tracking-wider">
                {questionNumStr} / {totalNumStr}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <ProgressBar progress={progressFraction} color="#3B82F6" height={5} />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Practice Question Cards */}
        {currentQ.mode === "CONCEPT_CHECK" && (
          <ConceptCheckCard
            question={currentQ}
            selectedIndex={selectedIndex}
            onSelectOption={handleSelectOption}
            disabled={answered}
          />
        )}

        {currentQ.mode === "MCQ" && (
          <McqCard
            question={currentQ}
            selectedIndex={selectedIndex}
            onSelectOption={handleSelectOption}
            disabled={answered}
          />
        )}

        {currentQ.mode === "MNEMONIC_RECALL" && (
          <MnemonicRecallCard
            question={currentQ}
            selectedIndex={selectedIndex}
            onSelectOption={handleSelectOption}
            disabled={answered}
          />
        )}

        {currentQ.mode === "CASE_RECOGNITION" && (
          <CaseRecognitionCard
            question={currentQ}
            selectedIndex={selectedIndex}
            onSelectOption={handleSelectOption}
            disabled={answered}
          />
        )}

        {/* Instant Feedback Banner when answered */}
        {answered && (
          <View className="mt-4">
            <FeedbackBanner
              isCorrect={isCorrect}
              question={currentQ}
              mnemonic={mnemonic}
              onAskTutor={() => setShowTutorModal(true)}
            />

            {/* Next Action Button */}
            <View className="mt-4">
              <PrimaryButton
                label={
                  currentIndex + 1 < sessionQuestions.length
                    ? "Next Question →"
                    : "Finish Practice Session"
                }
                variant={isCorrect ? "emerald" : "primary"}
                onPress={handleNextQuestion}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* AI Tutor BottomSheet */}
      <BottomSheet
        visible={showTutorModal}
        onClose={() => setShowTutorModal(false)}
        title="🤖 AI Educational Explanation"
      >
        <ScrollView className="max-h-[500px]" showsVerticalScrollIndicator={false}>
          {topic && (
            <TeachMeView
              topic={topic}
              concept={knowledgeRepository.getConceptById(currentQ.conceptId)}
            />
          )}
        </ScrollView>
      </BottomSheet>
    </AppScreen>
  );
}

