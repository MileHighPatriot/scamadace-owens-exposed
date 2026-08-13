#!/usr/bin/env python3
"""Render assets/og-image.png (1200x630) for social crawlers."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
ROOT = Path(__file__).resolve().parents[1]


def first_font(candidates, size):
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def main():
    img = Image.new("RGB", (W, H), "#08090c")
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse((-200, -280, 700, 420), fill=(212, 174, 58, 28))
    od.ellipse((700, -200, 1400, 420), fill=(91, 159, 212, 22))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    draw.rectangle([0, 0, 10, H], fill="#d4ae3a")
    draw.rectangle([36, 36, W - 36, H - 36], outline="#d4ae3a", width=2)
    draw.rectangle([48, 48, 70, 70], outline="#d4ae3a", width=2)
    draw.rectangle([W - 70, H - 70, W - 48, H - 48], outline="#d4ae3a", width=2)

    serif = first_font(
        [
            "/usr/share/fonts/truetype/noto/NotoSerif-Bold.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
        ],
        58,
    )
    sans = first_font(
        [
            "/usr/share/fonts/truetype/inter/Inter-Medium.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ],
        22,
    )
    sub = first_font(
        [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ],
        26,
    )
    foot = first_font(
        [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ],
        20,
    )

    draw.text((80, 168), "INVESTIGATIVE ARCHIVE", fill="#d4ae3a", font=sans)
    draw.text((80, 230), "Scamdace Owens Exposed", fill="#eef3f8", font=serif)
    draw.text(
        (80, 320),
        "Candace Owens claims about Charlie Kirk’s assassination",
        fill="#9aa8b8",
        font=sub,
    )
    draw.text(
        (80, 358),
        "documented, then dismantled with evidence.",
        fill="#9aa8b8",
        font=sub,
    )
    draw.text(
        (80, 510),
        "MileHigh Patriot  ·  @America1st5280  ·  Evidence-tiered catalog",
        fill="#6b7a8c",
        font=foot,
    )

    out = ROOT / "assets" / "og-image.png"
    img.save(out, "PNG", optimize=True)
    print("wrote", out)


if __name__ == "__main__":
    main()
