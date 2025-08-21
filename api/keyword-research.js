export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword parameter is required' });
  }

  try {
    const keywordData = await performKeywordResearch(keyword.trim());
    
    return res.json({
      success: true,
      keyword: keyword.trim(),
      ...keywordData
    });

  } catch (error) {
    console.error('Keyword research error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while researching keywords'
    });
  }
}

async function performKeywordResearch(seedKeyword) {
  try {
    // Analyze the seed keyword and generate variations
    const keywordAnalysis = await analyzeKeyword(seedKeyword);
    const relatedKeywords = generateRelatedKeywords(seedKeyword);
    const longtailKeywords = generateLongtailKeywords(seedKeyword);
    const questions = generateQuestionKeywords(seedKeyword);

    return {
      mainKeyword: keywordAnalysis,
      relatedKeywords: relatedKeywords,
      longtailKeywords: longtailKeywords,
      questions: questions
    };

  } catch (error) {
    throw new Error('Failed to analyze keyword: ' + error.message);
  }
}

async function analyzeKeyword(keyword) {
  // Estimate search volume based on keyword characteristics
  const estimatedVolume = estimateSearchVolume(keyword);
  const difficulty = estimateKeywordDifficulty(keyword);
  const cpc = estimateCPC(keyword);
  const competition = estimateCompetition(keyword);

  return {
    keyword: keyword,
    volume: estimatedVolume,
    difficulty: difficulty,
    cpc: cpc,
    competition: competition
  };
}

function estimateSearchVolume(keyword) {
  const words = keyword.split(' ');
  const wordCount = words.length;
  
  // Base volume estimation logic
  let baseVolume = 1000;
  
  // Adjust based on keyword length (shorter = higher volume generally)
  if (wordCount === 1) {
    baseVolume = Math.floor(Math.random() * 50000) + 10000; // 10K-60K
  } else if (wordCount === 2) {
    baseVolume = Math.floor(Math.random() * 20000) + 2000;  // 2K-22K
  } else if (wordCount >= 3) {
    baseVolume = Math.floor(Math.random() * 5000) + 500;    // 500-5.5K
  }

  // Adjust based on commercial intent keywords
  const commercialKeywords = ['buy', 'purchase', 'order', 'shop', 'price', 'cost', 'cheap', 'best', 'review', 'service', 'company', 'near me'];
  const hasCommercialIntent = commercialKeywords.some(word => keyword.toLowerCase().includes(word));
  
  if (hasCommercialIntent) {
    baseVolume = Math.floor(baseVolume * 1.5); // Commercial keywords often have higher volume
  }

  // Adjust based on local keywords
  const localKeywords = ['near me', 'local', 'in', 'city', 'area'];
  const hasLocalIntent = localKeywords.some(word => keyword.toLowerCase().includes(word));
  
  if (hasLocalIntent) {
    baseVolume = Math.floor(baseVolume * 0.7); // Local keywords often have lower volume
  }

  return Math.max(100, baseVolume); // Minimum 100 searches
}

function estimateKeywordDifficulty(keyword) {
  const words = keyword.split(' ');
  const wordCount = words.length;
  
  // Base difficulty (longer keywords are generally easier)
  let difficulty = 50;
  
  if (wordCount === 1) {
    difficulty = Math.floor(Math.random() * 40) + 60; // 60-100% (very hard)
  } else if (wordCount === 2) {
    difficulty = Math.floor(Math.random() * 40) + 40; // 40-80% (medium-hard)
  } else if (wordCount >= 3) {
    difficulty = Math.floor(Math.random() * 40) + 20; // 20-60% (easier)
  }

  // Adjust for commercial keywords (usually more competitive)
  const commercialKeywords = ['buy', 'purchase', 'order', 'shop', 'best', 'top', 'service', 'company'];
  const hasCommercialIntent = commercialKeywords.some(word => keyword.toLowerCase().includes(word));
  
  if (hasCommercialIntent) {
    difficulty = Math.min(95, difficulty + 15);
  }

  // Adjust for question keywords (usually less competitive)
  const questionWords = ['how', 'what', 'why', 'when', 'where', 'who'];
  const isQuestion = questionWords.some(word => keyword.toLowerCase().includes(word));
  
  if (isQuestion) {
    difficulty = Math.max(10, difficulty - 20);
  }

  return difficulty;
}

function estimateCPC(keyword) {
  // Estimate CPC based on keyword characteristics
  let baseCPC = 1.0;
  
  // Commercial keywords typically have higher CPC
  const highValueKeywords = ['insurance', 'loan', 'mortgage', 'lawyer', 'attorney', 'service', 'repair', 'buy', 'purchase'];
  const mediumValueKeywords = ['software', 'tool', 'course', 'training', 'consulting', 'agency'];
  
  const hasHighValue = highValueKeywords.some(word => keyword.toLowerCase().includes(word));
  const hasMediumValue = mediumValueKeywords.some(word => keyword.toLowerCase().includes(word));
  
  if (hasHighValue) {
    baseCPC = (Math.random() * 8) + 5; // $5-13
  } else if (hasMediumValue) {
    baseCPC = (Math.random() * 4) + 2; // $2-6
  } else {
    baseCPC = Math.random() * 2 + 0.5; // $0.50-2.50
  }

  return parseFloat(baseCPC.toFixed(2));
}

