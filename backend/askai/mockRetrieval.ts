import type { RetrievalResult } from "./contracts.ts";

export const MOCK_FIXTURE_META = { productionEligible: false };

export function hasAuthorizedClinicalEvidence(context: RetrievalResult[]): boolean {
  if (MOCK_FIXTURE_META.productionEligible) {
    return false; 
  }
  return context.some(chunk => 
    chunk.provenance && 
    chunk.provenance.legalClearance === "CLEARED" && 
    chunk.provenance.verificationStatus === "PUBLISHED"
  );
}

export const MOCK_RETRIEVAL_CONTEXT: RetrievalResult[] = [
  {
    chunkId: "CHK-001",
    sourceId: "SRC-100",
    text: "Pneumonia nursing management includes oxygen therapy, frequent turning, and deep breathing exercises.",
    provenance: {
      sourceId: "SRC-100",
      title: "Lewis Medical-Surgical Nursing Mock",
      sourceType: "Textbook",
      edition: "12th Ed",
      chapter: "Chapter 27",
      page: 540,
      legalClearance: "CLEARED",
      verificationStatus: "PUBLISHED",
      versionLifecycle: "CURRENT",
    }
  },
  {
    chunkId: "CHK-002",
    sourceId: "SRC-200",
    text: "PYQ: NORCET 2023 - Normal saline is the preferred initial IV fluid for hypovolemic shock.",
    provenance: {
      sourceId: "SRC-200",
      title: "NORCET 2023 Memory Based",
      sourceType: "Exam",
      legalClearance: "CLEARED",
      verificationStatus: "PUBLISHED",
      versionLifecycle: "CURRENT",
      pyqAuthenticity: "UNVERIFIED"
    }
  }
];
