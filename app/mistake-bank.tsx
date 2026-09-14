import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { practiceRepository } from "../data/practice/repository";
import { useAuth } from "../context/AuthContext";
import { MistakeListItem } from "../components/practice/MistakeListItem";
import { AppScreen } from "../components/ui/AppScreen";
import { AppHeader } from "../components/ui/AppHeader";
import { Pill } from "../components/ui/Pill";

export default function MistakeBankScreen() {
  const router = useRouter();
  const { uid: userId } = useAuth();
  
  if (!userId) return null;
  const activeMistakes = practiceRepository.getActiveMistakes(userId);
  const allMistakes = practiceRepository.getAllMistakes(userId);
  const resolvedCount = allMistakes.filter((m) => m.status === "RESOLVED").length;

  const handleViewMistakeDetail = (conceptId: string) => {
    router.push({
      pathname: "/mistake-detail" as any,
      params: { conceptId },
    });
  };

  const activeCountStr = String(activeMistakes.length).padStart(2, "0");

  return (
    <AppScreen scrollable edges={["top", "bottom"]}>
      {/* Back & Title Header */}
      <AppHeader
        title="Mistake Bank"
        subtitle="Focus on what you get wrong."
        showBack
        backText="Practice"
        onBack={() => router.replace("/(tabs)/practice" as any)}
      />

      {/* Active Weaknesses Header Card */}
      <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-navy dark:text-white font-bold text-base">
            Active Weaknesses
          </Text>
          <Pill
            label={activeCountStr}
            variant={activeMistakes.length > 0 ? "error" : "success"}
            size="sm"
          />
        </View>

        <Text className="text-slate-500 dark:text-slate-400 text-xs leading-5 mb-5">
          Concepts where retrieval errors occurred. Resolve each concept with 2 consecutive correct retrieval attempts.
        </Text>

        <View className="flex-row items-center justify-between">
          <View className="items-center flex-1 border-r border-border-subtle dark:border-slate-800">
            <Text className="text-navy dark:text-white font-bold text-2xl">
              {activeMistakes.length}
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold mt-1">
              Active
            </Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-navy dark:text-white font-bold text-2xl">
              {resolvedCount}
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold mt-1">
              Resolved
            </Text>
          </View>
        </View>
      </View>

      {/* Section Title */}
      <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 px-1">
        Your Weak Concepts
      </Text>

      {/* Active Mistakes Grouped List */}
      <View className="bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-2xl overflow-hidden mb-6">
        {activeMistakes.map((m, index) => (
          <MistakeListItem
            key={m.id}
            mistake={m}
            onPressViewDetail={() => handleViewMistakeDetail(m.conceptId)}
          />
        ))}

        {/* Empty State when zero active mistakes */}
        {activeMistakes.length === 0 && (
          <View className="p-8 items-center">
            <Text className="text-navy dark:text-white font-bold text-lg mb-2 text-center">
              No Active Weaknesses
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-sm text-center leading-5 max-w-xs">
              Great job! All weak concepts have been resolved through successful retrieval sessions.
            </Text>
          </View>
        )}
      </View>
    </AppScreen>
  );
}
