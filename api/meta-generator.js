export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { keyword, description, url, type, tone, language } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword parameter is required' });
  }

  try {
    const generationResult = await generateMetaTags({
      keyword,
      description: description || '',
      url: url || '',
      type: type || 'general',
      tone: tone || 'professional',
      language: language || 'en'
    });
    
    return res.json({
      success: true,
      keyword,
      ...generationResult
    });

  } catch (error) {
    console.error('Meta tag generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while generating meta tags'
    });
  }
}

async function generateMetaTags(params) {
  const { keyword, description, url, type, tone, language } = params;
  
  try {
    // Analyze existing content if URL provided
    let contentAnalysis = null;
    if (url) {
      contentAnalysis = await analyzeExistingContent(url);
    }
    
    // Generate multiple title variations
    const titleVariations = generateTitleVariations(keyword, type, tone, contentAnalysis);
    
    // Generate multiple description variations
    const descriptionVariations = generateDescriptionVariations(keyword, description, type, tone, contentAnalysis);
    
    // Generate keyword variations and suggestions
    const keywordSuggestions = generateKeywordSuggestions(keyword, type);
    
    // Analyze and score the generated options
    const analyzedTitles = titleVariations.map(title => analyzeTitle(title, keyword));
    const analyzedDescriptions = descriptionVariations.map(desc => analyzeDescription(desc, keyword));
    
    // Generate recommendations
    const recommendations = generateOptimizationRecommendations(analyzedTitles, analyzedDescriptions, keyword, type);
    
    return {
      titles: analyzedTitles,
      descriptions: analyzedDescriptions,
      keywords: keywordSuggestions,
      recommendations,
      contentAnalysis,
      optimization: {
        bestTitle: getBestOption(analyzedTitles),
        bestDescription: getBestOption(analyzedDescriptions),
        overallScore: calculateOverallScore(analyzedTitles, analyzedDescriptions)
      }
    };

  } catch (error) {
    throw new Error(`Failed to generate meta tags: ${error.message}`);
  }
}

async function analyzeExistingContent(url) {
  try {
    // Validate URL
    let targetUrl = url.startsWith('http') ? url : `https://${url}`;
    new URL(targetUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Meta-Generator/1.0 (+https://linkrank.ai/bot)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        error: `Unable to fetch content: ${response.status}`,
        url: targetUrl
      };
    }

    const html = await response.text();
    
    return analyzePageContent(html, targetUrl);

  } catch (error) {
    return {
      error: error.name === 'AbortError' ? 'Request timeout' : error.message,
      url
    };
  }
}

function analyzePageContent(html, url) {
  // Extract current meta tags
  const currentTitle = extractTitle(html);
  const currentDescription = extractMetaDescription(html);
  const currentKeywords = extractMetaKeywords(html);
  
  // Extract content for analysis
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const wordCount = textContent.split(/\s+/).length;
  const headings = extractHeadings(html);
  
  return {
    url,
    current: {
      title: currentTitle,
      description: currentDescription,
      keywords: currentKeywords
    },
    content: {
      wordCount,
      headings,
      mainTopics: extractMainTopics(textContent),
      readabilityScore: calculateReadabilityScore(textContent)
    },
    analysis: {
      titleOptimization: analyzeTitle(currentTitle || '', ''),
      descriptionOptimization: analyzeDescription(currentDescription || '', ''),
      contentQuality: assessContentQuality(textContent, headings)
    }
  };
}

function extractTitle(html) {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : '';
}

function extractMetaDescription(html) {
  const descMatch = html.match(/<meta\s+name=['""]description['""].*?content=['""]([^'""]*)['""][^>]*>/i);
  return descMatch ? descMatch[1].trim() : '';
}

function extractMetaKeywords(html) {
  const keywordsMatch = html.match(/<meta\s+name=['""]keywords['""].*?content=['""]([^'""]*)['""][^>]*>/i);
  return keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : [];
}

function extractHeadings(html) {
  const headings = {
    h1: [],
    h2: [],
    h3: []
  };
  
  const h1Matches = html.match(/<h1[^>]*>(.*?)<\/h1>/gi) || [];
  const h2Matches = html.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
  const h3Matches = html.match(/<h3[^>]*>(.*?)<\/h3>/gi) || [];
  
  headings.h1 = h1Matches.map(h => h.replace(/<[^>]*>/g, '').trim());
  headings.h2 = h2Matches.map(h => h.replace(/<[^>]*>/g, '').trim());
  headings.h3 = h3Matches.map(h => h.replace(/<[^>]*>/g, '').trim());
  
  return headings;
}

function extractMainTopics(text) {
  // Simple topic extraction based on word frequency
  const words = text.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 4)
    .filter(word => !/^\d+$/.test(word))
    .filter(word => !['about', 'which', 'their', 'would', 'there', 'could', 'other', 'after', 'first', 'never', 'these', 'think', 'where', 'being', 'every', 'great', 'might', 'still', 'should', 'through', 'during', 'before', 'without', 'between', 'under', 'while', 'something', 'nothing', 'everything', 'anything', 'someone', 'everyone', 'anyone', 'please', 'thank', 'thanks'].includes(word));

  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  return Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word, freq]) => ({ word, frequency: freq }));
}

