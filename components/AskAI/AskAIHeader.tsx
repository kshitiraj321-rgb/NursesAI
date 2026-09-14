import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AskAIHeaderProps {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
}

export default function AskAIHeader({ selectedMode, setSelectedMode }: AskAIHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="absolute top-0 left-0 right-0 z-50 px-4 pb-4 bg-surface dark:bg-slate-900 border-b border-border-subtle dark:border-slate-800 shadow-sm"
      style={{ paddingTop: Math.max(insets.top, 20) + 10 }}
    >
      <View className="flex-row items-center gap-3">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="w-8 h-8 items-center justify-center bg-warm-bg dark:bg-slate-800 rounded-full border border-border-subtle dark:border-slate-700">
          <IconSymbol name="chevron.left" size={18} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-navy dark:text-white text-xl font-bold tracking-tight">
          NurseAI Assistant
        </Text>
      </View>

      <View className="flex-row mt-4 gap-2">
        {[
          { id: "summary", label: "Summary" },
          { id: "fullAnswer", label: "Full Answer" },
          { id: "quiz", label: "Quiz" }
        ].map((mode) => (
          <TouchableOpacity
            key={mode.id}
            onPress={() => setSelectedMode(mode.id)}
            className={`px-4 py-2 rounded-full border ${
              selectedMode === mode.id 
              ? "bg-clinical-blue/10 border-clinical-blue dark:bg-clinical-blue/20" 
              : "bg-warm-bg dark:bg-slate-800 border-border-subtle dark:border-slate-700"
            }`}
          >
            <Text className={`text-[13px] font-semibold tracking-wide ${
              selectedMode === mode.id ? "text-clinical-blue dark:text-clinical-blue" : "text-slate-600 dark:text-slate-300"
            }`}>
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
