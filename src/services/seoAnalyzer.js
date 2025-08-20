/**
 * Independent SEO Analysis Service
 * Performs comprehensive website analysis without external dependencies
 */

// Utility function to safely fetch a webpage
async function fetchWebpage(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'LinkRank.ai SEO Analyzer/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    return { html, status: response.status, headers: response.headers };
  } catch (error) {
    throw new Error(`Failed to fetch webpage: ${error.message}`);
  }
}

// Parse HTML content and create a virtual DOM for analysis
function parseHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc;
}

// Check for redirects using fetch response
async function checkRedirects(url) {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      redirect: 'manual'
    });
    
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      return {
        hasRedirect: true,
        redirectTo: location,
        status: response.status
      };
    }
    
    return { hasRedirect: false };
  } catch (error) {
    return { hasRedirect: false, error: error.message };
  }
}

// Analyze On-Page SEO factors
function analyzeOnPageSEO(doc, url) {
  const results = [];
  let score = 100;
  
  // Title tag analysis
  const title = doc.querySelector('title');
  if (!title || !title.textContent.trim()) {
    results.push({
      type: 'error',
      category: 'Title Tag',
      issue: 'Missing title tag',
      description: 'Page is missing a title tag which is crucial for SEO',
      impact: 'High'
    });
    score -= 15;
  } else {
    const titleLength = title.textContent.trim().length;
    if (titleLength < 30) {
      results.push({
        type: 'warning',
        category: 'Title Tag',
        issue: 'Title too short',
        description: `Title is ${titleLength} characters. Recommended: 30-60 characters`,
        impact: 'Medium'
      });
      score -= 8;
    } else if (titleLength > 60) {
      results.push({
        type: 'warning',
        category: 'Title Tag',
        issue: 'Title too long',
        description: `Title is ${titleLength} characters. It may be truncated in search results`,
        impact: 'Medium'
      });
      score -= 5;
    } else {
      results.push({
        type: 'success',
        category: 'Title Tag',
        issue: 'Title length optimal',
        description: `Title length (${titleLength} characters) is within recommended range`,
        impact: 'None'
      });
    }
  }

  // Meta description analysis
  const metaDescription = doc.querySelector('meta[name="description"]');
  if (!metaDescription || !metaDescription.getAttribute('content')) {
    results.push({
      type: 'error',
      category: 'Meta Description',
      issue: 'Missing meta description',
      description: 'Page is missing a meta description which affects click-through rates',
      impact: 'High'
    });
    score -= 10;
  } else {
    const descLength = metaDescription.getAttribute('content').length;
    if (descLength < 120) {
      results.push({
        type: 'warning',
        category: 'Meta Description',
        issue: 'Meta description too short',
        description: `Description is ${descLength} characters. Recommended: 120-160 characters`,
        impact: 'Medium'
      });
      score -= 5;
    } else if (descLength > 160) {
      results.push({
        type: 'warning',
        category: 'Meta Description',
        issue: 'Meta description too long',
        description: `Description is ${descLength} characters. It may be truncated in search results`,
        impact: 'Medium'
      });
      score -= 3;
    }
  }

  // Heading structure analysis
  const h1Tags = doc.querySelectorAll('h1');
  if (h1Tags.length === 0) {
    results.push({
      type: 'error',
      category: 'Heading Structure',
      issue: 'Missing H1 tag',
      description: 'Page is missing an H1 tag which is important for SEO hierarchy',
      impact: 'High'
    });
    score -= 12;
  } else if (h1Tags.length > 1) {
    results.push({
      type: 'warning',
      category: 'Heading Structure',
      issue: 'Multiple H1 tags',
      description: `Found ${h1Tags.length} H1 tags. Best practice is to use only one H1 per page`,
      impact: 'Medium'
    });
    score -= 8;
  }

  // Image optimization analysis
  const images = doc.querySelectorAll('img');
  let imagesWithoutAlt = 0;
  images.forEach(img => {
    if (!img.getAttribute('alt')) {
      imagesWithoutAlt++;
    }
  });

  if (images.length > 0) {
    if (imagesWithoutAlt > 0) {
      results.push({
        type: 'warning',
        category: 'Image SEO',
        issue: 'Images missing alt attributes',
        description: `${imagesWithoutAlt} out of ${images.length} images are missing alt attributes`,
        impact: imagesWithoutAlt / images.length > 0.5 ? 'High' : 'Medium'
      });
      score -= Math.min(15, imagesWithoutAlt * 2);
    } else {
      results.push({
        type: 'success',
        category: 'Image SEO',
        issue: 'All images have alt attributes',
        description: `All ${images.length} images have proper alt attributes`,
        impact: 'None'
      });
    }
  }

  // Internal/External links analysis
  const links = doc.querySelectorAll('a[href]');
  let internalLinks = 0;
  let externalLinks = 0;
  let brokenLinks = 0;

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href.startsWith('http') && !href.includes(new URL(url).hostname)) {
      externalLinks++;
    } else if (href.startsWith('/') || href.includes(new URL(url).hostname)) {
      internalLinks++;
    }
  });

  if (externalLinks > internalLinks * 2) {
    results.push({
      type: 'warning',
      category: 'Link Structure',
      issue: 'Too many external links',
      description: `Found ${externalLinks} external vs ${internalLinks} internal links. Consider balancing`,
      impact: 'Medium'
    });
    score -= 5;
  }

  return { results, score: Math.max(0, score) };
}

