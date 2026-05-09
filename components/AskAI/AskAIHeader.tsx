import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AskAIHeaderProps {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
}

export default function AskAIHeader({ selectedMode, setSelectedMode }: AskAIHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <BlurView 
      intensity={70} 
      tint="dark" 
      className="absolute top-0 left-0 right-0 z-50 px-4 pb-4 border-b border-white/5"
      style={{ paddingTop: Math.max(insets.top, 20) + 10 }}
    >
      <View className="flex-row items-center gap-3">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="w-8 h-8 items-center justify-center bg-white/10 rounded-full">
          <IconSymbol name="chevron.left" size={18} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold tracking-tight">
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
            className={`px-4 py-2 rounded-full ${
              selectedMode === mode.id ? "bg-blue-600/80 border border-blue-400/30" : "bg-white/10 border border-transparent"
            }`}
          >
            <Text className={`text-[13px] font-semibold ${selectedMode === mode.id ? "text-white" : "text-neutral-300"}`}>{mode.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </BlurView>
  );
}
