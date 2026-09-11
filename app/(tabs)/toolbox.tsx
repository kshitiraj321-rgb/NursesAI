import React from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import type { ToolMeta } from "../../data/types/knowledge";
import { AppScreen } from "../../components/ui/AppScreen";
import { AppHeader } from "../../components/ui/AppHeader";
import { GlassCard } from "../../components/ui/GlassCard";
import { Pill, type PillVariant } from "../../components/ui/Pill";
import { AnimatedPressable } from "../../components/ui/AnimatedPressable";

/**
 * Toolbox Screen — Phase 5.5 Modernized Hub
 *
 * Clinical utilities for fast, precise decisions.
 * ALL calculators are deterministic. AI may explain, but NEVER calculate.
 */

const V1_TOOL_REGISTRY: ToolMeta[] = [
  {
    id: "iv_drip_rate",
    name: "IV Drip Rate",
    description: "Calculate drops per minute for IV infusion",
    riskLevel: "MEDIUM",
    source: "Standard nursing pharmacology formula",
    verificationStatus: "PUBLISHED",
    lastReviewedAt: "2026-09-08",
    safetyNote:
      "Always verify with hospital protocol. Cross-check with prescriber order.",
    releaseGate: "V1",
  },
  {
    id: "ml_per_hour",
    name: "mL / Hour",
    description: "Calculate infusion rate in mL per hour",
    riskLevel: "MEDIUM",
    source: "Standard nursing pharmacology formula",
    verificationStatus: "PUBLISHED",
    lastReviewedAt: "2026-09-08",
    safetyNote: "Confirm total volume and duration with prescriber order.",
    releaseGate: "V1",
  },
  {
    id: "drops_per_min",
    name: "Drops / Min",
    description: "Calculate drip rate in drops per minute",
    riskLevel: "MEDIUM",
    source: "Standard nursing pharmacology formula",
    verificationStatus: "PUBLISHED",
    lastReviewedAt: "2026-09-08",
    safetyNote: "Drop factor varies by IV set. Confirm before use.",
    releaseGate: "V1",
  },
  {
    id: "temperature_conversion",
    name: "Temperature",
    description: "Convert between °C and °F",
    riskLevel: "LOW",
    source: "SI unit conversion standard",
    verificationStatus: "PUBLISHED",
    lastReviewedAt: "2026-09-08",
    safetyNote: "Reference aid only. Verify clinical readings with calibrated equipment.",
    releaseGate: "V1",
  },
  {
    id: "weight_conversion",
    name: "Weight Conversion",
    description: "Convert between kg and lbs",
    riskLevel: "LOW",
    source: "SI unit conversion standard",
    verificationStatus: "PUBLISHED",
    lastReviewedAt: "2026-09-08",
    safetyNote: "Reference aid only. Always use calibrated weighing equipment.",
    releaseGate: "V1",
  },
  {
    id: "unit_conversion",
    name: "Unit Conversion",
    description: "Common nursing unit conversions",
    riskLevel: "LOW",
    source: "SI unit conversion standard",
    verificationStatus: "PUBLISHED",
    lastReviewedAt: "2026-09-08",
    safetyNote: "Reference aid only.",
    releaseGate: "V1",
  },
];

const V1_REFERENCE_REGISTRY: ToolMeta[] = [
  {
    id: "vital_signs",
    name: "Vital Signs",
    description: "Normal ranges for adults and common variations",
    riskLevel: "LOW",
    source: "WHO & AHA clinical guidelines",
    verificationStatus: "PUBLISHED",
    lastReviewedAt: "2026-09-08",
    safetyNote: "Reference ranges. Always interpret in the clinical context of the patient.",
    releaseGate: "V1",
  },
  {
    id: "gcs",
    name: "Glasgow Coma Scale (GCS)",
    description: "Assess level of consciousness",
    riskLevel: "MEDIUM",
    source: "Original Teasdale & Jennett, 1974 / current clinical standard",
    verificationStatus: "PUBLISHED",
    lastReviewedAt: "2026-09-08",
    safetyNote: "Clinical assessment tool. Not a substitute for formal neurological evaluation.",
    releaseGate: "V1",
  },
  {
    id: "avpu",
    name: "AVPU Scale",
    description: "Alert, Voice, Pain, Unresponsive — rapid consciousness check",
    riskLevel: "LOW",
    source: "ATLS / emergency nursing standard",
    verificationStatus: "PUBLISHED",
    lastReviewedAt: "2026-09-08",
    safetyNote: "Rapid assessment tool only. Escalate based on hospital protocol.",
    releaseGate: "V1",
  },
  {
    id: "pain_scales",
    name: "Pain Scales",
    description: "NRS, VAS, and FLACC reference",
    riskLevel: "LOW",
    source: "APS & standard nursing pain assessment",
    verificationStatus: "PUBLISHED",
    lastReviewedAt: "2026-09-08",
    safetyNote: "Subjective assessment. Document per hospital protocol.",
    releaseGate: "V1",
  },
];

