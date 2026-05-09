import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import quickLearnNotes from "../data/quickLearnNotes.json";

interface Note {
  id: string;
  definition?: string;
  keyFacts?: string[];
  nursingPoints?: string[];
  examTrick?: string;
  revision60s?: string[];
  verified?: boolean;
  source?: string;
  tags?: string[];
  // New curated fields
  keyPoints?: string[];
  clinicalFeatures?: string[];
  diagnosis?: string[];
  management?: string[];
  examTricks?: string[];
  rapidRevision?: string[];
  verifiedLevel?: "legacy" | "ai_generated" | "curated";
}

export default function NotesScreen() {
  const { topic, subject } = useLocalSearchParams();
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const passedSubject = (subject as string) || "";
    const passedTopic = (topic as string) || "";

    const subjectData = quickLearnNotes.subjects.find(
      (s) => s.subject.toLowerCase() === passedSubject.toLowerCase()
    );

    if (subjectData) {
      const topicData = subjectData.topics.find(
        (t) => t.topic.toLowerCase() === passedTopic.toLowerCase()
      );
      if (topicData) {
        setNotes(topicData.notes as Note[]);
      }
    }
  }, [topic, subject]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 p-5 pt-3">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-blue-500 font-semibold text-[15px]">← Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-3xl font-bold tracking-tight mb-2">{topic as string}</Text>
        <Text className="text-neutral-400 mb-6 text-sm">Subject: {(subject as string) || "Nursing"}</Text>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {notes.length === 0 ? (
            <View className="bg-[#1c1c1e] p-5 rounded-2xl border border-[#2c2c2e] items-center">
              <Text className="text-neutral-400 text-[15px] text-center">No notes available for this topic yet.</Text>
            </View>
          ) : (
            notes.map((note, index) => (
              <View key={note.id || index} className="bg-[#1c1c1e] p-5 rounded-2xl border border-[#2c2c2e] mb-5 shadow-lg">
                {note.verifiedLevel === "curated" && (
                  <View className="mb-4 self-start bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/40">
                    <Text className="text-blue-300 text-xs font-bold uppercase tracking-wider">Curated NORCET Notes ✨</Text>
                  </View>
                )}

                {note.definition && (
                  <View className="mb-4">
                    <Text className="text-blue-400 font-bold mb-1 text-sm uppercase tracking-wider">Definition</Text>
                    <Text className="text-white text-[15px] leading-6">{note.definition}</Text>
                  </View>
                )}

                {(note.keyFacts || note.keyPoints) && (note.keyFacts?.length || 0) + (note.keyPoints?.length || 0) > 0 && (
                  <View className="mb-4">
                    <Text className="text-green-400 font-bold mb-2 text-sm uppercase tracking-wider">Key Facts</Text>
                    {(note.keyPoints || note.keyFacts || []).map((fact, i) => (
                      <View key={i} className="flex-row mb-1 pr-4">
                        <Text className="text-green-400 mr-2">•</Text>
                        <Text className="text-neutral-300 text-[14px] leading-5">{fact}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {note.clinicalFeatures && note.clinicalFeatures.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-red-400 font-bold mb-2 text-sm uppercase tracking-wider">Clinical Features</Text>
                    {note.clinicalFeatures.map((feat, i) => (
                      <View key={i} className="flex-row mb-1 pr-4">
                        <Text className="text-red-400 mr-2">•</Text>
                        <Text className="text-neutral-300 text-[14px] leading-5">{feat}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {note.diagnosis && note.diagnosis.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-indigo-400 font-bold mb-2 text-sm uppercase tracking-wider">Diagnosis</Text>
                    {note.diagnosis.map((diag, i) => (
                      <View key={i} className="flex-row mb-1 pr-4">
                        <Text className="text-indigo-400 mr-2">•</Text>
                        <Text className="text-neutral-300 text-[14px] leading-5">{diag}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {note.management && note.management.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-teal-400 font-bold mb-2 text-sm uppercase tracking-wider">Management</Text>
                    {note.management.map((mgmt, i) => (
                      <View key={i} className="flex-row mb-1 pr-4">
                        <Text className="text-teal-400 mr-2">•</Text>
                        <Text className="text-neutral-300 text-[14px] leading-5">{mgmt}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {note.nursingPoints && note.nursingPoints.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-purple-400 font-bold mb-2 text-sm uppercase tracking-wider">Nursing Points</Text>
                    {note.nursingPoints.map((point, i) => (
                      <View key={i} className="flex-row mb-1 pr-4">
                        <Text className="text-purple-400 mr-2">•</Text>
                        <Text className="text-neutral-300 text-[14px] leading-5">{point}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {(note.examTrick || (note.examTricks && note.examTricks.length > 0)) && (
                  <View className="mb-4 bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
                    <Text className="text-orange-400 font-bold mb-1 text-sm uppercase tracking-wider">Exam Trick 💡</Text>
                    {note.examTricks ? (
                      note.examTricks.map((trick, i) => (
                        <View key={i} className="flex-row mb-1 pr-4 mt-1">
                          <Text className="text-orange-400 mr-2">•</Text>
                          <Text className="text-orange-200 text-[14px] leading-5">{trick}</Text>
                        </View>
                      ))
                    ) : (
                      <Text className="text-orange-200 text-[14px] leading-5">{note.examTrick}</Text>
                    )}
                  </View>
                )}

                {(note.revision60s || note.rapidRevision) && (note.revision60s?.length || 0) + (note.rapidRevision?.length || 0) > 0 && (
                  <View className="mt-2">
                    <Text className="text-yellow-400 font-bold mb-2 text-sm uppercase tracking-wider">60s Revision</Text>
                    {(note.rapidRevision || note.revision60s || []).map((rev, i) => (
                      <View key={i} className="flex-row mb-1 pr-4">
                        <Text className="text-yellow-400 mr-2">⚡</Text>
                        <Text className="text-neutral-300 text-[14px] leading-5">{rev}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
