import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DailyFocusCard from "../../components/Home/DailyFocusCard";
import QuickActions from "../../components/Home/QuickActions";
import ProgressCard from "../../components/Home/ProgressCard";
import HomeHeader from "../../components/Home/HomeHeader";
import { auth, db } from "../../firebase";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [dailyTopic, setDailyTopic] = useState("");
  const [revisionTopics, setRevisionTopics] = useState<string[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    const loadDailyFocus = async () => {
      if (!user) {
        setDailyTopic("");
        setRevisionTopics([]);
        return;
      }

      try {
        const resultsQuery = query(
          collection(db, "users", user.uid, "quizResults"),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        const snapshot = await getDocs(resultsQuery);
        const totals: Record<string, number> = {};

        snapshot.forEach((doc) => {
          const weakTopics = doc.data().weakTopics || {};

          Object.entries(weakTopics).forEach(([topic, count]) => {
            totals[topic] = (totals[topic] || 0) + Number(count || 0);
          });
        });

        const topWeakTopics = Object.entries(totals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([topic]) => topic);

        setDailyTopic(topWeakTopics[0] || "");
        setRevisionTopics(topWeakTopics);
      } catch (e) {
        console.log("Error loading daily focus:", e);
      }
    };

    loadDailyFocus();
  }, [user]);

  const loadLocalProgress = async () => {
    try {
      const storedStreak = await AsyncStorage.getItem("streak");
      const storedXP = await AsyncStorage.getItem("xp");
      const storedTopics = await AsyncStorage.getItem("completedTopics");

      if (storedStreak) setStreak(parseInt(storedStreak));
      if (storedXP) setXp(parseInt(storedXP));
      if (storedTopics) setCompletedCount(JSON.parse(storedTopics).length);
    } catch (e) {
      console.log("Error loading progress:", e);
    }
  };

  useFocusEffect(useCallback(() => { loadLocalProgress(); }, []));

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login" as any);
    } catch {}
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning," : hour < 17 ? "Good Afternoon," : "Good Evening,";

  const handleSmartRevision = () => {
    if (revisionTopics.length === 0) {
      console.log("No weak topics yet");
      return;
    }

    router.push({
      pathname: "/quiz" as any,
      params: {
        type: "pyq",
        mode: "revision",
        topic: revisionTopics[0],
        topics: JSON.stringify(revisionTopics),
      },
    });
  };

  return (
    <LinearGradient colors={["#0B0F1A", "#0E1A2B"]} style={{ flex: 1 }}>
      <ScrollView 
        className="flex-1 px-4" 
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader greeting={greeting} onLogout={handleLogout} />
        <DailyFocusCard dailyTopic={dailyTopic} progress={Math.min(completedCount / 10, 1)} delay={100} />
        <TouchableOpacity
          onPress={handleSmartRevision}
          activeOpacity={0.85}
          className="bg-white/10 border border-white/15 py-4 px-5 rounded-[20px] items-center shadow-xl mb-6"
        >
          <Text className="text-white text-[15px] font-bold tracking-wide">Revise Weak Areas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/dashboard" as any)}
          activeOpacity={0.85}
          className="bg-white/10 border border-white/15 py-4 px-5 rounded-[20px] items-center shadow-xl mb-6"
        >
          <Text className="text-white text-[15px] font-bold tracking-wide">View Progress</Text>
        </TouchableOpacity>
        <QuickActions delay={200} />
        <ProgressCard completedCount={completedCount} totalTopics={100} streak={streak} xp={xp} delay={300} />
      </ScrollView>
    </LinearGradient>
  );
}
