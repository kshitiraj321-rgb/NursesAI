import { Stack } from "expo-router";
import React from "react";

export default function ToolboxLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0B0F1A", // Quiet dark clinical header
        },
        headerTintColor: "#F8FAFC",
        headerTitleStyle: {
          fontWeight: "700",
        },
        headerBackTitle: "Back",
        contentStyle: {
          backgroundColor: "#0B0F1A",
        },
      }}
    >
      <Stack.Screen
        name="iv-drip-rate"
        options={{ title: "IV Drip Rate" }}
      />
      <Stack.Screen
        name="ml-per-hour"
        options={{ title: "Infusion Rate (mL/hr)" }}
      />
      <Stack.Screen
        name="drops-per-min"
        options={{ title: "Drops per Minute" }}
      />
      <Stack.Screen
        name="temperature"
        options={{ title: "Temperature Converter" }}
      />
      <Stack.Screen
        name="weight"
        options={{ title: "Weight Converter" }}
      />
      <Stack.Screen
        name="unit-conversion"
        options={{ title: "Metric Unit Converter" }}
      />
      <Stack.Screen
        name="vital-signs"
        options={{ title: "Vital Signs Reference" }}
      />
      <Stack.Screen
        name="gcs"
        options={{ title: "Glasgow Coma Scale" }}
      />
      <Stack.Screen
        name="avpu"
        options={{ title: "AVPU Scale Reference" }}
      />
      <Stack.Screen
        name="pain-scales"
        options={{ title: "Pain Assessment Scales" }}
      />
    </Stack>
  );
}

