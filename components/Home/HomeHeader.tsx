import React from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { GlassCard } from "../ui/GlassCard";
import { Pill } from "../ui/Pill";


interface Props {
  greeting: string;
  userName: string;
  onLogout: () => void;
}

export default function HomeHeader({ greeting, userName, onLogout }: Props) {
  return (
    <GlassCard variant="default" className="mb-6 p-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center space-x-2">
          <Image
            source={require("../../assets/images/nurse-avatar.png")}
            className="w-10 h-10 rounded-full border-2 border-sky-400"
          />
          <View>
            <Text className="text-slate-400 text-xs font-medium">{greeting}</Text>
            <Text className="text-white text-xl font-bold tracking-tight">{userName}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onLogout}
          activeOpacity={0.7}
          className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 flex-row items-center space-x-1"
        >
          <Text className="text-slate-300 text-xs font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between pt-1 border-t border-slate-800">
        <Text className="text-slate-400 text-xs font-medium">Smart learning workstation for nurses</Text>
        <Pill label="Active Nurse" variant="trust" size="sm" />
      </View>
    </GlassCard>
  );
}

