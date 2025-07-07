import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testAPI() {
  const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  
  for (const modelName of modelNames) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, this is a test. Please respond with 'API working'.");
      const response = await result.response;
      const text = response.text();
      console.log(`✅ ${modelName} works:`, text);
      return modelName; // Return the working model name
    } catch (error) {
      console.error(`❌ ${modelName} failed:`, error.message);
    }
  }
  
  console.log('\n🔑 If all models failed, the API key might be invalid. Please:');
  console.log('1. Go to https://aistudio.google.com/app/apikey');
  console.log('2. Create a new API key');
  console.log('3. Replace the GEMINI_API_KEY in your .env file');
}

testAPI();
