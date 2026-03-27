#!/usr/bin/env python3
"""
Normalize mascot images so all faces appear the same visual size.

Strategy:
1. Analyze each mascot's _base image content bounding box
2. Calculate the diagonal of the bounding box (accounts for both W and H)
3. Compute a scale factor so all diagonals match the target
4. Apply that scale factor to ALL poses of each mascot
5. Re-center content on a uniform 2048x2048 canvas
6. Process both apps/design-system and apps/site directories

Usage:
  python3 scripts/normalize-mascots.py           # Dry run (analysis only)
  python3 scripts/normalize-mascots.py --apply   # Apply changes in-place
"""

import math
import os
import sys
from PIL import Image

# Config
CANVAS_SIZE = 2048
TARGET_DIAGONAL = 1950  # Target diagonal for content bbox (~67% of canvas diagonal 2896)

MASCOT_DIRS = [
    "apps/design-system/public/ai-mascots",
    "apps/site/public/ai-mascots",
]

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def find_base_image(agent_dir):
    """Find the base image for a mascot (exclude mirrored ← variants)."""
    for f in sorted(os.listdir(agent_dir)):
        if "base" in f.lower() and f.endswith(".png") and "←" not in f:
            return os.path.join(agent_dir, f)
    return None


def normalize_image(img_path, scale_factor, output_size=CANVAS_SIZE):
    """Scale image by scale_factor and center on output_size canvas."""
    img = Image.open(img_path).convert("RGBA")
    orig_w, orig_h = img.size

    new_w = int(orig_w * scale_factor)
    new_h = int(orig_h * scale_factor)
    scaled = img.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGBA", (output_size, output_size), (0, 0, 0, 0))

    paste_x = (output_size - new_w) // 2
    paste_y = (output_size - new_h) // 2

    if new_w > output_size or new_h > output_size:
        crop_x = max(0, (new_w - output_size) // 2)
        crop_y = max(0, (new_h - output_size) // 2)
        crop_r = crop_x + min(new_w, output_size)
        crop_b = crop_y + min(new_h, output_size)
        cropped = scaled.crop((crop_x, crop_y, crop_r, crop_b))
        canvas.paste(cropped, (max(0, paste_x), max(0, paste_y)))
    else:
        canvas.paste(scaled, (paste_x, paste_y))

    return canvas


def main():
    apply = "--apply" in sys.argv

    print("=" * 75)
    print("Mascot Normalization Script (diagonal-based)")
    print(f"Target diagonal: {TARGET_DIAGONAL}px on {CANVAS_SIZE}px canvas")
    print(f"Mode: {'APPLY' if apply else 'DRY RUN (add --apply to execute)'}")
    print("=" * 75)

    # Analyze base images from design-system
    ds_dir = os.path.join(ROOT, MASCOT_DIRS[0])
    scale_factors = {}

    print("\n--- Analysis ---")
    for agent in sorted(os.listdir(ds_dir)):
        agent_dir = os.path.join(ds_dir, agent)
        if not os.path.isdir(agent_dir):
            continue

        base_path = find_base_image(agent_dir)
        if not base_path:
            print(f"  {agent}: no base image found, skipping")
            continue

        img = Image.open(base_path).convert("RGBA")
        bbox = img.getbbox()
        if not bbox:
            continue

        cw = bbox[2] - bbox[0]
        ch = bbox[3] - bbox[1]
        diag = math.sqrt(cw**2 + ch**2)
        sf = TARGET_DIAGONAL / diag

        scale_factors[agent] = sf

        status = "OK" if 0.95 <= sf <= 1.05 else ("SHRINK" if sf < 1 else "GROW")
        print(
            f"  {agent:10s} | content: {cw:4d}x{ch:4d} | diag: {diag:.0f}px "
            f"| scale: {sf:.3f} ({status})"
        )

    sfs = list(scale_factors.values())
    print(f"\n  Scale range: {min(sfs):.3f} – {max(sfs):.3f} (spread {max(sfs)-min(sfs):.3f})")

    if not apply:
        print("\n  --- Post-normalization preview ---")
        for agent, sf in sorted(scale_factors.items()):
            agent_dir = os.path.join(ds_dir, agent)
            base_path = find_base_image(agent_dir)
            img = Image.open(base_path).convert("RGBA")
            bbox = img.getbbox()
            cw = bbox[2] - bbox[0]
            ch = bbox[3] - bbox[1]
            new_cw = int(cw * sf)
            new_ch = int(ch * sf)
            new_diag = math.sqrt(new_cw**2 + new_ch**2)
            print(f"  {agent:10s} → {new_cw:4d}x{new_ch:4d} | diag: {new_diag:.0f}px | fill: {new_cw/CANVAS_SIZE:.1%} x {new_ch/CANVAS_SIZE:.1%}")
        print("\nDry run complete. Run with --apply to process images.")
        return

    # Apply
    print("\n--- Processing ---")
    for mascot_dir_rel in MASCOT_DIRS:
        mascot_dir = os.path.join(ROOT, mascot_dir_rel)
        if not os.path.exists(mascot_dir):
            print(f"  Skipping {mascot_dir_rel} (not found)")
            continue

        print(f"\n  {mascot_dir_rel}/")

        for agent in sorted(os.listdir(mascot_dir)):
            agent_dir = os.path.join(mascot_dir, agent)
            if not os.path.isdir(agent_dir) or agent not in scale_factors:
                continue

            sf = scale_factors[agent]
            files = [f for f in os.listdir(agent_dir) if f.endswith(".png")]
            print(f"    {agent:10s} | scale: {sf:.3f} | {len(files)} files")

            for fname in sorted(files):
                fpath = os.path.join(agent_dir, fname)
                result = normalize_image(fpath, sf, CANVAS_SIZE)
                result.save(fpath, "PNG", optimize=True)
                print(f"      {fname}")

    print("\nDone!")


if __name__ == "__main__":
    main()
