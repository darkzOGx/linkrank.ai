#!/usr/bin/env python3
import re

# Read the file
with open('src/pages/Resources.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the articles array
array_start = content.find('const articles = [')
if array_start == -1:
    print("Could not find articles array")
    exit(1)

# Find the end of the array
array_end = content.find('\n];', array_start)
if array_end == -1:
    print("Could not find end of articles array")
    exit(1)

# Extract just the articles array content
before_array = content[:array_start]
array_content = content[array_start:array_end + 3]  # Include the "];"
after_array = content[array_end + 3:]

# Extract individual article objects
# Look for pattern: starts with "  {" and ends with "  }," or "  }"
articles = []
lines = array_content.split('\n')

current_article = []
in_article = False
brace_count = 0

for i, line in enumerate(lines):
    if line == '  {':
        in_article = True
        brace_count = 1
        current_article = [line]
    elif in_article:
        current_article.append(line)
        # Count braces (not in strings)
        # Simple brace counting - not handling strings properly but should work for this structure
        if '{' in line and not line.strip().startswith('//') and not line.strip().startswith('*'):
            # Crude check - count { not in quotes
            cleaned = re.sub(r'"[^"]*"', '', line)
            cleaned = re.sub(r"'[^']*'", '', cleaned)
            cleaned = re.sub(r"`[^`]*`", '', cleaned)
            brace_count += cleaned.count('{')
            brace_count -= cleaned.count('}')
        elif '}' in line and not line.strip().startswith('//') and not line.strip().startswith('*'):
            cleaned = re.sub(r'"[^"]*"', '', line)
            cleaned = re.sub(r"'[^']*'", '', cleaned)
            cleaned = re.sub(r"`[^`]*`", '', cleaned)
            brace_count -= cleaned.count('}')
            brace_count += cleaned.count('{')
        
        if brace_count == 0 and line.strip().startswith('}'):
            # End of article
            article_text = '\n'.join(current_article)
            # Extract id and date
            id_match = re.search(r'id:\s*(\d+)', article_text)
            date_match = re.search(r'date:\s*"(\d{4}-\d{2}-\d{2})"', article_text)
            
            if id_match and date_match:
                articles.append({
                    'id': int(id_match.group(1)),
                    'date': date_match.group(1),
                    'text': article_text
                })
            
            in_article = False
            current_article = []

# Sort articles by date (newest first)
articles.sort(key=lambda x: x['date'], reverse=True)

print(f"Found {len(articles)} articles")
print("Sorted order:")
for a in articles:
    print(f"  Article {a['id']}: {a['date']}")

# Reconstruct the articles array
new_array = 'const articles = [\n'
for i, article in enumerate(articles):
    new_array += article['text']
    if i < len(articles) - 1:
        new_array += ','
    new_array += '\n'
new_array += '];'

# Combine everything
new_content = before_array + new_array + after_array

# Write back
with open('src/pages/Resources.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("File updated successfully!")