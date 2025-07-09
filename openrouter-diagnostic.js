import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 OPENROUTER API DIAGNOSTIC');
console.log('================================');

// Test 1: Environment Variables
console.log('\n1. Environment Variables:');
console.log('   API Key Present:', !!process.env.OPENROUTER_API_KEY);
console.log('   API Key Format:', process.env.OPENROUTER_API_KEY?.startsWith('sk-or-v1-') ? '✅ Valid' : '❌ Invalid');
console.log('   API Key Length:', process.env.OPENROUTER_API_KEY?.length);

// Test 2: API Key Info Endpoint
console.log('\n2. Testing API Key Validity...');
async function testKeyInfo() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      }
    });
    
    console.log('   Status:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ API Key Valid');
      console.log('   Credits:', data.data?.usage || 'Unknown');
    } else {
      const error = await response.json().catch(() => ({}));
      console.log('   ❌ API Key Invalid');
      console.log('   Error:', error);
    }
  } catch (error) {
    console.log('   ❌ Network Error:', error.message);
  }
}

// Test 3: Available Models
console.log('\n3. Testing Available Models...');
async function testModels() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Models Retrieved');
      
      // Check for free models
      const freeModels = data.data?.filter(model => 
        model.id.includes('free') || 
        model.pricing?.prompt === '0' || 
        model.pricing?.completion === '0'
      ).slice(0, 5);
      
      console.log('   Free Models Available:');
      freeModels?.forEach(model => {
        console.log(`     - ${model.id}`);
      });
    } else {
      console.log('   ❌ Cannot access models');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
}

// Test 4: Simple Chat Completion
console.log('\n4. Testing Chat Completion...');
async function testChatCompletion() {
  const models = ['gpt-3.5-turbo', 'anthropic/claude-3-haiku', 'meta-llama/llama-3-8b-instruct:free'];
  
  for (const model of models) {
    console.log(`\n   Testing ${model}:`);
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Wiki Enhanced'
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'Say hello' }],
          max_tokens: 5
        })
      });
      
      console.log(`     Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`     ✅ Success: ${data.choices?.[0]?.message?.content}`);
        break; // Found working model
      } else {
        const error = await response.json().catch(() => ({}));
        console.log(`     ❌ Failed: ${error.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`     ❌ Error: ${error.message}`);
    }
  }
}

// Run all tests
async function runDiagnostics() {
  await testKeyInfo();
  await testModels();
  await testChatCompletion();
  
  console.log('\n================================');
  console.log('🔍 DIAGNOSTIC COMPLETE');
  console.log('\nIf all tests fail, you may need to:');
  console.log('1. Regenerate your OpenRouter API key');
  console.log('2. Add credits to your OpenRouter account');
  console.log('3. Check OpenRouter status page');
}

runDiagnostics();
