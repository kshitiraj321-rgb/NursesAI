import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { StructuredMessage } from '../../utils/api/askaiV2';
import { CitationCard } from './CitationCard';

interface ChatBubbleV2Props {
  item: StructuredMessage;
  isSameSender: boolean;
  feedbackMap: Record<string, string>;
  handleFeedback: (messageId: string, type: string) => void;
  formatTime: (timestamp: unknown) => string;
}

const ChatBubbleV2 = memo(({ item, isSameSender, feedbackMap, handleFeedback, formatTime }: ChatBubbleV2Props) => {
  const isUser = item.role === "user";

  const onFeedback = (type: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleFeedback(item.id, type);
  };

  const userStyle = {
    backgroundColor: '#0F766E', // Rich Medical Teal
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    borderTopRightRadius: isSameSender ? 8 : 24,
    borderBottomRightRadius: 8,
    overflow: 'hidden' as const,
  };

  const aiStyle = {
    backgroundColor: '#1E293B',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderTopLeftRadius: isSameSender ? 8 : 24,
    borderBottomLeftRadius: 8,
    overflow: 'hidden' as const,
  };

  const isSafetyRefusal = item.completionStatus === 'SAFETY_REFUSAL';
  const isMissingEvidence = item.evidenceState?.missingEvidence;

  if (isSafetyRefusal) {
    aiStyle.backgroundColor = '#450a0a'; // Dark red for safety refusal
  }

  const renderFormattedText = (text: string) => {
    // Strip hallucinated chunk ids like [CHUNK-xxx] entirely for safety, just in case
    let sanitizedText = text.replace(/\[CHUNK-[a-zA-Z0-9-]+\]/g, "");

    return sanitizedText.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <Text key={index} className="text-white text-[18px] font-bold mt-4 mb-2">{line.replace('## ', '')}</Text>;
      } else if (line.startsWith('### ')) {
        return <Text key={index} className="text-blue-300/90 text-[16px] font-semibold mt-3 mb-1">{line.replace('### ', '')}</Text>;
      } else if (line.trim() === '---') {
        return <View key={index} className="h-[1px] bg-white/10 my-3" />;
      } else if (line.startsWith('- ')) {
        return (
          <View key={index} className="flex-row pl-1 mb-1 pr-2">
            <Text className="text-neutral-400 mr-2 mt-0.5">•</Text>
            <Text className="text-neutral-200 text-[15px] leading-[22px] flex-1">
               {line.substring(2)}
            </Text>
          </View>
        );
      } else if (line.trim() === '') {
        return <View key={index} className="h-1.5" />;
      } else {
        const parts = line.split(/(\*\*.*?\*\*|\[CIT-[a-zA-Z0-9-]+\])/g);
        return (
          <Text key={index} className="text-neutral-100 text-[15px] leading-[24px] tracking-tight mb-0.5">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <Text key={i} className="font-bold text-white">{part.slice(2, -2)}</Text>;
              }
              if (part.startsWith('[CIT-') && part.endsWith(']')) {
                const citationId = part.slice(1, -1); // removes brackets
                const hasCitation = item.citations?.find(c => c.citationId === citationId);
                if (hasCitation) {
                  return (
                    <Text key={i} className="text-blue-400 font-semibold text-[12px] align-text-top">
                      [{item.citations.findIndex(c => c.citationId === citationId) + 1}]
                    </Text>
                  );
                }
                // Hallucinated citation, render nothing
                return null; 
              }
              return part;
            })}
          </Text>
        );
      }
    });
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(400).springify()}
      className={`mb-1 max-w-[85%] ${isUser ? 'self-end' : 'self-start'} ${isSameSender ? 'mt-0.5' : 'mt-3'}`}
    >
      {isUser ? (
        <View style={userStyle} className="px-5 py-3.5 border border-teal-400/20 shadow-sm shadow-teal-900/30">
          <Text className="text-white text-[15px] leading-[22px] tracking-tight">{item.content}</Text>
          <Text className="text-[10px] mt-1.5 self-end text-teal-100/60 font-medium tracking-wider">
            {formatTime(item.createdAt)}
          </Text>
        </View>
      ) : (
        <View style={aiStyle} className={`p-4 border shadow-sm shadow-black/20 ${isSafetyRefusal ? 'border-red-500/30' : 'border-white/5'}`}>
          {isMissingEvidence && !isSafetyRefusal && (
            <View className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2 mb-3">
              <Text className="text-yellow-200/90 text-[12px] font-medium">
                ⚠️ This response is generated without specific textbook evidence.
              </Text>
            </View>
          )}

          {isSafetyRefusal && (
            <View className="bg-red-500/10 border border-red-500/20 rounded p-2 mb-3">
              <Text className="text-red-300 text-[12px] font-medium uppercase tracking-wide">
                🚫 Safety Refusal
              </Text>
              <Text className="text-red-200/80 text-[12px] mt-1">
                NurseAI cannot provide unverified clinical data.
              </Text>
            </View>
          )}

          <View>{renderFormattedText(item.content)}</View>

          {item.completionStatus === 'TRUNCATED_TOKENS' && (
            <View className="mt-3 border-t border-white/5 pt-2">
               <Text className="text-neutral-400 text-[12px] italic">
                 Response stopped due to length limits.
               </Text>
            </View>
          )}

          {/* Render Citations at the bottom */}
          {item.citations && item.citations.length > 0 && (
            <View className="mt-4 pt-3 border-t border-white/10">
              <Text className="text-neutral-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                Verified Sources
              </Text>
              {item.citations.map((cit, idx) => (
                <View key={cit.citationId} className="flex-row mb-2">
                  <Text className="text-blue-400 font-bold mr-2">[{idx + 1}]</Text>
                  <View className="flex-1">
                    <CitationCard citation={cit} />
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text className="text-[10px] mt-2 self-end text-neutral-500 font-medium tracking-wider">
            {formatTime(item.createdAt)}
          </Text>

          {/* FEEDBACK */}
          <View className="flex-row mt-2.5 gap-2 pt-2.5 border-t border-white/5">
            <TouchableOpacity
              disabled={!!feedbackMap[item.id]}
              onPress={() => onFeedback("helpful")}
              activeOpacity={0.6}
              className={`${feedbackMap[item.id] ? 'opacity-40' : 'opacity-100'} bg-white/5 p-1.5 rounded-full px-3`}
            >
              <Text className="text-[12px] text-neutral-300 font-medium tracking-wide">
                {feedbackMap[item.id] === "helpful" ? "✅ Helpful" : "👍 Helpful"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!!feedbackMap[item.id]}
              onPress={() => onFeedback("not_helpful")}
              activeOpacity={0.6}
              className={`${feedbackMap[item.id] ? 'opacity-40' : 'opacity-100'} bg-white/5 p-1.5 rounded-full px-3`}
            >
              <Text className="text-[12px] text-neutral-300 font-medium tracking-wide">
                {feedbackMap[item.id] === "not_helpful" ? "❌ Not Helpful" : "👎 Unhelpful"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
});

ChatBubbleV2.displayName = "ChatBubbleV2";

export default ChatBubbleV2;