function calculateReadabilityScore(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = words.reduce((total, word) => {
    return total + countSyllables(word);
  }, 0) / words.length;
  
  // Simplified Flesch Reading Ease Score
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

function assessContentQuality(text, headings) {
  let score = 50;
  
  const wordCount = text.split(/\s+/).length;
  
  // Content length scoring
  if (wordCount > 2000) score += 20;
  else if (wordCount > 1000) score += 15;
  else if (wordCount > 500) score += 10;
  else if (wordCount < 300) score -= 15;
  
  // Heading structure scoring
  if (headings.h1.length === 1) score += 10;
  else if (headings.h1.length === 0) score -= 10;
  else score -= 5; // Multiple H1s
  
  if (headings.h2.length > 0) score += 10;
  if (headings.h3.length > 0) score += 5;
  
  return Math.max(0, Math.min(100, score));
}

function generateTitleVariations(keyword, type, tone, contentAnalysis) {
  const titles = [];
  const keywordLower = keyword.toLowerCase();
  
  // Basic keyword-focused titles
  titles.push(`${keyword} - Complete Guide and Tips`);
  titles.push(`Best ${keyword} Solutions for 2024`);
  titles.push(`${keyword}: Everything You Need to Know`);
  
  // Type-specific titles
  switch (type) {
    case 'blog':
      titles.push(`How to Master ${keyword} in 2024`);
      titles.push(`The Ultimate ${keyword} Tutorial`);
      titles.push(`${keyword} Made Simple: A Step-by-Step Guide`);
      titles.push(`Top 10 ${keyword} Tips That Actually Work`);
      break;
      
    case 'product':
      titles.push(`Professional ${keyword} Services`);
      titles.push(`Premium ${keyword} Solutions`);
      titles.push(`Buy ${keyword} - Best Quality & Price`);
      titles.push(`${keyword} for Sale - Expert Quality`);
      break;
      
    case 'service':
      titles.push(`Expert ${keyword} Services`);
      titles.push(`Professional ${keyword} Consulting`);
      titles.push(`${keyword} Services - Get Started Today`);
      titles.push(`Reliable ${keyword} Solutions`);
      break;
      
    case 'local':
      titles.push(`${keyword} Near Me - Local Services`);
      titles.push(`Best ${keyword} in Your Area`);
      titles.push(`Local ${keyword} Experts`);
      titles.push(`${keyword} Services - Local Professionals`);
      break;
      
    default:
      titles.push(`${keyword} - Professional Solutions`);
      titles.push(`Learn ${keyword} - Expert Guide`);
      titles.push(`${keyword} Resources and Tools`);
  }
  
  // Tone adjustments
  if (tone === 'casual') {
    titles.push(`${keyword} Explained Simply`);
    titles.push(`Quick ${keyword} Guide`);
    titles.push(`${keyword} Basics Everyone Should Know`);
  } else if (tone === 'professional') {
    titles.push(`Advanced ${keyword} Strategies`);
    titles.push(`Professional ${keyword} Implementation`);
    titles.push(`${keyword} Best Practices for Businesses`);
  } else if (tone === 'urgent') {
    titles.push(`${keyword} - Act Now!`);
    titles.push(`Don't Miss Out: ${keyword} Opportunities`);
    titles.push(`Limited Time: ${keyword} Solutions`);
  }
  
  // Content-based titles if analysis available
  if (contentAnalysis && contentAnalysis.content) {
    const mainTopics = contentAnalysis.content.mainTopics || [];
    if (mainTopics.length > 0) {
      const topTopic = mainTopics[0].word;
      titles.push(`${keyword} and ${topTopic} - Complete Guide`);
      titles.push(`${topTopic} ${keyword} Solutions`);
    }
  }
  
  return titles.slice(0, 15); // Return top 15 variations
}

function generateDescriptionVariations(keyword, existingDesc, type, tone, contentAnalysis) {
  const descriptions = [];
  const keywordLower = keyword.toLowerCase();
  
  // Use existing description as base if provided
  if (existingDesc && existingDesc.length > 20) {
    descriptions.push(optimizeDescription(existingDesc, keyword));
  }
  
  // Generate new descriptions
  descriptions.push(`Discover comprehensive ${keyword} solutions and expert tips. Learn everything you need to know about ${keyword} with our detailed guide and practical advice.`);
  
  descriptions.push(`Expert ${keyword} services and solutions. Get professional help with ${keyword} implementation, best practices, and optimization strategies for better results.`);
  
  descriptions.push(`Complete ${keyword} guide with step-by-step instructions, tips, and best practices. Start improving your ${keyword} results today with proven strategies.`);
  
  // Type-specific descriptions
  switch (type) {
    case 'blog':
      descriptions.push(`Learn ${keyword} through our comprehensive blog posts, tutorials, and expert insights. Discover tips, tricks, and best practices for ${keyword} success.`);
      descriptions.push(`Stay updated with the latest ${keyword} trends, news, and expert advice. Our blog covers everything from basics to advanced ${keyword} strategies.`);
      break;
      
    case 'product':
      descriptions.push(`Shop premium ${keyword} products with expert quality and competitive prices. Find the perfect ${keyword} solution for your needs with fast shipping and support.`);
      descriptions.push(`Professional-grade ${keyword} products designed for optimal performance. Browse our ${keyword} collection and find exactly what you need.`);
      break;
      
    case 'service':
      descriptions.push(`Professional ${keyword} services from certified experts. Get reliable, high-quality ${keyword} solutions tailored to your specific business needs.`);
      descriptions.push(`Expert ${keyword} consulting and implementation services. Transform your business with our proven ${keyword} strategies and professional support.`);
      break;
      
    case 'local':
      descriptions.push(`Find local ${keyword} experts in your area. Connect with trusted professionals who provide quality ${keyword} services with personalized customer care.`);
      descriptions.push(`Local ${keyword} services from experienced professionals. Get personalized ${keyword} solutions with same-day service and local expertise.`);
      break;
      
    default:
      descriptions.push(`Comprehensive ${keyword} resources, tools, and expert guidance. Everything you need to succeed with ${keyword} in one convenient location.`);
  }
  
  // Tone-specific variations
  if (tone === 'casual') {
    descriptions.push(`Simple ${keyword} tips and tricks that actually work. No complicated jargon - just practical ${keyword} advice you can use right away.`);
  } else if (tone === 'professional') {
    descriptions.push(`Advanced ${keyword} strategies for enterprise-level implementation. Professional consulting and solutions for complex ${keyword} requirements.`);
  } else if (tone === 'urgent') {
    descriptions.push(`Don't wait - get ${keyword} solutions now! Limited-time offers on professional ${keyword} services and expert support.`);
  }
  
  // Content-based descriptions
  if (contentAnalysis && contentAnalysis.content && contentAnalysis.content.mainTopics) {
    const topics = contentAnalysis.content.mainTopics.slice(0, 3).map(t => t.word);
    if (topics.length > 0) {
      descriptions.push(`${keyword} expertise covering ${topics.join(', ')} and more. Professional solutions with proven results and expert support.`);
    }
  }
  
  return descriptions.slice(0, 12); // Return top 12 variations
}

function optimizeDescription(description, keyword) {
  let optimized = description;
  
  // Ensure keyword is included
  if (!optimized.toLowerCase().includes(keyword.toLowerCase())) {
    optimized = `${keyword} - ${optimized}`;
  }
  
  // Truncate if too long
  if (optimized.length > 155) {
    optimized = optimized.substring(0, 152) + '...';
  }
  
  // Ensure minimum length
  if (optimized.length < 120) {
    optimized += ` Get expert ${keyword} solutions and professional support.`;
  }
  
  return optimized;
}

function generateKeywordSuggestions(baseKeyword, type) {
  const suggestions = {
    primary: [],
    longtail: [],
    related: [],
    semantic: []
  };
  
  const keywordLower = baseKeyword.toLowerCase();
  
  // Primary keyword variations
  suggestions.primary = [
    `${baseKeyword} guide`,
    `${baseKeyword} tips`,
    `best ${baseKeyword}`,
    `${baseKeyword} tutorial`,
    `${baseKeyword} help`,
    `${baseKeyword} services`,
    `${baseKeyword} solutions`,
    `${baseKeyword} experts`
  ];
  
  // Long-tail variations
  suggestions.longtail = [
    `how to ${keywordLower}`,
    `${baseKeyword} for beginners`,
    `${baseKeyword} best practices`,
    `${baseKeyword} step by step`,
    `${baseKeyword} complete guide`,
    `${baseKeyword} mistakes to avoid`,
    `${baseKeyword} vs alternatives`,
    `${baseKeyword} cost and pricing`
  ];
  
  // Related terms
  suggestions.related = [
    `${keywordLower} optimization`,
    `${keywordLower} strategy`,
    `${keywordLower} implementation`,
    `${keywordLower} consulting`,
    `${keywordLower} management`,
    `${keywordLower} analysis`,
    `${keywordLower} tools`,
    `${keywordLower} software`
  ];
  
  // Semantic keywords
  suggestions.semantic = [
    `professional ${keywordLower}`,
    `expert ${keywordLower}`,
    `reliable ${keywordLower}`,
    `affordable ${keywordLower}`,
    `quality ${keywordLower}`,
    `custom ${keywordLower}`,
    `advanced ${keywordLower}`,
    `comprehensive ${keywordLower}`
  ];
  
  return suggestions;
}

function analyzeTitle(title, keyword) {
  const analysis = {
    title,
    length: title.length,
    score: 100,
    issues: [],
    strengths: [],
    optimizations: []
  };
  
  // Length analysis
  if (title.length < 30) {
    analysis.issues.push('Title too short (under 30 characters)');
    analysis.score -= 20;
  } else if (title.length > 60) {
    analysis.issues.push('Title too long (over 60 characters)');
    analysis.score -= 15;
  } else {
    analysis.strengths.push('Good title length');
  }
  
  // Keyword presence
  if (keyword && title.toLowerCase().includes(keyword.toLowerCase())) {
    analysis.strengths.push('Contains target keyword');
  } else if (keyword) {
    analysis.issues.push('Missing target keyword');
    analysis.score -= 30;
  }
  
  // Keyword position
  if (keyword && title.toLowerCase().startsWith(keyword.toLowerCase())) {
    analysis.strengths.push('Keyword at beginning');
    analysis.score += 5;
  }
  
  // Title structure
  if (title.includes(' - ') || title.includes(': ') || title.includes(' | ')) {
    analysis.strengths.push('Good title structure');
  }
  
  // Power words
  const powerWords = ['best', 'ultimate', 'complete', 'expert', 'professional', 'advanced', 'proven', 'essential', 'comprehensive'];
  if (powerWords.some(word => title.toLowerCase().includes(word))) {
    analysis.strengths.push('Contains power words');
    analysis.score += 5;
  }
  
  // Generate optimizations
  if (analysis.issues.length > 0) {
    analysis.optimizations = generateTitleOptimizations(title, keyword, analysis.issues);
  }
  
  analysis.score = Math.max(0, analysis.score);
  return analysis;
}

function analyzeDescription(description, keyword) {
  const analysis = {
    description,
    length: description.length,
    score: 100,
    issues: [],
    strengths: [],
    optimizations: []
  };
  
  // Length analysis
  if (description.length < 120) {
    analysis.issues.push('Description too short (under 120 characters)');
    analysis.score -= 20;
  } else if (description.length > 160) {
    analysis.issues.push('Description too long (over 160 characters)');
    analysis.score -= 15;
  } else {
    analysis.strengths.push('Good description length');
  }
  
  // Keyword presence
  if (keyword && description.toLowerCase().includes(keyword.toLowerCase())) {
    analysis.strengths.push('Contains target keyword');
  } else if (keyword) {
    analysis.issues.push('Missing target keyword');
    analysis.score -= 25;
  }
  
  // Call to action
  const ctaWords = ['discover', 'learn', 'get', 'find', 'explore', 'shop', 'buy', 'download', 'try', 'start'];
  if (ctaWords.some(word => description.toLowerCase().includes(word))) {
    analysis.strengths.push('Contains call-to-action');
    analysis.score += 5;
  }
  
  // Benefit words
  const benefitWords = ['expert', 'professional', 'quality', 'reliable', 'proven', 'comprehensive', 'complete', 'advanced'];
  if (benefitWords.some(word => description.toLowerCase().includes(word))) {
    analysis.strengths.push('Highlights benefits');
    analysis.score += 5;
  }
  
  // Generate optimizations
  if (analysis.issues.length > 0) {
    analysis.optimizations = generateDescriptionOptimizations(description, keyword, analysis.issues);
  }
  
  analysis.score = Math.max(0, analysis.score);
  return analysis;
}

function generateTitleOptimizations(title, keyword, issues) {
  const optimizations = [];
  
  if (issues.includes('Title too short (under 30 characters)')) {
    optimizations.push(`Expand title: "${title} - Complete Guide"`);
    optimizations.push(`Add descriptors: "Professional ${title} Services"`);
  }
  
  if (issues.includes('Title too long (over 60 characters)')) {
    optimizations.push(`Shorten to: "${title.substring(0, 57)}..."`);
    optimizations.push('Remove unnecessary words and focus on main keyword');
  }
  
  if (issues.includes('Missing target keyword')) {
    optimizations.push(`Add keyword at start: "${keyword} - ${title}"`);
    optimizations.push(`Integrate keyword: "${title.replace(/\b\w+\b/, keyword)}"`);
  }
  
  return optimizations;
}

function generateDescriptionOptimizations(description, keyword, issues) {
  const optimizations = [];
  
  if (issues.includes('Description too short (under 120 characters)')) {
    optimizations.push(`${description} Get expert guidance and professional support.`);
    optimizations.push(`${description} Discover proven strategies and best practices.`);
  }
  
  if (issues.includes('Description too long (over 160 characters)')) {
    optimizations.push(description.substring(0, 157) + '...');
    optimizations.push('Focus on main benefits and remove less important details');
  }
  
  if (issues.includes('Missing target keyword')) {
    optimizations.push(`${keyword} - ${description}`);
    optimizations.push(description.replace(/\b\w+\b/, keyword));
  }
  
  return optimizations;
}

function getBestOption(options) {
  return options.reduce((best, current) => 
    current.score > best.score ? current : best
  );
}

function calculateOverallScore(titles, descriptions) {
  const avgTitleScore = titles.reduce((sum, t) => sum + t.score, 0) / titles.length;
  const avgDescScore = descriptions.reduce((sum, d) => sum + d.score, 0) / descriptions.length;
  
  return Math.round((avgTitleScore + avgDescScore) / 2);
}

function generateOptimizationRecommendations(titles, descriptions, keyword, type) {
  const recommendations = [];
  
  // Title recommendations
  const avgTitleScore = titles.reduce((sum, t) => sum + t.score, 0) / titles.length;
  if (avgTitleScore < 70) {
    recommendations.push('Focus on including target keyword early in title');
    recommendations.push('Keep title length between 30-60 characters');
    recommendations.push('Use power words to increase click-through rates');
  }
  
  // Description recommendations
  const avgDescScore = descriptions.reduce((sum, d) => sum + d.score, 0) / descriptions.length;
  if (avgDescScore < 70) {
    recommendations.push('Include target keyword in meta description');
    recommendations.push('Keep description length between 120-160 characters');
    recommendations.push('Add compelling call-to-action phrases');
  }
  
  // General recommendations
  recommendations.push('Test different variations to see what performs best');
  recommendations.push('Include emotional triggers and benefit-focused language');
  recommendations.push('Monitor CTR and adjust meta tags based on performance');
  recommendations.push('Ensure meta tags accurately reflect page content');
  
  // Type-specific recommendations
  switch (type) {
    case 'blog':
      recommendations.push('Use "how-to" and educational language in titles');
      recommendations.push('Include publication year for freshness signals');
      break;
    case 'product':
      recommendations.push('Include pricing, benefits, or unique selling points');
      recommendations.push('Use action words like "buy", "shop", "get"');
      break;
    case 'service':
      recommendations.push('Emphasize expertise and professional credentials');
      recommendations.push('Include location for local service businesses');
      break;
    case 'local':
      recommendations.push('Include city/region name for local SEO');
      recommendations.push('Use "near me" variations for local searches');
      break;
  }
  
  return recommendations;
}