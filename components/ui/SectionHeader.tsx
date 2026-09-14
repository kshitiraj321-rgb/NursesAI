/**
 * NurseAI UI Primitive — SectionHeader
 *
 * Standardized section title with optional subtitle and right action badge/button.
 *
 * Light-first: title uses text-slate-500 (visible on warm-bg), not the old text-slate-400
 * which was designed for dark backgrounds.
 * Dark mode support retained.
 */

import React from "react";
import { View, Text } from "react-native";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <View className="flex-1 mr-2">
        <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-muted dark:text-slate-500 text-xs leading-4 mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      {action && <View>{action}</View>}
    </View>
  );
}
