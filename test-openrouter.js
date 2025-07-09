import dotenv from 'dotenv';
dotenv.config();

console.log('=== OpenRouter API Key Test ===');
console.log('API Key exists:', !!process.env.OPENROUTER_API_KEY);
console.log('API Key starts with sk-or-v1:', process.env.OPENROUTER_API_KEY?.startsWith('sk-or-v1-'));
console.log('API Key length:', process.env.OPENROUTER_API_KEY?.length);
console.log('First 20 chars:', process.env.OPENROUTER_API_KEY?.substring(0, 20));

// Test basic API call
async function testOpenRouterAPI() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Wiki Enhanced Test'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          {
            role: 'user',
            content: 'Say "Hello" in one word'
          }
        ],
        max_tokens: 5
      })
    });

    console.log('=== API Response ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    const data = await response.json();
    console.log('Response Data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ API call successful!');
      console.log('Answer:', data.choices?.[0]?.message?.content);
    } else {
      console.log('❌ API call failed!');
    }
  } catch (error) {
    console.error('❌ Error making API call:', error.message);
  }
}

testOpenRouterAPI();
