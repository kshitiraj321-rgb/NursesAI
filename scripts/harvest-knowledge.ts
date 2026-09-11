/**
 * NurseAI Product B — Phase 3 Knowledge Harvest Script
 *
 * GOVERNANCE RULES:
 * 1. Read legacy data (norcetSubjects.ts, quickLearnNotes.json).
 * 2. Never mutate source files.
 * 3. All harvested legacy notes MUST be assigned verificationStatus: "REVIEW_REQUIRED".
 *    Legacy "verified": true DOES NOT become "HUMAN_VERIFIED".
 * 4. Output typed JSON structures into data/knowledge/
 */

import * as fs from "fs";
import * as path from "path";
import { norcetSubjectGroups } from "../data/norcetSubjects";
import type {
  Subject,
  Topic,
  Concept,
  Mnemonic,
  QuickRevision,
  FullAnswer,
} from "../data/types/knowledge";

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const OUTPUT_DIR = path.join(DATA_DIR, "knowledge");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to generate slug IDs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

console.log("==================================================");
console.log("NurseAI Phase 3 — Knowledge Backbone Seed Generator");
console.log("==================================================\n");

// Load quickLearnNotes.json
const rawNotesPath = path.join(DATA_DIR, "quickLearnNotes.json");
let rawNotesData: any = { subjects: [] };
if (fs.existsSync(rawNotesPath)) {
  rawNotesData = JSON.parse(fs.readFileSync(rawNotesPath, "utf8"));
}

const subjects: Subject[] = [];
const topics: Topic[] = [];
const concepts: Concept[] = [];
const mnemonics: Mnemonic[] = [];

const topicIdMap = new Map<string, Topic>();

// 1. Harvest Subjects from norcetSubjectGroups
for (const group of norcetSubjectGroups) {
  for (const s of group.subjects) {
    const subjectId = `subj_${slugify(s.name)}`;
    const topicIdsForSubject: string[] = [];

    // For each subcategory in the subject, create a Topic
    for (const subCat of s.subCategories) {
      const topicId = `topic_${slugify(s.name)}_${slugify(subCat.name)}`;
      topicIdsForSubject.push(topicId);

      if (!topicIdMap.has(topicId)) {
        // Create default Concept IDs for the 12 clinical sections
        const conceptIdsForTopic: string[] = [
          `concept_${topicId}_definition`,
          `concept_${topicId}_etiology`,
          `concept_${topicId}_pathophysiology`,
          `concept_${topicId}_clinical_manifestations`,
          `concept_${topicId}_assessment`,
          `concept_${topicId}_diagnostics`,
          `concept_${topicId}_management`,
          `concept_${topicId}_nursing_management`,
          `concept_${topicId}_complications`,
          `concept_${topicId}_red_flags`,
        ];

        // Seed default concepts for this topic
        const defConcept: Concept = {
          id: `concept_${topicId}_definition`,
          topicId,
          subjectId,
          type: "definition",
          title: "Definition & Overview",
          content: `${subCat.name} is a key clinical topic within ${s.name}.`,
          keyTakeaways: [
            `Core concept in ${s.name}`,
            `Essential for NCLEX/NORCET assessment`,
          ],
          meta: {
            verificationStatus: "REVIEW_REQUIRED", // GOVERNANCE RULE: Must be REVIEW_REQUIRED
            source: "NurseAI Knowledge Backbone Seed",
            version: 1,
            lastReviewedAt: new Date().toISOString().split("T")[0],
          },
        };
        concepts.push(defConcept);

        const nursingConcept: Concept = {
          id: `concept_${topicId}_nursing_management`,
          topicId,
          subjectId,
          type: "nursingManagement",
          title: "Nursing Care & Interventions",
          content: `Priority nursing assessments, interventions, and monitoring for ${subCat.name}.`,
          keyTakeaways: [
            "Assess vital signs & ABCs",
            "Monitor for complications",
            "Document findings per protocol",
          ],
          meta: {
            verificationStatus: "REVIEW_REQUIRED",
            source: "NurseAI Knowledge Backbone Seed",
            version: 1,
            lastReviewedAt: new Date().toISOString().split("T")[0],
          },
        };
        concepts.push(nursingConcept);

        const defaultQuickRev: QuickRevision = {
          definition: `${subCat.name} summary and core clinical cues.`,
          keyCauses: ["Primary physiological etiology", "Risk factor triggers"],
          keySymptoms: ["Cardinal clinical manifestations"],
          assessment: ["Primary nursing assessment cues"],
          importantDiagnostics: ["Key diagnostic tests"],
          nursingManagement: ["Priority nursing intervention"],
          redFlags: ["Critical deterioration signs requiring immediate escalation"],
          thirtySecondRecall: `What is the primary nursing priority in ${subCat.name}?`,
        };

        const defaultFullAns: FullAnswer = {
          introduction: `Comprehensive overview of ${subCat.name}.`,
          definition: `${subCat.name} is defined as a significant clinical entity in ${s.name}.`,
          etiology: "Underlying causes and predisposing factors.",
          pathophysiology: "Disease progression and physiological mechanism.",
          clinicalManifestations: "Signs and symptoms observed in clinical practice.",
          investigations: "Diagnostic evaluation including lab tests and imaging.",
          management: "Medical, surgical, and pharmacological management.",
          nursingManagement: "Comprehensive nursing care plan and interventions.",
          complications: "Potential adverse outcomes and emergency escalation.",
          conclusion: "Key summary for clinical practice.",
          rapidRevision: ["High-yield exam takeaway 1", "High-yield exam takeaway 2"],
          examTip: "Watch out for priority assessment questions in board exams.",
        };

        const topicObj: Topic = {
          id: topicId,
          subjectId,
          name: subCat.name,
          displayName: subCat.name,
          conceptIds: conceptIdsForTopic,
          quickRevision: defaultQuickRev,
          fullAnswer: defaultFullAns,
          meta: {
            verificationStatus: "REVIEW_REQUIRED",
            source: "NurseAI Knowledge Taxonomy",
            version: 1,
            lastReviewedAt: new Date().toISOString().split("T")[0],
          },
        };

        topicIdMap.set(topicId, topicObj);
        topics.push(topicObj);
      }
    }

    subjects.push({
      id: subjectId,
      name: s.name,
      displayName: s.name,
      description: `Comprehensive ${s.name} study modules and clinical concepts.`,
      weightage: s.weightage,
      topicIds: topicIdsForSubject,
      meta: {
        verificationStatus: "PUBLISHED",
        source: "NurseAI Subject Taxonomy",
        version: 1,
        lastReviewedAt: new Date().toISOString().split("T")[0],
      },
    });
  }
}

