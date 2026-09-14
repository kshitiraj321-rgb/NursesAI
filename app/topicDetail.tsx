import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";
import { loadAllPyq, isQuizReadyPyq, getQuestionsForTopic } from "../data/pyq/repository";
import type { PyqRecord } from "../data/pyq/types";
import notesIndex from "../data/quickLearnIndex.json";

/**
 * TopicDetail Screen — SLICE 2 Light-First Update
 *
 * Legacy screen reached from the PYQ/quiz flow.
 * Updated to light-first design tokens while preserving all routing/data logic.
 * Navigation: back → Learn with AI (AskAI) → Practice PYQs → Generate AI Quiz → Read Notes
 */
type CategoryPayload = {
  id: string;
  name: string;
  subjectName?: string;
};

export default function TopicDetailScreen() {
  const { topic } = useLocalSearchParams();
  const parsedTopic: CategoryPayload = JSON.parse(String(topic || "{}"));
  const router = useRouter();

  const [pyq, setPyq] = useState<PyqRecord[]>([]);

  const noteCount = useMemo(() => {
    const key = `${parsedTopic.subjectName || ""}|${(parsedTopic.name || "").toLowerCase()}`;
    return (notesIndex as Record<string, number>)[key] || 0;
  }, [parsedTopic.name, parsedTopic.subjectName]);

  useEffect(() => {
    loadAllPyq().then(setPyq).catch((err) => console.log("PYQ load error:", err));
  }, []);

  const pyqCount = useMemo(() => {
    return getQuestionsForTopic(pyq, parsedTopic.name).length;
  }, [pyq, parsedTopic.name]);

  const quizReadyCount = useMemo(() => {
    return getQuestionsForTopic(pyq.filter(isQuizReadyPyq), parsedTopic.name).length;
  }, [pyq, parsedTopic.name]);

  return (
    <SafeAreaView className="flex-1 bg-warm-bg dark:bg-slate-900">
      <View className="flex-1 p-5 pt-3">
        {/* Back */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4 min-h-[44px] justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text className="text-clinical-blue dark:text-sky-400 font-semibold text-[15px]">← Back</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-navy dark:text-white text-2xl font-bold tracking-tight mb-1">
          {parsedTopic.name}
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 mb-1 text-sm">
          {parsedTopic.subjectName || "Nursing"}
        </Text>

        {/* Metadata */}
        <View className="flex-row gap-4 mb-5">
          <View className="flex-row items-center">
            <Text className="text-slate-400 dark:text-slate-500 text-xs">PYQs: </Text>
            <Text className="text-navy dark:text-white text-xs font-semibold">{pyqCount}</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-slate-400 dark:text-slate-500 text-xs">Notes: </Text>
            <Text className="text-navy dark:text-white text-xs font-semibold">{noteCount}</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-slate-400 dark:text-slate-500 text-xs">Quiz-ready: </Text>
            <Text className="text-navy dark:text-white text-xs font-semibold">{quizReadyCount}</Text>
          </View>
        </View>

        {pyqCount === 0 && (
          <View className="bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 rounded-xl p-4 mb-4">
            <Text className="text-slate-500 dark:text-slate-400 text-sm">
              More questions coming soon.
            </Text>
          </View>
        )}

        <Text className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
          How would you like to prepare?
        </Text>

        {/* Learn with AI */}
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
          className="bg-clinical-blue active:bg-clinical-blue-pressed p-4 rounded-xl mb-3 min-h-[52px] items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Learn with AI"
        >
          <Text className="text-white font-bold tracking-wide">Learn with AI</Text>
        </TouchableOpacity>

        {/* Practice PYQs */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/quiz" as never,
              params: { type: "pyq", topic: parsedTopic.name } as never,
            })
          }
          className="bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 p-4 rounded-xl mb-3 min-h-[52px] items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Practice PYQs"
        >
          <Text className="text-navy dark:text-white font-bold tracking-wide">Practice PYQs</Text>
        </TouchableOpacity>

        {/* Generate AI Quiz */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/quiz" as never,
              params: { topic: JSON.stringify(parsedTopic) } as never,
            })
          }
          className="bg-emerald-500 active:bg-emerald-600 p-4 rounded-xl mb-5 min-h-[52px] items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Generate AI Quiz"
        >
          <Text className="text-white font-bold tracking-wide">Generate AI Quiz</Text>
          <Text className="text-emerald-100 text-xs mt-0.5">AI-generated practice questions</Text>
        </TouchableOpacity>

        {/* Read Notes */}
        {noteCount > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/notes" as never,
                params: { topic: parsedTopic.name, subject: parsedTopic.subjectName || "" } as never,
              })
            }
            className="bg-surface dark:bg-slate-800 border border-clinical-blue-border dark:border-sky-800 p-4 rounded-xl mb-5 min-h-[52px] items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel={`Read ${noteCount} notes`}
          >
            <Text className="text-clinical-blue dark:text-sky-400 font-bold tracking-wide">
              Read Notes ({noteCount})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
