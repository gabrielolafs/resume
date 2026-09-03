#!/bin/sh
#
# compress_glb.sh
#
# Simplifies (decimates) and Draco-compresses .glb files until each is under
# a target size. Works whether or not the source is already Draco compressed
# (gltf-transform decodes Draco automatically on load).
#
# Requirements:
#   npm install -g @gltf-transform/cli
#
# Usage:
#   ./compress_glb.sh [SRC_DIR] [OUT_DIR] [MAX_SIZE_KB]
#
#   SRC_DIR      Directory containing .glb files (default: ./models)
#   OUT_DIR      Directory to write compressed output (default: ./models_compressed)
#   MAX_SIZE_KB  Target max size in KB (default: 100)

set -euo pipefail

SRC_DIR="../public/scans"
OUT_DIR="../public/scans"
MAX_SIZE_KB="100"

RATIO_STEP=0.1
MIN_RATIO=0.05
DRACO_METHOD="sequential"   # slightly larger, but faster to decode

mkdir -p "$OUT_DIR"

command -v gltf-transform >/dev/null 2>&1 || {
  echo "ERROR: gltf-transform CLI not found."
  echo "Install it with: npm install -g @gltf-transform/cli"
  exit 1
}

shopt -s nullglob
files=("$SRC_DIR"/*.glb)
if [ ${#files[@]} -eq 0 ]; then
  echo "No .glb files found in $SRC_DIR"
  exit 0
fi

echo "Found ${#files[@]} file(s) in $SRC_DIR. Target: ${MAX_SIZE_KB}KB. Output: $OUT_DIR"
echo "----------------------------------------------------------------"

for file in "${files[@]}"; do
  fname=$(basename "$file")
  out="$OUT_DIR/$fname"
  work="$(mktemp --suffix=.glb)"

  orig_kb=$(( $(stat -c%s "$file") / 1024 ))
  echo "Processing $fname (${orig_kb}KB)..."

  ratio="1.0"
  cp "$file" "$work"
  size_kb=$orig_kb
  simplified=false

  while [ "$size_kb" -gt "$MAX_SIZE_KB" ]; do
    ratio=$(awk -v r="$ratio" -v step="$RATIO_STEP" 'BEGIN { printf "%.2f", r - step }')
    below_floor=$(awk -v r="$ratio" -v min="$MIN_RATIO" 'BEGIN { print (r < min) }')

    if [ "$below_floor" -eq 1 ]; then
      echo "  WARNING: reached minimum ratio ($MIN_RATIO) without hitting target size."
      break
    fi

    # Always simplify from the ORIGINAL file so quality loss doesn't compound
    gltf-transform simplify "$file" "$work" --ratio "$ratio" --error 0.001
    gltf-transform draco "$work" "$work" --method "$DRACO_METHOD"

    size_kb=$(( $(stat -c%s "$work") / 1024 ))
    simplified=true
    echo "  ratio=$ratio -> ${size_kb}KB"
  done

  # If we never needed to simplify, still make sure it's Draco compressed
  if [ "$simplified" = false ]; then
    if gltf-transform inspect "$work" 2>/dev/null | grep -qi "draco"; then
      echo "  Already under target and already Draco compressed."
    else
      echo "  Under target size, applying Draco compression..."
      gltf-transform draco "$work" "$work" --method "$DRACO_METHOD"
      size_kb=$(( $(stat -c%s "$work") / 1024 ))
    fi
  fi

  mv "$work" "$out"
  final_kb=$(( $(stat -c%s "$out") / 1024 ))

  status="OK"
  if [ "$final_kb" -gt "$MAX_SIZE_KB" ]; then
    status="STILL OVER LIMIT — consider a lower ratio floor or texture compression"
  fi

  echo "  -> ${fname}: ${orig_kb}KB -> ${final_kb}KB  [$status]"
  echo "----------------------------------------------------------------"
done

echo "Done. Compressed files are in: $OUT_DIR"
