export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Set no-cache headers to prevent stale results
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Fetch website with timeout and proper headers
    const startTime = Date.now();
    let fetchResult;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(normalizedUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'LinkRank.ai GEO Bot/1.0 (+https://linkrank.ai)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      const responseTime = Date.now() - startTime;
      
      fetchResult = {
        html,
        status: response.status,
        url: response.url,
        responseTime,
        redirected: normalizedUrl !== response.url
      };
      
    } catch (error) {
      throw new Error(`Failed to fetch website: ${error.message}`);
    }
    
    // Analyze website for GEO factors
    try {
      const analysis = analyzeGEOFactors(fetchResult, normalizedUrl);
      return res.status(200).json(analysis);
    } catch (analysisError) {
      console.error('GEO Analysis function error:', analysisError.message);
      throw new Error(`GEO analysis processing failed: ${analysisError.message}`);
    }
    
  } catch (error) {
    console.error('GEO Analysis error:', error.message);
    
    return res.status(500).json({ 
      error: 'GEO analysis failed', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

function analyzeGEOFactors(fetchResult, originalUrl) {
  const { html, responseTime, url: finalUrl } = fetchResult;
  
  // Extract basic website context
  const domain = finalUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const brandName = domain.split('.')[0];
  
  // Extract title and meta description
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1] : '';
  
  // Extract content for analysis
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Analyze GEO factors
  const structuredDataAnalysis = analyzeStructuredData(html);
  const citationAnalysis = analyzeCitationPotential(html, textContent);
  const factDensityAnalysis = analyzeFactDensity(textContent);
  const authoritySignalAnalysis = analyzeAuthoritySignals(html, textContent);
  const contentExtractionAnalysis = analyzeContentExtraction(html, textContent);
  const citationFormatAnalysis = analyzeCitationFormat(html, textContent);
  const sourceAttributionAnalysis = analyzeSourceAttribution(html);
  const knowledgePanelAnalysis = analyzeKnowledgePanel(html, textContent);
  const aiReadabilityAnalysis = analyzeAIReadability(textContent);
  const trustSignalAnalysis = analyzeTrustSignals(html, finalUrl);
  const entityRecognitionAnalysis = analyzeEntityRecognition(html, textContent);
  const expertiseMarkupAnalysis = analyzeExpertiseMarkup(html);

  // Calculate overall GEO scores
  const structuredDataScore = structuredDataAnalysis.score;
  const citationScore = citationAnalysis.score;
  const authorityScore = authoritySignalAnalysis.score;
  const trustScore = trustSignalAnalysis.score;
  const contentScore = (factDensityAnalysis.score + aiReadabilityAnalysis.score + contentExtractionAnalysis.score) / 3;
  const expertiseScore = expertiseMarkupAnalysis.score;

  const overallGEOScore = Math.round(
    (structuredDataScore + citationScore + authorityScore + trustScore + contentScore + expertiseScore) / 6
  );

  // Generate comprehensive analysis results
  const websiteContext = {
    domain: domain || 'unknown',
    brandName: capitalizeFirst(brandName) || 'Unknown',
    primaryKeyword: extractPrimaryKeyword(textContent, title) || 'services',
    industry: detectIndustryFromContent(textContent) || 'business'
  };

  return {
    url: finalUrl,
    original_url: originalUrl,
    timestamp: new Date().toISOString(),
    response_time: responseTime,
    overall_geo_score: overallGEOScore,
    
    analysis: {
      structured_data: generateStructuredDataResults(structuredDataAnalysis, websiteContext),
      citation_potential: generateCitationResults(citationAnalysis, websiteContext),
      authority_signals: generateAuthorityResults(authoritySignalAnalysis, websiteContext),
      trust_signals: generateTrustResults(trustSignalAnalysis, websiteContext),
      content_optimization: generateContentOptimizationResults({
        factDensity: factDensityAnalysis,
        aiReadability: aiReadabilityAnalysis,
        contentExtraction: contentExtractionAnalysis,
        citationFormat: citationFormatAnalysis,
        knowledgePanel: knowledgePanelAnalysis
      }, websiteContext),
      expertise_markup: generateExpertiseResults(expertiseMarkupAnalysis, websiteContext)
    },

    // Legacy compatibility format
    geo_audit: {
      structured_data: structuredDataAnalysis,
      citation_potential: citationAnalysis,
      fact_density: factDensityAnalysis,
      authority_signals: authoritySignalAnalysis,
      trust_signals: trustSignalAnalysis,
      ai_readability: aiReadabilityAnalysis
    },

    metadata: {
      title: title,
      description: metaDescription,
      wordCount: textContent.split(/\s+/).length,
      domain: domain,
      brandName: websiteContext.brandName,
      industry: websiteContext.industry
    }
  };
}

// Structured Data Analysis
function analyzeStructuredData(html) {
  const hasJsonLd = html.includes('application/ld+json');
  const hasMicrodata = html.includes('itemscope') || html.includes('itemtype');
  const hasRDFa = html.includes('typeof=') || html.includes('property=');
  
  // Extract JSON-LD schemas
  const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const schemaTypes = [];
  
  jsonLdMatches.forEach(match => {
    try {
      const data = JSON.parse(match[1]);
      if (data['@type']) {
        schemaTypes.push(data['@type']);
      }
    } catch (e) {
      // Invalid JSON-LD
    }
  });

  const hasOrganizationSchema = schemaTypes.includes('Organization') || schemaTypes.includes('LocalBusiness');
  const hasPersonSchema = schemaTypes.includes('Person');
  const hasArticleSchema = schemaTypes.includes('Article') || schemaTypes.includes('BlogPosting');
  const hasFAQSchema = schemaTypes.includes('FAQPage');
  const hasProductSchema = schemaTypes.includes('Product');
  const hasReviewSchema = schemaTypes.includes('Review');

  let score = 0;
  if (hasJsonLd) score += 30;
  if (hasMicrodata) score += 10;
  if (hasRDFa) score += 10;
  if (hasOrganizationSchema) score += 15;
  if (hasPersonSchema) score += 10;
  if (hasArticleSchema) score += 10;
  if (hasFAQSchema) score += 10;
  if (hasProductSchema) score += 5;

  return {
    score: Math.min(100, score),
    hasJsonLd,
    hasMicrodata,
    hasRDFa,
    schemaTypes,
    hasOrganizationSchema,
    hasPersonSchema,
    hasArticleSchema,
    hasFAQSchema,
    hasProductSchema,
    hasReviewSchema
  };
}

// Citation Potential Analysis
function analyzeCitationPotential(html, textContent) {
  // Look for factual statements, statistics, quotes
  const statisticsPattern = /\b\d+(\.\d+)?%|\b\d{1,3}(,\d{3})*(\.\d+)?\s*(million|billion|thousand|users|people|customers|years|months)/gi;
  const statisticsCount = (textContent.match(statisticsPattern) || []).length;
  
  const quotesPattern = /"[^"]{20,200}"/g;
  const quotesCount = (textContent.match(quotesPattern) || []).length;
  
  const factualPattern = /according to|research shows|study found|data indicates|statistics show|survey revealed/gi;
  const factualIndicators = (textContent.match(factualPattern) || []).length;
  
  // Check for data tables and lists
  const tablesCount = (html.match(/<table[^>]*>/gi) || []).length;
  const listsCount = (html.match(/<[uo]l[^>]*>/gi) || []).length;
  
  // Check for date stamps and recency
  const datePattern = /\b(202[0-9]|201[0-9])\b/g;
  const recentDates = (textContent.match(datePattern) || []).length;
  
  let score = 0;
  score += Math.min(25, statisticsCount * 5);
  score += Math.min(20, factualIndicators * 10);
  score += Math.min(15, quotesCount * 3);
  score += Math.min(20, tablesCount * 10);
  score += Math.min(10, listsCount * 2);
  score += Math.min(10, recentDates * 2);

  return {
    score: Math.min(100, score),
    statisticsCount,
    quotesCount,
    factualIndicators,
    tablesCount,
    listsCount,
    recentDates
  };
}

// Fact Density Analysis
function analyzeFactDensity(textContent) {
  const words = textContent.split(/\s+/).length;
  
  // Count verifiable facts
  const numberPattern = /\b\d+(\.\d+)?(%|million|billion|thousand|years|months|days)?\b/g;
  const numbersCount = (textContent.match(numberPattern) || []).length;
  
  const definitionPattern = /\b(is|are|was|were)\s+[a-z]/gi;
  const definitionsCount = (textContent.match(definitionPattern) || []).length;
  
  const specificTermsPattern = /\b(established|founded|launched|created|developed|invented|discovered)\s+in\s+\d{4}/gi;
  const specificTermsCount = (textContent.match(specificTermsPattern) || []).length;
  
  const factDensity = words > 0 ? ((numbersCount + definitionsCount + specificTermsCount) / words) * 100 : 0;
  
  let score = 0;
  if (factDensity > 5) score = 100;
  else if (factDensity > 3) score = 80;
  else if (factDensity > 2) score = 60;
  else if (factDensity > 1) score = 40;
  else score = 20;

  return {
    score,
    factDensity: Math.round(factDensity * 100) / 100,
    numbersCount,
    definitionsCount,
    specificTermsCount,
    totalWords: words
  };
}

// Authority Signals Analysis
function analyzeAuthoritySignals(html, textContent) {
  const hasAuthorInfo = html.includes('author') || html.includes('by ') || textContent.includes('written by');
  const hasBiography = textContent.includes('biography') || textContent.includes('bio') || textContent.includes('about the author');
  const hasCredentials = textContent.includes('PhD') || textContent.includes('MD') || textContent.includes('certified') || textContent.includes('expert');
  const hasAwards = textContent.includes('award') || textContent.includes('recognition') || textContent.includes('achievement');
  const hasExperience = textContent.includes('years of experience') || textContent.includes('decades') || textContent.includes('veteran');
  const hasPublications = textContent.includes('published') || textContent.includes('research') || textContent.includes('study');
  const hasAffiliations = textContent.includes('university') || textContent.includes('institute') || textContent.includes('organization');
  
  // Check for authority schema markup
  const hasAuthorSchema = html.includes('"@type": "Person"') || html.includes('itemtype="http://schema.org/Person"');
  const hasOrganizationSchema = html.includes('"@type": "Organization"') || html.includes('itemtype="http://schema.org/Organization"');
  
  let score = 0;
  if (hasAuthorInfo) score += 15;
  if (hasBiography) score += 10;
  if (hasCredentials) score += 20;
  if (hasAwards) score += 15;
  if (hasExperience) score += 10;
  if (hasPublications) score += 15;
  if (hasAffiliations) score += 10;
  if (hasAuthorSchema) score += 10;
  if (hasOrganizationSchema) score += 5;

  return {
    score: Math.min(100, score),
    hasAuthorInfo,
    hasBiography,
    hasCredentials,
    hasAwards,
    hasExperience,
    hasPublications,
    hasAffiliations,
    hasAuthorSchema,
    hasOrganizationSchema
  };
}

// Content Extraction Analysis
function analyzeContentExtraction(html, textContent) {
  // Check for clear headings structure
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;
  
  // Check for paragraph structure
  const paragraphCount = (html.match(/<p[^>]*>/gi) || []).length;
  const averageParagraphLength = paragraphCount > 0 ? textContent.length / paragraphCount : 0;
  
  // Check for lists and structured content
  const listsCount = (html.match(/<[uo]l[^>]*>/gi) || []).length;
  const tablesCount = (html.match(/<table[^>]*>/gi) || []).length;
  
  // Check for semantic HTML
  const hasMain = html.includes('<main');
  const hasArticle = html.includes('<article');
  const hasSection = html.includes('<section');
  
  let score = 0;
  if (h1Count === 1) score += 20;
  if (h2Count >= 2) score += 15;
  if (h3Count >= 1) score += 10;
  if (paragraphCount >= 3) score += 15;
  if (averageParagraphLength > 50 && averageParagraphLength < 200) score += 10;
  if (listsCount >= 1) score += 10;
  if (tablesCount >= 1) score += 5;
  if (hasMain || hasArticle || hasSection) score += 15;

  return {
    score: Math.min(100, score),
    h1Count,
    h2Count,
    h3Count,
    paragraphCount,
    averageParagraphLength: Math.round(averageParagraphLength),
    listsCount,
    tablesCount,
    hasSemanticHTML: hasMain || hasArticle || hasSection
  };
}

// Citation Format Analysis
function analyzeCitationFormat(html, textContent) {
  // Check for proper heading hierarchy
  const headingHierarchy = checkHeadingHierarchy(html);
  
  // Check for short, extractable paragraphs
  const paragraphs = textContent.split(/\n\s*\n/);
  const shortParagraphs = paragraphs.filter(p => p.length > 50 && p.length < 300).length;
  const totalParagraphs = paragraphs.length;
  
  // Check for bullet points and numbered lists
  const bulletPoints = (html.match(/<li[^>]*>/gi) || []).length;
  
  // Check for clear topic sentences
  const sentencePattern = /[.!?]+\s+[A-Z]/g;
  const sentences = textContent.split(sentencePattern);
  const clearSentences = sentences.filter(s => s.length > 20 && s.length < 150).length;
  
  let score = 0;
  if (headingHierarchy) score += 25;
  if (totalParagraphs > 0 && (shortParagraphs / totalParagraphs) > 0.6) score += 25;
  if (bulletPoints >= 3) score += 20;
  if (clearSentences >= 5) score += 30;

  return {
    score: Math.min(100, score),
    headingHierarchy,
    shortParagraphsRatio: totalParagraphs > 0 ? Math.round((shortParagraphs / totalParagraphs) * 100) : 0,
    bulletPoints,
    clearSentences
  };
}

// Source Attribution Analysis
function analyzeSourceAttribution(html) {
  const externalLinksCount = (html.match(/<a[^>]*href=["']https?:\/\/[^"']*["'][^>]*>/gi) || []).length;
  const referencesPattern = /\[(.*?)\]|\(.*?\)|source:|reference:|according to/gi;
  const referencesCount = (html.match(referencesPattern) || []).length;
  
  const hasCitations = html.includes('cite>') || html.includes('citation') || html.includes('bibliography');
  const hasFootnotes = html.includes('footnote') || html.includes('endnote');
  
  let score = 0;
  if (externalLinksCount >= 3) score += 30;
  else if (externalLinksCount >= 1) score += 15;
  
  if (referencesCount >= 5) score += 25;
  else if (referencesCount >= 2) score += 15;
  
  if (hasCitations) score += 25;
  if (hasFootnotes) score += 20;

  return {
    score: Math.min(100, score),
    externalLinksCount,
    referencesCount,
    hasCitations,
    hasFootnotes
  };
}

// Knowledge Panel Analysis
function analyzeKnowledgePanel(html, textContent) {
  // Check for entity information
  const hasContactInfo = html.includes('contact') || html.includes('phone') || html.includes('email');
  const hasAddress = html.includes('address') || textContent.includes('located') || textContent.includes('headquarters');
  const hasBusinessHours = textContent.includes('hours') || textContent.includes('open') || textContent.includes('closed');
  const hasFoundingInfo = textContent.includes('founded') || textContent.includes('established') || textContent.includes('since');
  
  // Check for key facts
  const hasKeyFacts = textContent.includes('fact') || textContent.includes('key information') || textContent.includes('overview');
  const hasStats = textContent.includes('employees') || textContent.includes('revenue') || textContent.includes('customers');
  
  let score = 0;
  if (hasContactInfo) score += 20;
  if (hasAddress) score += 15;
  if (hasBusinessHours) score += 10;
  if (hasFoundingInfo) score += 20;
  if (hasKeyFacts) score += 20;
  if (hasStats) score += 15;

  return {
    score: Math.min(100, score),
    hasContactInfo,
    hasAddress,
    hasBusinessHours,
    hasFoundingInfo,
    hasKeyFacts,
    hasStats
  };
}

// AI Readability Analysis
function analyzeAIReadability(textContent) {
  const words = textContent.split(/\s+/).length;
  const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const averageWordsPerSentence = sentences > 0 ? words / sentences : 0;
  
  // Check for complex words (3+ syllables)
  const complexWords = textContent.match(/\b\w{8,}\b/g) || [];
  const complexWordRatio = words > 0 ? (complexWords.length / words) * 100 : 0;
  
  // Check for transition words and clear structure
  const transitionWords = textContent.match(/\b(however|therefore|furthermore|meanwhile|consequently|additionally|moreover)\b/gi) || [];
  
  let score = 0;
  if (averageWordsPerSentence >= 10 && averageWordsPerSentence <= 20) score += 30;
  else if (averageWordsPerSentence <= 25) score += 20;
  
  if (complexWordRatio < 15) score += 25;
  else if (complexWordRatio < 25) score += 15;
  
  if (transitionWords.length >= 3) score += 25;
  if (words >= 300) score += 20;

  return {
    score: Math.min(100, score),
    averageWordsPerSentence: Math.round(averageWordsPerSentence),
    complexWordRatio: Math.round(complexWordRatio),
    transitionWordsCount: transitionWords.length,
    totalWords: words,
    totalSentences: sentences
  };
}

// Trust Signals Analysis
function analyzeTrustSignals(html, url) {
  const hasSSL = url.startsWith('https://');
  const hasPrivacyPolicy = html.includes('privacy policy') || html.includes('privacy');
  const hasTermsOfService = html.includes('terms of service') || html.includes('terms');
  const hasContactPage = html.includes('contact') || html.includes('about');
  const hasAboutPage = html.includes('about us') || html.includes('about');
  
  const hasSocialProof = html.includes('testimonial') || html.includes('review') || html.includes('rating');
  const hasTrustBadges = html.includes('secure') || html.includes('verified') || html.includes('certified');
  
  // Check for professional email
  const emailPattern = /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = html.match(emailPattern) || [];
  const hasProfessionalEmail = emails.some(email => !email.includes('@gmail.com') && !email.includes('@yahoo.com'));
  
  let score = 0;
  if (hasSSL) score += 20;
  if (hasPrivacyPolicy) score += 15;
  if (hasTermsOfService) score += 10;
  if (hasContactPage) score += 15;
  if (hasAboutPage) score += 10;
  if (hasSocialProof) score += 15;
  if (hasTrustBadges) score += 10;
  if (hasProfessionalEmail) score += 5;

  return {
    score: Math.min(100, score),
    hasSSL,
    hasPrivacyPolicy,
    hasTermsOfService,
    hasContactPage,
    hasAboutPage,
    hasSocialProof,
    hasTrustBadges,
    hasProfessionalEmail
  };
}

// Entity Recognition Analysis
function analyzeEntityRecognition(html, textContent) {
  // Check for proper entity markup
  const hasPersonMarkup = html.includes('itemprop="name"') || html.includes('"@type": "Person"');
  const hasOrganizationMarkup = html.includes('"@type": "Organization"') || html.includes('itemprop="organization"');
  const hasPlaceMarkup = html.includes('"@type": "Place"') || html.includes('itemprop="address"');
  
  // Check for capitalized entities (proper nouns)
  const properNouns = textContent.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
  const uniqueEntities = [...new Set(properNouns)].length;
  
  // Check for entity descriptions
  const hasEntityDescriptions = textContent.includes('CEO') || textContent.includes('founder') || textContent.includes('president');
  
  let score = 0;
  if (hasPersonMarkup) score += 25;
  if (hasOrganizationMarkup) score += 25;
  if (hasPlaceMarkup) score += 20;
  if (uniqueEntities >= 10) score += 20;
  else if (uniqueEntities >= 5) score += 10;
  if (hasEntityDescriptions) score += 10;

  return {
    score: Math.min(100, score),
    hasPersonMarkup,
    hasOrganizationMarkup,
    hasPlaceMarkup,
    uniqueEntities,
    hasEntityDescriptions
  };
}

// Expertise Markup Analysis
function analyzeExpertiseMarkup(html) {
  const hasAuthorSchema = html.includes('"@type": "Person"') && html.includes('author');
  const hasOrganizationSchema = html.includes('"@type": "Organization"');
  const hasCredentials = html.includes('jobTitle') || html.includes('qualification');
  const hasExpertiseMarkup = html.includes('expertise') || html.includes('specialization');
  
  const hasReviewSchema = html.includes('"@type": "Review"');
  const hasRatingSchema = html.includes('ratingValue') || html.includes('aggregateRating');
  
  let score = 0;
  if (hasAuthorSchema) score += 30;
  if (hasOrganizationSchema) score += 20;
  if (hasCredentials) score += 25;
  if (hasExpertiseMarkup) score += 15;
  if (hasReviewSchema) score += 5;
  if (hasRatingSchema) score += 5;

  return {
    score: Math.min(100, score),
    hasAuthorSchema,
    hasOrganizationSchema,
    hasCredentials,
    hasExpertiseMarkup,
    hasReviewSchema,
    hasRatingSchema
  };
}

// Helper functions
function capitalizeFirst(str) {
  if (!str || typeof str !== 'string') return 'Unknown';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function extractPrimaryKeyword(textContent, title) {
  const words = (title + ' ' + textContent).toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && word.length < 15);
  
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  const topWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
  
  return topWords[0] || 'services';
}

function detectIndustryFromContent(textContent) {
  if (!textContent || typeof textContent !== 'string') return 'business';
  const combined = textContent.toLowerCase();
  
  const industries = {
    'healthcare': ['health', 'medical', 'doctor', 'clinic', 'hospital', 'treatment'],
    'legal': ['law', 'legal', 'attorney', 'lawyer', 'court', 'justice'],
    'restaurant': ['restaurant', 'food', 'dining', 'cuisine', 'menu', 'chef'],
    'real estate': ['real estate', 'property', 'homes', 'houses', 'buying', 'selling'],
    'technology': ['technology', 'software', 'development', 'digital', 'tech'],
    'finance': ['finance', 'financial', 'investment', 'banking', 'money'],
    'education': ['education', 'school', 'learning', 'training', 'course'],
    'retail': ['shop', 'store', 'retail', 'products', 'merchandise'],
    'automotive': ['car', 'auto', 'vehicle', 'automotive', 'repair'],
    'fitness': ['fitness', 'gym', 'workout', 'exercise', 'training']
  };
  
  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some(keyword => combined.includes(keyword))) {
      return industry;
    }
  }
  
  return 'business';
}

