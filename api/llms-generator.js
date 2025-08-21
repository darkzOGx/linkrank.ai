export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, customContent, includeDefaults, customRules } = req.body || {};

    const generationResult = await generateLLMsTxt({
      url: url || '',
      customContent: customContent || '',
      includeDefaults: includeDefaults !== false,
      customRules: customRules || []
    });
    
    return res.json({
      success: true,
      ...generationResult
    });

  } catch (error) {
    console.error('LLMs.txt generation error:', error.message);
    console.error('LLMs.txt generation stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while generating LLMs.txt',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function generateLLMsTxt(params) {
  const { url, customContent, includeDefaults, customRules } = params;
  
  try {
    // Analyze website if URL provided
    let siteAnalysis = null;
    if (url && url.trim()) {
      siteAnalysis = await analyzeSiteForLLMs(url);
    }
    
    // Generate LLMs.txt content
    const llmsContent = buildLLMsTxtContent({
      siteAnalysis,
      customContent,
      includeDefaults,
      customRules
    });
    
    // Validate the generated content
    const validation = validateLLMsTxtContent(llmsContent);
    
    // Generate implementation guidelines
    const implementation = generateImplementationGuidelines(siteAnalysis);
    
    // Generate best practices and recommendations
    const recommendations = generateLLMsRecommendations(siteAnalysis, validation);
    
    return {
      content: llmsContent,
      validation,
      implementation,
      recommendations,
      siteAnalysis: siteAnalysis || null,
      metadata: {
        generatedAt: new Date().toISOString(),
        contentLength: llmsContent.length,
        lineCount: llmsContent.split('\n').length
      }
    };

  } catch (error) {
    throw new Error(`Failed to generate LLMs.txt: ${error.message}`);
  }
}

async function analyzeSiteForLLMs(url) {
  try {
    // Validate URL
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return {
        url: url || '',
        accessible: false,
        error: 'No URL provided'
      };
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }
    
    // Validate URL format
    try {
      new URL(targetUrl);
    } catch (urlError) {
      return {
        url: targetUrl,
        accessible: false,
        error: 'Invalid URL format'
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'LLMs-Generator/1.0 (+https://linkrank.ai/bot)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        url: targetUrl,
        accessible: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const html = await response.text();
    const domain = new URL(targetUrl).hostname;
    
    return analyzeSiteContent(html, targetUrl, domain);

  } catch (error) {
    return {
      url,
      accessible: false,
      error: error.name === 'AbortError' ? 'Request timeout' : error.message
    };
  }
}

function analyzeSiteContent(html, url, domain) {
  const analysis = {
    url,
    domain,
    accessible: true,
    title: '',
    description: '',
    contentType: 'website',
    hasAPI: false,
    hasDocumentation: false,
    hasPrivacyPolicy: false,
    hasTermsOfService: false,
    hasContactInfo: false,
    languages: [],
    technologies: [],
    contentAreas: [],
    suggestedRules: []
  };

  // Extract basic meta information
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  analysis.title = titleMatch ? titleMatch[1].trim() : '';
  
  const metaDescMatch = html.match(/<meta\s+name=['""]description['""].*?content=['""]([^'""]*)['""][^>]*>/i);
  analysis.description = metaDescMatch ? metaDescMatch[1].trim() : '';

  // Detect content type and purpose
  analysis.contentType = detectContentType(html, analysis.title);
  
  // Check for API presence
  analysis.hasAPI = detectAPI(html);
  
  // Check for important pages
  analysis.hasDocumentation = html.toLowerCase().includes('documentation') || 
                             html.toLowerCase().includes('/docs/') ||
                             html.toLowerCase().includes('api reference');
  
  analysis.hasPrivacyPolicy = html.toLowerCase().includes('privacy policy') ||
                             html.toLowerCase().includes('/privacy');
  
  analysis.hasTermsOfService = html.toLowerCase().includes('terms of service') ||
                              html.toLowerCase().includes('terms of use') ||
                              html.toLowerCase().includes('/terms');
  
  analysis.hasContactInfo = html.toLowerCase().includes('contact') ||
                           html.toLowerCase().includes('@') ||
                           html.toLowerCase().includes('mailto:');

  // Detect languages
  analysis.languages = detectLanguages(html);
  
  // Detect technologies
  analysis.technologies = detectTechnologies(html);
  
  // Identify content areas
  analysis.contentAreas = identifyContentAreas(html);
  
  // Generate suggested rules based on analysis
  analysis.suggestedRules = generateSuggestedRules(analysis);

  return analysis;
}

function detectContentType(html, title) {
  const content = html.toLowerCase();
  const titleLower = title.toLowerCase();
  
  if (content.includes('blog') || content.includes('article') || content.includes('post')) {
    return 'blog';
  }
  if (content.includes('api') || content.includes('developer')) {
    return 'api_service';
  }
  if (content.includes('shop') || content.includes('cart') || content.includes('buy')) {
    return 'ecommerce';
  }
  if (content.includes('news') || content.includes('press')) {
    return 'news';
  }
  if (content.includes('portfolio') || content.includes('gallery')) {
    return 'portfolio';
  }
  if (content.includes('course') || content.includes('learn') || content.includes('education')) {
    return 'educational';
  }
  if (titleLower.includes('company') || titleLower.includes('business') || content.includes('about us')) {
    return 'corporate';
  }
  
  return 'website';
}

function detectAPI(html) {
  const apiIndicators = [
    '/api/',
    'api.',
    'rest api',
    'graphql',
    'endpoint',
    'json api',
    'api documentation',
    'api reference',
    'swagger',
    'openapi'
  ];
  
  const content = html.toLowerCase();
  return apiIndicators.some(indicator => content.includes(indicator));
}

function detectLanguages(html) {
  const languages = [];
  
  // Check lang attribute
  const langMatch = html.match(/<html[^>]*lang=['""]([^'""]*)['""][^>]*>/i);
  if (langMatch) {
    languages.push(langMatch[1].split('-')[0]);
  }
  
  // Check for common language indicators
  const languageIndicators = {
    'en': ['english', 'english version'],
    'es': ['español', 'spanish', 'spanish version'],
    'fr': ['français', 'french', 'version française'],
    'de': ['deutsch', 'german', 'deutsche version'],
    'it': ['italiano', 'italian'],
    'pt': ['português', 'portuguese'],
    'ja': ['日本語', 'japanese'],
    'zh': ['中文', 'chinese', '中国'],
    'ko': ['한국어', 'korean'],
    'ru': ['русский', 'russian']
  };
  
  const content = html.toLowerCase();
  Object.entries(languageIndicators).forEach(([code, indicators]) => {
    if (indicators.some(indicator => content.includes(indicator)) && !languages.includes(code)) {
      languages.push(code);
    }
  });
  
  return languages.length > 0 ? languages : ['en'];
}

function detectTechnologies(html) {
  const technologies = [];
  
  const techIndicators = {
    'React': ['react', '_app.js', 'react-dom'],
    'Vue': ['vue.js', 'vue-', 'nuxt'],
    'Angular': ['angular', 'ng-'],
    'WordPress': ['wp-content', 'wordpress', 'wp-includes'],
    'Shopify': ['shopify', 'myshopify'],
    'Drupal': ['drupal', '/sites/default/'],
    'Joomla': ['joomla', '/components/com_'],
    'Node.js': ['node', 'express'],
    'Python': ['django', 'flask', 'python'],
    'PHP': ['.php', 'phpinfo'],
    'Ruby': ['ruby', 'rails'],
    'Next.js': ['next.js', '_next/'],
    'Gatsby': ['gatsby', '__gatsby'],
    'Bootstrap': ['bootstrap', 'bs-'],
    'Tailwind': ['tailwind', 'tw-']
  };
  
  const content = html.toLowerCase();
  Object.entries(techIndicators).forEach(([tech, indicators]) => {
    if (indicators.some(indicator => content.includes(indicator))) {
      technologies.push(tech);
    }
  });
  
  return technologies;
}

function identifyContentAreas(html) {
  const areas = [];
  const content = html.toLowerCase();
  
  const contentIndicators = {
    'Documentation': ['documentation', '/docs/', 'user guide', 'manual'],
    'Blog': ['blog', 'article', 'post', 'news'],
    'Product Information': ['product', 'features', 'specifications'],
    'User Support': ['support', 'help', 'faq', 'troubleshoot'],
    'Company Information': ['about', 'company', 'team', 'history'],
    'Legal Documents': ['privacy', 'terms', 'legal', 'policy'],
    'Contact Information': ['contact', 'reach us', 'get in touch'],
    'Pricing': ['pricing', 'plans', 'cost', 'subscription'],
    'Downloads': ['download', 'software', 'app', 'install'],
    'API Reference': ['api', 'reference', 'endpoint', 'developer']
  };
  
  Object.entries(contentIndicators).forEach(([area, indicators]) => {
    if (indicators.some(indicator => content.includes(indicator))) {
      areas.push(area);
    }
  });
  
  return areas;
}

function generateSuggestedRules(analysis) {
  const rules = [];
  
  // Basic content rules based on site type
  switch (analysis.contentType) {
    case 'blog':
      rules.push('User-agent: *');
      rules.push('Allow: /posts/');
      rules.push('Allow: /articles/');
      rules.push('Allow: /blog/');
      rules.push('Disallow: /admin/');
      rules.push('Disallow: /wp-admin/');
      break;
      
    case 'api_service':
      rules.push('User-agent: *');
      rules.push('Allow: /docs/');
      rules.push('Allow: /api/');
      rules.push('Allow: /reference/');
      rules.push('Disallow: /admin/');
      rules.push('Disallow: /private/');
      break;
      
    case 'ecommerce':
      rules.push('User-agent: *');
      rules.push('Allow: /products/');
      rules.push('Allow: /category/');
      rules.push('Disallow: /cart/');
      rules.push('Disallow: /checkout/');
      rules.push('Disallow: /account/');
      rules.push('Disallow: /admin/');
      break;
      
    default:
      rules.push('User-agent: *');
      rules.push('Allow: /');
      rules.push('Disallow: /admin/');
      rules.push('Disallow: /private/');
  }
  
  // Add content-specific rules
  if (analysis.contentAreas.includes('Documentation')) {
    rules.push('Allow: /docs/');
    rules.push('Allow: /documentation/');
  }
  
  if (analysis.contentAreas.includes('API Reference')) {
    rules.push('Allow: /api/');
    rules.push('Allow: /reference/');
  }
  
  if (analysis.contentAreas.includes('Blog')) {
    rules.push('Allow: /blog/');
    rules.push('Allow: /posts/');
  }
  
  // Common disallow rules
  if (!rules.some(rule => rule.includes('Disallow: /admin/'))) {
    rules.push('Disallow: /admin/');
  }
  
  return rules;
}

function buildLLMsTxtContent(params) {
  const { siteAnalysis, customContent, includeDefaults, customRules } = params;
  
  let content = '';
  
  // Add header comment
  content += '# LLMs.txt\n';
  content += '# This file provides guidance to Large Language Models (LLMs)\n';
  content += '# about how to interact with this website.\n';
  content += '#\n';
  content += `# Generated on: ${new Date().toISOString().split('T')[0]}\n`;
  if (siteAnalysis && siteAnalysis.domain) {
    content += `# Domain: ${siteAnalysis.domain}\n`;
  }
  content += '\n';
  
  // Add default rules if requested
  if (includeDefaults) {
    content += addDefaultLLMsRules(siteAnalysis);
  }
  
  // Add suggested rules based on site analysis
  if (siteAnalysis && siteAnalysis.suggestedRules.length > 0) {
    content += '# Site-specific rules based on content analysis\n';
    siteAnalysis.suggestedRules.forEach(rule => {
      content += `${rule}\n`;
    });
    content += '\n';
  }
  
  // Add custom rules
  if (customRules && customRules.length > 0) {
    content += '# Custom rules\n';
    customRules.forEach(rule => {
      content += `${rule}\n`;
    });
    content += '\n';
  }
  
  // Add custom content
  if (customContent && customContent.trim()) {
    content += '# Custom instructions\n';
    content += customContent.trim() + '\n\n';
  }
  
  // Add footer information
  content += addFooterInformation(siteAnalysis);
  
  return content.trim();
}

function addDefaultLLMsRules(siteAnalysis) {
  let rules = '';
  
  rules += '# Default LLM guidance rules\n';
  rules += '\n';
  
  // Basic access rules
  rules += '# Access Rules\n';
  rules += 'User-agent: *\n';
  rules += 'Allow: /\n';
  rules += '\n';
  
  // Common restrictions
  rules += '# Restricted Areas\n';
  rules += 'Disallow: /admin/\n';
  rules += 'Disallow: /private/\n';
  rules += 'Disallow: /internal/\n';
  rules += 'Disallow: /temp/\n';
  rules += 'Disallow: /cache/\n';
  rules += 'Disallow: /backup/\n';
  rules += '\n';
  
  // Privacy and personal data
  rules += '# Privacy Protection\n';
  rules += 'Disallow: /user/\n';
  rules += 'Disallow: /profile/\n';
  rules += 'Disallow: /account/\n';
  rules += 'Disallow: /personal/\n';
  rules += 'Disallow: /dashboard/\n';
  rules += '\n';
  
  // Authentication areas
  rules += '# Authentication Areas\n';
  rules += 'Disallow: /login/\n';
  rules += 'Disallow: /register/\n';
  rules += 'Disallow: /auth/\n';
  rules += 'Disallow: /signin/\n';
  rules += 'Disallow: /signup/\n';
  rules += '\n';
  
  // Sensitive operations
  rules += '# Sensitive Operations\n';
  rules += 'Disallow: /delete/\n';
  rules += 'Disallow: /remove/\n';
  rules += 'Disallow: /modify/\n';
  rules += 'Disallow: /edit/\n';
  rules += 'Disallow: /update/\n';
  rules += '\n';
  
  // Recommended areas (if detected)
  if (siteAnalysis) {
    if (siteAnalysis.contentAreas.includes('Documentation')) {
      rules += '# Recommended Content Areas\n';
      rules += 'Allow: /docs/\n';
      rules += 'Allow: /documentation/\n';
    }
    if (siteAnalysis.contentAreas.includes('Blog')) {
      rules += 'Allow: /blog/\n';
      rules += 'Allow: /articles/\n';
      rules += 'Allow: /posts/\n';
    }
    if (siteAnalysis.contentAreas.includes('API Reference')) {
      rules += 'Allow: /api/\n';
      rules += 'Allow: /reference/\n';
    }
    if (siteAnalysis.contentAreas.includes('User Support')) {
      rules += 'Allow: /help/\n';
      rules += 'Allow: /support/\n';
      rules += 'Allow: /faq/\n';
    }
    rules += '\n';
  }
  
  return rules;
}

function addFooterInformation(siteAnalysis) {
  let footer = '';
  
  footer += '# Additional Information\n';
  footer += '\n';
  
  if (siteAnalysis) {
    if (siteAnalysis.title) {
      footer += `# Site Title: ${siteAnalysis.title}\n`;
    }
    if (siteAnalysis.description) {
      footer += `# Site Description: ${siteAnalysis.description}\n`;
    }
    if (siteAnalysis.contentType) {
      footer += `# Content Type: ${siteAnalysis.contentType}\n`;
    }
    if (siteAnalysis.languages.length > 0) {
      footer += `# Languages: ${siteAnalysis.languages.join(', ')}\n`;
    }
    if (siteAnalysis.technologies.length > 0) {
      footer += `# Technologies: ${siteAnalysis.technologies.join(', ')}\n`;
    }
    footer += '\n';
    
    // Contact information
    footer += '# Contact Information\n';
    if (siteAnalysis.hasContactInfo) {
      footer += '# Contact information available on site\n';
    }
    if (siteAnalysis.hasPrivacyPolicy) {
      footer += '# Privacy policy available\n';
    }
    if (siteAnalysis.hasTermsOfService) {
      footer += '# Terms of service available\n';
    }
    footer += '\n';
  }
  
  footer += '# LLM Guidance\n';
  footer += '# When interacting with this site, please:\n';
  footer += '# 1. Respect user privacy and personal information\n';
  footer += '# 2. Avoid accessing restricted or private areas\n';
  footer += '# 3. Use publicly available content responsibly\n';
  footer += '# 4. Follow the site\'s terms of service\n';
  footer += '# 5. Provide accurate information when referencing site content\n';
  footer += '\n';
  
  footer += `# Generated by LinkRank.ai LLMs.txt Generator\n`;
  footer += `# https://linkrank.ai/tools/llms-generator\n`;
  
  return footer;
}

function validateLLMsTxtContent(content) {
  const validation = {
    valid: true,
    issues: [],
    warnings: [],
    suggestions: [],
    stats: {
      lines: 0,
      rules: 0,
      comments: 0,
      emptyLines: 0
    }
  };
  
  const lines = content.split('\n');
  validation.stats.lines = lines.length;
  
  let hasUserAgent = false;
  let hasAllowRules = false;
  let hasDisallowRules = false;
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    if (trimmedLine === '') {
      validation.stats.emptyLines++;
    } else if (trimmedLine.startsWith('#')) {
      validation.stats.comments++;
    } else if (trimmedLine.includes(':')) {
      validation.stats.rules++;
      
      if (trimmedLine.toLowerCase().startsWith('user-agent:')) {
        hasUserAgent = true;
      } else if (trimmedLine.toLowerCase().startsWith('allow:')) {
        hasAllowRules = true;
      } else if (trimmedLine.toLowerCase().startsWith('disallow:')) {
        hasDisallowRules = true;
      }
      
      // Validate rule format
      if (!/^[a-zA-Z-]+:\s*.+$/.test(trimmedLine)) {
        validation.issues.push(`Line ${index + 1}: Invalid rule format`);
        validation.valid = false;
      }
    }
  });
  
  // Check required elements
  if (!hasUserAgent) {
    validation.issues.push('Missing User-agent declaration');
    validation.valid = false;
  }
  
  if (!hasAllowRules && !hasDisallowRules) {
    validation.warnings.push('No Allow or Disallow rules found');
  }
  
  // Suggestions
  if (validation.stats.lines < 10) {
    validation.suggestions.push('Consider adding more detailed rules and documentation');
  }
  
  if (validation.stats.comments < 5) {
    validation.suggestions.push('Add more comments to explain the rules');
  }
  
  if (!hasAllowRules) {
    validation.suggestions.push('Consider adding Allow rules for recommended content areas');
  }
  
  return validation;
}

function generateImplementationGuidelines(siteAnalysis) {
  const guidelines = {
    fileLocation: '/llms.txt',
    serverConfiguration: [],
    bestPractices: [],
    testing: []
  };
  
  // Server configuration
  guidelines.serverConfiguration = [
    'Place the llms.txt file in the root directory of your website',
    'Ensure the file is accessible at https://yourdomain.com/llms.txt',
    'Set appropriate MIME type: text/plain',
    'Configure proper caching headers (Cache-Control: max-age=86400)',
    'Ensure the file is accessible without authentication'
  ];
  
  // Best practices
  guidelines.bestPractices = [
    'Keep the file simple and readable',
    'Use clear, specific rules rather than broad restrictions',
    'Include comments to explain complex rules',
    'Regular update the file as your site structure changes',
    'Test the file accessibility from external tools',
    'Consider different LLM user-agents if needed',
    'Coordinate with your existing robots.txt file',
    'Monitor access logs for LLM requests'
  ];
  
  // Testing recommendations
  guidelines.testing = [
    'Verify file accessibility: curl https://yourdomain.com/llms.txt',
    'Check file format and syntax',
    'Test different user-agent strings',
    'Validate rules don\'t conflict with robots.txt',
    'Monitor server logs for LLM access patterns',
    'Review and update rules based on usage analytics'
  ];
  
  // Site-specific recommendations
  if (siteAnalysis) {
    if (siteAnalysis.technologies.includes('WordPress')) {
      guidelines.serverConfiguration.push('For WordPress: Place file in the root directory, not in wp-content');
    }
    if (siteAnalysis.technologies.includes('Shopify')) {
      guidelines.serverConfiguration.push('For Shopify: Upload via admin panel or theme files');
    }
    if (siteAnalysis.hasAPI) {
      guidelines.bestPractices.push('Consider separate rules for API endpoints');
    }
  }
  
  return guidelines;
}

function generateLLMsRecommendations(siteAnalysis, validation) {
  const recommendations = [];
  
  // Validation-based recommendations
  if (!validation.valid) {
    recommendations.push('Fix syntax errors in the generated file before implementation');
  }
  
  if (validation.warnings.length > 0) {
    recommendations.push('Address warnings to improve LLM guidance effectiveness');
  }
  
  // Site analysis recommendations
  if (siteAnalysis) {
    if (siteAnalysis.contentAreas.includes('User Support')) {
      recommendations.push('Allow access to help and support content for better LLM assistance');
    }
    
    if (siteAnalysis.contentAreas.includes('API Reference')) {
      recommendations.push('Provide clear guidance for API documentation access');
    }
    
    if (siteAnalysis.hasPrivacyPolicy) {
      recommendations.push('Ensure LLM rules align with your privacy policy requirements');
    }
    
    if (siteAnalysis.languages.length > 1) {
      recommendations.push('Consider language-specific rules for multilingual content');
    }
    
    if (siteAnalysis.contentType === 'ecommerce') {
      recommendations.push('Restrict access to checkout and payment processes');
    }
    
    if (siteAnalysis.contentType === 'blog') {
      recommendations.push('Allow access to blog content while protecting author information');
    }
  }
  
  // General recommendations
  recommendations.push('Monitor LLM access patterns and adjust rules accordingly');
  recommendations.push('Keep the llms.txt file updated as your site evolves');
  recommendations.push('Consider implementing rate limiting for automated requests');
  recommendations.push('Document your LLM interaction policies clearly');
  recommendations.push('Review and test the file regularly for effectiveness');
  
  return recommendations;
}