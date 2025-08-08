import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test ruta
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// AI generate ruta
app.post("/generate", async (req, res) => {
  try {
    const { messageType, isReply, originalMessage, userPrompt, tone, style } = req.body;

    const prompt = `
You are an AI assistant that writes messages and emails.

Message type: ${messageType}
Is it a reply: ${isReply ? "yes" : "no"}
Original message: ${originalMessage || ""}
User wants to say: ${userPrompt}
Tone: ${tone}
Output style: ${style}

Format requirements:
- If EMAIL → include greeting, body, and closing/signature.
- If CHAT → write as a short message without greeting or signature unless specified.

Return only the message, no extra explanation.
If style is "sentence by sentence", put each sentence on a new line.
`;

    const completion = await openai.responses.create({
      model: "gpt-4o-mini", // ili gpt-3.5 za free korisnike
      input: prompt,
    });

    res.json({ message: completion.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating message" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
export default app;