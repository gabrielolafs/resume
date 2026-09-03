#!/bin/sh

SRC_DIR="../public/scans"
OUT_DIR="../public/scans"
MAX_SIZE_KB=100

RATIO_STEP=0.1
MIN_RATIO=0.05
DRACO_METHOD="sequential"   # slightly larger, but faster to decode

command -v gltf-transform >/dev/null 2>&1 || {
    echo "ERROR: gltf-transform CLI not found." >&2
    echo "Install it with: npm install -g @gltf-transform/cli" >&2
    exit 1
}

mkdir -p "$OUT_DIR"

found=0

for file in "$SRC_DIR"/*.glb; do
    [ -f "$file" ] || continue
    found=1

    fname=$(basename "$file")
    out="$OUT_DIR/$fname"
    work="$OUT_DIR/.${fname}.tmp"

    orig_size=$(wc -c < "$file" | tr -d ' ')
    orig_kb=$((orig_size / 1024))

    echo "----------------------------------------------------------------"
    echo "Processing $fname (${orig_kb}KB)..."

    cp "$file" "$work"
    size_kb=$orig_kb
    ratio="1.0"
    simplified=0

    while [ "$size_kb" -gt "$MAX_SIZE_KB" ]; do
        ratio=$(awk -v r="$ratio" -v step="$RATIO_STEP" 'BEGIN { printf "%.2f", r - step }')
        below_floor=$(awk -v r="$ratio" -v min="$MIN_RATIO" 'BEGIN { print (r < min) ? 1 : 0 }')

        if [ "$below_floor" -eq 1 ]; then
            echo "  WARNING: reached minimum ratio ($MIN_RATIO) without hitting target size." >&2
            break
        fi

        # Always simplify from the ORIGINAL file so quality loss doesn't compound
        gltf-transform simplify "$file" "$work" --ratio "$ratio" --error 0.001
        gltf-transform draco "$work" "$work" --method "$DRACO_METHOD"

        size=$(wc -c < "$work" | tr -d ' ')
        size_kb=$((size / 1024))
        simplified=1
        echo "  ratio=$ratio -> ${size_kb}KB"
    done

    if [ "$simplified" -eq 0 ]; then
        if gltf-transform inspect "$work" 2>/dev/null | grep -qi "draco"; then
            echo "  Already under target and already Draco compressed."
        else
            echo "  Under target size, applying Draco compression..."
            gltf-transform draco "$work" "$work" --method "$DRACO_METHOD"
        fi
    fi

    mv "$work" "$out"
    final_size=$(wc -c < "$out" | tr -d ' ')
    final_kb=$((final_size / 1024))

    if [ "$final_kb" -gt "$MAX_SIZE_KB" ]; then
        status="STILL OVER LIMIT — consider a lower ratio floor or texture compression"
    else
        status="OK"
    fi

    echo "  -> ${fname}: ${orig_kb}KB -> ${final_kb}KB  [$status]"
done

if [ "$found" -eq 0 ]; then
    echo "No .glb files found in $SRC_DIR"
fi

echo "----------------------------------------------------------------"
echo "Done. Compressed files are in: $OUT_DIR"
