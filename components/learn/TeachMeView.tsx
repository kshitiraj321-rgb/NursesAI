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

/**
 * TeachMeView — SLICE 2 Light-First Update
 *
 * Interactive AI tutor context view for a topic/concept.
 * Light-first: white/warm surfaces. No purple AI aesthetic.
 * The "teach me" header uses clinical-blue (action color).
 * AI disclaimer uses neutral slate.
 * All simulated tutor response logic unchanged.
 */
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
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

      {/* ── Context Banner ─────────────────────────────────────────── */}
      <View className="bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 p-4 rounded-xl mb-3">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-clinical-blue dark:text-sky-400 font-bold text-xs uppercase tracking-wide flex-1 mr-2">
            AI Tutor — Contextual Explanation
          </Text>
          <TrustBadge status="AI_GENERATED" size="sm" />
        </View>
        <Text className="text-slate-500 dark:text-slate-400 text-xs leading-5">
          Ask questions about{" "}
          <Text className="font-semibold text-navy dark:text-white">{topic.name}</Text>
          {concept ? ` › ${concept.title}` : ""}. Explanations are attached to verified clinical context.
        </Text>
      </View>

      {/* ── Question Input ─────────────────────────────────────────── */}
      <View className="bg-surface dark:bg-slate-800 p-4 rounded-xl border border-border-subtle dark:border-slate-700 mb-4">
        <Text className="text-navy dark:text-slate-200 font-semibold text-xs mb-2">
          Ask NurseAI Tutor a Question
        </Text>
        <TextInput
          className="bg-warm-bg dark:bg-slate-900 text-navy dark:text-white p-3 rounded-lg border border-border-subtle dark:border-slate-700 text-xs mb-3"
          placeholder={`e.g., Explain the pathophysiology of ${topic.name}…`}
          placeholderTextColor="#94A3B8"
          value={question}
          onChangeText={setQuestion}
          multiline
          accessibilityLabel="Ask the AI tutor a question"
        />

        <TouchableOpacity
          onPress={handleAskTutor}
          disabled={loading || !question.trim()}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Submit question to AI tutor"
          className={`p-3 rounded-lg items-center justify-center min-h-[44px] ${
            loading || !question.trim()
              ? "bg-slate-200 dark:bg-slate-700"
              : "bg-clinical-blue active:bg-clinical-blue-pressed"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#2563EB" size="small" />
          ) : (
            <Text className={`font-bold text-xs ${
              !question.trim() ? "text-slate-400 dark:text-slate-500" : "text-white"
            }`}>
              Ask AI Tutor
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Tutor Thread ──────────────────────────────────────────── */}
      {responses.length > 0 && (
        <View className="mb-4">
          <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 px-1">
            Tutor Thread ({responses.length})
          </Text>
          {responses.map((item) => (
            <View
              key={item.id}
              className="bg-surface dark:bg-slate-800 p-4 rounded-xl border border-border-subtle dark:border-slate-700 mb-3"
            >
              <View className="flex-row items-start justify-between mb-2">
                <Text className="text-navy dark:text-slate-200 font-bold text-xs flex-1 mr-2" numberOfLines={2}>
                  Q: {item.q}
                </Text>
                <Text className="text-muted dark:text-slate-500 text-[10px]">
                  {item.timestamp}
                </Text>
              </View>

              <View className="bg-warm-bg dark:bg-slate-900 p-3 rounded-lg border border-border-subtle dark:border-slate-700 mb-2">
                <Text className="text-slate-600 dark:text-slate-300 text-xs leading-5">
                  {item.a}
                </Text>
              </View>

              <Text className="text-muted dark:text-slate-500 text-[10px] italic">
                Ephemeral tutor explanation. Knowledge base records remain unmutated.
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Empty thread state */}
      {responses.length === 0 && (
        <View className="bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 p-4 rounded-xl mb-8">
          <Text className="text-slate-400 dark:text-slate-500 text-xs leading-5 text-center">
            No questions yet. Ask something about {topic.name} to get clinical tutoring.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
