import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, withDelay } from 'react-native-reanimated';

export default function TypingIndicator({ isTyping, text }: { isTyping: boolean; text?: string }) {
  if (!isTyping) return null;

  return (
    <View className="ml-3 mb-2 flex-row gap-2 items-center bg-surface dark:bg-slate-900 self-start px-4 py-3.5 rounded-2xl rounded-bl-[4px] border border-border-subtle dark:border-slate-800 shadow-sm">
      <View className="flex-row gap-1.5 items-center">
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
      {text && <Text className="text-clinical-blue/80 dark:text-clinical-blue text-[13px] font-bold ml-1 tracking-wide">{text}</Text>}
    </View>
  );
}

function Dot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        false
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.4, { duration: 300 })
        ),
        -1,
        false
      )
    );
  }, [delay, translateY, opacity]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.View className="w-2 h-2 rounded-full bg-clinical-blue" style={style} />;
}
