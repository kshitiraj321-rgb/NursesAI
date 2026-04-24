import { IconSymbol } from "@/components/ui/icon-symbol";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0B0F1A",
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#9CA3AF",
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
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="book.fill" size={26} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="askai"
        options={{
          title: "Ask AI",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="sparkles" size={26} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="chart.bar.fill" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}