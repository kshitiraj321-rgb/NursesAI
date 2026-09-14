import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { practiceRepository } from "../../data/practice/repository";
import { useAuth } from "../../context/AuthContext";
import type { PracticeMode } from "../../data/types/practice";
import {
  AppScreen,
  AppHeader,
  SectionHeader,
  PrimaryButton,
  Pill,
} from "../../components/ui";
import { ModeCard } from "../../components/practice/ModeCard";

interface ModeDefinition {
  mode: PracticeMode;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
}

const PRACTICE_MODES: ModeDefinition[] = [
  {
    mode: "CONCEPT_CHECK",
    title: "1-Minute Concept Check",
    subtitle: "Rapid single-concept recall & key diagnostic cues",
    icon: "⚡",
    badge: "1 Min",
  },
  {
    mode: "MCQ",
    title: "Scenario MCQ Practice",
    subtitle: "Clinical scenario questions anchored to concepts",
    icon: "📝",
    badge: "Standard",
  },
  {
    mode: "MNEMONIC_RECALL",
    title: "Mnemonic Acronym Recall",
    subtitle: "Reinforce memory hooks & acronym expansions",
    icon: "💡",
    badge: "Memory",
  },
  {
    mode: "CASE_RECOGNITION",
    title: "Case & Cue Recognition",
    subtitle: "Patient vignette pattern matching for priority care",
    icon: "🩺",
    badge: "Clinical",
  },
];

