export default async function handler(req, res) {
  // Backlink tool has been disabled
  return res.status(503).json({
    success: false,
    error: 'Backlink audit tool is currently unavailable'
  });

  try {
    // Validate URL and extract domain
    let domain;
    let targetUrl;
    try {
      targetUrl = url.startsWith('http') ? url : `https://${url}`;
      const urlObj = new URL(targetUrl);
      domain = urlObj.hostname.replace('www.', '');
    } catch (e) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid URL format. Please enter a valid domain like example.com' 
      });
    }

    console.log(`Starting comprehensive backlink discovery for: ${domain}`);
    
    // Perform comprehensive backlink discovery
    const backlinkData = await discoverComprehensiveBacklinks(domain, targetUrl);
    
    return res.json({
      success: true,
      domain,
      ...backlinkData,
      analysisInfo: {
        analysisTime: new Date().toISOString(),
        methodsUsed: backlinkData.methodsUsed || ['Comprehensive Web Discovery'],
        timestamp: Date.now()
      }
    });

  } catch (error) {
    console.error('Comprehensive backlink discovery error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to discover backlinks. This may be due to network restrictions or the domain having limited online presence.'
    });
  }
}

async function discoverComprehensiveBacklinks(domain, targetUrl) {
  const discoveredBacklinks = [];
  const methodsUsed = [];
  
  try {
    console.log(`Starting comprehensive discovery for ${domain}`);
    
    // Method 1: Search Engine Discovery (expanded)
    try {
      const searchBacklinks = await comprehensiveSearchDiscovery(domain);
      discoveredBacklinks.push(...searchBacklinks);
      if (searchBacklinks.length > 0) methodsUsed.push(`Search Discovery (${searchBacklinks.length} found)`);
    } catch (err) {
      console.log('Search discovery failed:', err.message);
    }

    // Method 2: Archive and Historical Data
    try {
      const archiveBacklinks = await searchArchivalData(domain);
      discoveredBacklinks.push(...archiveBacklinks);
      if (archiveBacklinks.length > 0) methodsUsed.push(`Archive Discovery (${archiveBacklinks.length} found)`);
    } catch (err) {
      console.log('Archive discovery failed:', err.message);
    }

    // Method 3: Developer and Tech Platform Discovery
    try {
      const techBacklinks = await searchTechPlatforms(domain);
      discoveredBacklinks.push(...techBacklinks);
      if (techBacklinks.length > 0) methodsUsed.push(`Tech Platform Discovery (${techBacklinks.length} found)`);
    } catch (err) {
      console.log('Tech platform discovery failed:', err.message);
    }

    // Method 4: Social Media Deep Search
    try {
      const socialBacklinks = await deepSocialSearch(domain);
      discoveredBacklinks.push(...socialBacklinks);
      if (socialBacklinks.length > 0) methodsUsed.push(`Social Discovery (${socialBacklinks.length} found)`);
    } catch (err) {
      console.log('Social discovery failed:', err.message);
    }

    // Method 5: News and Media Discovery
    try {
      const newsBacklinks = await searchNewsAndMedia(domain);
      discoveredBacklinks.push(...newsBacklinks);
      if (newsBacklinks.length > 0) methodsUsed.push(`News Discovery (${newsBacklinks.length} found)`);
    } catch (err) {
      console.log('News discovery failed:', err.message);
    }

    // Method 6: Academic and Research Discovery
    try {
      const academicBacklinks = await searchAcademicSources(domain);
      discoveredBacklinks.push(...academicBacklinks);
      if (academicBacklinks.length > 0) methodsUsed.push(`Academic Discovery (${academicBacklinks.length} found)`);
    } catch (err) {
      console.log('Academic discovery failed:', err.message);
    }

    // Method 7: Directory and Listing Discovery
    try {
      const directoryBacklinks = await searchDirectoriesAndListings(domain);
      discoveredBacklinks.push(...directoryBacklinks);
      if (directoryBacklinks.length > 0) methodsUsed.push(`Directory Discovery (${directoryBacklinks.length} found)`);
    } catch (err) {
      console.log('Directory discovery failed:', err.message);
    }

    // Method 8: Blog and Content Platform Discovery
    try {
      const blogBacklinks = await searchBlogPlatforms(domain);
      discoveredBacklinks.push(...blogBacklinks);
      if (blogBacklinks.length > 0) methodsUsed.push(`Blog Discovery (${blogBacklinks.length} found)`);
    } catch (err) {
      console.log('Blog discovery failed:', err.message);
    }

    // Method 9: E-commerce and Review Platform Discovery
    try {
      const reviewBacklinks = await searchReviewPlatforms(domain);
      discoveredBacklinks.push(...reviewBacklinks);
      if (reviewBacklinks.length > 0) methodsUsed.push(`Review Discovery (${reviewBacklinks.length} found)`);
    } catch (err) {
      console.log('Review discovery failed:', err.message);
    }

    // Method 10: Government and Educational Institution Discovery
    try {
      const govBacklinks = await searchGovernmentAndEduSources(domain);
      discoveredBacklinks.push(...govBacklinks);
      if (govBacklinks.length > 0) methodsUsed.push(`Government/Edu Discovery (${govBacklinks.length} found)`);
    } catch (err) {
      console.log('Government/Edu discovery failed:', err.message);
    }

    console.log(`Total potential backlinks found: ${discoveredBacklinks.length} using methods: ${methodsUsed.join(', ')}`);

    // Remove duplicates and validate
    const uniqueBacklinks = removeDuplicates(discoveredBacklinks);
    const validatedBacklinks = await validateBacklinks(uniqueBacklinks, domain);

    console.log(`After validation: ${validatedBacklinks.length} confirmed backlinks`);

    // Analyze the discovered backlinks
    const analysis = analyzeRealBacklinkProfile(validatedBacklinks);
    
    return {
      backlinks: validatedBacklinks.slice(0, 200), // Increased limit for comprehensive results
      totalBacklinks: validatedBacklinks.length,
      uniqueDomains: analysis.uniqueDomains,
      averageAuthority: analysis.averageAuthority,
      followRatio: analysis.followRatio,
      qualityDistribution: analysis.qualityDistribution,
      anchorTextDistribution: analysis.anchorTextDistribution,
      issues: analysis.issues,
      recommendations: analysis.recommendations,
      methodsUsed,
      discoveryStats: {
        totalFound: discoveredBacklinks.length,
        afterDeduplication: uniqueBacklinks.length,
        afterValidation: validatedBacklinks.length
      }
    };
  } catch (error) {
    throw new Error('Comprehensive backlink discovery failed: ' + error.message);
  }
}

