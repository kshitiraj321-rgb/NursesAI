import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { norcetSubjectGroups } from "../../data/norcetSubjects";
import { IconSymbol } from "../../components/ui/icon-symbol";

export default function LearnScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#0B0F1A", "#0E1A2B"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="px-5 pt-3 pb-2">
          <Text className="text-white text-3xl font-bold tracking-tight">Learn</Text>
          <Text className="text-neutral-400 mt-1 text-sm">Subject Index & Taxonomy</Text>
        </View>

        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {norcetSubjectGroups.map((group) => (
            <View key={group.title} className="mt-6">
              <View className="flex-row items-center mb-3">
                <Text className="text-white text-lg font-bold">{group.title}</Text>
              </View>

              <View className="gap-3">
                {group.subjects.map((subject) => (
                  <TouchableOpacity
                    key={subject.id}
                    onPress={() => router.push({ pathname: "/subjects" as any, params: { subjectGroupStr: JSON.stringify(subject) } })}
                    activeOpacity={0.8}
                    className={`p-4 rounded-2xl border ${
                      group.type === "high_weightage" ? "bg-[#1E293B]/80 border-blue-500/30" : "bg-[#1c1c1e] border-[#2c2c2e]"
                    }`}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-white text-[16px] font-semibold tracking-wide">{subject.name}</Text>
                        <Text className="text-neutral-400 text-xs mt-1">Weightage: {subject.weightage} • {subject.subCategories.length} Categories</Text>
                      </View>
                      <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
                        <IconSymbol name="chevron.right" size={16} color="#9CA3AF" />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
