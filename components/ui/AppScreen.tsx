/**
 * NurseAI UI Primitive — AppScreen
 *
 * Generic screen shell with SafeArea, clinical background (light: warm-bg, dark: slate-900),
 * and optional scrollable container with horizontal padding.
 *
 * Light-first: base class is warm off-white (#F7F8FA).
 * Dark mode support retained via dark: modifiers.
 */

import React from "react";
import { View, ScrollView, type ViewStyle } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

interface AppScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
  className?: string;
}

export function AppScreen({
  children,
  scrollable = false,
  edges = ["top"],
  contentStyle,
}: AppScreenProps) {
  return (
    <View className="flex-1 bg-warm-bg dark:bg-slate-900">
      <SafeAreaView style={{ flex: 1 }} edges={edges}>
        {scrollable ? (
          <ScrollView
            className="flex-1 px-4"
            contentContainerStyle={[{ paddingTop: 12, paddingBottom: 40 }, contentStyle]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1 px-4 pt-3 pb-4" style={contentStyle}>
            {children}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
