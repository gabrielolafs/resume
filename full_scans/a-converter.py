# Should be run at deployment, for now this will be run on each of the folders. This is currently a massive issue that 
# needs to get fixed before implimenting into the development pipeline. This program:

# Goes through the .mtl file line by line, and any line containing .png:
#   scales down to 512 x 512 px 
#   converts to webp
#   changes that line in the mtl file to  

""" 
usage:

python3 a-converter.py ./../public/scans/{}
"""

import sys
from pathlib import Path
from PIL import Image

MAX_SIZE = 512
QUALITY = 80

def convert_to_webp(png_path):
    webp_path = png_path.with_suffix(".webp")
    with Image.open(png_path) as img:
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA")
        w, h = img.size
        scale = min(1.0, MAX_SIZE / max(w, h))
        if scale < 1.0:
            img = img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        img.save(webp_path, "WEBP", quality=QUALITY)
    png_path.unlink()


def process_mtl(mtl_path):
    lines = mtl_path.read_text().splitlines(keepends=True)
    new_lines = []
    for line in lines:
        if ".png" in line.lower():
            for word in line.split():
                if word.lower().endswith(".png"):
                    png_path = mtl_path.parent / word
                    if png_path.exists():
                        convert_to_webp(png_path)
                        new_word = word[:-4] + ".webp"  # keep subfolder part, just swap extension
                        line = line.replace(word, new_word)
                        print(f"  {word} -> {new_word}")
        new_lines.append(line)
    mtl_path.write_text("".join(new_lines))


def main():
    folder = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
    for mtl_path in folder.rglob("*.mtl"):
        print(f"{mtl_path}")
        process_mtl(mtl_path)


if __name__ == "__main__":
    main()