// Analyze Performance factors
function analyzePerformance(doc, responseTime) {
  const results = [];
  let score = 100;

  // Response time analysis
  if (responseTime > 3000) {
    results.push({
      type: 'error',
      category: 'Page Speed',
      issue: 'Slow response time',
      description: `Page took ${responseTime}ms to respond. Target: <1000ms`,
      impact: 'High'
    });
    score -= 20;
  } else if (responseTime > 1000) {
    results.push({
      type: 'warning',
      category: 'Page Speed',
      issue: 'Moderate response time',
      description: `Page took ${responseTime}ms to respond. Consider optimization`,
      impact: 'Medium'
    });
    score -= 10;
  }

  // Resource optimization
  const scripts = doc.querySelectorAll('script');
  const stylesheets = doc.querySelectorAll('link[rel="stylesheet"]');
  
  if (scripts.length > 10) {
    results.push({
      type: 'warning',
      category: 'Resource Optimization',
      issue: 'Many script files',
      description: `Found ${scripts.length} script tags. Consider bundling and minification`,
      impact: 'Medium'
    });
    score -= 8;
  }

  if (stylesheets.length > 5) {
    results.push({
      type: 'warning',
      category: 'Resource Optimization',
      issue: 'Many stylesheet files',
      description: `Found ${stylesheets.length} CSS files. Consider combining stylesheets`,
      impact: 'Medium'
    });
    score -= 5;
  }

  // Image optimization check
  const images = doc.querySelectorAll('img');
  let unoptimizedImages = 0;
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src && !src.includes('.webp') && !src.includes('.avif')) {
      unoptimizedImages++;
    }
  });

  if (unoptimizedImages > 0 && images.length > 0) {
    results.push({
      type: 'info',
      category: 'Image Optimization',
      issue: 'Consider modern image formats',
      description: `${unoptimizedImages} images could use WebP or AVIF for better compression`,
      impact: 'Low'
    });
    score -= 3;
  }

  return { results, score: Math.max(0, score) };
}

// Analyze Accessibility factors
function analyzeAccessibility(doc) {
  const results = [];
  let score = 100;

  // Check for proper heading hierarchy
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  let hierarchyIssues = 0;

  headings.forEach(heading => {
    const level = parseInt(heading.tagName.substring(1));
    if (level - previousLevel > 1) {
      hierarchyIssues++;
    }
    previousLevel = level;
  });

  if (hierarchyIssues > 0) {
    results.push({
      type: 'warning',
      category: 'Heading Hierarchy',
      issue: 'Improper heading structure',
      description: `Found ${hierarchyIssues} heading hierarchy violations`,
      impact: 'Medium'
    });
    score -= 10;
  }

  // Check for color contrast (basic check)
  const style = doc.querySelector('style');
  const links = doc.querySelectorAll('link[rel="stylesheet"]');
  if (!style && links.length === 0) {
    results.push({
      type: 'info',
      category: 'Styling',
      issue: 'No CSS detected',
      description: 'Unable to analyze color contrast without CSS',
      impact: 'Low'
    });
  }

  // Form accessibility
  const forms = doc.querySelectorAll('form');
  const inputs = doc.querySelectorAll('input, textarea, select');
  let unlabeledInputs = 0;

  inputs.forEach(input => {
    const id = input.getAttribute('id');
    const label = doc.querySelector(`label[for="${id}"]`);
    if (!label && !input.getAttribute('aria-label')) {
      unlabeledInputs++;
    }
  });

  if (unlabeledInputs > 0) {
    results.push({
      type: 'warning',
      category: 'Form Accessibility',
      issue: 'Unlabeled form inputs',
      description: `${unlabeledInputs} form inputs lack proper labels`,
      impact: 'High'
    });
    score -= 15;
  }

  // Alt text check (already covered in SEO but important for accessibility)
  const images = doc.querySelectorAll('img');
  let decorativeImages = 0;
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    if (alt === '') decorativeImages++;
  });

  return { results, score: Math.max(0, score) };
}

