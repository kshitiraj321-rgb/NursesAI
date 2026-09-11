/**
 * NurseAI UI Primitive — PrimaryButton
 *
 * High-contrast primary action button with tactile press feedback, loading state, and disabled state.
 */

import React from "react";
import { Text, ActivityIndicator } from "react-native";
import { AnimatedPressable } from "./AnimatedPressable";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "emerald" | "purple" | "rose";
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
}

export function PrimaryButton({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
}: PrimaryButtonProps) {
  const getVariantStyle = () => {
    if (disabled) return "bg-slate-200 dark:bg-slate-800 opacity-50";
    switch (variant) {
      case "emerald":
        return "bg-emerald-500 active:bg-emerald-600";
      case "purple":
        return "bg-indigo-600 active:bg-indigo-700";
      case "rose":
        return "bg-rose-500 active:bg-rose-600";
      default:
        return "bg-indigo-600 active:bg-indigo-700";
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      activeScale={0.98}
      className={`p-3.5 rounded-xl items-center flex-row justify-center ${getVariantStyle()}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <>
          {icon && <Text className="mr-2 text-base">{icon}</Text>}
          <Text className="text-white font-bold text-sm tracking-wide">
            {label}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}
