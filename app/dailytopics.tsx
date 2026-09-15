
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
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

const logError = (label: string, error: unknown) => { console.log(`❌ [${label}]`, error); };
const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://nursesai.onrender.com";

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

  const fetchTopic = useCallback(async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Auth token missing");

      const res = await axios.post(`${API_URL}/ask`, {
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
  }, [topic]);

  const generateQuiz = async () => {
    setQuizLoading(true);
    setQuizMode(true);
    setQuizError(false);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Auth token missing");

      const res = await axios.post(`${API_URL}/ask`, {
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

        const res = await axios.post(`${API_URL}/ask`, {
          messages: [{ role: "user", content: selectedTopic }],
        }, { headers: { Authorization: `Bearer ${token}` } });

        if (!res.data.answer) {
          setContent("Our AI service is experiencing high demand. Please try reloading the topic!");
          return;
        }

        const formatted = res.data.answer.replace(/\*\*/g, "").replace(/\n{2,}/g, "\n\n").replace(/- /g, "\n- ").trim();
        setContent(formatted);
        setUnlockedStep(2);
      } catch (err) {
        console.log(err);
        setContent("Our AI service is experiencing high demand. Please try reloading the topic!");
      } finally {
        setLoading(false);
      }
    };

    if (passedTopic) {
      loadTopic(passedTopic as string);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTopic();
    }
  }, [passedTopic, fetchTopic]);

  const onQuizComplete = async (score: number) => {
    setFinalScore(score);
    setQuizMode(false);
    setUnlockedStep(3);
    setStep(3);
  };

  return (
    <SafeAreaView className="flex-1 bg-warm-bg dark:bg-slate-900">
      <View className="flex-1 px-5 pt-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-clinical-pine dark:text-teal-400 font-semibold text-[15px] font-sans">← Back</Text>
        </TouchableOpacity>

        <Text className="text-navy dark:text-white text-3xl font-bold tracking-tight mb-1 font-sans">📌 Daily Topic</Text>
        <Text className="text-clinical-pine dark:text-teal-400 text-lg font-semibold mb-3 font-sans">{topic}</Text>

        <View className="flex-row my-3 gap-2">
          {[1, 2, 3].map((s) => (
            <View 
              key={s} 
              className={`flex-1 h-1.5 rounded-full ${step >= s ? "bg-clinical-pine dark:bg-teal-500" : ""}`} 
              style={step < s ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' } : undefined}
            />
          ))}
        </View>

        <Text className="text-slate-500 dark:text-slate-400 text-[13px] font-medium mb-3 font-sans">Step {step} of 3</Text>

        {step === 1 && !quizMode ? (
          <>
            {loading ? (
              <View className="flex-1 mt-6 px-4">
                {[1, 2, 3].map((key) => (
                  <View key={key} className="mb-6 bg-surface dark:bg-slate-800 p-5 rounded-[20px] border border-border-subtle dark:border-slate-700">
                    <View className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-2/3 mb-4" />
                    <View className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-full mb-3" />
                    <View className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-5/6 mb-3" />
                    <View className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-full" />
                  </View>
                ))}
              </View>
            ) : (
              <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                <View className="bg-surface dark:bg-slate-800 p-5 rounded-[20px] border border-border-subtle dark:border-slate-700">
                  <Text className="text-navy dark:text-slate-200 text-[15px] leading-6 tracking-wide font-sans">{content}</Text>
                </View>
              </ScrollView>
            )}

            {content.includes("high demand") ? (
              <TouchableOpacity
                onPress={() => { if (passedTopic) { /* loadTopic is inside useEffect, we will use fetchTopic as a fallback */ fetchTopic(); } else fetchTopic(); }}
                className="mt-4 p-4 bg-rose-50 dark:bg-rose-950/20 rounded-[20px] items-center border border-rose-200 dark:border-rose-900/50"
              >
                <Text className="text-rose-700 dark:text-rose-400 font-bold font-sans">Retry Loading Topic 🔄</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={unlockedStep < 2}
                onPress={() => { if (unlockedStep >= 2) { setStep(2); generateQuiz(); } }}
                className={`p-4 rounded-[20px] mt-4 items-center ${unlockedStep >= 2 ? "bg-clinical-pine dark:bg-teal-600" : "bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 opacity-50"}`}
                style={unlockedStep >= 2 ? { elevation: 5, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 } : undefined}
              >
                <Text className="text-white dark:text-slate-200 font-bold tracking-wide font-sans">Start AI Quiz 🧠 →</Text>
              </TouchableOpacity>
            )}
          </>
        ) : step === 2 ? (
          quizError ? (
            <View className="flex-1 justify-center items-center mt-10">
              <Text className="text-navy dark:text-slate-300 text-center mb-4 font-sans">Our AI service is experiencing high demand. Failed to generate quiz.</Text>
              <TouchableOpacity
                onPress={() => generateQuiz()}
                className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-[20px] border border-rose-200 dark:border-rose-900/50"
              >
                <Text className="text-rose-700 dark:text-rose-400 font-bold font-sans">Retry Generating Quiz 🔄</Text>
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
            <Text className="text-navy dark:text-white text-xl font-bold mb-2 font-sans">
              {finalScore >= 4 ? "🎉 Excellent Work!" : finalScore >= 2 ? "👍 Good job!" : "📚 Keep practicing!"}
            </Text>
            <Text className="text-clinical-pine dark:text-teal-400 text-lg font-semibold font-sans">Score: {finalScore}/{questions.length}</Text>
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
            className={`p-4 rounded-[20px] mt-8 items-center ${unlockedStep >= 3 ? "bg-clinical-pine dark:bg-teal-600" : "bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 opacity-50"}`}
            style={unlockedStep >= 3 ? { elevation: 5, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 } : undefined}
          >
            <Text className="text-white dark:text-slate-200 font-bold tracking-wide font-sans">Mark as Completed ✅</Text>
          </TouchableOpacity>
        )}

        {completed && (
          <Text className="text-emerald-600 dark:text-emerald-400 mt-6 text-center text-lg font-bold font-sans">🎉 Topic Completed! +1 Streak</Text>
        )}

        {Object.keys(unlockedStep < 3 && step === 3 ? { a: 1 } : {}).map(() => (
          <Text key="1" className="text-slate-500 dark:text-slate-400 text-center mt-3 text-sm font-sans">🔒 Complete quiz to unlock</Text>
        ))}
      </View>

      {showConfetti && <ConfettiCannon count={120} origin={{ x: 200, y: 0 }} fadeOut={true} />}
      {showStreak && <StreakPopup streak={streak} gainedXP={gainedXP} scaleAnim={scaleAnim} opacityAnim={opacityAnim} />}
    </SafeAreaView>
  );
}
