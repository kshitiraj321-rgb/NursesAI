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
    } else if (mode === "summary") {
      systemPrompt = `
Give concise but comprehensive revision notes in bullet points. Highlight key takeaways.
`;
    } else {
      systemPrompt = `
You are NurseAI, an expert clinical nursing tutor.

The topic is ALWAYS medical unless user says otherwise.

Always respond in STRICT format with an empty line between each section:

🩺 Topic:
[content]

📌 Definition: (Provide a highly detailed, comprehensive explanation here. Do NOT use just a single sentence.)

⚠️ Causes: (List detailed underlying causes or pathophysiology)

🧪 Signs & Symptoms: (Provide comprehensive clinical manifestations)

💊 Nursing Management: (List detailed step-by-step clinical nursing interventions and teaching)

Complications: (List detailed complications)

🚨 Red Flags: (Crucial emergency indicators)

Rules:
- Give thorough, in-depth explanations for every section.
- You MUST leave a blank empty line between sections for readability.
- Keep answers highly detailed but well-structured.
- Use bullet points where appropriate for readability.
- Assume BP = Blood Pressure (medical).
- Do NOT give multiple meanings or unrelated contexts.
- No markdown symbols (**, ###, etc.).
- Focus only on latest question using previous context.
`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.3,
      max_tokens: 1500,
      messages: [
        { role: "system", content: systemPrompt },
        ...cleanMessages.slice(-6) // ✅ memory limit
      ]
    });

    let aiText = response.choices[0].message.content;

    // ✅ Clean formatting
    aiText = aiText
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/\*/g, "")
      .trim();

    res.json({ answer: aiText });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));