const RISK_PILL_VARIANT: Record<string, PillVariant> = {
  LOW: "info",
  MEDIUM: "warning",
  HIGH: "error",
};

const TOOL_ROUTE_MAP: Record<string, string> = {
  iv_drip_rate: "/toolbox/iv-drip-rate",
  ml_per_hour: "/toolbox/ml-per-hour",
  drops_per_min: "/toolbox/drops-per-min",
  temperature_conversion: "/toolbox/temperature",
  weight_conversion: "/toolbox/weight",
  unit_conversion: "/toolbox/unit-conversion",
  vital_signs: "/toolbox/vital-signs",
  gcs: "/toolbox/gcs",
  avpu: "/toolbox/avpu",
  pain_scales: "/toolbox/pain-scales",
};

function ToolCard({ tool, onPress }: { tool: ToolMeta; onPress: () => void }) {
  const pillVariant = RISK_PILL_VARIANT[tool.riskLevel] || "neutral";

  return (
    <AnimatedPressable
      onPress={onPress}
      activeScale={0.98}
      className="mb-3"
      accessibilityRole="button"
      accessibilityLabel={`Open ${tool.name}`}
    >
      <GlassCard variant="default" className="p-4">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-white font-bold text-base flex-1 mr-2 tracking-tight">
            {tool.name}
          </Text>
          <Pill label={tool.riskLevel} variant={pillVariant} size="sm" />
        </View>
        <Text className="text-slate-300 text-xs leading-5 mb-2.5">
          {tool.description}
        </Text>
        <Text className="text-amber-400/80 text-[11px] leading-4 italic">
          ⚠ {tool.safetyNote}
        </Text>
      </GlassCard>
    </AnimatedPressable>
  );
}

export default function ToolboxScreen() {
  const handleToolPress = (tool: ToolMeta) => {
    const route = TOOL_ROUTE_MAP[tool.id];
    if (route) {
      router.push(route as any);
    }
  };

  return (
    <AppScreen scrollable edges={["top"]}>
      {/* Quiet Header */}
      <AppHeader
        title="Toolbox"
        subtitle="Clinical utilities for fast, precise decisions"
        showHome
      />

      {/* Safety Disclaimer Banner */}
      <GlassCard variant="accent" className="mb-6 p-4">
        <View className="flex-row items-start space-x-3">
          <Text className="text-xl">⚠</Text>
          <View className="flex-1">
            <Text className="text-white font-bold text-sm mb-1">
              Clinical Reference & Safety Warning
            </Text>
            <Text className="text-slate-300 text-xs leading-5">
              These tools are reference aids only and are <Text className="font-bold text-amber-300">NEVER</Text> a substitute for hospital protocol, prescriber order, institutional guidelines, or clinical judgment.
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* Calculators Section */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-3 px-1">
          <Text className="text-white text-lg font-bold">
            🧮 Deterministic Calculators
          </Text>
          <Pill label="V1 RELEASE" variant="trust" size="sm" />
        </View>
        {V1_TOOL_REGISTRY.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onPress={() => handleToolPress(tool)}
          />
        ))}
      </View>

      {/* Quick References Section */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-3 px-1">
          <Text className="text-white text-lg font-bold">
            📋 Clinical Quick References
          </Text>
          <Pill label="V1 RELEASE" variant="trust" size="sm" />
        </View>
        {V1_REFERENCE_REGISTRY.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onPress={() => handleToolPress(tool)}
          />
        ))}
      </View>

      {/* Deferred Roadmap Section */}
      <View className="mb-4 opacity-50 space-y-2">
        {["💊 Medication Safety", "🚨 Clinical Decision Support"].map((label) => (
          <GlassCard key={label} variant="default" className="p-3.5 flex-row items-center justify-between">
            <Text className="text-slate-400 font-semibold text-sm">
              {label}
            </Text>
            <Pill label="PLANNED V1.5" variant="neutral" size="sm" />
          </GlassCard>
        ))}
      </View>
    </AppScreen>
  );
}

