/**
 * NurseAI UI Primitive — PrimaryButton
 *
 * High-contrast primary action button with tactile press feedback, loading state, and disabled state.
 *
 * Accent philosophy: blue is reserved for primary actions, not overused.
 * Variant matrix:
 *   primary  — professional blue (#2563EB) — default primary action
 *   emerald  — success green — confirm / positive outcome
 *   rose     — error red — destructive / mistake review
 *   purple   — REMOVED; mapped to primary (professional blue) to avoid gaming aesthetic
 */

import React from "react";
import { Text, ActivityIndicator } from "react-native";
import { AnimatedPressable } from "./AnimatedPressable";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "emerald" | "purple" | "rose" | "white" | "outline";
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
    if (disabled) return "bg-slate-200 dark:bg-slate-700 opacity-50 text-slate-500";
    switch (variant) {
      case "emerald":
        return "bg-emerald-500 active:bg-emerald-600";
      case "rose":
        return "bg-rose-500 active:bg-rose-600";
      case "white":
        return "bg-white active:bg-slate-50";
      case "outline":
        return "bg-transparent border border-border-subtle dark:border-slate-600 active:bg-slate-100 dark:active:bg-slate-800";
      // purple was a gaming-adjacent aesthetic — mapped to professional blue
      case "purple":
      case "primary":
      default:
        return "bg-clinical-blue active:bg-clinical-blue-pressed";
    }
  };

  const getTextColor = () => {
    if (variant === "white") return "text-navy";
    if (variant === "outline") return "text-navy dark:text-slate-100";
    return "text-white";
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      activeScale={0.98}
      className={`p-3.5 rounded-xl items-center flex-row justify-center min-h-[44px] ${getVariantStyle()}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={variant === "white" || variant === "outline" ? "#1e293b" : "#FFFFFF"} size="small" />
      ) : (
        <>
          {icon && <Text className="mr-2 text-base">{icon}</Text>}
          <Text className={`font-bold text-sm tracking-wide ${getTextColor()}`}>
            {label}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}
