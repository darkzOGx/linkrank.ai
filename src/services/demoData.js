/**
 * Demo data for testing SEO analysis when real websites are blocked by CORS
 */

export const DEMO_WEBSITES = {
  'demo.linkrank.ai': {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="This is a sample website for demonstrating SEO analysis capabilities. It includes various SEO elements for testing purposes.">
    <title>Demo Website - SEO Analysis Test Page</title>
    <link rel="canonical" href="https://demo.linkrank.ai">
    <meta name="robots" content="index, follow">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Demo Website",
      "description": "SEO analysis test page"
    }
    </script>
</head>
<body>
    <header>
        <h1>Welcome to Our Demo Website</h1>
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
    </header>
    
    <main>
        <section>
            <h2>Main Content Section</h2>
            <p>This is a paragraph with some content.</p>
            <img src="/image1.jpg" alt="Sample image with proper alt text">
            <img src="/image2.jpg" alt="Another properly optimized image">
            <img src="/image3.jpg"> <!-- Missing alt text for testing -->
        </section>
        
        <section>
            <h3>Secondary Section</h3>
            <p>More content here with <a href="https://external-site.com">external link</a> and <a href="/internal-page">internal link</a>.</p>
        </section>
        
        <form>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email">
            
            <label for="name">Name:</label>
            <input type="text" id="name" name="name">
            
            <!-- Unlabeled input for testing -->
            <input type="text" name="unlabeled" placeholder="No label">
            
            <button type="submit">Submit</button>
        </form>
    </main>
    
    <footer>
        <p>&copy; 2025 Demo Website. All rights reserved.</p>
    </footer>
</body>
</html>`,
    status: 200,
    headers: new Map([
      ['content-type', 'text/html; charset=utf-8'],
      ['cache-control', 'max-age=3600']
    ])
  },
  
  'example.com': {
    html: `<!DOCTYPE html>
<html>
<head>
    <title>Example Domain</title>
    <meta name="description" content="This domain is for use in illustrative examples in documents.">
    <meta charset="utf-8">
</head>
<body>
    <div>
        <h1>Example Domain</h1>
        <p>This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.</p>
        <p><a href="https://www.iana.org/domains/example">More information...</a></p>
    </div>
</body>
</html>`,
    status: 200,
    headers: new Map([
      ['content-type', 'text/html; charset=utf-8']
    ])
  }
};

export function isDemoWebsite(url) {
  const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return DEMO_WEBSITES.hasOwnProperty(cleanUrl);
}

export function getDemoData(url) {
  const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return DEMO_WEBSITES[cleanUrl] || null;
}