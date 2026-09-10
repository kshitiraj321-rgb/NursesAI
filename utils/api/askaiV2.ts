import axios from "axios";
import { auth } from "../../firebase";

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

export interface CitationRecord {
  citationId: string;
  chunkId: string;
  provenance: any;
}

export interface ResponseEnvelope {
  answer: string;
  citations: CitationRecord[];
  isComplete: boolean;
  completionStatus: CompletionState;
  evidenceState: EvidenceState;
}

export interface StructuredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  apiVersion: "v2";
  citations: CitationRecord[];
  completionStatus: CompletionState;
  evidenceState: EvidenceState;
  createdAt?: any;
  mode?: string;
}

export const fetchAskAIV2 = async (messages: any[], mode: string): Promise<StructuredMessage> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const token = await user.getIdToken();
  if (!token) {
    throw new Error("Failed to retrieve auth token");
  }

  // TODO: Make base URL configurable for dev vs prod. Hardcoded here to match existing askai.tsx pattern.
  const response = await axios.post("https://nursesai.onrender.com/ask-v2", {
    messages,
    mode,
  }, { 
    headers: { Authorization: `Bearer ${token}` } 
  });

  const envelope = response.data as ResponseEnvelope;

  // Validate minimum client-side shape
  if (!envelope || typeof envelope.answer !== "string") {
    throw new Error("Malformed ResponseEnvelope: missing answer");
  }
  if (!envelope.completionStatus) {
    throw new Error("Malformed ResponseEnvelope: missing completionStatus");
  }

  return {
    id: Date.now().toString() + "-ai-v2",
    role: "assistant",
    content: envelope.answer,
    apiVersion: "v2",
    citations: envelope.citations || [],
    completionStatus: envelope.completionStatus,
    evidenceState: envelope.evidenceState || { isAiGenerated: true, missingEvidence: true, safetyState: "UNSAFE" },
    mode,
  };
};