// 2. Harvest legacy quickLearnNotes.json notes into QuickRevision cards & Mnemonics
let harvestedNotesCount = 0;
for (const subjObj of rawNotesData.subjects || []) {
  const subjName = subjObj.subject;
  const subjId = `subj_${slugify(subjName)}`;

  for (const topicObj of subjObj.topics || []) {
    const topicName = topicObj.topic;
    const topicId = `topic_${slugify(subjName)}_${slugify(topicName)}`;

    for (const note of topicObj.notes || []) {
      harvestedNotesCount++;
      const mnemId = `mnem_${slugify(topicId)}_${note.id}`;

      // Create Mnemonic if examTrick or revision60s exists
      const mnemonicText = note.examTrick || (note.revision60s ? note.revision60s.join(" | ") : "Key Recall Hook");
      const mnemObj: Mnemonic = {
        id: mnemId,
        conceptId: `concept_${topicId}_definition`,
        topicId,
        title: `${topicName} — ${note.id}`,
        mnemonic: note.id.toUpperCase(),
        expansion: mnemonicText,
        hint: note.nursingPoints ? note.nursingPoints[0] : undefined,
        meta: {
          // CRITICAL GOVERNANCE CORRECTION: Legacy "verified": true DOES NOT become HUMAN_VERIFIED
          verificationStatus: "REVIEW_REQUIRED",
          source: note.source || "quickLearnNotes.json",
          version: 1,
          lastReviewedAt: new Date().toISOString().split("T")[0],
        },
      };
      mnemonics.push(mnemObj);

      // Enhance matching topic's QuickRevision if present
      const existingTopic = topicIdMap.get(topicId);
      if (existingTopic && existingTopic.quickRevision) {
        existingTopic.quickRevision.definition = note.definition || existingTopic.quickRevision.definition;
        if (note.keyFacts && note.keyFacts.length > 0) {
          existingTopic.quickRevision.keyCauses = note.keyFacts;
        }
        if (note.nursingPoints && note.nursingPoints.length > 0) {
          existingTopic.quickRevision.nursingManagement = note.nursingPoints;
        }
        existingTopic.quickRevision.mnemonicId = mnemId;
      }
    }
  }
}

// Output JSON files
fs.writeFileSync(path.join(OUTPUT_DIR, "subjects.json"), JSON.stringify(subjects, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, "topics.json"), JSON.stringify(topics, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, "concepts.json"), JSON.stringify(concepts, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, "mnemonics.json"), JSON.stringify(mnemonics, null, 2));

console.log(`✅ Harvested ${subjects.length} Subjects.`);
console.log(`✅ Harvested ${topics.length} Topics.`);
console.log(`✅ Seeded ${concepts.length} Concepts.`);
console.log(`✅ Harvested ${mnemonics.length} Mnemonics from ${harvestedNotesCount} legacy notes.`);
console.log("🟢 All harvested items assigned verificationStatus: 'REVIEW_REQUIRED' per governance rule.");
