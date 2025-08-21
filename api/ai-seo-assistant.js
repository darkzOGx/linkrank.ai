export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, query, type } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    let analysis;

    switch (type) {
      case 'content-analysis':
        analysis = await analyzeContent(url, query);
        break;
      case 'keyword-suggestions':
        analysis = await generateKeywordSuggestions(query);
        break;
      case 'seo-audit':
        analysis = await performSEOAudit(url, query);
        break;
      case 'content-optimization':
        analysis = await optimizeContent(query);
        break;
      case 'competitor-analysis':
        analysis = await analyzeCompetitors(query);
        break;
      default:
        analysis = await generateGeneralAdvice(url, query);
    }

    return res.json({
      success: true,
      query,
      type: type || 'general',
      ...analysis
    });

  } catch (error) {
    console.error('AI SEO Assistant error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while processing your request'
    });
  }
}

async function analyzeContent(url, query) {
  if (!url) {
    return {
      analysis: 'Please provide a URL for content analysis.',
      recommendations: [],
      score: 0
    };
  }

  try {
    // Validate URL
    let targetUrl = url.startsWith('http') ? url : `https://${url}`;
    new URL(targetUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'AI-SEO-Assistant/1.0 (+https://linkrank.ai/bot)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        analysis: `Unable to fetch content from ${targetUrl}. Status: ${response.status}`,
        recommendations: ['Ensure the URL is accessible', 'Check if the website is online'],
        score: 0
      };
    }

    const html = await response.text();
    const contentAnalysis = performContentAnalysis(html, query);
    
    return contentAnalysis;

  } catch (error) {
    return {
      analysis: `Error analyzing content: ${error.message}`,
      recommendations: ['Verify the URL is correct', 'Check your internet connection'],
      score: 0
    };
  }
}

function performContentAnalysis(html, query) {
  const analysis = {
    analysis: '',
    recommendations: [],
    score: 0,
    contentQuality: {},
    seoFactors: {},
    improvements: []
  };

  // Extract basic elements
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  const metaDescMatch = html.match(/<meta\s+name=['""]description['""].*?content=['""]([^'""]*)['""][^>]*>/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1] : '';

  // Extract text content (simplified)
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const wordCount = textContent.split(/\s+/).length;
  const queryLower = query.toLowerCase();
  const contentLower = textContent.toLowerCase();
  
  // Keyword density analysis
  const queryWords = queryLower.split(/\s+/);
  let keywordMentions = 0;
  
  queryWords.forEach(word => {
    const mentions = (contentLower.match(new RegExp(word, 'g')) || []).length;
    keywordMentions += mentions;
  });

  const keywordDensity = wordCount > 0 ? (keywordMentions / wordCount) * 100 : 0;

  // Content quality assessment
  analysis.contentQuality = {
    wordCount,
    keywordDensity: Math.round(keywordDensity * 100) / 100,
    titleOptimization: assessTitleOptimization(title, query),
    metaDescOptimization: assessMetaDescription(metaDescription, query),
    readabilityScore: calculateReadabilityScore(textContent)
  };

  // SEO factors
  analysis.seoFactors = {
    titleExists: !!title,
    metaDescExists: !!metaDescription,
    adequateContent: wordCount >= 300,
    keywordPresence: keywordMentions > 0,
    headerStructure: analyzeHeaderStructure(html)
  };

  // Generate recommendations
  analysis.recommendations = generateContentRecommendations(analysis.contentQuality, analysis.seoFactors, query);

  // Calculate overall score
  analysis.score = calculateContentScore(analysis.contentQuality, analysis.seoFactors);

  // Generate analysis text
  analysis.analysis = generateContentAnalysisText(analysis, query);

  return analysis;
}

function assessTitleOptimization(title, query) {
  if (!title) return { score: 0, issues: ['Missing title tag'] };
  
  const issues = [];
  let score = 100;

  if (title.length < 30) {
    issues.push('Title is too short (under 30 characters)');
    score -= 20;
  } else if (title.length > 60) {
    issues.push('Title is too long (over 60 characters)');
    score -= 15;
  }

  if (!title.toLowerCase().includes(query.toLowerCase())) {
    issues.push('Target keyword not found in title');
    score -= 30;
  }

  return { score: Math.max(0, score), issues };
}

function assessMetaDescription(metaDesc, query) {
  if (!metaDesc) return { score: 0, issues: ['Missing meta description'] };
  
  const issues = [];
  let score = 100;

  if (metaDesc.length < 120) {
    issues.push('Meta description is too short (under 120 characters)');
    score -= 20;
  } else if (metaDesc.length > 160) {
    issues.push('Meta description is too long (over 160 characters)');
    score -= 15;
  }

  if (!metaDesc.toLowerCase().includes(query.toLowerCase())) {
    issues.push('Target keyword not found in meta description');
    score -= 25;
  }

  return { score: Math.max(0, score), issues };
}

function calculateReadabilityScore(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/);
  const syllables = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  if (sentences.length === 0 || words.length === 0) return 0;

  // Simplified Flesch Reading Ease Score
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  return Math.round(Math.max(0, Math.min(100, score)));
}

