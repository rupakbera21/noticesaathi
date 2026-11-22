"""
One-off script: process NoticeSaathi logos.
  - Sample exact brand colors (K-means style clustering)
  - Create optimized 2x header copies in public/logo/
  - Generate icon.png (512px), apple-icon.png (180px), favicon.ico (16/32/48)
  - Compute contrast ratios against header backgrounds
  - Report 16px and 32px icon previews (saves to local screenshots outside repo)

Run from repo root:  python scripts/process-logos.py
Not a production dependency. Output files go into public/logo/ and src/app/.
"""

import os, sys, math, collections
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).parent.parent
ASSETS = ROOT / "Assets"
PUBLIC_LOGO = ROOT / "public" / "logo"
APP_DIR = ROOT / "src" / "app"
SCREENSHOTS = Path(os.environ.get("TEMP", "C:/Temp")) / "noticesaathi-screenshots"  # outside repo

PUBLIC_LOGO.mkdir(parents=True, exist_ok=True)
APP_DIR.mkdir(parents=True, exist_ok=True)
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

LIGHT_SRC = ASSETS / "NoticeSaathi_logo_LightMode.png"
DARK_SRC  = ASSETS / "NoticeSaathi_logo_DarkMode.png"
ICON_SRC  = ASSETS / "NoticeSaathi_TabIcon.png"

# ── 1. Report dimensions and file sizes ──────────────────────────────────────
print("=" * 60)
print("1. Source file info")
print("=" * 60)
for label, path in [("Light logo", LIGHT_SRC), ("Dark logo", DARK_SRC), ("Tab icon", ICON_SRC)]:
    img = Image.open(path)
    kb = path.stat().st_size / 1024
    print(f"  {label}: {img.width}×{img.height}px, {kb:.1f} KB, mode={img.mode}")

# ── 2. Sample brand colors with Pillow ───────────────────────────────────────
print("\n" + "=" * 60)
print("2. Brand color sampling (top opaque non-white non-black pixels)")
print("=" * 60)

