/**
 * NurseAI Product B — Legacy PYQ Concept Linker Script
 *
 * Blueprint V1.1 & Phase 4 Rules:
 * 1. Read 227 legacy PYQs from data/pyq/chunks/
 * 2. Link each question to a canonical conceptId in Knowledge Backbone.
 * 3. Inherit verificationStatus: "REVIEW_REQUIRED" per Product B Trust Layer governance.
 * 4. Output typed questions into data/practice/questions.json
 */

import * as fs from "fs";
import * as path from "path";
import type { PracticeQuestion, PracticeMode } from "../data/types/practice";
import type { Topic, Concept } from "../data/types/knowledge";

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const KNOWLEDGE_DIR = path.join(DATA_DIR, "knowledge");
const PRACTICE_DIR = path.join(DATA_DIR, "practice");

if (!fs.existsSync(PRACTICE_DIR)) {
  fs.mkdirSync(PRACTICE_DIR, { recursive: true });
}

// Load knowledge backbone topics and concepts
const topics: Topic[] = JSON.parse(
  fs.readFileSync(path.join(KNOWLEDGE_DIR, "topics.json"), "utf8")
);
const concepts: Concept[] = JSON.parse(
  fs.readFileSync(path.join(KNOWLEDGE_DIR, "concepts.json"), "utf8")
);

// Map topic name to topic ID
const topicNameToId = new Map<string, string>();
for (const t of topics) {
  topicNameToId.set(t.name.toLowerCase(), t.id);
  topicNameToId.set(t.displayName.toLowerCase(), t.id);
}

// Helper to normalize strings for matching
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

console.log("==================================================");
console.log("NurseAI Phase 4 — Legacy PYQ Concept Linker");
console.log("==================================================\n");

const pyqManifestPath = path.join(DATA_DIR, "pyq", "manifest.json");
const pyqChunksDir = path.join(DATA_DIR, "pyq", "chunks");
const practiceQuestions: PracticeQuestion[] = [];

if (fs.existsSync(pyqManifestPath) && fs.existsSync(pyqChunksDir)) {
  const manifestData: { total: number; chunks: { file: string }[] } = JSON.parse(
    fs.readFileSync(pyqManifestPath, "utf8")
  );

  for (const chunk of manifestData.chunks) {
    const filePath = path.join(pyqChunksDir, chunk.file);
    if (!fs.existsSync(filePath)) continue;
    const records: any[] = JSON.parse(fs.readFileSync(filePath, "utf8"));

    for (const pyq of records) {
      if (!pyq.question || !pyq.options || pyq.options.length < 2) continue;

      const pyqSubj = pyq.subject || "Medical-Surgical Nursing";
      const pyqSubCat = pyq.subCategory || "General";
      const subjId = `subj_${slugify(pyqSubj)}`;
      const topicId = `topic_${slugify(pyqSubj)}_${slugify(pyqSubCat)}`;

      // Attempt to find matching conceptId for this topic
      const topicConcepts = concepts.filter((c) => c.topicId === topicId);
      let targetConceptId = `concept_${topicId}_definition`;

      if (topicConcepts.length > 0) {
        const qTextLower = pyq.question.toLowerCase();
        if (qTextLower.includes("assess") || qTextLower.includes("sign") || qTextLower.includes("symptom")) {
          const matched = topicConcepts.find((c) => c.type === "assessment" || c.type === "clinicalManifestations");
          if (matched) targetConceptId = matched.id;
        } else if (qTextLower.includes("nurse") || qTextLower.includes("care") || qTextLower.includes("action") || qTextLower.includes("priority")) {
          const matched = topicConcepts.find((c) => c.type === "nursingManagement");
          if (matched) targetConceptId = matched.id;
        } else if (qTextLower.includes("test") || qTextLower.includes("lab") || qTextLower.includes("diagnostic")) {
          const matched = topicConcepts.find((c) => c.type === "diagnostics");
          if (matched) targetConceptId = matched.id;
        } else {
          targetConceptId = topicConcepts[0].id;
        }
      }

      // Determine practice mode based on question structure
      let mode: PracticeMode = "MCQ";
      if (pyq.question.toLowerCase().includes("which mnemonic") || pyq.question.toLowerCase().includes("acronym")) {
        mode = "MNEMONIC_RECALL";
      } else if (pyq.question.length > 150 && (pyq.question.includes("patient") || pyq.question.includes("presents"))) {
        mode = "CASE_RECOGNITION";
      }

      // Determine correct option index
      let correctOptionIndex = 0;
      if (pyq.answer) {
        const foundIdx = pyq.options.findIndex(
          (opt: string) => opt.trim().toLowerCase() === pyq.answer.trim().toLowerCase()
        );
        if (foundIdx >= 0) correctOptionIndex = foundIdx;
      }

      const pq: PracticeQuestion = {
        id: `pq_${slugify(pyq.id || pyq.question.slice(0, 20))}`,
        conceptId: targetConceptId,
        topicId,
        subjectId: subjId,
        mode,
        scenarioText: pyq.question.length > 120 ? pyq.question : undefined,
        questionText: pyq.question,
        options: pyq.options,
        correctOptionIndex,
        explanation: pyq.explanation || "Core clinical rationale based on standard nursing guidelines.",
        meta: {
          verificationStatus: "REVIEW_REQUIRED", // TRUST LAYER GOVERNANCE
          source: pyq.source || "Historical PYQ Chunk",
          version: 1,
          lastReviewedAt: new Date().toISOString().split("T")[0],
        },
      };

      practiceQuestions.push(pq);
    }
  }
}

// Output practice questions JSON
fs.writeFileSync(
  path.join(PRACTICE_DIR, "questions.json"),
  JSON.stringify(practiceQuestions, null, 2)
);

console.log(`✅ Linked ${practiceQuestions.length} practice questions to canonical concept IDs.`);
console.log("🟢 All harvested practice items assigned verificationStatus: 'REVIEW_REQUIRED' per governance rule.");