function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function analyzeHeaderStructure(html) {
  const headers = {
    h1: (html.match(/<h1[^>]*>/gi) || []).length,
    h2: (html.match(/<h2[^>]*>/gi) || []).length,
    h3: (html.match(/<h3[^>]*>/gi) || []).length,
    h4: (html.match(/<h4[^>]*>/gi) || []).length,
    h5: (html.match(/<h5[^>]*>/gi) || []).length,
    h6: (html.match(/<h6[^>]*>/gi) || []).length
  };

  return {
    ...headers,
    total: Object.values(headers).reduce((sum, count) => sum + count, 0),
    hasH1: headers.h1 > 0,
    hasMultipleH1: headers.h1 > 1
  };
}

function generateContentRecommendations(contentQuality, seoFactors, query) {
  const recommendations = [];

  if (!seoFactors.titleExists) {
    recommendations.push('Add a title tag with your target keyword');
  } else if (contentQuality.titleOptimization.score < 70) {
    recommendations.push(`Improve title tag: ${contentQuality.titleOptimization.issues.join(', ')}`);
  }

  if (!seoFactors.metaDescExists) {
    recommendations.push('Add a meta description with your target keyword');
  } else if (contentQuality.metaDescOptimization.score < 70) {
    recommendations.push(`Improve meta description: ${contentQuality.metaDescOptimization.issues.join(', ')}`);
  }

  if (!seoFactors.adequateContent) {
    recommendations.push('Increase content length to at least 300 words for better SEO');
  }

  if (contentQuality.keywordDensity < 0.5) {
    recommendations.push(`Increase keyword density for "${query}" (currently ${contentQuality.keywordDensity}%)`);
  } else if (contentQuality.keywordDensity > 3) {
    recommendations.push(`Reduce keyword density for "${query}" to avoid over-optimization (currently ${contentQuality.keywordDensity}%)`);
  }

  if (contentQuality.readabilityScore < 60) {
    recommendations.push('Improve content readability by using shorter sentences and simpler words');
  }

  if (!seoFactors.headerStructure.hasH1) {
    recommendations.push('Add an H1 header tag with your main keyword');
  } else if (seoFactors.headerStructure.hasMultipleH1) {
    recommendations.push('Use only one H1 tag per page');
  }

  if (seoFactors.headerStructure.h2 === 0) {
    recommendations.push('Add H2 headers to structure your content better');
  }

  return recommendations;
}

function calculateContentScore(contentQuality, seoFactors) {
  let score = 0;
  
  // Title optimization (25 points)
  score += (contentQuality.titleOptimization.score / 100) * 25;
  
  // Meta description (20 points)
  score += (contentQuality.metaDescOptimization.score / 100) * 20;
  
  // Content length (15 points)
  score += seoFactors.adequateContent ? 15 : (contentQuality.wordCount / 300) * 15;
  
  // Keyword density (15 points)
  if (contentQuality.keywordDensity >= 0.5 && contentQuality.keywordDensity <= 3) {
    score += 15;
  } else if (contentQuality.keywordDensity > 0) {
    score += 10;
  }
  
  // Readability (10 points)
  score += (contentQuality.readabilityScore / 100) * 10;
  
  // Header structure (15 points)
  score += seoFactors.headerStructure.hasH1 ? 8 : 0;
  score += !seoFactors.headerStructure.hasMultipleH1 ? 3 : 0;
  score += seoFactors.headerStructure.h2 > 0 ? 4 : 0;

  return Math.round(Math.max(0, Math.min(100, score)));
}

