import { validateCitationProposal, processCitations } from "../validation";
import { RetrievalResult, CitationProposal } from "../contracts";

describe("AskAI Citation Validation", () => {
  let mockGenerateId: jest.Mock;
  
  beforeEach(() => {
    let counter = 1;
    mockGenerateId = jest.fn(() => `${counter++}`);
  });

  const validContext: RetrievalResult[] = [
    {
      chunkId: "CHK-001",
      sourceId: "SRC-100",
      text: "Nursing management for pneumonia...",
      provenance: {
        sourceId: "SRC-100",
        title: "Lewis Medical-Surgical Nursing",
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
      text: "PYQ: NORCET 2023",
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

  describe("Citation identity & Security", () => {
    it("system creates Citation ID, ignoring any LLM supplied ID", () => {
      const proposal: any = { chunkId: "CHK-001", citationId: "LLM-FAKE-CIT" };
      const result = validateCitationProposal(proposal, validContext, mockGenerateId);
      
      expect(result.status).toBe("VALID");
      expect(result.citationId).toBe("CIT-1");
      expect(result.citationId).not.toBe("LLM-FAKE-CIT");
    });

    it("model-supplied page or URL cannot overwrite authoritative metadata", () => {
      // LLM tries to inject a fake URL and page
      const proposal: any = { chunkId: "CHK-001", page: 999, url: "http://fake.com" };
      const result = validateCitationProposal(proposal, validContext, mockGenerateId);
      
      expect(result.status).toBe("VALID");
      expect(result.provenance?.page).toBe(540);
      expect(result.provenance?.url).toBeUndefined();
    });

    it("prompt-injected source ID cannot bypass validation", () => {
      const proposal: any = { chunkId: "CHK-001", sourceId: "SRC-999-FAKE" };
      const result = validateCitationProposal(proposal, validContext, mockGenerateId);
      
      expect(result.status).toBe("VALID");
      expect(result.provenance?.sourceId).toBe("SRC-100");
    });
  });

  describe("Retrieval context", () => {
    it("valid Chunk ID accepted", () => {
      const result = validateCitationProposal({ chunkId: "CHK-001" }, validContext, mockGenerateId);
      expect(result.status).toBe("VALID");
    });

    it("nonexistent Chunk ID rejected", () => {
      const result = validateCitationProposal({ chunkId: "CHK-999" }, validContext, mockGenerateId);
      expect(result.status).toBe("INVALID");
      expect(result.reason).toBe("Chunk ID not found in retrieval context");
    });

    it("valid Chunk ID outside current context rejected", () => {
      const outOfContext: RetrievalResult[] = [];
      const result = validateCitationProposal({ chunkId: "CHK-001" }, outOfContext, mockGenerateId);
      expect(result.status).toBe("INVALID");
    });
  });

  describe("Authorization", () => {
    const makeAuthContext = (legal: string, verify: string): RetrievalResult[] => [{
      chunkId: "CHK-TEST",
      sourceId: "SRC-TEST",
      text: "Test",
      provenance: {
        sourceId: "SRC-TEST",
        title: "Test Source",
        sourceType: "Test",
        legalClearance: legal as any,
        verificationStatus: verify as any,
        versionLifecycle: "CURRENT"
      }
    }];

    it("CLEARED + PUBLISHED accepted", () => {
      const result = validateCitationProposal({ chunkId: "CHK-TEST" }, makeAuthContext("CLEARED", "PUBLISHED"), mockGenerateId);
      expect(result.status).toBe("VALID");
    });

    it("PENDING rejected", () => {
      const result = validateCitationProposal({ chunkId: "CHK-TEST" }, makeAuthContext("PENDING", "PUBLISHED"), mockGenerateId);
      expect(result.status).toBe("INVALID");
    });

    it("RESTRICTED rejected", () => {
      const result = validateCitationProposal({ chunkId: "CHK-TEST" }, makeAuthContext("RESTRICTED", "PUBLISHED"), mockGenerateId);
      expect(result.status).toBe("INVALID");
    });

    it("DENIED rejected", () => {
      const result = validateCitationProposal({ chunkId: "CHK-TEST" }, makeAuthContext("DENIED", "PUBLISHED"), mockGenerateId);
      expect(result.status).toBe("INVALID");
    });

    it("REVIEW_REQUIRED rejected", () => {
      const result = validateCitationProposal({ chunkId: "CHK-TEST" }, makeAuthContext("CLEARED", "REVIEW_REQUIRED"), mockGenerateId);
      expect(result.status).toBe("INVALID");
    });

    it("STALE rejected", () => {
      const result = validateCitationProposal({ chunkId: "CHK-TEST" }, makeAuthContext("CLEARED", "STALE"), mockGenerateId);
      expect(result.status).toBe("INVALID");
    });
  });

  describe("Provenance", () => {
    it("complete provenance preserved", () => {
      const result = validateCitationProposal({ chunkId: "CHK-001" }, validContext, mockGenerateId);
      expect(result.provenance?.edition).toBe("12th Ed");
      expect(result.provenance?.chapter).toBe("Chapter 27");
    });

    it("missing page does not cause fabricated page", () => {
      const noPageContext: RetrievalResult[] = [{
        ...validContext[0],
        chunkId: "CHK-NOPAGE",
        provenance: { ...validContext[0].provenance, page: undefined }
      }];
      const result = validateCitationProposal({ chunkId: "CHK-NOPAGE" }, noPageContext, mockGenerateId);
      expect(result.provenance?.page).toBeUndefined();
    });

    it("provenance comes exactly from server-side evidence", () => {
      const result = validateCitationProposal({ chunkId: "CHK-001" }, validContext, mockGenerateId);
      expect(result.provenance).toEqual(validContext[0].provenance);
    });
  });

  describe("PYQ Authenticity", () => {
    it("UNVERIFIED preserved and cannot be upgraded by model output", () => {
      // LLM tries to claim it's AUTHENTIC
      const proposal: any = { chunkId: "CHK-002", pyqAuthenticity: "AUTHENTIC" };
      const result = validateCitationProposal(proposal, validContext, mockGenerateId);
      
      expect(result.status).toBe("VALID");
      expect(result.provenance?.pyqAuthenticity).toBe("UNVERIFIED");
    });
  });

  describe("processCitations helper", () => {
    it("filters invalid citations and returns valid CitationRecords", () => {
      const proposals: CitationProposal[] = [
        { chunkId: "CHK-001" }, // Valid
        { chunkId: "CHK-999" }, // Invalid
        { chunkId: "CHK-002" }  // Valid
      ];
      
      const records = processCitations(proposals, validContext, mockGenerateId);
      expect(records).toHaveLength(2);
      expect(records[0].citationId).toBe("CIT-1");
      expect(records[0].chunkId).toBe("CHK-001");
      expect(records[1].citationId).toBe("CIT-2");
      expect(records[1].chunkId).toBe("CHK-002");
    });
  });
});
