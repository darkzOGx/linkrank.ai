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

    const mobileTestData = await testMobileFriendliness(targetUrl);
    
    return res.json({
      success: true,
      url: targetUrl,
      ...mobileTestData
    });

  } catch (error) {
    console.error('Mobile test error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while testing mobile compatibility'
    });
  }
}

async function testMobileFriendliness(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'SEO-Analysis-Protocol/1.0 (Mobile Tester)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const html = await response.text();
    const mobileAnalysis = analyzeMobileFriendliness(html);
    
    return mobileAnalysis;

  } catch (fetchError) {
    clearTimeout(timeoutId);
    
    if (fetchError.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout - the server took too long to respond'
      };
    }

    return {
      success: false,
      error: `Network error: ${fetchError.message}`
    };
  }
}

function analyzeMobileFriendliness(html) {
  const checks = [];
  let score = 0;
  const maxScore = 100;

  // Check for viewport meta tag
  const viewportCheck = checkViewport(html);
  checks.push(viewportCheck);
  if (viewportCheck.passed) score += 25;

  // Check text readability
  const textCheck = checkTextReadability(html);
  checks.push(textCheck);
  if (textCheck.passed) score += 20;

  // Check touch targets
  const touchCheck = checkTouchTargets(html);
  checks.push(touchCheck);
  if (touchCheck.passed) score += 20;

  // Check content sizing
  const contentCheck = checkContentSizing(html);
  checks.push(contentCheck);
  if (contentCheck.passed) score += 15;

  // Check responsive design
  const responsiveCheck = checkResponsiveDesign(html);
  checks.push(responsiveCheck);
  if (responsiveCheck.passed) score += 20;

  const isMobileFriendly = score >= 80;
  
  // Generate recommendations based on failed checks
  const recommendations = generateRecommendations(checks);

  return {
    score,
    isMobileFriendly,
    checks,
    recommendations,
    analysis: {
      totalChecks: checks.length,
      passedChecks: checks.filter(c => c.passed).length,
      failedChecks: checks.filter(c => !c.passed).length
    }
  };
}

