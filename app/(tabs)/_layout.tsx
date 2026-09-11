import React from "react";
import { Tabs } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { HapticTab } from "@/components/haptic-tab";

/**
 * Tab Layout — Modernized Blueprint V1.1
 *
 * Three Certified Pillars: Learn (🧠) · Practice (🎯) · Toolbox (🩺)
 */
export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="learn"
      screenOptions={{
        headerShown: false,
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarStyle: {
          backgroundColor: "#0F172A",
          borderTopColor: "rgba(255, 255, 255, 0.08)",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 10,
          elevation: 0,
        },
        tabBarActiveTintColor: "#38BDF8",
        tabBarInactiveTintColor: "#64748B",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
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

      {/* TOOLBOX — Deterministic clinical utility (Clinical Context) */}
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