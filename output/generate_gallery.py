import os
import re
from datetime import datetime

# Configuration
ART_DIR = "../assets/art"
HTML_FILE = "../art.html"

if not os.path.exists(ART_DIR):
    print(f"❌ Error: Could not find directory '{ART_DIR}'")
    input("Press Enter to exit...")
    exit()

valid_extensions = (".png", ".jpg", ".jpeg", ".gif")
art_files = [f for f in os.listdir(ART_DIR) if f.lower().endswith(valid_extensions)]

def get_art_date(filename):
    match = re.search(r"\((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{4})\)", filename)
    if match:
        date_str = f"{match.group(1)} {match.group(2)}, {match.group(3)}"
        try:
            return datetime.strptime(date_str, "%b %d, %Y")
        except ValueError:
            pass
    return datetime.min

art_files.sort(key=get_art_date, reverse=True)

# Generate the gallery cards
cards_html = []
for filename in art_files:
    caption = re.sub(r"\s*\(.*?\)", "", filename)
    caption = os.path.splitext(caption)[0]
    web_path = f"/assets/art/{filename}" 

    card = f"""
    <div class="art-card">
        <div class="art-frame">
            <a href="{web_path}">
                <img src="{web_path}" alt="{caption}">
            </a>
            <div class="art-caption">{caption}</div>
        </div>
    </div>"""
    cards_html.append(card)

gallery_block = "\n".join(cards_html)

# Read and update the HTML file
if not os.path.exists(HTML_FILE):
    print(f"❌ Error: Could not find '{HTML_FILE}'")
    input("Press Enter to exit...")
    exit()

with open(HTML_FILE, "r", encoding="utf-8") as f:
    content = f.read()

target_start = '<!-- GALLERY_START -->'
target_end = '<!-- GALLERY_END -->'

if target_start in content and target_end in content:
    # Change the split logic so it keeps the tags:
    top_half = content.split(target_start, 1)[0] + target_start
    bottom_half = content.split(target_end, 1)[1]
    
    # We put the markers back AROUND the gallery_block
    updated_content = f"{top_half}\n{gallery_block}\n{target_end}{bottom_half}"
    
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(updated_content)
    print("⚡ SugarHyou Gallery Automated! ✨")
else:
    print('❌ Error: Could not find <!-- GALLERY_START --> or <!-- GALLERY_END --> tags.')

input("\nPress Enter to close...")