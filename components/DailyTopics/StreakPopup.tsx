import React from "react";
import { Animated, Text, View } from "react-native";

interface StreakPopupProps {
  streak: number;
  gainedXP: number;
  scaleAnim: Animated.Value;
  opacityAnim: Animated.Value;
}

export default function StreakPopup({ streak, gainedXP, scaleAnim, opacityAnim }: StreakPopupProps) {
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: '40%',
        alignSelf: 'center',
        zIndex: 50,
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <View className="bg-[#1c1c1e] py-6 px-10 rounded-3xl items-center" style={{ borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 }}>
        <Text className="text-4xl mb-2">🔥</Text>
        <Text className="text-white text-xl font-bold tracking-wide text-center">
          {streak} Day Streak
        </Text>
        <Text className="text-yellow-400 text-base font-semibold mt-2 tracking-wide">
          +{gainedXP} XP
        </Text>
      </View>
    </Animated.View>
  );
}
