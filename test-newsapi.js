import dotenv from 'dotenv';
dotenv.config();

const key = process.env.NEWS_API_KEY;
// Test with everything endpoint and specific sources
const sources = ['bbc-news', 'reuters', 'cnn', 'the-guardian-uk', 'abc-news-au'];

async function testSources() {
  for (const source of sources) {
    const testUrl = `https://newsapi.org/v2/everything?sources=${source}&pageSize=3&sortBy=publishedAt&apiKey=${key}`;
    
    console.log(`\n--- Testing ${source} ---`);
    
    try {
      const response = await fetch(testUrl);
      const data = await response.json();
      
      console.log(`Status: ${response.status}`);
      console.log(`Total results: ${data.totalResults || 0}`);
      console.log(`Articles found: ${data.articles ? data.articles.length : 0}`);
      
      if (data.error) {
        console.log(`API Error: ${data.error}`);
      }
      
      if (data.articles && data.articles.length > 0) {
        console.log(`Sample title: ${data.articles[0].title.substring(0, 60)}...`);
        console.log(`Sample source: ${data.articles[0].source.name}`);
      }
    } catch (error) {
      console.error(`Error for ${source}: ${error.message}`);
    }
  }
}

// Test sources endpoint
async function testAllSources() {
  console.log('\n--- Testing Available Sources ---');
  const sourcesUrl = `https://newsapi.org/v2/sources?apiKey=${key}`;
  
  try {
    const response = await fetch(sourcesUrl);
    const data = await response.json();
    
    console.log(`Total sources available: ${data.sources ? data.sources.length : 0}`);
    
    if (data.sources && data.sources.length > 0) {
      const countryCounts = {};
      data.sources.forEach(source => {
        countryCounts[source.country] = (countryCounts[source.country] || 0) + 1;
      });
      
      console.log('Sources by country:');
      Object.entries(countryCounts).forEach(([country, count]) => {
        console.log(`  ${country}: ${count} sources`);
      });
    }
    
    if (data.error) {
      console.log(`Sources API Error: ${data.error}`);
    }
  } catch (error) {
    console.error(`Sources error: ${error.message}`);
  }
}

async function runTests() {
  await testAllSources();
  await testSources();
}

runTests();
