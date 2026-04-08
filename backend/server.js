import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();
console.log("Server started...");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/ask", async (req, res) => {
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
Create 3 MCQs for nursing students.

Format:
Question + 4 options + correct answer.
No extra explanation.
`;
    } else if (mode === "summary") {
      systemPrompt = `
Give short revision notes in bullet points.
`;
    } else {
      systemPrompt = `
You are NurseAI, a clinical nursing assistant.

The topic is ALWAYS medical unless user says otherwise.

Always respond in STRICT format:

🩺 Topic:
📌 Definition:
⚠️ Causes:
🧪 Signs & Symptoms:
💊 Nursing Management:
🚨 Red Flags:

Rules:
- Assume BP = Blood Pressure (medical)
- Do NOT give multiple meanings
- Do NOT explain unrelated contexts
- Keep answers SHORT and structured
- Use bullet points only
- No markdown symbols (**, ###, etc.)
- Focus only on latest question using previous context
`;
    }

    const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 200,
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