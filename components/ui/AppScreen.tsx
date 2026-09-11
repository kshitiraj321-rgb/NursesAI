/**
 * NurseAI UI Primitive — AppScreen
 *
 * Generic screen shell with SafeArea, clinical background (Light: slate-50, Dark: slate-900),
 * and optional scrollable container with horizontal padding.
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
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
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
