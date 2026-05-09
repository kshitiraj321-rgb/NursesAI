import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { collection, doc, increment, serverTimestamp, setDoc, getDoc, writeBatch, query, where, getDocs, limit } from "firebase/firestore";
import { generateMistakeId } from "../utils/hash";
import { useEffect, useState, useRef, useMemo } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";

import QuizView, { QuizQuestion } from "../components/Shared/QuizView";
import { db } from "../firebase";
import { useIntelligenceContext } from "../context/IntelligenceContext";
import { getManifest, isQuizReadyPyq, loadAllPyq, getQuestionsForTopic } from "../data/pyq/repository";
import type { PyqRecord } from "../data/pyq/types";

type TopicParam = { id?: string; name: string };
const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://nursesai.onrender.com";

const toQuizQuestion = (q: PyqRecord): QuizQuestion => ({
  question: q.question,
  options: q.options,
  answer: q.answer,
  explanation: q.explanation,
  year: q.year ?? undefined,
  topic: q.topic,
});

const shuffleArray = <T,>(array: T[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function QuizScreen() {
  const { topic, type, mode } = useLocalSearchParams();
  const topicParam = typeof topic === "string" ? topic : Array.isArray(topic) ? topic[0] || "" : "";
  const typeParam = typeof type === "string" ? type : Array.isArray(type) ? type[0] || "" : "";
  const modeParam = typeof mode === "string" ? mode : Array.isArray(mode) ? mode[0] || "" : "";

  let parsedTopic: TopicParam = { name: topicParam, id: topicParam };
  if (typeParam !== "pyq" && topicParam) {
    try { parsedTopic = JSON.parse(topicParam) as TopicParam; } catch {}
  }

  const safeTopicId = String(parsedTopic.id || parsedTopic.name).replace(/\//g, "-");
  const router = useRouter();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(typeParam === "pyq");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hasStarted, setHasStarted] = useState(typeParam === "pyq");
  const [quizError, setQuizError] = useState(false);
  const [pyqRecords, setPyqRecords] = useState<PyqRecord[]>([]);
  const [pyqTotal, setPyqTotal] = useState(0);
  const [pyqLoaded, setPyqLoaded] = useState(false);

  const { data: intelligenceData } = useIntelligenceContext();
  const weakestTopic = intelligenceData.weakestTopic;

  useEffect(() => {
    const loadPyq = async () => {
      if (typeParam !== "pyq") return;
      try {
        const [manifest, data] = await Promise.all([getManifest(), loadAllPyq()]);
        setPyqTotal(manifest.total);
        setPyqRecords(data);
      } catch (err) {
        console.log("PYQ load error:", err);
      } finally {
        setPyqLoaded(true);
      }
    };
    loadPyq();
  }, [typeParam]);

  const pyqProcessed = useRef(false);
  useEffect(() => {
    if (typeParam === "pyq" && pyqLoaded && !pyqProcessed.current) {
      pyqProcessed.current = true;
      handleStartQuiz();
    }
  }, [pyqLoaded]);

  const fallbackTopic = useMemo(() => parsedTopic.name || topicParam, [parsedTopic.name, topicParam]);

  const topicPyqCount = useMemo(() => {
    if (typeParam !== "pyq" || pyqRecords.length === 0) return 0;
    const source = pyqRecords.filter(isQuizReadyPyq);
    const tokenRaw = modeParam === "revision" && weakestTopic ? weakestTopic : topicParam;
    return getQuestionsForTopic(source, tokenRaw).length;
  }, [typeParam, pyqRecords, modeParam, weakestTopic, topicParam]);

  const handleStartQuiz = async () => {
    setHasStarted(true);
    setQuizError(false);

    const startMs = Date.now();
    let spinnerShown = false;
    const spinnerTimeout = setTimeout(() => {
      spinnerShown = true;
      setLoading(true);
    }, 200);

    const finishLoading = () => {
      clearTimeout(spinnerTimeout);
      if (spinnerShown) {
        const elapsed = Date.now() - startMs - 200;
        setTimeout(() => setLoading(false), Math.max(0, 250 - elapsed));
      } else {
        setLoading(false);
      }
    };

    try {
      const user = getAuth().currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid, "topicProgress", safeTopicId), { status: "attempted", updatedAt: serverTimestamp() }, { merge: true });
      }
    } catch (err) {
      console.log("Progress error:", err);
    }

    if (typeParam === "mistake") {
      try {
        const user = getAuth().currentUser;
        if (!user) throw new Error("Auth missing");
        
        const q = query(collection(db, "users", user.uid, "mistakeBank"), where("mastered", "==", false), limit(15));
        const snap = await getDocs(q);
        const mistakeQs: QuizQuestion[] = [];
        snap.forEach(doc => {
          mistakeQs.push(doc.data() as QuizQuestion);
        });
        setQuestions(mistakeQs);
      } catch (err) {
        console.log("Mistake fetch error:", err);
        setQuestions([]);
        setQuizError(true);
      } finally {
        finishLoading();
      }
      return;
    }

    if (typeParam === "pyq") {
      const source = pyqRecords.filter(isQuizReadyPyq);
      const tokenRaw = modeParam === "revision" && weakestTopic ? weakestTopic : topicParam;
      const pool = getQuestionsForTopic(source, tokenRaw);

      if (pool.length === 0) {
        setQuestions([]);
        finishLoading();
        return;
      }

      setQuestions(shuffleArray(pool).slice(0, 10).map(toQuizQuestion));
      finishLoading();
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      if (!token) throw new Error("Auth token missing");

      const prompt = `Generate 5 MCQ questions for ${parsedTopic.name} for nursing exam. Return ONLY JSON array.\n[\n  {\n    "question": "",\n    "options": ["", "", "", ""],\n    "answer": ""\n  }\n]\nTopic: ${parsedTopic.name}`;
      const response = await axios.post(`${API_URL}/ask`, { messages: [{ role: "user", content: prompt }] }, { headers: { Authorization: `Bearer ${token}` } });
      let cleaned = String(response.data.answer || "").trim();
      if (!cleaned.endsWith("]")) cleaned = cleaned.substring(0, cleaned.lastIndexOf("}") + 1) + "]";
      setQuestions(JSON.parse(cleaned) as QuizQuestion[]);
    } catch (err) {
      console.log("Quiz error:", err);
      setQuestions([]);
      setQuizError(true);
    } finally {
      finishLoading();
    }
  };

  const saveResult = async (finalScore: number, weakTopics: Record<string, number> = {}, strongTopics: Record<string, number> = {}, mistakes: QuizQuestion[] = [], clearedMistakes: QuizQuestion[] = []) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const batch = writeBatch(db);
      
      const resultRef = doc(collection(db, "users", user.uid, "quizResults"));
      batch.set(resultRef, {
        topic: fallbackTopic,
        score: finalScore,
        total: questions.length,
        correctAnswers: finalScore,
        totalQuestions: questions.length,
        weakTopics,
        strongTopics,
        createdAt: serverTimestamp(),
        lastAttemptAt: serverTimestamp(),
      });

      const progressRef = doc(db, "users", user.uid, "topicProgress", safeTopicId);
      batch.set(progressRef, {
        status: "completed",
        lastScore: finalScore,
        attempts: increment(1),
        updatedAt: serverTimestamp()
      }, { merge: true });

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

      if (!metaData.completedToday[safeTopicId]) {
        const previousProgress = metaData.todayProgress;
        metaData.todayProgress += questions.length;
        metaData.completedToday[safeTopicId] = true;
        if (previousProgress < metaData.dailyGoal && metaData.todayProgress >= metaData.dailyGoal) metaData.streak += 1;
      }

      batch.set(metaRef, metaData, { merge: true });

      if (mistakes && mistakes.length > 0) {
        mistakes.forEach((m) => {
          const mId = generateMistakeId(m.topic || fallbackTopic, m.question);
          const mRef = doc(db, "users", user.uid, "mistakeBank", mId);
          const mData = { ...m };
          if (mData.year === undefined) delete mData.year;
          if (mData.explanation === undefined) delete mData.explanation;

          batch.set(mRef, {
            ...mData,
            sourceType: typeParam,
            subject: parsedTopic.name || "General",
            topic: m.topic || fallbackTopic,
            mastered: false,
            mistakeCount: increment(1),
            lastFailedAt: serverTimestamp(),
            createdAt: serverTimestamp() // merge:true will not overwrite existing createdAt
          }, { merge: true });
        });
      }

      if (clearedMistakes && clearedMistakes.length > 0 && typeParam === "mistake") {
        clearedMistakes.forEach((m) => {
          const mId = generateMistakeId(m.topic || fallbackTopic, m.question);
          const mRef = doc(db, "users", user.uid, "mistakeBank", mId);
          batch.set(mRef, {
            mastered: true,
            lastCorrectedAt: serverTimestamp()
          }, { merge: true });
        });
      }

      await batch.commit();
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  const onQuizComplete = (finalScore: number, weakTopics?: Record<string, number>, strongTopics?: Record<string, number>, mistakes?: QuizQuestion[], clearedMistakes?: QuizQuestion[]) => {
    setScore(finalScore);
    setShowResult(true);
    saveResult(finalScore, weakTopics || {}, strongTopics || {}, mistakes || [], clearedMistakes || []);
  };

  return (
    <LinearGradient colors={["#1E1B4B", "#0F172A"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 p-5 pt-3">
          <TouchableOpacity onPress={() => router.back()} className="mb-4"><Text className="text-blue-500 font-semibold text-[15px]">← Back</Text></TouchableOpacity>
          <Text className="text-white text-3xl font-bold tracking-tight mb-2 mt-4">Quiz</Text>
          <Text className="text-blue-400 text-xl font-bold tracking-wide mb-6">{parsedTopic.name}</Text>

          {!hasStarted ? (
            <View className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
              <Text className="text-white/60 text-sm font-medium mb-1">Topic</Text>
              <Text className="text-white text-lg font-bold mb-4">{parsedTopic.name}</Text>
              <Text className="text-white/60 text-sm font-medium mb-1">Details</Text>
              <Text className="text-white text-[15px] font-medium mb-6">10 questions • {modeParam === "revision" ? "Based on weak areas" : "Real Exam Questions"}</Text>
              {typeParam === "pyq" ? (
                pyqTotal === 0 ? (
                  <Text className="text-neutral-400 text-xs mb-4">Loading PYQs...</Text>
                ) : topicPyqCount > 0 ? (
                  <Text className="text-neutral-400 text-xs mb-4">Available for this topic: {topicPyqCount} PYQs</Text>
                ) : (
                  <Text className="text-red-400 text-xs mb-4">No verified PYQs available for this topic yet</Text>
                )
              ) : null}
              <TouchableOpacity onPress={handleStartQuiz} className="bg-green-600 p-4 rounded-xl items-center"><Text className="text-white font-bold tracking-wide text-[16px]">Start Assessment</Text></TouchableOpacity>
            </View>
          ) : loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#4FC3F7" />
              <Text className="text-neutral-400 mt-4 text-[15px] font-medium">{typeParam === "pyq" ? "Loading PYQs..." : "Generating questions with AI..."}</Text>
            </View>
          ) : showResult ? (
            <View className="items-center mt-10 p-8 bg-white/10 rounded-[30px] border border-white/20">
              <Text className="text-white text-[28px] font-black tracking-tight mb-2">{score >= 4 ? "Excellent! 🏆" : score >= 2 ? "Good Try! 👍" : "Keep Learning! 📚"}</Text>
              <View className="items-center justify-center bg-[#0F172A]/80 w-32 h-32 rounded-full mt-4 border-4 border-indigo-500/50 mb-4"><Text className="text-indigo-300 text-3xl font-black">{score}<Text className="text-xl text-indigo-500/80">/{questions.length}</Text></Text></View>
              <TouchableOpacity onPress={() => router.back()} className="bg-indigo-600 px-10 py-4 rounded-full mt-6"><Text className="text-white font-bold text-[16px] tracking-wide">Continue Journey</Text></TouchableOpacity>
            </View>
          ) : quizError ? (
            <View className="flex-1 justify-center items-center mt-10">
              <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>Our AI service is experiencing high demand. Failed to generate quiz.</Text>
              <TouchableOpacity onPress={() => handleStartQuiz()} className="mt-6 p-4 bg-red-500/20 rounded-xl border border-red-500/50"><Text className="text-red-400 font-bold">Retry Generation 🔄</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => router.back()} className="mt-4 p-3"><Text className="text-blue-500 font-semibold">← Go Back</Text></TouchableOpacity>
            </View>
          ) : questions.length === 0 && typeParam === "pyq" ? (
            <View className="flex-1 justify-center items-center mt-10">
              <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>No verified PYQs available for this topic yet</Text>
              <TouchableOpacity onPress={() => router.back()} className="mt-6 p-3"><Text className="text-blue-500 font-semibold">← Go Back</Text></TouchableOpacity>
            </View>
          ) : questions.length === 0 && typeParam === "mistake" ? (
            <View className="flex-1 justify-center items-center mt-10">
              <Text className="text-[50px] mb-4">🎉</Text>
              <Text className="text-white text-2xl font-bold mb-2">Your mistake bank is clear!</Text>
              <Text className="text-neutral-400 text-center px-4">Start a new quiz to continue improving and conquering your weak areas.</Text>
              <TouchableOpacity onPress={() => router.back()} className="mt-8 p-4 bg-blue-600 rounded-xl"><Text className="text-white font-bold tracking-wide">Return to Dashboard</Text></TouchableOpacity>
            </View>
          ) : (
            <QuizView questions={questions} loading={loading} onExit={() => router.back()} onComplete={onQuizComplete} type={typeParam} />
          )}
        </View>
        {showResult && score >= 4 && <ConfettiCannon count={150} origin={{ x: 200, y: -20 }} fadeOut={true} fallSpeed={3000} colors={["#818cf8", "#34d399", "#fbbf24", "#f472b6", "#38bdf8"]} />}
      </SafeAreaView>
    </LinearGradient>
  );
}
