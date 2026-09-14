import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CitationRecord } from '../../utils/api/askaiV2';
import { Pill } from '../ui/Pill';

interface CitationCardProps {
  citation: CitationRecord;
  onPress?: () => void;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation, onPress }) => {
  const { title, page, pyqAuthenticity, verificationStatus } = citation.provenance || {};

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="mt-2 bg-warm-bg dark:bg-slate-950 border border-border-subtle dark:border-slate-800 rounded-xl p-3.5 flex-row items-center justify-between"
    >
      <View className="flex-1">
        <Text className="text-navy dark:text-white font-bold text-[13px] tracking-tight mb-1" numberOfLines={1}>
          {title || "Reference"}
        </Text>
        {(page || pyqAuthenticity) && (
          <Text className="text-slate-500 dark:text-slate-400 text-[11px] font-medium tracking-wide">
            {page ? `Page ${page}` : ""}
            {page && pyqAuthenticity ? " • " : ""}
            {pyqAuthenticity ? "Authentic PYQ" : ""}
          </Text>
        )}
      </View>
      {verificationStatus === "PUBLISHED" && (
        <View className="ml-3">
          <Pill label="Verified" variant="trust" size="sm" />
        </View>
      )}
    </TouchableOpacity>
  );
};
