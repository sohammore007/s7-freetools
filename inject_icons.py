import os
import re

svg_map = {
    'Image Compressor': '<path d="M19,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />',
    'QR Code Generator': '<path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-4 4h8v8h-8v-8zm2 2v-2h-2v2h2zm2 0v2h-2v-2h2zm-4 2v2h2v-2h-2zm4 2v-2h-2v2h2z" />',
    'Password Generator': '<path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />',
    'Word Counter': '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />',
    'Unit Converter': '<path d="M12 4L12 1L8 5L12 9L12 6C15.31 6 18 8.69 18 12C18 13.08 17.71 14.1 17.21 15L18.72 16.51C19.53 15.18 20 13.65 20 12C20 7.58 16.42 4 12 4M12 18C8.69 18 6 15.31 6 12C6 10.92 6.29 9.9 6.79 9L5.28 7.49C4.47 8.82 4 10.35 4 12C4 16.42 7.58 20 12 20L12 23L16 19L12 15L12 18Z" />',
    'Age Calculator': '<path d="M12 20A8 8 0 1 0 12 4A8 8 0 0 0 12 20M12 22A10 10 0 1 1 12 2A10 10 0 0 1 12 22M11 7H13V12.2L17.5 14.9L16.5 16.6L11 13.3V7Z" />',
    'BMI Calculator': '<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />',
    'CGPA to Percentage': '<path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />',
    'JSON Formatter': '<path d="M5,3H7V5H5V3M15,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V15H5V19H19V5H15V3M5,7H7V9H5V7M5,11H7V13H5V11Z" />',
    'Text Case Converter': '<path d="M2.5,4V5.5H21.5V4H2.5M4,11V12.5H20V11H4M5.5,18V19.5H18.5V18H5.5Z" />',
    'EMI Calculator': '<path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.5-2h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H5.5v2zm8-4h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H5.5v2zM5.5 7h13v4h-13V7z" />',
    'GST Calculator': '<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 20V4h12v16H6zm2-6h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V6z" />'
}

trust_map = {
    '💸': '<svg viewBox="0 0 24 24" width="48" height="48" style="fill: var(--primary-color);"><path d="M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"/></svg>',
    '🔒': '<svg viewBox="0 0 24 24" width="48" height="48" style="fill: var(--primary-color);"><path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,3.19L19,6.3V11C19,15.52 16.02,19.69 12,20.93C7.98,19.69 5,15.52 5,11V6.3L12,3.19M12,8A3,3 0 0,0 9,11C9,12.28 9.8,13.38 10.9,13.8V17H13.1V13.8C14.2,13.38 15,12.28 15,11A3,3 0 0,0 12,8Z"/></svg>',
    '🚀': '<svg viewBox="0 0 24 24" width="48" height="48" style="fill: var(--primary-color);"><path d="M11,15H6L13,1V9H18L11,23V15Z"/></svg>',
    '📶': '<svg viewBox="0 0 24 24" width="48" height="48" style="fill: var(--primary-color);"><path d="M12,3C7.79,3 3.7,4.55 0.53,7.36L2,9.37C4.78,6.97 8.25,5.5 12,5.5C15.75,5.5 19.22,6.97 22,9.37L23.47,7.36C20.3,4.55 16.21,3 12,3M12,8C9,8 6.13,9.1 3.84,10.94L5.31,12.95C7.16,11.5 9.5,10.5 12,10.5C14.5,10.5 16.84,11.5 18.69,12.95L20.16,10.94C17.87,9.1 15,8 12,8M12,13C10.22,13 8.55,13.64 7.23,14.65L12,21L16.77,14.65C15.45,13.64 13.78,13 12,13Z"/></svg>'
}

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
html_files += [f"blog/{f}" for f in os.listdir('blog') if f.endswith('.html')]

# We'll use a regex that matches:
# <div class="tool-card-icon" ...> \s* <svg ...> ... </svg> \s* </div> \s* <h3 class="tool-card-title">TITLE</h3>
# And we extract the TITLE, look it up in our map, and rewrite the whole block.
pattern = re.compile(
    r'(<div class="tool-card-icon"[^>]*>)\s*<svg[^>]*>.*?</svg>\s*(</div>)\s*<h3 class="tool-card-title">(.*?)</h3>',
    re.DOTALL
)

for f_path in html_files:
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    # Fix Tool Cards
    def replace_tool_card(match):
        div_open = match.group(1)
        div_close = match.group(2)
        title = match.group(3).strip()
        
        if title in svg_map:
            # Reconstruct with explicit 48x48 bounds
            svg_content = f'<svg viewBox="0 0 24 24" width="48" height="48">{svg_map[title]}</svg>'
            return f'{div_open}\n                            {svg_content}\n                        {div_close}\n                        <h3 class="tool-card-title">{title}</h3>'
        else:
            print(f"Warning: Tool '{title}' not found in map!")
            return match.group(0) # Unchanged

    new_content, num_subs = pattern.subn(replace_tool_card, content)
    if num_subs > 0:
        content = new_content
        changed = True

    # Fix Trust Section (only in index.html)
    if f_path == 'index.html':
        for emoji, svg in trust_map.items():
            # The emoji is wrapped in a div like: <div style="font-size: 2rem; margin-bottom: 0.5rem;">💸</div>
            # We'll replace the emoji text directly. 
            # We can also drop the font-size if we're injecting an explicit SVG, but the SVG has width=48 height=48 anyway so it's fine.
            if emoji in content:
                content = content.replace(emoji, svg)
                changed = True

    if changed:
        with open(f_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated icons in {f_path}")
