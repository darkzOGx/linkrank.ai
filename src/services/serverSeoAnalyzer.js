/**
 * Server-side SEO Analysis Service
 * Makes API calls to our serverless function for comprehensive analysis
 */

// API endpoint configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Production Vercel deployment
  : '/api';  // Development with Vite proxy

// Analysis request with proper error handling and loading states
export async function performServerSideAnalysis(url) {
  const startTime = Date.now();
  
  try {
    // Validate URL format
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }
    
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Make API request to our serverless function
    const response = await fetch(`${API_BASE_URL}/analyze?_t=${Date.now()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ url }),
      cache: 'no-store',
      // Add timeout for client-side request
      signal: AbortSignal.timeout(60000) // 60 second timeout
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      
      if (response.status === 429) {
        // Enhanced rate limiting error with specific messaging
        const retryAfter = errorData.retryAfter ? `Please try again in ${errorData.retryAfter} seconds.` : 'Please wait a moment before trying again.';
        const rateLimitMessage = errorData.type === 'RATE_LIMITED' 
          ? `${errorData.message} ${retryAfter}`
          : `Rate limit exceeded. ${retryAfter}`;
        
        const error = new Error(rateLimitMessage);
        error.type = 'RATE_LIMITED';
        error.retryAfter = errorData.retryAfter || 60;
        throw error;
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Invalid URL provided');
      } else if (response.status >= 500) {
        throw new Error('Server error occurred. Please try again later.');
      } else {
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }
    }
    
    const result = await response.json();
    
    // Add client-side processing time
    result.client_processing_time = Date.now() - startTime;
    
    // Ensure result has all expected properties for compatibility
    return normalizeAnalysisResult(result);
    
  } catch (error) {
    // Handle network errors and timeouts
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error('Request timeout. The website may be slow to respond or unavailable.');
    }
    
    if (error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    // Re-throw with original message for known errors
    throw error;
  }
}

// Normalize the analysis result to ensure compatibility with frontend components
function normalizeAnalysisResult(result) {
  // Ensure all legacy properties exist for backward compatibility
  const normalized = {
    ...result,
    
    // Ensure legacy format compatibility
    title_tag: result.title_tag || { value: '', score: 0 },
    meta_description: result.meta_description || { value: '', score: 0 },
    headings: result.headings || { h1_count: 0, score: 0 },
    images: result.images || { total_images: 0, missing_alt: 0, score: 0 },
    page_speed: result.page_speed || { load_time: 0, score: 0 },
    mobile_friendly: result.mobile_friendly || { is_mobile_friendly: false, score: 0 },
    https: result.https || { is_https: false, score: 0 },
    content: result.content || { word_count: 0, score: 0 },
    links: result.links || { 
      internal_count: 0, 
      external_count: 0, 
      internal_score: 0, 
      external_score: 0 
    },
    
    // Add computed scores if not present
    onpage_score: result.analysis?.on_page?.overall_score || calculateLegacyScore([
      result.title_tag?.score || 0,
      result.meta_description?.score || 0,
      result.headings?.score || 0,
      result.images?.score || 0
    ]),
    
    technical_score: result.analysis?.performance?.overall_score || calculateLegacyScore([
      result.page_speed?.score || 0,
      result.mobile_friendly?.score || 0,
      result.https?.score || 0
    ]),
    
    content_score: result.content?.score || 0,
    
    // Enhanced metadata
    metadata: {
      title: result.analysis?.on_page?.title_tag?.value || result.title_tag?.value || '',
      description: result.analysis?.on_page?.meta_description?.value || result.meta_description?.value || '',
      h1Count: result.analysis?.on_page?.headings?.h1_count || result.headings?.h1_count || 0,
      imageCount: result.analysis?.on_page?.images?.total_images || result.images?.total_images || 0,
      linkCount: result.analysis?.content?.total_links || (result.links?.internal_count || 0) + (result.links?.external_count || 0),
      wordCount: result.analysis?.content?.word_count || result.content?.word_count || 0,
      ...result.metadata
    },
    
    // Add recommendations if detailed analysis exists
    recommendations: generateRecommendations(result)
  };
  
  return normalized;
}

// Calculate legacy score format from array of scores
function calculateLegacyScore(scores) {
  const validScores = scores.filter(score => typeof score === 'number' && !isNaN(score));
  if (validScores.length === 0) return 0;
  return Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length);
}

// Generate actionable recommendations from detailed analysis
function generateRecommendations(result) {
  const recommendations = [];
  
  if (!result.analysis) return recommendations;
  
  // On-page SEO recommendations
  if (result.analysis.on_page) {
    const onPage = result.analysis.on_page;
    
    Object.values(onPage).forEach(section => {
      if (section.recommendations && Array.isArray(section.recommendations)) {
        section.recommendations.forEach(rec => {
          recommendations.push({
            category: 'On-Page SEO',
            priority: section.score < 70 ? 'high' : section.score < 90 ? 'medium' : 'low',
            description: rec,
            how_to_fix: rec
          });
        });
      }
    });
  }
  
  // Performance recommendations
  if (result.analysis.performance) {
    const performance = result.analysis.performance;
    
    Object.values(performance).forEach(section => {
      if (section.recommendations && Array.isArray(section.recommendations)) {
        section.recommendations.forEach(rec => {
          recommendations.push({
            category: 'Performance',
            priority: section.score < 70 ? 'high' : section.score < 90 ? 'medium' : 'low',
            description: rec,
            how_to_fix: rec
          });
        });
      }
    });
  }
  
  // Content recommendations
  if (result.analysis.content) {
    const content = result.analysis.content;
    
    if (content.recommendations && Array.isArray(content.recommendations)) {
      content.recommendations.forEach(rec => {
        recommendations.push({
          category: 'Content',
          priority: content.score < 70 ? 'high' : content.score < 90 ? 'medium' : 'low',
          description: rec,
          how_to_fix: rec
        });
      });
    }
  }
  
  // Structured data recommendations
  if (result.analysis.structured_data) {
    const structuredData = result.analysis.structured_data;
    
    if (structuredData.recommendations && Array.isArray(structuredData.recommendations)) {
      structuredData.recommendations.forEach(rec => {
        recommendations.push({
          category: 'Structured Data',
          priority: 'low',
          description: rec,
          how_to_fix: rec
        });
      });
    }
  }
  
  return recommendations.slice(0, 10); // Limit to top 10 recommendations
}

// Health check function for API
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Get analysis statistics (if we add an analytics endpoint later)
export async function getAnalysisStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    return null;
  }
}