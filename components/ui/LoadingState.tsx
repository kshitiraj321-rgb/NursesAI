/**
 * NurseAI UI Primitive — LoadingState
 *
 * Clean loading skeleton card foundation.
 */

import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading clinical workspace..." }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 items-center justify-center min-w-[200px] shadow-sm">
        <ActivityIndicator size="large" color="#4F46E5" className="mb-3" />
        <Text className="text-slate-600 dark:text-slate-300 font-medium text-xs text-center">
          {message}
        </Text>
      </View>
    </View>
  );
}
