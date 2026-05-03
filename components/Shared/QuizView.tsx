import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  year?: string | number;
  explanation?: string;
  topic?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  loading: boolean;
  onExit: () => void;
  onComplete: (score: number, weakTopics?: Record<string, number>, strongTopics?: Record<string, number>) => void;
  type?: string | string[];
}

export default function QuizView({ questions, loading, onExit, onComplete, type }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [weakTopics, setWeakTopics] = useState<Record<string, number>>({});
  const [strongTopics, setStrongTopics] = useState<Record<string, number>>({});

  if (loading) return <ActivityIndicator size="large" color="#4FC3F7" style={styles.loader} />;
  if (!questions || questions.length === 0) return <Text style={styles.failedText}>Failed to load quiz</Text>;

  const handleConfirmOrNext = () => {
    if (!confirmed) {
      if (!selected) return;
      setConfirmed(true);
      return;
    }

    const isCorrect = selected === questions[current].answer;
    const newScore = isCorrect ? score + 1 : score;
    const currentTopic = questions[current].topic || "General";

    const newWeakTopics = { ...weakTopics };
    const newStrongTopics = { ...strongTopics };

    if (isCorrect) newStrongTopics[currentTopic] = (newStrongTopics[currentTopic] || 0) + 1;
    else newWeakTopics[currentTopic] = (newWeakTopics[currentTopic] || 0) + 1;

    setWeakTopics(newWeakTopics);
    setStrongTopics(newStrongTopics);

    if (isCorrect) {
      setScore(newScore);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    setSelected("");
    setConfirmed(false);

    if (current + 1 < questions.length) setCurrent(current + 1);
    else {
      onComplete(newScore, newWeakTopics, newStrongTopics);
      setCurrent(0);
      setScore(0);
      setWeakTopics({});
      setStrongTopics({});
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentScrollContainer} showsVerticalScrollIndicator={false}>
        {type === "pyq" && questions[current]?.year && <Text style={styles.pyqMeta}>NORCET {questions[current].year} • PYQ</Text>}
        <Text style={styles.questionText}>Q{current + 1}: {questions[current].question}</Text>

        {questions[current].options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = selected === questions[current].answer;
          const isPyq = type === "pyq";
          const isCorrectOption = opt === questions[current].answer;

          let optionStyle = styles.optionButtonDefault;
          if (isPyq && selected) {
            if (isCorrect) optionStyle = isSelected ? styles.optionButtonSelectedCorrect : styles.optionButtonDefault;
            else if (isSelected) optionStyle = styles.optionButtonSelectedWrong;
            else if (isCorrectOption) optionStyle = styles.optionButtonRevealCorrect;
          } else if (isSelected) {
            optionStyle = styles.optionButtonSelected;
          }

          return (
            <TouchableOpacity key={i} disabled={confirmed} activeOpacity={0.8} onPress={() => setSelected(opt)} style={[styles.optionButton, optionStyle]}>
              <Text style={[styles.optionText, isSelected ? styles.optionTextSelected : styles.optionTextDefault]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

        {type === "pyq" && confirmed && (
          <>
            <Text style={styles.explanationText}>
              Result: {selected === questions[current].answer ? "Correct" : "Incorrect"}{selected === questions[current].answer ? "" : ` • Correct: ${questions[current].answer}`}
            </Text>
            <Text style={styles.explanationText}>Explanation: {questions[current]?.explanation || "No explanation available"}</Text>
          </>
        )}
      </ScrollView>

      <TouchableOpacity onPress={handleConfirmOrNext} disabled={!selected && !confirmed} style={[styles.confirmButton, selected || confirmed ? styles.confirmButtonEnabled : styles.confirmButtonDisabled]}>
        <Text style={styles.confirmText}>{confirmed ? "Next Question" : "Confirm Answer"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onExit} style={styles.exitButton}><Text style={styles.exitText}>← Exit Quiz Modes</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 32 },
  failedText: { color: "#ffffff", textAlign: "center", marginTop: 16, fontSize: 16 },
  container: { marginTop: 16, flex: 1 },
  contentScroll: { flex: 1 },
  contentScrollContainer: { paddingBottom: 12 },
  pyqMeta: { color: "#888888", fontSize: 12, marginBottom: 4, textAlign: "center" },
  questionText: { color: "#ffffff", fontSize: 18, fontWeight: "600", marginBottom: 24, lineHeight: 24 },
  optionButton: { padding: 16, borderRadius: 16, marginBottom: 14, borderWidth: 1 },
  optionButtonSelected: { backgroundColor: "#4F46E5", borderColor: "rgba(129, 140, 248, 0.6)" },
  optionButtonSelectedCorrect: { backgroundColor: "#2563EB", borderColor: "rgba(96, 165, 250, 0.8)" },
  optionButtonSelectedWrong: { backgroundColor: "#DC2626", borderColor: "rgba(252, 165, 165, 0.8)" },
  optionButtonRevealCorrect: { backgroundColor: "#16A34A", borderColor: "rgba(134, 239, 172, 0.8)" },
  optionButtonDefault: { backgroundColor: "rgba(255,255,255,0.10)", borderColor: "rgba(255,255,255,0.15)" },
  optionText: { fontSize: 15, fontWeight: "500", lineHeight: 22 },
  optionTextSelected: { color: "#ffffff" },
  optionTextDefault: { color: "#e5e7eb" },
  explanationText: { color: "#aaaaaa", marginTop: 18, fontSize: 13, lineHeight: 18, textAlign: "left" },
  confirmButton: { paddingHorizontal: 16, paddingVertical: 16, borderRadius: 999, marginTop: 16 },
  confirmButtonEnabled: { backgroundColor: "#10B981" },
  confirmButtonDisabled: { backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)", opacity: 0.6 },
  confirmText: { color: "#ffffff", textAlign: "center", fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", fontSize: 14 },
  exitButton: { marginTop: 20, paddingVertical: 8, alignItems: "center" },
  exitText: { color: "#3B82F6", fontWeight: "600" },
});
