import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";

import { db } from "../firebase";

type TopicEntry = [string, number];

export default function DashboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accuracy, setAccuracy] = useState("0");
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [topWeak, setTopWeak] = useState<TopicEntry[]>([]);
  const [topStrong, setTopStrong] = useState<TopicEntry[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const snapshot = await getDocs(
          collection(db, "users", user.uid, "quizResults")
        );

        let attempts = snapshot.size;
        let totalScore = 0;
        let totalQuestions = 0;

        let weakMap: Record<string, number> = {};
        let strongMap: Record<string, number> = {};

        snapshot.forEach((doc) => {
          const data = doc.data();

          totalScore += data.score || 0;
          totalQuestions += data.total || 0;

          Object.entries(data.weakTopics || {}).forEach(([topic, count]) => {
            weakMap[topic] = (weakMap[topic] || 0) + Number(count);
          });

          Object.entries(data.strongTopics || {}).forEach(([topic, count]) => {
            strongMap[topic] = (strongMap[topic] || 0) + Number(count);
          });
        });

        const calculatedAccuracy =
          totalQuestions > 0 ? ((totalScore / totalQuestions) * 100).toFixed(1) : "0";

        const weak = Object.entries(weakMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3) as TopicEntry[];

        const strong = Object.entries(strongMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3) as TopicEntry[];

        setTotalAttempts(attempts);
        setAccuracy(calculatedAccuracy);
        setTopWeak(weak);
        setTopStrong(strong);
      } catch (error) {
        console.log("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

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
              Weak Topics
            </Text>
            {topWeak.length === 0 ? (
              <Text style={{ color: "#A3A3A3", marginBottom: 20 }}>No weak topics yet</Text>
            ) : (
              topWeak.map(([topic, count]) => (
                <Text key={`weak-${topic}`} style={{ color: "#E5E7EB", marginBottom: 6 }}>
                  {topic} ({count})
                </Text>
              ))
            )}

            <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "700", marginTop: 20, marginBottom: 10 }}>
              Strong Topics
            </Text>
            {topStrong.length === 0 ? (
              <Text style={{ color: "#A3A3A3" }}>No strong topics yet</Text>
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
