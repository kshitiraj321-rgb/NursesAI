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



export default function ProgressCard({ completedCount, totalTopics, streak, xp, delay }: Props) {
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

  return (
    <Animated.View style={animatedCardStyle} className="mb-8 mt-2 shadow-xl shadow-black/40">
      <BlurView intensity={40} tint="dark" className="border border-white/10 bg-white/5 rounded-[20px] py-5 px-5 min-h-[100px] overflow-hidden">
        <View className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl block" />
        
        <Text className="text-white text-lg font-bold mb-1">Progress</Text>
        <Text className="text-neutral-400 text-[14px] font-medium mb-3">
          {completedCount}/{totalTopics} topics
        </Text>

        <View className="flex-row items-center gap-1.5">
          <Text className="text-blue-400 text-2xl font-black">{streak}</Text>
          <Text className="text-amber-500 text-xl">🔥</Text>
          <Text className="text-neutral-400 text-[14px]">streak</Text>
          <Text className="text-yellow-400 mt-1 ml-2 font-semibold">⭐ {xp} XP</Text>
        </View>
      </BlurView>
    </Animated.View>
  );
}
