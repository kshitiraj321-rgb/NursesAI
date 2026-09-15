/**
 * NurseAI UI Primitive — SecondaryButton
 *
 * Outlined / subtle secondary action button.
 *
 * Light-first: border uses border-subtle token on white/warm-bg.
 * Text uses deep navy for strong contrast on light surfaces.
 * Dark mode support retained.
 */

import React from "react";
import { Text } from "react-native";
import { AnimatedPressable } from "./AnimatedPressable";

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: string;
}

export function SecondaryButton({
  label,
  onPress,
  disabled = false,
  icon,
}: SecondaryButtonProps) {
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      activeScale={0.98}
      className={`p-4 rounded-full border-2 border-border-subtle dark:border-slate-600 bg-transparent items-center flex-row justify-center min-h-[54px] ${
        disabled ? "opacity-40" : "active:bg-slate-100 dark:active:bg-slate-800"
      }`}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {icon && <Text className="mr-2 text-base">{icon}</Text>}
      <Text className="text-navy dark:text-slate-100 font-semibold text-[15px] font-sans">
        {label}
      </Text>
    </AnimatedPressable>
  );
}
