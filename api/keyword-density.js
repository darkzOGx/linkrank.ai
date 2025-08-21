export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const mockResults = generateMockKeywordDensityData(url);
    return res.json(mockResults);
  } catch (error) {
    console.error('Keyword density error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while analyzing keyword density'
    });
  }
}

function generateMockKeywordDensityData(url) {
  const totalWords = Math.floor(Math.random() * 2000) + 500;
  const uniqueWords = Math.floor(totalWords * 0.4);
  
  const keywords = [
    'marketing', 'digital', 'business', 'strategy', 'content',
    'seo', 'optimization', 'website', 'online', 'service',
    'solution', 'customer', 'growth', 'technology', 'data'
  ];

  const topKeywords = keywords.slice(0, 10).map((word, index) => {
    const count = Math.floor(Math.random() * 30) + 5;
    const density = ((count / totalWords) * 100).toFixed(2);
    return {
      word: word,
      count: count,
      density: parseFloat(density),
      prominence: Math.max(20, 100 - index * 10)
    };
  });

  const twoWordPhrases = [
    'digital marketing', 'content strategy', 'search engine',
    'social media', 'customer experience', 'data analytics'
  ].map(phrase => ({
    phrase: phrase,
    count: Math.floor(Math.random() * 10) + 2,
    density: (Math.random() * 1.5).toFixed(2)
  }));

  const threeWordPhrases = [
    'search engine optimization', 'content marketing strategy',
    'social media marketing', 'digital marketing agency'
  ].map(phrase => ({
    phrase: phrase,
    count: Math.floor(Math.random() * 5) + 1,
    density: (Math.random() * 0.8).toFixed(2)
  }));

  const analysis = [];
  
  // Check top keyword density
  if (topKeywords[0].density > 3) {
    analysis.push({
      type: 'warning',
      message: `"${topKeywords[0].word}" appears too frequently (${topKeywords[0].density}%). Consider reducing to avoid keyword stuffing.`
    });
  } else if (topKeywords[0].density >= 1 && topKeywords[0].density <= 2.5) {
    analysis.push({
      type: 'good',
      message: `Primary keyword density is optimal (${topKeywords[0].density}%).`
    });
  }

  // Check content length
  if (totalWords < 300) {
    analysis.push({
      type: 'error',
      message: 'Content is too short. Aim for at least 300 words for better SEO.'
    });
  } else if (totalWords >= 1000) {
    analysis.push({
      type: 'good',
      message: `Good content length (${totalWords} words). Long-form content tends to rank better.`
    });
  }

  // Check keyword variety
  if (uniqueWords / totalWords > 0.3) {
    analysis.push({
      type: 'good',
      message: 'Good keyword variety and vocabulary richness.'
    });
  }

  return {
    success: true,
    url: url,
    stats: {
      totalWords: totalWords,
      uniqueWords: uniqueWords,
      avgSentenceLength: Math.floor(Math.random() * 10) + 15,
      readingTime: `${Math.ceil(totalWords / 200)} min`
    },
    topKeywords: topKeywords,
    twoWordPhrases: twoWordPhrases,
    threeWordPhrases: threeWordPhrases,
    analysis: analysis
  };
}