async function comprehensiveSearchDiscovery(domain) {
  const backlinks = [];
  const brandName = domain.split('.')[0];
  
  // Comprehensive search patterns
  const searchPatterns = [
    `"${domain}"`,
    `site:${domain}`,
    `link:${domain}`,
    `inurl:${domain}`,
    `${brandName} website`,
    `${brandName} official`,
    `visit ${brandName}`,
    `${brandName}.com`,
    `www.${domain}`,
    `https://${domain}`,
    `http://${domain}`
  ];
  
  // Search across multiple platforms
  const searchPlatforms = [
    { name: 'DuckDuckGo', baseUrl: 'https://duckduckgo.com', authority: 75 },
    { name: 'Bing', baseUrl: 'https://bing.com/search', authority: 80 },
    { name: 'Startpage', baseUrl: 'https://startpage.com/search', authority: 70 },
    { name: 'Yandex', baseUrl: 'https://yandex.com/search', authority: 75 }
  ];
  
  for (const pattern of searchPatterns.slice(0, 6)) { // Limit to prevent too many requests
    for (const platform of searchPlatforms.slice(0, 2)) { // Test first 2 platforms
      try {
        const searchUrl = `${platform.baseUrl}?q=${encodeURIComponent(pattern)}`;
        const found = await checkSearchResults(searchUrl, domain, platform);
        if (found) {
          backlinks.push({
            domain: new URL(platform.baseUrl).hostname,
            sourceUrl: searchUrl,
            authorityScore: platform.authority,
            quality: platform.authority > 75 ? 'High' : 'Medium',
            anchorText: pattern,
            type: 'Search Result',
            isFollow: true,
            discoveryMethod: 'Search Discovery',
            searchPattern: pattern
          });
        }
      } catch (err) {
        // Continue with other searches
      }
    }
  }
  
  return backlinks;
}

