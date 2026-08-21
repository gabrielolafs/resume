#!/bin/sh

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
IMG_DIR="$SCRIPT_DIR/../public/img/chanel"
MAGICK="$SCRIPT_DIR/../bin/magick"

if [ ! -x "$MAGICK" ]; then
    echo "Error: ImageMagick binary not found: $MAGICK" >&2
    exit 1
fi

MAX_SIZE=20000

for file in "$IMG_DIR"/*; do
    [ -f "$file" ] || continue

    filename=$(basename "$file")
    ext="${filename##*.}"
    ext=$(printf "%s" "$ext" | tr '[:upper:]' '[:lower:]')

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

    low=0
    high=100
    best_quality=-1
    best_size=0

    while [ "$low" -le "$high" ]; do
        quality=$(( (low + high) / 2 ))

        rm -f "$temp"

        "$MAGICK" "$file" \
            -quality "$quality" \
            "webp:$temp"

        if [ ! -f "$temp" ]; then
            echo "Error: ImageMagick failed for $file" >&2
            break
        fi

        size=$(wc -c < "$temp" | tr -d ' ')

        echo "  quality=$quality size=${size} bytes"

        if [ "$size" -le "$MAX_SIZE" ]; then
            # This quality fits, so try a higher quality.
            best_quality=$quality
            best_size=$size
            low=$((quality + 1))
        else
            # Too large, so try a lower quality.
            high=$((quality - 1))
        fi
    done

    if [ "$best_quality" -ge 0 ]; then
        rm -f "$temp"

        "$MAGICK" "$file" \
            -quality "$best_quality" \
            "webp:$temp"

        mv "$temp" "$output"

        echo "Done: $output"
        echo "  quality=$best_quality"
        echo "  size=$best_size bytes"
    else
        rm -f "$temp"
        echo "Error: Could not create $file under $MAX_SIZE bytes" >&2
    fi
done
