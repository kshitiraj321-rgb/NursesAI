/**
 * NurseAI Product B — Practice Repository DAO
 *
 * Blueprint V1.1 & Phase 4 Rules:
 * 1. Concept is the anchor for all practice queries.
 * 2. Manages PracticeQuestions, PracticeAttempts, MistakeRecords, and ConceptMastery.
 * 3. Enforces 2 consecutive correct attempts to resolve mistakes.
 * 4. Enforces 3 consecutive correct attempts to promote mastery to MASTERED.
 */

import type {
  PracticeQuestion,
  PracticeAttempt,
  MistakeRecord,
  ConceptMasteryRecord,
  PracticeMode,
  PracticeSessionResult,
  RecommendedNextAction,
} from "../types/practice";
import { initConceptMastery, processAttempt } from "./masteryEngine";
import { createMistakeRecord, updateMistakeRecord } from "./mistakeBank";

import questionsData from "./questions.json";

import { doc, runTransaction, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const questions: PracticeQuestion[] = questionsData as PracticeQuestion[];

// In-memory persistent state stores for local practice session tracking
const attemptsStore: PracticeAttempt[] = [];
const mistakeStore = new Map<string, MistakeRecord>();
const masteryStore = new Map<string, ConceptMasteryRecord>();

let activeHydrationUserId: string | null = null;
let isHydrationComplete: boolean = false;
let hydrationError: Error | null = null;
let latestSessionResult: PracticeSessionResult | null = null;

export const practiceRepository = {
  /** Get the current hydration state for the progress UI */
  getHydrationState(userId: string) {
    if (activeHydrationUserId !== userId) {
      return { status: "UNHYDRATED" as const };
    }
    if (hydrationError) {
      return { status: "ERROR" as const, error: hydrationError };
    }
    if (!isHydrationComplete) {
      return { status: "LOADING" as const };
    }
    return { status: "HYDRATED" as const };
  },

  /** Get global mastery metrics aggregated from in-memory cache */
  getGlobalMasteryMetrics(userId: string) {
    let totalConcepts = 0;
    let mastered = 0;
    let improving = 0;
    let weak = 0;
    let unseen = 0;
    let totalAttempts = 0;
    let correctAttempts = 0;

    for (const record of masteryStore.values()) {
      if (record.userId === userId) {
        totalConcepts++;
        totalAttempts += record.totalAttempts;
        correctAttempts += record.correctAttempts;

        if (record.state === "MASTERED") mastered++;
        else if (record.state === "IMPROVING") improving++;
        else if (record.state === "WEAK") weak++;
        else if (record.state === "UNSEEN") unseen++;
      }
    }

    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    return {
      totalConcepts,
      mastered,
      improving,
      weak,
      unseen,
      totalAttempts,
      correctAttempts,
      accuracy,
    };
  },
  /** Get all concept-linked practice questions */
  getAllQuestions(): PracticeQuestion[] {
    return questions;
  },

  /** Get questions anchored to a specific concept ID */
  getQuestionsForConcept(conceptId: string): PracticeQuestion[] {
    return questions.filter((q) => q.conceptId === conceptId);
  },

  /** Get questions for a topic, optionally filtered by practice mode */
  getQuestionsForTopic(topicId: string, mode?: PracticeMode): PracticeQuestion[] {
    return questions.filter(
      (q) => q.topicId === topicId && (!mode || q.mode === mode)
    );
  },

  /** Get questions for a specific practice mode */
  getQuestionsForMode(mode: PracticeMode): PracticeQuestion[] {
    return questions.filter((q) => q.mode === mode);
  },

  /** Record a practice attempt and trigger mastery & mistake state updates */
  async recordAttempt(attempt: PracticeAttempt): Promise<{
    updatedMastery: ConceptMasteryRecord;
    updatedMistake?: MistakeRecord;
    persistenceError?: Error;
  }> {
    let persistenceError: Error | undefined;

    const attemptRef = doc(db, `users/${attempt.userId}/attempts/${attempt.id}`);
    const mistakeRef = doc(db, `users/${attempt.userId}/mistakes/${attempt.conceptId}`);
    const masteryRef = doc(db, `users/${attempt.userId}/mastery/${attempt.conceptId}`);

    let transactedMastery: ConceptMasteryRecord | undefined;
    let transactedMistake: MistakeRecord | undefined;

    try {
      await runTransaction(db, async (transaction) => {
        // 1. Reads
        const mistakeDoc = await transaction.get(mistakeRef);
        const masteryDoc = await transaction.get(masteryRef);

        // 2. Compute Mastery
        const currentMastery = masteryDoc.exists()
          ? (masteryDoc.data() as ConceptMasteryRecord)
          : initConceptMastery(
              attempt.userId,
              attempt.conceptId,
              attempt.topicId,
              attempt.subjectId || "subj_general"
            );
        transactedMastery = processAttempt(currentMastery, attempt.isCorrect, attempt.attemptedAt);

        // 3. Compute Mistake
        if (!attempt.isCorrect) {
          if (mistakeDoc.exists()) {
            transactedMistake = updateMistakeRecord(
              mistakeDoc.data() as MistakeRecord,
              false,
              attempt.questionId,
              attempt.attemptedAt
            );
          } else {
            transactedMistake = createMistakeRecord(
              attempt.userId,
              attempt.conceptId,
              attempt.topicId,
              attempt.questionId,
              attempt.attemptedAt
            );
          }
        } else if (mistakeDoc.exists() && mistakeDoc.data().status !== "RESOLVED") {
          transactedMistake = updateMistakeRecord(
            mistakeDoc.data() as MistakeRecord,
            true,
            attempt.questionId,
            attempt.attemptedAt
          );
        } else {
          // No mistake to update or it's already resolved
          transactedMistake = undefined;
        }

        // 4. Writes
        transaction.set(attemptRef, attempt);
        transaction.set(masteryRef, transactedMastery);
        if (transactedMistake) {
          transaction.set(mistakeRef, transactedMistake);
        }
      });
    } catch (error) {
      persistenceError = error instanceof Error ? error : new Error(String(error));
    }

    // 5. In-Memory State Updates
    // If transaction succeeded, we use transacted values to keep memory perfectly in sync.
    // If it failed, we fall back to local computation to preserve session progress (online-first fallback).

    attemptsStore.push(attempt);

    let finalMastery: ConceptMasteryRecord;
    const masteryKey = `${attempt.userId}_${attempt.conceptId}`;

    if (transactedMastery) {
      finalMastery = transactedMastery;
    } else {
      let currentMastery =
        masteryStore.get(masteryKey) ||
        initConceptMastery(
          attempt.userId,
          attempt.conceptId,
          attempt.topicId,
          attempt.subjectId || "subj_general"
        );
      finalMastery = processAttempt(currentMastery, attempt.isCorrect, attempt.attemptedAt);
    }
    masteryStore.set(masteryKey, finalMastery);

    let finalMistake: MistakeRecord | undefined;
    const mistakeKey = `mistake_${attempt.userId}_${attempt.conceptId}`;

    if (transactedMistake) {
      finalMistake = transactedMistake;
      mistakeStore.set(mistakeKey, finalMistake);
    } else if (persistenceError) {
      // Local fallback calculation for mistake
      if (!attempt.isCorrect) {
        const existingMistake = mistakeStore.get(mistakeKey);
        if (existingMistake) {
          finalMistake = updateMistakeRecord(
            existingMistake,
            false,
            attempt.questionId,
            attempt.attemptedAt
          );
        } else {
          finalMistake = createMistakeRecord(
            attempt.userId,
            attempt.conceptId,
            attempt.topicId,
            attempt.questionId,
            attempt.attemptedAt
          );
        }
        mistakeStore.set(mistakeKey, finalMistake);
      } else {
        const existingMistake = mistakeStore.get(mistakeKey);
        if (existingMistake && existingMistake.status !== "RESOLVED") {
          finalMistake = updateMistakeRecord(
            existingMistake,
            true,
            attempt.questionId,
            attempt.attemptedAt
          );
          mistakeStore.set(mistakeKey, finalMistake);
        }
      }
    }
    
    return { updatedMastery: finalMastery, updatedMistake: finalMistake, persistenceError };
  },

  /** Get active mistake records for a user */
  getActiveMistakes(userId: string): MistakeRecord[] {
    return Array.from(mistakeStore.values()).filter(
      (m) => m.userId === userId && m.status !== "RESOLVED"
    );
  },

  /** Get all mistake records for a user */
  getAllMistakes(userId: string): MistakeRecord[] {
    return Array.from(mistakeStore.values()).filter((m) => m.userId === userId);
  },

  /** Get a specific mistake record by concept ID */
  getMistakeByConceptId(userId: string, conceptId: string): MistakeRecord | undefined {
    return mistakeStore.get(`mistake_${userId}_${conceptId}`);
  },

  /** Get concept mastery record for a user and concept */
  getConceptMastery(userId: string, conceptId: string): ConceptMasteryRecord | undefined {
    return masteryStore.get(`${userId}_${conceptId}`);
  },

  /** Get concepts that are due for spaced review */
  getDueForReview(userId: string, now?: string): ConceptMasteryRecord[] {
    const currentTime = now || new Date().toISOString();
    return Array.from(masteryStore.values()).filter(
      (record) =>
        record.userId === userId &&
        record.state === "MASTERED" &&
        record.nextReviewAt &&
        record.nextReviewAt <= currentTime
    );
  },

  /** Clear all module-level practice caches (for logout isolation) */
  clearLocalCache(): void {
    activeHydrationUserId = null;
    isHydrationComplete = false;
    hydrationError = null;
    latestSessionResult = null;
    attemptsStore.length = 0;
    mistakeStore.clear();
    masteryStore.clear();
  },

  /** Store the ephemeral result of the most recently completed session */
  setLatestSessionResult(result: PracticeSessionResult): void {
    latestSessionResult = result;
  },

  /** Retrieve the ephemeral result of the most recently completed session */
  getLatestSessionResult(): PracticeSessionResult | null {
    return latestSessionResult;
  },

  /** Clear the ephemeral session result (called at the start of a new session) */
  clearLatestSessionResult(): void {
    latestSessionResult = null;
  },

  /** Hydrate modern practice state from Firestore */
  async loadUserProgress(userId: string): Promise<{ success: boolean; error?: Error }> {
    try {
      activeHydrationUserId = userId;
      isHydrationComplete = false;
      hydrationError = null;

      // 1. Enforce cache isolation
      practiceRepository.clearLocalCache();
      
      // Re-assert active hydration token since clearLocalCache resets it
      activeHydrationUserId = userId;
      isHydrationComplete = false;
      hydrationError = null;

      // 2. Query Mastery
      const masteryRef = collection(db, `users/${userId}/mastery`);
      const masterySnap = await getDocs(masteryRef);

      // 3. Query Mistakes
      const mistakeRef = collection(db, `users/${userId}/mistakes`);
      const mistakeSnap = await getDocs(mistakeRef);
      
      // 4. Stale hydration guard - DO NOT populate if context changed
      if (activeHydrationUserId !== userId) {
        return { success: false, error: new Error("Hydration aborted: Auth context changed") };
      }

      masterySnap.forEach((docSnap) => {
        const data = docSnap.data() as ConceptMasteryRecord;
        if (data && data.userId === userId && data.conceptId && data.state) {
          masteryStore.set(`${data.userId}_${data.conceptId}`, data);
        }
      });

      mistakeSnap.forEach((docSnap) => {
        const data = docSnap.data() as MistakeRecord;
        if (data && data.userId === userId && data.conceptId && data.status) {
          mistakeStore.set(`mistake_${data.userId}_${data.conceptId}`, data);
        }
      });

      isHydrationComplete = true;
      return { success: true };
    } catch (error) {
      // Only clear if this exact hydration context is still active.
      // If User B logged in, activeHydrationUserId is 'UserB' (or null if signed out),
      // so we must NOT wipe User B's cache due to User A's failed fetch.
      if (activeHydrationUserId === userId) {
        practiceRepository.clearLocalCache();
        activeHydrationUserId = userId; // keep it marked as active for this user so we know it errored for them
        hydrationError = error instanceof Error ? error : new Error(String(error));
      }
      return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
    }
  },

  /** Deterministic recommendation logic based on modern practice state */
  getRecommendedNextAction(userId: string, now?: string): RecommendedNextAction {
    const hydration = this.getHydrationState(userId);
    
    if (hydration.status === "LOADING" || hydration.status === "UNHYDRATED") {
      return {
        status: "UNAVAILABLE",
        action: "NONE",
        reason: "Loading practice data..."
      };
    }

    if (hydration.status === "ERROR") {
      return {
        status: "ERROR",
        action: "NONE",
        reason: "Unable to load practice data."
      };
    }

    const activeMistakes = this.getActiveMistakes(userId);
    if (activeMistakes.length > 0) {
      return {
        status: "AVAILABLE",
        action: "REVIEW_MISTAKES",
        reason: "You have active mistakes to review.",
        count: activeMistakes.length
      };
    }

    const dueReviews = this.getDueForReview(userId, now);
    if (dueReviews.length > 0) {
      return {
        status: "AVAILABLE",
        action: "SPACED_REVIEW",
        reason: "You have concepts due for spaced review.",
        count: dueReviews.length
      };
    }

    return {
      status: "AVAILABLE",
      action: "PRACTICE",
      reason: "No active mistakes or due reviews; continue practice."
    };
  }
};
