import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { practiceRepository } from "../data/practice/repository";
import { useAuth } from "../context/AuthContext";
import { MistakeListItem } from "../components/practice/MistakeListItem";
import { AppScreen } from "../components/ui/AppScreen";
import { AppHeader } from "../components/ui/AppHeader";
import { GlassCard } from "../components/ui/GlassCard";
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
        subtitle="Weak concepts that need another retrieval attempt"
        showBack
        backText="Practice"
        onBack={() => router.replace("/(tabs)/practice" as any)}
      />

      {/* Active Weaknesses Banner Card */}
      <GlassCard
        variant={activeMistakes.length > 0 ? "accent" : "default"}
        className="mb-6 p-4"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center space-x-2">
            <Text className="text-xl">🚨</Text>
            <Text className="text-white font-bold text-base">
              ACTIVE WEAKNESSES
            </Text>
          </View>
          <Pill
            label={activeCountStr}
            variant={activeMistakes.length > 0 ? "error" : "success"}
            size="sm"
          />
        </View>

        <Text className="text-slate-300 text-xs leading-5 mb-4">
          Concepts where retrieval errors occurred. Resolve each concept with{" "}
          <Text className="font-bold text-amber-300">
            2 consecutive correct retrieval attempts
          </Text>
          .
        </Text>

        <View className="flex-row items-center justify-between bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <View className="items-center flex-1 border-r border-slate-800">
            <Text className="text-rose-400 font-extrabold text-xl">
              {activeMistakes.length}
            </Text>
            <Text className="text-slate-400 text-[10px] uppercase font-semibold mt-0.5">
              Active Weaknesses
            </Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-emerald-400 font-extrabold text-xl">
              {resolvedCount}
            </Text>
            <Text className="text-slate-400 text-[10px] uppercase font-semibold mt-0.5">
              Resolved Concepts
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* Section Title */}
      <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">
        Your Weak Concepts ({activeMistakes.length})
      </Text>

      {/* Active Mistakes List */}
      {activeMistakes.map((m) => (
        <MistakeListItem
          key={m.id}
          mistake={m}
          onPressViewDetail={() => handleViewMistakeDetail(m.conceptId)}
        />
      ))}

      {/* Empty State when zero active mistakes */}
      {activeMistakes.length === 0 && (
        <GlassCard variant="default" className="p-6 items-center">
          <Text className="text-3xl mb-2">🎉</Text>
          <Text className="text-emerald-400 font-bold text-lg mb-1 text-center">
            No Active Weaknesses!
          </Text>
          <Text className="text-slate-400 text-xs text-center leading-5 max-w-xs">
            Great job! All weak concepts have been resolved through 2 consecutive correct retrieval sessions.
          </Text>
        </GlassCard>
      )}
    </AppScreen>
  );
}

