import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";
import admin from "firebase-admin";

dotenv.config();

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized with FIREBASE_SERVICE_ACCOUNT");
  } catch (err) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", err);
    admin.initializeApp();
  }
} else {
  admin.initializeApp();
  console.log("Firebase Admin initialized with default credentials");
}

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
console.log("Server started...");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/ask", verifyToken, async (req, res) => {
  try {
    const { messages, mode } = req.body;

    // ✅ Safety check
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages missing" });
    }

    // ✅ Remove "Thinking..."
    const cleanMessages = messages.filter(
      (msg) => msg.content !== "Thinking..."
    );

    let systemPrompt = "";

    if (mode === "quiz") {
      systemPrompt = `
Create 5 MCQs for nursing students.

Format:
Question + 4 options + correct answer.
No extra explanation.
`;
    } else if (mode === "fullAnswer") {
      systemPrompt = `
You are NurseAI, an expert clinical nursing tutor.
You are generating a Detailed Exam-Oriented Answer for a university/BSc nursing exam (10-15 marks).

Always respond in STRICT format. Leave an empty line between each section.
Start your response exactly with this header:
## 📝 Full Answer Mode

### Definition
[detailed paragraph]

### Etiology & Pathophysiology
[detailed explanation]

### Clinical Manifestations
[detailed bullet points]

### Diagnostic Evaluation
[detailed points]

### Medical Management
[detailed points]

### Nursing Management
[detailed step-by-step interventions]

### Complications
[detailed points]

### Conclusion
[summary paragraph]

---

## ⚡ Rapid Revision
- [key point 1]
- [key point 2]
- [key point 3]

## 🧠 Exam Tip
[e.g., 'Important NORCET revision topic' or 'Focus on nursing interventions']

_AI-generated educational support. Verify with standard nursing references when required._

Rules:
- REQUIRED: Use nursing-focused language, prioritize nursing management, use short paragraphs, use bullet points (-), keep mobile readability, include exam-writing structure.
- FORBIDDEN: giant essay paragraphs, vague AI fluff, motivational filler, fabricated statistics, unnecessary MBBS-level depth.
- Topic-Specific Rules:
  - Pharmacology: emphasize mechanism, side effects, nursing considerations.
  - Obstetrics: emphasize maternal/fetal complications, nursing management.
  - Medical Surgical: emphasize pathophysiology, assessment, interventions.
- Be concise but complete. Do not generate an infinite wall of text.
`;
    } else {
      // Default to summary mode
      systemPrompt = `
You are NurseAI, an expert clinical nursing tutor.
You are generating a Quick Revision Summary for NORCET preparation.

Always respond in STRICT format. Leave an empty line between each section.
Start your response exactly with this header:
## 📘 Summary Mode

### 🩺 Topic
[content]

### 📌 Definition
[concise bullet point]

### ⚠️ Causes
[concise bullet points]

### 🧪 Signs & Symptoms
[concise bullet points]

### 💊 Nursing Management
[concise bullet points]

### 🚨 Red Flags
[concise bullet points]

---

_AI-generated educational support. Verify with standard nursing references when required._

Rules:
- Keep everything highly concise, mobile-friendly, and highly structured for rapid recall.
- Use short bullet points (-).
- No giant paragraphs.
`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.3,
      max_tokens: 1500,
      messages: [
        { role: "system", content: systemPrompt },
        ...cleanMessages.slice(-6)
      ]
    });

    let aiText = response.choices[0].message.content.trim();

    res.json({ answer: aiText });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
import { createAskV2Route } from "./askai/askV2Handler.ts";

app.post("/ask-v2", verifyToken, createAskV2Route(openai));

app.listen(3000, () => console.log("Server running on port 3000"));