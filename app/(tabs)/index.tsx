
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DailyFocusCard from "../../components/Home/DailyFocusCard";
import QuickActions from "../../components/Home/QuickActions";
import ProgressCard from "../../components/Home/ProgressCard";
import HomeHeader from "../../components/Home/HomeHeader";
import { auth, db } from "../../firebase";
import { useRetention } from "../../hooks/useRetention";
import { useIntelligenceContext } from "../../context/IntelligenceContext";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  

  const [user, setUser] = useState<any>(null);
  const [showComeback, setShowComeback] = useState(false);
  const [comebackTopic, setComebackTopic] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const { data: intelligenceData } = useIntelligenceContext();
  const retentionData = useRetention(user?.uid);
  
  useEffect(() => {
    if (!retentionData.lastActiveDate || Object.keys(intelligenceData.topicStats).length === 0) return;
    
    const todayString = new Date().toISOString().split('T')[0];
    const lastActive = new Date(retentionData.lastActiveDate);
    const today = new Date(todayString);
    const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays > 2) {
      const mostRecent = Object.entries(intelligenceData.topicStats).reduce(
        (latest, current) => current[1].lastAttempt > latest[1].lastAttempt ? current : latest,
        ["", { lastAttempt: 0 }] as [string, any]
      );
      if (mostRecent[0]) {
        setComebackTopic(mostRecent[0]);
        setShowComeback(true);
      }
    }
  }, [retentionData.lastActiveDate, intelligenceData.topicStats]);

  const recommendedTopic = intelligenceData.recommendedTopic || "";
  const topicStat = recommendedTopic ? intelligenceData.topicStats[recommendedTopic] : null;



  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login" as any);
    } catch {}
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning," : hour < 17 ? "Good Afternoon," : "Good Evening,";

  const handleSmartRevision = () => {
    if (!recommendedTopic) {
      console.log("No weak topics yet");
      return;
    }

    router.push({
      pathname: "/quiz" as any,
      params: {
        type: "pyq",
        mode: "revision",
        topic: recommendedTopic,
        topics: JSON.stringify([recommendedTopic]), // We still pass topics array if needed by quiz.tsx
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
        <DailyFocusCard dailyTopic={recommendedTopic} topicStat={topicStat} progress={Math.min((retentionData.todayProgress || 0) / (retentionData.dailyGoal || 10), 1)} delay={100} />
        <TouchableOpacity
          onPress={handleSmartRevision}
          activeOpacity={0.85}
          className="bg-white/10 border border-white/15 py-4 px-5 rounded-[20px] items-center shadow-xl mb-6"
        >
          <Text className="text-white text-[15px] font-bold tracking-wide">Improve Weak Areas</Text>
        </TouchableOpacity>
        <QuickActions delay={200} />
        <ProgressCard todayProgress={retentionData.todayProgress} dailyGoal={retentionData.dailyGoal} streak={retentionData.streak} delay={300} />
      </ScrollView>

      {/* Comeback Modal */}
      <Modal visible={showComeback} transparent animationType="fade">
        <View className="flex-1 bg-black/80 justify-center items-center px-5">
          <View className="bg-[#1c1c1e] w-full p-6 rounded-3xl border border-white/10">
            <Text className="text-white text-2xl font-bold mb-2">Welcome Back!</Text>
            <Text className="text-neutral-400 text-base mb-6">
              You left off at <Text className="text-white font-semibold">{comebackTopic}</Text> — continue?
            </Text>
            
            <View className="flex-row gap-3">
              <TouchableOpacity 
                onPress={() => setShowComeback(false)}
                className="flex-1 py-3.5 rounded-xl border border-white/10 items-center justify-center"
              >
                <Text className="text-white font-semibold">Not Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  setShowComeback(false);
                  router.push({
                    pathname: "/quiz" as any,
                    params: {
                      type: "pyq",
                      mode: "revision",
                      topic: comebackTopic,
                      topics: JSON.stringify([comebackTopic]),
                    },
                  });
                }}
                className="flex-1 py-3.5 rounded-xl bg-blue-600 items-center justify-center"
              >
                <Text className="text-white font-semibold">Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