function checkViewport(html) {
  const viewportRegex = /<meta[^>]+name=[\"']viewport[\"'][^>]*>/i;
  const viewportMatch = html.match(viewportRegex);
  
  if (!viewportMatch) {
    return {
      name: 'Viewport Configuration',
      description: 'Uses a responsive viewport meta tag',
      passed: false,
      issue: 'Missing viewport meta tag',
      impact: 'high'
    };
  }

  const viewportContent = viewportMatch[0];
  const hasWidthDevice = viewportContent.includes('width=device-width');
  const hasInitialScale = viewportContent.includes('initial-scale=1');

  return {
    name: 'Viewport Configuration',
    description: 'Uses a responsive viewport meta tag',
    passed: hasWidthDevice && hasInitialScale,
    issue: !hasWidthDevice ? 'Missing width=device-width' : 
           !hasInitialScale ? 'Missing initial-scale=1' : null,
    impact: 'high'
  };
}

function checkTextReadability(html) {
  // Check for font-size styles
  const styleRegex = /<style[^>]*>(.*?)<\/style>/gis;
  const styleMatches = html.match(styleRegex);
  
  let hasMobileStyles = false;
  
  if (styleMatches) {
    const combinedStyles = styleMatches.join(' ');
    
    // Check for responsive font sizes or media queries
    if (combinedStyles.includes('@media') && 
        (combinedStyles.includes('font-size') || combinedStyles.includes('rem') || combinedStyles.includes('em'))) {
      hasMobileStyles = true;
    }
  }

  // Check for CSS frameworks that handle responsive text
  const hasBootstrap = html.includes('bootstrap');
  const hasTailwind = html.includes('tailwind');
  const hasFoundation = html.includes('foundation');

  const passed = hasMobileStyles || hasBootstrap || hasTailwind || hasFoundation;

  return {
    name: 'Text Readability',
    description: 'Font sizes are legible on mobile devices',
    passed,
    issue: passed ? null : 'No responsive font sizing detected',
    impact: 'medium'
  };
}

function checkTouchTargets(html) {
  // Check for buttons and interactive elements
  const buttonCount = (html.match(/<button[^>]*>/gi) || []).length;
  const linkCount = (html.match(/<a[^>]*>/gi) || []).length;
  const inputCount = (html.match(/<input[^>]*>/gi) || []).length;
  
  const totalInteractive = buttonCount + linkCount + inputCount;
  
  // Check for CSS that might affect touch target sizing
  const hasMinHeightStyles = html.includes('min-height') || html.includes('padding');
  const hasTouchStyles = html.includes('touch-action') || html.includes('cursor: pointer');
  
  // Simple heuristic: if there are interactive elements and some styling, assume touch targets are adequate
  const passed = totalInteractive > 0 && (hasMinHeightStyles || hasTouchStyles);

  return {
    name: 'Touch Target Size',
    description: 'Interactive elements are large enough for touch',
    passed,
    issue: passed ? null : 'Touch targets may be too small',
    impact: 'medium'
  };
}

function checkContentSizing(html) {
  // Check for horizontal scrolling issues
  const hasOverflowStyles = html.includes('overflow-x') || html.includes('max-width');
  const hasResponsiveImages = html.includes('max-width: 100%') || html.includes('responsive');
  const hasFlexbox = html.includes('display: flex') || html.includes('flexbox');
  const hasGrid = html.includes('display: grid') || html.includes('css-grid');
  
  const passed = hasOverflowStyles || hasResponsiveImages || hasFlexbox || hasGrid;

  return {
    name: 'Content Sizing',
    description: 'Content fits within the screen width',
    passed,
    issue: passed ? null : 'Content may cause horizontal scrolling',
    impact: 'high'
  };
}

function checkResponsiveDesign(html) {
  // Check for responsive design indicators
  const hasMediaQueries = html.includes('@media');
  const hasBootstrap = html.includes('bootstrap') || html.includes('col-');
  const hasTailwind = html.includes('tailwind') || html.includes('sm:') || html.includes('md:') || html.includes('lg:');
  const hasFoundation = html.includes('foundation') || html.includes('small-') || html.includes('medium-') || html.includes('large-');
  const hasFlexbox = html.includes('flex-wrap') || html.includes('flex-direction');
  const hasGrid = html.includes('grid-template') || html.includes('grid-gap');

  const passed = hasMediaQueries || hasBootstrap || hasTailwind || hasFoundation || hasFlexbox || hasGrid;

  return {
    name: 'Responsive Design',
    description: 'Uses responsive design techniques',
    passed,
    issue: passed ? null : 'No responsive design patterns detected',
    impact: 'high'
  };
}

function generateRecommendations(checks) {
  const recommendations = [];
  
  const failedChecks = checks.filter(check => !check.passed);
  
  if (failedChecks.length === 0) {
    return ['Your website appears to be mobile-friendly! Keep monitoring for continuous optimization.'];
  }

  failedChecks.forEach(check => {
    switch (check.name) {
      case 'Viewport Configuration':
        recommendations.push('Add a viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1.0">');
        break;
      case 'Text Readability':
        recommendations.push('Use responsive font sizes (em, rem, or %) and ensure text is at least 16px on mobile');
        break;
      case 'Touch Target Size':
        recommendations.push('Make buttons and links at least 44px in height/width for easy touch interaction');
        break;
      case 'Content Sizing':
        recommendations.push('Ensure images and content have max-width: 100% to prevent horizontal scrolling');
        break;
      case 'Responsive Design':
        recommendations.push('Implement responsive design using CSS media queries or a responsive framework');
        break;
    }
  });

  // Add general recommendations
  if (failedChecks.length > 2) {
    recommendations.push('Consider using a responsive CSS framework like Bootstrap or Tailwind CSS');
    recommendations.push('Test your website on various mobile devices and screen sizes');
  }

  return recommendations;
}