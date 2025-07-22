import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function callOpenRouter(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Wikipedia Enhanced",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "deepseek/deepseek-r1:free",
      "messages": [
        {
          "role": "user",
          "content": prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

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
    
    // Create different prompts based on mode
    let prompt;
    
    if (chatMode === 'general') {
      // Enhanced general AI chatbot mode with structured markdown output
      prompt = `You are a helpful and knowledgeable AI assistant. Your goal is to provide clear, accurate, and easy-to-understand answers.

**Instructions for your response:**
1. **Directly Answer:** Start with a direct answer to the user's question.
2. **Explain Simply:** Break down complex topics into simple, digestible points. Use analogies if helpful.
3. **Use Markdown:** Structure your answer with Markdown for readability.
   * Use headings (\`##\`, \`###\`) for different sections.
   * Use bullet points (\`*\` or \`-\`) for lists.
   * Use bold text (\`**text**\`) to highlight key terms.
4. **Provide Examples:** If the topic allows, include a relevant example to illustrate your point.
5. **Be Conversational:** Maintain a friendly, engaging tone while being informative.

**Question:** ${question}

**Answer:**`;
    } else if (context) {
      // Enhanced context-aware mode with structured markdown output
      prompt = `You are an expert AI assistant tasked with answering questions based on the provided context and your knowledge.

**Instructions for your response:**
1. **Synthesize, Don't Copy:** Your primary goal is to synthesize information from the context to form a clear answer. Avoid quoting long passages directly.
2. **Use Markdown:** Structure your answer with Markdown for readability (headings, bullet points, bold text).
3. **Structure the Answer:**
   * **Direct Answer:** Begin with a concise, direct answer.
   * **Key Points:** Follow up with a bulleted list of the most important details from the context that support your answer.
   * **Additional Context:** If helpful, add relevant information from your general knowledge.
4. **Cite Information:** When using specific information from the context, mention "according to the article" or similar phrasing.
5. **Be Comprehensive:** Provide a thorough answer that fully addresses the question.

**Context:** """${context}"""

**Question:** ${question}

**Answer:**`;
    } else {
      // Enhanced default mode with structured markdown output
      prompt = `You are a knowledgeable AI assistant. Provide a comprehensive and well-structured answer to the following question.

**Instructions for your response:**
1. **Direct Answer:** Start with a clear, direct answer to the question.
2. **Use Markdown:** Structure your response with proper Markdown formatting:
   * Use headings (\`##\`, \`###\`) to organize sections.
   * Use bullet points (\`*\` or \`-\`) for lists.
   * Use bold text (\`**text**\`) for emphasis.
3. **Explain Thoroughly:** Provide detailed explanations with examples when helpful.
4. **Ensure Accuracy:** Make sure all information is factually correct and up-to-date.

**Question:** ${question}

**Answer:**`;
    }

    const answer = await callOpenRouter(prompt);

    return res.status(200).json({ answer });
  } catch (error) {
    console.error("OpenRouter Error:", error);
    return res.status(500).json({
      error: "Failed to get response from AI service",
      details: error.message,
    });
  }
}