function checkHeadingHierarchy(html) {
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  const hasH2 = html.includes('<h2');
  return h1Count === 1 && hasH2;
}

// Results generation functions
function generateStructuredDataResults(analysis, websiteContext) {
  return {
    score: analysis.score,
    results: [
      {
        label: 'JSON-LD Schema Markup',
        description: 'JSON-LD structured data helps AI systems understand your content context and extract factual information accurately.',
        score: analysis.hasJsonLd ? 100 : 0,
        current: analysis.hasJsonLd ? `Schema types found: ${analysis.schemaTypes.join(', ') || 'Basic markup'}` : 'No JSON-LD found',
        path: analysis.hasJsonLd ? 'HTML head section' : 'Missing',
        issues: analysis.hasJsonLd ? [] : ['Missing JSON-LD structured data'],
        recommendations: analysis.hasJsonLd ? ['JSON-LD schema is properly implemented'] : ['Add JSON-LD structured data for better AI understanding'],
        practicalExample: analysis.hasJsonLd ? null : `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${websiteContext.brandName}",
  "url": "${websiteContext.domain}",
  "description": "Professional ${websiteContext.industry} services"
}
</script>`
      },
      {
        label: 'Organization Schema',
        description: 'Organization schema helps AI systems identify your business entity and extract key business information.',
        score: analysis.hasOrganizationSchema ? 100 : 0,
        current: analysis.hasOrganizationSchema ? 'Organization schema detected' : 'No organization schema',
        path: analysis.hasOrganizationSchema ? 'Structured data' : 'Missing',
        issues: analysis.hasOrganizationSchema ? [] : ['Missing organization schema markup'],
        recommendations: analysis.hasOrganizationSchema ? ['Organization schema properly configured'] : ['Add organization schema for business entity recognition'],
        practicalExample: analysis.hasOrganizationSchema ? null : `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${websiteContext.brandName}",
  "description": "Leading ${websiteContext.industry} company",
  "foundingDate": "YYYY-MM-DD",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "City",
    "addressRegion": "State"
  }
}`
      },
      {
        label: 'FAQ Schema',
        description: 'FAQ schema markup makes your Q&A content easily extractable by AI systems for direct answers.',
        score: analysis.hasFAQSchema ? 100 : 40,
        current: analysis.hasFAQSchema ? 'FAQ schema found' : 'No FAQ schema detected',
        path: analysis.hasFAQSchema ? 'Page content' : 'Missing',
        issues: analysis.hasFAQSchema ? [] : ['Consider adding FAQ schema for better AI extraction'],
        recommendations: analysis.hasFAQSchema ? ['FAQ schema enhances AI extractability'] : ['Add FAQ schema markup for common questions'],
        practicalExample: analysis.hasFAQSchema ? null : `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is ${websiteContext.primaryKeyword}?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Clear, factual answer about ${websiteContext.primaryKeyword}."
    }
  }]
}`
      }
    ]
  };
}

