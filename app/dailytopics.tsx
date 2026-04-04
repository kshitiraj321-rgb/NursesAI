import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function DailyTopics() {
  const { topic: passedTopic } = useLocalSearchParams();
  const router = useRouter();
  const dailyTopic = "Injection Techniques";

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  // 🧠 QUIZ
  const [quizMode, setQuizMode] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);

  // 🔥 FETCH TOPIC
  const fetchTopic = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://nursesai.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: dailyTopic }),
      });

      const data = await res.json();
      setContent(data.answer);
    } catch {
      setContent("Error loading topic");
    }

    setLoading(false);
  };

  // 🔥 GENERATE QUIZ FROM AI
  const generateQuiz = async () => {
    setQuizLoading(true);
    setQuizMode(true);

    try {
      const res = await fetch("https://nursesai.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Generate 3 MCQ questions about ${dailyTopic} in JSON format like:
          [{question:"", options:["","","",""], answer:""}]`,
        }),
      });

      const data = await res.json();

      // ⚠️ Try parsing AI response
      let parsed = [];
      try {
        parsed = JSON.parse(data.answer);
      } catch {
        parsed = [];
      }

      setQuestions(parsed);
    } catch {
      setQuestions([]);
    }

    setQuizLoading(false);
  };

  // 🔥 CHECK COMPLETION
  const checkCompletion = async () => {
    const saved = await AsyncStorage.getItem("completedTopics");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.includes(dailyTopic)) {
        setCompleted(true);
      }
    }
  };

  // 🔥 STREAK SYSTEM
  const markComplete = async () => {
    const today = new Date().toDateString();

    const lastDate = await AsyncStorage.getItem("lastCompletedDate");
    let streak = parseInt((await AsyncStorage.getItem("streak")) || "0");

    if (lastDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate === yesterday.toDateString()) {
      streak += 1;
    } else {
      streak = 1;
    }

    await AsyncStorage.setItem("streak", streak.toString());
    await AsyncStorage.setItem("lastCompletedDate", today);

    const saved = await AsyncStorage.getItem("completedTopics");
    let topics = saved ? JSON.parse(saved) : [];

    if (!topics.includes(dailyTopic)) {
      topics.push(dailyTopic);
      await AsyncStorage.setItem("completedTopics", JSON.stringify(topics));
    }

    setCompleted(true);
  };

  useEffect(() => {
  if (passedTopic) {
    loadTopic(passedTopic as string);
  } else {
    fetchTopic();
  }
}, []);
const loadTopic = async (selectedTopic: string) => {
  setLoading(true);

  try {
    const res = await fetch("https://nursesai.onrender.com/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: selectedTopic,
      }),
    });

    const data = await res.json();

    const formatted = data.answer
      .replace(/\*\*/g, "")
      .replace(/\n/g, "\n\n");

    setContent(formatted);
  } catch (error) {
    setContent("Error loading topic");
  }

  setLoading(false);
};

  // 🧠 HANDLE ANSWER
  const handleNext = () => {
    if (selected === questions[current].answer) {
      setScore(score + 1);
    }

    setSelected("");

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      alert(`Score: ${score + 1}/${questions.length}`);
      setQuizMode(false);
      setCurrent(0);
      setScore(0);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ padding: 20 }}>

        {/* BACK */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#007AFF", marginBottom: 10 }}>
            ← Back
          </Text>
        </TouchableOpacity>

        <Text style={{ color: "white", fontSize: 24 }}>
          📌 Daily Topic
        </Text>

        <Text style={{ color: "#4FC3F7", marginBottom: 10 }}>
          {dailyTopic}
        </Text>

        {/* NORMAL MODE */}
        {!quizMode ? (
          <>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <ScrollView>
                <Text style={{ color: "white" }}>{content}</Text>
              </ScrollView>
            )}

            <TouchableOpacity
              onPress={generateQuiz}
              style={{
                backgroundColor: "#34C759",
                padding: 12,
                borderRadius: 10,
                marginTop: 15,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Start AI Quiz 🧠
              </Text>
            </TouchableOpacity>

            {!completed && (
              <TouchableOpacity
                onPress={markComplete}
                style={{
                  backgroundColor: "#007AFF",
                  padding: 12,
                  borderRadius: 10,
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Mark as Completed ✅
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          /* QUIZ MODE */
          <>
            {quizLoading ? (
              <ActivityIndicator />
            ) : questions.length === 0 ? (
              <Text style={{ color: "white" }}>
                Failed to load quiz
              </Text>
            ) : (
              <View>
                <Text style={{ color: "white", marginBottom: 10 }}>
                  Q{current + 1}: {questions[current].question}
                </Text>

                {questions[current].options.map((opt: string, i: number) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setSelected(opt)}
                    style={{
                      backgroundColor:
                        selected === opt ? "#007AFF" : "#1c1c1e",
                      padding: 12,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ color: "white" }}>{opt}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  onPress={handleNext}
                  style={{
                    backgroundColor: "#34C759",
                    padding: 12,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setQuizMode(false)}
              style={{ marginTop: 15 }}
            >
              <Text style={{ color: "#007AFF" }}>
                ← Exit Quiz
              </Text>
            </TouchableOpacity>
          </>
        )}

      </View>
    </SafeAreaView>
  );
}