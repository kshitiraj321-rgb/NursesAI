import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface Props {
  greeting: string;
  userName: string;
  onLogout: () => void;
}

export default function HomeHeader({ greeting, userName, onLogout }: Props) {
  const opacity = useSharedValue(0);
  
  useEffect(() => { 
    opacity.value = withTiming(1, { duration: 400 }); 
  }, []);

  return (
    <View>
      <Animated.View style={useAnimatedStyle(() => ({ opacity: opacity.value }))}>
        <View className="self-end bg-white/10 border border-white/15 px-4 py-2 rounded-2xl shadow-md mb-2">
          <TouchableOpacity onPress={onLogout} activeOpacity={0.7}>
            <Text className="text-white text-sm font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Text className="text-neutral-400 text-base font-semibold mb-1">{greeting}</Text>
      
      <View className="self-start bg-blue-400/10 px-3 py-1 rounded-xl mb-6">
        <View className="flex-row items-center gap-2">
          <Text className="text-[30px] font-bold text-blue-500">{userName}</Text>
          <Image
            source={require("../../assets/images/nurse-avatar.png")}
            className="w-[34px] h-[34px] rounded-full border-2 border-blue-400"
          />
        </View>
      </View>

      <Text className="text-neutral-400 text-[13px] font-medium mb-4 leading-5">
        Smart learning for nurses
      </Text>
    </View>
  );
}
