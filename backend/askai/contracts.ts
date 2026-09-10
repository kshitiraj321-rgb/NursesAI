export type SourceId = string;
export type ChunkId = string;
export type CitationId = string;

export type LegalClearance = "PENDING" | "CLEARED" | "RESTRICTED" | "DENIED";
export type VerificationStatus = "REVIEW_REQUIRED" | "HUMAN_VERIFIED" | "PUBLISHED" | "REJECTED" | "STALE" | "AI_GENERATED";
export type SourceVersionLifecycle = "CURRENT" | "SUPERSEDED" | "UNDER_REVIEW" | "WITHDRAWN" | "UNKNOWN";
export type PyqAuthenticity = "AUTHENTIC" | "RECONSTRUCTED" | "UNVERIFIED";

export interface ImmutableProvenanceSnapshot {
  sourceId: SourceId;
  title: string;
  sourceType: string;
  edition?: string;
  chapter?: string;
  page?: number | string;
  url?: string;
  legalClearance: LegalClearance;
  verificationStatus: VerificationStatus;
  versionLifecycle: SourceVersionLifecycle;
  pyqAuthenticity?: PyqAuthenticity;
}

export interface RetrievalResult {
  chunkId: ChunkId;
  sourceId: SourceId;
  text: string;
  provenance: ImmutableProvenanceSnapshot;
}

export interface CitationProposal {
  chunkId: ChunkId;
}

export interface CitationValidationResult {
  status: "VALID" | "INVALID";
  reason?: string;
  citationId?: CitationId;
  provenance?: ImmutableProvenanceSnapshot;
}

export interface CitationRecord {
  citationId: CitationId;
  chunkId: ChunkId;
  provenance: ImmutableProvenanceSnapshot;
}

export type CompletionState = 
  | "COMPLETE" 
  | "TRUNCATED_TOKENS" 
  | "MALFORMED_JSON" 
  | "MISSING_CITATION" 
  | "INSUFFICIENT_EVIDENCE" 
  | "SAFETY_REFUSAL";

export interface EvidenceState {
  isAiGenerated: boolean;
  missingEvidence: boolean;
  safetyState: "SAFE" | "UNSAFE";
}

export interface ResponseEnvelope {
  answer: string;
  citations: CitationRecord[];
  isComplete: boolean;
  completionStatus: CompletionState;
  evidenceState: EvidenceState;
}
