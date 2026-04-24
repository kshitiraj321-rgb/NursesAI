import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TopicDetailScreen() {
  const { topic } = useLocalSearchParams();
  const parsedTopic = JSON.parse(topic as string);
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 p-5 pt-3">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-blue-500 font-semibold text-[15px]">← Back</Text>
        </TouchableOpacity>
        
        <Text className="text-white text-3xl font-bold tracking-tight mb-2">{parsedTopic.name}</Text>

        {parsedTopic.highYield && <Text className="text-yellow-400 mb-2 font-semibold">🔥 High Yield Topic</Text>}
        {parsedTopic.prepType && <Text className="text-neutral-400 mb-6 font-medium text-[15px]">Prep Type: {parsedTopic.prepType}</Text>}

        <Text className="text-neutral-400 mb-6 text-sm">How would you like to prepare for this topic?</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/(tabs)/askai" as any, params: { prompt: `Explain ${parsedTopic.name} for nursing exam. Include definition, causes, symptoms, treatment and key exam points.` } })}
          className="bg-blue-600 p-4 rounded-xl mb-3 items-center shadow-lg shadow-blue-500/20"
        >
          <Text className="text-white font-bold tracking-wide">Learn with AI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/quiz" as any, params: { type: "pyq", topic: parsedTopic.name } })}
          className="bg-purple-600 p-4 rounded-xl mb-3 items-center shadow-lg shadow-purple-500/20"
        >
          <Text className="text-white font-bold tracking-wide">Practice PYQs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/quiz" as any, params: { topic: JSON.stringify(parsedTopic) } })}
          className="bg-green-600 p-4 rounded-xl mb-6 items-center shadow-lg shadow-green-500/20"
        >
          <Text className="text-white font-bold tracking-wide">Practice Quiz</Text>
        </TouchableOpacity>

        {parsedTopic.subtopics && parsedTopic.subtopics.length > 0 && (
          <>
            <Text className="text-white text-xl font-bold mb-3 mt-2 tracking-tight">Key Elements</Text>
            <FlatList
              data={parsedTopic.subtopics}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View className="p-4 border-b border-[#2c2c2e] bg-[#1c1c1e] rounded-xl mb-2">
                  <Text className="text-[#ccc] text-[15px] font-medium">• {item}</Text>
                </View>
              )}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