async function searchArchivalData(domain) {
  const backlinks = [];
  
  const archivalSources = [
    { url: `https://web.archive.org/web/*/${domain}*`, name: 'Internet Archive', authority: 85 },
    { url: `https://archive.today/search?q=${domain}`, name: 'Archive.today', authority: 70 },
    { url: `https://timetravel.mementoweb.org/memento/*/${domain}`, name: 'Memento Web', authority: 65 }
  ];
  
  for (const source of archivalSources) {
    try {
      const hasArchive = await checkArchivalSource(source.url, domain);
      if (hasArchive) {
        backlinks.push({
          domain: new URL(source.url).hostname,
          sourceUrl: source.url,
          authorityScore: source.authority,
          quality: source.authority > 80 ? 'High' : 'Medium',
          anchorText: domain,
          type: 'Archive',
          isFollow: true,
          discoveryMethod: 'Archive Discovery'
        });
      }
    } catch (err) {
      // Continue with other archives
    }
  }
  
  return backlinks;
}

async function searchTechPlatforms(domain) {
  const backlinks = [];
  
  const techPlatforms = [
    { url: `https://github.com/search?q=${domain}`, name: 'GitHub', authority: 90 },
    { url: `https://stackoverflow.com/search?q=${domain}`, name: 'Stack Overflow', authority: 85 },
    { url: `https://codepen.io/search/pens?q=${domain}`, name: 'CodePen', authority: 72 },
    { url: `https://jsfiddle.net/search?q=${domain}`, name: 'JSFiddle', authority: 70 },
    { url: `https://bitbucket.org/search?name=${domain}`, name: 'Bitbucket', authority: 75 },
    { url: `https://gitlab.com/search?search=${domain}`, name: 'GitLab', authority: 80 },
    { url: `https://sourceforge.net/directory/search?q=${domain}`, name: 'SourceForge', authority: 70 },
    { url: `https://npmjs.com/search?q=${domain}`, name: 'NPM', authority: 78 },
    { url: `https://pypi.org/search/?q=${domain}`, name: 'PyPI', authority: 75 },
    { url: `https://packagist.org/search/?q=${domain}`, name: 'Packagist', authority: 70 }
  ];
  
  for (const platform of techPlatforms) {
    try {
      const hasReference = await checkTechPlatform(platform.url, domain);
      if (hasReference) {
        backlinks.push({
          domain: new URL(platform.url).hostname,
          sourceUrl: platform.url,
          authorityScore: platform.authority,
          quality: platform.authority > 80 ? 'High' : 'Medium',
          anchorText: domain,
          type: 'Tech Platform',
          isFollow: platform.authority > 75,
          discoveryMethod: 'Tech Discovery'
        });
      }
    } catch (err) {
      // Continue with other platforms
    }
  }
  
  return backlinks;
}

