"""Copy and resize the project visuals into public/img (webp).

Usage (from site/): python -I scripts/prepare_assets.py
Sources live outside this folder; re-run after changing them.
"""
import os
from PIL import Image

HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "..", "public", "img")
SRC = os.path.join(HERE, "..", "assets-src")  # cutout.py / hero2.py outputs
SHOTS = "C:/dev/pfe/presentation/demo/player/shots"
PERSONAL = "C:/dev/personal"
JOBS = {
    "tunispare-search": (f"{SHOTS}/search/073.png", 1600, None),
    "tunispare-till": (f"{SHOTS}/till/018.png", 1600, None),
    "tunispare-grafana": (f"{SHOTS}/live-ops-grafana/001.png", 1600, None),
    "malltech-store": (f"{PERSONAL}/rapport-pfa-malltech/img/storeHomepage.png", 1400, (0, 0, 1616, 1000)),
    "malltech-products": (f"{PERSONAL}/rapport-pfa-malltech/img/productList.png", 1400, None),
    "malltech-deploy": (f"{PERSONAL}/rapport-pfa-malltech/img/DeploymentArchitecture.png", 1400, None),
    "achabs-store": (f"{PERSONAL}/achabsVintage/public/assets/img/background.jpg", 1600, None),
    "tunispare-home": (os.path.join(SRC, "shots", "tunispare-home.png"), 1600, None),
    # descriptive names: these two are the images search engines should index
    "moanes-ben-brahim-3d-avatar": (os.path.join(SRC, "avatar-shirt.png"), 1100, None),
    "moanes-ben-brahim-avatar-hoodie": (os.path.join(SRC, "avatar-hoodie.png"), 1100, None),
}
for name, (src, width, crop) in JOBS.items():
    im = Image.open(src)
    im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
    if crop:
        im = im.crop(crop)
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    dst = os.path.join(OUT, f"{name}.webp")
    im.save(dst, "WEBP", quality=82, method=6)
    print(f"{name}.webp", im.size, os.path.getsize(dst) // 1024, "KB")

# logos: trimmed to their content, 400 px wide at most
os.makedirs(os.path.join(OUT, "logos"), exist_ok=True)
for name in ("traveltodo", "iberis", "solidwall", "malltech", "achabs", "ceni", "vacyss", "dentalstore", "fitnuvo"):
    im = Image.open(os.path.join(SRC, "logos", f"{name}.png")).convert("RGBA")
    # trim to the drawn mark: ignore transparent and near-white padding
    import numpy as np
    a = np.asarray(im)
    ink = (a[..., 3] > 20) & (a[..., :3].min(-1) < 235)
    ys, xs = np.where(ink)
    if len(xs):
        im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    im.thumbnail((400, 400), Image.LANCZOS)
    im.save(os.path.join(OUT, "logos", f"{name}.webp"), "WEBP", quality=90, method=6)
    print(f"logos/{name}.webp", im.size)