function generateCitationResults(analysis, websiteContext) {
  return {
    score: analysis.score,
    results: [
      {
        label: 'Statistical Content',
        description: 'Statistics and data points make your content more citable by AI systems looking for factual information.',
        score: analysis.statisticsCount >= 5 ? 100 : analysis.statisticsCount >= 2 ? 70 : 30,
        current: `${analysis.statisticsCount} statistics found`,
        path: 'Throughout content',
        issues: analysis.statisticsCount < 3 ? ['Limited statistical content for citations'] : [],
        recommendations: analysis.statisticsCount >= 5 ? ['Excellent statistical content for AI citations'] : ['Add more statistics and data points for better citation potential'],
        practicalExample: analysis.statisticsCount < 3 ? `<p>Our ${websiteContext.primaryKeyword} services have helped over 1,000 clients achieve 95% satisfaction rates, with average project completion in 30 days.</p>` : null
      },
      {
        label: 'Factual Indicators',
        description: 'Clear factual language signals to AI systems that your content contains reliable, citable information.',
        score: analysis.factualIndicators >= 3 ? 100 : analysis.factualIndicators >= 1 ? 60 : 20,
        current: `${analysis.factualIndicators} factual indicators found`,
        path: 'Content language',
        issues: analysis.factualIndicators < 2 ? ['Limited factual language for AI citation'] : [],
        recommendations: analysis.factualIndicators >= 3 ? ['Strong factual language for AI systems'] : ['Use more phrases like "research shows", "data indicates", "according to"'],
        practicalExample: analysis.factualIndicators < 2 ? `<p>According to industry research, ${websiteContext.primaryKeyword} solutions show a 40% improvement in efficiency. Data indicates that companies implementing these strategies see measurable results within 6 months.</p>` : null
      },
      {
        label: 'Structured Data Tables',
        description: 'Data tables provide structured information that AI systems can easily extract and cite.',
        score: analysis.tablesCount >= 2 ? 100 : analysis.tablesCount >= 1 ? 70 : 30,
        current: `${analysis.tablesCount} data tables found`,
        path: 'Page structure',
        issues: analysis.tablesCount === 0 ? ['No data tables for structured information'] : [],
        recommendations: analysis.tablesCount >= 2 ? ['Good use of structured data tables'] : ['Add data tables to present information in AI-friendly format'],
        practicalExample: analysis.tablesCount === 0 ? `<table>
  <tr><th>Service Type</th><th>Duration</th><th>Success Rate</th></tr>
  <tr><td>${websiteContext.primaryKeyword} Basic</td><td>2-4 weeks</td><td>92%</td></tr>
  <tr><td>${websiteContext.primaryKeyword} Premium</td><td>4-8 weeks</td><td>98%</td></tr>
</table>` : null
      }
    ]
  };
}

