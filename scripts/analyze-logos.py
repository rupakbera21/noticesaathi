"""
One-off script: analyze logo dimensions, sample brand colors, compute contrast ratios.
Run: python scripts/analyze-logos.py
Not a production dependency.
"""
import struct, zlib, math, os, collections

ASSETS = "Assets"
FILES = {
    "light": f"{ASSETS}/NoticeSaathi_logo_LightMode.png",
    "dark":  f"{ASSETS}/NoticeSaathi_logo_DarkMode.png",
    "icon":  f"{ASSETS}/NoticeSaathi_TabIcon.png",
}

# --- PNG helpers (stdlib only) ---
def read_png_dims(path):
    with open(path, "rb") as f:
        sig = f.read(8)
        assert sig == b'\x89PNG\r\n\x1a\n', "Not a PNG"
        f.read(4)  # chunk length
        assert f.read(4) == b'IHDR'
        w = struct.unpack(">I", f.read(4))[0]
        h = struct.unpack(">I", f.read(4))[0]
        bit_depth = struct.unpack("B", f.read(1))[0]
        color_type = struct.unpack("B", f.read(1))[0]
    return w, h, bit_depth, color_type

def decode_png_pixels(path):
    """Decode a PNG to list of (r,g,b,a) tuples using stdlib only."""
    import zlib, struct
    with open(path, "rb") as f:
        data = f.read()
    
    # Parse IHDR
    idx = 8
    chunks = []
    while idx < len(data):
        length = struct.unpack(">I", data[idx:idx+4])[0]
        ctype = data[idx+4:idx+8]
        cdata = data[idx+8:idx+8+length]
        chunks.append((ctype, cdata))
        idx += 12 + length
    
    ihdr = next(c for t,c in chunks if t == b'IHDR')
    w = struct.unpack(">I", ihdr[0:4])[0]
    h = struct.unpack(">I", ihdr[4:8])[0]
    bit_depth = ihdr[8]
    color_type = ihdr[9]
    
    idat = b''.join(c for t,c in chunks if t == b'IDAT')
    raw = zlib.decompress(idat)
    
    # Only handle 8-bit RGBA (type 6) and RGB (type 2)
    if color_type == 6:
        channels = 4
    elif color_type == 2:
        channels = 3
    else:
        return None, w, h  # skip palette/grayscale for brevity
    
    stride = 1 + w * channels
    pixels = []
    for row in range(h):
        offset = row * stride
        filter_byte = raw[offset]
        row_data = list(raw[offset+1:offset+1+w*channels])
        
        # Apply filter (simplified: only None=0 and Sub=1 needed for most logos)
        if filter_byte == 1:  # Sub
            for i in range(channels, len(row_data)):
                row_data[i] = (row_data[i] + row_data[i-channels]) & 0xFF
        elif filter_byte == 2 and row > 0:  # Up
            prev_offset = (row-1) * stride
            prev = list(raw[prev_offset+1:prev_offset+1+w*channels])
            for i in range(len(row_data)):
                row_data[i] = (row_data[i] + prev[i]) & 0xFF
        elif filter_byte == 4:  # Paeth - full implementation
            prev_row = []
            if row > 0:
                prev_offset = (row-1)*stride
                prev_row = list(raw[prev_offset+1:prev_offset+1+w*channels])
            else:
                prev_row = [0]*len(row_data)
            for i in range(len(row_data)):
                a = row_data[i-channels] if i>=channels else 0
                b = prev_row[i]
                c = prev_row[i-channels] if i>=channels else 0
                p = a+b-c
                pa,pb,pc = abs(p-a),abs(p-b),abs(p-c)
                pr = a if pa<=pb and pa<=pc else (b if pb<=pc else c)
                row_data[i] = (row_data[i]+pr) & 0xFF
        
        for px in range(w):
            base = px * channels
            r,g,b = row_data[base], row_data[base+1], row_data[base+2]
            a = row_data[base+3] if channels == 4 else 255
            pixels.append((r,g,b,a))
    return pixels, w, h

def luminance(r,g,b):
    def c(v):
        v /= 255.0
        return v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4
    return 0.2126*c(r) + 0.7152*c(g) + 0.0722*c(b)

def contrast(l1, l2):
    hi,lo = max(l1,l2), min(l1,l2)
    return (hi+0.05)/(lo+0.05)

