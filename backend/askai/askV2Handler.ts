import OpenAI from "openai";
import { processCitations } from "./validation.ts";
import { hasAuthorizedClinicalEvidence } from "./mockRetrieval.ts";
import { ResponseEnvelope, CompletionState, CitationProposal, RetrievalResult } from "./contracts.ts";

function calculateTokenBudget(mode: string, contextSizeTokens: number): number {
  const safetyBuffer = 150;
  let modeBaseline = 0;
  if (mode === "quiz") {
    modeBaseline = 600;
  } else if (mode === "fullAnswer") {
    modeBaseline = 1500;
  } else if (mode === "clinicalReference") {
    modeBaseline = 500;
  } else {
    modeBaseline = 600; // summary
  }
  return modeBaseline + contextSizeTokens + safetyBuffer;
}

export const createAskV2Route = (
  openai: OpenAI, 
  getRetrievalContext: () => RetrievalResult[] = () => [] // Defaults to empty for live production route
) => async (req: any, res: any) => {
  try {
    const { messages, mode } = req.body;
    const currentContext = getRetrievalContext();

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages missing" });
    }

    const cleanMessages = messages.filter((msg: any) => msg.content !== "Thinking...");

    const isClinical = mode === "clinicalReference";

    // DETERMINISTIC CLINICAL SAFETY GATE - BEFORE GENERATION
    if (isClinical) {
      if (!hasAuthorizedClinicalEvidence(currentContext)) {
        return res.json({
          answer: "I cannot provide a clinical recommendation because insufficient authorized evidence was retrieved.",
          citations: [],
          isComplete: false,
          completionStatus: "SAFETY_REFUSAL",
          evidenceState: { isAiGenerated: false, missingEvidence: true, safetyState: "UNSAFE" }
        });
      }
    }

    let systemPrompt = "";
    if (mode === "quiz") {
      systemPrompt = `You are NurseAI, generating a Quiz. Generate exactly 5 MCQs. Each MCQ must have exactly 4 options, a correct answer, and an explanation. Do not fabricate facts. Base answers on verified nursing principles.`;
    } else if (mode === "fullAnswer") {
      systemPrompt = `You are NurseAI, an expert clinical nursing tutor. You are generating a Detailed Exam-Oriented Answer. Include only sections supported by the retrieval context. Do not invent missing sections. Use structured format.`;
    } else if (mode === "clinicalReference") {
      systemPrompt = `You are NurseAI, generating a Clinical/Reference response. Provide an exact factual answer based strictly on the provided evidence context. Do not fabricate clinical facts (doses, vitals, scales). If evidence is missing, refuse. Include source attribution. Include safety context.`;
    } else {
      systemPrompt = `You are NurseAI, generating a Quick Revision Summary. Provide a concise summary structured for rapid recall. Include sections like Causes, Signs & Symptoms, Nursing Management, and Red Flags ONLY if supported by evidence.`;
    }

    // Append retrieval context seam
    systemPrompt += `\n\n--- RETRIEVAL CONTEXT (Production Eligible: false) ---\n`;
    let contextSizeTokens = 0; // naive estimation
    currentContext.forEach(chunk => {
      systemPrompt += `[CHUNK: ${chunk.chunkId}] ${chunk.text}\n`;
      contextSizeTokens += chunk.text.split(" ").length * 2;
    });

    const maxTokens = calculateTokenBudget(mode, contextSizeTokens);

    const responseFormatSchema = {
      type: "json_schema" as const,
      json_schema: {
        name: "response_envelope",
        strict: true,
        schema: {
          type: "object",
          properties: {
            answer: { type: "string" },
            citations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  chunkId: { type: "string" }
                },
                required: ["chunkId"],
                additionalProperties: false
              }
            }
          },
          required: ["answer", "citations"],
          additionalProperties: false
        }
      }
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.3,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        ...cleanMessages.slice(-6)
      ],
      response_format: responseFormatSchema,
    });

    const finishReason = response.choices[0].finish_reason;
    const aiText = response.choices[0].message.content || "";

    let parsed: { answer: string, citations: CitationProposal[] };
    let completionStatus: CompletionState = "COMPLETE";
    
    try {
      parsed = JSON.parse(aiText);
      if (!parsed.citations || !Array.isArray(parsed.citations)) {
        parsed.citations = [];
        completionStatus = "MALFORMED_JSON";
      }
    } catch (e) {
      completionStatus = "MALFORMED_JSON";
      return res.json({
        answer: "Failed to parse generated JSON.",
        citations: [],
        isComplete: false,
        completionStatus,
        evidenceState: { isAiGenerated: true, missingEvidence: false, safetyState: "SAFE" }
      });
    }

    if (finishReason === "length") {
      completionStatus = "TRUNCATED_TOKENS";
    }

    // Pass deterministic generateId
    let idCounter = 1;
    const validCitations = processCitations(parsed.citations, currentContext, () => Date.now().toString() + "-" + (idCounter++));

    if (parsed.citations.length > 0 && validCitations.length === 0) {
      completionStatus = "MISSING_CITATION";
    }

    const envelope: ResponseEnvelope = {
      answer: parsed.answer,
      citations: validCitations,
      isComplete: completionStatus === "COMPLETE",
      completionStatus,
      evidenceState: {
        isAiGenerated: true,
        missingEvidence: false,
        safetyState: "SAFE"
      }
    };

    res.json(envelope);
  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
