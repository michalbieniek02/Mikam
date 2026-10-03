from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "assets" / "Manrope-ExtraBold.ttf"
OUTPUT = ROOT / "mikam-logo.png"

canvas = Image.new("RGBA", (1600, 420), (0, 0, 0, 0))
draw = ImageDraw.Draw(canvas)
word_font = ImageFont.truetype(str(FONT), 190)
registered_font = ImageFont.truetype(str(FONT), 63)

x = 30
y = 120
tracking = -21
for character in "MIKAM":
    draw.text((x, y), character, font=word_font, fill=(244, 241, 234, 255), anchor="la")
    x += draw.textlength(character, font=word_font) + tracking

draw.text((x + 16, 52), "®", font=registered_font, fill=(223, 255, 0, 255), anchor="la")

bounds = canvas.getbbox()
if bounds is None:
    raise RuntimeError("Logo render is empty")

padding = 24
logo = canvas.crop(bounds)
result = Image.new(
    "RGBA",
    (logo.width + padding * 2, logo.height + padding * 2),
    (0, 0, 0, 0),
)
result.alpha_composite(logo, (padding, padding))
result.save(OUTPUT, "PNG", optimize=True)
