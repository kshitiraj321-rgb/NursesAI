/**
 * NurseAI UI Primitive — SectionHeader
 *
 * Standardized section title with optional subtitle and right action badge/button.
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
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-slate-300 text-xs leading-4 mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      {action && <View>{action}</View>}
    </View>
  );
}