function generateAuthorityResults(analysis, websiteContext) {
  return {
    score: analysis.score,
    results: [
      {
        label: 'Author Information',
        description: 'Clear author attribution increases content credibility for AI citation systems.',
        score: analysis.hasAuthorInfo ? (analysis.hasAuthorSchema ? 100 : 70) : 20,
        current: analysis.hasAuthorInfo ? 'Author information present' : 'No author information',
        path: analysis.hasAuthorInfo ? 'Content bylines' : 'Missing',
        issues: analysis.hasAuthorInfo ? (analysis.hasAuthorSchema ? [] : ['Author info could use schema markup']) : ['Missing author attribution'],
        recommendations: analysis.hasAuthorInfo ? (analysis.hasAuthorSchema ? ['Excellent author attribution with schema'] : ['Add author schema markup']) : ['Add clear author bylines and credentials'],
        practicalExample: !analysis.hasAuthorInfo ? `<div itemscope itemtype="http://schema.org/Person">
  <span itemprop="name">Dr. Jane Smith</span>, 
  <span itemprop="jobTitle">Senior ${websiteContext.industry} Consultant</span>
  <span itemprop="description">15+ years experience in ${websiteContext.primaryKeyword}</span>
</div>` : null
      },
      {
        label: 'Professional Credentials',
        description: 'Credentials and certifications signal expertise to AI systems evaluating content authority.',
        score: analysis.hasCredentials ? 100 : 30,
        current: analysis.hasCredentials ? 'Professional credentials found' : 'No credentials mentioned',
        path: analysis.hasCredentials ? 'Author sections' : 'Missing',
        issues: analysis.hasCredentials ? [] : ['No visible professional credentials'],
        recommendations: analysis.hasCredentials ? ['Strong credential presentation'] : ['Add author credentials, certifications, or professional qualifications'],
        practicalExample: !analysis.hasCredentials ? `<p>Written by our certified ${websiteContext.industry} experts with advanced degrees and 10+ years of industry experience. Our team holds professional certifications in ${websiteContext.primaryKeyword}.</p>` : null
      },
      {
        label: 'Experience Indicators',
        description: 'Experience indicators help AI systems assess the reliability of your content sources.',
        score: analysis.hasExperience ? 100 : 40,
        current: analysis.hasExperience ? 'Experience indicators present' : 'Limited experience information',
        path: analysis.hasExperience ? 'Content body' : 'Missing',
        issues: analysis.hasExperience ? [] : ['Add more experience indicators'],
        recommendations: analysis.hasExperience ? ['Good experience documentation'] : ['Include years of experience, track record, or case studies'],
        practicalExample: !analysis.hasExperience ? `<p>With over 15 years of experience in ${websiteContext.industry}, our ${websiteContext.brandName} team has successfully delivered ${websiteContext.primaryKeyword} solutions to Fortune 500 companies.</p>` : null
      }
    ]
  };
}

