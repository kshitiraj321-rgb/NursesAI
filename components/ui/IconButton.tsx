/**
 * NurseAI UI Primitive — IconButton
 *
 * Compact circular/square icon button with accessibility label.
 */

import React from "react";
import { Text } from "react-native";
import { AnimatedPressable } from "./AnimatedPressable";

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  accessibilityLabel: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "subtle" | "glass";
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  size = "md",
  variant = "default",
}: IconButtonProps) {
  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8 rounded-lg";
      case "lg":
        return "w-12 h-12 rounded-2xl";
      default:
        return "w-10 h-10 rounded-xl";
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case "subtle":
        return "bg-slate-800/60 border border-slate-700/60";
      case "glass":
        return "bg-white/10 border border-white/15";
      default:
        return "bg-slate-800 border border-slate-700";
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      activeScale={0.95}
      className={`items-center justify-center ${getSizeStyle()} ${getVariantStyle()}`}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text className="text-white text-base">{icon}</Text>
    </AnimatedPressable>
  );
}
