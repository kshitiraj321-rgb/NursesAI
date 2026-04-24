import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from "react-native-reanimated";

interface Props {
  dailyTopic: string;
  progress: number;
  delay: number;
}

export default function DailyFocusCard({ dailyTopic, progress, delay }: Props) {
  const router = useRouter();

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

  const progressWidth = useSharedValue(0);
  useEffect(() => {
    progressWidth.value = withTiming(progress * 100, { duration: 800 });
  }, [progress, progressWidth]);

  const progressAnimStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const buttonScale = useSharedValue(1);
  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const onButtonPressIn = () => {
    buttonScale.value = withTiming(0.96, { duration: 150 });
  };

  const traverse = () => {
    if (!dailyTopic) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/quiz" as any,
      params: { type: "pyq", topic: dailyTopic },
    });
  };

  const onButtonPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 150 });
  };

  return (
    <Animated.View style={animatedCardStyle} className="mb-6 shadow-xl shadow-black/40">
      <BlurView intensity={40} tint="dark" className="border border-white/10 rounded-[20px] p-5 min-h-[120px] overflow-hidden bg-white/5">
        <View className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

        <Text className="text-blue-400 text-lg font-bold mb-1">Daily Focus</Text>
        <Text className="text-white text-xl font-bold mb-3">{dailyTopic || "No weak topics yet"}</Text>

        <View className="h-1.5 bg-white/10 border border-white/20 rounded-full mb-4 overflow-hidden shadow-sm">
          <Animated.View style={[progressAnimStyle, { height: "100%", borderRadius: 4 }]}>
            <LinearGradient
              colors={["#60A5FA", "#3B82F6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </View>

        <Animated.View style={buttonAnimStyle}>
          <TouchableOpacity
            className="bg-blue-500 py-3.5 px-5 rounded-[16px] items-center shadow-lg"
            onPressIn={onButtonPressIn}
            onPressOut={onButtonPressOut}
            onPress={traverse}
            activeOpacity={1}
          >
            <Text className="text-white text-[15px] font-bold tracking-wide">Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
}
