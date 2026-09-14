import React from "react";
import { View, Text } from "react-native";
import type { VerificationStatus } from "../../data/types/knowledge";

/**
 * TrustBadge — SLICE 2 Light-First Update
 *
 * Indicates clinical verification status of content.
 * Light-first: semantic surface colors (light tints) on white backgrounds.
 * Dark mode support retained.
 */
interface TrustBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "md";
}

const BADGE_CONFIG: Record<
  VerificationStatus,
  { label: string; bg: string; border: string; text: string; icon: string }
> = {
  PUBLISHED: {
    label: "Published",
    bg: "bg-emerald-50 dark:bg-emerald-950/80",
    border: "border-emerald-200 dark:border-emerald-700/60",
    text: "text-emerald-700 dark:text-emerald-300",
    icon: "✓",
  },
  HUMAN_VERIFIED: {
    label: "Verified",
    bg: "bg-clinical-blue-light dark:bg-sky-950/80",
    border: "border-clinical-blue-border dark:border-sky-700/60",
    text: "text-clinical-blue dark:text-sky-300",
    icon: "🛡",
  },
  REVIEW_REQUIRED: {
    label: "Review",
    bg: "bg-amber-50 dark:bg-amber-950/80",
    border: "border-amber-200 dark:border-amber-700/60",
    text: "text-amber-700 dark:text-amber-300",
    icon: "⚠",
  },
  AI_GENERATED: {
    label: "AI Draft",
    bg: "bg-slate-100 dark:bg-slate-800",
    border: "border-border-subtle dark:border-slate-600",
    text: "text-slate-500 dark:text-slate-400",
    icon: "◎",
  },
};

export function TrustBadge({ status, size = "md" }: TrustBadgeProps) {
  const config = BADGE_CONFIG[status] || BADGE_CONFIG.REVIEW_REQUIRED;

  return (
    <View
      className={`flex-row items-center border rounded-md ${config.bg} ${config.border} ${
        size === "sm" ? "px-1.5 py-0.5" : "px-2.5 py-1"
      }`}
    >
      <Text className={`mr-1 ${size === "sm" ? "text-[10px]" : "text-xs"}`}>
        {config.icon}
      </Text>
      <Text
        className={`font-semibold tracking-wide ${config.text} ${
          size === "sm" ? "text-[10px]" : "text-xs"
        }`}
      >
        {config.label}
      </Text>
    </View>
  );
}
