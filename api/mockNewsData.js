/**
 * Mock news data for fallback when News API is unavailable
 * Loaded lazily to reduce memory footprint
 */
export function getMockNews() {
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
    },
    {
      title: "International Climate Action Reduces Global Emissions by 30%",
      description: "Coordinated efforts between nations result in significant reduction in greenhouse gas emissions, bringing 2030 climate goals within reach.",
      url: "#",
      source: "Climate Report",
      publishedAt: new Date(Date.now() - 28800000).toISOString(),
      urlToImage: null
    },
    {
      title: "Global Education Initiative Reaches 1 Billion Students",
      description: "Digital education platform successfully provides quality education access to underserved communities worldwide.",
      url: "#",
      source: "Education Today",
      publishedAt: new Date(Date.now() - 32400000).toISOString(),
      urlToImage: null
    }
  ];
}
