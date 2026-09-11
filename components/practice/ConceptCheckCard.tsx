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

interface ConceptCheckCardProps {
  question: PracticeQuestion;
  selectedIndex: number | null;
  onSelectOption: (index: number) => void;
  disabled?: boolean;
}

export function ConceptCheckCard({
  question,
  selectedIndex,
  onSelectOption,
  disabled = false,
}: ConceptCheckCardProps) {
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
      <GlassCard variant="interactive" style={{ marginBottom: 16 }}>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
            ⚡ 1-Minute Rapid Concept Check
          </Text>
          <Pill label="Rapid" variant="trust" size="sm" />
        </View>

        <Text className="text-white font-bold text-base mb-4 leading-6">
          {question.questionText}
        </Text>

        <View className="space-y-2.5">
          {question.options.map((opt, idx) => {
            const isSelected = selectedIndex === idx;
            const isOptionCorrect = idx === question.correctOptionIndex;

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
              cardBg = "bg-cyan-950/90 border-cyan-400";
              textColor = "text-cyan-200 font-bold";
            }

            return (
              <AnimatedPressable
                key={idx}
                disabled={disabled}
                onPress={() => onSelectOption(idx)}
                className={`p-3.5 rounded-xl border flex-row items-center justify-between ${cardBg}`}
                accessibilityRole="button"
                accessibilityLabel={`Option ${idx + 1}: ${opt}`}
              >
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 items-center justify-center mr-3">
                    <Text className="text-slate-300 font-bold text-xs">
                      {idx + 1}
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
