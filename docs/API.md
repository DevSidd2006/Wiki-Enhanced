# API Documentation

This document describes the available API endpoints for Wikipedia Enhanced.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All API endpoints require a valid `GEMINI_API_KEY` to be set in the environment variables.

## Endpoints

### 1. Article Summarizer

**Endpoint:** `POST /api/summarize`

**Description:** Generate AI-powered summaries of Wikipedia articles.

**Request Body:**
```json
{
  "title": "Article Title",
  "text": "Article content...",
  "summaryType": "quick|detailed|academic|creative|comprehensive|exhaustive",
  "summaryLength": "short|medium|long",
  "summaryFocus": "main_points|historical|scientific|cultural|recent_developments",
  "summaryLanguage": "english|spanish|french|german|chinese|japanese|arabic|russian|portuguese|italian"
}
```

**Response:**
```json
{
  "summary": "Generated summary text...",
  "metadata": {
    "type": "detailed",
    "length": "medium",
    "focus": "main_points",
    "language": "english"
  }
}
```

### 2. Q&A System

**Endpoint:** `POST /api/qa`

**Description:** Ask questions about Wikipedia articles or general topics.

**Request Body:**
```json
{
  "question": "Your question here",
  "chatMode": "general|wikipedia",
  "context": "Article content for context (optional)",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "answer": "AI-generated answer...",
  "mode": "wikipedia",
  "hasContext": true
}
```

### 3. Quiz Generator

**Endpoint:** `POST /api/quiz`

**Description:** Generate interactive quizzes from Wikipedia articles.

**Request Body:**
```json
{
  "title": "Article Title",
  "text": "Article content...",
  "numQuestions": 5,
  "difficulty": "easy|medium|hard",
  "questionType": "multiple_choice|true_false|mixed",
  "focus": "general|specific_facts|dates|people|concepts",
  "language": "english|spanish|french|german|chinese|japanese|arabic|russian|portuguese|italian"
}
```

**Response:**
```json
{
  "quiz": {
    "title": "Quiz Title",
    "questions": [
      {
        "id": 1,
        "question": "Question text?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": 0,
        "explanation": "Why this answer is correct..."
      }
    ]
  },
  "metadata": {
    "difficulty": "medium",
    "questionType": "multiple_choice",
    "focus": "general",
    "language": "english",
    "totalQuestions": 5
  }
}
```

### 4. News API

**Endpoint:** `GET /api/news`

**Description:** Fetch latest world news with filtering options.

**Query Parameters:**
- `category`: general|business|technology|entertainment|health|science|sports
- `country`: us|uk|ca|au|in|de|fr|jp|cn|ru|br|mx|es|it|nl|se|no|dk
- `pageSize`: Number of articles to return (default: 10)

**Response:**
```json
{
  "articles": [
    {
      "title": "News headline",
      "description": "Article description",
      "url": "https://example.com/article",
      "source": "News Source",
      "publishedAt": "2025-07-07T12:00:00Z",
      "urlToImage": "https://example.com/image.jpg"
    }
  ],
  "source": "newsapi|mock",
  "totalResults": 100
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (missing required parameters)
- `401`: Unauthorized (invalid API key)
- `500`: Internal Server Error

Error responses include a descriptive message:

```json
{
  "error": "Error description",
  "details": "Additional error details"
}
```

## Rate Limiting

API endpoints may be rate-limited based on the underlying service providers:

- **Gemini AI**: Follow Google's rate limits
- **NewsAPI**: 1,000 requests per day on free tier

## CORS

All endpoints support CORS with the following headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET,POST,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## Examples

### Generate a Quiz

```bash
curl -X POST http://localhost:3000/api/quiz \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Albert Einstein",
    "text": "Albert Einstein was a German-born theoretical physicist...",
    "numQuestions": 5,
    "difficulty": "medium"
  }'
```

### Get Latest News

```bash
curl "http://localhost:3000/api/news?category=technology&country=us&pageSize=5"
```

### Ask a Question

```bash
curl -X POST http://localhost:3000/api/qa \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is quantum physics?",
    "chatMode": "general"
  }'
```
