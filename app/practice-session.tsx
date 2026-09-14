import React, { useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { practiceRepository } from "../data/practice/repository";
import { knowledgeRepository } from "../data/knowledge/repository";
import { useAuth } from "../context/AuthContext";
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
  const { mode, topicId, conceptId, isReviewSession } = useLocalSearchParams<{
    mode?: string;
    topicId?: string;
    conceptId?: string;
    isReviewSession?: string;
  }>();
  const router = useRouter();

  const { uid: userId } = useAuth();
  const selectedMode = (mode as PracticeMode) || "MCQ";

  // Query concept-anchored questions
  let sessionQuestions: PracticeQuestion[] = [];
  if (isReviewSession === "true" && userId) {
    const hydration = practiceRepository.getHydrationState(userId);
    if (hydration.status === "HYDRATED") {
      const dueConcepts = practiceRepository.getDueForReview(userId);
      for (const concept of dueConcepts) {
        const questions = practiceRepository.getQuestionsForConcept(concept.conceptId);
        if (questions.length > 0) {
          sessionQuestions.push(questions[0]);
        }
      }
    }
  } else if (conceptId) {
    sessionQuestions = practiceRepository.getQuestionsForConcept(conceptId);
  } else if (topicId) {
    sessionQuestions = practiceRepository.getQuestionsForTopic(topicId, selectedMode);
  } else {
    sessionQuestions = practiceRepository.getQuestionsForMode(selectedMode);
  }

  const questionIds = sessionQuestions.map((q) => q.id);

  // Session tracking state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [incorrectQuestionIds, setIncorrectQuestionIds] = useState<string[]>([]);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [hasPersistenceFailure, setHasPersistenceFailure] = useState(false);

  // Immutable session start timestamp — captured once on mount
  const startedAt = useRef<string>(new Date().toISOString());
  // Idempotency guard: prevents double-submission on same question
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Track which questions have already been submitted to prevent duplicate counter increments
  const submittedQuestionIds = useRef<Set<string>>(new Set());

  // Clear any stale result from a prior session before beginning
  React.useEffect(() => {
    practiceRepository.clearLatestSessionResult();
  }, []);

  if (!userId) return null;

  const currentQ = sessionQuestions[currentIndex];
  const topic = currentQ ? knowledgeRepository.getTopicById(currentQ.topicId) : undefined;
  const mnemonic = currentQ?.mnemonicId
    ? knowledgeRepository.getMnemonicById(currentQ.mnemonicId)
    : undefined;

  const handleSelectOption = (index: number) => {
    if (answered || !currentQ || isSubmitting) return;
    setSelectedIndex(index);
    // CRITICAL: We do NOT setAnswered(true) here. 
    // This maintains anti-cheating logic until confirmation.
  };

  const handleConfirmAnswer = async () => {
    if (selectedIndex === null || answered || !currentQ || isSubmitting) return;

    setIsSubmitting(true);
    setAnswered(true);
    
    const correct = selectedIndex === currentQ.correctOptionIndex;
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + 1);
    }

    if (!submittedQuestionIds.current.has(currentQ.id)) {
      submittedQuestionIds.current.add(currentQ.id);
      setAttemptedQuestions((n) => n + 1);
      if (!correct) {
        setIncorrectQuestionIds((ids) => [...ids, currentQ.id]);
      }
    }

    const result = await practiceRepository.recordAttempt({
      id: `attempt_${crypto.randomUUID()}`,
      userId,
      questionId: currentQ.id,
      conceptId: currentQ.conceptId,
      topicId: currentQ.topicId,
      mode: currentQ.mode,
      selectedOptionIndex: selectedIndex,
      correctOptionIndex: currentQ.correctOptionIndex,
      isCorrect: correct,
      timeSpentSeconds: 10,
      attemptedAt: new Date().toISOString(),
    });

    if (result.persistenceError) {
      console.warn("Attempt history persistence failed, recorded locally:", result.persistenceError);
      setHasPersistenceFailure(true);
    }
  };

  const handleNextQuestion = () => {
    setSelectedIndex(null);
    setAnswered(false);
    setIsCorrect(false);
    setIsSubmitting(false);

    const isLastQuestion = currentIndex + 1 >= sessionQuestions.length;

    if (!isLastQuestion) {
      setCurrentIndex((i) => i + 1);
      return;
    }

    const finalCorrect = score;
    const finalAttempted = attemptedQuestions;
    const finalIncorrect = finalAttempted - finalCorrect;
    const finalPercent =
      sessionQuestions.length > 0
        ? Math.round((finalCorrect / sessionQuestions.length) * 100)
        : 0;

    const sessionResult = {
      mode: selectedMode,
      totalQuestions: sessionQuestions.length,
      attemptedQuestions: finalAttempted,
      correctAnswers: finalCorrect,
      incorrectAnswers: finalIncorrect,
      scorePercent: finalPercent,
      questionIds,
      incorrectQuestionIds,
      startedAt: startedAt.current,
      completedAt: new Date().toISOString(),
      persistenceStatus: hasPersistenceFailure
        ? ("PARTIAL_PERSISTENCE_FAILURE" as const)
        : ("ALL_ATTEMPTS_PERSISTED" as const),
    };

    practiceRepository.setLatestSessionResult(sessionResult);
    router.replace("/practice-results" as any);
  };

  if (!currentQ || sessionQuestions.length === 0) {
    return (
      <AppScreen edges={["top", "bottom"]}>
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 p-6 rounded-2xl items-center w-full max-w-sm">
            <Text className="text-3xl mb-2">🎯</Text>
            <Text className="text-navy dark:text-white font-bold text-lg mb-1 text-center">
              No Questions Available
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-sm mb-6 text-center leading-5">
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
            className="py-1 flex-row items-center min-h-[44px]"
            accessibilityRole="button"
            accessibilityLabel="Exit Practice Session"
          >
            <Text className="text-clinical-blue dark:text-sky-400 font-bold text-sm">← Exit</Text>
          </TouchableOpacity>

          <View className="flex-row items-center space-x-3">
            <Text className="text-slate-500 dark:text-slate-400 font-medium text-xs">
              Score: <Text className="text-navy dark:text-white font-bold">{score}</Text>
            </Text>
            <View className="bg-surface dark:bg-slate-800 px-2.5 py-1 rounded-md border border-border-subtle dark:border-slate-700/60">
              <Text className="text-navy dark:text-slate-300 font-semibold text-xs tracking-wider">
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
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Practice Question Cards */}
        {currentQ.mode === "CONCEPT_CHECK" && (
          <ConceptCheckCard
            question={currentQ}
            selectedIndex={selectedIndex}
            onSelectOption={handleSelectOption}
            isAnswered={answered}
            disabled={answered}
          />
        )}

        {currentQ.mode === "MCQ" && (
          <McqCard
            question={currentQ}
            selectedIndex={selectedIndex}
            onSelectOption={handleSelectOption}
            isAnswered={answered}
            disabled={answered}
          />
        )}

        {currentQ.mode === "MNEMONIC_RECALL" && (
          <MnemonicRecallCard
            question={currentQ}
            selectedIndex={selectedIndex}
            onSelectOption={handleSelectOption}
            isAnswered={answered}
            disabled={answered}
          />
        )}

        {currentQ.mode === "CASE_RECOGNITION" && (
          <CaseRecognitionCard
            question={currentQ}
            selectedIndex={selectedIndex}
            onSelectOption={handleSelectOption}
            isAnswered={answered}
            disabled={answered}
          />
        )}

        {/* Confirm Answer Button (Only show if selected but not yet confirmed) */}
        {selectedIndex !== null && !answered && (
          <View className="mt-2">
            <PrimaryButton
              label="Confirm Answer"
              variant="primary"
              onPress={handleConfirmAnswer}
              disabled={isSubmitting}
            />
          </View>
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
                variant="primary"
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
        title="AI Educational Explanation"
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
