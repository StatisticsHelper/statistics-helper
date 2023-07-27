#!/usr/bin/env bash

# Set variables
URL="https://api.zotero.org/groups/2547147/items"
API_KEY="W2NMV5HBdkanpmNaPrsF4G7b"
# you can't make it more than 100 - hard limit!
ITEMS_PER_PAGE=100
PAGES=30

# Create an empty array to store all the requests
all_requests=()

# Loop through requests and store them in the array
for ((PAGE=0; PAGE < PAGES; PAGE++)); do

    # request the items and store the response
    response=$(curl -s -H "Zotero-API-Key: $API_KEY" "$URL?limit=$ITEMS_PER_PAGE&start=$(( (PAGE) * ITEMS_PER_PAGE ))")

    # Check if the response is empty
    if [ ${#response[@]} -eq 0 ]  || [ "${response[*]}" = "[]" ]; then
        #do nothing
        :
    else
        # modify response (remove [ ] and add ,)
        response="${response#\[}"
        response="${response%\]}"
        response="$response,"
        # add the response to the all_requests array
        all_requests+=("${response[@]}")
    fi
done

# Print all_requests

# 1. get size (different from PAGES because some responses are empty)
all_requests_size=${#all_requests[@]}

# 2. remove `,` from the end of the array
all_requests[all_requests_size - 1]="${all_requests[all_requests_size - 1]%\,}"

# 3. empty the output file
# use absolute path because using relative path means you'll have to change working directory when
#   you run the script
file_path="C:\Users\ad17a\Desktop\oulib-statistics\github-repo-local\website-code\pyzotero\items.json"
> "$file_path"

# 4. echo the array
    # each element in the array is a response (containing <=100 items)
echo "[" >> "$file_path"
for ((id=0; id < all_requests_size; id++)); do
    echo ${all_requests[id]} >> "$file_path"
done
echo "]" >> "$file_path"