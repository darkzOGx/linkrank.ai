#!/usr/bin/env python3

# Article ranges and their dates/IDs
articles_info = [
    {"id": 1, "date": "2025-08-22", "start": 7, "end": 56},
    {"id": 2, "date": "2025-08-15", "start": 57, "end": 108},
    {"id": 3, "date": "2025-08-08", "start": 109, "end": 178},
    {"id": 4, "date": "2025-07-25", "start": 179, "end": 255},
    {"id": 5, "date": "2025-07-12", "start": 256, "end": 340},
    {"id": 6, "date": "2025-06-30", "start": 341, "end": 431},
    {"id": 7, "date": "2025-06-15", "start": 432, "end": 529},
    {"id": 8, "date": "2025-05-28", "start": 530, "end": 627},
    {"id": 9, "date": "2025-05-10", "start": 628, "end": 731},
    {"id": 10, "date": "2025-04-23", "start": 732, "end": 836},
    {"id": 11, "date": "2025-08-18", "start": 837, "end": 1036},
    {"id": 12, "date": "2025-08-15", "start": 1037, "end": 1304},
    {"id": 13, "date": "2025-08-12", "start": 1305, "end": 1623},
    {"id": 14, "date": "2025-08-09", "start": 1624, "end": 1989},
    {"id": 15, "date": "2025-08-06", "start": 1990, "end": 2337},
]

# Read the file
with open('src/pages/Resources.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Extract each article
articles = []
for info in articles_info:
    article_lines = lines[info["start"]-1:info["end"]]
    articles.append({
        "id": info["id"],
        "date": info["date"],
        "lines": article_lines
    })

# Sort by date (newest first)
articles.sort(key=lambda x: x["date"], reverse=True)

# Reconstruct the file
new_lines = []
# Add lines before articles array
new_lines.extend(lines[:6])

# Add sorted articles
for i, article in enumerate(articles):
    new_lines.extend(article["lines"])
    # Add comma after each article except the last one
    if i < len(articles) - 1 and not new_lines[-1].endswith(',\n'):
        new_lines[-1] = new_lines[-1].rstrip() + ',\n'

# Remove trailing comma from last article if present
if new_lines[-1].endswith(',\n'):
    new_lines[-1] = new_lines[-1][:-2] + '\n'

# Add closing bracket and rest of file
new_lines.append('];\n')
new_lines.extend(lines[2329:])  # Everything after the articles array

# Write back to file
with open('src/pages/Resources.jsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Articles reordered successfully!")
print("New order (by date):")
for article in articles:
    print(f"  Article {article['id']}: {article['date']}")