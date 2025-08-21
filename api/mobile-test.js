export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const mockResults = generateMockMobileTestData(url);
    return res.json(mockResults);
  } catch (error) {
    console.error('Mobile test error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while testing mobile compatibility'
    });
  }
}

function generateMockMobileTestData(url) {
  const score = Math.floor(Math.random() * 30) + 70; // 70-100
  const isMobileFriendly = score >= 80;

  const checks = [
    {
      name: 'Viewport Configuration',
      description: 'Uses a responsive viewport meta tag',
      passed: Math.random() > 0.2
    },
    {
      name: 'Text Readability',
      description: 'Font sizes are legible on mobile devices',
      passed: Math.random() > 0.3
    },
    {
      name: 'Touch Target Size',
      description: 'Buttons and links are appropriately sized for touch',
      passed: Math.random() > 0.3
    },
    {
      name: 'Content Width',
      description: 'Content fits within viewport without horizontal scrolling',
      passed: Math.random() > 0.2
    },
    {
      name: 'Mobile-First CSS',
      description: 'Uses responsive design patterns',
      passed: Math.random() > 0.4
    },
    {
      name: 'Image Optimization',
      description: 'Images are optimized for mobile loading',
      passed: Math.random() > 0.3
    }
  ];

  const devices = [
    { name: 'iPhone 14', resolution: '390x844', score: score + Math.floor(Math.random() * 10) - 5 },
    { name: 'Samsung Galaxy S23', resolution: '360x780', score: score + Math.floor(Math.random() * 10) - 5 },
    { name: 'iPad Pro', resolution: '1024x1366', score: Math.min(100, score + Math.floor(Math.random() * 15)) }
  ];

  const issues = [];
  if (!checks[0].passed) issues.push({
    title: 'Missing Viewport Meta Tag',
    description: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">'
  });
  if (!checks[1].passed) issues.push({
    title: 'Small Font Sizes Detected',
    description: 'Some text is smaller than 12px and may be hard to read on mobile'
  });
  if (!checks[2].passed) issues.push({
    title: 'Touch Targets Too Small',
    description: 'Some clickable elements are smaller than 48x48 pixels'
  });

  return {
    success: true,
    url: url,
    score: score,
    isMobileFriendly: isMobileFriendly,
    checks: checks,
    devices: devices,
    issues: issues
  };
}