/**
 * Simplified Server-side SEO Analysis API
 * Provides comprehensive mock data that demonstrates all features
 */

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
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Generate comprehensive mock analysis that demonstrates all features
    const analysis = {
      url: normalizedUrl,
      original_url: url,
      timestamp: new Date().toISOString(),
      response_time: Math.floor(Math.random() * 1000) + 500, // 500-1500ms
      overall_score: 78,
      
      // Legacy compatibility for existing components
      title_tag: {
        value: "Professional SEO Services | Digital Marketing Agency | YourCompany",
        score: 85
      },
      meta_description: {
        value: "Transform your online presence with our expert SEO services. We help businesses increase organic traffic, improve search rankings, and drive qualified leads.",
        score: 92
      },
      headings: {
        h1_count: 1,
        score: 95
      },
      images: {
        total_images: 8,
        missing_alt: 2,
        score: 75
      },
      page_speed: {
        load_time: 1.8,
        score: 82
      },
      mobile_friendly: {
        is_mobile_friendly: true,
        score: 100
      },
      https: {
        is_https: true,
        score: 100
      },
      content: {
        word_count: 1250,
        score: 88
      },
      links: {
        internal_count: 12,
        external_count: 3,
        internal_score: 90,
        external_score: 85
      },
      
      // Enhanced analysis results
      onpage_score: 84,
      technical_score: 89,
      content_score: 72,
      
      // Detailed analysis breakdown with comprehensive examples
      analysis: {
        on_page: {
          score: 84,
          results: [
            {
              label: 'Title Tag',
              description: 'The HTML title tag is the most critical on-page SEO element, appearing as the clickable headline in search results.',
              current: 'Professional SEO Services | Digital Marketing Agency | YourCompany',
              path: 'Line 8',
              score: 85,
              issues: ['Title could include more specific keywords'],
              recommendations: ['Consider adding location-based keywords if targeting local search'],
              practicalExample: '<title>SEO Services Los Angeles | Digital Marketing Agency | YourCompany</title>',
              details: ['Title length: 67 characters (optimal range)', 'Includes primary keyword and brand name']
            },
            {
              label: 'Meta Description',
              description: 'Meta descriptions provide page summaries in search results and significantly influence click-through rates.',
              current: 'Transform your online presence with our expert SEO services. We help businesses increase organic traffic, improve search rankings, and drive qualified leads.',
              path: 'Line 12',
              score: 92,
              issues: [],
              recommendations: ['Meta description is well optimized'],
              practicalExample: 'Current meta description is excellent and includes compelling call-to-action',
              details: ['Length: 156 characters (optimal)', 'Includes action words and benefits']
            },
            {
              label: 'Heading Structure (H1-H6)',
              description: 'Proper heading hierarchy helps search engines understand content structure and improves accessibility.',
              current: 'H1: 1, H2: 4, H3: 6, H4: 2, H5: 0, H6: 0',
              path: 'Throughout page content',
              score: 95,
              issues: [],
              recommendations: ['Excellent heading structure with proper hierarchy'],
              practicalExample: '<h1>Main Topic</h1>\n<h2>Primary Subtopic</h2>\n<h3>Supporting Details</h3>',
              details: [
                'H1 #1: "Professional SEO Services for Business Growth" at Line 45',
                'H2 #1: "Our SEO Process" at Line 78',
                'H2 #2: "Why Choose Our Agency" at Line 125',
                'Perfect hierarchy with no level skipping'
              ]
            },
            {
              label: 'Image Optimization',
              description: 'Proper image optimization improves accessibility, SEO, and page loading performance.',
              current: '8 total images, 2 missing alt text, 0 missing dimensions',
              path: 'Throughout page content',
              score: 75,
              issues: ['2 images missing alt attributes'],
              recommendations: ['Add descriptive alt text to all images for accessibility and SEO'],
              practicalExample: '<img src="team-photo.jpg" alt="SEO team collaborating on client strategy" width="400" height="300">',
              details: [
                'Image #3 missing alt text: hero-image.jpg at Line 67',
                'Image #7 missing alt text: testimonial-bg.jpg at Line 234',
                'Remaining 6 images properly optimized with alt text and dimensions'
              ]
            },
            {
              label: 'Link Structure',
              description: 'Internal and external links distribute authority and provide navigation paths for users and search engines.',
              current: '12 internal, 3 external, 0 with empty text',
              path: 'Throughout page content',
              score: 88,
              issues: ['1 external link missing rel attribute'],
              recommendations: ['Add rel="noopener" to external links for security'],
              practicalExample: '<a href="/services/local-seo" title="Learn about local SEO">Local SEO Services</a>',
              details: [
                'Internal link #1: "About Our Process" → /seo-process at Line 89',
                'Internal link #2: "Case Studies" → /case-studies at Line 156',
                'External link #1: "Google Guidelines" → https://developers.google.com at Line 201',
                'Good distribution of contextual internal links'
              ]
            }
          ]
        },
        technical: {
          score: 89,
          results: [
            {
              label: 'Server Response Time',
              description: 'Fast server response times are crucial for user experience and search engine crawling efficiency.',
              current: '850ms',
              path: 'Server-level metric',
              score: 82,
              issues: [],
              recommendations: ['Response time is good, consider optimizing for sub-500ms'],
              practicalExample: 'Implement server-side caching: Cache-Control: public, max-age=31536000'
            },
            {
              label: 'HTTPS Security',
              description: 'HTTPS encryption protects user data and is a confirmed Google ranking factor.',
              current: 'Secure HTTPS connection',
              path: 'URL protocol',
              score: 100,
              issues: [],
              recommendations: ['HTTPS properly configured'],
              practicalExample: 'Current implementation is secure and optimal'
            },
            {
              label: 'Mobile Viewport',
              description: 'Proper viewport configuration is essential for mobile-first indexing and responsive design.',
              current: 'Viewport meta tag found',
              path: 'HTML head section',
              score: 100,
              issues: [],
              recommendations: ['Viewport is properly configured'],
              practicalExample: 'Current: <meta name="viewport" content="width=device-width, initial-scale=1.0">'
            },
            {
              label: 'Canonical URL',
              description: 'Canonical URLs prevent duplicate content issues and consolidate page authority.',
              current: 'Canonical URL found',
              path: 'HTML head section',
              score: 100,
              issues: [],
              recommendations: ['Canonical URL properly set'],
              practicalExample: `Current: <link rel="canonical" href="${normalizedUrl}">`
            },
            {
              label: 'Structured Data',
              description: 'Structured data helps search engines understand your content and can enable rich snippets.',
              current: 'JSON-LD: 1, Microdata: 0',
              path: 'JSON-LD script found',
              score: 90,
              issues: [],
              recommendations: ['Consider expanding structured data for additional content types'],
              practicalExample: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Your SEO Agency",
  "url": "${normalizedUrl}",
  "address": {...}
}
</script>`
            }
          ]
        },
        content: {
          score: 72,
          results: [
            {
              label: 'Content Length & Quality',
              description: 'Sufficient, high-quality content helps search engines understand your page topic and provides user value.',
              current: '1250 words',
              path: 'Page body content',
              score: 88,
              issues: [],
              recommendations: ['Content length is excellent for SEO'],
              practicalExample: 'Current content provides comprehensive coverage of SEO services'
            },
            {
              label: 'Internal Link Structure',
              description: 'Internal links distribute page authority and help users navigate to related content.',
              current: '12 internal links',
              path: 'Throughout page content',
              score: 90,
              issues: [],
              recommendations: ['Excellent internal linking strategy'],
              practicalExample: 'Well-distributed contextual links to related services and resources',
              details: [
                'Internal link #1: "SEO Process" → /process at Line 89',
                'Internal link #2: "Local SEO" → /local-seo at Line 134',
                'Internal link #3: "Case Studies" → /case-studies at Line 167',
                'Internal link #4: "Blog" → /blog at Line 198',
                'Internal link #5: "Contact Us" → /contact at Line 245'
              ]
            },
            {
              label: 'External Link Strategy',
              description: 'Quality external links to authoritative sources enhance content credibility and user experience.',
              current: '3 external links',
              path: 'Throughout page content',
              score: 85,
              issues: ['1 external link missing rel attribute'],
              recommendations: ['Add rel="noopener" to external links for security'],
              practicalExample: '<a href="https://moz.com/beginners-guide-to-seo" rel="noopener" target="_blank">SEO Guide</a>',
              details: [
                'External link #1: "Google Search Guidelines" → https://developers.google.com at Line 156',
                'External link #2: "Moz SEO Guide" → https://moz.com at Line 189',
                'External link #3: "Search Engine Journal" → https://searchenginejournal.com at Line 223'
              ]
            },
            {
              label: 'Form Accessibility',
              description: 'Proper form labeling improves accessibility and user experience.',
              current: '2 forms, 8 inputs, 8 labels',
              path: 'Contact and newsletter forms',
              score: 100,
              issues: [],
              recommendations: ['All forms properly labeled for accessibility'],
              practicalExample: 'Current form implementation follows accessibility best practices'
            }
          ]
        }
      },
      
      metadata: {
        title: 'Professional SEO Services | Digital Marketing Agency | YourCompany',
        description: 'Transform your online presence with our expert SEO services. We help businesses increase organic traffic, improve search rankings, and drive qualified leads.',
        h1Count: 1,
        imageCount: 8,
        linkCount: 15,
        wordCount: 1250
      },
      
      // Action items summary
      recommendations: [
        {
          category: 'Image Optimization',
          priority: 'medium',
          description: 'Add alt text to 2 images that are missing descriptive text',
          how_to_fix: 'Review images at lines 67 and 234, add descriptive alt attributes'
        },
        {
          category: 'External Links',
          priority: 'low', 
          description: 'Add rel="noopener" to 1 external link for security',
          how_to_fix: 'Add rel="noopener" attribute to external link at line 201'
        },
        {
          category: 'Performance',
          priority: 'low',
          description: 'Server response time could be optimized further',
          how_to_fix: 'Implement additional caching layers or CDN optimization'
        }
      ]
    };
    
    return res.status(200).json(analysis);
    
  } catch (error) {
    console.error('Analysis error:', error.message);
    return res.status(500).json({ 
      error: 'Analysis failed', 
      message: error.message 
    });
  }
}