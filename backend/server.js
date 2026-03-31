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
    const { question } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a helpful nursing tutor." },
        { role: "user", content: question }
      ]
    });

    res.json({
      answer: response.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));