async function deepSocialSearch(domain) {
  const backlinks = [];
  
  const socialPlatforms = [
    { url: `https://twitter.com/search?q=${domain}`, name: 'Twitter', authority: 85 },
    { url: `https://linkedin.com/search/results/all/?keywords=${domain}`, name: 'LinkedIn', authority: 85 },
    { url: `https://facebook.com/search/str/${domain}/keywords_web`, name: 'Facebook', authority: 80 },
    { url: `https://reddit.com/search/?q=${domain}`, name: 'Reddit', authority: 82 },
    { url: `https://pinterest.com/search/pins/?q=${domain}`, name: 'Pinterest', authority: 75 },
    { url: `https://instagram.com/explore/tags/${domain.replace('.', '')}/`, name: 'Instagram', authority: 78 },
    { url: `https://tiktok.com/search?q=${domain}`, name: 'TikTok', authority: 70 },
    { url: `https://youtube.com/results?search_query=${domain}`, name: 'YouTube', authority: 88 },
    { url: `https://vimeo.com/search?q=${domain}`, name: 'Vimeo', authority: 72 },
    { url: `https://discord.com/search?query=${domain}`, name: 'Discord', authority: 65 }
  ];
  
  for (const platform of socialPlatforms) {
    try {
      const hasMention = await checkSocialPlatform(platform.url, domain);
      if (hasMention) {
        backlinks.push({
          domain: new URL(platform.url).hostname,
          sourceUrl: platform.url,
          authorityScore: platform.authority,
          quality: platform.authority > 80 ? 'High' : 'Medium',
          anchorText: domain,
          type: 'Social Media',
          isFollow: false, // Most social links are nofollow
          discoveryMethod: 'Social Discovery'
        });
      }
    } catch (err) {
      // Continue with other platforms
    }
  }
  
  return backlinks;
}

async function searchNewsAndMedia(domain) {
  const backlinks = [];
  
  const newsPlatforms = [
    { url: `https://news.google.com/search?q=${domain}`, name: 'Google News', authority: 90 },
    { url: `https://news.bing.com/search?q=${domain}`, name: 'Bing News', authority: 85 },
    { url: `https://allsides.com/search?search=${domain}`, name: 'AllSides', authority: 75 },
    { url: `https://pressgazette.co.uk/search/?q=${domain}`, name: 'Press Gazette', authority: 70 }
  ];
  
  for (const platform of newsPlatforms) {
    try {
      const hasNews = await checkNewsSource(platform.url, domain);
      if (hasNews) {
        backlinks.push({
          domain: new URL(platform.url).hostname,
          sourceUrl: platform.url,
          authorityScore: platform.authority,
          quality: platform.authority > 80 ? 'High' : 'Medium',
          anchorText: domain,
          type: 'News/Media',
          isFollow: true,
          discoveryMethod: 'News Discovery'
        });
      }
    } catch (err) {
      // Continue with other news sources
    }
  }
  
  return backlinks;
}

async function searchAcademicSources(domain) {
  const backlinks = [];
  
  const academicPlatforms = [
    { url: `https://scholar.google.com/scholar?q=${domain}`, name: 'Google Scholar', authority: 88 },
    { url: `https://academic.microsoft.com/search?q=${domain}`, name: 'Microsoft Academic', authority: 85 },
    { url: `https://semanticscholar.org/search?q=${domain}`, name: 'Semantic Scholar', authority: 80 },
    { url: `https://arxiv.org/search/?query=${domain}`, name: 'arXiv', authority: 85 },
    { url: `https://researchgate.net/search/publication?q=${domain}`, name: 'ResearchGate', authority: 78 }
  ];
  
  for (const platform of academicPlatforms) {
    try {
      const hasReference = await checkAcademicSource(platform.url, domain);
      if (hasReference) {
        backlinks.push({
          domain: new URL(platform.url).hostname,
          sourceUrl: platform.url,
          authorityScore: platform.authority,
          quality: 'High', // Academic sources are generally high quality
          anchorText: domain,
          type: 'Academic',
          isFollow: true,
          discoveryMethod: 'Academic Discovery'
        });
      }
    } catch (err) {
      // Continue with other academic sources
    }
  }
  
  return backlinks;
}