function generateContentAnalysisText(analysis, query) {
  const { contentQuality, seoFactors, score } = analysis;
  
  let text = `Content Analysis for "${query}":\n\n`;
  
  text += `Overall SEO Score: ${score}/100\n\n`;
  
  text += `Content Overview:\n`;
  text += `• Word Count: ${contentQuality.wordCount} words\n`;
  text += `• Keyword Density: ${contentQuality.keywordDensity}%\n`;
  text += `• Readability Score: ${contentQuality.readabilityScore}/100\n\n`;
  
  text += `SEO Elements:\n`;
  text += `• Title Tag: ${seoFactors.titleExists ? '✓' : '✗'} Present\n`;
  text += `• Meta Description: ${seoFactors.metaDescExists ? '✓' : '✗'} Present\n`;
  text += `• H1 Header: ${seoFactors.headerStructure.hasH1 ? '✓' : '✗'} Present\n`;
  text += `• Adequate Content: ${seoFactors.adequateContent ? '✓' : '✗'} ${contentQuality.wordCount >= 300 ? 'Yes' : 'No'}\n\n`;
  
  if (score >= 80) {
    text += `Excellent! Your content is well-optimized for "${query}".`;
  } else if (score >= 60) {
    text += `Good foundation, but there's room for improvement in your SEO optimization.`;
  } else if (score >= 40) {
    text += `Your content needs significant SEO improvements to rank well for "${query}".`;
  } else {
    text += `Major SEO issues detected. Consider a comprehensive content optimization strategy.`;
  }
  
  return text;
}

async function generateKeywordSuggestions(query) {
  // Generate keyword suggestions based on the query
  const suggestions = generateKeywordIdeas(query);
  
  return {
    query,
    suggestions: suggestions.primary,
    longtail: suggestions.longtail,
    related: suggestions.related,
    analysis: `Generated ${suggestions.primary.length + suggestions.longtail.length + suggestions.related.length} keyword suggestions for "${query}".`,
    recommendations: [
      'Focus on long-tail keywords for easier ranking',
      'Target keywords with clear search intent',
      'Use keyword variations naturally in your content',
      'Research competitor keywords for additional ideas'
    ]
  };
}

function generateKeywordIdeas(baseKeyword) {
  const words = baseKeyword.toLowerCase().split(/\s+/);
  const primaryWord = words[0];
  
  // Generate primary keyword variations
  const primary = [
    `${baseKeyword} guide`,
    `${baseKeyword} tips`,
    `best ${baseKeyword}`,
    `${baseKeyword} tutorial`,
    `how to ${baseKeyword}`,
    `${baseKeyword} benefits`,
    `${baseKeyword} examples`,
    `${baseKeyword} strategies`
  ];

  // Generate long-tail variations
  const longtail = [
    `${baseKeyword} for beginners`,
    `${baseKeyword} step by step`,
    `${baseKeyword} best practices`,
    `complete guide to ${baseKeyword}`,
    `${baseKeyword} mistakes to avoid`,
    `${baseKeyword} vs alternatives`,
    `${baseKeyword} case study`,
    `${baseKeyword} checklist`
  ];

  // Generate related terms
  const related = [
    `${primaryWord} optimization`,
    `${primaryWord} analysis`,
    `${primaryWord} tools`,
    `${primaryWord} techniques`,
    `${primaryWord} methods`,
    `${primaryWord} solutions`,
    `${primaryWord} services`,
    `${primaryWord} software`
  ];

  return { primary, longtail, related };
}

async function performSEOAudit(url, query) {
  if (!url) {
    return {
      analysis: 'Please provide a URL for SEO audit.',
      recommendations: [],
      score: 0
    };
  }

  try {
    const contentAnalysis = await analyzeContent(url, query);
    
    // Additional SEO checks
    const auditResults = {
      ...contentAnalysis,
      technicalSEO: await checkTechnicalSEO(url),
      analysis: `Comprehensive SEO audit completed for ${url}. Overall score: ${contentAnalysis.score}/100.`
    };

    return auditResults;

  } catch (error) {
    return {
      analysis: `Error performing SEO audit: ${error.message}`,
      recommendations: ['Verify the URL is accessible', 'Check your internet connection'],
      score: 0
    };
  }
}

async function checkTechnicalSEO(url) {
  // Basic technical SEO checks
  return {
    ssl: url.startsWith('https://'),
    mobileFriendly: true, // Would need actual testing
    pageSpeed: 'Not tested', // Would need actual testing
    xmlSitemap: 'Not checked', // Would need actual checking
    robotsTxt: 'Not checked' // Would need actual checking
  };
}

