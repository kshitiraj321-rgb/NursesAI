import axios from "axios";
import { fetchAskAIV2 } from "../askaiV2.ts";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../../../firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue("mock-token"),
    },
  },
}));

describe("Slice C1 - askaiV2 Adapter", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("[x] valid ResponseEnvelope / COMPLETE state", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        answer: "Valid answer",
        citations: [{ chunkId: "CHK-1", citationId: "CIT-1", provenance: {} }],
        isComplete: true,
        completionStatus: "COMPLETE",
        evidenceState: { isAiGenerated: true, missingEvidence: false, safetyState: "SAFE" },
      },
    });

    const result = await fetchAskAIV2([{ role: "user", content: "Test" }], "fullAnswer");

    expect(result.content).toBe("Valid answer");
    expect(result.apiVersion).toBe("v2");
    expect(result.completionStatus).toBe("COMPLETE");
    expect(result.citations.length).toBe(1);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://nursesai.onrender.com/ask-v2",
      expect.any(Object),
      expect.objectContaining({ headers: { Authorization: "Bearer mock-token" } })
    );
  });

  it("[x] TRUNCATED_TOKENS preserved", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        answer: "Truncated answer",
        citations: [],
        isComplete: false,
        completionStatus: "TRUNCATED_TOKENS",
        evidenceState: { isAiGenerated: true, missingEvidence: false, safetyState: "SAFE" },
      },
    });

    const result = await fetchAskAIV2([], "fullAnswer");
    expect(result.completionStatus).toBe("TRUNCATED_TOKENS");
  });

  it("[x] SAFETY_REFUSAL preserved", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        answer: "Refusal text",
        citations: [],
        isComplete: false,
        completionStatus: "SAFETY_REFUSAL",
        evidenceState: { isAiGenerated: false, missingEvidence: true, safetyState: "UNSAFE" },
      },
    });

    const result = await fetchAskAIV2([], "clinicalReference");
    expect(result.completionStatus).toBe("SAFETY_REFUSAL");
    expect(result.evidenceState.safetyState).toBe("UNSAFE");
  });

  it("[x] INSUFFICIENT_EVIDENCE preserved", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        answer: "Insufficient text",
        citations: [],
        isComplete: false,
        completionStatus: "INSUFFICIENT_EVIDENCE",
        evidenceState: { isAiGenerated: true, missingEvidence: true, safetyState: "UNSAFE" },
      },
    });

    const result = await fetchAskAIV2([], "clinicalReference");
    expect(result.completionStatus).toBe("INSUFFICIENT_EVIDENCE");
  });

  it("[x] MISSING_CITATION preserved", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        answer: "Missing citation text",
        citations: [],
        isComplete: true,
        completionStatus: "MISSING_CITATION",
        evidenceState: { isAiGenerated: true, missingEvidence: false, safetyState: "SAFE" },
      },
    });

    const result = await fetchAskAIV2([], "summary");
    expect(result.completionStatus).toBe("MISSING_CITATION");
  });

  it("[x] malformed envelope rejected", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { invalid: "shape" },
    });
    await expect(fetchAskAIV2([], "summary")).rejects.toThrow("Malformed ResponseEnvelope: missing answer");
  });

  it("[x] missing answer rejected", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { citations: [], completionStatus: "COMPLETE" },
    });
    await expect(fetchAskAIV2([], "summary")).rejects.toThrow("Malformed ResponseEnvelope: missing answer");
  });

  it("[x] unknown completionStatus rejected", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { answer: "Test", citations: [] },
    });
    await expect(fetchAskAIV2([], "summary")).rejects.toThrow("Malformed ResponseEnvelope: missing completionStatus");
  });

  it("[x] citations preserved without client-side authority rewriting", async () => {
    const citationsMock = [{ citationId: "CIT-A", chunkId: "CHK-A", provenance: { sourceId: "SRC-A" } }];
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        answer: "Test",
        citations: citationsMock,
        isComplete: true,
        completionStatus: "COMPLETE",
      },
    });

    const result = await fetchAskAIV2([], "summary");
    expect(result.citations).toEqual(citationsMock); // Preserved exactly as sent by backend
  });

  it("[x] authentication header attached", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        answer: "Test",
        citations: [],
        isComplete: true,
        completionStatus: "COMPLETE",
      },
    });
    await fetchAskAIV2([], "summary");
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      expect.objectContaining({ headers: { Authorization: "Bearer mock-token" } })
    );
  });
});
