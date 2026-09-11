/**
 * NurseAI UI Primitive — EmptyState
 *
 * Calm, informative zero-data placeholder with icon, message, and optional action button.
 */

import React from "react";
import { View, Text } from "react-native";
import { PrimaryButton } from "./PrimaryButton";

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "📚",
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl items-center justify-center my-4">
      <Text className="text-3xl mb-2">{icon}</Text>
      <Text className="text-slate-900 dark:text-slate-50 font-bold text-base text-center mb-1">
        {title}
      </Text>
      <Text className="text-slate-600 dark:text-slate-400 text-xs text-center leading-5 mb-4 max-w-[260px]">
        {message}
      </Text>
      {actionLabel && onAction && (
        <PrimaryButton label={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}
