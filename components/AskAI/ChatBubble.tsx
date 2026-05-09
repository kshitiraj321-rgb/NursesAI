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

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, index) => {
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
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <Text key={index} className="text-neutral-100 text-[15px] leading-[24px] tracking-tight mb-0.5">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <Text key={i} className="font-bold text-white">{part.slice(2, -2)}</Text>;
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
        <View style={aiStyle} className="p-4 border border-white/5 shadow-sm shadow-black/20">
          <View>{renderFormattedText(item.content)}</View>
          <Text className="text-[10px] mt-1.5 self-end text-neutral-500 font-medium tracking-wider">
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

ChatBubble.displayName = "ChatBubble";

export default ChatBubble;
