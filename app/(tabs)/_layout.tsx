import React from "react";
import { Tabs } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { HapticTab } from "@/components/haptic-tab";

/**
 * Tab Layout — SLICE 1 Light-First Design Foundation
 *
 * Three Certified Pillars: Learn (book) · Practice (target) · Toolbox (stethoscope)
 *
 * Design: white tab bar, professional blue active state, muted inactive.
 * Matches the light-first clinical aesthetic established in SLICE 1.
 */
export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="learn"
      screenOptions={{
        headerShown: false,
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E9F0",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 10,
          elevation: 0,
          // Subtle shadow for depth without glow
          shadowColor: "#0E1E3A",
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          fontFamily: "Inter_600SemiBold",
        },
      }}
    >
      {/* LEARN — Knowledge Backbone: Subject → Topic → Concept */}
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="book.fill" size={24} color={color} />
          ),
        }}
      />

      {/* PRACTICE — Active retrieval and learning loops */}
      <Tabs.Screen
        name="practice"
        options={{
          title: "Practice",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="target" size={24} color={color} />
          ),
        }}
      />

      {/* TOOLBOX — Deterministic clinical utility */}
      <Tabs.Screen
        name="toolbox"
        options={{
          title: "Toolbox",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="stethoscope" size={24} color={color} />
          ),
        }}
      />

      {/* HOME — Preserved as accessible route, hidden from tab bar */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      {/* ASK AI — Preserved as accessible route, hidden from tab bar */}
      <Tabs.Screen
        name="askai"
        options={{
          href: null,
        }}
      />

      {/* PROGRESS — Preserved as accessible route, hidden from tab bar */}
      <Tabs.Screen
        name="progress"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}