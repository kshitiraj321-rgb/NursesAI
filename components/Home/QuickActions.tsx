import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface Props {
  delay: number;
}
const AnimatedView = Animated.createAnimatedComponent(View);

export default function QuickActions({ delay }: Props) {
  const router = useRouter();

  const opacity = useSharedValue(0);
  const ty = useSharedValue(20);

  useEffect(() => {
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 400 });
      ty.value = withTiming(0, { duration: 400 });
    }, delay);
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }));

  const ActionButton = ({ title, icon, color, bg, border, route }: any) => {
    const scale = useSharedValue(1);

    const onPressIn = () => { scale.value = withTiming(0.96, { duration: 150 }); };
    const navigate = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(route);
    };
    const onPressOut = () => {
      scale.value = withTiming(1, { duration: 150 });
    };

    return (
      <AnimatedView style={useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], width: '48%', marginBottom: 14 }))}>
        <TouchableOpacity
          onPress={navigate}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          className="w-full bg-white/10 border border-white/15 py-4 px-3 min-h-[95px] rounded-[20px] items-center shadow-xl"
          activeOpacity={1}
        >
          <View className={`w-12 h-12 rounded-full justify-center items-center mb-2 ${bg} border ${border}`}>
            <Ionicons name={icon as any} size={24} color={color} />
          </View>
          <Text className="text-white text-[13px] font-semibold text-center">{title}</Text>
        </TouchableOpacity>
      </AnimatedView>
    );
  };

  return (
    <View className="mb-2">
      <Text className="text-neutral-400 text-base font-semibold mb-3">Quick Actions</Text>
      <AnimatedView style={animatedCardStyle} className="flex-row flex-wrap justify-between">
        <ActionButton title="Ask AI" icon="chatbubble-outline" color="#60A5FA" bg="bg-blue-400/30" border="border-blue-400/40" route="/(tabs)/askai" />
        <ActionButton title="Quick Learn" icon="book-outline" color="#9CA3AF" bg="bg-gray-500/30" border="border-gray-500/40" route="/(tabs)/learn" />
      </AnimatedView>
    </View>
  );
}
