import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, increment, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";

import QuizView from "../components/Shared/QuizView";
import { norcetSubjectGroups } from "../data/norcetSubjects";
import pyqDataJson from "../data/pyqData.json";
import { db } from "../firebase";

export default function QuizScreen() {
  const { topic, type, mode, topics } = useLocalSearchParams();
  const topicParam = typeof topic === "string" ? topic : Array.isArray(topic) ? topic[0] || "" : "";
  const typeParam = typeof type === "string" ? type : Array.isArray(type) ? type[0] || "" : "";
  const modeParam = typeof mode === "string" ? mode : Array.isArray(mode) ? mode[0] || "" : "";
  const topicsParam = typeof topics === "string" ? topics : Array.isArray(topics) ? topics[0] || "" : "";

  let parsedTopic: any = { name: topicParam, id: topicParam };
  if (typeParam !== "pyq" && topicParam) {
    try {
      parsedTopic = JSON.parse(topicParam);
    } catch {}
  }
  const safeTopicId = String(parsedTopic.id).replace(/\//g, "-");
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [pyqData, setPyqData] = useState<any[]>([]);

  useEffect(() => {
    if (typeParam === "pyq") {
      setPyqData((pyqDataJson as any[]) || []);
    }
  }, [typeParam]);

  useEffect(() => {
    console.log("PYQ COUNT:", pyqData.length);
  }, [pyqData.length]);

  const clean = (str: string) =>
    str.toLowerCase().replace(/[^a-z\s]/g, "").trim();

  const taxonomyRows = norcetSubjectGroups.flatMap((group) =>
    group.subjects.flatMap((subject) =>
      subject.subCategories.flatMap((subCategory) =>
        subCategory.topics.map((subtopic) => ({
          subject: subject.name,
          topic: subCategory.name,
          subtopic: subtopic.name,
          subjectNorm: clean(subject.name),
          topicNorm: clean(subCategory.name),
          subtopicNorm: clean(subtopic.name),
        }))
      )
    )
  );

  const resolveHierarchyMatches = (input: string) => {
    const q = clean(input);
    if (!q) return [];

    return taxonomyRows.filter((row) =>
      row.subjectNorm === q ||
      row.topicNorm === q ||
      row.subtopicNorm === q ||
      row.subjectNorm.includes(q) ||
      row.topicNorm.includes(q) ||
      row.subtopicNorm.includes(q) ||
      q.includes(row.subjectNorm) ||
      q.includes(row.topicNorm) ||
      q.includes(row.subtopicNorm)
    );
  };

  const matchesHierarchy = (
    questionSubject: string,
    questionTopic: string,
    hierarchyRows: ReturnType<typeof resolveHierarchyMatches>
  ) => {
    if (hierarchyRows.length === 0) return false;

    return hierarchyRows.some((row) => {
      const subjectMatch =
        questionSubject.includes(row.subjectNorm) ||
        row.subjectNorm.includes(questionSubject);
      const topicMatch =
        questionTopic.includes(row.topicNorm) ||
        row.topicNorm.includes(questionTopic);
      const subtopicMatch =
        questionTopic.includes(row.subtopicNorm) ||
        row.subtopicNorm.includes(questionTopic);

      return subjectMatch || topicMatch || subtopicMatch;
    });
  };

  const shuffleArray = <T,>(array: T[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleStartQuiz = async () => {
    setLoading(true);
    setHasStarted(true);

    try {
      const user = getAuth().currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid, "topicProgress", safeTopicId), {
          status: "attempted",
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (err) {
      console.log("Progress error:", err);
    }

    if (typeParam === "pyq") {
      if (pyqData.length === 0) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      if (modeParam === "revision") {
        let revisionTopics: string[] = [];

        try {
          revisionTopics = topicsParam ? JSON.parse(topicsParam) : [];
        } catch {
          revisionTopics = [];
        }

        const revisionRows = revisionTopics
          .map((weakTopic) => clean(String(weakTopic || "")))
          .filter(Boolean)
          .flatMap((weakTopic) => resolveHierarchyMatches(weakTopic));

        const filtered = pyqData.filter((q) => {
          const questionTopic = clean(String(q.topic || ""));
          const questionSubject = clean(String(q.subject || ""));
          return matchesHierarchy(questionSubject, questionTopic, revisionRows);
        });
        const shuffled = shuffleArray(filtered);
        const selected = shuffled.slice(0, 15);

        setQuestions(selected);
        setLoading(false);
        return;
      }

      const hierarchyRows = resolveHierarchyMatches(topicParam);

      // MAIN FILTER
      let filtered = pyqData.filter((q) => {
        const questionTopic = clean(String(q.topic || ""));
        const questionSubject = clean(String(q.subject || ""));
        return matchesHierarchy(questionSubject, questionTopic, hierarchyRows);
      });

      if (filtered.length === 0) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      const shuffled = shuffleArray(filtered);
      setQuestions(shuffled.slice(0, 15));
      setLoading(false);
      return;
    }

    try {
      const prompt = `Generate 5 MCQ questions for ${parsedTopic.name} for nursing exam. Return ONLY JSON array.\n[\n  {\n    "question": "",\n    "options": ["", "", "", ""],\n    "answer": ""\n  }\n]\nTopic: ${parsedTopic.name}`;
      const response = await axios.post("https://nursesai.onrender.com/ask", {
        messages: [{ role: "user", content: prompt }],
      });

      let cleaned = response.data.answer.trim();
      if (!cleaned.endsWith("]")) cleaned = cleaned.substring(0, cleaned.lastIndexOf("}") + 1) + "]";
      
      setQuestions(JSON.parse(cleaned));
    } catch (err) {
      console.log("Quiz error:", err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const saveResult = async (finalScore: number, weakTopics: Record<string, number> = {}, strongTopics: Record<string, number> = {}) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, "users", user.uid, "quizResults"), {
        topic: parsedTopic.name,
        score: finalScore,
        total: questions.length,
        weakTopics: weakTopics,
        strongTopics: strongTopics,
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "users", user.uid, "topicProgress", safeTopicId), {
        status: "completed",
        lastScore: finalScore,
        attempts: increment(1),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  const onQuizComplete = (finalScore: number, weakTopics?: Record<string, number>, strongTopics?: Record<string, number>) => {
    setScore(finalScore);
    setShowResult(true);
    saveResult(finalScore, weakTopics || {}, strongTopics || {});
  };

  return (
    <LinearGradient colors={["#1E1B4B", "#0F172A"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 p-5 pt-3">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-blue-500 font-semibold text-[15px]">← Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-3xl font-bold tracking-tight mb-2 mt-4">Quiz</Text>
        <Text className="text-blue-400 text-xl font-bold tracking-wide mb-6">{parsedTopic.name}</Text>

        {!hasStarted ? (
          <TouchableOpacity
            onPress={handleStartQuiz}
            className="bg-green-600 p-4 rounded-xl items-center mt-4"
          >
            <Text className="text-white font-bold tracking-wide text-[16px]">Start Assessment 📝</Text>
          </TouchableOpacity>
        ) : loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4FC3F7" />
            <Text className="text-neutral-400 mt-4 text-[15px] font-medium">
              {typeParam === "pyq" ? "Loading PYQs..." : "Generating questions with AI..."}
            </Text>
          </View>
        ) : showResult ? (
          <View className="items-center mt-10 p-8 bg-white/10 rounded-[30px] border border-white/20">
            <Text className="text-white text-[28px] font-black tracking-tight mb-2">
              {score >= 4 ? "Excellent! 🏆" : score >= 2 ? "Good Try! 👍" : "Keep Learning! 📚"}
            </Text>
            
            <View className="items-center justify-center bg-[#0F172A]/80 w-32 h-32 rounded-full mt-4 border-4 border-indigo-500/50 mb-4">
              <Text className="text-indigo-300 text-3xl font-black">{score}<Text className="text-xl text-indigo-500/80">/{questions.length}</Text></Text>
            </View>

            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-indigo-600 px-10 py-4 rounded-full mt-6"
            >
              <Text className="text-white font-bold text-[16px] tracking-wide">Continue Journey</Text>
            </TouchableOpacity>
          </View>
        ) : questions.length === 0 && typeParam === "pyq" ? (
          <View className="flex-1 justify-center items-center mt-10">
            <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
              No PYQs available for this topic yet
            </Text>
            <TouchableOpacity onPress={() => router.back()} className="mt-6 p-3">
              <Text className="text-blue-500 font-semibold">← Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <QuizView
            questions={questions}
            loading={loading}
            onExit={() => router.back()}
            onComplete={onQuizComplete}
            type={typeParam}
          />
        )}
      </View>
      {showResult && score >= 4 && (
        <ConfettiCannon 
          count={150} 
          origin={{ x: 200, y: -20 }} 
          fadeOut={true} 
          fallSpeed={3000} 
          colors={['#818cf8', '#34d399', '#fbbf24', '#f472b6', '#38bdf8']} 
        />
      )}
      </SafeAreaView>
    </LinearGradient>
  );
}
