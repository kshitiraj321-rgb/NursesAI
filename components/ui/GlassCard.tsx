/**
 * NurseAI UI Primitive — GlassCard (now: Card)
 *
 * Clean surface card. Moved away from dark/glass visual treatment to:
 * - white surface
 * - subtle #E5E9F0-style border
 * - minimal neutral shadow
 * - moderate 12px radius
 *
 * Variant matrix:
 *   default     — white surface, subtle border, card shadow
 *   elevated    — white surface, stronger shadow
 *   interactive — light blue tint, interactive border
 *   accent      — light blue fill, blue border (use very sparingly)
 *
 * File name retained as GlassCard.tsx to preserve all existing imports.
 * Dark mode support retained via dark: modifiers.
 */

import React from "react";
import { View, type ViewStyle } from "react-native";
import { AnimatedPressable } from "./AnimatedPressable";
import { shadows } from "../../constants/shadows";

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
  const getVariantClass = () => {
    switch (variant) {
      case "elevated":
        return "bg-surface dark:bg-slate-800 border-border-subtle dark:border-slate-700";
      case "interactive":
        return "bg-clinical-blue-light dark:bg-slate-900 border-clinical-blue-border dark:border-sky-800";
      case "accent":
        return "bg-clinical-blue-light dark:bg-indigo-900/40 border-clinical-blue-border dark:border-indigo-500/50";
      default:
        return "bg-surface dark:bg-slate-800 border-border-subtle dark:border-slate-700";
    }
  };

  const cardContent = (
    <View
      className={`p-4 rounded-xl border ${getVariantClass()} ${className}`}
      style={[variant === "elevated" ? shadows.sm : shadows.card, style]}
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
