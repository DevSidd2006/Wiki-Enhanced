import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function callGroq(prompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "llama-3.1-8b-instant",
      "messages": [
        {
          "role": "user",
          "content": prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { articleTitle, articleText, numQuestions, difficulty, questionType, focus, language } = req.body;
    if (!articleTitle || !articleText || !numQuestions) return res.status(400).json({ error: 'Missing required fields' });
    
    // Build dynamic prompt based on user preferences
    let prompt = `Based on this Wikipedia article about "${articleTitle}":\n\n${articleText}\n\n`;
    
    // Add difficulty level
    let difficultyInstruction = '';
    switch (difficulty) {
      case 'easy':
        difficultyInstruction = 'Generate easy questions that test basic recall and understanding.';
        break;
      case 'medium':
        difficultyInstruction = 'Generate medium difficulty questions that require some understanding of the content. Include questions about relationships and explanations.';
        break;
      case 'hard':
        difficultyInstruction = 'Generate challenging questions that require deep understanding, analysis, and connections between different concepts.';
        break;
      default:
        difficultyInstruction = 'Generate questions of appropriate difficulty for the content.';
    }
    
    // Add question type
    let questionTypeInstruction = '';
    switch (questionType) {
      case 'multiple-choice':
        questionTypeInstruction = `Generate ${numQuestions} multiple-choice questions with 4 options each (A, B, C, D) and indicate the correct answer.`;
        break;
      case 'true-false':
        questionTypeInstruction = `Generate ${numQuestions} true/false questions and indicate the correct answer.`;
        break;
      case 'fill-blank':
        questionTypeInstruction = `Generate ${numQuestions} fill-in-the-blank questions with the missing word(s) clearly indicated.`;
        break;
      case 'short-answer':
        questionTypeInstruction = `Generate ${numQuestions} short answer questions that require 1-2 sentence responses.`;
        break;
      case 'mixed':
        questionTypeInstruction = `Generate ${numQuestions} questions using a mix of multiple-choice, true/false, and fill-in-the-blank formats.`;
        break;
      default:
        questionTypeInstruction = `Generate ${numQuestions} multiple-choice questions with 4 options each and the correct answer.`;
    }
    
    // Add focus area
    let focusInstruction = '';
    if (focus && focus !== 'general') {
      focusInstruction = `Focus specifically on: ${focus}. `;
    }
    
    // Add language preference
    let languageInstruction = '';
    if (language && language !== 'english') {
      languageInstruction = `Generate all questions and answers in ${language}. `;
    }
    
    // Combine all instructions
    prompt += `${difficultyInstruction}\n\n${questionTypeInstruction}\n\n${focusInstruction}${languageInstruction}`;
    
    // Add formatting instructions
    if (questionType === 'multiple-choice' || questionType === 'mixed') {
      prompt += `\nFormat each multiple-choice question as:
Q1: [Question]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Answer: [Correct letter]
Explanation: [Brief reason why the answer is correct]

`;
    }
    
    if (questionType === 'true-false' || questionType === 'mixed') {
      prompt += `\nFormat each true/false question as:
Q1: [Statement]
Answer: True/False
Explanation: [Brief reason why the answer is correct]

`;
    }
    
    if (questionType === 'fill-blank' || questionType === 'mixed') {
      prompt += `\nFormat each fill-in-the-blank question as:
Q1: [Statement with ______ for missing word(s)]
Answer: [Correct word(s)]
Explanation: [Brief reason why this is the correct answer]

`;
    }
    
    if (questionType === 'short-answer') {
      prompt += `\nFormat each short answer question as:
Q1: [Question]
Answer: [Expected answer in 1-2 sentences]
Explanation: [Brief justification for this answer]

`;
    }
    
    prompt += `\n(Repeat for each question)
    
IMPORTANT: For each question, provide a concise "Explanation:" that helps the user understand why the answer is correct. This will be used for learning and review purposes.`;

  const questions = await callGroq(prompt);    return res.status(200).json({ 
      questions,
      metadata: {
        difficulty: difficulty || 'medium',
        questionType: questionType || 'multiple-choice',
        focus: focus || 'general',
        language: language || 'english',
        numQuestions: numQuestions
      }
    });
  } catch (error) {
  console.error("Groq API Error (Quiz):", error);
    return res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
  }
}
