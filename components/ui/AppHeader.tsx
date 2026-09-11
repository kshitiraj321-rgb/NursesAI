/**
 * NurseAI UI Primitive — AppHeader
 *
 * Quiet clinical screen header supporting title, subtitle, back action, and optional right action.
 */

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "./icon-symbol";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backText?: string;
  onBack?: () => void;
  showHome?: boolean;
  rightAction?: React.ReactNode;
}

export function AppHeader({
  title,
  subtitle,
  showBack = false,
  backText = "Back",
  onBack,
  showHome = false,
  rightAction,
}: AppHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)" as any);
    }
  };

  const handleHome = () => {
    router.replace("/(tabs)" as any);
  };

  return (
    <View className="mb-4">
      {showBack && (
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="mb-2 flex-row items-center py-1"
          accessibilityRole="button"
          accessibilityLabel={`Go back to ${backText}`}
        >
          <Text className="text-slate-600 dark:text-slate-400 font-semibold text-sm">
            ← {backText}
          </Text>
        </TouchableOpacity>
      )}

      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-2">
          <Text className="text-slate-900 dark:text-slate-50 text-2xl font-bold tracking-tight">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 leading-4">
              {subtitle}
            </Text>
          )}
        </View>

        <View className="flex-row items-center gap-2">
          {showHome && (
            <TouchableOpacity
              onPress={handleHome}
              activeOpacity={0.7}
              className="flex-row items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl shadow-sm"
              accessibilityRole="button"
              accessibilityLabel="Go to Home"
            >
              <IconSymbol name="house.fill" size={15} color="#0EA5E9" />
              <Text className="text-slate-700 dark:text-slate-300 text-xs font-semibold ml-1.5">Home</Text>
            </TouchableOpacity>
          )}
          {rightAction && <View>{rightAction}</View>}
        </View>
      </View>
    </View>
  );
}
