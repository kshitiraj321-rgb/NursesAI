/**
 * NurseAI Product B — Mistake Bank Engine
 *
 * Blueprint V1.1 & Phase 4 Rules:
 * 1. Failures capture a MistakeRecord bound to conceptId.
 * 2. Resolving a mistake requires 2 CONSECUTIVE CORRECT ATTEMPTS on items linked to that concept.
 * 3. Status transitions: ACTIVE -> IMPROVING (1 correct) -> RESOLVED (2 consecutive correct).
 */

import type { MistakeRecord } from "../types/practice";

export function createMistakeRecord(
  userId: string,
  conceptId: string,
  topicId: string,
  questionId: string,
  failedAt: string = new Date().toISOString()
): MistakeRecord {
  return {
    id: `mistake_${userId}_${conceptId}`,
    userId,
    conceptId,
    topicId,
    questionId,
    failureCount: 1,
    consecutiveCorrect: 0,
    status: "ACTIVE",
    firstFailedAt: failedAt,
    lastFailedAt: failedAt,
  };
}

export function updateMistakeRecord(
  current: MistakeRecord,
  isCorrect: boolean,
  questionId: string,
  attemptedAt: string = new Date().toISOString()
): MistakeRecord {
  const updated: MistakeRecord = {
    ...current,
    questionId,
  };

  if (isCorrect) {
    updated.consecutiveCorrect += 1;
    if (updated.consecutiveCorrect >= 2) {
      updated.status = "RESOLVED";
      updated.resolvedAt = attemptedAt;
    } else {
      updated.status = "IMPROVING";
    }
  } else {
    updated.failureCount += 1;
    updated.consecutiveCorrect = 0;
    updated.status = "ACTIVE";
    updated.lastFailedAt = attemptedAt;
    updated.resolvedAt = undefined;
  }

  return updated;
}
