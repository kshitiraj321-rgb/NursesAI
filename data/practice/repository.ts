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
} from "../types/practice";
import { initConceptMastery, processAttempt } from "./masteryEngine";
import { createMistakeRecord, updateMistakeRecord } from "./mistakeBank";

import questionsData from "./questions.json";

const questions: PracticeQuestion[] = questionsData as PracticeQuestion[];

// In-memory persistent state stores for local practice session tracking
const attemptsStore: PracticeAttempt[] = [];
const mistakeStore = new Map<string, MistakeRecord>();
const masteryStore = new Map<string, ConceptMasteryRecord>();

export const practiceRepository = {
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
  recordAttempt(attempt: PracticeAttempt): {
    updatedMastery: ConceptMasteryRecord;
    updatedMistake?: MistakeRecord;
  } {
    attemptsStore.push(attempt);

    // 1. Update Concept Mastery state
    const masteryKey = `${attempt.userId}_${attempt.conceptId}`;
    let currentMastery =
      masteryStore.get(masteryKey) ||
      initConceptMastery(
        attempt.userId,
        attempt.conceptId,
        attempt.topicId,
        attempt.subjectId || "subj_general"
      );

    const updatedMastery = processAttempt(
      currentMastery,
      attempt.isCorrect,
      attempt.attemptedAt
    );
    masteryStore.set(masteryKey, updatedMastery);

    // 2. Update Mistake Bank state
    let updatedMistake: MistakeRecord | undefined;
    const mistakeKey = `mistake_${attempt.userId}_${attempt.conceptId}`;

    if (!attempt.isCorrect) {
      const existingMistake = mistakeStore.get(mistakeKey);
      if (existingMistake) {
        updatedMistake = updateMistakeRecord(
          existingMistake,
          false,
          attempt.questionId,
          attempt.attemptedAt
        );
      } else {
        updatedMistake = createMistakeRecord(
          attempt.userId,
          attempt.conceptId,
          attempt.topicId,
          attempt.questionId,
          attempt.attemptedAt
        );
      }
      mistakeStore.set(mistakeKey, updatedMistake);
    } else {
      const existingMistake = mistakeStore.get(mistakeKey);
      if (existingMistake && existingMistake.status !== "RESOLVED") {
        updatedMistake = updateMistakeRecord(
          existingMistake,
          true,
          attempt.questionId,
          attempt.attemptedAt
        );
        mistakeStore.set(mistakeKey, updatedMistake);
      }
    }

    return { updatedMastery, updatedMistake };
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

  /** Get concept mastery record for a user and concept */
  getConceptMastery(userId: string, conceptId: string): ConceptMasteryRecord | undefined {
    return masteryStore.get(`${userId}_${conceptId}`);
  },
};
