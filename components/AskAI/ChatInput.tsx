import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatInputProps {
  question: string;
  setQuestion: (val: string) => void;
  onSend: () => void;
  loading: boolean;
}

export default function ChatInput({ question, setQuestion, onSend, loading }: ChatInputProps) {
  const insets = useSafeAreaInsets();
  return (
    <BlurView 
      intensity={80} 
      tint="dark" 
      className="flex-row px-3 pt-3 items-center border-t border-white/5 bg-[#0F172A]/70"
      style={{ 
        paddingBottom: Math.max(insets.bottom, 12),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 12,
        backgroundColor: 'rgba(15, 23, 42, 0.9)', // slightly darker fallback
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)'
      }}
    >
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Type to ask NurseAI..."
        placeholderTextColor="#64748B"
        className="flex-1 bg-[#1E293B]/80 border border-white/10 px-5 py-3.5 text-white rounded-full text-[15px]"
        style={{
          flex: 1,
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          paddingHorizontal: 20,
          paddingVertical: 14,
          color: '#fff',
          borderRadius: 25,
          fontSize: 15
        }}
        editable={!loading}
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={loading || !question.trim()}
        className={`ml-2 px-6 py-3.5 rounded-full justify-center items-center ${
          loading || !question.trim() ? "bg-blue-900/50 opacity-60" : "bg-blue-600"
        }`}
        style={{
          marginLeft: 8,
          paddingHorizontal: 24,
          paddingVertical: 14,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: loading || !question.trim() ? 'rgba(30, 58, 138, 0.5)' : '#2563EB',
          opacity: loading || !question.trim() ? 0.6 : 1
        }}
      >
        <Text className="text-white font-bold tracking-wide" style={{ color: '#fff', fontWeight: 'bold' }}>
          {loading ? "Wait" : "Send"}
        </Text>
      </TouchableOpacity>
    </BlurView>
  );
}
