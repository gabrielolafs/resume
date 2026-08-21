#!/bin/sh

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
JSON_FILE="$SCRIPT_DIR/../src/data/channels-with-order.json"

if [ ! -f "$JSON_FILE" ]; then
    echo "Error: $JSON_FILE not found" >&2
    exit 1
fi

sed -i.bak -E \
    's#(/img/chanel/[^"]+)\.(jpg|jpeg|png)#\1.webp#g' \
    "$JSON_FILE"

rm -f "$JSON_FILE.bak"

echo "Updated image paths in $JSON_FILE"