export default function PracticeScreen() {
  const { uid: userId } = useAuth();
  if (!userId) return null;
  const activeMistakes = practiceRepository.getActiveMistakes(userId);

  const handleLaunchMode = (mode: PracticeMode) => {
    router.push({
      pathname: "/practice-session",
      params: { mode },
    });
  };

  const handleOpenMistakeBank = () => {
    router.push("/mistake-bank");
  };

  return (
    <AppScreen scrollable edges={["top"]}>
      {/* Header */}
      <AppHeader
        title="Practice"
        subtitle="Strengthen what you know. Fix what you miss."
        showHome
      />

      {/* Recommended Next Action */}
      <View className="mb-6">
        <SectionHeader title="Recommended Next" />
        <View className="bg-clinical-blue dark:bg-sky-900 rounded-xl p-4 min-h-[44px]">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center flex-1 mr-2" accessibilityRole="header">
              <Text className="text-xl mr-2">🧭</Text>
              <Text className="text-white font-bold text-base flex-1">
                Recommendation
              </Text>
            </View>
            {(() => {
              const rec = practiceRepository.getRecommendedNextAction(userId);
              if (rec.status === "UNAVAILABLE" || rec.status === "ERROR") {
                return <Pill label="Checking..." variant="info" size="sm" />;
              }
              if (rec.action === "REVIEW_MISTAKES") {
                return <Pill label={`${rec.count} Due`} variant="error" size="sm" />;
              }
              if (rec.action === "SPACED_REVIEW") {
                return <Pill label={`${rec.count} Due`} variant="info" size="sm" />;
              }
              return <Pill label="Ready" variant="success" size="sm" />;
            })()}
          </View>

          <Text className="text-blue-100 text-xs leading-5 mb-4">
            {(() => {
              const rec = practiceRepository.getRecommendedNextAction(userId);
              if (rec.status === "UNAVAILABLE") return "Loading practice data...";
              if (rec.status === "ERROR") return "Unable to load recommendation.";
              return rec.reason;
            })()}
          </Text>

          {(() => {
            const rec = practiceRepository.getRecommendedNextAction(userId);
            if (rec.status !== "AVAILABLE" || rec.action === "NONE") return null;

            let label = "";
            let variant: "emerald" | "primary" | "rose" | "outline" | "white" = "white";
            let onPress = () => {};

            switch (rec.action) {
              case "REVIEW_MISTAKES":
                label = "Review Mistakes →";
                variant = "white";
                onPress = handleOpenMistakeBank;
                break;
              case "SPACED_REVIEW":
                label = "Start Spaced Review →";
                variant = "white";
                onPress = () => router.push({ pathname: "/practice-session", params: { isReviewSession: "true" } });
                break;
              case "PRACTICE":
                label = "Start Practice →";
                variant = "white";
                onPress = () => handleLaunchMode("MCQ");
                break;
            }

            return (
              <PrimaryButton
                label={label}
                variant={variant}
                onPress={onPress}
              />
            );
          })()}
        </View>
      </View>

      {/* Active Mistake Review Card */}
      <View className="mb-6">
        <SectionHeader title="Your Focus" />
        <View className="bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 rounded-xl p-4 min-h-[44px]">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center flex-1 mr-2">
              <Text className="text-xl mr-2">🚨</Text>
              <Text className="text-navy dark:text-white font-bold text-base flex-1">
                Active Mistake Review
              </Text>
            </View>
            <Pill
              label={`${activeMistakes.length} Weak`}
              variant={activeMistakes.length > 0 ? "error" : "success"}
              size="sm"
            />
          </View>

          <Text className="text-slate-500 dark:text-slate-400 text-xs leading-5 mb-4">
            {activeMistakes.length > 0
              ? `${activeMistakes.length} concepts require 2 consecutive correct retrieval attempts to resolve.`
              : "All weak concepts resolved! Keep practicing to maintain retrieval strength."}
          </Text>

          <PrimaryButton
            label={activeMistakes.length > 0 ? "Review Mistakes →" : "Open Mistake Bank"}
            variant={activeMistakes.length > 0 ? "rose" : "primary"}
            onPress={handleOpenMistakeBank}
          />
        </View>
      </View>

      {/* Spaced Review Card */}
      <View className="mb-6">
        <SectionHeader title="Retention" />
        <View className="bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 rounded-xl p-4 min-h-[44px]">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center flex-1 mr-2" accessibilityRole="header">
              <Text className="text-xl mr-2">🧠</Text>
              <Text className="text-navy dark:text-white font-bold text-base flex-1">
                Spaced Review
              </Text>
            </View>
            {(() => {
              const hydration = practiceRepository.getHydrationState(userId);
              if (hydration.status === "LOADING" || hydration.status === "UNHYDRATED") {
                return (
                  <View className="flex-row items-center" accessibilityLabel="Loading spaced review status">
                    <ActivityIndicator size="small" color="#2563EB" />
                  </View>
                );
              }
              if (hydration.status === "ERROR") {
                return <Pill label="Data Error" variant="error" size="sm" />;
              }
              const dueCount = practiceRepository.getDueForReview(userId).length;
              if (dueCount === 0) {
                return <Pill label="No Review Due" variant="success" size="sm" />;
              }
              return <Pill label={`${dueCount} Due`} variant="info" size="sm" />;
            })()}
          </View>

          <Text className="text-slate-500 dark:text-slate-400 text-xs leading-5 mb-4" accessibilityLabel="Review concepts due for retention practice">
            {(() => {
              const hydration = practiceRepository.getHydrationState(userId);
              if (hydration.status === "LOADING" || hydration.status === "UNHYDRATED") {
                return "Checking for concepts due for retention practice...";
              }
              if (hydration.status === "ERROR") {
                return "Unable to load review status. Please try again later.";
              }
              const dueCount = practiceRepository.getDueForReview(userId).length;
              if (dueCount === 0) {
                return "You have no concepts due for review. Keep practicing to build mastery!";
              }
              return `${dueCount} concepts are due for proactive time-based retention practice.`;
            })()}
          </Text>

          {(() => {
            const hydration = practiceRepository.getHydrationState(userId);
            const dueCount = hydration.status === "HYDRATED" ? practiceRepository.getDueForReview(userId).length : 0;
            return (
              <PrimaryButton
                label={dueCount > 0 ? "Start Review →" : "No Review Due"}
                variant="primary"
                onPress={() => router.push({ pathname: "/practice-session", params: { isReviewSession: "true" } })}
                disabled={dueCount === 0 || hydration.status !== "HYDRATED"}
              />
            );
          })()}
        </View>
      </View>

      {/* Global Progress Dashboard Entry */}
      <View className="mb-6">
        <View className="bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 rounded-xl overflow-hidden">
          <PrimaryButton 
            label="📊 View Global Progress Dashboard →"
            variant="outline"
            onPress={() => router.push("/progress")}
          />
        </View>
      </View>

      {/* Practice Modes */}
      <View className="mb-6">
        <SectionHeader
          title="Practice Modes"
          subtitle="Concept-anchored active practice loops"
        />

        {PRACTICE_MODES.map((item) => (
          <ModeCard
            key={item.mode}
            mode={item.mode}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            badge={item.badge}
            onPress={() => handleLaunchMode(item.mode)}
          />
        ))}
      </View>
    </AppScreen>
  );
}
