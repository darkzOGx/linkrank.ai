const fs = require('fs');

// Read the Resources.jsx file
const content = fs.readFileSync('src/pages/Resources.jsx', 'utf8');

// Extract the articles array
const startIndex = content.indexOf('const articles = [');
const endIndex = content.indexOf('];', startIndex) + 2;
const articlesSection = content.substring(startIndex, endIndex);

// Parse each article object
const articlePattern = /\{\s*id:\s*(\d+),[\s\S]*?\}(?=,\s*\{|\s*\];)/g;
const articles = [];
let match;

while ((match = articlePattern.exec(articlesSection)) !== null) {
  articles.push(match[0]);
}

// Extract dates for sorting
const articlesWithDates = articles.map(article => {
  const idMatch = article.match(/id:\s*(\d+)/);
  const dateMatch = article.match(/date:\s*"(\d{4}-\d{2}-\d{2})"/);
  return {
    id: idMatch ? parseInt(idMatch[1]) : 0,
    date: dateMatch ? dateMatch[1] : '',
    content: article
  };
});

// Sort by date (newest first)
articlesWithDates.sort((a, b) => {
  return new Date(b.date) - new Date(a.date);
});

// Reconstruct the file
const beforeArticles = content.substring(0, startIndex);
const afterArticles = content.substring(endIndex);

const newArticlesArray = 'const articles = [\n  ' + 
  articlesWithDates.map(a => a.content).join(',\n  ') + 
  '\n];';

const newContent = beforeArticles + newArticlesArray + afterArticles;

// Write back to file
fs.writeFileSync('src/pages/Resources.jsx', newContent);

console.log('Articles reordered from newest to oldest!');
console.log('Order:', articlesWithDates.map(a => `ID ${a.id}: ${a.date}`).join(', '));