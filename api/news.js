import dotenv from 'dotenv';
import { getMockNews } from './mockNewsData.js';

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
    const sources = req.query.sources;
    const pageSize = req.query.pageSize || 10;

    let apiUrl;
    let queryParams = new URLSearchParams({
      pageSize: pageSize,
      apiKey: NEWS_API_KEY
    });

    // If sources are specified, use the everything endpoint
    if (sources) {
      apiUrl = 'https://newsapi.org/v2/everything';
      queryParams.append('sources', sources);
      queryParams.append('sortBy', 'publishedAt');
    } else if (country !== 'us') {
      // For non-US countries, use everything endpoint with popular sources
      // because top-headlines API has very limited international coverage on free tier
      const popularSources = getPopularSourcesForCountry(country);
      if (popularSources.length > 0) {
        apiUrl = 'https://newsapi.org/v2/everything';
        queryParams.append('sources', popularSources.join(','));
        queryParams.append('sortBy', 'publishedAt');
        console.log(`Using sources strategy for ${country}: ${popularSources.join(', ')}`);
      } else {
        // Fallback to top-headlines for unsupported countries
        apiUrl = 'https://newsapi.org/v2/top-headlines';
        queryParams.append('country', country);
        queryParams.append('category', category);
      }
    } else {
      // Use top-headlines endpoint for US (works well on free tier)
      apiUrl = 'https://newsapi.org/v2/top-headlines';
      queryParams.append('country', country);
      queryParams.append('category', category);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    let data;
    try {
      const response = await fetch(`${apiUrl}?${queryParams}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`News API error: ${response.status} - ${errorText}`);
        throw new Error(`News API error: ${response.status}`);
      }

      data = await response.json();
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('News API timeout');
        return res.status(200).json({
          articles: getMockNews(),
          source: 'mock',
          error: 'News API timeout - using fallback data'
        });
      }
      throw fetchError;
    }
    
    // Log the API response for debugging
    console.log(`NewsAPI request: ${apiUrl}?${queryParams}`);
    console.log(`NewsAPI response: ${data.totalResults} articles found for country: ${country}, category: ${category}, sources: ${sources || 'none'}`);
    
    // If no articles found and not using sources, try fallback strategies
    if ((!data.articles || data.articles.length === 0) && !sources) {
      console.log(`No articles found for ${country}, trying fallback strategies...`);
      
      // Try with different category if specific category returned no results
      if (category !== 'general') {
        console.log(`Trying with general category instead of ${category}...`);
        queryParams.set('category', 'general');
        const fallbackResponse = await fetch(`${apiUrl}?${queryParams}`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.articles && fallbackData.articles.length > 0) {
            console.log(`Fallback successful: ${fallbackData.articles.length} articles found`);
            return res.status(200).json({
              articles: fallbackData.articles.map(article => ({
                title: article.title,
                description: article.description,
                url: article.url,
                source: article.source.name,
                publishedAt: article.publishedAt,
                urlToImage: article.urlToImage
              })),
              source: 'newsapi',
              totalResults: fallbackData.totalResults,
              fallback: `Used general category instead of ${category}`
            });
          }
        }
      }
      
      // If still no results, use everything endpoint with popular sources for that country
      const popularSources = getPopularSourcesForCountry(country);
      if (popularSources.length > 0) {
        console.log(`Trying popular sources for ${country}: ${popularSources.join(', ')}`);
        const everythingUrl = 'https://newsapi.org/v2/everything';
        const sourceParams = new URLSearchParams({
          sources: popularSources.join(','),
          pageSize: pageSize,
          sortBy: 'publishedAt',
          apiKey: NEWS_API_KEY
        });
        
        const sourcesResponse = await fetch(`${everythingUrl}?${sourceParams}`);
        if (sourcesResponse.ok) {
          const sourcesData = await sourcesResponse.json();
          if (sourcesData.articles && sourcesData.articles.length > 0) {
            console.log(`Sources fallback successful: ${sourcesData.articles.length} articles found`);
            return res.status(200).json({
              articles: sourcesData.articles.map(article => ({
                title: article.title,
                description: article.description,
                url: article.url,
                source: article.source.name,
                publishedAt: article.publishedAt,
                urlToImage: article.urlToImage
              })),
              source: 'newsapi',
              totalResults: sourcesData.totalResults,
              fallback: `Used popular sources for ${country}`
            });
          }
        }
      }
    }
    
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

function getPopularSourcesForCountry(country) {
  const sourcesByCountry = {
    'gb': ['bbc-news', 'independent', 'the-guardian-uk'],
    'ca': ['cbc-news'],
    'au': ['abc-news-au'],
    'de': ['bild', 'die-zeit', 'focus', 'handelsblatt', 'spiegel-online', 'der-tagesspiegel'],
    'fr': ['les-echos', 'liberation', 'le-figaro'],
    'it': ['ansa', 'la-repubblica', 'corriere-della-sera'],
    'es': ['el-mundo', 'el-pais'],
    'nl': ['nu'],
    'se': ['aftonbladet', 'svenska-dagbladet'],
    'no': ['nrk'],
    'at': ['der-standard'],
    'ie': ['rte'],
    'nz': ['stuff-co-nz'],
    'za': ['news24'],
    'in': ['the-times-of-india', 'the-hindu', 'india-today'],
    'ru': ['rt', 'rbc'],
    'br': ['globo', 'folha-de-s-paulo'],
    'ar': ['infobae', 'la-nacion'],
    'sa': ['al-arabiya-english', 'sabq']
  };
  
  return sourcesByCountry[country] || [];
}
