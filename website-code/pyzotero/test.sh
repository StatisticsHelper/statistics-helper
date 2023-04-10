#!/usr/bin/env bash

# Set variables
URL="https://api.zotero.org/groups/2547147/items"
API_KEY="W2NMV5HBdkanpmNaPrsF4G7b"
ITEMS_PER_PAGE=100
ITEMS_TOTAL=$(curl -s -H "Zotero-API-Key: $API_KEY" "${URL}?limit=1" | awk -F':' '{print $2}' | tr -d ',}')
PAGES=$((ITEMS_TOTAL / ITEMS_PER_PAGE + 1))

# Loop through each page and download items
for ((i=0; i<$PAGES; i++))
do
    curl -s -H "Zotero-API-Key: $API_KEY" "${URL}?start=${i}00&limit=${ITEMS_PER_PAGE}" >> items.json
done

# Check if items.json is not empty
if [ -s items.json ]; then
    echo "Items downloaded successfully."
else
    echo "No items were downloaded."
fi
