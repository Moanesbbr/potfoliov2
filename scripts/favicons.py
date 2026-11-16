"""Generate the favicon set from the avatar cutout (head on the brand orange).

Usage (from site/): python -I scripts/favicons.py
"""
import json
import os
from PIL import Image

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, "..", "assets-src", "avatar-shirt.png")
OUT = os.path.join(HERE, "..", "public")
ORANGE = (236, 97, 44, 255)
HEAD = (232, 0, 1032, 800)  # square around the head in the 1199x1312 render

av = Image.open(SRC).convert("RGBA").crop(HEAD)
base = Image.new("RGBA", av.size, ORANGE)
base.alpha_composite(av)
base = base.convert("RGB")

for name, size in [("favicon-16x16.png", 16), ("favicon-32x32.png", 32), ("favicon-96x96.png", 96), ("apple-touch-icon.png", 180), ("android-chrome-192x192.png", 192), ("android-chrome-512x512.png", 512)]:
    base.resize((size, size), Image.LANCZOS).save(os.path.join(OUT, name), optimize=True)
base.resize((48, 48), Image.LANCZOS).save(os.path.join(OUT, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])

manifest = {
    "name": "Moanes Ben Brahim",
    "short_name": "Moanes",
    "icons": [
        {"src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png"},
        {"src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png"},
    ],
    "theme_color": "#EC612C",
    "background_color": "#EC612C",
    "display": "browser",
}
with open(os.path.join(OUT, "site.webmanifest"), "w") as f:
    json.dump(manifest, f, indent=2)
print("favicons written to", os.path.abspath(OUT))
