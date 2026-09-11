/**
 * NurseAI Product B — Practice Mastery State Machine
 *
 * Blueprint V1.1 & Phase 4 Rules:
 * 1. Concept is the anchor for all mastery calculations.
 * 2. State machine transitions:
 *    UNSEEN -> LEARNING -> PRACTICING -> WEAK -> IMPROVING -> MASTERED -> DUE_FOR_REVIEW -> RETAINED
 * 3. 3 consecutive correct attempts promote state to MASTERED.
 * 4. Any failure on a MASTERED or RETAINED concept immediately drops state to WEAK.
 */

import type { ConceptMasteryRecord } from "../types/practice";

export function initConceptMastery(
  userId: string,
  conceptId: string,
  topicId: string,
  subjectId: string
): ConceptMasteryRecord {
  return {
    userId,
    conceptId,
    topicId,
    subjectId,
    state: "UNSEEN",
    totalAttempts: 0,
    correctAttempts: 0,
    consecutiveCorrect: 0,
    easeFactor: 2.5,
    intervalDays: 1,
  };
}

export function processAttempt(
  current: ConceptMasteryRecord,
  isCorrect: boolean,
  attemptedAt: string = new Date().toISOString()
): ConceptMasteryRecord {
  const updated: ConceptMasteryRecord = {
    ...current,
    totalAttempts: current.totalAttempts + 1,
    lastAttemptAt: attemptedAt,
  };

  if (isCorrect) {
    updated.correctAttempts += 1;
    updated.consecutiveCorrect += 1;

    // State transition on SUCCESS
    if (updated.consecutiveCorrect >= 3) {
      updated.state = "MASTERED";
      if (!updated.masteredAt) {
        updated.masteredAt = attemptedAt;
      }
      // Set next review interval for spaced review (default 7 days after initial mastery)
      updated.intervalDays = Math.round(updated.intervalDays * updated.easeFactor);
      const nextReview = new Date(attemptedAt);
      nextReview.setDate(nextReview.getDate() + updated.intervalDays);
      updated.nextReviewAt = nextReview.toISOString();
    } else if (updated.state === "DUE_FOR_REVIEW") {
      updated.state = "RETAINED";
      updated.intervalDays = Math.round(updated.intervalDays * updated.easeFactor);
      const nextReview = new Date(attemptedAt);
      nextReview.setDate(nextReview.getDate() + updated.intervalDays);
      updated.nextReviewAt = nextReview.toISOString();
    } else if (
      updated.state === "UNSEEN" ||
      updated.state === "LEARNING" ||
      updated.state === "PRACTICING" ||
      updated.state === "WEAK"
    ) {
      updated.state = "IMPROVING";
    }
  } else {
    // Failure resets streak and drops state to WEAK
    updated.consecutiveCorrect = 0;
    updated.state = "WEAK";
  }

  return updated;
}
