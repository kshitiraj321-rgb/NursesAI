/**
 * NURSEAI MASTER BLUEPRINT V1.1 — Knowledge Backbone Types
 *
 * This file defines the TypeScript contract for the entire knowledge graph.
 * All new content, learning features, and intelligence engine features must
 * conform to these interfaces.
 *
 * Blueprint Reference: "Subject → Topic → Concept → Mnemonic"
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT TRUST LAYER
// Every piece of knowledge must have a declared verification status.
// AI-generated content can NEVER bypass this pipeline to become "verified".
//
// Pipeline: AI_GENERATED → REVIEW_REQUIRED → HUMAN_VERIFIED → PUBLISHED
// ─────────────────────────────────────────────────────────────────────────────

export type VerificationStatus =
  | "AI_GENERATED"     // Produced by an LLM. Not trusted for clinical decisions.
  | "REVIEW_REQUIRED"  // Flagged for human review before use.
  | "HUMAN_VERIFIED"   // Reviewed by a qualified nursing professional.
  | "PUBLISHED";       // Verified and active in the product.

export interface ContentMeta {
  verificationStatus: VerificationStatus;
  source?: string;        // e.g., "Lewis Medical-Surgical Nursing, 10th Ed."
  lastReviewedAt?: string; // ISO date string
  reviewedBy?: string;    // Identifier of the reviewer (not personal data)
  version?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// MNEMONIC
// Mnemonics are functional components of the learning loop.
// They are attached to specific Concepts and surfaced when a student
// fails a retrieval attempt.
// ─────────────────────────────────────────────────────────────────────────────

export interface Mnemonic {
  id: string;
  conceptId: string; // Foreign key to a Concept
  topicId: string;   // Denormalized for efficient querying
  title: string;     // e.g., "AEIOU for causes of Metabolic Acidosis"
  mnemonic: string;  // The actual acronym/phrase, e.g., "A-E-I-O-U"
  expansion: string; // Full expansion of the mnemonic
  hint?: string;     // Optional contextual hint
  meta: ContentMeta;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT
// A Concept is a specific, examinable sub-section of a Topic.
// The Intelligence Engine tracks mastery at the CONCEPT level, not just Topic.
// e.g., Topic: "Pneumonia" → Concepts: "Etiology", "Diagnostics", "Nursing Care"
// ─────────────────────────────────────────────────────────────────────────────

export type ConceptType =
  | "definition"
  | "etiology"
  | "riskFactors"
  | "pathophysiology"
  | "clinicalManifestations"
  | "assessment"
  | "diagnostics"
  | "management"
  | "nursingManagement"
  | "complications"
  | "redFlags"
  | "clinicalConnection";

export interface Concept {
  id: string;
  topicId: string;     // Foreign key to a Topic
  subjectId: string;   // Denormalized for efficient querying
  type: ConceptType;
  title: string;       // Display name, e.g., "Nursing Management"
  content: string;     // The educational content for this concept
  keyTakeaways?: string[]; // 2-4 bullet points for fast scanning
  mnemonicIds?: string[]; // References to Mnemonic objects
  meta: ContentMeta;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPIC
// A Topic is a clinical entity (disease, condition, or clinical concept).
// It is composed of ordered Concepts, Quick Revision content, and a Full Answer.
// e.g., "Pneumonia", "Hypertension", "Insulin Administration"
// ─────────────────────────────────────────────────────────────────────────────

export interface QuickRevision {
  definition: string;
  keyCauses: string[];
  keySymptoms: string[];
  assessment: string[];
  importantDiagnostics: string[];
  nursingManagement: string[];
  redFlags: string[];
  mnemonicId?: string; // Reference to the primary Mnemonic for recall
  thirtySecondRecall: string; // A single crisp prompt for the recall test
}

export interface FullAnswer {
  introduction: string;
  definition: string;
  etiology: string;
  pathophysiology: string;
  clinicalManifestations: string;
  investigations: string;
  management: string;
  nursingManagement: string;
  complications: string;
  conclusion: string;
  rapidRevision: string[];
  examTip: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;         // e.g., "Pneumonia"
  displayName: string;  // For UI display, may include emoji
  conceptIds: string[]; // Ordered list of Concept IDs
  quickRevision?: QuickRevision;
  fullAnswer?: FullAnswer;
  meta: ContentMeta;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECT
// The top-level grouping of Topics.
// e.g., "Medical-Surgical Nursing", "Pharmacology", "Obstetrics"
// ─────────────────────────────────────────────────────────────────────────────

export interface Subject {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  weightage?: string;   // Clinical weightage indicator (e.g. "30-45%")
  topicIds: string[];   // Ordered list of Topic IDs
  meta: ContentMeta;
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTERY LIFECYCLE
// Tracks a user's relationship with a specific Concept over time.
// The Intelligence Engine drives all transitions between states.
//
// State machine:
// UNSEEN → LEARNING → PRACTICING → WEAK → IMPROVING → MASTERED → DUE_FOR_REVIEW → RETAINED
// ─────────────────────────────────────────────────────────────────────────────

export type MasteryState =
  | "UNSEEN"         // Student has never encountered this concept
  | "LEARNING"       // Student has viewed the content but not practiced
  | "PRACTICING"     // Student has attempted practice
  | "WEAK"           // Repeated failures; needs focused attention
  | "IMPROVING"      // Recent improvement detected
  | "MASTERED"       // Consistent correct retrieval across multiple sessions
  | "DUE_FOR_REVIEW" // Was mastered, but review interval has elapsed
  | "RETAINED";      // Mastered and retained after review

export interface ConceptMastery {
  userId: string;
  conceptId: string;
  topicId: string;
  subjectId: string;
  state: MasteryState;
  totalAttempts: number;
  correctAttempts: number;
  consecutiveCorrect: number; // Streak of correct answers
  lastAttemptAt?: string;     // ISO date string
  masteredAt?: string;        // ISO date string, set when state becomes MASTERED
  nextReviewAt?: string;      // ISO date string for spaced review scheduling
  easeFactor: number;         // For spaced repetition algorithm (default: 2.5)
  interval: number;           // Days until next review
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLBOX — CLINICAL UTILITY (Blueprint V1 tools only)
// All calculators are deterministic. AI may explain, never calculate.
// Every tool has its own risk classification.
// ─────────────────────────────────────────────────────────────────────────────

export type ToolRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type CalculatorId =
  | "iv_drip_rate"
  | "ml_per_hour"
  | "drops_per_min"
  | "temperature_conversion"
  | "weight_conversion"
  | "unit_conversion";

export type ReferenceId =
  | "vital_signs"
  | "gcs"
  | "avpu"
  | "pain_scales";

export interface ToolMeta {
  id: CalculatorId | ReferenceId;
  name: string;
  description: string;
  riskLevel: ToolRiskLevel;
  source: string;
  verificationStatus: VerificationStatus;
  lastReviewedAt: string;
  safetyNote: string; // Required for all tools
  releaseGate: "V1" | "V1.5" | "V2" | "FORBIDDEN";
}