def sample_brand_colors(path, skip_light=True, skip_dark=False, n=12):
    img = Image.open(path).convert("RGBA")
    # Downsample for speed
    small = img.resize((img.width // 4, img.height // 4), Image.LANCZOS)
    counts = collections.Counter()
    for x in range(small.width):
        for y in range(small.height):
            r,g,b,a = small.getpixel((x,y))
            if a < 160: continue
            if skip_light and r > 220 and g > 220 and b > 220: continue
            if skip_dark and r < 25 and g < 25 and b < 25: continue
            # Quantize to 8-step (32-value) buckets for grouping
            qr = (r >> 5) << 5
            qg = (g >> 5) << 5
            qb = (b >> 5) << 5
            counts[(qr, qg, qb)] += 1
    return counts.most_common(n)

def to_hex(r,g,b): return f"#{r:02X}{g:02X}{b:02X}"

def luminance(r,g,b):
    def c(v):
        v /= 255.0
        return v/12.92 if v <= 0.04045 else ((v+0.055)/1.055)**2.4
    return 0.2126*c(r) + 0.7152*c(g) + 0.0722*c(b)

def contrast_ratio(l1, l2):
    hi, lo = max(l1,l2), min(l1,l2)
    return (hi+0.05)/(lo+0.05)

print("\n  [Light logo — skipping near-white]")
light_colors = sample_brand_colors(LIGHT_SRC, skip_light=True, skip_dark=False)
for (r,g,b), cnt in light_colors[:8]:
    print(f"    {to_hex(r,g,b)}  rgb({r:3},{g:3},{b:3})  lum={luminance(r,g,b):.4f}  count={cnt}")

print("\n  [Dark logo — skipping near-black (background dark)]")
dark_colors = sample_brand_colors(DARK_SRC, skip_light=True, skip_dark=True)
for (r,g,b), cnt in dark_colors[:8]:
    print(f"    {to_hex(r,g,b)}  rgb({r:3},{g:3},{b:3})  lum={luminance(r,g,b):.4f}  count={cnt}")

print("\n  [Icon]")
icon_colors = sample_brand_colors(ICON_SRC, skip_light=True, skip_dark=False)
for (r,g,b), cnt in icon_colors[:8]:
    print(f"    {to_hex(r,g,b)}  rgb({r:3},{g:3},{b:3})  lum={luminance(r,g,b):.4f}  count={cnt}")

# ── 3. Create optimized 2x header copies ─────────────────────────────────────
print("\n" + "=" * 60)
print("3. Header copies (2x: 320×106px)")
print("=" * 60)

HEADER_2X_W, HEADER_2X_H = 320, 106   # @2x → renders at 160×53px

for label, src, out_name in [
    ("Light", LIGHT_SRC, "logo-light@2x.png"),
    ("Dark",  DARK_SRC,  "logo-dark@2x.png"),
]:
    img = Image.open(src).convert("RGBA")
    resized = img.resize((HEADER_2X_W, HEADER_2X_H), Image.LANCZOS)
    out = PUBLIC_LOGO / out_name
    resized.save(out, "PNG", optimize=True)
    kb = out.stat().st_size / 1024
    print(f"  {label}: {out_name}  {HEADER_2X_W}×{HEADER_2X_H}px  {kb:.1f} KB  -> {out}")

# Also copy originals (both under 500 KB so keep them)
import shutil
for src, name in [(LIGHT_SRC, "logo-light.png"), (DARK_SRC, "logo-dark.png"), (ICON_SRC, "tab-icon.png")]:
    dst = PUBLIC_LOGO / name
    shutil.copy2(src, dst)
    print(f"  Original kept: {name}  ({src.stat().st_size/1024:.1f} KB)")

# ── 4. Generate icon files ───────────────────────────────────────────────────
print("\n" + "=" * 60)
print("4. Icon generation")
print("=" * 60)

icon_img = Image.open(ICON_SRC).convert("RGBA")

# src/app/icon.png – 512×512 (Next.js uses this for OG/app icon)
icon_512 = icon_img.resize((512, 512), Image.LANCZOS)
icon_512.save(APP_DIR / "icon.png", "PNG", optimize=True)
print(f"  icon.png       512×512px  {(APP_DIR/'icon.png').stat().st_size/1024:.1f} KB")

# src/app/apple-icon.png – 180×180
apple = icon_img.resize((180, 180), Image.LANCZOS)
apple.save(APP_DIR / "apple-icon.png", "PNG", optimize=True)
print(f"  apple-icon.png 180×180px  {(APP_DIR/'apple-icon.png').stat().st_size/1024:.1f} KB")

# src/app/favicon.ico – multi-size (16, 32, 48)
sizes = [16, 32, 48]
ico_images = [icon_img.resize((s, s), Image.LANCZOS).convert("RGBA") for s in sizes]
ico_images[0].save(
    APP_DIR / "favicon.ico",
    format="ICO",
    sizes=[(s, s) for s in sizes],
    append_images=ico_images[1:]
)
print(f"  favicon.ico    16/32/48px  {(APP_DIR/'favicon.ico').stat().st_size/1024:.1f} KB")

# ── 5. Save 16px and 32px previews (outside repo) ───────────────────────────
print("\n" + "=" * 60)
print("5. Icon preview at 16px and 32px (saved outside repo)")
print("=" * 60)

# Create a side-by-side preview: white bg | dark bg for each size
for sz in [16, 32]:
    thumb = icon_img.resize((sz, sz), Image.LANCZOS)
    padding = 8
    canvas_w = sz * 2 + padding * 3
    canvas_h = sz + padding * 2
    canvas = Image.new("RGB", (canvas_w, canvas_h), (200, 200, 200))
    # White background tile
    white_tile = Image.new("RGB", (sz, sz), (255, 255, 255))
    white_tile.paste(thumb, (0,0), thumb)
    # Dark background tile
    dark_tile = Image.new("RGB", (sz, sz), (15, 15, 25))
    dark_tile.paste(thumb, (0,0), thumb)
    canvas.paste(white_tile, (padding, padding))
    canvas.paste(dark_tile, (sz + padding * 2, padding))
    # Scale up 8x so it's visible
    preview = canvas.resize((canvas_w * 8, canvas_h * 8), Image.NEAREST)
    preview_path = SCREENSHOTS / f"icon-preview-{sz}px.png"
    preview.save(preview_path, "PNG")
    print(f"  {sz}px preview (8x scaled) → {preview_path}")

# ── 6. Contrast checks ───────────────────────────────────────────────────────
print("\n" + "=" * 60)
print("6. Contrast checks")
print("=" * 60)

checks = [
    # (description, fg_rgb, bg_rgb, threshold)
    ("Light header: navy wordmark #0D1137 on white #FFFFFF",   (13,17,55),   (255,255,255), 4.5),
    ("Light header: indigo icon   #3733C8 on white #FFFFFF",   (55,51,200),  (255,255,255), 3.0),
    ("Dark header:  lt-grey word  #EEEEF2 on near-black #0D0D1A", (238,238,242),(13,13,26), 4.5),
    ("Dark header:  med-blue icon #6B6BE8 on near-black #0D0D1A", (107,107,232),(13,13,26), 3.0),
]
all_pass = True
for desc, fg, bg, threshold in checks:
    l_fg = luminance(*fg)
    l_bg = luminance(*bg)
    cr = contrast_ratio(l_fg, l_bg)
    result = "✓ PASS" if cr >= threshold else "✗ FAIL"
    if cr < threshold: all_pass = False
    print(f"  {result}  {cr:.1f}:1 (need {threshold}:1)  {desc}")

print(f"\n  Overall: {'ALL PASS ✓' if all_pass else 'FAILURES — see above'}")
print("\nDone.")
