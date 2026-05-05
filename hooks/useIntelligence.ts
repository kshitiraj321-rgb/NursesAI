import { useIntelligenceContext } from "../context/IntelligenceContext";
import type { IntelligenceData } from "../context/IntelligenceContext";

export type { TopicStat, IntelligenceData } from "../context/IntelligenceContext";

export function useIntelligence() {
  const { data, loading } = useIntelligenceContext();
  return { ...data, loading };
}

export function getWeakestTopic(userData: IntelligenceData) {
  return userData.weakestTopic;
}
