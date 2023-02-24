#!/usr/bin/env bash

# Claire's statistics helper library, and API key generated from my account.
URL="https://api.zotero.org/groups/2547147/items"
API_KEY="OonF9kL3S2YayiBOnx8OyxDD"

curl -H "Zotero-API-Key: $API_KEY" $URL > items.json