// Analyze Best Practices
function analyzeBestPractices(doc, url) {
  const results = [];
  let score = 100;

  // HTTPS check
  if (!url.startsWith('https://')) {
    results.push({
      type: 'error',
      category: 'Security',
      issue: 'Not using HTTPS',
      description: 'Site should use HTTPS for security and SEO benefits',
      impact: 'High'
    });
    score -= 20;
  }

  // Canonical URL check
  const canonical = doc.querySelector('link[rel="canonical"]');
  if (!canonical) {
    results.push({
      type: 'warning',
      category: 'Technical SEO',
      issue: 'Missing canonical URL',
      description: 'Page should have a canonical URL to prevent duplicate content issues',
      impact: 'Medium'
    });
    score -= 8;
  }

  // Robots meta tag check
  const robotsMeta = doc.querySelector('meta[name="robots"]');
  if (robotsMeta) {
    const content = robotsMeta.getAttribute('content').toLowerCase();
    if (content.includes('noindex')) {
      results.push({
        type: 'warning',
        category: 'Technical SEO',
        issue: 'Page set to noindex',
        description: 'Page is marked as noindex and will not appear in search results',
        impact: 'High'
      });
      score -= 15;
    }
  }

  // Viewport meta tag check
  const viewport = doc.querySelector('meta[name="viewport"]');
  if (!viewport) {
    results.push({
      type: 'error',
      category: 'Mobile Optimization',
      issue: 'Missing viewport meta tag',
      description: 'Page lacks viewport meta tag for mobile optimization',
      impact: 'High'
    });
    score -= 15;
  }

  // Language declaration check
  const html = doc.documentElement;
  if (!html.getAttribute('lang')) {
    results.push({
      type: 'warning',
      category: 'Internationalization',
      issue: 'Missing language declaration',
      description: 'HTML element should have a lang attribute',
      impact: 'Medium'
    });
    score -= 5;
  }

  // Structured data check (basic)
  const jsonLd = doc.querySelectorAll('script[type="application/ld+json"]');
  const microdata = doc.querySelectorAll('[itemscope]');
  
  if (jsonLd.length === 0 && microdata.length === 0) {
    results.push({
      type: 'info',
      category: 'Structured Data',
      issue: 'No structured data found',
      description: 'Consider adding structured data to help search engines understand your content',
      impact: 'Low'
    });
    score -= 3;
  }

  return { results, score: Math.max(0, score) };
}

// Main SEO analysis function
export async function performSEOAnalysis(url) {
  const startTime = Date.now();
  
  try {
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Fetch the webpage
    const { html, status, headers } = await fetchWebpage(url);
    const responseTime = Date.now() - startTime;
    
    // Parse HTML
    const doc = parseHTML(html);
    
    // Run all analysis modules
    const onPageResults = analyzeOnPageSEO(doc, url);
    const performanceResults = analyzePerformance(doc, responseTime);
    const accessibilityResults = analyzeAccessibility(doc);
    const bestPracticesResults = analyzeBestPractices(doc, url);
    
    // Check for redirects
    const redirectInfo = await checkRedirects(url);
    
    // Calculate overall score
    const overallScore = Math.round(
      (onPageResults.score + performanceResults.score + accessibilityResults.score + bestPracticesResults.score) / 4
    );
    
    return {
      url,
      timestamp: new Date().toISOString(),
      responseTime,
      overallScore,
      categories: {
        onPage: {
          score: onPageResults.score,
          results: onPageResults.results
        },
        performance: {
          score: performanceResults.score,
          results: performanceResults.results
        },
        accessibility: {
          score: accessibilityResults.score,
          results: accessibilityResults.results
        },
        bestPractices: {
          score: bestPracticesResults.score,
          results: bestPracticesResults.results
        }
      },
      redirectInfo,
      metadata: {
        title: doc.querySelector('title')?.textContent || '',
        description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        h1Count: doc.querySelectorAll('h1').length,
        imageCount: doc.querySelectorAll('img').length,
        linkCount: doc.querySelectorAll('a[href]').length
      }
    };
    
  } catch (error) {
    throw new Error(`SEO analysis failed: ${error.message}`);
  }
}