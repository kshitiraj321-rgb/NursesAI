import React from "react";
import { View, Text } from "react-native";
import type { VerificationStatus } from "../../data/types/knowledge";

interface TrustBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "md";
}

const BADGE_CONFIG: Record<
  VerificationStatus,
  { label: string; bg: string; border: string; text: string; icon: string }
> = {
  PUBLISHED: {
    label: "Published Clinical Knowledge",
    bg: "bg-emerald-950/80",
    border: "border-emerald-700/60",
    text: "text-emerald-300",
    icon: "✓",
  },
  HUMAN_VERIFIED: {
    label: "Verified by Nurse Editor",
    bg: "bg-cyan-950/80",
    border: "border-cyan-700/60",
    text: "text-cyan-300",
    icon: "🛡️",
  },
  REVIEW_REQUIRED: {
    label: "Pending Clinical Verification",
    bg: "bg-amber-950/80",
    border: "border-amber-700/60",
    text: "text-amber-300",
    icon: "⚠️",
  },
  AI_GENERATED: {
    label: "AI Draft — Unverified",
    bg: "bg-purple-950/80",
    border: "border-purple-700/60",
    text: "text-purple-300",
    icon: "🤖",
  },
};

export function TrustBadge({ status, size = "md" }: TrustBadgeProps) {
  const config = BADGE_CONFIG[status] || BADGE_CONFIG.REVIEW_REQUIRED;

  return (
    <View
      className={`flex-row items-center border rounded-lg ${config.bg} ${config.border} ${
        size === "sm" ? "px-2 py-0.5" : "px-3 py-1"
      }`}
    >
      <Text className="mr-1.5 text-xs">{config.icon}</Text>
      <Text
        className={`font-bold uppercase tracking-wider ${config.text} ${
          size === "sm" ? "text-[10px]" : "text-xs"
        }`}
      >
        {config.label}
      </Text>
    </View>
  );
}
