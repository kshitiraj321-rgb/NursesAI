import React from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { practiceRepository } from "../../data/practice/repository";
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
  const userId = "user_default";
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
