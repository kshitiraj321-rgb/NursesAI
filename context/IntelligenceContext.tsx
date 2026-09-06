import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebase";

export interface TopicStat {
  accuracy: number;
  attempts: number;
  mistakes: number;
  lastAttempt: number;
  status: "weak" | "strong" | "neutral";
  confidence: "high" | "medium" | "low";
  intelligenceScore: number;
  trend: "improving" | "declining" | "flat";
}

export interface IntelligenceData {
  weakestTopic: string | null;
  strongestTopics: string[];
  recommendedTopic: string | null;
  topicStats: Record<string, TopicStat>;
  globalAccuracy: string;
  totalAttempts: number;
}

interface IntelligenceContextValue {
  data: IntelligenceData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const defaultData: IntelligenceData = {
  weakestTopic: null,
  strongestTopics: [],
  recommendedTopic: null,
  topicStats: {},
  globalAccuracy: "0",
  totalAttempts: 0,
};

const defaultContextValue: IntelligenceContextValue = {
  data: defaultData,
  loading: true,
  error: null,
  refresh: async () => {},
};

export const IntelligenceContext = createContext<IntelligenceContextValue>(defaultContextValue);

export function IntelligenceProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<IntelligenceData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(auth.currentUser?.uid ?? null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
    });
    return unsub;
  }, []);

  const refresh = useCallback(async () => {
    if (!uid) {
      setData(defaultData);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resultsQuery = query(
        collection(db, "users", uid, "quizResults"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      const snapshot = await getDocs(resultsQuery);

      const stats: Record<string, { correct: number; total: number; lastAttempt: number; recentScores: number[] }> = {};
      let globalCorrect = 0;
      let globalTotal = 0;

      snapshot.forEach((docSnap) => {
        const result = docSnap.data();
        const topic = typeof result.topic === 'string' ? result.topic.trim() : result.topic;

        const correct = result.correctAnswers ?? result.score ?? 0;
        const total = result.totalQuestions ?? result.total ?? 10;

        globalCorrect += correct;
        globalTotal += total;

        if (!topic) return;

        if (!stats[topic]) {
          stats[topic] = {
            correct: 0,
            total: 0,
            lastAttempt: result.lastAttemptAt?.toMillis() ?? result.createdAt?.toMillis() ?? Date.now(),
            recentScores: [],
          };
        }

        stats[topic].correct += correct;
        stats[topic].total += total;

        if (total > 0) {
          stats[topic].recentScores.push(correct / total);
        }
      });

      const globalAccuracy = globalTotal > 0 ? ((globalCorrect / globalTotal) * 100).toFixed(1) : "0";
      const totalAttempts = snapshot.size;

      const topicStats: Record<string, TopicStat> = {};
      let weakestTopic: string | null = null;
      let recommendedTopic: string | null = null;
      const strongestTopics: string[] = [];

      let lowestAccuracy = 101;
      let highestIntelligenceScore = -1;

      Object.entries(stats).forEach(([topic, stat]) => {
        const accuracy = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
        const attempts = Math.ceil(stat.total / 10);
        const mistakes = stat.total - stat.correct;

        const daysSinceLastAttempt = (Date.now() - stat.lastAttempt) / (1000 * 60 * 60 * 24);
        const recencyPenalty = daysSinceLastAttempt > 3 ? 20 : daysSinceLastAttempt > 1 ? 10 : 0;
        const intelligenceScore = (100 - accuracy) * 0.6 + mistakes * 0.3 + recencyPenalty * 0.1;

        let status: "weak" | "strong" | "neutral" = "neutral";
        if (accuracy < 60) {
          status = "weak";
          if (accuracy < lowestAccuracy) {
            lowestAccuracy = accuracy;
            weakestTopic = topic;
          }
        } else if (accuracy > 75 && attempts >= 3) {
          status = "strong";
          strongestTopics.push(topic);
        }

        if (intelligenceScore > highestIntelligenceScore) {
          highestIntelligenceScore = intelligenceScore;
          recommendedTopic = topic;
        }

        const confidence = attempts >= 5 && accuracy > 75 ? "high" : attempts >= 3 ? "medium" : "low";

        let trend: "improving" | "declining" | "flat" = "flat";
        const recent7 = stat.recentScores.slice(0, 7);
        if (recent7.length >= 2) {
          const recentAcc = recent7[0] * 100;
          const previousAcc = (recent7.slice(1).reduce((acc, val) => acc + val, 0) / (recent7.length - 1)) * 100;
          if (recentAcc - previousAcc >= 5) trend = "improving";
          else if (previousAcc - recentAcc >= 5) trend = "declining";
        }

        topicStats[topic] = {
          accuracy: Math.round(accuracy),
          attempts,
          mistakes,
          lastAttempt: stat.lastAttempt,
          status,
          confidence,
          intelligenceScore,
          trend,
        };
      });

      setData({
        weakestTopic,
        strongestTopics,
        recommendedTopic,
        topicStats,
        globalAccuracy,
        totalAttempts,
      });
    } catch (e) {
      console.error("Error loading intelligence:", e);
      setError(e instanceof Error ? e.message : "Failed to load intelligence");
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      refresh,
    }),
    [data, loading, error, refresh]
  );

  return <IntelligenceContext.Provider value={value}>{children}</IntelligenceContext.Provider>;
}

export function useIntelligenceContext() {
  return useContext(IntelligenceContext);
}
