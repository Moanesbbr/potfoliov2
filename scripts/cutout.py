"""Remove a flat or checkerboard background from an avatar render.

Usage: python scripts/cutout.py <input> <output.png> [matte|orange|checker]
"matte" (best for a flat-colour background): soft alpha on the edges and the
background colour removed from hair tips and rim-lit ears (colour decontamination).
Flood-fills from the top, left and right borders only, so white details that
touch the bottom edge (drawstrings, shirt) are kept.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
mode = sys.argv[3] if len(sys.argv) > 3 else "matte"
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.int16)

if mode == "matte":
    af = a.astype(np.float32)
    border = np.concatenate([af[0], af[:, 0], af[:, -1]])
    B = np.median(border, axis=0)
    d = np.sqrt(((af - B) ** 2).sum(-1))
    LO, HI, BAND = 34.0, 120.0, 14
    bg = d < LO                                   # background, including pockets between curls
    bg = ndimage.binary_opening(bg, iterations=1)
    near = ndimage.distance_transform_edt(~bg) <= BAND
    alpha = np.ones(d.shape, np.float32)
    alpha[near] = np.clip((d[near] - LO) / (HI - LO), 0, 1)
    alpha[bg] = 0
    # decontaminate: remove the background colour mixed into edge pixels
    soft = (alpha > 0.02) & (alpha < 1)
    F = af.copy()
    F[soft] = B + (af[soft] - B) / np.maximum(alpha[soft], 0.45)[:, None]
    F = np.clip(F, 0, 255)
    rgba = np.dstack([F, alpha * 255]).astype(np.uint8)
    out = Image.fromarray(rgba, "RGBA")
    out.save(dst, optimize=True)
    print(dst, out.size, "bg colour", B.astype(int))
    sys.exit()
r, g, b = a[..., 0], a[..., 1], a[..., 2]

if mode == "orange":
    # saturated orange: strong red, little blue (skin keeps far more blue)
    cand = (r > 170) & (r - b > 140) & (g < r * 0.75) & (g > r * 0.2)
else:  # grey/white checkerboard
    sat = a.max(-1) - a.min(-1)
    cand = (sat < 18) & (a.min(-1) > 175)

lab, _ = ndimage.label(cand)
seeds = set(np.unique(lab[0])) | set(np.unique(lab[:, 0])) | set(np.unique(lab[:, -1]))
seeds.discard(0)
bg = np.isin(lab, list(seeds))
if mode == "checker":
    # enclosed checker patches (e.g. between head and headphone band) sit in
    # the upper part of the frame; the white t-shirt and drawstrings sit lower
    h = a.shape[0]
    for i, sl in enumerate(ndimage.find_objects(lab), start=1):
        if sl is not None and sl[0].stop < h * 0.4 and (lab[sl] == i).sum() > 150:
            bg |= lab == i
bg = ndimage.binary_opening(bg, iterations=1)
fg = ~bg
fg = ndimage.binary_fill_holes(fg) if mode == "orange" else fg
alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
out = im.convert("RGBA")
out.putalpha(alpha)
out = out.crop(out.getbbox())
out.save(dst, optimize=True)
print(dst, out.size)