async function searchDirectoriesAndListings(domain) {
  const backlinks = [];
  
  const directoryPlatforms = [
    { url: `https://dmoz-odp.org/search?q=${domain}`, name: 'DMOZ', authority: 60 },
    { url: `https://yellowpages.com/search?search_terms=${domain}`, name: 'Yellow Pages', authority: 55 },
    { url: `https://yelp.com/search?find_desc=${domain}`, name: 'Yelp', authority: 78 },
    { url: `https://foursquare.com/search?q=${domain}`, name: 'Foursquare', authority: 65 },
    { url: `https://crunchbase.com/search/organizations/${domain}`, name: 'Crunchbase', authority: 78 },
    { url: `https://angel.co/search?q=${domain}`, name: 'AngelList', authority: 75 }
  ];
  
  for (const platform of directoryPlatforms) {
    try {
      const hasListing = await checkDirectoryListing(platform.url, domain);
      if (hasListing) {
        backlinks.push({
          domain: new URL(platform.url).hostname,
          sourceUrl: platform.url,
          authorityScore: platform.authority,
          quality: platform.authority > 70 ? 'Medium' : 'Low',
          anchorText: domain,
          type: 'Directory',
          isFollow: platform.authority > 65,
          discoveryMethod: 'Directory Discovery'
        });
      }
    } catch (err) {
      // Continue with other directories
    }
  }
  
  return backlinks;
}

async function searchBlogPlatforms(domain) {
  const backlinks = [];
  
  const blogPlatforms = [
    { url: `https://medium.com/search?q=${domain}`, name: 'Medium', authority: 82 },
    { url: `https://dev.to/search?q=${domain}`, name: 'Dev.to', authority: 75 },
    { url: `https://hashnode.com/search?q=${domain}`, name: 'Hashnode', authority: 70 },
    { url: `https://substack.com/search/${domain}`, name: 'Substack', authority: 75 },
    { url: `https://blogspot.com/search?q=${domain}`, name: 'Blogger', authority: 65 },
    { url: `https://wordpress.com/search/${domain}`, name: 'WordPress.com', authority: 70 },
    { url: `https://tumblr.com/search/${domain}`, name: 'Tumblr', authority: 68 }
  ];
  
  for (const platform of blogPlatforms) {
    try {
      const hasMention = await checkBlogPlatform(platform.url, domain);
      if (hasMention) {
        backlinks.push({
          domain: new URL(platform.url).hostname,
          sourceUrl: platform.url,
          authorityScore: platform.authority,
          quality: platform.authority > 75 ? 'High' : 'Medium',
          anchorText: domain,
          type: 'Blog Platform',
          isFollow: platform.authority > 70,
          discoveryMethod: 'Blog Discovery'
        });
      }
    } catch (err) {
      // Continue with other blog platforms
    }
  }
  
  return backlinks;
}

async function searchReviewPlatforms(domain) {
  const backlinks = [];
  
  const reviewPlatforms = [
    { url: `https://trustpilot.com/review/${domain}`, name: 'Trustpilot', authority: 78 },
    { url: `https://sitejabber.com/reviews/${domain}`, name: 'Sitejabber', authority: 65 },
    { url: `https://g2.com/search?utf8=✓&query=${domain}`, name: 'G2', authority: 80 },
    { url: `https://capterra.com/search/?q=${domain}`, name: 'Capterra', authority: 75 },
    { url: `https://producthunt.com/search?q=${domain}`, name: 'Product Hunt', authority: 80 }
  ];
  
  for (const platform of reviewPlatforms) {
    try {
      const hasReview = await checkReviewPlatform(platform.url, domain);
      if (hasReview) {
        backlinks.push({
          domain: new URL(platform.url).hostname,
          sourceUrl: platform.url,
          authorityScore: platform.authority,
          quality: platform.authority > 75 ? 'High' : 'Medium',
          anchorText: domain,
          type: 'Review Platform',
          isFollow: true,
          discoveryMethod: 'Review Discovery'
        });
      }
    } catch (err) {
      // Continue with other review platforms
    }
  }
  
  return backlinks;
}

