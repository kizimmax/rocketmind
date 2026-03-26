#!/usr/bin/env python3
"""
Normalize mascot images so all faces appear the same visual size.

Strategy:
1. Analyze each mascot's _base image to measure the "head" content height
2. Calculate a scale factor so all heads fill the same proportion of canvas
3. Apply that scale factor to ALL poses of each mascot
4. Re-center content on a uniform 2048x2048 canvas
5. Process both apps/design-system and apps/site directories

Usage:
  python3 scripts/normalize-mascots.py           # Dry run (analysis only)
  python3 scripts/normalize-mascots.py --apply   # Apply changes in-place
  python3 scripts/normalize-mascots.py --apply --backup  # Apply with backups
"""

import os
import sys
import shutil
from PIL import Image

# Config
CANVAS_SIZE = 2048
TARGET_FILL_HEIGHT = 0.75  # Target: base head fills 75% of canvas height
TARGET_CONTENT_HEIGHT = int(CANVAS_SIZE * TARGET_FILL_HEIGHT)  # 1536px

MASCOT_DIRS = [
    "apps/design-system/public/ai-mascots",
    "apps/site/public/ai-mascots",
]

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def find_base_image(agent_dir):
    """Find the base image for a mascot."""
    for f in os.listdir(agent_dir):
        if "base" in f.lower() and f.endswith(".png"):
            return os.path.join(agent_dir, f)
    return None


def get_content_bbox(img):
    """Get bounding box of non-transparent content."""
    rgba = img.convert("RGBA")
    return rgba.getbbox()


def analyze_mascot(agent_dir):
    """Analyze a mascot's base image and return scale info."""
    base_path = find_base_image(agent_dir)
    if not base_path:
        return None

    img = Image.open(base_path).convert("RGBA")
    bbox = get_content_bbox(img)
    if not bbox:
        return None

    content_h = bbox[3] - bbox[1]
    content_w = bbox[2] - bbox[0]
    canvas_w, canvas_h = img.size

    return {
        "base_path": base_path,
        "canvas_size": (canvas_w, canvas_h),
        "content_size": (content_w, content_h),
        "bbox": bbox,
        "fill_h": content_h / canvas_h,
    }


def normalize_image(img_path, scale_factor, output_size=CANVAS_SIZE):
    """
    Scale an image by scale_factor and center on output_size x output_size canvas.

    Returns the new PIL Image.
    """
    img = Image.open(img_path).convert("RGBA")
    orig_w, orig_h = img.size

    # Scale the image
    new_w = int(orig_w * scale_factor)
    new_h = int(orig_h * scale_factor)
    scaled = img.resize((new_w, new_h), Image.LANCZOS)

    # Create output canvas
    canvas = Image.new("RGBA", (output_size, output_size), (0, 0, 0, 0))

    # Center the scaled image on the canvas
    paste_x = (output_size - new_w) // 2
    paste_y = (output_size - new_h) // 2

    # If scaled image is larger than canvas, crop from center
    if new_w > output_size or new_h > output_size:
        crop_x = max(0, (new_w - output_size) // 2)
        crop_y = max(0, (new_h - output_size) // 2)
        crop_r = crop_x + min(new_w, output_size)
        crop_b = crop_y + min(new_h, output_size)
        cropped = scaled.crop((crop_x, crop_y, crop_r, crop_b))
        paste_x = max(0, paste_x)
        paste_y = max(0, paste_y)
        canvas.paste(cropped, (paste_x, paste_y))
    else:
        canvas.paste(scaled, (paste_x, paste_y))

    return canvas


def main():
    apply = "--apply" in sys.argv
    backup = "--backup" in sys.argv

    print("=" * 70)
    print("Mascot Normalization Script")
    print(f"Target: base head height = {TARGET_FILL_HEIGHT:.0%} of {CANVAS_SIZE}px canvas ({TARGET_CONTENT_HEIGHT}px)")
    print(f"Mode: {'APPLY' if apply else 'DRY RUN (add --apply to execute)'}")
    print("=" * 70)

    # First pass: analyze base images from design-system to compute scale factors
    ds_dir = os.path.join(ROOT, MASCOT_DIRS[0])
    scale_factors = {}

    print("\n--- Analysis ---")
    for agent in sorted(os.listdir(ds_dir)):
        agent_dir = os.path.join(ds_dir, agent)
        if not os.path.isdir(agent_dir):
            continue

        info = analyze_mascot(agent_dir)
        if not info:
            print(f"  {agent}: no base image found, skipping")
            continue

        current_h = info["content_size"][1]
        canvas_h = info["canvas_size"][1]

        # Scale factor: how much to scale so content_h -> TARGET_CONTENT_HEIGHT
        # But we need to account for different canvas sizes (Nick is 1024)
        # First normalize to 2048 canvas, then apply target
        canvas_scale = CANVAS_SIZE / canvas_h  # 1.0 for 2048, 2.0 for 1024
        effective_h = current_h * canvas_scale  # Content height at 2048 scale
        sf = TARGET_CONTENT_HEIGHT / effective_h

        scale_factors[agent] = sf

        status = "OK" if 0.95 <= sf <= 1.05 else ("SHRINK" if sf < 1 else "GROW")
        print(
            f"  {agent:10s} | head: {current_h}px ({info['fill_h']:.0%} of {canvas_h}) "
            f"| effective: {effective_h:.0f}px | scale: {sf:.3f} ({status})"
        )

    print(f"\n  Scale factor range: {min(scale_factors.values()):.3f} - {max(scale_factors.values()):.3f}")

    if not apply:
        print("\nDry run complete. Run with --apply to process images.")
        return

    # Second pass: apply normalization to all images in all directories
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
            canvas_scale = 1.0  # Will compute per-image based on actual size

            files = [f for f in os.listdir(agent_dir) if f.endswith(".png")]
            print(f"    {agent:10s} | scale: {sf:.3f} | {len(files)} files")

            for fname in sorted(files):
                fpath = os.path.join(agent_dir, fname)

                # Check actual image size for per-image canvas_scale
                img = Image.open(fpath)
                img_canvas = img.size[0]
                per_image_canvas_scale = CANVAS_SIZE / img_canvas
                total_scale = sf * per_image_canvas_scale

                if backup:
                    backup_path = fpath + ".bak"
                    if not os.path.exists(backup_path):
                        shutil.copy2(fpath, backup_path)

                result = normalize_image(fpath, total_scale, CANVAS_SIZE)
                result.save(fpath, "PNG", optimize=True)
                print(f"      {fname} ({img_canvas}px -> {CANVAS_SIZE}px, scale {total_scale:.3f})")

    print("\nDone!")


if __name__ == "__main__":
    main()