function generateTrustResults(analysis, websiteContext) {
  return {
    score: analysis.score,
    results: [
      {
        label: 'SSL Security',
        description: 'HTTPS encryption is a basic trust signal that AI systems check when evaluating source credibility.',
        score: analysis.hasSSL ? 100 : 0,
        current: analysis.hasSSL ? 'Secure HTTPS connection' : 'Insecure HTTP connection',
        path: 'URL protocol',
        issues: analysis.hasSSL ? [] : ['Site not using HTTPS encryption'],
        recommendations: analysis.hasSSL ? ['SSL properly configured'] : ['Install SSL certificate immediately for credibility'],
        practicalExample: analysis.hasSSL ? null : 'Redirect all HTTP traffic to HTTPS and install a valid SSL certificate'
      },
      {
        label: 'Privacy & Legal Pages',
        description: 'Privacy policies and terms of service indicate transparency, which AI systems value for source credibility.',
        score: (analysis.hasPrivacyPolicy && analysis.hasTermsOfService) ? 100 : analysis.hasPrivacyPolicy ? 60 : 20,
        current: `Privacy Policy: ${analysis.hasPrivacyPolicy ? 'Yes' : 'No'}, Terms: ${analysis.hasTermsOfService ? 'Yes' : 'No'}`,
        path: analysis.hasPrivacyPolicy || analysis.hasTermsOfService ? 'Footer links' : 'Missing',
        issues: (!analysis.hasPrivacyPolicy || !analysis.hasTermsOfService) ? ['Missing legal/privacy pages'] : [],
        recommendations: (analysis.hasPrivacyPolicy && analysis.hasTermsOfService) ? ['Complete legal page coverage'] : ['Add missing privacy policy and terms of service'],
        practicalExample: !analysis.hasPrivacyPolicy ? `<footer>
  <a href="/privacy-policy">Privacy Policy</a> | 
  <a href="/terms-of-service">Terms of Service</a> |
  <a href="/contact">Contact Us</a>
</footer>` : null
      },
      {
        label: 'Contact Information',
        description: 'Clear contact information builds trust and helps AI systems verify source legitimacy.',
        score: analysis.hasContactPage ? (analysis.hasProfessionalEmail ? 100 : 70) : 30,
        current: analysis.hasContactPage ? 'Contact information available' : 'Limited contact information',
        path: analysis.hasContactPage ? 'Contact sections' : 'Missing',
        issues: !analysis.hasContactPage ? ['Missing contact information'] : (!analysis.hasProfessionalEmail ? ['Consider professional email domain'] : []),
        recommendations: analysis.hasContactPage ? (analysis.hasProfessionalEmail ? ['Excellent contact transparency'] : ['Contact info present, consider professional email']) : ['Add comprehensive contact information'],
        practicalExample: !analysis.hasContactPage ? `<section>
  <h3>Contact ${websiteContext.brandName}</h3>
  <p>Email: info@${websiteContext.domain}</p>
  <p>Phone: (555) 123-4567</p>
  <p>Address: 123 Business St, City, State 12345</p>
</section>` : null
      }
    ]
  };
}

