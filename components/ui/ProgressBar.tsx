/**
 * NurseAI UI Primitive — ProgressBar
 *
 * Deterministic progress visualization with animated width interpolation.
 */

import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ProgressBarProps {
  progress: number; // Clamped 0 to 1
  color?: string;
  height?: number;
}

export function ProgressBar({
  progress,
  color = "#3B82F6",
  height = 6,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const widthShared = useSharedValue(clamped);

  useEffect(() => {
    widthShared.value = withTiming(clamped, { duration: 300 });
  }, [clamped, widthShared]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${widthShared.value * 100}%`,
  }));

  return (
    <View
      className="w-full bg-slate-800 rounded-full overflow-hidden"
      style={{ height }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      <Animated.View
        className="h-full rounded-full"
        style={[{ backgroundColor: color }, animatedStyle]}
      />
    </View>
  );
}
