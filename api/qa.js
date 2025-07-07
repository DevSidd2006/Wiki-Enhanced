import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { question, context, chatMode } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Missing question" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create different prompts based on mode
    let prompt;
    
    if (chatMode === 'general') {
      // General AI chatbot mode
      prompt = `You are a helpful AI assistant. Provide a comprehensive and accurate answer to the following question:

Question: ${question}

Please provide a detailed answer that:
1. Directly addresses the question
2. Is factually accurate and up-to-date
3. Is well-structured and easy to understand
4. Includes relevant examples or explanations when helpful
5. Is conversational and engaging

Answer:`;
    } else if (context) {
      // Context-aware mode (Wikipedia article or custom context)
      prompt = `Based on the following context and general knowledge, provide a comprehensive and accurate answer to the question:

Context: ${context}

Question: ${question}

Please provide a detailed answer that:
1. Directly addresses the question
2. Uses information from the context when relevant
3. Supplements with additional knowledge when helpful
4. Is clear and well-structured
5. Cites specific information from the context when applicable

Answer:`;
    } else {
      // Default mode
      prompt = `Provide a comprehensive and accurate answer to the following question based on your knowledge:

Question: ${question}

Please provide a detailed answer that:
1. Directly addresses the question
2. Is factually accurate
3. Is well-structured and easy to understand
4. Includes relevant examples or explanations when helpful

Answer:`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ answer: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({
      error: "Failed to get response from Gemini",
      details: error.message,
    });
  }
}
