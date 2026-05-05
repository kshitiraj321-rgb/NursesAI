
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAuth } from "firebase/auth";

import ProgressCard from "../../components/Home/ProgressCard";
import { useIntelligenceContext } from "../../context/IntelligenceContext";
import { useRetention } from "../../hooks/useRetention";

type TopicEntry = [string, number];

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const retentionData = useRetention(getAuth().currentUser?.uid);
  const todayProgress = retentionData.todayProgress || 0;
  const dailyGoal = retentionData.dailyGoal || 10;
  const streak = retentionData.streak || 0;


  const { data: intelligenceData, loading } = useIntelligenceContext();
  const { globalAccuracy: accuracy, totalAttempts, topicStats, strongestTopics } = intelligenceData;



  const topWeak = Object.entries(topicStats || {})
    .filter(([_, stat]) => stat.status === "weak")
    .sort((a, b) => b[1].intelligenceScore - a[1].intelligenceScore)
    .map(([topic, stat]) => [topic, stat.attempts] as TopicEntry);

  const topStrong = (strongestTopics || []).map(topic => [topic, topicStats[topic].attempts] as TopicEntry);
  const hasData = totalAttempts > 0;

  return (
    <LinearGradient colors={["#0B0F1A", "#0E1A2B"]} style={{ flex: 1 }}>
      <ScrollView 
        className="flex-1 px-4" 
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-white text-3xl font-bold tracking-tight mb-6 px-1">Your Progress</Text>
        
        <ProgressCard todayProgress={todayProgress} dailyGoal={dailyGoal} streak={streak} delay={100} />

        <View className="mt-8 px-1">
          <Text className="text-white text-2xl font-bold tracking-tight mb-4">Intelligence Stats</Text>

          {!hasData && !loading ? (
            <Text className="text-neutral-400 text-[15px]">No quiz data yet. Take some quizzes to see insights!</Text>
          ) : (
            <View className="bg-white/5 border border-white/10 rounded-[24px] p-5">
              <View className="flex-row justify-between mb-6">
                <View>
                  <Text className="text-neutral-400 text-sm mb-1">Accuracy</Text>
                  <Text className="text-white text-2xl font-bold">{loading ? "..." : `${accuracy}%`}</Text>
                </View>
                <View>
                  <Text className="text-neutral-400 text-sm mb-1">Attempts</Text>
                  <Text className="text-white text-2xl font-bold text-right">{loading ? "..." : totalAttempts}</Text>
                </View>
              </View>

              <Text className="text-white text-lg font-bold mb-3">Needs Improvement</Text>
              {topWeak.length === 0 ? (
                <Text className="text-neutral-400 text-sm mb-5">No topics need improvement yet</Text>
              ) : (
                topWeak.map(([topic, count]) => {
                  const trend = topicStats[topic].trend;
                  const trendLabel = trend === "improving" ? "↑ improving" : trend === "declining" ? "↓ declining" : "";
                  const trendColor = trend === "improving" ? "text-green-400" : "text-red-400";
                  return (
                    <Text key={`weak-${topic}`} className="text-neutral-300 text-[15px] mb-2">
                      • {topic} <Text className="text-neutral-500">({count})</Text>
                      {trendLabel ? <Text className={trendColor}> {trendLabel}</Text> : null}
                    </Text>
                  );
                })
              )}

              <Text className="text-white text-lg font-bold mt-4 mb-3">Mastered</Text>
              {topStrong.length === 0 ? (
                <Text className="text-neutral-400 text-sm">No mastered topics yet</Text>
              ) : (
                topStrong.map(([topic, count]) => (
                  <Text key={`strong-${topic}`} className="text-neutral-300 text-[15px] mb-2">
                    • {topic} <Text className="text-neutral-500">({count})</Text>
                  </Text>
                ))
              )}

              {topWeak.length > 0 && (
                <Text className="text-blue-400 font-semibold mt-5 text-center">
                  Focus on {topWeak[0][0]} next
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