function estimateCompetition(keyword) {
  const difficulty = estimateKeywordDifficulty(keyword);
  
  if (difficulty >= 80) return 'High';
  if (difficulty >= 50) return 'Medium';
  return 'Low';
}

function generateRelatedKeywords(seedKeyword) {
  const relatedKeywords = [];
  const words = seedKeyword.split(' ');
  
  // Generate synonyms and variations
  const synonymGroups = {
    'service': ['services', 'company', 'business', 'provider', 'agency'],
    'best': ['top', 'leading', 'premium', 'professional', 'expert'],
    'cheap': ['affordable', 'budget', 'low cost', 'inexpensive', 'discount'],
    'repair': ['fix', 'restoration', 'maintenance', 'service'],
    'marketing': ['advertising', 'promotion', 'branding', 'digital marketing'],
    'software': ['tool', 'platform', 'application', 'system', 'solution'],
    'help': ['support', 'assistance', 'aid', 'guidance'],
    'training': ['course', 'education', 'learning', 'instruction'],
    'design': ['creative', 'development', 'styling', 'layout']
  };

  // Generate related keywords by substituting synonyms
  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    if (synonymGroups[lowerWord]) {
      synonymGroups[lowerWord].forEach(synonym => {
        const newKeyword = seedKeyword.replace(new RegExp(word, 'gi'), synonym);
        if (newKeyword !== seedKeyword) {
          relatedKeywords.push({
            keyword: newKeyword,
            volume: estimateSearchVolume(newKeyword),
            difficulty: estimateKeywordDifficulty(newKeyword),
            cpc: estimateCPC(newKeyword),
            trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
          });
        }
      });
    }
  });

  // Add modifier-based related keywords
  const modifiers = ['professional', 'local', 'online', 'expert', 'certified', 'experienced'];
  modifiers.forEach(modifier => {
    const newKeyword = `${modifier} ${seedKeyword}`;
    relatedKeywords.push({
      keyword: newKeyword,
      volume: estimateSearchVolume(newKeyword),
      difficulty: estimateKeywordDifficulty(newKeyword),
      cpc: estimateCPC(newKeyword),
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
    });
  });

  // Sort by volume and return top 10
  return relatedKeywords
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);
}

function generateLongtailKeywords(seedKeyword) {
  const longtailKeywords = [];
  
  // Intent-based long-tail keywords
  const intentModifiers = [
    'how to',
    'best way to',
    'where to find',
    'what is the',
    'benefits of',
    'cost of',
    'reviews for',
    'compare',
    'vs',
    'near me',
    'in my area',
    'online',
    'guide to',
    'tips for'
  ];

  intentModifiers.forEach(modifier => {
    let newKeyword;
    if (modifier.includes('how to') || modifier.includes('best way to')) {
      newKeyword = `${modifier} ${seedKeyword}`;
    } else if (modifier.includes('what is')) {
      newKeyword = `${modifier} ${seedKeyword}`;
    } else {
      newKeyword = `${seedKeyword} ${modifier}`;
    }
    
    longtailKeywords.push({
      keyword: newKeyword,
      volume: estimateSearchVolume(newKeyword),
      difficulty: estimateKeywordDifficulty(newKeyword)
    });
  });

  // Problem-solution long-tail keywords
  const problemModifiers = [
    'problems',
    'issues',
    'solutions',
    'alternatives',
    'options',
    'pricing',
    'quotes',
    'consultation',
    'free trial',
    'demo'
  ];

  problemModifiers.forEach(modifier => {
    const newKeyword = `${seedKeyword} ${modifier}`;
    longtailKeywords.push({
      keyword: newKeyword,
      volume: estimateSearchVolume(newKeyword),
      difficulty: estimateKeywordDifficulty(newKeyword)
    });
  });

  // Sort by volume and return top 12
  return longtailKeywords
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 12);
}

function generateQuestionKeywords(seedKeyword) {
  const questions = [];
  
  // Question templates
  const questionTemplates = [
    `How does ${seedKeyword} work?`,
    `What is the best ${seedKeyword}?`,
    `Where can I find ${seedKeyword}?`,
    `Why choose ${seedKeyword}?`,
    `When to use ${seedKeyword}?`,
    `How much does ${seedKeyword} cost?`,
    `What are the benefits of ${seedKeyword}?`,
    `How to choose the right ${seedKeyword}?`,
    `Is ${seedKeyword} worth it?`,
    `What makes ${seedKeyword} effective?`,
    `How long does ${seedKeyword} take?`,
    `Can I get ${seedKeyword} online?`
  ];

  // Select 8 random questions
  const shuffled = questionTemplates.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 8);
}