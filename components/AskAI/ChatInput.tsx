import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    <View 
      className="flex-row px-4 pt-3 items-center border-t border-border-subtle dark:border-slate-800 bg-surface dark:bg-slate-900"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Type to ask NurseAI..."
        placeholderTextColor="#94a3b8"
        className="flex-1 bg-warm-bg dark:bg-slate-950 border border-border-subtle dark:border-slate-800 px-5 py-3.5 text-navy dark:text-white rounded-full text-[15px] font-medium"
        editable={!loading}
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={loading || !question.trim()}
        activeOpacity={0.7}
        className={`ml-2 px-6 py-3.5 rounded-full justify-center items-center ${
          loading || !question.trim() ? "bg-clinical-blue/40" : "bg-clinical-blue"
        }`}
      >
        <Text className="text-white font-bold tracking-wide">
          {loading ? "Wait" : "Send"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
