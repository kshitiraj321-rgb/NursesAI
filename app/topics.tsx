import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { IconSymbol } from "../components/ui/icon-symbol";

export default function TopicsScreen() {
  const { subCategoryStr, subjectName } = useLocalSearchParams();
  const router = useRouter();
  const parsedSubCategory = subCategoryStr ? JSON.parse(subCategoryStr as string) : null;

  const [progressMap, setProgressMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) return;

    const progressRef = collection(db, "users", user.uid, "topicProgress");
    const unsubscribe = onSnapshot(progressRef, (snapshot) => {
      const pm: Record<string, string> = {};
      snapshot.forEach((doc) => {
        pm[doc.id] = doc.data().status;
      });
      setProgressMap(pm);
    });

    return () => unsubscribe();
  }, []);

  if (!parsedSubCategory) return <View className="flex-1 bg-black items-center justify-center"><Text className="text-white">Category not found.</Text></View>;

  const getStatusIcon = (status?: string) => {
    if (status === "completed") return <Text className="text-green-500 font-bold text-lg">✔</Text>;
    if (status === "attempted") return <Text className="text-orange-500 font-bold text-2xl leading-5 mt-1">•</Text>;
    return <Text className="text-neutral-500 font-bold text-lg">○</Text>;
  };

  const renderItem = ({ item, index }: any) => {
    const status = progressMap[item.id] || "not_started";
    return (
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/topicDetail" as any, params: { topic: JSON.stringify(item) } })}
        activeOpacity={0.8}
        className="bg-[#1c1c1e] p-5 rounded-2xl mb-3 border border-[#2c2c2e] shadow-sm flex-row justify-between items-center"
      >
        <Text className="text-white text-base font-bold tracking-wide flex-1 mr-4">
          {index + 1}. {item.name}
        </Text>
        <View className="flex-row items-center gap-4">
          {getStatusIcon(status)}
          <IconSymbol name="chevron.right" size={16} color="#4b4b4d" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 p-5 pt-3">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-blue-500 font-semibold text-[15px]">← Back to {subjectName}</Text>
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold tracking-tight mb-2">{parsedSubCategory.name}</Text>
        <Text className="text-neutral-400 text-sm mb-6">Available Topics</Text>

        <FlatList data={parsedSubCategory.topics} keyExtractor={(item) => item.id} renderItem={renderItem} showsVerticalScrollIndicator={false}/>
      </View>
    </SafeAreaView>
  );
}
