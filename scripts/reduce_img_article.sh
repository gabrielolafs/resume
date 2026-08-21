#!/bin/sh

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
IMG_DIR="$SCRIPT_DIR/../public/img/article"
MAGICK="$SCRIPT_DIR/../bin/magick"

if [ ! -x "$MAGICK" ]; then
    echo "Error: ImageMagick binary not found: $MAGICK" >&2
    exit 1
fi

MAX_SIZE=250000

for file in "$IMG_DIR"/*; do
    [ -f "$file" ] || continue

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
    temp="${output}.tmp"

    echo "Converting $file -> $output"

    quality=90

    while [ "$quality" -gt 0 ]; do
        rm -f "$temp"

        "$MAGICK" "$file" \
            -quality "$quality" \
            "$temp"

        if [ ! -f "$temp" ]; then
            echo "Error: ImageMagick failed for $file" >&2
            break
        fi

        size=$(wc -c < "$temp" | tr -d ' ')

        echo "  quality=$quality size=${size} bytes"

        if [ "$size" -lt "$MAX_SIZE" ]; then
            mv "$temp" "$output"
            echo "Done: $output ($size bytes, quality $quality)"
            break
        fi

        quality=$((quality - 5))
    done

    if [ "$quality" -le 0 ]; then
        rm -f "$temp"
        while [ "$quality" -gt 0 ]; do
            rm -f "$temp"

            "$MAGICK" "$file" \
                -quality "$quality" \
                "$temp"

            if [ ! -f "$temp" ]; then
                echo "Error: ImageMagick failed for $file" >&2
                break
            fi

            size=$(wc -c < "$temp" | tr -d ' ')

            echo "  quality=$quality size=${size} bytes"

            if [ "$size" -lt "$MAX_SIZE" ]; then
                mv "$temp" "$output"
                echo "Done: $output ($size bytes, quality $quality)"
                break
            fi

            quality=$((quality - 1))
        done
        echo "Error: Could not reduce $file below $MAX_SIZE bytes" >&2
    fi
done
