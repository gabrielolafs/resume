#!/bin/sh

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
IMG_DIR="$SCRIPT_DIR/../public/img/chanel"
MAGICK="$SCRIPT_DIR/../bin/magick"

MAX_SIZE=20000

if [ ! -x "$MAGICK" ]; then
    echo "Error: ImageMagick binary not found: $MAGICK" >&2
    exit 1
fi

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

    echo
    echo "========================================"
    echo "Converting: $filename"
    echo "========================================"

    # Get original dimensions.
    dimensions=$("$MAGICK" "$file" -format '%w %h' info:)

    if [ -z "$dimensions" ]; then
        echo "Error: Could not determine dimensions for $file" >&2
        continue
    fi

    orig_w=$(printf "%s" "$dimensions" | awk '{print $1}')
    orig_h=$(printf "%s" "$dimensions" | awk '{print $2}')

    echo "Original: ${orig_w}x${orig_h}"

    # Start at the original dimensions.
    low=1
    high=100
    best_scale=0
    best_quality=0
    best_size=0

    # Determine the largest scale that can possibly produce an image under 20 KB.
    while [ "$low" -le "$high" ]; do
        scale=$(( (low + high) / 2 ))

        width=$((orig_w * scale / 100))
        height=$((orig_h * scale / 100))

        [ "$width" -lt 1 ] && width=1
        [ "$height" -lt 1 ] && height=1

        rm -f "$temp"

        "$MAGICK" "$file" \
            -resize "${width}x${height}" \
            -quality 0 \
            "webp:$temp"

        if [ ! -f "$temp" ]; then
            echo "Error: ImageMagick failed for $file" >&2
            break
        fi

        size=$(wc -c < "$temp" | tr -d ' ')

        echo "  scale=${scale}% (${width}x${height}) quality=0 size=${size}"

        if [ "$size" -le "$MAX_SIZE" ]; then
            best_scale=$scale
            low=$((scale + 1))
        else
            high=$((scale - 1))
        fi
    done

    if [ "$best_scale" -eq 0 ]; then
        echo "Error: Could not get image below ${MAX_SIZE} bytes" >&2
        rm -f "$temp"
        continue
    fi

    # Binary-search for the highest quality at those dimensions.
    
    width=$((orig_w * best_scale / 100))
    height=$((orig_h * best_scale / 100))

    low=0
    high=100
    best_quality=0
    best_size=0

    echo "Finding highest quality at ${width}x${height}..."

    while [ "$low" -le "$high" ]; do
        quality=$(( (low + high) / 2 ))

        rm -f "$temp"

        "$MAGICK" "$file" \
            -resize "${width}x${height}" \
            -quality "$quality" \
            "webp:$temp"

        if [ ! -f "$temp" ]; then
            echo "Error: ImageMagick failed for $file" >&2
            break
        fi

        size=$(wc -c < "$temp" | tr -d ' ')

        echo "  quality=$quality size=${size} bytes"

        if [ "$size" -le "$MAX_SIZE" ]; then
            best_quality=$quality
            best_size=$size
            low=$((quality + 1))
        else
            high=$((quality - 1))
        fi
    done

    #
    # Final encode using the best dimensions + quality.
    #
    rm -f "$temp"

    "$MAGICK" "$file" \
        -resize "${width}x${height}" \
        -quality "$best_quality" \
        "webp:$temp"

    if [ ! -f "$temp" ]; then
        echo "Error: Final ImageMagick conversion failed for $file" >&2
        continue
    fi

    final_size=$(wc -c < "$temp" | tr -d ' ')

    # Safety check
    if [ "$final_size" -le "$MAX_SIZE" ]; then
        mv "$temp" "$output"

        echo
        echo "DONE"
        echo "  Output:  $output"
        echo "  Size:    ${final_size} bytes"
        echo "  Quality: ${best_quality}"
        echo "  Image:   ${width}x${height}"
    else
        rm -f "$temp"
        echo "Error: Final image is ${final_size} bytes, over limit." >&2
    fi
done
