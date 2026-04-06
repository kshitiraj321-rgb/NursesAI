import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();
console.log("Server started...");

const app = express();
app.use(cors());
app.use(express.json());
const cleanMessages = messages.filter(
  (msg) => msg.content !== "Thinking..."
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/ask", async (req, res) => {
  try {
    console.log("🔥 NEW PROMPT ACTIVE");

    const { messages, mode } = req.body;

    // ✅ SAFE FALLBACK (VERY IMPORTANT)
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages missing" });
    }

    // ✅ REMOVE "Thinking..."
    const cleanMessages = messages.filter(
      (msg) => msg.content !== "Thinking..."
    );

    let systemPrompt = "";

    if (mode === "quiz") {
      systemPrompt = `
Create 3 MCQs for nursing students.
Clean format. No markdown.
`;
    } else if (mode === "summary") {
      systemPrompt = `
Give short revision notes.
`;
    } else {
      systemPrompt = `
Provide structured nursing explanation:
Definition, Causes, Symptoms, Management.
No markdown.
`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        ...cleanMessages
      ]
    });

    let aiText = response.choices[0].message.content;

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