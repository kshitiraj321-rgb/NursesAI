/**
 * NurseAI UI Primitive — IconButton
 *
 * Compact circular/square icon button with accessibility label.
 *
 * Light-first: default variant uses light surface with border.
 * Minimum 44x44 touch target enforced.
 * Dark mode support retained.
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
        return "w-11 h-11 rounded-lg";
      case "lg":
        return "w-12 h-12 rounded-2xl";
      default:
        return "w-11 h-11 rounded-xl";
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case "subtle":
        return "bg-slate-100 dark:bg-slate-800/60 border border-border-subtle dark:border-slate-700/60";
      case "glass":
        return "bg-slate-100/80 dark:bg-white/10 border border-border-subtle dark:border-white/15";
      default:
        return "bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700";
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
      <Text className="text-navy dark:text-white text-base">{icon}</Text>
    </AnimatedPressable>
  );
}
