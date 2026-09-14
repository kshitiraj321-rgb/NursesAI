import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { PracticeQuestion } from "../../data/types/practice";
import { AnimatedPressable, Pill } from "../ui";

interface CaseRecognitionCardProps {
  question: PracticeQuestion;
  selectedIndex: number | null;
  onSelectOption: (index: number) => void;
  isAnswered?: boolean;
  disabled?: boolean;
}

export function CaseRecognitionCard({
  question,
  selectedIndex,
  onSelectOption,
  isAnswered = false,
  disabled = false,
}: CaseRecognitionCardProps) {
  const shakeX = useSharedValue(0);

  const isCorrectChoice = selectedIndex === question.correctOptionIndex;

  useEffect(() => {
    if (isAnswered && !isCorrectChoice && selectedIndex !== null) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    }
  }, [isAnswered, isCorrectChoice, shakeX, selectedIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View className="bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 p-5 rounded-2xl mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            🩺 Clinical Case & Pattern Recognition
          </Text>
          <Pill label="Clinical" variant="warning" size="sm" />
        </View>

        {question.scenarioText && (
          <View className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 mb-4">
            <Text className="text-amber-700 dark:text-amber-300 text-[10px] font-extrabold uppercase mb-1">
              Patient Presentation Vignette
            </Text>
            <Text className="text-amber-900 dark:text-slate-200 text-xs leading-5">
              {question.scenarioText}
            </Text>
          </View>
        )}

        <Text className="text-navy dark:text-white font-bold text-base mb-5 leading-6">
          {question.questionText}
        </Text>

        <View className="space-y-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedIndex === idx;
            const isOptionCorrect = idx === question.correctOptionIndex;
            const letter = String.fromCharCode(65 + idx);

            let cardBg = "bg-surface dark:bg-slate-900 border-border-subtle dark:border-slate-800";
            let textColor = "text-slate-600 dark:text-slate-300";

            if (isAnswered) {
              if (isOptionCorrect) {
                cardBg = "bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-500/80";
                textColor = "text-emerald-800 dark:text-emerald-200 font-bold";
              } else if (isSelected && !isOptionCorrect) {
                cardBg = "bg-rose-50 dark:bg-rose-950/90 border-rose-200 dark:border-rose-500/80";
                textColor = "text-rose-800 dark:text-rose-200 font-bold";
              }
            } else if (isSelected) {
              cardBg = "bg-amber-50 dark:bg-amber-950/90 border-amber-300 dark:border-amber-500/80";
              textColor = "text-amber-700 dark:text-amber-200 font-bold";
            }

            return (
              <AnimatedPressable
                key={idx}
                disabled={disabled}
                onPress={() => onSelectOption(idx)}
                className={`p-4 rounded-xl border flex-row items-center justify-between min-h-[60px] ${cardBg}`}
                accessibilityRole="button"
                accessibilityLabel={`Option ${letter}: ${opt}`}
              >
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 items-center justify-center mr-3">
                    <Text className="text-slate-500 dark:text-slate-300 font-bold text-xs">
                      {letter}
                    </Text>
                  </View>
                  <Text className={`text-sm leading-5 flex-1 ${textColor}`}>
                    {opt}
                  </Text>
                </View>

                {isAnswered && isOptionCorrect && (
                  <Text className="text-emerald-600 dark:text-emerald-400 font-bold ml-2">✓</Text>
                )}
                {isAnswered && isSelected && !isOptionCorrect && (
                  <Text className="text-rose-600 dark:text-rose-400 font-bold ml-2">✕</Text>
                )}
              </AnimatedPressable>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}
