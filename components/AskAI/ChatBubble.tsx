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

  return (
    <Animated.View
      entering={FadeInUp.duration(400).springify()}
      className={`mb-1 max-w-[82%] ${isUser ? 'self-end' : 'self-start'} ${isSameSender ? 'mt-0.5' : 'mt-3'}`}
    >
      {isUser ? (
        <View style={userStyle} className="px-5 py-3.5 border border-teal-400/20 shadow-sm shadow-teal-900/30">
          <Text className="text-white text-[15px] leading-[22px] tracking-tight">{item.content}</Text>
          <Text className="text-[10px] mt-1.5 self-end text-teal-100/60 font-medium tracking-wider">
            {formatTime(item.createdAt)}
          </Text>
        </View>
      ) : (
        <View style={aiStyle} className="p-3.5 border border-white/5 shadow-sm shadow-black/20">
          <Text className="text-neutral-100 text-[15px] leading-[24px] tracking-tight">{item.content}</Text>
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
