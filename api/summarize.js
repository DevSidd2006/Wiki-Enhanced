import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { text, articleText, summaryType, length, focus, language, comprehensiveMode } = req.body;
    const contentToSummarize = text || articleText;
    if (!contentToSummarize) return res.status(400).json({ error: 'Missing required field: text or articleText' });
    
    // Validate and normalize comprehensiveMode
    const validComprehensiveModes = ['standard', 'comprehensive', 'exhaustive'];
    const normalizedMode = validComprehensiveModes.includes(comprehensiveMode) ? comprehensiveMode : 'standard';
    
    // Build optimized prompt for summarization
    let prompt = `You are an expert summarizer. Create a ${normalizedMode} summary capturing key information.

CORE REQUIREMENTS:
- Include all important facts, dates, names, and concepts
- Preserve logical flow and relationships
- Maintain accuracy and original meaning
- Include specific details, data, and evidence
`;

    // Add format instructions with validation
    const formatInstructions = {
      'bullet': 'FORMAT: Use hierarchical bullet points (• for main, ○ for sub-points)',
      'paragraph': 'FORMAT: Well-structured paragraphs with clear topic sentences',
      'structured': `FORMAT: Use this structure:
📝 Summary
[Topic]: Brief Overview

[Category Heading]
• Key Point: Details
○ Sub-detail
`,
      'timeline': 'FORMAT: Chronological timeline with dates and events',
      'keypoints': 'FORMAT: Focus on main themes with detailed explanations'
    };
    
    if (summaryType) {
      const formatInstruction = formatInstructions[summaryType] || formatInstructions['paragraph'];
      prompt += `\n${formatInstruction}\n`;
    }

    // Add length guidance with validation
    const lengthGuide = {
      'brief': 'LENGTH: Brief (1 paragraph, essential points only)',
      'short': 'LENGTH: Short (1-2 paragraphs)',
      'medium': 'LENGTH: Medium (3-5 paragraphs)',
      'detailed': 'LENGTH: Detailed (comprehensive coverage)'
    };
    
    if (length) {
      const lengthInstruction = lengthGuide[length] || lengthGuide['medium'];
      prompt += `${lengthInstruction}\n`;
    }

    // Add focus area
    if (focus && focus !== 'general') {
      prompt += `FOCUS: Emphasize "${focus}" aspects while maintaining overall completeness.\n`;
    }

    // Add language preference
    if (language && language !== 'english') {
      prompt += `LANGUAGE: Provide summary in ${language}, preserving technical terms and proper nouns.\n`;
    }

    // Add HTML formatting instructions
    prompt += `
OUTPUT FORMAT:
- Use simple HTML tags: <h2>, <h3>, <strong>, <em>, <ul>, <li>
- NO Markdown syntax (no ##, **, etc.)
- Break long paragraphs (max 5-7 sentences)
- Use clear structure with headings and lists

TEXT TO SUMMARIZE:
${contentToSummarize}

Begin your summary now:`;

    // Make request to Groq API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    let response;
    try {
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 2000
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return res.status(408).json({ 
          error: 'Request timeout. The request took too long to complete.',
          details: 'Request timed out after 30 seconds'
        });
      }
      throw fetchError;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', response.status, errorData);
      
      if (response.status === 429) {
        return res.status(429).json({ 
          error: 'API rate limit reached. Please try again in a moment.',
          details: 'Too many requests'
        });
      } else if (response.status === 401) {
        return res.status(500).json({ 
          error: 'API configuration error. Please contact support.',
          details: 'Authentication failed'
        });
      } else {
        return res.status(500).json({ 
          error: 'Summarization service temporarily unavailable. Please try again.',
          details: errorData.error?.message || 'Unknown error'
        });
      }
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content;

    if (!summary) {
  console.error('Invalid Groq response:', data);
      return res.status(500).json({ 
        error: 'Failed to generate summary. Please try again.',
        details: 'Invalid response format'
      });
    }

    return res.status(200).json({ 
      summary,
      metadata: {
        type: summaryType || 'comprehensive',
        length: length || 'detailed',
        focus: focus || 'general',
        language: language || 'english',
        comprehensive: true,
        comprehensiveMode: comprehensiveMode || 'standard',
        detailLevel: 'maximum',
        informationRetention: comprehensiveMode === 'exhaustive' ? '100%' : comprehensiveMode === 'comprehensive' ? '95-100%' : '90%+'
      }
    });
  } catch (error) {
  console.error("Groq API Error (Summarize):", error);
    
    if (error.name === 'AbortError') {
      return res.status(408).json({ 
        error: 'Request timeout. Please try again with shorter text.',
        details: 'Request took too long'
      });
    }
    
    return res.status(500).json({ 
      error: 'Summarization service error. Please try again.',
      details: error.message 
    });
 
  }
}
