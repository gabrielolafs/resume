#!/bin/sh
# Switch .png / .jpg / .jpeg to .webp on the `imgPaths:` line of the
# frontmatter in every markdown file under a directory (recursive).

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR="${1:-$SCRIPT_DIR/../src/pages/articles}"

if [ ! -d "$ROOT_DIR" ]; then
    echo "Error: $ROOT_DIR not found" >&2
    exit 1
fi

find "$ROOT_DIR" \
    -type d \( -name node_modules -o -name .git \) -prune -o \
    -type f -name '*.md' -print | while IFS= read -r file; do

    # Only process files that actually start with a frontmatter block
    first_line=$(head -n 1 "$file" | tr -d '\r')
    [ "$first_line" = "---" ] || continue

    tmp="$file.tmp"

    # Range: from line 2 to the closing '---'; only the imgPaths line is edited
    sed -E '2,/^---[[:space:]]*$/ { /^imgPaths:/ s#\.([Jj][Pp][Ee]?[Gg]|[Pp][Nn][Gg])#.webp#g; }' \
        "$file" > "$tmp"

    if cmp -s "$file" "$tmp"; then
        rm -f "$tmp"
    else
        cat "$tmp" > "$file"
        rm -f "$tmp"
        echo "Updated $file"
    fi
done

echo "Done."