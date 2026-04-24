import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { BlurView } from "expo-blur";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay } from "react-native-reanimated";

interface Props {
  completedCount: number;
  totalTopics: number;
  streak: number;
  xp: number;
  delay: number;
}



export default function ProgressCard({ todayProgress, dailyGoal, streak, delay }: Props) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    ty.value = withDelay(delay, withTiming(0, { duration: 400 }));
  }, [delay, opacity, ty]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }));

  const progressPercentage = Math.min((todayProgress / dailyGoal) * 100, 100);

  return (
    <Animated.View style={animatedCardStyle} className="mb-8 mt-2 shadow-xl shadow-black/40">
      <BlurView intensity={40} tint="dark" className="border border-white/10 bg-white/5 rounded-[20px] py-5 px-5 min-h-[100px] overflow-hidden">
        <View className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl block" />
        
        <View className="flex-row justify-between items-end mb-1">
          <Text className="text-white text-lg font-bold">Today's Goal</Text>
          <Text className="text-neutral-400 text-[14px] font-medium">{todayProgress} / {dailyGoal} questions</Text>
        </View>
        
        {/* Progress Bar */}
        <View className="h-2 w-full bg-white/10 rounded-full mb-5 mt-2 overflow-hidden">
          <View className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercentage}%` }} />
        </View>

        <View className="flex-row items-center gap-1.5">
          <Text className="text-blue-400 text-2xl font-black">{streak}</Text>
          <Text className="text-amber-500 text-xl">🔥</Text>
          <View className="ml-2">
            <Text className="text-white text-[15px] font-bold">{streak} day streak</Text>
            <Text className="text-neutral-400 text-[13px]">{streak > 0 ? "You're building consistency" : "Start your streak today"}</Text>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
}
