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
  console.log("🔥 NEW PROMPT ACTIVE");
  try {
    const { messages, mode } = req.body;
    console.log("MODE RECEIVED:", mode);

    let systemPrompt = "";

    if (mode && mode.toLowerCase() === "quiz") {
      systemPrompt = `
You are NurseAI.

The user is in QUIZ mode.

IMPORTANT:
- IGNORE the user's wording
- DO NOT explain anything
- ONLY generate MCQs

Create exactly 3 MCQs.

Format strictly:

🩺 Topic: <topic>

❓ Question 1:
A. ...
B. ...
C. ...
D. ...
✅ Answer: ...

❓ Question 2:
...

❓ Question 3:
...

DO NOT add explanations.
`;
    } else if (mode && mode.toLowerCase() === "summary") {
      systemPrompt = `
You are NurseAI.

The user is in SUMMARY mode.

IMPORTANT:
- IGNORE detailed explanations
- DO NOT explain
- ONLY give short revision points

Format:

🩺 Topic: <topic>

⚡ Summary:
• Point 1
• Point 2
• Point 3
`;
    } else {
     systemPrompt = `
You are NurseAI.

The user is in EXPLAIN mode.

Provide structured clinical explanation.

Format:

🩺 Topic:
📌 Definition:
⚠️ Causes:
🧪 Signs & Symptoms:
💊 Nursing Management:
🚨 Red Flags:

Rules:
- No markdown
- Short bullet points
`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      max_tokens: 250, // 🔥 Prevent long outputs
     messages: [
  {
    role: "system",
    content: systemPrompt
  },
  ...messages
]
    });

    // ✅ CLEAN RESPONSE (VERY IMPORTANT)
    let aiText = response.choices[0].message.content;

    aiText = aiText
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/\*/g, "")
      .trim();

    // ✅ SEND CLEAN RESPONSE
    res.json({
      answer: aiText
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));