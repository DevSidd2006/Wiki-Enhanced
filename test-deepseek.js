import dotenv from 'dotenv';
dotenv.config();

console.log('🧪 Testing DeepSeek R1 Model');

async function testDeepSeekR1() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Wikipedia Enhanced'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1',
        messages: [
          {
            role: 'user',
            content: 'Test message for DeepSeek R1. Please respond briefly.'
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ DeepSeek R1 working:', data.choices[0].message.content.substring(0, 100));
    } else {
      const errorText = await response.text();
      console.log('❌ DeepSeek R1 failed:', errorText);
      
      // Test with a free model as fallback
      console.log('\n🔄 Testing free model fallback...');
      const fallbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Wikipedia Enhanced'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-small-3.2-24b-instruct:free',
          messages: [
            {
              role: 'user',
              content: 'Test message for free model. Please respond briefly.'
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        })
      });
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        console.log('✅ Free model working:', fallbackData.choices[0].message.content.substring(0, 100));
      } else {
        console.log('❌ Free model also failed');
      }
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

testDeepSeekR1();
