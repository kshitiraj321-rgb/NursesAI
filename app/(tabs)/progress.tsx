import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import { ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProgressCard from "../../components/Home/ProgressCard";

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  
  const [completedCount, setCompletedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

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

  return (
    <LinearGradient colors={["#0B0F1A", "#0E1A2B"]} style={{ flex: 1 }}>
      <ScrollView 
        className="flex-1 px-4" 
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-white text-3xl font-bold tracking-tight mb-6 px-1">Your Progress</Text>
        
        <ProgressCard completedCount={completedCount} totalTopics={100} streak={streak} xp={xp} delay={100} />
      </ScrollView>
    </LinearGradient>
  );
}