function generateContentOptimizationResults(analyses, websiteContext) {
  const { factDensity, aiReadability, contentExtraction, citationFormat, knowledgePanel } = analyses;
  
  const averageScore = Math.round(
    (factDensity.score + aiReadability.score + contentExtraction.score + citationFormat.score + knowledgePanel.score) / 5
  );

  return {
    score: averageScore,
    results: [
      {
        label: 'Fact Density',
        description: 'High fact density makes your content more valuable for AI systems seeking specific information.',
        score: factDensity.score,
        current: `${factDensity.factDensity}% fact density (${factDensity.numbersCount + factDensity.definitionsCount} facts in ${factDensity.totalWords} words)`,
        path: 'Content analysis',
        issues: factDensity.score < 60 ? ['Low fact density for AI extraction'] : [],
        recommendations: factDensity.score >= 80 ? ['Excellent fact density for AI systems'] : ['Increase specific facts, numbers, and verifiable claims'],
        practicalExample: factDensity.score < 60 ? `<p>${websiteContext.brandName} was established in 2010 and has served over 500 clients. Our ${websiteContext.primaryKeyword} services achieve 95% customer satisfaction with average project completion in 30 days.</p>` : null
      },
      {
        label: 'AI Readability',
        description: 'Content structure optimized for AI processing improves extraction and citation potential.',
        score: aiReadability.score,
        current: `${aiReadability.averageWordsPerSentence} words/sentence, ${aiReadability.complexWordRatio}% complex words`,
        path: 'Writing style',
        issues: aiReadability.score < 70 ? ['Content structure could be more AI-friendly'] : [],
        recommendations: aiReadability.score >= 80 ? ['Optimal structure for AI processing'] : ['Use shorter sentences and clearer language for better AI comprehension'],
        practicalExample: aiReadability.score < 70 ? `<p>What is ${websiteContext.primaryKeyword}? ${websiteContext.primaryKeyword} is a proven solution that helps businesses achieve their goals. It works by providing structured approaches to common challenges.</p>` : null
      },
      {
        label: 'Content Extraction',
        description: 'Proper heading structure and semantic markup help AI systems extract information accurately.',
        score: contentExtraction.score,
        current: `H1: ${contentExtraction.h1Count}, H2: ${contentExtraction.h2Count}, Semantic HTML: ${contentExtraction.hasSemanticHTML ? 'Yes' : 'No'}`,
        path: 'Document structure',
        issues: contentExtraction.score < 70 ? ['Document structure needs improvement for AI extraction'] : [],
        recommendations: contentExtraction.score >= 80 ? ['Excellent document structure for AI'] : ['Improve heading hierarchy and use semantic HTML elements'],
        practicalExample: contentExtraction.score < 70 ? `<main>
  <h1>Complete Guide to ${websiteContext.primaryKeyword}</h1>
  <section>
    <h2>What is ${websiteContext.primaryKeyword}?</h2>
    <p>Clear definition and explanation...</p>
  </section>
  <section>
    <h2>Benefits of ${websiteContext.primaryKeyword}</h2>
    <ul><li>Benefit 1</li><li>Benefit 2</li></ul>
  </section>
</main>` : null
      }
    ]
  };
}

