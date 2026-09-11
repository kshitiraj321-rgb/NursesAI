/**
 * NurseAI UI Primitive — SecondaryButton
 *
 * Outlined / subtle secondary action button.
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
      className={`p-3.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent items-center flex-row justify-center ${
        disabled ? "opacity-40" : "active:bg-slate-100 dark:active:bg-slate-800"
      }`}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {icon && <Text className="mr-2 text-base">{icon}</Text>}
      <Text className="text-slate-900 dark:text-slate-100 font-semibold text-sm">
        {label}
      </Text>
    </AnimatedPressable>
  );
}
