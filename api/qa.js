import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Missing question" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(question);
    const response = await result.response;
    const text = await response.text();

    return res.status(200).json({ answer: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({
      error: "Failed to get response from Gemini",
      details: error.message,
    });
  }
}