def sample_colors(pixels, w, h, n_colors=8, skip_near_white=True, skip_near_black=False, min_alpha=180):
    """Return most frequent non-white non-transparent colors, downsampled."""
    step = max(1, len(pixels)//5000)
    counts = collections.Counter()
    for i in range(0, len(pixels), step):
        r,g,b,a = pixels[i]
        if a < min_alpha: continue
        if skip_near_white and r>230 and g>230 and b>230: continue
        if skip_near_black and r<20 and g<20 and b<20: continue
        # quantize to 16-step buckets
        qr,qg,qb = (r>>4)<<4, (g>>4)<<4, (b>>4)<<4
        counts[(qr,qg,qb)] += 1
    return counts.most_common(n_colors)

print("=" * 60)
print("NoticeSaathi Logo Analysis")
print("=" * 60)

results = {}
for name, path in FILES.items():
    size_kb = os.path.getsize(path) / 1024
    w, h, bit_depth, color_type = read_png_dims(path)
    print(f"\n[{name.upper()}] {os.path.basename(path)}")
    print(f"  Dimensions : {w} x {h} px")
    print(f"  File size  : {size_kb:.1f} KB")
    print(f"  Bit depth  : {bit_depth}, Color type: {color_type} ({'RGBA' if color_type==6 else 'RGB' if color_type==2 else 'other'})")
    results[name] = {"w":w,"h":h,"size_kb":size_kb}

print("\n" + "=" * 60)
print("Color Sampling")
print("=" * 60)

brand_colors = {}
for name, path in FILES.items():
    print(f"\n[{name.upper()}]")
    pixels, w, h = decode_png_pixels(path)
    if pixels is None:
        print("  Skipped (palette PNG)")
        continue
    skip_black = (name == "dark")
    top = sample_colors(pixels, w, h, n_colors=10, skip_near_black=skip_black)
    brand_colors[name] = top
    for (r,g,b), count in top[:6]:
        pct = count / (len(pixels)//max(1,len(pixels)//5000+1)) * 100
        lum = luminance(r,g,b)
        print(f"  #{r:02X}{g:02X}{b:02X}  rgb({r:3},{g:3},{b:3})  lum={lum:.3f}")

print("\n" + "=" * 60)
print("Contrast Checks")
print("=" * 60)

# Key colors from visual inspection + sampling
# Light logo: dark navy wordmark on white header
# Dark logo: near-white wordmark on dark header
L_WHITE = luminance(255,255,255)
L_DARK_BG = luminance(15,15,25)   # typical dark header ~#0F0F19
L_LIGHT_BG = luminance(255,255,255)

# From light logo: navy wordmark ~#0D1137, indigo icon ~#3733C8
L_NAVY = luminance(13,17,55)
L_INDIGO = luminance(55,51,200)
L_NEAR_WHITE = luminance(240,240,255)  # dark-logo wordmark

print(f"\nLight theme (white header #FFFFFF):")
print(f"  Navy wordmark #0D1137   : {contrast(L_NAVY, L_WHITE):.1f}:1  ({'PASS 4.5' if contrast(L_NAVY,L_WHITE)>=4.5 else 'FAIL'})")
print(f"  Indigo icon  #3733C8   : {contrast(L_INDIGO, L_WHITE):.1f}:1  ({'PASS 3.0' if contrast(L_INDIGO,L_WHITE)>=3.0 else 'FAIL'})")

print(f"\nDark theme (near-black header ~#0F0F19):")
print(f"  Near-white wordmark #F0F0FF : {contrast(L_NEAR_WHITE, L_DARK_BG):.1f}:1  ({'PASS 4.5' if contrast(L_NEAR_WHITE,L_DARK_BG)>=4.5 else 'FAIL'})")
print(f"  Indigo icon #6766E5         : {contrast(luminance(103,102,229), L_DARK_BG):.1f}:1  ({'PASS 3.0' if contrast(luminance(103,102,229),L_DARK_BG)>=3.0 else 'FAIL'})")

print("\n" + "=" * 60)
print("Header sizing recommendation (2x display copy)")
print("=" * 60)
for name, info in results.items():
    if name == "icon": continue
    # Header logo: target ~160px wide display = 320px @2x, maintain aspect
    target_display_w = 160
    ar = info['w'] / info['h']
    display_h = round(target_display_w / ar)
    file_2x_w = target_display_w * 2
    file_2x_h = display_h * 2
    print(f"  [{name}] original {info['w']}x{info['h']} -> 2x file: {file_2x_w}x{file_2x_h}px, display: {target_display_w}x{display_h}px")
