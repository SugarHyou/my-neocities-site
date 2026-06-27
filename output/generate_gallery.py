import os
import re
from datetime import datetime

# Change these lines at the top of your script:
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

cards_html = []
for filename in art_files:
    caption = re.sub(r"\s*\(.*?\)", "", filename)
    caption = os.path.splitext(caption)[0]

    card = f"""
                                <div class="art-card">
                                    <div class="art-frame">
                                        <a href="/{ART_DIR}/{filename}">
                                            <img src="/{ART_DIR}/{filename}" alt="{caption}">
                                        </a>
                                        <div class="art-caption">{caption}</div>
                                    </div>
                                </div>"""
    cards_html.append(card)

gallery_block = "\n".join(cards_html)

if not os.path.exists(HTML_FILE):
    print(f"❌ Error: Could not find '{HTML_FILE}'")
    input("Press Enter to exit...")
    exit()

with open(HTML_FILE, "r", encoding="utf-8") as f:
    content = f.read()

target_start = ''
target_end = ''

if target_start in content and target_end in content:
    top_half = content.split(target_start, 1)[0] + target_start
    bottom_half = content.split(target_end, 1)[1]

    updated_content = f"{top_half}\n{gallery_block}\n{bottom_half}"
    
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(updated_content)
    print("⚡ SugarHyou Gallery Automated! ✨")
else:
    print(
        '❌ Error: Could not find the exact <div id="gallery-grid"...> tag in your art.html file.'
    )
    print("Please check Step 1 and make sure your container matches perfectly!")

input("\nPress Enter to close...")