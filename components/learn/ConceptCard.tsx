import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { Concept } from "../../data/types/knowledge";
import { TrustBadge } from "./TrustBadge";

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
      activeOpacity={0.8}
      className="bg-slate-800 border border-slate-700 p-4 rounded-xl mb-3"
    >
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="text-cyan-400 font-bold text-xs uppercase tracking-wide">
          {typeLabel}
        </Text>
        <TrustBadge status={concept.meta.verificationStatus} size="sm" />
      </View>

      <Text className="text-white font-bold text-base mb-1">
        {concept.title}
      </Text>

      <Text
        className="text-slate-300 text-xs leading-5 mb-2"
        numberOfLines={2}
      >
        {concept.content}
      </Text>

      {concept.keyTakeaways && concept.keyTakeaways.length > 0 && (
        <View className="bg-slate-900/80 p-2 rounded border border-slate-700/50 mt-1">
          <Text className="text-slate-400 text-[10px] uppercase font-semibold mb-0.5">
            Key Takeaway
          </Text>
          <Text className="text-cyan-200 text-xs font-medium">
            • {concept.keyTakeaways[0]}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
