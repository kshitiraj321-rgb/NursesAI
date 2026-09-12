
import { practiceRepository } from "../data/practice/repository";
import type { ConceptMasteryRecord } from "../data/types/practice";

// A standalone script to test `getDueForReview` against the memory store
// We can test by injecting a fake record via `recordAttempt` or just mocking the internal map if we can't.
// Wait, we can test it directly if we modify `masteryStore` but it's not exported.
// Let's use `recordAttempt` to build up a concept to MASTERED state.

async function runTests() {
  console.log("Starting getDueForReview tests...");
  
  // clear cache
  practiceRepository.clearLocalCache();
  
  const userId = "testUser1";
  
  // We need to transition a concept to MASTERED. (3 consecutive correct)
  for (let i = 0; i < 3; i++) {
    await practiceRepository.recordAttempt({
      id: `att_${i}`,
      userId,
      questionId: "q1",
      conceptId: "concept_1",
      topicId: "topic_1",
      mode: "MCQ",
      selectedOptionIndex: 0,
      correctOptionIndex: 0,
      isCorrect: true,
      timeSpentSeconds: 10,
      attemptedAt: new Date("2020-01-01T00:00:00.000Z").toISOString(),
    });
  }
  
  // The concept is now MASTERED. Its nextReviewAt should be "2020-01-03T00:00:00.000Z" (since intervalDays=1 * easeFactor=2.5 rounded is 3 days).
  
  // TEST 1: MASTERED + past date -> included
  const pastTest = practiceRepository.getDueForReview(userId, "2020-01-04T00:00:00.000Z");
  if (pastTest.length === 1 && pastTest[0].conceptId === "concept_1") {
    console.log("TEST 1 PASS: MASTERED + past date -> included");
  } else {
    console.log("TEST 1 FAIL", pastTest);
  }

  // TEST 2: MASTERED + exact now -> included
  const exactTest = practiceRepository.getDueForReview(userId, "2020-01-04T00:00:00.000Z");
  if (exactTest.length === 1) {
    console.log("TEST 2 PASS: MASTERED + exact now -> included");
  } else {
    console.log("TEST 2 FAIL");
  }

  // TEST 3: MASTERED + future date -> excluded
  const futureTest = practiceRepository.getDueForReview(userId, "2020-01-02T00:00:00.000Z");
  if (futureTest.length === 0) {
    console.log("TEST 3 PASS: MASTERED + future date -> excluded");
  } else {
    console.log("TEST 3 FAIL");
  }

  // TEST 4: wrong user -> excluded
  const wrongUserTest = practiceRepository.getDueForReview("testUser2", "2020-01-04T00:00:00.000Z");
  if (wrongUserTest.length === 0) {
    console.log("TEST 4 PASS: wrong user -> excluded");
  } else {
    console.log("TEST 4 FAIL");
  }

  // Set up WEAK state
  await practiceRepository.recordAttempt({
      id: "att_fail",
      userId,
      questionId: "q1",
      conceptId: "concept_1",
      topicId: "topic_1",
      mode: "MCQ",
      selectedOptionIndex: 1,
      correctOptionIndex: 0,
      isCorrect: false, // failure makes it WEAK
      timeSpentSeconds: 10,
      attemptedAt: new Date("2020-01-01T00:00:00.000Z").toISOString(),
  });

  // TEST 5: WEAK + past date -> excluded
  const weakTest = practiceRepository.getDueForReview(userId, "2020-01-04T00:00:00.000Z");
  if (weakTest.length === 0) {
    console.log("TEST 5 PASS: WEAK + past date -> excluded");
  } else {
    console.log("TEST 5 FAIL");
  }

  // Set up IMPROVING state
  await practiceRepository.recordAttempt({
      id: "att_improving",
      userId,
      questionId: "q1",
      conceptId: "concept_1",
      topicId: "topic_1",
      mode: "MCQ",
      selectedOptionIndex: 0,
      correctOptionIndex: 0,
      isCorrect: true, // true from WEAK -> IMPROVING
      timeSpentSeconds: 10,
      attemptedAt: new Date("2020-01-01T00:00:00.000Z").toISOString(),
  });

  // TEST 6: IMPROVING + past date -> excluded
  const improvingTest = practiceRepository.getDueForReview(userId, "2020-01-04T00:00:00.000Z");
  if (improvingTest.length === 0) {
    console.log("TEST 6 PASS: IMPROVING + past date -> excluded");
  } else {
    console.log("TEST 6 FAIL");
  }

  // TEST 7: empty store -> empty
  practiceRepository.clearLocalCache();
  const emptyTest = practiceRepository.getDueForReview(userId, "2020-01-04T00:00:00.000Z");
  if (emptyTest.length === 0) {
    console.log("TEST 7 PASS: empty store -> empty");
  } else {
    console.log("TEST 7 FAIL");
  }
}

runTests().catch(console.error);
