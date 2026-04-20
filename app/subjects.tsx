import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "../components/ui/icon-symbol";

export default function SubjectsScreen() {
  const { subjectGroupStr } = useLocalSearchParams();
  const router = useRouter();
  const parsedSubject = subjectGroupStr ? JSON.parse(subjectGroupStr as string) : null;

  if (!parsedSubject) return <View className="flex-1 bg-black items-center justify-center"><Text className="text-white">Subject not found.</Text></View>;

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/topics" as any, params: { subCategoryStr: JSON.stringify(item), subjectName: parsedSubject.name } })}
      activeOpacity={0.8}
      className="bg-[#1c1c1e] p-5 rounded-2xl mb-3 border border-[#2c2c2e] shadow-sm flex-row justify-between items-center"
    >
      <View>
        <Text className="text-white text-lg font-bold tracking-wide">{item.name}</Text>
        <Text className="text-neutral-400 mt-1 font-medium">{item.topics.length} Topics</Text>
      </View>
      <IconSymbol name="chevron.right" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 p-5 pt-3">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-blue-500 font-semibold text-[15px]">← Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold tracking-tight mb-2">{parsedSubject.name}</Text>
        <Text className="text-neutral-400 text-sm mb-6">Select a category to view topics</Text>
        <FlatList data={parsedSubject.subCategories} keyExtractor={(item) => item.id} renderItem={renderItem} showsVerticalScrollIndicator={false} />
      </View>
    </SafeAreaView>
  );
}
