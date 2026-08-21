#!/bin/sh
# Replace .png / .jpg / .jpeg extension references with .webp in every
# markdown file under a directory (recursive).

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR="${1:-$SCRIPT_DIR/../src/pages/articles}"

if ! command -v sed >/dev/null 2>&1; then
    echo "Error: 'sed' command not found." >&2
    exit 1
fi

find "$ROOT_DIR" \
    -type d \( -name node_modules -o -name .git \) -prune -o \
    -type f -name '*.md' -exec sh -c '
        for file do
            if grep -Eqi "\.(png|jpe?g)\b" "$file"; then
                echo "Updating $file"
                sed -E -i "s/\.(png|jpe?g)\b/.webp/gI" "$file"
            fi
        done
    ' sh {} +

echo "Done."
