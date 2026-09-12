import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { practiceRepository } from "../../data/practice/repository";
import { useAuth } from "../../context/AuthContext";
import type { PracticeMode } from "../../data/types/practice";
import {
  AppScreen,
  AppHeader,
  GlassCard,
  SectionHeader,
  PrimaryButton,
  Pill,
} from "../../components/ui";

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
      {/* Quiet Clinical Header */}
      <AppHeader
        title="Practice"
        subtitle="Train recall. Find weak spots."
        showHome
      />
      {/* Recommended Next Action */}
      <View className="mb-6">
        <SectionHeader title="Intelligence" />
        <GlassCard variant="default">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center flex-1 mr-2" accessibilityRole="header">
              <Text className="text-xl mr-2">🧭</Text>
              <Text className="text-white font-extrabold text-base flex-1">
                Recommended Action
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
          
          <Text className="text-slate-300 text-xs leading-5 mb-4">
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
            let variant: "primary" | "rose" | "purple" | "emerald" = "primary";
            let onPress = () => {};

            switch (rec.action) {
              case "REVIEW_MISTAKES":
                label = "Review Mistakes →";
                variant = "rose";
                onPress = handleOpenMistakeBank;
                break;
              case "SPACED_REVIEW":
                label = "Start Spaced Review →";
                variant = "purple";
                onPress = () => router.push({ pathname: "/practice-session", params: { isReviewSession: "true" } });
                break;
              case "PRACTICE":
                label = "Start Practice →";
                variant = "emerald";
                onPress = () => handleLaunchMode("MCQ"); // default general practice
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
        </GlassCard>
      </View>

      {/* Active Mistake Review Card */}
      <View className="mb-6">
        <SectionHeader title="Your Focus" />
        <GlassCard variant={activeMistakes.length > 0 ? "accent" : "default"}>
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center flex-1 mr-2">
              <Text className="text-xl mr-2">🚨</Text>
              <Text className="text-white font-extrabold text-base flex-1">
                Active Mistake Review
              </Text>
            </View>
            <Pill
              label={`${activeMistakes.length} Weak`}
              variant={activeMistakes.length > 0 ? "error" : "success"}
              size="sm"
            />
          </View>

          <Text className="text-slate-300 text-xs leading-5 mb-4">
            {activeMistakes.length > 0
              ? `${activeMistakes.length} concepts require 2 consecutive correct retrieval attempts to resolve.`
              : "All weak concepts resolved! Keep practicing to maintain retrieval strength."}
          </Text>

          <PrimaryButton
            label={activeMistakes.length > 0 ? "Review Mistakes →" : "Open Mistake Bank"}
            variant={activeMistakes.length > 0 ? "rose" : "primary"}
            onPress={handleOpenMistakeBank}
          />
        </GlassCard>
      </View>

      {/* Spaced Review Card */}
      <View className="mb-6">
        <SectionHeader title="Retention" />
        <GlassCard variant="default">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center flex-1 mr-2" accessibilityRole="header">
              <Text className="text-xl mr-2">🧠</Text>
              <Text className="text-white font-extrabold text-base flex-1">
                Spaced Review
              </Text>
            </View>
            {(() => {
              const hydration = practiceRepository.getHydrationState(userId);
              if (hydration.status === "LOADING" || hydration.status === "UNHYDRATED") {
                return (
                  <View className="flex-row items-center" accessibilityLabel="Loading spaced review status">
                    <ActivityIndicator size="small" color="#818CF8" />
                  </View>
                );
              }
              if (hydration.status === "ERROR") {
                return <Pill label="Data Error" variant="error" size="sm" />;
              }
              const dueCount = practiceRepository.getDueForReview(userId).length;
              if (dueCount === 0) {
                return <Pill label="All caught up" variant="success" size="sm" />;
              }
              return <Pill label={`${dueCount} Due`} variant="info" size="sm" />;
            })()}
          </View>

          <Text className="text-slate-300 text-xs leading-5 mb-4" accessibilityLabel="Review concepts due for retention practice">
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
                label={dueCount > 0 ? "Start Review →" : "All Caught Up"}
                variant={dueCount > 0 ? "purple" : "primary"}
                onPress={() => router.push({ pathname: "/practice-session", params: { isReviewSession: "true" } })}
                disabled={dueCount === 0 || hydration.status !== "HYDRATED"}
              />
            );
          })()}
        </GlassCard>
      </View>

      {/* Global Progress Dashboard Entry */}
      <View className="mb-6">
        <GlassCard variant="default" onPress={() => router.push("/progress")}>
          <View className="flex-row items-center flex-1">
            <Text className="text-3xl mr-3.5">📊</Text>
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-white font-bold text-base flex-1 mr-2">
                  Global Progress
                </Text>
                <Pill label="Dashboard" variant="info" size="sm" />
              </View>
              <Text className="text-slate-400 text-xs leading-4">
                View your mastery profile and overall practice performance.
              </Text>
            </View>
          </View>
        </GlassCard>
      </View>

      {/* Concept-Anchored Practice Modes */}
      <View className="mb-6">
        <SectionHeader
          title="Your Retrieval Modes"
          subtitle="Concept-anchored active practice loops"
        />

        {PRACTICE_MODES.map((item) => (
          <GlassCard
            key={item.mode}
            variant="default"
            onPress={() => handleLaunchMode(item.mode)}
          >
            <View className="flex-row items-center flex-1">
              <Text className="text-3xl mr-3.5">{item.icon}</Text>
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-white font-bold text-base flex-1 mr-2">
                    {item.title}
                  </Text>
                  <Pill label={item.badge} variant="info" size="sm" />
                </View>
                <Text className="text-slate-400 text-xs leading-4">
                  {item.subtitle}
                </Text>
              </View>
            </View>
          </GlassCard>
        ))}
      </View>
    </AppScreen>
  );
}
