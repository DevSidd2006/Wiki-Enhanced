import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('Checking available models...');
    const models = await genAI.listModels();
    console.log('✅ Available models:');
    models.forEach(model => {
      console.log(`- ${model.name}: ${model.displayName}`);
    });
  } catch (error) {
    console.error('❌ Failed to list models:', error.message);
  }
}

listModels();
