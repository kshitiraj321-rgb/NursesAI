/**
 * NurseAI Product B — Phase 4 Practice Domain Contracts
 *
 * Blueprint V1.1 & Phase 4 Governance:
 * 1. The Concept is the anchor, not the question.
 * 2. Every practice item, attempt, and mistake record MUST map to a canonical conceptId.
 * 3. Four Practice Modes: CONCEPT_CHECK, MCQ, MNEMONIC_RECALL, CASE_RECOGNITION.
 * 4. Mastery State Machine: UNSEEN -> LEARNING -> PRACTICING -> WEAK -> IMPROVING -> MASTERED -> DUE_FOR_REVIEW -> RETAINED.
 * 5. Mistake Bank: Requires 2 consecutive correct attempts to resolve.
 * 6. Mastery Promotion: Requires 3 consecutive correct attempts.
 */

import type { ContentMeta, MasteryState } from "./knowledge";

export type PracticeMode =
  | "CONCEPT_CHECK"
  | "MCQ"
  | "MNEMONIC_RECALL"
  | "CASE_RECOGNITION";

export interface PracticeQuestion {
  id: string;                 // e.g. "pq_medsurg_pneumonia_01"
  conceptId: string;          // MANDATORY ANCHOR to Knowledge Backbone
  topicId: string;            // Foreign key to Topic
  subjectId: string;          // Foreign key to Subject
  mode: PracticeMode;
  scenarioText?: string;      // Clinical vignette / patient presentation (MCQ & Case)
  questionText: string;       // The active retrieval prompt
  options: string[];          // 4 options (or 2 for binary Concept Check)
  correctOptionIndex: number; // 0..3
  explanation: string;        // Verified clinical rationale for correct answer
  mnemonicId?: string;        // Associated mnemonic for recall reinforcement
  meta: ContentMeta;          // Inherits Trust Layer verification status
}

export interface PracticeAttempt {
  id: string;
  userId: string;
  questionId: string;
  conceptId: string;          // MANDATORY ANCHOR
  topicId: string;
  subjectId?: string;
  mode: PracticeMode;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  attemptedAt: string;        // ISO timestamp
}

export type MistakeStatus = "ACTIVE" | "IMPROVING" | "RESOLVED";

export interface MistakeRecord {
  id: string;                 // "mistake_<userId>_<conceptId>"
  userId: string;
  conceptId: string;          // MANDATORY ANCHOR
  topicId: string;
  questionId: string;         // Most recent failed question ID
  failureCount: number;       // Cumulative failure count
  consecutiveCorrect: number; // Must reach 2 to resolve
  status: MistakeStatus;
  firstFailedAt: string;      // ISO timestamp
  lastFailedAt: string;       // ISO timestamp
  resolvedAt?: string;        // ISO timestamp when status becomes RESOLVED
}

export interface ConceptMasteryRecord {
  userId: string;
  conceptId: string;          // MANDATORY ANCHOR
  topicId: string;
  subjectId: string;
  state: MasteryState;
  totalAttempts: number;
  correctAttempts: number;
  consecutiveCorrect: number; // Must reach 3 to promote to MASTERED
  lastAttemptAt?: string;
  masteredAt?: string;
  nextReviewAt?: string;
  easeFactor: number;         // Default: 2.5
  intervalDays: number;       // Review interval in days
}

export interface PracticeSession {
  id: string;
  mode: PracticeMode;
  subjectId?: string;
  topicId?: string;
  conceptId?: string;
  questions: PracticeQuestion[];
  currentIndex: number;
  score: number;
  attempts: PracticeAttempt[];
  startTime: string;
  endTime?: string;
}
