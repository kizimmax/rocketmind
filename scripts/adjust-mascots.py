#!/usr/bin/env python3
"""
Apply selective scale adjustments to specific mascots.
Processes both apps/design-system and apps/site directories.
"""

import os
from PIL import Image

CANVAS_SIZE = 2048
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MASCOT_DIRS = [
    "apps/design-system/public/ai-mascots",
    "apps/site/public/ai-mascots",
]

# Adjustments: agent -> { "scale": float, "files": None (all) or list of substrings }
ADJUSTMENTS = {
    "max":    {"scale": 0.98, "files": ["base"]},       # -2% base
    "nick":   {"scale": 1.03, "files": ["base"]},       # +3% base
}


def scale_image(img_path, scale_factor):
    """Scale image content and re-center on canvas."""
    img = Image.open(img_path).convert("RGBA")
    w, h = img.size

    new_w = int(w * scale_factor)
    new_h = int(h * scale_factor)
    scaled = img.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    px = (CANVAS_SIZE - new_w) // 2
    py = (CANVAS_SIZE - new_h) // 2

    if new_w > CANVAS_SIZE or new_h > CANVAS_SIZE:
        cx = max(0, (new_w - CANVAS_SIZE) // 2)
        cy = max(0, (new_h - CANVAS_SIZE) // 2)
        cropped = scaled.crop((cx, cy, cx + min(new_w, CANVAS_SIZE), cy + min(new_h, CANVAS_SIZE)))
        canvas.paste(cropped, (max(0, px), max(0, py)))
    else:
        canvas.paste(scaled, (px, py))

    return canvas


def file_matches(fname, filters):
    """Check if filename matches any of the filter substrings."""
    if filters is None:
        return True
    name_lower = fname.lower()
    return any(f in name_lower for f in filters)


for mascot_dir_rel in MASCOT_DIRS:
    mascot_dir = os.path.join(ROOT, mascot_dir_rel)
    if not os.path.exists(mascot_dir):
        continue

    print(f"\n{mascot_dir_rel}/")

    for agent, adj in sorted(ADJUSTMENTS.items()):
        agent_dir = os.path.join(mascot_dir, agent)
        if not os.path.isdir(agent_dir):
            continue

        sf = adj["scale"]
        filters = adj["files"]
        label = "ALL" if filters is None else ", ".join(filters)
        print(f"  {agent:10s} | scale: {sf:.2f} | files: {label}")

        for fname in sorted(os.listdir(agent_dir)):
            if not fname.endswith(".png"):
                continue
            if not file_matches(fname, filters):
                continue

            fpath = os.path.join(agent_dir, fname)
            result = scale_image(fpath, sf)
            result.save(fpath, "PNG", optimize=True)
            print(f"    {fname}")

print("\nDone!")
