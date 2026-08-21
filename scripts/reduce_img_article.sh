#!/bin/sh
#!/bin/sh
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
IMG_DIR="$SCRIPT_DIR/../public/img/article"

if ! command -v magick >/dev/null 2>&1; then
    echo "Error: 'magick' command not found. Install ImageMagick and try again." >&2
    exit 1
fi

for file in "$IMG_DIR"/*; do
    # Skip if not a regular file
    [ -f "$file" ] || continue
    filename=$(basename "$file")
    # Get extension
    ext="${filename##*.}"
    ext=$(printf "%s" "$ext" | tr '[:upper:]' '[:lower:]')
    # Only process jpg/jpeg/png
    case "$ext" in
        jpg|jpeg|png)
            ;;
        *)
            continue
            ;;
    esac
    # Output filename with .webp extension
    output="${file%.*}.webp"
    # Skip if webp already exists
    [ -f "$output" ] && continue
    echo "Converting $file -> $output"
    magick "$file" -define webp:target-size=250000 "$output"
done
