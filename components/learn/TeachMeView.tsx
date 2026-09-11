import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import type { Topic, Concept } from "../../data/types/knowledge";
import { TrustBadge } from "./TrustBadge";

interface TeachMeViewProps {
  topic: Topic;
  concept?: Concept;
}

export function TeachMeView({ topic, concept }: TeachMeViewProps) {
  const [question, setQuestion] = useState("");
  const [responses, setResponses] = useState<
    { id: string; q: string; a: string; timestamp: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleAskTutor = () => {
    if (!question.trim()) return;
    setLoading(true);

    const activeConceptTitle = concept ? concept.title : "General Topic";
    const userQ = question.trim();
    setQuestion("");

    // Simulate contextual AI response with context attachment
    setTimeout(() => {
      const tutorAnswer = `Regarding ${topic.name} (${activeConceptTitle}):\n\nIn nursing practice, focus on early assessment and key clinical cues. ${
        concept
          ? `Specifically for ${concept.title}, remember that ${concept.content}`
          : topic.quickRevision
          ? topic.quickRevision.definition
          : "Maintain baseline monitoring and monitor vital signs."
      }\n\nKey nursing takeaway: Always reassess after intervention and document baseline findings.`;

      setResponses((prev) => [
        {
          id: Date.now().toString(),
          q: userQ,
          a: tutorAnswer,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <ScrollView className="flex-1 space-y-4">
      {/* AI Context Banner */}
      <View className="bg-purple-950/80 border border-purple-700/60 p-4 rounded-xl mb-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-purple-300 font-bold text-xs uppercase">
            🤖 AI Tutor — Interactive Concept Explanation
          </Text>
          <TrustBadge status="AI_GENERATED" size="sm" />
        </View>
        <Text className="text-purple-100 text-xs leading-5">
          Ask specific questions about <Text className="font-bold text-white">{topic.name}</Text>
          {concept ? ` (${concept.title})` : ""}. Explanations are attached to verified clinical context.
        </Text>
      </View>

      {/* Question Input */}
      <View className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-4 space-y-3">
        <Text className="text-slate-200 font-semibold text-xs">
          Ask NurseAI Tutor a Question
        </Text>
        <TextInput
          className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700 text-xs"
          placeholder={`e.g., Explain the pathophysiology of ${topic.name} in simple terms...`}
          placeholderTextColor="#64748b"
          value={question}
          onChangeText={setQuestion}
          multiline
        />

        <TouchableOpacity
          onPress={handleAskTutor}
          disabled={loading}
          className="bg-purple-600 active:bg-purple-700 p-3 rounded-lg items-center"
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text className="text-white font-bold text-xs">Ask AI Tutor</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Tutor Response Thread */}
      {responses.length > 0 && (
        <View className="space-y-3 mb-8">
          <Text className="text-slate-300 font-bold text-xs uppercase mb-1">
            Tutor Thread ({responses.length})
          </Text>
          {responses.map((item) => (
            <View
              key={item.id}
              className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-3"
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-purple-300 font-bold text-xs">
                  Q: {item.q}
                </Text>
                <Text className="text-slate-500 text-[10px]">{item.timestamp}</Text>
              </View>

              <View className="bg-slate-900/90 p-3 rounded-lg border border-purple-900/50">
                <Text className="text-slate-200 text-xs leading-5">
                  {item.a}
                </Text>
              </View>

              <Text className="text-slate-500 text-[10px] italic mt-2">
                ⚠ Ephemeral tutor explanation. Knowledge base records remain unmutated.
              </Text>
            </View>
          ))}
        </View>
      )}

      {responses.length === 0 && (
        <View className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 mb-8">
          <Text className="text-slate-400 text-xs leading-4 text-center">
            No questions asked yet. Type a question above to get instant clinical tutoring for {topic.name}.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
