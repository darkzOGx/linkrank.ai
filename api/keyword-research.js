export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword parameter is required' });
  }

  try {
    const mockResults = generateMockKeywordData(keyword);
    return res.json(mockResults);
  } catch (error) {
    console.error('Keyword research error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while researching keywords'
    });
  }
}

function generateMockKeywordData(keyword) {
  const baseVolume = Math.floor(Math.random() * 50000) + 1000;
  
  const relatedKeywords = [
    `best ${keyword}`,
    `${keyword} guide`,
    `how to ${keyword}`,
    `${keyword} tips`,
    `${keyword} tutorial`,
    `${keyword} for beginners`,
    `${keyword} strategies`,
    `${keyword} tools`
  ].map(kw => ({
    keyword: kw,
    volume: Math.floor(baseVolume * (Math.random() * 0.8 + 0.1)),
    difficulty: Math.floor(Math.random() * 80) + 10,
    cpc: (Math.random() * 8 + 0.5).toFixed(2),
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)]
  }));

  const longtailKeywords = [
    `what is the best ${keyword} for small business`,
    `how to use ${keyword} effectively in 2025`,
    `${keyword} vs alternatives comparison`,
    `step by step ${keyword} tutorial for beginners`,
    `common ${keyword} mistakes to avoid`,
    `${keyword} best practices and tips`
  ].map(kw => ({
    keyword: kw,
    volume: Math.floor(baseVolume * (Math.random() * 0.3 + 0.05)),
    difficulty: Math.floor(Math.random() * 50) + 5
  }));

  const questions = [
    `What is ${keyword}?`,
    `How does ${keyword} work?`,
    `Why is ${keyword} important?`,
    `When should I use ${keyword}?`,
    `What are the benefits of ${keyword}?`
  ];

  return {
    success: true,
    mainKeyword: {
      keyword: keyword,
      volume: baseVolume,
      difficulty: Math.floor(Math.random() * 70) + 20,
      cpc: (Math.random() * 10 + 1).toFixed(2),
      competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
    },
    relatedKeywords: relatedKeywords,
    longtailKeywords: longtailKeywords,
    questions: questions
  };
}