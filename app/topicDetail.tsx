import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";
import { loadAllPyq, isQuizReadyPyq, mapRecordToCategory, normalizeSubjectAlias } from "../data/pyq/repository";
import type { PyqRecord } from "../data/pyq/types";

type CategoryPayload = {
  id: string;
  name: string;
  subjectName?: string;
};

import notesIndex from "../data/quickLearnIndex.json";

export default function TopicDetailScreen() {
  const { topic } = useLocalSearchParams();
  const parsedTopic: CategoryPayload = JSON.parse(String(topic || "{}"));
  const router = useRouter();

  const [pyq, setPyq] = useState<PyqRecord[]>([]);
  const [noteCount, setNoteCount] = useState(0);

  useEffect(() => {
    loadAllPyq().then(setPyq).catch((err) => console.log("PYQ load error:", err));

    const key = `${parsedTopic.subjectName || ""}|${(parsedTopic.name || "").toLowerCase()}`;
    setNoteCount((notesIndex as Record<string, number>)[key] || 0);
  }, [parsedTopic.name, parsedTopic.subjectName]);

  const pyqCount = useMemo(() => {
    const subject = normalizeSubjectAlias(parsedTopic.subjectName || "");
    const category = (parsedTopic.name || "").toLowerCase();
    return pyq.filter((r) => normalizeSubjectAlias(r.subject) === subject && mapRecordToCategory(r).toLowerCase() === category).length;
  }, [pyq, parsedTopic.name, parsedTopic.subjectName]);

  const quizReadyCount = useMemo(() => {
    const subject = normalizeSubjectAlias(parsedTopic.subjectName || "");
    const category = (parsedTopic.name || "").toLowerCase();
    return pyq.filter((r) => normalizeSubjectAlias(r.subject) === subject && mapRecordToCategory(r).toLowerCase() === category && isQuizReadyPyq(r)).length;
  }, [pyq, parsedTopic.name, parsedTopic.subjectName]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 p-5 pt-3">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-blue-500 font-semibold text-[15px]">← Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-3xl font-bold tracking-tight mb-2">{parsedTopic.name}</Text>
        <Text className="text-neutral-400 mb-1 text-sm">Subject: {parsedTopic.subjectName || "Nursing"}</Text>
        <Text className="text-neutral-400 mb-1 text-sm">Available PYQs: {pyqCount}</Text>
        <Text className="text-neutral-400 mb-6 text-sm">Available Notes: {noteCount}</Text>

        {pyqCount === 0 && (
          <View className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
            <Text className="text-neutral-300 text-sm">More questions coming soon</Text>
          </View>
        )}

        <Text className="text-neutral-400 mb-6 text-sm">How would you like to prepare for this category?</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/askai" as never,
              params: {
                prompt: `Explain ${parsedTopic.name} in ${parsedTopic.subjectName || "Nursing"} for nursing exam. Include definition, key facts, nursing points and exam tricks.`,
              } as never,
            })
          }
          className="bg-blue-600 p-4 rounded-xl mb-3 items-center shadow-lg shadow-blue-500/20"
        >
          <Text className="text-white font-bold tracking-wide">Learn with AI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/quiz" as never, params: { type: "pyq", topic: parsedTopic.name } as never })}
          className="bg-purple-600 p-4 rounded-xl mb-3 items-center shadow-lg shadow-purple-500/20"
        >
          <Text className="text-white font-bold tracking-wide">Practice PYQs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/quiz" as never, params: { topic: JSON.stringify(parsedTopic) } as never })}
          className="bg-green-600 p-4 rounded-xl mb-6 items-center shadow-lg shadow-green-500/20"
        >
          <Text className="text-white font-bold tracking-wide">Practice Quiz</Text>
        </TouchableOpacity>

        <View className="bg-white/5 border border-white/10 rounded-xl p-4">
          <Text className="text-neutral-400 text-xs">Quiz-ready PYQs in this category: {quizReadyCount}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
