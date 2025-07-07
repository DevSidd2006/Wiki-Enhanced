import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Using NewsAPI (you can get a free API key from newsapi.org)
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    
    if (!NEWS_API_KEY) {
      // Fallback to mock data if no API key
      return res.status(200).json({
        articles: getMockNews(),
        source: 'mock'
      });
    }

    const category = req.query.category || 'general';
    const country = req.query.country || 'us';
    const pageSize = req.query.pageSize || 10;

    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Format articles for our use
    const formattedArticles = data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage
    }));

    return res.status(200).json({
      articles: formattedArticles,
      source: 'newsapi',
      totalResults: data.totalResults
    });

  } catch (error) {
    console.error("News API Error:", error);
    
    // Return mock data on error
    return res.status(200).json({
      articles: getMockNews(),
      source: 'mock',
      error: 'Using fallback news data'
    });
  }
}

function getMockNews() {
  return [
    {
      title: "AI Revolution Transforms Global Industries in 2025",
      description: "Artificial intelligence continues to reshape manufacturing, healthcare, and education sectors worldwide, with major breakthroughs in generative AI and robotics.",
      url: "#",
      source: "Tech World",
      publishedAt: new Date().toISOString(),
      urlToImage: null
    },
    {
      title: "Global Renewable Energy Milestone Reached",
      description: "Renewable energy sources now account for 60% of global electricity generation, marking a historic shift away from fossil fuels.",
      url: "#",
      source: "Energy Today",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      urlToImage: null
    },
    {
      title: "Mars Colony Preparations Enter Final Phase",
      description: "NASA and SpaceX announce successful completion of Mars habitat testing, with first crewed mission planned for 2026.",
      url: "#",
      source: "Space Chronicle",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      urlToImage: null
    },
    {
      title: "Global Digital Currency Initiative Launches",
      description: "Major world economies collaborate on unified digital currency framework, promising faster international transactions and reduced costs.",
      url: "#",
      source: "Financial Times",
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      urlToImage: null
    },
    {
      title: "Breakthrough Cancer Treatment Shows 95% Success Rate",
      description: "Revolutionary gene therapy treatment demonstrates unprecedented success in clinical trials, offering hope for millions of patients worldwide.",
      url: "#",
      source: "Medical News",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      urlToImage: null
    },
    {
      title: "Ocean Cleanup Project Removes 50 Million Tons of Plastic",
      description: "International ocean cleanup initiative reaches major milestone, significantly reducing plastic pollution in Pacific Ocean.",
      url: "#",
      source: "Environment Today",
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      urlToImage: null
    },
    {
      title: "World's First Quantum Internet Network Goes Live",
      description: "Scientists successfully establish the first intercontinental quantum communication network, promising ultra-secure data transmission.",
      url: "#",
      source: "Innovation Report",
      publishedAt: new Date(Date.now() - 21600000).toISOString(),
      urlToImage: null
    },
    {
      title: "Global Food Security Initiative Ends Hunger in 20 Nations",
      description: "UN announces successful completion of food security program, eliminating hunger in 20 developing nations through sustainable agriculture.",
      url: "#",
      source: "World Report",
      publishedAt: new Date(Date.now() - 25200000).toISOString(),
      urlToImage: null
    }
  ];
}
