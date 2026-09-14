import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { Concept } from "../../data/types/knowledge";
import { TrustBadge } from "./TrustBadge";

/**
 * ConceptCard — SLICE 2 Light-First Update
 *
 * Displays a single concept as structured study material.
 * White surface, border-subtle, navy title, slate body text.
 * Key takeaway shown as teal accent.
 */
interface ConceptCardProps {
  concept: Concept;
  onPress: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  definition: "Definition & Overview",
  etiology: "Etiology & Causes",
  riskFactors: "Risk Factors",
  pathophysiology: "Pathophysiology",
  clinicalManifestations: "Clinical Manifestations",
  assessment: "Nursing Assessment",
  diagnostics: "Diagnostics & Labs",
  management: "Medical Management",
  nursingManagement: "Nursing Management",
  complications: "Complications",
  redFlags: "Red Flags & Escalation",
  clinicalConnection: "Clinical Connections",
};

export function ConceptCard({ concept, onPress }: ConceptCardProps) {
  const typeLabel = TYPE_LABELS[concept.type] || concept.title || "Concept";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Study concept: ${concept.title}`}
      className="bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 p-4 rounded-xl mb-3 min-h-[44px]"
    >
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="text-clinical-teal dark:text-teal-400 font-semibold text-xs uppercase tracking-wide flex-1 mr-2">
          {typeLabel}
        </Text>
        <TrustBadge status={concept.meta.verificationStatus} size="sm" />
      </View>

      <Text className="text-navy dark:text-white font-bold text-base mb-1">
        {concept.title}
      </Text>

      <Text
        className="text-slate-500 dark:text-slate-400 text-xs leading-5 mb-2"
        numberOfLines={2}
      >
        {concept.content}
      </Text>

      {concept.keyTakeaways && concept.keyTakeaways.length > 0 && (
        <View className="bg-clinical-teal-light dark:bg-teal-950/40 border border-clinical-teal-border dark:border-teal-800/50 px-2.5 py-1.5 rounded-md mt-1">
          <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
            Key Takeaway
          </Text>
          <Text className="text-clinical-teal dark:text-teal-300 text-xs font-medium">
            {concept.keyTakeaways[0]}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
