import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";

import { db } from "../firebase";
import { useIntelligence } from "../hooks/useIntelligence";

type TopicEntry = [string, number];

export default function DashboardScreen() {
  const router = useRouter();
  const { loading, globalAccuracy: accuracy, totalAttempts, topicStats, strongestTopics } = useIntelligence(getAuth().currentUser?.uid);

  const topWeak = Object.entries(topicStats)
    .filter(([_, stat]) => stat.status === "weak")
    .sort((a, b) => b[1].intelligenceScore - a[1].intelligenceScore)
    .map(([topic, stat]) => [topic, stat.attempts] as TopicEntry);

  const topStrong = strongestTopics.map(topic => [topic, topicStats[topic].attempts] as TopicEntry);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#FFFFFF" }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasData = totalAttempts > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <View style={{ flex: 1, padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
          <Text style={{ color: "#3B82F6", fontWeight: "600", fontSize: 15 }}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "700", marginBottom: 16 }}>
          Your Progress
        </Text>

        {!hasData ? (
          <Text style={{ color: "#A3A3A3", fontSize: 16 }}>No quiz data yet</Text>
        ) : (
          <>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: "#A3A3A3", fontSize: 14 }}>Accuracy</Text>
              <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700" }}>{accuracy}%</Text>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: "#A3A3A3", fontSize: 14 }}>Total Attempts</Text>
              <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "700" }}>{totalAttempts}</Text>
            </View>

            <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "700", marginBottom: 10 }}>
              Needs Improvement
            </Text>
            {topWeak.length === 0 ? (
              <Text style={{ color: "#A3A3A3", marginBottom: 20 }}>No topics need improvement yet</Text>
            ) : (
              topWeak.map(([topic, count]) => {
                const trend = topicStats[topic].trend;
                const trendLabel = trend === "improving" ? "↑ improving" : trend === "declining" ? "↓ declining" : "";
                const trendColor = trend === "improving" ? "#34D399" : "#F87171";
                return (
                  <Text key={`weak-${topic}`} style={{ color: "#E5E7EB", marginBottom: 6 }}>
                    {topic} ({count}) {trendLabel ? <Text style={{ color: trendColor }}> {trendLabel}</Text> : null}
                  </Text>
                );
              })
            )}

            <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "700", marginTop: 20, marginBottom: 10 }}>
              Mastered
            </Text>
            {topStrong.length === 0 ? (
              <Text style={{ color: "#A3A3A3" }}>No mastered topics yet</Text>
            ) : (
              topStrong.map(([topic, count]) => (
                <Text key={`strong-${topic}`} style={{ color: "#E5E7EB", marginBottom: 6 }}>
                  {topic} ({count})
                </Text>
              ))
            )}

            {topWeak.length > 0 && (
              <Text style={{ color: "#93C5FD", marginTop: 24, fontWeight: "600" }}>
                You should focus on {topWeak[0][0]}
              </Text>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
