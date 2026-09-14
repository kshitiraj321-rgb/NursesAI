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

  const isSafetyRefusal = item.completionStatus === 'SAFETY_REFUSAL';
  const isMissingEvidence = item.evidenceState?.missingEvidence;

  const renderFormattedText = (text: string) => {
    // Strip hallucinated chunk ids like [CHUNK-xxx] entirely for safety, just in case
    let sanitizedText = text.replace(/\[CHUNK-[a-zA-Z0-9-]+\]/g, "");

    return sanitizedText.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <Text key={index} className="text-navy dark:text-white text-[16px] font-bold mt-4 mb-2 tracking-tight">{line.replace('## ', '')}</Text>;
      } else if (line.startsWith('### ')) {
        return <Text key={index} className="text-clinical-blue dark:text-clinical-blue text-[14px] font-bold mt-3 mb-1 uppercase tracking-wider">{line.replace('### ', '')}</Text>;
      } else if (line.trim() === '---') {
        return <View key={index} className="h-[1px] bg-border-subtle dark:bg-slate-800 my-4" />;
      } else if (line.startsWith('- ')) {
        return (
          <View key={index} className="flex-row pl-1 mb-1.5 pr-2">
            <Text className="text-slate-400 dark:text-slate-500 mr-2 mt-0.5 font-bold">•</Text>
            <Text className="text-slate-700 dark:text-slate-300 text-[14px] leading-[22px] flex-1">
               {line.substring(2)}
            </Text>
          </View>
        );
      } else if (line.trim() === '') {
        return <View key={index} className="h-1.5" />;
      } else {
        const parts = line.split(/(\*\*.*?\*\*|\[CIT-[a-zA-Z0-9-]+\])/g);
        return (
          <Text key={index} className="text-slate-600 dark:text-slate-300 text-[14.5px] leading-[24px] mb-0.5">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <Text key={i} className="font-bold text-navy dark:text-white">{part.slice(2, -2)}</Text>;
              }
              if (part.startsWith('[CIT-') && part.endsWith(']')) {
                const citationId = part.slice(1, -1); // removes brackets
                const hasCitation = item.citations?.find(c => c.citationId === citationId);
                if (hasCitation) {
                  return (
                    <Text key={i} className="text-clinical-blue font-bold text-[11px] align-text-top bg-clinical-blue/10 px-1 py-0.5 rounded">
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
      className={`mb-2 w-full ${isUser ? 'items-end' : 'items-start'} ${isSameSender ? 'mt-0.5' : 'mt-3'}`}
    >
      {isUser ? (
        <View 
          className="bg-clinical-blue px-5 py-3.5 shadow-sm max-w-[85%]" 
          style={{ 
            borderTopLeftRadius: 24, 
            borderBottomLeftRadius: 24, 
            borderTopRightRadius: isSameSender ? 8 : 24, 
            borderBottomRightRadius: 8 
          }}
        >
          <Text className="text-white text-[15px] font-medium leading-[22px] tracking-tight">{item.content}</Text>
          <Text className="text-[10px] mt-1.5 self-end text-blue-100/70 font-semibold tracking-wider">
            {formatTime(item.createdAt)}
          </Text>
        </View>
      ) : (
        <View 
          className={`p-5 shadow-sm border w-[95%] bg-surface dark:bg-slate-900 ${
            isSafetyRefusal ? 'border-rose-400/50' : 'border-border-subtle dark:border-slate-800'
          }`}
          style={{
            borderTopRightRadius: 24, 
            borderBottomRightRadius: 24, 
            borderTopLeftRadius: isSameSender ? 8 : 24, 
            borderBottomLeftRadius: 8 
          }}
        >
          {isMissingEvidence && !isSafetyRefusal && (
            <View className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 mb-4">
              <Text className="text-amber-800 dark:text-amber-400 text-[12px] font-bold">
                ⚠ Limited Evidence Available
              </Text>
              <Text className="text-amber-700 dark:text-amber-300 text-[12px] leading-4 mt-1">
                This response was generated without specific textbook evidence from our primary sources.
              </Text>
            </View>
          )}

          {isSafetyRefusal && (
            <View className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl p-3 mb-4">
              <Text className="text-rose-800 dark:text-rose-400 text-[12px] font-bold uppercase tracking-wider">
                🚫 Safety Refusal
              </Text>
              <Text className="text-rose-700 dark:text-rose-300 text-[12px] leading-4 mt-1">
                NurseAI cannot provide unverified clinical data or specific medical advice for a patient scenario.
              </Text>
            </View>
          )}

          <View>{renderFormattedText(item.content)}</View>

          {item.completionStatus === 'TRUNCATED_TOKENS' && (
            <View className="mt-4 border-t border-border-subtle dark:border-slate-800 pt-3">
               <Text className="text-slate-500 text-[12px] italic">
                 Response stopped due to length limits.
               </Text>
            </View>
          )}

          {/* Citations at the bottom */}
          {item.citations && item.citations.length > 0 && (
            <View className="mt-5 pt-4 border-t border-border-subtle dark:border-slate-800">
              <Text className="text-navy dark:text-white text-[12px] font-bold uppercase tracking-wider mb-3">
                Evidence Sources
              </Text>
              {item.citations.map((cit, idx) => (
                <View key={cit.citationId} className="flex-row mb-3">
                  <Text className="text-clinical-blue font-bold text-[13px] mr-2 mt-3 bg-clinical-blue/10 px-2 py-1 rounded">[{idx + 1}]</Text>
                  <View className="flex-1">
                    <CitationCard citation={cit} />
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text className="text-[10px] mt-3 self-end text-slate-400 font-bold tracking-wider uppercase">
            {formatTime(item.createdAt)}
          </Text>

          {/* FEEDBACK */}
          <View className="flex-row mt-4 gap-2 pt-3 border-t border-border-subtle dark:border-slate-800">
            <TouchableOpacity
              disabled={!!feedbackMap[item.id]}
              onPress={() => onFeedback("helpful")}
              activeOpacity={0.6}
              className={`${feedbackMap[item.id] ? 'opacity-40' : 'opacity-100'} bg-warm-bg dark:bg-slate-950 border border-border-subtle dark:border-slate-800 py-1.5 rounded-full px-4`}
            >
              <Text className="text-[12px] text-slate-600 dark:text-slate-300 font-bold tracking-wide">
                {feedbackMap[item.id] === "helpful" ? "✅ Helpful" : "👍 Helpful"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!!feedbackMap[item.id]}
              onPress={() => onFeedback("not_helpful")}
              activeOpacity={0.6}
              className={`${feedbackMap[item.id] ? 'opacity-40' : 'opacity-100'} bg-warm-bg dark:bg-slate-950 border border-border-subtle dark:border-slate-800 py-1.5 rounded-full px-4`}
            >
              <Text className="text-[12px] text-slate-600 dark:text-slate-300 font-bold tracking-wide">
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
