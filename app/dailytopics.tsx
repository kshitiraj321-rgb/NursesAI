
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebase";

import StreakPopup from "../components/DailyTopics/StreakPopup";
import QuizView from "../components/Shared/QuizView";

const logDebug = (label: string, data?: unknown) => { console.log(`🧠 [${label}]`, data || ""); };
const logError = (label: string, error: unknown) => { console.log(`❌ [${label}]`, error); };

export default function DailyTopics() {
  const { topic: passedTopic } = useLocalSearchParams();
  const router = useRouter();
  const topic = (passedTopic as string) || "Injection Techniques";

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  
  const scaleAnim = useState(new Animated.Value(0))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];
  
  const [gainedXP, setGainedXP] = useState(0);

  // 🧠 QUIZ STATE
  const [quizMode, setQuizMode] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [unlockedStep, setUnlockedStep] = useState(1);

  const fetchTopic = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Auth token missing");

      const res = await axios.post("https://nursesai.onrender.com/ask", {
        messages: [{ role: "user", content: topic }],
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (!res.data.answer) throw new Error("No response");
      setContent(res.data.answer);
      setUnlockedStep(2);
    } catch (error) {
      console.log("FETCH ERROR:", error);
      setContent("Our AI service is experiencing high demand. Please try reloading the topic!");
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    setQuizLoading(true);
    setQuizMode(true);
    setQuizError(false);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Auth token missing");

      const res = await axios.post("https://nursesai.onrender.com/ask", {
        messages: [{
          role: "user",
          content: `Generate exactly 5 MCQ questions. Return ONLY valid JSON array. No text.\n[\n  {\n    "question": "",\n    "options": ["", "", "", ""],\n    "answer": ""\n  }\n]\nTopic: ${topic}`,
        }],
      }, { headers: { Authorization: `Bearer ${token}` } });

      let cleaned = res.data.answer.trim();
      if (!cleaned.endsWith("]")) cleaned = cleaned.substring(0, cleaned.lastIndexOf("}") + 1) + "]";
      setQuestions(JSON.parse(cleaned));
    } catch (error) {
      console.log("Quiz generation error:", error);
      setQuestions([]);
      setQuizError(true);
    } finally {
      setQuizLoading(false);
    }
  };

  const markComplete = async (score: number | null) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const metaRef = doc(db, "users", user.uid, "meta", "retention");
        const metaSnap = await getDoc(metaRef);
        const todayString = new Date().toISOString().split("T")[0];

        let metaData = metaSnap.exists() ? metaSnap.data() : { dailyGoal: 10, todayProgress: 0, lastActiveDate: todayString, streak: 0, completedToday: {} as Record<string, boolean> };
        const lastActive = String(metaData.lastActiveDate || todayString);
        
        if (lastActive !== todayString) {
          const diffDays = Math.floor((new Date(todayString).getTime() - new Date(lastActive).getTime()) / (1000 * 3600 * 24));
          if (diffDays > 1) metaData.streak = 0;
          metaData.todayProgress = 0;
          metaData.completedToday = {};
          metaData.lastActiveDate = todayString;
        }

        const safeTopicId = topic.replace(/\//g, "-");
        if (!metaData.completedToday[safeTopicId]) {
          const previousProgress = metaData.todayProgress;
          metaData.todayProgress += questions.length || 5;
          metaData.completedToday[safeTopicId] = true;
          if (previousProgress < metaData.dailyGoal && metaData.todayProgress >= metaData.dailyGoal) {
            metaData.streak += 1;
            setStreak(metaData.streak);
            setShowStreak(true);
          }
        }
        await setDoc(metaRef, metaData, { merge: true });
      }

      let earnedXP = (score && score >= 4) ? 15 : (score && score >= 2) ? 10 : 5;
      setGainedXP(earnedXP);

      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();  

      setTimeout(() => {
        setShowStreak(false);
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);
      }, 3000);

      setCompleted(true);
    } catch (error) {
      logError("markComplete error", error);
    }
  };

  useEffect(() => {


    const loadTopic = async (selectedTopic: string) => {
      setLoading(true);
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Auth token missing");

        const res = await axios.post("https://nursesai.onrender.com/ask", {
          messages: [{ role: "user", content: selectedTopic }],
        }, { headers: { Authorization: `Bearer ${token}` } });

        if (!res.data.answer) {
          setContent("Our AI service is experiencing high demand. Please try reloading the topic!");
          return;
        }

        const formatted = res.data.answer.replace(/\*\*/g, "").replace(/\n{2,}/g, "\n\n").replace(/- /g, "\n- ").trim();
        setContent(formatted);
        setUnlockedStep(2);
      } catch (error) {
        setContent("Our AI service is experiencing high demand. Please try reloading the topic!");
      } finally {
        setLoading(false);
      }
    };

    if (passedTopic) loadTopic(passedTopic as string); else fetchTopic();
  }, [passedTopic]);

  const onQuizComplete = async (score: number) => {
    setFinalScore(score);
    setQuizMode(false);
    setUnlockedStep(3);
    setStep(3);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 px-5 pt-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-blue-500 font-semibold text-[15px]">← Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-3xl font-bold tracking-tight mb-1">📌 Daily Topic</Text>
        <Text className="text-blue-400 text-lg font-semibold mb-3">{topic}</Text>

        <View className="flex-row my-3 gap-2">
          {[1, 2, 3].map((s) => (
            <View 
              key={s} 
              className={`flex-1 h-1.5 rounded-full ${step >= s ? "bg-blue-500" : ""}`} 
              style={step < s ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' } : undefined}
            />
          ))}
        </View>

        <Text className="text-neutral-400 text-[13px] font-medium mb-3">Step {step} of 3</Text>

        {step === 1 && !quizMode ? (
          <>
            {loading ? (
              <View className="flex-1 mt-6 px-4">
                {[1, 2, 3].map((key) => (
                  <View key={key} className="mb-6 bg-[#1c1c1e] p-5 rounded-2xl border border-[#2c2c2e]">
                    <View className="h-5 bg-white/10 rounded-full w-2/3 mb-4" />
                    <View className="h-4 bg-white/5 rounded-full w-full mb-3" />
                    <View className="h-4 bg-white/5 rounded-full w-5/6 mb-3" />
                    <View className="h-4 bg-white/5 rounded-full w-full" />
                  </View>
                ))}
              </View>
            ) : (
              <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                <View className="bg-[#1c1c1e] p-5 rounded-2xl border border-[#2c2c2e]">
                  <Text className="text-white text-[15px] leading-6 tracking-wide">{content}</Text>
                </View>
              </ScrollView>
            )}

            {content.includes("high demand") ? (
              <TouchableOpacity
                onPress={() => { if (passedTopic) { /* loadTopic is inside useEffect, we will use fetchTopic as a fallback */ fetchTopic(); } else fetchTopic(); }}
                className="mt-4 p-4 bg-red-500/20 rounded-xl items-center border border-red-500/50"
              >
                <Text className="text-red-400 font-bold">Retry Loading Topic 🔄</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={unlockedStep < 2}
                onPress={() => { if (unlockedStep >= 2) { setStep(2); generateQuiz(); } }}
                className={`p-4 rounded-xl mt-4 items-center ${unlockedStep >= 2 ? "bg-blue-600" : "bg-[#2c2c2e] opacity-50"}`}
                style={unlockedStep >= 2 ? { elevation: 5, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 } : undefined}
              >
                <Text className="text-white font-bold tracking-wide">Start AI Quiz 🧠 →</Text>
              </TouchableOpacity>
            )}
          </>
        ) : step === 2 ? (
          quizError ? (
            <View className="flex-1 justify-center items-center mt-10">
              <Text className="text-white text-center mb-4">Our AI service is experiencing high demand. Failed to generate quiz.</Text>
              <TouchableOpacity
                onPress={() => generateQuiz()}
                className="p-4 bg-red-500/20 rounded-xl border border-red-500/50"
              >
                <Text className="text-red-400 font-bold">Retry Generating Quiz 🔄</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <QuizView 
              questions={questions} 
            loading={quizLoading} 
            onExit={() => { setQuizMode(false); setStep(1); }}
              onComplete={onQuizComplete}
            />
          )
        ) : null}

        {step === 3 && finalScore !== null && (
          <View className="items-center mt-10">
            <Text className="text-white text-xl font-bold mb-2">
              {finalScore >= 4 ? "🎉 Excellent Work!" : finalScore >= 2 ? "👍 Good job!" : "📚 Keep practicing!"}
            </Text>
            <Text className="text-blue-400 text-lg font-semibold">Score: {finalScore}/{questions.length}</Text>
          </View>
        )}

        {step === 3 && !completed && (
          <TouchableOpacity
            disabled={unlockedStep < 3}
            onPress={async () => {
              if (unlockedStep >= 3) {
                await markComplete(finalScore);
                setCompleted(true);
                setShowConfetti(true); setTimeout(() => setShowConfetti(false), 4000);
              }
            }}
            className={`p-4 rounded-xl mt-8 items-center ${unlockedStep >= 3 ? "bg-blue-600" : "bg-[#2c2c2e] opacity-50"}`}
            style={unlockedStep >= 3 ? { elevation: 5, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 } : undefined}
          >
            <Text className="text-white font-bold tracking-wide">Mark as Completed ✅</Text>
          </TouchableOpacity>
        )}

        {completed && (
          <Text className="text-green-500 mt-6 text-center text-lg font-bold">🎉 Topic Completed! +1 Streak</Text>
        )}

        {Object.keys(unlockedStep < 3 && step === 3 ? { a: 1 } : {}).map(() => (
          <Text key="1" className="text-neutral-500 text-center mt-3 text-sm">🔒 Complete quiz to unlock</Text>
        ))}
      </View>

      {showConfetti && <ConfettiCannon count={120} origin={{ x: 200, y: 0 }} fadeOut={true} />}
      {showStreak && <StreakPopup streak={streak} gainedXP={gainedXP} scaleAnim={scaleAnim} opacityAnim={opacityAnim} />}
    </SafeAreaView>
  );
}