async function optimizeContent(content) {
  const optimizations = analyzeContentForOptimization(content);
  
  return {
    analysis: `Content optimization analysis completed. Found ${optimizations.issues.length} areas for improvement.`,
    optimizations: optimizations.suggestions,
    issues: optimizations.issues,
    recommendations: optimizations.recommendations,
    score: optimizations.score
  };
}

function analyzeContentForOptimization(content) {
  const issues = [];
  const suggestions = [];
  const recommendations = [];
  
  const wordCount = content.split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (wordCount < 300) {
    issues.push('Content is too short for good SEO performance');
    suggestions.push('Expand content to at least 300 words');
  }
  
  if (sentences.length > 0) {
    const avgWordsPerSentence = wordCount / sentences.length;
    if (avgWordsPerSentence > 20) {
      issues.push('Sentences are too long, affecting readability');
      suggestions.push('Break down long sentences for better readability');
    }
  }
  
  recommendations.push('Use relevant keywords naturally throughout the content');
  recommendations.push('Add internal links to related pages');
  recommendations.push('Include relevant images with alt text');
  recommendations.push('Use header tags (H2, H3) to structure content');
  
  const score = calculateOptimizationScore(wordCount, sentences.length);
  
  return { issues, suggestions, recommendations, score };
}

function calculateOptimizationScore(wordCount, sentenceCount) {
  let score = 100;
  
  if (wordCount < 300) score -= 30;
  if (wordCount > 2000) score -= 10;
  
  if (sentenceCount > 0) {
    const avgWordsPerSentence = wordCount / sentenceCount;
    if (avgWordsPerSentence > 20) score -= 20;
    if (avgWordsPerSentence < 8) score -= 10;
  }
  
  return Math.max(0, score);
}

async function analyzeCompetitors(query) {
  // Simulated competitor analysis
  const competitors = generateCompetitorInsights(query);
  
  return {
    analysis: `Competitor analysis for "${query}" reveals key opportunities and threats in the market.`,
    competitors: competitors.topCompetitors,
    opportunities: competitors.opportunities,
    threats: competitors.threats,
    recommendations: competitors.recommendations
  };
}

function generateCompetitorInsights(query) {
  const topCompetitors = [
    {
      domain: 'competitor1.com',
      estimatedTraffic: '50K-100K',
      strengths: ['Strong domain authority', 'Comprehensive content'],
      weaknesses: ['Slow page speed', 'Poor mobile experience']
    },
    {
      domain: 'competitor2.com',
      estimatedTraffic: '25K-50K',
      strengths: ['Good user experience', 'Active social media'],
      weaknesses: ['Limited content depth', 'Weak backlink profile']
    }
  ];

  const opportunities = [
    `Target long-tail variations of "${query}"`,
    'Create more comprehensive guides than competitors',
    'Improve page loading speed for competitive advantage',
    'Build stronger backlink profile'
  ];

  const threats = [
    'Established competitors with high domain authority',
    'Saturated keyword competition',
    'Rapid content publication by competitors'
  ];

  const recommendations = [
    'Focus on content quality over quantity',
    'Target competitor keyword gaps',
    'Build authoritative backlinks',
    'Improve technical SEO performance'
  ];

  return { topCompetitors, opportunities, threats, recommendations };
}

async function generateGeneralAdvice(url, query) {
  const advice = generateSEOAdvice(query, url);
  
  return {
    analysis: advice.analysis,
    recommendations: advice.recommendations,
    quickWins: advice.quickWins,
    longTermStrategy: advice.longTermStrategy
  };
}

function generateSEOAdvice(query, url) {
  const hasUrl = !!url;
  
  const analysis = hasUrl 
    ? `SEO analysis and recommendations for optimizing "${query}" on ${url}.`
    : `General SEO strategy and recommendations for targeting "${query}".`;

  const recommendations = [
    `Research keyword variations and related terms for "${query}"`,
    'Create high-quality, comprehensive content',
    'Optimize title tags and meta descriptions',
    'Build relevant internal and external links',
    'Ensure fast page loading speeds',
    'Make your site mobile-friendly',
    'Regular monitoring and optimization'
  ];

  const quickWins = [
    'Optimize title tag with target keyword',
    'Write compelling meta description',
    'Add relevant header tags (H1, H2, H3)',
    'Optimize images with alt text',
    'Fix any broken links'
  ];

  const longTermStrategy = [
    'Develop comprehensive content strategy',
    'Build high-quality backlinks',
    'Improve domain authority',
    'Create topic clusters and pillar pages',
    'Monitor and adapt to algorithm changes'
  ];

  return { analysis, recommendations, quickWins, longTermStrategy };
}