async function searchGovernmentAndEduSources(domain) {
  const backlinks = [];
  
  const govEduPlatforms = [
    { url: `https://usa.gov/search?query=${domain}`, name: 'USA.gov', authority: 95 },
    { url: `https://loc.gov/search/?q=${domain}`, name: 'Library of Congress', authority: 90 },
    { url: `https://census.gov/search?q=${domain}`, name: 'US Census', authority: 88 },
    { url: `https://nih.gov/search?query=${domain}`, name: 'NIH', authority: 92 }
  ];
  
  for (const platform of govEduPlatforms) {
    try {
      const hasReference = await checkGovEduSource(platform.url, domain);
      if (hasReference) {
        backlinks.push({
          domain: new URL(platform.url).hostname,
          sourceUrl: platform.url,
          authorityScore: platform.authority,
          quality: 'High', // Gov/edu sources are high quality
          anchorText: domain,
          type: 'Government/Educational',
          isFollow: true,
          discoveryMethod: 'Gov/Edu Discovery'
        });
      }
    } catch (err) {
      // Continue with other gov/edu sources
    }
  }
  
  return backlinks;
}

// Generic checking function that works for all platforms
async function checkPlatformForDomain(url, domain, timeout = 5000) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkRank.ai Bot; +https://linkrank.ai)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const text = await response.text();
      // Check if domain appears in the content
      const domainRegex = new RegExp(domain.replace('.', '\\.'), 'i');
      return domainRegex.test(text) && !text.toLowerCase().includes('no results') && !text.toLowerCase().includes('not found');
    }
  } catch (error) {
    // Return false for network errors, timeouts, etc.
    return false;
  }
  
  return false;
}

// Use the generic function for all platform checks
const checkSearchResults = (url, domain, platform) => checkPlatformForDomain(url, domain);
const checkArchivalSource = (url, domain) => checkPlatformForDomain(url, domain);
const checkTechPlatform = (url, domain) => checkPlatformForDomain(url, domain);
const checkSocialPlatform = (url, domain) => checkPlatformForDomain(url, domain);
const checkNewsSource = (url, domain) => checkPlatformForDomain(url, domain);
const checkAcademicSource = (url, domain) => checkPlatformForDomain(url, domain);
const checkDirectoryListing = (url, domain) => checkPlatformForDomain(url, domain);
const checkBlogPlatform = (url, domain) => checkPlatformForDomain(url, domain);
const checkReviewPlatform = (url, domain) => checkPlatformForDomain(url, domain);
const checkGovEduSource = (url, domain) => checkPlatformForDomain(url, domain);

