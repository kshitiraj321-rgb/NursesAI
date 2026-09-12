// Mock firebase before importing repository
jest.mock("../firebase", () => ({
  db: {},
  auth: {},
}));

import { practiceRepository } from "../data/practice/repository";
import type { ConceptMasteryRecord, MistakeRecord } from "../data/types/practice";

describe("Practice Intelligence: Recommended Next Action (Task 8.20-B)", () => {
  const userId = "testUserRecs";

  beforeEach(() => {
    practiceRepository.clearLocalCache();
  });

  test("Hydration states", () => {
    // 10. UNHYDRATED -> UNAVAILABLE
    practiceRepository.clearLocalCache();
    // By default, it's UNHYDRATED if loadUserProgress hasn't finished for this user.
    let rec = practiceRepository.getRecommendedNextAction(userId);
    expect(rec.status).toBe("UNAVAILABLE");

    // We can mock getHydrationState
    const originalGetHydration = practiceRepository.getHydrationState;

    practiceRepository.getHydrationState = jest.fn().mockReturnValue({ status: "LOADING" });
    rec = practiceRepository.getRecommendedNextAction(userId);
    expect(rec.status).toBe("UNAVAILABLE"); // 11. LOADING -> UNAVAILABLE

    practiceRepository.getHydrationState = jest.fn().mockReturnValue({ status: "ERROR" });
    rec = practiceRepository.getRecommendedNextAction(userId);
    expect(rec.status).toBe("ERROR"); // 12. ERROR -> ERROR
    
    // Restore
    practiceRepository.getHydrationState = originalGetHydration;
  });

  test("13. Empty hydrated state -> PRACTICE", () => {
    const originalGetHydration = practiceRepository.getHydrationState;
    practiceRepository.getHydrationState = jest.fn().mockReturnValue({ status: "HYDRATED" });
    
    const rec = practiceRepository.getRecommendedNextAction(userId);
    expect(rec.status).toBe("AVAILABLE");
    expect(rec.action).toBe("PRACTICE");
    
    practiceRepository.getHydrationState = originalGetHydration;
  });

  test("1. Active mistakes exist -> REVIEW_MISTAKES", async () => {
    const originalGetHydration = practiceRepository.getHydrationState;
    practiceRepository.getHydrationState = jest.fn().mockReturnValue({ status: "HYDRATED" });

    // Mock getActiveMistakes
    const originalGetMistakes = practiceRepository.getActiveMistakes;
    practiceRepository.getActiveMistakes = jest.fn().mockReturnValue([
      { id: "1", conceptId: "c1", status: "ACTIVE" }
    ]);
    const originalGetDue = practiceRepository.getDueForReview;
    practiceRepository.getDueForReview = jest.fn().mockReturnValue([]);

    const rec = practiceRepository.getRecommendedNextAction(userId);
    expect(rec.action).toBe("REVIEW_MISTAKES");
    expect(rec.count).toBe(1);

    practiceRepository.getHydrationState = originalGetHydration;
    practiceRepository.getActiveMistakes = originalGetMistakes;
    practiceRepository.getDueForReview = originalGetDue;
  });

  test("2. No active mistakes + due review exists -> SPACED_REVIEW", () => {
    const originalGetHydration = practiceRepository.getHydrationState;
    practiceRepository.getHydrationState = jest.fn().mockReturnValue({ status: "HYDRATED" });

    const originalGetMistakes = practiceRepository.getActiveMistakes;
    practiceRepository.getActiveMistakes = jest.fn().mockReturnValue([]);
    
    const originalGetDue = practiceRepository.getDueForReview;
    practiceRepository.getDueForReview = jest.fn().mockReturnValue([
      { conceptId: "c1", state: "MASTERED" }
    ]);

    const rec = practiceRepository.getRecommendedNextAction(userId);
    expect(rec.action).toBe("SPACED_REVIEW");
    expect(rec.count).toBe(1);

    practiceRepository.getHydrationState = originalGetHydration;
    practiceRepository.getActiveMistakes = originalGetMistakes;
    practiceRepository.getDueForReview = originalGetDue;
  });

  test("4. Active mistakes + due review -> REVIEW_MISTAKES wins", () => {
    const originalGetHydration = practiceRepository.getHydrationState;
    practiceRepository.getHydrationState = jest.fn().mockReturnValue({ status: "HYDRATED" });

    const originalGetMistakes = practiceRepository.getActiveMistakes;
    practiceRepository.getActiveMistakes = jest.fn().mockReturnValue([
      { id: "1", conceptId: "c1", status: "ACTIVE" }
    ]);
    
    const originalGetDue = practiceRepository.getDueForReview;
    practiceRepository.getDueForReview = jest.fn().mockReturnValue([
      { conceptId: "c2", state: "MASTERED" }
    ]);

    const rec = practiceRepository.getRecommendedNextAction(userId);
    expect(rec.action).toBe("REVIEW_MISTAKES"); // Mistake wins

    practiceRepository.getHydrationState = originalGetHydration;
    practiceRepository.getActiveMistakes = originalGetMistakes;
    practiceRepository.getDueForReview = originalGetDue;
  });

  test("14. Deterministic now -> same state + same now = same result", () => {
    const originalGetHydration = practiceRepository.getHydrationState;
    practiceRepository.getHydrationState = jest.fn().mockReturnValue({ status: "HYDRATED" });
    const originalGetMistakes = practiceRepository.getActiveMistakes;
    practiceRepository.getActiveMistakes = jest.fn().mockReturnValue([]);
    
    // We will check that getDueForReview is called with the exact `now` we pass.
    const originalGetDue = practiceRepository.getDueForReview;
    const getDueMock = jest.fn().mockReturnValue([]);
    practiceRepository.getDueForReview = getDueMock;

    const testTime = "2026-09-12T18:00:00Z";
    practiceRepository.getRecommendedNextAction(userId, testTime);

    expect(getDueMock).toHaveBeenCalledWith(userId, testTime);

    practiceRepository.getHydrationState = originalGetHydration;
    practiceRepository.getActiveMistakes = originalGetMistakes;
    practiceRepository.getDueForReview = originalGetDue;
  });
});
