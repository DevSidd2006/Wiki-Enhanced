import fetch from 'node-fetch';

async function testSummarizeAPI() {
  try {
    console.log('Testing summarize API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'This is a test article about testing APIs. It contains information about how to test summarization endpoints.'
      })
    });
    
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testSummarizeAPI();