function generateExpertiseResults(analysis, websiteContext) {
  return {
    score: analysis.score,
    results: [
      {
        label: 'Author Schema Markup',
        description: 'Author schema markup helps AI systems identify and verify content creators for credibility assessment.',
        score: analysis.hasAuthorSchema ? 100 : 30,
        current: analysis.hasAuthorSchema ? 'Author schema present' : 'No author schema markup',
        path: analysis.hasAuthorSchema ? 'Structured data' : 'Missing',
        issues: analysis.hasAuthorSchema ? [] : ['Missing author schema markup'],
        recommendations: analysis.hasAuthorSchema ? ['Author schema properly implemented'] : ['Add schema markup for content authors'],
        practicalExample: !analysis.hasAuthorSchema ? `{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Expert Name",
  "jobTitle": "Senior ${websiteContext.industry} Specialist",
  "worksFor": {
    "@type": "Organization",
    "name": "${websiteContext.brandName}"
  },
  "knowsAbout": "${websiteContext.primaryKeyword}"
}` : null
      },
      {
        label: 'Professional Credentials',
        description: 'Structured credential information helps AI systems verify author expertise and content reliability.',
        score: analysis.hasCredentials ? 100 : 40,
        current: analysis.hasCredentials ? 'Credentials markup found' : 'No structured credentials',
        path: analysis.hasCredentials ? 'Author sections' : 'Missing',
        issues: analysis.hasCredentials ? [] : ['Add structured credential information'],
        recommendations: analysis.hasCredentials ? ['Good credential documentation'] : ['Include professional qualifications and certifications in structured format'],
        practicalExample: !analysis.hasCredentials ? `<div itemscope itemtype="http://schema.org/Person">
  <span itemprop="name">Dr. Sarah Johnson</span>
  <span itemprop="jobTitle">Certified ${websiteContext.industry} Expert</span>
  <span itemprop="hasCredential">MBA, PMP Certified</span>
  <span itemprop="alumniOf">Harvard Business School</span>
</div>` : null
      }
    ]
  };
}