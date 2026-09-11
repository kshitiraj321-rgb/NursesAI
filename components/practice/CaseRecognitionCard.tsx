import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { PracticeQuestion } from "../../data/types/practice";
import { AnimatedPressable, GlassCard, Pill } from "../ui";

interface CaseRecognitionCardProps {
  question: PracticeQuestion;
  selectedIndex: number | null;
  onSelectOption: (index: number) => void;
  disabled?: boolean;
}

export function CaseRecognitionCard({
  question,
  selectedIndex,
  onSelectOption,
  disabled = false,
}: CaseRecognitionCardProps) {
  const shakeX = useSharedValue(0);

  const isAnswered = selectedIndex !== null;
  const isCorrectChoice = selectedIndex === question.correctOptionIndex;

  useEffect(() => {
    if (isAnswered && !isCorrectChoice) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    }
  }, [isAnswered, isCorrectChoice, shakeX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <GlassCard variant="default" style={{ marginBottom: 16 }}>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            🩺 Clinical Case & Pattern Recognition
          </Text>
          <Pill label="Clinical" variant="warning" size="sm" />
        </View>

        {/* Patient Vignette Banner */}
        {question.scenarioText && (
          <View className="bg-amber-950/40 p-3.5 rounded-xl border border-amber-800/60 mb-3">
            <Text className="text-amber-300 text-[10px] font-extrabold uppercase mb-1">
              Patient Presentation Vignette
            </Text>
            <Text className="text-slate-200 text-xs leading-5">
              {question.scenarioText}
            </Text>
          </View>
        )}

        {/* Question Prompt */}
        <Text className="text-white font-bold text-base mb-4 leading-6">
          {question.questionText}
        </Text>

        {/* Standardized Options */}
        <View className="space-y-2.5">
          {question.options.map((opt, idx) => {
            const isSelected = selectedIndex === idx;
            const isOptionCorrect = idx === question.correctOptionIndex;
            const letter = String.fromCharCode(65 + idx);

            let cardBg = "bg-slate-900/90 border-slate-800";
            let textColor = "text-slate-200";

            if (isAnswered) {
              if (isOptionCorrect) {
                cardBg = "bg-emerald-950/90 border-emerald-500/80";
                textColor = "text-emerald-200 font-bold";
              } else if (isSelected && !isOptionCorrect) {
                cardBg = "bg-rose-950/90 border-rose-500/80";
                textColor = "text-rose-200 font-bold";
              }
            } else if (isSelected) {
              cardBg = "bg-amber-950/90 border-amber-500/80";
              textColor = "text-amber-200 font-bold";
            }

            return (
              <AnimatedPressable
                key={idx}
                disabled={disabled}
                onPress={() => onSelectOption(idx)}
                className={`p-3.5 rounded-xl border flex-row items-center justify-between ${cardBg}`}
                accessibilityRole="button"
                accessibilityLabel={`Option ${letter}: ${opt}`}
              >
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 items-center justify-center mr-3">
                    <Text className="text-slate-300 font-bold text-xs">
                      {letter}
                    </Text>
                  </View>
                  <Text className={`text-xs leading-5 flex-1 ${textColor}`}>
                    {opt}
                  </Text>
                </View>

                {isAnswered && isOptionCorrect && (
                  <Pill label="Correct ✓" variant="success" size="sm" />
                )}
                {isAnswered && isSelected && !isOptionCorrect && (
                  <Pill label="Incorrect ✕" variant="error" size="sm" />
                )}
              </AnimatedPressable>
            );
          })}
        </View>
      </GlassCard>
    </Animated.View>
  );
}
