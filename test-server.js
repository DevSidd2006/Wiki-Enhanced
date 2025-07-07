import dotenv from 'dotenv';
// Load environment variables FIRST, before any other imports
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Import API handlers
import summarizeHandler from './api/summarize.js';
import qaHandler from './api/qa.js';
import quizHandler from './api/quiz.js';
import newsHandler from './api/news.js';

// API routes
app.use('/api/summarize', (req, res) => summarizeHandler(req, res));
app.use('/api/qa', (req, res) => qaHandler(req, res));
app.use('/api/quiz', (req, res) => quizHandler(req, res));
app.use('/api/news', (req, res) => newsHandler(req, res));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/summarizer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'summarizer.html'));
});

app.get('/qa', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'qa.html'));
});

app.get('/quiz', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

app.get('/random', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'random.html'));
});

app.get('/news', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'news.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`OpenRouter API Key configured: ${!!process.env.OPENROUTER_API_KEY}`);
  console.log(`News API Key configured: ${!!process.env.NEWS_API_KEY}`);
});
