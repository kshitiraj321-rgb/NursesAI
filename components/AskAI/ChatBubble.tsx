import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: unknown;
}

interface ChatBubbleProps {
  item: Message;
  isSameSender: boolean;
  feedbackMap: Record<string, string>;
  handleFeedback: (messageId: string, type: string) => void;
  formatTime: (timestamp: unknown) => string;
}

const ChatBubble = memo(({ item, isSameSender, feedbackMap, handleFeedback, formatTime }: ChatBubbleProps) => {
  const isUser = item.role === "user";

  const onFeedback = (type: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleFeedback(item.id, type);
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <Text key={index} className="text-navy dark:text-white text-[16px] font-bold mt-4 mb-2 tracking-tight font-sans">{line.replace('## ', '')}</Text>;
      } else if (line.startsWith('### ')) {
        return <Text key={index} className="text-clinical-teal dark:text-teal-400 text-[14px] font-bold mt-3 mb-1 uppercase tracking-wider font-sans">{line.replace('### ', '')}</Text>;
      } else if (line.trim() === '---') {
        return <View key={index} className="h-[1px] bg-border-subtle dark:bg-slate-800 my-4" />;
      } else if (line.startsWith('- ')) {
        return (
          <View key={index} className="flex-row pl-1 mb-1.5 pr-2">
            <Text className="text-slate-400 dark:text-slate-500 mr-2 mt-0.5 font-bold font-sans">•</Text>
            <Text className="text-slate-700 dark:text-slate-300 text-[14px] leading-[22px] flex-1 font-sans">
               {line.substring(2)}
            </Text>
          </View>
        );
      } else if (line.trim() === '') {
        return <View key={index} className="h-1.5" />;
      } else {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <Text key={index} className="text-slate-600 dark:text-slate-300 text-[14.5px] leading-[24px] mb-0.5 font-sans">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <Text key={i} className="font-bold text-navy dark:text-white font-sans">{part.slice(2, -2)}</Text>;
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
          className="bg-clinical-pine px-5 py-3.5 shadow-sm max-w-[85%]" 
          style={{ 
            borderTopLeftRadius: 24, 
            borderBottomLeftRadius: 24, 
            borderTopRightRadius: isSameSender ? 8 : 24, 
            borderBottomRightRadius: 8 
          }}
        >
          <Text className="text-white text-[15px] font-medium leading-[22px] tracking-tight font-sans">{item.content}</Text>
          <Text className="text-[10px] mt-1.5 self-end text-teal-100/70 font-semibold tracking-wider font-sans">
            {formatTime(item.createdAt)}
          </Text>
        </View>
      ) : (
        <View 
          className="bg-surface dark:bg-slate-900 p-5 shadow-sm border border-border-subtle dark:border-slate-800 w-[95%]"
          style={{ 
            borderTopRightRadius: 24, 
            borderBottomRightRadius: 24, 
            borderTopLeftRadius: isSameSender ? 8 : 24, 
            borderBottomLeftRadius: 8 
          }}
        >
          <View>{renderFormattedText(item.content)}</View>
          <Text className="text-[10px] mt-2 self-end text-slate-400 font-bold tracking-wider uppercase font-sans">
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
              <Text className="text-[12px] text-slate-600 dark:text-slate-300 font-bold tracking-wide font-sans">
                {feedbackMap[item.id] === "helpful" ? "✅ Helpful" : "👍 Helpful"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!!feedbackMap[item.id]}
              onPress={() => onFeedback("not_helpful")}
              activeOpacity={0.6}
              className={`${feedbackMap[item.id] ? 'opacity-40' : 'opacity-100'} bg-warm-bg dark:bg-slate-950 border border-border-subtle dark:border-slate-800 py-1.5 rounded-full px-4`}
            >
              <Text className="text-[12px] text-slate-600 dark:text-slate-300 font-bold tracking-wide font-sans">
                {feedbackMap[item.id] === "not_helpful" ? "❌ Not Helpful" : "👎 Unhelpful"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
});

ChatBubble.displayName = "ChatBubble";

export default ChatBubble;
