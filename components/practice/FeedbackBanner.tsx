import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import type { PracticeQuestion } from "../../data/types/practice";
import type { Mnemonic } from "../../data/types/knowledge";
import { TrustBadge } from "../learn/TrustBadge";
import { SecondaryButton, Pill } from "../ui";

interface FeedbackBannerProps {
  isCorrect: boolean;
  question: PracticeQuestion;
  mnemonic?: Mnemonic;
  onAskTutor?: () => void;
}

export function FeedbackBanner({
  isCorrect,
  question,
  mnemonic,
  onAskTutor,
}: FeedbackBannerProps) {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
    opacity.value = withSpring(1, { damping: 18, stiffness: 200 });
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View
        className={`p-5 rounded-2xl border mb-6 ${
          isCorrect
            ? "bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-600/80"
            : "bg-rose-50 dark:bg-rose-950/90 border-rose-200 dark:border-rose-600/80"
        }`}
      >
        {/* Outcome Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Text
              className={`font-extrabold text-base mr-2 ${
                isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"
              }`}
            >
              {isCorrect ? "✓ Correct Retrieval" : "✕ Incorrect Answer"}
            </Text>
          </View>
          <TrustBadge status={question.meta.verificationStatus} size="sm" />
        </View>

        {/* Authoritative Repository Rationale */}
        <View className="bg-surface dark:bg-slate-900/80 p-4 rounded-xl border border-border-subtle dark:border-slate-800 mb-4">
          <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase mb-1">
            Authoritative Clinical Rationale
          </Text>
          <Text className="text-navy dark:text-slate-200 text-sm leading-6">
            {question.explanation}
          </Text>
        </View>

        {/* Associated Mnemonic */}
        {mnemonic && (
          <View className="bg-amber-50 dark:bg-purple-950/80 border border-amber-200 dark:border-purple-700/60 p-4 rounded-xl mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-amber-700 dark:text-purple-300 font-extrabold text-[10px] uppercase">
                💡 Associated Memory Hook
              </Text>
              <Pill label="Mnemonic" variant="warning" size="sm" />
            </View>
            <Text className="text-navy dark:text-white font-extrabold text-base mb-1">
              {mnemonic.mnemonic}
            </Text>
            <Text className="text-amber-800 dark:text-purple-200 text-xs leading-5">
              {mnemonic.expansion}
            </Text>
          </View>
        )}

        {/* AI Tutor Explanation Action */}
        {onAskTutor && (
          <View className="mt-2">
            <SecondaryButton
              label="Ask AI Tutor to Explain This Concept"
              onPress={onAskTutor}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
}
