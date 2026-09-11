/**
 * NurseAI UI Primitive — Pill
 *
 * Badge indicator supporting semantic roles: success, warning, error, info, neutral, AI, trust.
 */

import React from "react";
import { View, Text } from "react-native";

export type PillVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "AI"
  | "trust";

interface PillProps {
  label: string;
  variant?: PillVariant;
  size?: "sm" | "md";
  icon?: string;
}

export function Pill({
  label,
  variant = "neutral",
  size = "md",
  icon,
}: PillProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "success":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-500/30",
          text: "text-emerald-700 dark:text-emerald-400",
        };
      case "warning":
        return {
          bg: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-500/30",
          text: "text-amber-700 dark:text-amber-400",
        };
      case "error":
        return {
          bg: "bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-500/30",
          text: "text-rose-700 dark:text-rose-400",
        };
      case "info":
        return {
          bg: "bg-sky-50 dark:bg-sky-900/30 border-sky-200 dark:border-sky-500/30",
          text: "text-sky-700 dark:text-sky-400",
        };
      case "AI":
        return {
          bg: "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-500/30",
          text: "text-indigo-700 dark:text-indigo-400",
        };
      case "trust":
        return {
          bg: "bg-cyan-50 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-500/30",
          text: "text-cyan-700 dark:text-cyan-400",
        };
      default:
        return {
          bg: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
          text: "text-slate-700 dark:text-slate-300",
        };
    }
  };

  const styles = getVariantStyle();
  const sizeStyle = size === "sm" ? "px-2 py-0.5" : "px-2.5 py-1";
  const textStyle = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <View
      className={`rounded-full border flex-row items-center justify-center ${styles.bg} ${sizeStyle}`}
    >
      {icon && <Text className={`mr-1 ${textStyle}`}>{icon}</Text>}
      <Text className={`font-extrabold uppercase tracking-wider ${styles.text} ${textStyle}`}>
        {label}
      </Text>
    </View>
  );
}
