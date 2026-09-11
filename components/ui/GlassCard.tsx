/**
 * NurseAI UI Primitive — GlassCard (Renamed visually to Card)
 *
 * Restrained surface card matching Level 1 (flat with border) or Level 2 (elevated) rules.
 * Supports press interaction via AnimatedPressable.
 */

import React from "react";
import { View, type ViewStyle } from "react-native";
import { AnimatedPressable } from "./AnimatedPressable";

interface GlassCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "default" | "elevated" | "interactive" | "accent";
  className?: string;
  style?: ViewStyle;
}

export function GlassCard({
  children,
  onPress,
  variant = "default",
  style,
  className = "",
}: GlassCardProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "elevated":
        // Level 2
        return "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm";
      case "interactive":
        return "bg-slate-50 dark:bg-slate-900 border-sky-200 dark:border-sky-800";
      case "accent":
        return "bg-indigo-50 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-500/50";
      default:
        // Level 1
        return "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700";
    }
  };

  const cardContent = (
    <View
      className={`p-4 rounded-xl border ${getVariantStyle()} ${className}`}
      style={style}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable onPress={onPress} activeScale={0.98} className="mb-3">
        {cardContent}
      </AnimatedPressable>
    );
  }

  return <View className="mb-3">{cardContent}</View>;
}
