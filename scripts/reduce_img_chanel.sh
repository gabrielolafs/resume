#!/bin/sh
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
IMG_DIR="$SCRIPT_DIR/../public/img/chanel"
MAGICK="$SCRIPT_DIR/../bin/magick"

if [ ! -x "$MAGICK" ] ; then
    echo "Error: ImageMagick binary not found: $MAGICK" >&2
    exit 1
fi

MAX_SIZE=25000

for file in "$IMG_DIR"/*; do
    [ -f "$file" ] || continue # Skip if not a regular file

    filename=$(basename "$file")
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
    
    output="${file%.*}.webp"
    
    [ -f "$output" ] && continue # Skip if webp already exists

    echo "Converting $file -> $output"

    quality=90

    while :; do
        "$MAGICK" "$file" -quality "$quality" "$output"

        size=$(wc -c < "$output")

        if [ "$size" -lt "$MAX_SIZE" ]; then
            echo "Done: $output ($size bytes, quality $quality)"
            break
        fi

        rm -f "$output"

        quality=$((quality - 5))

        if [ "$quality" -le 0 ]; then
            echo "Error: Could not reduce $file below $MAX_SIZE bytes" >&2
            break
        fi
    done
done
