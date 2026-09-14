/**
 * NurseAI UI Primitive — LoadingState
 *
 * Clean loading placeholder.
 *
 * Light-first: white surface on warm-bg, professional blue spinner.
 * Dark mode support retained.
 */

import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading clinical workspace..." }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="bg-surface dark:bg-slate-800 p-5 rounded-xl border border-border-subtle dark:border-slate-700 items-center justify-center min-w-[200px]" style={{ shadowColor: "#0E1E3A", shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 }}>
        <ActivityIndicator size="large" color="#2563EB" style={{ marginBottom: 12 }} />
        <Text className="text-slate-600 dark:text-slate-300 font-medium text-xs text-center">
          {message}
        </Text>
      </View>
    </View>
  );
}
