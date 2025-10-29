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
    
    // Build comprehensive prompt for detailed summarization
    let prompt = `You are an expert summarizer with exceptional attention to detail. Your task is to create a comprehensive summary that captures ALL important information from the provided text without missing any significant details.

CRITICAL SUMMARIZATION REQUIREMENTS:
- Read the entire text thoroughly and identify ALL key information
- Include ALL important facts, figures, dates, names, and concepts
- Preserve the logical flow and relationships between ideas
- Maintain accuracy and avoid any distortion of information
- Include specific details, examples, and supporting evidence
- Cover both main themes and important subtopics
- Ensure no critical information is omitted
- Use precise language and maintain the original meaning
- Include quantitative data, statistics, and measurements when present
- Capture nuances, implications, and contextual information

COMPREHENSIVE ANALYSIS REQUIREMENTS:
1. Main topic and central thesis with full context
2. ALL key persons, places, dates, and events with details
3. ALL important facts, statistics, and data points
4. ALL cause-and-effect relationships and connections
5. ALL significant details and supporting evidence
6. ALL conclusions, implications, and outcomes
7. ALL specialized terminology and technical concepts
8. ALL historical context and background information
9. ALL achievements, milestones, and developments
10. ALL controversies, challenges, or limitations mentioned

`;

    // Add comprehensive mode enhancement
    if (comprehensiveMode) {
      switch (comprehensiveMode) {
        case 'comprehensive':
          prompt += `COMPREHENSIVENESS LEVEL: COMPREHENSIVE
- Ensure 95-100% information retention from the original text
- Include ALL major and minor important details
- Capture context, implications, and significance
- Maintain complete factual accuracy
- Include supporting examples and evidence
- Cover all aspects mentioned in the original text

`;
          break;
        case 'exhaustive':
          prompt += `COMPREHENSIVENESS LEVEL: EXHAUSTIVE
- Ensure 100% information retention - miss NOTHING important
- Include every significant detail, fact, and concept
- Capture every relationship, connection, and implication
- Include ALL numerical data, dates, and specific information
- Cover every aspect, subtopic, and related element
- Maintain absolute fidelity to the original content
- Include context, background, and detailed explanations

`;
          break;
        default:
          prompt += `COMPREHENSIVENESS LEVEL: STANDARD COMPREHENSIVE
- Ensure high information retention (90%+) from the original text
- Include all major details and most minor important details
- Capture key relationships and implications
- Maintain accuracy while being thorough

`;
      }
    }

    // Add summary type specifications with enhanced detail requirements
    if (summaryType) {
      switch (summaryType) {
        case 'bullet':
          prompt += `FORMAT: Present the comprehensive summary as detailed bullet points:
- Use hierarchical bullet points (main points and comprehensive sub-points)
- Each bullet should contain specific, detailed information with context
- Include ALL important facts, figures, examples, and supporting evidence
- Organize logically by topic, importance, or chronology
- Use multiple levels of sub-bullets for complex information
- Include specific dates, numbers, and quantitative data
- Ensure every important aspect is covered in bullet form

`;
          break;
        case 'paragraph':
          prompt += `FORMAT: Present the comprehensive summary in well-structured, detailed paragraphs:
- Each paragraph should focus on a specific aspect with full detail coverage
- Include ALL relevant details, examples, and supporting evidence within each paragraph
- Use clear topic sentences and comprehensive explanations
- Maintain logical flow and detailed transitions between paragraphs
- Include specific data, dates, and contextual information
- Ensure each paragraph is substantive and informative
- Cover all aspects of the original text across paragraphs

`;
          break;
        case 'structured':
          prompt += `FORMAT: Present the comprehensive summary with clear headings and detailed sections using this enhanced structure:

REQUIRED FORMAT STRUCTURE:
📝 Summary
[Main Topic]: Comprehensive Summary

[Primary Category Heading]
• Key Point: Detailed information
• Key Point: Detailed information

[Secondary Category Heading]  
• Key Point: Detailed information
○ Sub-detail with specific context
○ Sub-detail with specific context
• Key Point: Detailed information
○ Sub-detail with specific context

[Additional Category Headings as needed]
• Comprehensive details with context
• Include ALL relevant facts, dates, names, numbers
• Provide explanations and implications

EXAMPLE FORMAT (adapt to your content):
📝 Summary
John Smith: Comprehensive Summary

Biographical Overview
• Identity: American scientist and researcher
• Position: Professor of Biology at University

Professional Background
• Education: PhD in Biology from Harvard University (1985)
○ Specialized in molecular genetics
○ Dissertation on cellular metabolism
• Career: 30+ years in academic research
○ Published 150+ peer-reviewed papers
○ Led groundbreaking studies on gene expression

Major Contributions
• Research Focus: Genetic engineering applications
○ Developed new CRISPR techniques (2010-2015)
○ Advanced understanding of DNA repair mechanisms
• Awards: Nobel Prize recipient (2020)
○ Recognition for contributions to genetic medicine
○ International acclaim for breakthrough discoveries

Use this exact format:
- Start with "📝 Summary" emoji and heading
- Use descriptive main headings for major topics
- Use bullet points (•) for main points under each heading  
- Use circle bullets (○) for sub-details and elaborations
- Include comprehensive, detailed content under each heading
- Cover ALL aspects of the original text with appropriate headings
- Use subheadings for complex topics and detailed breakdowns
- Include specific details, examples, data, and context in each section
- Ensure logical organization and complete coverage
- Make each section substantive and informative
- Organize information hierarchically from general to specific

`;
          break;
        case 'timeline':
          prompt += `FORMAT: Present the comprehensive summary as a detailed chronological timeline:
- Include ALL dates, events, and temporal relationships with full context
- Provide comprehensive details and context for each timeline entry
- Cover both major milestones and important intermediate events
- Include cause-and-effect relationships between events with explanations
- Add relevant background information and implications for each time period
- Include specific details about what happened, when, where, and why
- Ensure complete chronological coverage of the content

`;
          break;
        case 'keypoints':
          prompt += `FORMAT: Present the comprehensive summary focusing on key points with exhaustive details:
- Identify and elaborate comprehensively on ALL major themes and concepts
- Include detailed explanations, context, and implications for each key point
- Provide ALL supporting evidence, examples, and data for each point
- Cover both primary and secondary important points with full detail
- Include relevant context, background, and significance for each point
- Ensure no important concept or theme is missed
- Provide comprehensive analysis and explanation for each key area

`;
          break;
        default:
          prompt += `FORMAT: Present a comprehensive summary with complete coverage:
- Use clear, logical organization with detailed explanations
- Include ALL important information and supporting details
- Maintain the original meaning and context with full accuracy
- Provide specific examples, data, and evidence throughout
- Ensure complete coverage of all topics and subtopics
- Include contextual information and implications

`;
      }
    }

    // Add enhanced length specifications with emphasis on completeness
    if (length) {
      switch (length) {
        case 'brief':
          prompt += `LENGTH: Brief but comprehensive (focus on the most critical information):
- Capture ALL essential core information without omission
- Include key facts, figures, main conclusions, and critical details
- Prioritize the most important information while maintaining accuracy
- Ensure no critical information is lost despite brevity
- Include specific data and key examples
- Cover all main themes concisely but completely

`;
          break;
        case 'short':
          prompt += `LENGTH: Short but thorough (1-2 substantial paragraphs):
- Cover ALL main topics and themes with important details
- Include significant supporting details and examples
- Maintain comprehensive coverage within space constraints
- Focus on key facts, conclusions, implications, and context
- Include specific data and important relationships
- Ensure complete coverage of essential information

`;
          break;
        case 'medium':
          prompt += `LENGTH: Medium-length comprehensive summary (3-5 detailed paragraphs):
- Provide detailed coverage of ALL major topics and themes
- Include specific examples, facts, data, and comprehensive supporting evidence
- Cover both primary and secondary themes with full detail
- Maintain thorough analysis, explanation, and context
- Include ALL important relationships and implications
- Ensure comprehensive coverage without omitting important details

`;
          break;
        case 'detailed':
          prompt += `LENGTH: Detailed comprehensive summary (extensive, complete coverage):
- Provide exhaustive coverage of ALL content and information
- Include ALL important facts, figures, examples, details, and context
- Cover every significant aspect, topic, and subtopic comprehensively
- Maintain complete fidelity to the original information
- Include ALL specialized terminology, technical details, and nuances
- Provide comprehensive analysis, explanation, and contextual information
- Ensure absolute completeness - miss nothing important

`;
          break;
        default:
          prompt += `LENGTH: Comprehensive summary with appropriate detail level:
- Cover ALL important aspects thoroughly with full detail
- Include ALL relevant supporting information and context
- Maintain balance between completeness and readability
- Ensure no significant information is omitted
- Include specific examples, data, and detailed explanations

`;
      }
    }

    // Add enhanced focus area with comprehensive coverage
    if (focus && focus !== 'general') {
      prompt += `FOCUS AREA: While maintaining comprehensive coverage, emphasize "${focus}" aspects:
- Prioritize and provide exhaustive detail on information related to ${focus}
- Include ALL relevant details, context, and implications in this focus area
- Provide comprehensive background and contextual information
- Cover ALL related subtopics, examples, and supporting evidence
- Maintain overall completeness while giving special attention to focus area
- Include specific details, data, and examples related to ${focus}
- Ensure comprehensive coverage of the focus area without missing details

`;
    }

    // Add language preference
    if (language && language !== 'english') {
      prompt += `LANGUAGE: Provide the comprehensive summary in ${language}:
- Maintain ALL technical terms and proper nouns accurately
- Preserve the complete meaning and nuance of the original content
- Use appropriate ${language} terminology and style
- Ensure complete information transfer across languages
- Include ALL details and context in the target language
- Maintain the comprehensive nature of the summary

`;
    }

    // Add final enhanced instructions
    prompt += `FINAL CRITICAL INSTRUCTIONS:
- Take sufficient time to analyze the content thoroughly and comprehensively
- Double-check that NO important information is missed or omitted
- Ensure absolute accuracy and completeness in your summary
- Maintain the original context, meaning, and all important details
- Be comprehensive rather than concise - completeness is the priority
- Include ALL supporting evidence, examples, and contextual information
- Verify that all key concepts, facts, and relationships are covered
- Ensure the summary serves as a complete substitute for the original text

FORMATTING INSTRUCTIONS:
- Use simple HTML tags for structure.
- Use <h2> for main headings and <h3> for subheadings.
- Use <strong> for bold text and <em> for italics.
- Use <ul> and <li> for bullet points.
- Do NOT use Markdown syntax like '##' or '**'.
- Avoid long, unbroken paragraphs of more than 5-7 sentences.
- Do not use complex or nested sentence structures unless necessary.
- Break down information into scannable chunks for better readability.
- Use clear topic sentences and logical paragraph organization.
- Include proper spacing between sections and concepts.
- Structure content with appropriate headings to guide the reader.
- Make lists when presenting multiple related items or concepts.
- Use emphasis (bold/italics) strategically to highlight key information.

READABILITY ENHANCEMENT:
1. Leverage User-Facing Options for Readability and Quality:
   - Structure content based on the summary type for optimal scanning
   - Break information into digestible sections with clear headings
   - Use bullet points for lists of facts, features, or key points
   - Emphasize important terms and concepts with <strong> tags
   
2. Enhanced Frontend Rendering Considerations:
   - Output clean HTML that renders properly without additional parsing
   - Use semantic HTML tags that work well with CSS styling
   - Ensure proper hierarchy with heading levels (h2, h3)
   - Include spacing elements naturally in the content structure
   - Make quotations stand out with proper HTML formatting

TEXT TO SUMMARIZE:
${contentToSummarize}


Begin your comprehensive, detailed summary now:`;

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
