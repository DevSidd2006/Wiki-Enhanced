import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { articleTitle, articleText, numQuestions } = req.body;
    if (!articleTitle || !articleText || !numQuestions) return res.status(400).json({ error: 'Missing required fields' });
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Based on this Wikipedia article about "${articleTitle}":\n\n${articleText}\n\nGenerate ${numQuestions} multiple-choice questions with 4 options each and the correct answer. Format each question as:\nQ1: ...\nA) ...\nB) ...\nC) ...\nD) ...\nAnswer: ...\n(Repeat for each question)`;
    const result = await model.generateContent(prompt);
    const questions = result.response.text();
    return res.status(200).json({ questions });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
  }
}
