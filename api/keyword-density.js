export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Validate URL
    let targetUrl;
    try {
      targetUrl = url.startsWith('http') ? url : `https://${url}`;
      new URL(targetUrl);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Add timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'SEO-Analysis-Protocol/1.0 (Keyword Density Analyzer)'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.json({
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        });
      }

      const html = await response.text();
      const keywordData = analyzeKeywordDensity(html, targetUrl);
      
      return res.json({
        success: true,
        url: targetUrl,
        ...keywordData
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return res.json({
          success: false,
          error: 'Request timeout - the server took too long to respond'
        });
      }

      return res.json({
        success: false,
        error: `Network error: ${fetchError.message}`
      });
    }

  } catch (error) {
    console.error('Keyword density error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while analyzing keyword density'
    });
  }
}

function analyzeKeywordDensity(html, url) {
  // Extract text content from HTML
  const textContent = extractTextContent(html);
  
  if (!textContent || textContent.length < 50) {
    return {
      success: false,
      error: 'Insufficient text content found on the page'
    };
  }

  // Analyze the text
  const words = tokenizeText(textContent);
  const totalWords = words.length;
  const uniqueWords = new Set(words).size;
  
  // Count word frequencies
  const wordCounts = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  // Get top keywords (single words)
  const topKeywords = Object.entries(wordCounts)
    .filter(([word]) => word.length > 2 && !isStopWord(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({
      word,
      count,
      density: parseFloat(((count / totalWords) * 100).toFixed(2)),
      prominence: calculateProminence(word, html)
    }));

  // Analyze 2-word phrases
  const twoWordPhrases = analyzePhrases(words, 2, totalWords);
  
  // Analyze 3-word phrases
  const threeWordPhrases = analyzePhrases(words, 3, totalWords);

  // Calculate readability metrics
  const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const avgSentenceLength = totalWords / sentences.length;
  const readingTime = Math.ceil(totalWords / 200);

  // Perform SEO analysis
  const analysis = performSEOAnalysis(topKeywords, totalWords, uniqueWords, avgSentenceLength);

  return {
    stats: {
      totalWords,
      uniqueWords,
      sentences: sentences.length,
      avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      readingTime: `${readingTime} min`,
      lexicalDiversity: parseFloat((uniqueWords / totalWords).toFixed(3))
    },
    topKeywords,
    twoWordPhrases: twoWordPhrases.slice(0, 10),
    threeWordPhrases: threeWordPhrases.slice(0, 8),
    analysis
  };
}

function extractTextContent(html) {
  // Remove script and style elements
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ')
             .replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'");
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

function tokenizeText(text) {
  return text.toLowerCase()
             .replace(/[^\w\s]/g, ' ')
             .split(/\s+/)
             .filter(word => word.length > 0);
}

function isStopWord(word) {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this',
    'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
    'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'all',
    'any', 'some', 'no', 'not', 'very', 'just', 'only', 'even', 'back', 'well', 'way',
    'get', 'go', 'come', 'know', 'think', 'see', 'want', 'use', 'find', 'give', 'tell',
    'work', 'call', 'try', 'ask', 'need', 'feel', 'become', 'leave', 'put', 'take'
  ]);
  return stopWords.has(word);
}

function analyzePhrases(words, phraseLength, totalWords) {
  const phraseCounts = {};
  
  for (let i = 0; i <= words.length - phraseLength; i++) {
    const phrase = words.slice(i, i + phraseLength).join(' ');
    
    // Skip phrases with stop words at the beginning or end
    if (!isStopWord(words[i]) && !isStopWord(words[i + phraseLength - 1])) {
      phraseCounts[phrase] = (phraseCounts[phrase] || 0) + 1;
    }
  }
  
  return Object.entries(phraseCounts)
    .filter(([phrase, count]) => count > 1 && phrase.length > 5)
    .sort((a, b) => b[1] - a[1])
    .map(([phrase, count]) => ({
      phrase,
      count,
      density: parseFloat(((count / (totalWords - phraseLength + 1)) * 100).toFixed(2))
    }));
}

function calculateProminence(word, html) {
  let prominence = 0;
  
  // Check if word appears in title
  const titleMatch = html.match(/<title[^>]*>([^<]*)/i);
  if (titleMatch && titleMatch[1].toLowerCase().includes(word)) {
    prominence += 30;
  }
  
  // Check if word appears in h1 tags
  const h1Regex = /<h1[^>]*>([^<]*)<\/h1>/gi;
  let h1Match;
  while ((h1Match = h1Regex.exec(html)) !== null) {
    if (h1Match[1].toLowerCase().includes(word)) {
      prominence += 20;
    }
  }
  
  // Check if word appears in h2 tags
  const h2Regex = /<h2[^>]*>([^<]*)<\/h2>/gi;
  let h2Match;
  while ((h2Match = h2Regex.exec(html)) !== null) {
    if (h2Match[1].toLowerCase().includes(word)) {
      prominence += 15;
    }
  }
  
  // Check if word appears in meta description
  const metaDescMatch = html.match(/<meta[^>]+name=[\"']description[\"'][^>]*content=[\"']([^\"']*)[\"']/i);
  if (metaDescMatch && metaDescMatch[1].toLowerCase().includes(word)) {
    prominence += 10;
  }
  
  return Math.min(100, prominence);
}

function performSEOAnalysis(topKeywords, totalWords, uniqueWords, avgSentenceLength) {
  const analysis = [];
  
  // Content length analysis
  if (totalWords < 300) {
    analysis.push({
      type: 'error',
      message: `Content is too short (${totalWords} words). Aim for at least 300 words for better SEO.`
    });
  } else if (totalWords >= 1000) {
    analysis.push({
      type: 'good',
      message: `Excellent content length (${totalWords} words). Long-form content tends to rank better.`
    });
  } else {
    analysis.push({
      type: 'warning',
      message: `Moderate content length (${totalWords} words). Consider expanding to 1000+ words for better ranking potential.`
    });
  }
  
  // Keyword density analysis
  if (topKeywords.length > 0) {
    const topKeyword = topKeywords[0];
    if (topKeyword.density > 3) {
      analysis.push({
        type: 'warning',
        message: `"${topKeyword.word}" appears too frequently (${topKeyword.density}%). Consider reducing to avoid keyword stuffing.`
      });
    } else if (topKeyword.density >= 1 && topKeyword.density <= 2.5) {
      analysis.push({
        type: 'good',
        message: `Primary keyword density is optimal (${topKeyword.density}%).`
      });
    } else if (topKeyword.density < 0.5) {
      analysis.push({
        type: 'warning',
        message: `Primary keyword density is low (${topKeyword.density}%). Consider using your target keyword more frequently.`
      });
    }
  }
  
  // Lexical diversity analysis
  const lexicalDiversity = uniqueWords / totalWords;
  if (lexicalDiversity > 0.3) {
    analysis.push({
      type: 'good',
      message: 'Good keyword variety and vocabulary richness.'
    });
  } else if (lexicalDiversity < 0.2) {
    analysis.push({
      type: 'warning',
      message: 'Limited vocabulary diversity. Consider using more varied terminology.'
    });
  }
  
  // Readability analysis
  if (avgSentenceLength > 25) {
    analysis.push({
      type: 'warning',
      message: 'Average sentence length is high. Consider breaking up long sentences for better readability.'
    });
  } else if (avgSentenceLength >= 15 && avgSentenceLength <= 20) {
    analysis.push({
      type: 'good',
      message: 'Good sentence length for readability.'
    });
  }
  
  return analysis;
}