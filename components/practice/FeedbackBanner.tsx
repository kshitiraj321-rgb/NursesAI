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
        className={`p-4 rounded-2xl border mb-6 ${
          isCorrect
            ? "bg-emerald-950/90 border-emerald-600/80"
            : "bg-rose-950/90 border-rose-600/80"
        }`}
      >
        {/* Outcome Header */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Text
              className={`font-extrabold text-base mr-2 ${
                isCorrect ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {isCorrect ? "✓ Correct Retrieval" : "✕ Incorrect Answer"}
            </Text>
          </View>
          <TrustBadge status={question.meta.verificationStatus} size="sm" />
        </View>

        {/* Authoritative Repository Rationale */}
        <View className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 mb-3">
          <Text className="text-slate-400 text-[10px] font-extrabold uppercase mb-1">
            Authoritative Clinical Rationale (Source of Truth)
          </Text>
          <Text className="text-slate-200 text-xs leading-5">
            {question.explanation}
          </Text>
        </View>

        {/* Associated Mnemonic (Omitted if absent) */}
        {mnemonic && (
          <View className="bg-purple-950/80 border border-purple-700/60 p-3 rounded-xl mb-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-purple-300 font-extrabold text-[10px] uppercase">
                💡 Associated Memory Hook (Mnemonic)
              </Text>
              <Pill label="Mnemonic" variant="AI" size="sm" />
            </View>
            <Text className="text-white font-extrabold text-base mb-0.5">
              {mnemonic.mnemonic}
            </Text>
            <Text className="text-purple-200 text-xs leading-4">
              {mnemonic.expansion}
            </Text>
          </View>
        )}

        {/* AI Tutor Explanation Action */}
        {onAskTutor && (
          <SecondaryButton
            label="🤖 Ask AI Tutor to Explain This Concept"
            onPress={onAskTutor}
          />
        )}
      </View>
    </Animated.View>
  );
}
