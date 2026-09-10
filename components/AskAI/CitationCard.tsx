import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CitationRecord } from '../../utils/api/askaiV2';

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
      className="mt-2 bg-[#1E293B] border border-white/10 rounded-lg p-3 flex-row items-center justify-between"
    >
      <View className="flex-1">
        <Text className="text-white font-medium text-[14px]" numberOfLines={1}>
          {title || "Reference"}
        </Text>
        {(page || pyqAuthenticity) && (
          <Text className="text-neutral-400 text-[12px] mt-1">
            {page ? `Page ${page}` : ""}
            {page && pyqAuthenticity ? " • " : ""}
            {pyqAuthenticity ? "Authentic PYQ" : ""}
          </Text>
        )}
      </View>
      {verificationStatus === "PUBLISHED" && (
        <View className="ml-2 bg-green-500/20 px-2 py-1 rounded">
          <Text className="text-green-400 text-[10px] font-bold uppercase tracking-wider">
            Verified
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
