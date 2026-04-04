import { IconSymbol } from "@/components/ui/icon-symbol";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopColor: "#111",
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#888",
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* MAIN TABS */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="paperplane.fill" size={26} color={color} />
          ),
        }}
      />

      {/* HIDDEN SCREENS (IMPORTANT FIX) */}
      <Tabs.Screen name="askai" options={{ href: null }} />
      <Tabs.Screen name="quicklearn" options={{ href: null }} />
    </Tabs>
  );
}