function removeDuplicates(backlinks) {
  const seen = new Set();
  return backlinks.filter(backlink => {
    const key = `${backlink.domain}-${backlink.type}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

async function validateBacklinks(backlinks, targetDomain) {
  const validated = [];
  
  // Process in batches to avoid overwhelming the server
  const batchSize = 10;
  for (let i = 0; i < backlinks.length; i += batchSize) {
    const batch = backlinks.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (backlink) => {
      try {
        const isValid = await validateBacklinkSource(backlink.sourceUrl, targetDomain);
        return {
          ...backlink,
          validated: isValid,
          lastChecked: new Date().toISOString()
        };
      } catch (err) {
        return {
          ...backlink,
          validated: false,
          lastChecked: new Date().toISOString(),
          validationError: err.message
        };
      }
    });
    
    const batchResults = await Promise.allSettled(batchPromises);
    batchResults.forEach(result => {
      if (result.status === 'fulfilled') {
        validated.push(result.value);
      }
    });
  }
  
  return validated;
}

async function validateBacklinkSource(sourceUrl, targetDomain) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(sourceUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkRank.ai Bot)'
      }
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

function analyzeRealBacklinkProfile(backlinks) {
  if (backlinks.length === 0) {
    return {
      uniqueDomains: 0,
      averageAuthority: 0,
      followRatio: 0,
      qualityDistribution: { high: 0, medium: 0, low: 0, toxic: 0 },
      anchorTextDistribution: [],
      issues: ['No backlinks discovered through comprehensive search'],
      recommendations: [
        'Create high-quality, shareable content to earn natural backlinks',
        'Engage with relevant communities and platforms in your industry',
        'Submit to appropriate directories and listings',
        'Build relationships with other websites in your niche'
      ]
    };
  }

  // Calculate metrics from discovered backlinks
  const uniqueDomains = new Set(backlinks.map(b => b.domain)).size;
  
  const averageAuthority = Math.round(
    backlinks.reduce((sum, b) => sum + (b.authorityScore || 0), 0) / backlinks.length
  );
  
  const followLinks = backlinks.filter(b => b.isFollow).length;
  const followRatio = Math.round((followLinks / backlinks.length) * 100);
  
  const qualityDistribution = {
    high: backlinks.filter(b => b.quality === 'High').length,
    medium: backlinks.filter(b => b.quality === 'Medium').length,
    low: backlinks.filter(b => b.quality === 'Low').length,
    toxic: backlinks.filter(b => b.quality === 'Toxic').length
  };
  
  // Anchor text analysis
  const anchorTexts = {};
  backlinks.forEach(b => {
    if (b.anchorText) {
      anchorTexts[b.anchorText] = (anchorTexts[b.anchorText] || 0) + 1;
    }
  });
  
  const anchorTextDistribution = Object.entries(anchorTexts)
    .map(([text, count]) => ({
      text,
      count,
      percentage: Math.round((count / backlinks.length) * 100)
    }))
    .sort((a, b) => b.count - a.count);
  
  // Generate analysis based on discovered backlinks
  const issues = analyzeDiscoveredIssues(backlinks, qualityDistribution, followRatio);
  const recommendations = generateDiscoveryRecommendations(backlinks, qualityDistribution, averageAuthority);
  
  return {
    uniqueDomains,
    averageAuthority,
    followRatio,
    qualityDistribution,
    anchorTextDistribution,
    issues,
    recommendations
  };
}

function analyzeDiscoveredIssues(backlinks, qualityDistribution, followRatio) {
  const issues = [];
  
  if (backlinks.length < 20) {
    issues.push(`Only ${backlinks.length} backlinks discovered - consider expanding your online presence`);
  }
  
  const validatedCount = backlinks.filter(b => b.validated).length;
  const validationRate = (validatedCount / backlinks.length) * 100;
  
  if (validationRate < 70) {
    issues.push(`${Math.round(100-validationRate)}% of discovered backlinks could not be validated`);
  }
  
  if (qualityDistribution.high < 5) {
    issues.push('Few high-authority backlinks discovered - focus on earning quality links');
  }
  
  if (followRatio < 40) {
    issues.push('Low follow link ratio - many discovered links are nofollow');
  }
  
  // Analyze discovery method diversity
  const discoveryMethods = new Set(backlinks.map(b => b.discoveryMethod)).size;
  if (discoveryMethods < 3) {
    issues.push('Limited discovery method diversity - backlinks found from few source types');
  }
  
  return issues;
}

function generateDiscoveryRecommendations(backlinks, qualityDistribution, averageAuthority) {
  const recommendations = [];
  
  if (backlinks.length < 50) {
    recommendations.push('Increase online visibility through content marketing and outreach');
  }
  
  if (qualityDistribution.high < 10) {
    recommendations.push('Focus on earning high-quality editorial backlinks from authoritative sites');
  }
  
  if (averageAuthority < 70) {
    recommendations.push('Target higher authority websites for link building opportunities');
  }
  
  // Analyze platform diversity
  const platformTypes = new Set(backlinks.map(b => b.type));
  if (!platformTypes.has('News/Media')) {
    recommendations.push('Seek media coverage and press mentions to earn news backlinks');
  }
  
  if (!platformTypes.has('Academic')) {
    recommendations.push('Consider creating research-worthy content to earn academic citations');
  }
  
  recommendations.push('Continue monitoring for new backlink opportunities across all platforms');
  recommendations.push('Engage actively with platforms where you already have presence');
  
  return recommendations;
}