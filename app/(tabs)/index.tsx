import { useRouter, useFocusEffect } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Text, Modal, View, Alert, ScrollView } from "react-native";
import { AppScreen } from "../../components/ui/AppScreen";
import { GlassCard } from "../../components/ui/GlassCard";
import { Pill } from "../../components/ui/Pill";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { SecondaryButton } from "../../components/ui/SecondaryButton";
import { AnimatedPressable } from "../../components/ui/AnimatedPressable";
import DailyFocusCard from "../../components/Home/DailyFocusCard";
import QuickActions from "../../components/Home/QuickActions";
import ProgressCard from "../../components/Home/ProgressCard";
import HomeHeader from "../../components/Home/HomeHeader";
import { auth, db } from "../../firebase";
import { useRetention } from "../../hooks/useRetention";
import { useIntelligenceContext } from "../../context/IntelligenceContext";

export default function HomeScreen() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [showComeback, setShowComeback] = useState(false);
  const [comebackTopic, setComebackTopic] = useState("");
  const [mistakeCount, setMistakeCount] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const fetchMistakes = async () => {
        if (!user) return;
        try {
          const q = query(collection(db, "users", user.uid, "mistakeBank"), where("mastered", "==", false));
          const snap = await getCountFromServer(q);
          if (isMounted) setMistakeCount(snap.data().count);
        } catch (err) {
          console.log(err);
        }
      };
      fetchMistakes();
      return () => { isMounted = false; };
    }, [user])
  );

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
  const baseGreeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const userName = user?.displayName ? user.displayName.split(" ")[0] : "Nurse";
  const greeting = `${baseGreeting}, ${userName} 👋`;

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
        topics: JSON.stringify([recommendedTopic]),
      },
    });
  };

  return (
    <AppScreen scrollable edges={["top"]}>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <HomeHeader greeting={greeting} userName={userName} onLogout={handleLogout} />

        <DailyFocusCard
          dailyTopic={recommendedTopic}
          topicStat={topicStat}
          progress={Math.min((retentionData.todayProgress || 0) / (retentionData.dailyGoal || 10), 1)}
          delay={100}
        />

        <AnimatedPressable onPress={handleSmartRevision} className="mb-4">
          <GlassCard className="p-4 border-l-4 border-l-sky-500 flex-row items-center justify-between">
            <View>
              <Text className="text-white font-bold text-base mb-0.5">Improve Weak Areas</Text>
              <Text className="text-slate-400 text-xs">Targeted revision based on performance analytics</Text>
            </View>
            <Pill label="Smart Review" variant="info" size="sm" />
          </GlassCard>
        </AnimatedPressable>

        {mistakeCount !== null && mistakeCount > 0 ? (
          <AnimatedPressable
            onPress={() => router.push({ pathname: "/quiz" as any, params: { type: "mistake", mode: "revision", topic: "Mistake Bank" } })}
            className="mb-6"
          >
            <GlassCard className="p-4 border-l-4 border-l-rose-500 flex-row items-center justify-between bg-rose-950/20">
              <View>
                <Text className="text-rose-400 font-bold text-base mb-0.5">Conquer Active Mistakes</Text>
                <Text className="text-slate-300 text-xs">{mistakeCount} active items requiring 2-attempt resolution</Text>
              </View>
              <Pill label={`${mistakeCount} Due`} variant="error" size="sm" />
            </GlassCard>
          </AnimatedPressable>
        ) : mistakeCount === 0 ? (
          <AnimatedPressable
            onPress={() => Alert.alert("All Clear! 🎉", "You have successfully conquered all your mistakes. Keep studying to build up your knowledge!")}
            className="mb-6"
          >
            <GlassCard className="p-4 border-l-4 border-l-emerald-500 flex-row items-center justify-between bg-emerald-950/20">
              <Text className="text-emerald-400 font-bold text-sm">Mistake Bank Clear 🎉</Text>
              <Pill label="100% Mastered" variant="success" size="sm" />
            </GlassCard>
          </AnimatedPressable>
        ) : null}

        <QuickActions delay={200} />
        <ProgressCard todayProgress={retentionData.todayProgress} dailyGoal={retentionData.dailyGoal} streak={retentionData.streak} delay={300} />
      </ScrollView>

      {/* Comeback Modal */}
      <Modal visible={showComeback} transparent animationType="fade">
        <View className="flex-1 bg-black/80 justify-center items-center px-5">
          <GlassCard variant="elevated" className="w-full p-6">
            <Text className="text-white text-2xl font-bold mb-2">Welcome Back!</Text>
            <Text className="text-slate-300 text-sm mb-6">
              You left off at <Text className="text-white font-semibold">{comebackTopic}</Text> — continue?
            </Text>

            <View className="flex-row space-x-3">
              <View className="flex-1">
                <SecondaryButton
                  label="Not Now"
                  onPress={() => setShowComeback(false)}
                />
              </View>
              <View className="flex-1">
                <PrimaryButton
                  label="Continue"
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
                />
              </View>
            </View>
          </GlassCard>
        </View>
      </Modal>
    </AppScreen>
  );
}

