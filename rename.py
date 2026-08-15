import os
import re

directories = ['.', 'blog']
html_files = []
for d in directories:
    for f in os.listdir(d):
        if f.endswith('.html') or f.endswith('.json') or f.endswith('.xml'):
            html_files.append(os.path.join(d, f))

# Add JS files to check for FreeTools strings
js_files = [os.path.join('js', f) for f in os.listdir('js') if f.endswith('.js')]
all_files = html_files + js_files + ['sw.js']

files_changed = []

for f_path in all_files:
    if not os.path.isfile(f_path): continue
    
    with open(f_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original_content = content
    
    # 1. Remove share-btn
    content = re.sub(r'<button class="share-btn"[^>]*>.*?</button>\s*', '', content)
    
    # Remove it from JS as well just in case (the event listener)
    content = re.sub(r'document\.querySelectorAll\(\'.share-btn\'\)\.forEach\(btn => \{\s*btn\.addEventListener\(\'click\', window\.shareTool\);\s*\}\);', '', content)
    
    # 2. Rename FreeTools -> S7 FreeTools
    # Be careful not to replace freetools.example domain if it says freetools.example
    # Actually user says: "Every <title> tag ... Every <meta ...> ... Open Graph ... footer ... about"
    # I'll replace "FreeTools" with "S7 FreeTools" except where it's part of a domain like "freetools.example"
    # To handle domain safely: temporarily replace 'freetools.example' with 'TEMP_DOMAIN'
    content = content.replace('freetools.example', 'TEMP_DOMAIN')
    content = content.replace('FreeTools', 'S7 FreeTools')
    # Let's also check for lowercase if the user wants it, but they said "Search the entire project for the exact string "FreeTools" (case-sensitive and case-insensitive)". The logo is "FreeTools".
    # I'll just replace 'FreeTools' because the domain 'freetools' was protected.
    
    # Restore domain
    content = content.replace('TEMP_DOMAIN', 'freetools.example')
    
    if content != original_content:
        with open(f_path, 'w', encoding='utf-8') as file:
            file.write(content)
        files_changed.append(f_path)

print("Files changed:", ", ".join(files_changed))
