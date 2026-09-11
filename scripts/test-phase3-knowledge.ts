/**
 * Phase 3 Knowledge Backbone & Trust Layer Direct Test Runner
 */

import { knowledgeRepository } from "../data/knowledge/repository";

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`❌ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
  }
}

console.log("==================================================");
console.log("NurseAI Phase 3 — Knowledge Backbone Test Suite");
console.log("==================================================\n");

// 1. Repository Access & Subject Count
const subjects = knowledgeRepository.getAllSubjects();
assert(subjects.length > 0, "1. getAllSubjects returns non-empty list", `Count: ${subjects.length}`);

// 2. Fetch specific subject
const medSurg = knowledgeRepository.getSubjectById("subj_medical_surgical_nursing");
assert(!!medSurg, "2. getSubjectById('subj_medical_surgical_nursing')", medSurg?.name);

// 3. Fetch topics for Medical-Surgical
const topics = knowledgeRepository.getTopicsForSubject("subj_medical_surgical_nursing");
assert(topics.length > 0, "3. getTopicsForSubject returns topics", `Count: ${topics.length}`);

// 4. Test Topic Structure
const topic = topics[0];
assert(!!topic.quickRevision, "4. Topic has QuickRevision card");
assert(!!topic.fullAnswer, "5. Topic has FullAnswer card");
assert(topic.conceptIds.length > 0, "6. Topic has conceptIds");

// 5. Fetch concepts for Topic
const concepts = knowledgeRepository.getConceptsForTopic(topic.id);
assert(concepts.length > 0, "7. getConceptsForTopic returns concepts", `Count: ${concepts.length}`);

// 6. Fetch mnemonics for Topic
const mnemonics = knowledgeRepository.getMnemonicsForTopic(topic.id);
assert(mnemonics.length >= 0, "8. getMnemonicsForTopic executed successfully");

// 7. GOVERNANCE CORRECTION TEST: All harvested concepts MUST be REVIEW_REQUIRED
const allConcepts = knowledgeRepository.getConceptsForTopic(topic.id);
const hasHumanVerified = allConcepts.some((c) => c.meta.verificationStatus === "HUMAN_VERIFIED");
assert(!hasHumanVerified, "9. GOVERNANCE VERIFICATION: Harvested items are NOT automatically HUMAN_VERIFIED");

const allReviewRequired = allConcepts.every((c) => c.meta.verificationStatus === "REVIEW_REQUIRED");
assert(allReviewRequired, "10. GOVERNANCE VERIFICATION: Harvested items are REVIEW_REQUIRED");

console.log(`\nResults: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} total tests.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🟢 ALL PHASE 3 KNOWLEDGE BACKBONE TESTS PASSED PERFECTLY!");
  process.exit(0);
}
